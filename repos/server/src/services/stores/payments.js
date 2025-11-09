import models from '../../models';
import axios from 'axios';
import config from '../../config';
import { makeAuthToken } from '../users/account';
import { customAlphabet } from 'nanoid';
import logger from '../../loaders/logger';
import crypto from 'crypto';
import { getVariationGroupBySelection } from '../../utils/helpers';
import { updateStock } from '../utilities/core';
import { sendEmailWithTemplate, verifyOTP } from '../utilities';

const sendOrderMail = ({to, from, firstName, subTotal, cartReferenceId, items, total, supportEmail, storeName}) => {
  try {
    sendEmailWithTemplate({
      to, 
      from,
      ReplyTo: supportEmail,
      TemplateAlias: 'receipt',
      TemplateModel: {
        firstName,
        cartReferenceId,
        date: new Date().toLocaleDateString(),
        receiptDetails: items,
        subTotal,
        total,
        supportEmail,
        storeName,
      }
    });
  } catch (error) {
    logger('STORES-PAYMENTS-ORDERS-sendOrderMail').error(error);
  }
}

export const createOrder = async ({
  accountId, 
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
    const otpVerification = await verifyOTP({to: mobile, otp});

    if (!otpVerification || otpVerification.status !== 'approved') {
      throw {status: 400, msgText: 'Icorrect OTP!', error: new Error};
    }

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

    const encodedBase64Token = Buffer.from(`${config.razorpay.clientId}:${config.razorpay.clientSecret}`).toString('base64');
    let promises = [
      axios.post('https://api.razorpay.com/v1/orders', {
        amount: amount * 100,
        currency: 'INR',
        receipt: '1',
        account_id: accountId
      }, {
        headers: {
          Authorization: `Basic ${encodedBase64Token}`,
        }
      }),
    ];

    if (paymentMode === 'cod') {
      promises = updateStock({products});
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

    let [response = {}, user] = await Promise.all(promises);

    if (existingUser) user = existingUser;

    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13);
    const cartReferenceId = nanoid();

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

    if (paymentMode === 'cod') {
      sendOrderMail({
        to: user.email, 
        from: 'notifications@storeways.io',
        storeName,
        cartReferenceId, 
        firstName: user.name.split(' ')[0],
        total: `₹${makeTotal()}`,
        subTotal: `₹${makeChargeByType('otherCharges') + makeChargeByType('tax')}`,
        supportEmail: storeSupport.email,
        items: products.map((product) => ({
          productName: product.name,
          amount: product.price,
          quantity: product.quantity,
        }))
      });
    }

    const { tax = {}, otherCharges = {} } = storeSettings || {};

    const orderEntries = products.map((product) => ({
      productId: product.id,
      amountPaid: paymentMode === 'cod' ? 0 : amount,
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
      status: 'Active',
      deliveryStatus: 0,
      userId: user.id,
      paymentMode,
    }));

    const orders = await models.Order.bulkCreate(orderEntries, {returning: true, raw: true});

    const token = makeAuthToken({userId: user.id, role: 'customer', storeId, mobile});
    await models.AuthToken.create({token, userId: user.id});
    await models.AuthToken.update({active: false, deletedAt: new Date()}, {where: {token, userId: user.id}});
    user.setDataValue("authToken", token);
    return {paymentOrder: response.data, amount, orderIds: orders.map(order => order.get({plain:true}).id), user, paymentMode};
  }catch(error){
    throw error;
  }
};

const verifyPaymentSignature = ({razorpayOrderId, razorpayPaymentId, razorpaySignature}) => {
  try{
    const hmac = crypto.createHmac('sha256', config.razorpay.clientSecret);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature == razorpaySignature;
  }catch(error){
    throw error;
  }
}

export const confirmPayment = async ({
  storeName, 
  storeSupport, 
  razorpayOrderId, 
  razorpayPaymentId, 
  razorpaySignature, 
  storeId, 
  user, 
  orderIds, 
  products,
  storeSettings
}) => {
  try{
    const verfied = verifyPaymentSignature({razorpayOrderId, razorpayPaymentId, razorpaySignature});

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
        ...updateStock({products, operation: '-'}),
        models.Order.update({
          isSuspicious: !verfied, 
          status: 'Active', 
          razorpayOrderId, 
          razorpayPaymentId, 
          razorpaySignature
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

      sendOrderMail({
        to: user.email, 
        from: 'notifications@storeways.io',
        storeName,
        cartReferenceId: orderData.cartReferenceId, 
        firstName: user.name.split(' ')[0],
        total: orderData.amount,
        subTotal: makeChargeByType('otherCharges') + makeChargeByType('tax'),
        supportEmail: storeSupport.email,
        items: products.map((product) => ({
          productName: product.name,
          amount: product.price,
          quantity: product.quantity,
        }))
      });
   } catch(error){
    throw error;
  }
};