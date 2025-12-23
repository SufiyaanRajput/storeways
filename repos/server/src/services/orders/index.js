import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { QueryTypes } from 'sequelize';
import { DELIVERY_STATUSES } from '../../utils/constants';
import Email from '../integrations/Email';
import { getVariationGroupBySelection } from '../../utils/helpers';
import config from '../../config';
import { Product } from '@storeways/lib/domain';

const product = new Product();

export const sendOrderMail = async ({
  to, 
  firstName, 
  subTotal, 
  cartReferenceId, 
  items, 
  total, 
  address, 
  supportEmail, 
  storeName
}) => {
  try {
    const EmailService = new Email();
    return EmailService.send({
      to,
      template_id: 'd-8b28c8c38a8149a883a27f27b02f177f',
      dynamic_template_data: {
        customer_name: firstName,
        order_id: cartReferenceId,
        order_date: new Date().toLocaleDateString(),
        order_note: "",
        subtotal: subTotal,
        shipping: 0,
        tax: 0,
        total: total,
        order_url: `${config.clientbaseUrl}/orders`,
        items: items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.amount,
          image: item.image,
        })),
        shipping_address: address,
      },
    });
  } catch (error) {
    console.error('[ORDERS]-sendOrderMail', error);
  }
}

export const confirmOrdersAfterPayment = async ({
  storeName, 
  storeSupport, 
  storeId, 
  user, 
  orderIds, 
  products,
  storeSettings,
  paymentMeta = {},
  isVerified = true
}) => {
  try{
    const [productsData, orderData] = await Promise.all([
      models.Product.findAll({
        where: {
          id: products.map(({id}) => id),
          storeId,
          active: true,
          deletedAt: null
        },
        include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }}]
      }),
      models.Order.findOne({
        where: {
          id: orderIds[0]
        },
        attributes: ['cartReferenceId', 'amount'],
      })
    ]);

    for (const product of products) {
      const realProduct = productsData.find(({id}) => id === Number(product.id));

      if (product.variations && product.variations.length) {
        const vairationGroup = getVariationGroupBySelection(realProduct.get({plain:true}).productVariationStocks, product.variations);
        product.productVariationStockId = vairationGroup[0].id;
      }
    }

    const promises = [
      ...product.updateStock({products, operation: '-'}),
      models.Order.update({
        isSuspicious: !isVerified, 
        status: 'confirmed',
        ...paymentMeta
      }, {
        where: {
          id: orderIds, 
          storeId, 
          userId: user.id
        }
      }),
    ];

    await Promise.all(promises);

    const makeSubtotal = () => {
      return products.reduce((acc, item) => {
        acc+=Number(item.price) * Number(item.quantity);
        return acc; 
      }, 0);
    }

    const makeChargeByType = (type) => {
      if (!storeSettings[type]) return 0;
      if (storeSettings[type].type === 'VALUE') return storeSettings[type].value;
      const subTotal = makeSubtotal();
      return (subTotal * storeSettings[type].value) / 100;
    }

    await sendOrderMail({
      to: user.email, 
      storeName,
      cartReferenceId: orderData.cartReferenceId, 
      firstName: user.name.split(' ')[0],
      total: orderData.amount,
      subTotal: makeChargeByType('otherCharges') + makeChargeByType('tax'),
      supportEmail: storeSupport.email,
      address: user.address,
      items: products.map((product) => ({
        productName: product.name,
        amount: product.price,
        image: product.images[0],
        quantity: product.quantity,
      }))
    });
  } catch(error){
    throw error;
  }
};

export const processOrder = async ({
  status,
  storeId,
  cartReferenceId,
  metaData = {},
  isVerified = true
}) => {
  try{
    const orders = await models.Order.findAll({
      where: {
        cartReferenceId,
        storeId
      },
      attributes: [
        'id',
        'productId',
        'userId',
        'quantity',
        'variations',
        'amount',
        'price',
        'productVariationStockId'
      ],
      include: [
        {
          model: models.Product,
          attributes: ['id', 'name', 'images', 'price'],
          include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }, required: false }]
        },
        {
          model: models.User,
          attributes: ['id', 'email', 'name', 'address']
        }
      ]
    });

    if (!orders || !orders.length) {
      throw { status: 404, msgText: 'Orders not found for cartReferenceId', error: new Error() };
    }

    const [store] = await Promise.all([
      models.Store.findOne({
        where: {
          id: storeId,
          deletedAt: null,
          active: true
        },
        attributes: ['name', 'settings']
      })
    ]);

    const user = orders[0].User;

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
      ...ProductService.updateStock({products, operation: '-'}),
      models.Order.update({
        isSuspicious: !isVerified, 
        status,
        metaData,
        internalStatus: status,
      }, {
        where: {
          cartReferenceId, 
          storeId, 
          userId: user.id
        }
      }),
    ];

    await Promise.all(promises);

    const makeSubtotal = () => {
      return products.reduce((acc, item) => {
        acc+=Number(item.price) * Number(item.quantity);
        return acc; 
      }, 0);
    }

    const makeChargeByType = (type) => {
      if (!storeSettings[type]) return 0;
      if (storeSettings[type].type === 'VALUE') return storeSettings[type].value;
      const subTotal = makeSubtotal();
      return (subTotal * storeSettings[type].value) / 100;
    }

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
