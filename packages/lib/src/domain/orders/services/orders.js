import { Product } from "../../products/services";
import OrdersRepository from "../repositories/orders";
import { Users } from "../../users/services";
import { AuthToken } from "../../users/services";
import { Store, UserStores } from "../../stores/services";
import { getAdapter } from "../../../boot/loaders/adapters";
import { getTransaction, getDatabase } from "../../../db";
import { DELIVERY_STATUSES } from "../constants";
import { adminFilters } from "../utils";
import { customAlphabet } from 'nanoid';
import BaseUtilityService from "./base.utility";

class OrderService extends BaseUtilityService {
  constructor() {
    super();
    this.ordersRepository = new OrdersRepository({ models: getDatabase() });
    this.productService = new Product();
    this.usersService = new Users();
    this.authTokenService = new AuthToken();
    this.storesService = new Store();
    this.userStoresService = new UserStores();
  }

  async getProductIdsWithMostOrders({ storeId, limit = 10 }) {
    const productIdsWithMostOrders = await this.ordersRepository.getProductIdsWithMostOrders({ storeId, limit });
    return productIdsWithMostOrders;
  }

  async fetchAll({storeId, userId, admin, textSearchType, search, deliveryStatus, filters}) {
    return this.ordersRepository.fetchAll({storeId, userId, admin, textSearchType, search, deliveryStatus, filters});
  }

  async cancel({referenceIds, storeId, customerId, currentUser, storeSupport}) {
    const transaction = await getTransaction();
    const user = await this.usersService.fetchById(customerId);
    const orders = await this.ordersRepository.cancel({referenceIds, storeId, currentUser, user, storeSupport, transaction});
    await this.productService.updateStock({products: orders, transaction, operation: '+'});
    await transaction.commit();

    const EventBus = getAdapter('eventBus');

    EventBus.emit('order.cancelled', {
      customer: user,
      currentUser,
      orders,
    });
  }

  async updateProcess({storeId, customerId, referenceId, storeSupport, ...updates}) {
    const user = await this.usersService.fetchById(customerId);
    await this.ordersRepository.update({referenceId, storeId}, updates);

    if (updates.deliveryStatus !== undefined) {
      const emailService = getAdapter('email');

      await emailService.send({
        to: user.email,
        subject: 'Order updated',
        html: `
          Hey ${user.name.split(' ')[0]},
  
          <p>Your order with referrence ID: <strong>${referenceId}</strong> is in <strong>${DELIVERY_STATUSES.find(d => d.value === updates.deliveryStatus).label}</strong></p>
          <p>We're always here. You may get in touch by replying to this email</p>
  
          <p>Hope to see you again!</p>
        `,
      });
    }
  }

  async update(clause, updates) {
    await this.ordersRepository.update(clause, updates);
  }

  async getOrderFilters() {
    return adminFilters;
  }

