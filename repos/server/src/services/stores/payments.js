import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { makeAuthToken } from '../users/account';
import { customAlphabet } from 'nanoid';
import { getVariationGroupBySelection } from '../../utils/helpers';
import PaymentGateway from '../integrations/PaymentGateway';
import * as ProductService from '../products';
import config from '../../config';
import { sendOrderMail, confirmOrdersAfterPayment, processOrder } from '../orders';


export const createOrder = async ({
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
}) => {
  try{
    // const otpVerification = await verifyOTP({to: mobile, otp});

    // if (!otpVerification || otpVerification.status !== 'approved') {
    //   throw {status: 400, msgText: 'Icorrect OTP!', error: new Error};
    // }

    const [productsData, existingUser] = await Promise.all([
      models.Product.findAll({
        where: {
          id: products.map(({id}) => id),
          storeId,
          active: true,
          deletedAt: null
        },
        include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }}]
      }),
      models.User.findOne({where: {mobile, role: 'customer', storeId, active: true, deletedAt: null}})
    ]);

    if (productsData.length !== products.length) return {itemRemoved: true};

    for (const product of products) {
      const realProduct = productsData.find(({id}) => id === Number(product.id));
      let realStock = realProduct.stock;
      let outStock = realStock === 0;
      let stockChanged = product.quantity > realStock;

      if (product.variations && product.variations.length) {
        var vairationGroup = getVariationGroupBySelection(realProduct.get({plain:true}).productVariationStocks, product.variations);
        product.productVariationStockId = vairationGroup[0].id;
        realStock = vairationGroup[0].stock || realStock;
        outStock = realStock === 0;
        stockChanged = product.quantity > realStock;
        product.price = vairationGroup[0].price < 1 ? product.price: vairationGroup[0].price;
      }

      if (outStock || stockChanged) return {outStock, stockChanged};
    }

    const paymentGateway = new PaymentGateway();

    let promises = [];
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13);
    const cartReferenceId = nanoid();

    const isCod = paymentMode === 'cod';

    if (isCod) {
      promises = [
        ProductService.updateStock({products}),
        sendOrderMail({
          to: user.email, 
          storeName,
          cartReferenceId, 
          firstName: user.name.split(' ')[0],
          total: `₹${makeTotal()}`,
          subTotal: `₹${makeChargeByType('otherCharges') + makeChargeByType('tax')}`,
          supportEmail: storeSupport.email,
          address,
          items: products.map((product) => ({
            productName: product.name,
            image: product.images[0],
            amount: product.price,
            quantity: product.quantity,
          }))
        }),
      ];
    } else {
      const successUrl = `${config.clientbaseUrl}/orders`;
      const cancelUrl = `${config.clientbaseUrl}/cart`;
      promises.push(paymentGateway.createOrder({ 
        amount,
        products,
        cartReferenceId,
        storeId,
        successUrl,
        cancelUrl,
      }));
    }

    if (!existingUser) {
      promises.push(
        models.User.create({
          name,
          mobile,
          email,
          address,
          landmark,
          pincode,
          storeId,
          role: 'customer'
        })
      );
    } else {
      const userDetails = {
        email, 
        address, 
        landmark, 
        pincode, 
      }

      const updates = Object.keys(userDetails).reduce((updates, key) => {
        if (existingUser[key] !== userDetails[key]) updates[key] = userDetails[key];
        return updates;
      }, {});

      if (Object.keys(updates).length) {
        existingUser.set(updates);
        promises.push(existingUser.save());
      }
    }

    let [orderSessionResponse = {}, user] = await Promise.all(promises);

    if (existingUser) user = existingUser;

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
  
    const makeTotal = () => {
      return makeSubtotal() + makeChargeByType('otherCharges') + makeChargeByType('tax');
    }

    const { tax = {}, otherCharges = {} } = storeSettings || {};

    const orderEntries = products.map((product) => ({
      productId: product.id,
      amountPaid: isCod ? 0 : amount,
      price: product.price * product.quantity,
      quantity: product.quantity,
      amount: makeTotal(),
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

    const orders = await models.Order.bulkCreate(orderEntries, {returning: true, raw: true});

    const token = makeAuthToken({userId: user.id, role: 'customer', storeId, mobile});
    await models.AuthToken.create({token, userId: user.id});
    await models.AuthToken.update({active: false, deletedAt: new Date()}, {where: {token, userId: user.id}});
    user.setDataValue("authToken", token);
    
    return {
      paymentOrder: orderSessionResponse.data,
      paymentGateway: paymentMode === 'cod' ? 'cod' : paymentGateway.getInstance()?.name,
      amount,
      orderIds: orders.map(order => order.get({plain:true}).id),
      user,
      paymentMode
    };
  }catch(error){
    throw error;
  }
};

export const paymentWebhook = async (payload, headers, query) => {
  try{
    console.log('paymentWebhook');
    const paymentGateway = new PaymentGateway();
    const signature = headers[paymentGateway.getInstance()?.signatureKey];

    const { status, isVerified } = await paymentGateway.webhook(
      payload,
      signature,
    );

    const { cartReferenceId, storeId, gatewayReferenceId } = paymentGateway.getMetaData(payload);

    await processOrder({ 
      cartReferenceId, 
      storeId: Number(storeId), 
      isVerified, 
      status, 
      metaData: { gatewayReferenceId }
    });
  } catch(error){
    throw error;
  }
};