  async processCheckout({
    amount, 
    name, 
    mobile, 
    email, 
    address, 
    landmark, 
    otp,
    pincode, 
    storeId, 
    products, 
    storeName,
    storeSupport,
    paymentMode, 
    storeSettings
  }) {
    try {
      let [productsData, user] = await Promise.all([
        this.productService.fetchByIds(products.map(({id}) => id)),
        this.usersService.findUser({mobile, role: 'customer', active: true, deletedAt: null})
      ]);

      if (productsData.length !== products.length) return {itemRemoved: true};

      let userStore = null;

      if (user) {
        [userStore] = await this.userStoresService.findForUser(user.id, storeId);
      }

      for (const product of products) {
        const realProduct = productsData.find(({id}) => id === Number(product.id));
        let realStock = realProduct.stock;
        let outStock = realStock === 0;
        let stockChanged = product.quantity > realStock;
  
        if (product.variations && product.variations.length) {
          var vairationGroup = this.productService.getVariationGroupBySelection(
            realProduct.productVariationStocks, product.variations
          );

          product.productVariationStockId = vairationGroup[0].id;
          realStock = vairationGroup[0].stock || realStock;
          outStock = realStock === 0;
          stockChanged = product.quantity > realStock;
          product.price = vairationGroup[0].price < 1 ? product.price: vairationGroup[0].price;
        }
  
        if (outStock || stockChanged) return {outStock, stockChanged};
      }

        const paymentGateway = getAdapter('paymentGateway');

        let promises = [];
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13);
        const cartReferenceId = nanoid();
    
        const isCod = paymentMode === 'cod';

        if (isCod) {
          promises = [
            this.productService.updateStock({products}),
          ];
        } else {
          const successUrl = `${process.env.CLIENT_URL}/orders?source=checkout`;
          const cancelUrl = `${process.env.CLIENT_URL}/cart`;
          promises.push(paymentGateway.createOrder({ 
            amount,
            products,
            cartReferenceId,
            storeId,
            successUrl,
            cancelUrl,
          }));
        }

        if (!userStore) {
          if (!user) {  
            user = await this.usersService.create({
              name,
              mobile,
              email,  
              role: 'customer'
            });
          }
          
          this.userStoresService.create({
            userId: user.id,
            storeId,
          })
        } else {
          const userDetails = {
            email, 
            address, 
            landmark, 
            pincode, 
          }
          
          const updates = Object.keys(userDetails).reduce((updates, key) => {
            if (user[key] !== userDetails[key]) updates[key] = userDetails[key];
            return updates;
          }, {});
    
          if (Object.keys(updates).length) {
            this.usersService.updateById(user.id, updates);
          }

          user = { ...user, ...userDetails };
        }

      let [orderSessionResponse = {}] = await Promise.all(promises);

      const { tax = {}, otherCharges = {} } = storeSettings || {};
  
      const orderEntries = products.map((product) => ({
        productId: product.id,
        amountPaid: isCod ? 0 : amount,
        price: product.price * product.quantity,
        quantity: product.quantity,
        amount: this.makeTotal(products, storeSettings),
        charges: {
          tax,
          otherCharges,
        },
        cartReferenceId,
        variations: product.variations,
        storeId,
        productVariationStockId: product.productVariationStockId,
        source: 'store',
        referenceId: nanoid(11),
        status: 'order_confirmed',
        internalStatus: isCod ? 'order_confirmed' : 'checkout_initiated',
        deliveryStatus: 0,
        userId: user.id,
        paymentMode,
      }));

      const orders = await this.ordersRepository.create(orderEntries);

      const token = await this.authTokenService.create(
        { payload: {userId: user.id, role: 'customer', storeId, mobile},
          userId: user.id,
        }
      );

      user.authToken = token;

      if (isCod) {
        await this.sendOrderMail({
          store,
          user,
          cartReferenceId,
          orderDate: new Date().toLocaleDateString(),
          items: products.map((product) => ({
            name: product.name,
          })),
          subTotal: this.makeTotal(products, storeSettings),
          shipping: 0,
          tax: 0,
          total: amount,
          shippingAddress: address,
          orderNote: '',
          orderUrl: `${process.env.CLIENT_URL}/orders?source=checkout`,
        });
      }

      return {
        paymentOrder: orderSessionResponse.data,
        paymentGateway: paymentMode === 'cod' ? 'cod' : paymentGateway.name,
        amount,
        orderIds: orders.map(order => order.get({plain:true}).id),
        user,
        paymentMode
      };
    } catch (error) {
      throw error;
    }
  }

  async sendOrderMail({
    store,
    user,
    cartReferenceId,
    orderDate,
    items,
    subTotal,
    shipping,
    tax,
    total,
    shippingAddress,
    orderNote,
    orderUrl,
  }) {
    try {
      const emailService = getAdapter('email');
      await emailService.send({
        to: user.email,
        subject: 'Thank you for your order!',
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f6f6; padding:20px;">
            <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:6px; overflow:hidden;">

              <!-- Header -->
              <div style="background:#222; padding:20px; text-align:center;">
                ${
                  store.logo ? `
                    <img
                      src="${store.logo}"
                      alt="Store Logo"
                      style="width:140px; margin-bottom:10px;"
                    />
                  ` : `<h1 style="color:#ffffff; margin:0;">${store.name}</h1>`
                }
                <h2 style="color:#ffffff; margin:0;">Order Confirmation</h2>
              </div>

              <!-- Greeting -->
              <div style="padding:20px;">
                <p>Hey ${user.name.split(' ')[0]},</p>
                <p>
                  Thank you for your purchase! Your order has been successfully placed.
                </p>
              </div>

              <!-- Order Info -->
              <div style="padding:20px; background:#f9f9f9;">
                <p><strong>Order ID:</strong> ${cartReferenceId}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
              </div>

              <!-- Items -->
              <div style="padding:20px;">
                <h2 style="margin-bottom:15px;">Order Items</h2>

                ${items
                  .map(
                    (item) => `
                    <div style="display:flex; gap:12px; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #eee;">
                      <img
                        src="${item.image}"
                        alt="${item.name}"
                        style="width:80px; height:80px; object-fit:cover; border-radius:6px;"
                      />
                      <div>
                        <p style="margin:0 0 6px 0; font-weight:bold;">${item.name}</p>
                        <p style="margin:0 0 4px 0;">Quantity: ${item.quantity}</p>
                        <p style="margin:0;">Price: $${item.price}</p>
                      </div>
                    </div>
                  `
                  )
                  .join('')}
              </div>

              <!-- Pricing -->
              <div style="padding:20px; background:#f9f9f9;">
                <p>Subtotal: <strong>$${subTotal}</strong></p>
                <p>Shipping: <strong>$${shipping}</strong></p>
                <p>Tax: <strong>$${tax}</strong></p>
                <p style="font-size:18px;">
                  Total: <strong>$${total}</strong>
                </p>
              </div>

              <!-- Shipping Address -->
              <div style="padding:20px;">
                <h3>Shipping Address</h3>
                <p style="white-space:pre-line;">${shippingAddress}</p>
              </div>

              ${
                orderNote
                  ? `
                <div style="padding:20px; background:#fff8e1;">
                  <p><strong>Order Note:</strong> ${orderNote}</p>
                </div>
              `
                  : ''
              }

              <!-- CTA -->
              <div style="padding:30px; text-align:center;">
                <a
                  href="${orderUrl}"
                  style="background:#007bff; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:4px; font-weight:bold;"
                >
                  View Your Order
                </a>
              </div>

              <!-- Footer -->
              <div style="padding:20px; text-align:center; color:#777; font-size:12px;">
                <p>Hope to see you again!</p>
              </div>

            </div>
          </div>
        `,
      });
    } catch (error) {
      throw error;
    }
  }

  async processOrder({
    status,
    storeId,
    cartReferenceId,
    metaData = {},
    isVerified = true
  }) {
    try{
      // const orders = await this.ordersRepository.find({
      //   where: {
      //     cartReferenceId,
      //     storeId
      //   },
      //   include: [
      //     {
      //       model: models.Product,
      //       attributes: ['id', 'name', 'images', 'price'],
      //       include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }, required: false }]
      //     },
      //     {
      //       model: models.User,
      //       attributes: ['id', 'email', 'name', 'address']
      //     }
      //   ]
      // });

      let orders = await this.ordersRepository.find({
        cartReferenceId,
        storeId
      });
  
      if (!orders || !orders.length) {
        throw { status: 404, msgText: 'Orders not found for cartReferenceId', error: new Error() };
      }

      const [orderProducts, orderUsers] = await Promise.all([
        this.productService.fetchByIds(orders.map((order) => order.productId)), 
        this.usersService.fetchById(orders.map((order) => order.userId))
      ]);

      orders = this.ordersRepository.hydrateRelation({
        parentList: orders,
        childList: [{
          parentForeignKey: 'productId',
          childKey: 'id',
          as: 'products',
          items: orderProducts
        }, {
          parentForeignKey: 'userId',
          childKey: 'id',
          as: 'user',
          items: orderUsers
        }],
      });

      console.log('orders => ', orders[0].user);
  
      const [store] = await this.storesService.fetch({
        id: storeId,
        deletedAt: null,
        active: true
      });
  
      const user = orders[0].user;
  
      const storeName = store?.name;
      const storeSettings = store?.settings?.store || {};
      const storeSupport = {
        email: store?.settings?.footer?.email,
        phone: store?.settings?.footer?.phone
      };
  
      // Reconstruct products list from orders and product data
      const products = orders.map((order) => {
        const productModel = order.Product;
        const plainProduct = productModel?.get ? productModel.get({plain:true}) : productModel;
        const hasVariations = order.variations && order.variations.length;
        
        let productVariationStockId = order.productVariationStockId;
        let unitPrice = Number(plainProduct?.price || 0);
  
        if (hasVariations && plainProduct?.productVariationStocks) {
          const variationGroup = getVariationGroupBySelection(plainProduct.productVariationStocks, order.variations);
          if (variationGroup && variationGroup[0]) {
            productVariationStockId = variationGroup[0].id;
            unitPrice = Number(variationGroup[0].price) < 1 ? unitPrice : Number(variationGroup[0].price);
          }
        }
  
        return {
          id: order.productId,
          name: plainProduct?.name,
          images: plainProduct?.images || [],
          price: unitPrice,
          quantity: order.quantity,
          variations: order.variations,
          productVariationStockId,
        };
      });
  
      const promises = [
        this.productService.updateStock({products, operation: '-'}),
        this.ordersRepository.update({
          cartReferenceId, 
          storeId, 
          userId: user.id
        }, {
          isSuspicious: !isVerified, 
          status,
          metaData,
          internalStatus: status,
        }),
      ];
  
      await Promise.all(promises);
  
      // const makeSubtotal = () => {
      //   return products.reduce((acc, item) => {
      //     acc+=Number(item.price) * Number(item.quantity);
      //     return acc; 
      //   }, 0);
      // }
  
      // const makeChargeByType = (type) => {
      //   if (!storeSettings[type]) return 0;
      //   if (storeSettings[type].type === 'VALUE') return storeSettings[type].value;
      //   const subTotal = makeSubtotal();
      //   return (subTotal * storeSettings[type].value) / 100;
      // }
  
      // await sendOrderMail({
      //   to: user.email, 
      //   storeName,
      //   cartReferenceId, 
      //   firstName: user.name.split(' ')[0],
      //   total: orders[0].amount,
      //   subTotal: makeChargeByType('otherCharges') + makeChargeByType('tax'),
      //   supportEmail: storeSupport.email,
      //   address: user.address,
      //   items: products.map((product) => ({
      //     productName: product.name,
      //     amount: product.price,
      //     image: product.images[0],
      //     quantity: product.quantity,
      //   }))
      // });
    } catch(error){
      throw error;
    }
  };
}

export default OrderService;