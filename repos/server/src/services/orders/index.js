import models from '../../models';
import { QueryTypes } from 'sequelize';
import { DELIVERY_STATUSES } from '../../utils/constants';
import Email from '../integrations/Email';
import * as ProductService from '../products';
import { getVariationGroupBySelection } from '../../utils/helpers';
import config from '../../config';

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
      ...ProductService.updateStock({products, operation: '-'}),
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

export const fetchOrders = async ({storeId, userId, admin, textSearchType, search, deliveryStatus}) => {
  try{
    const makeFilterQuery = ({ initialClause }) => {
      let query = '';
      
      if (admin) {
        if (search && textSearchType) {
          if (textSearchType === 'mobile') {
            query = `${initialClause} users.mobile ILIKE :search`;
          } else {
            query = `${initialClause} users.name ILIKE :search`;
          }
        }

        if (deliveryStatus && !isNaN(deliveryStatus)) {
          query+= `${query ? ' AND' : initialClause} orders.delivery_status = :deliveryStatus`;
        }
      }

      return query;
    }

    let orders = await models.sequelize.query(`
      WITH orders_by_cart AS (
        SELECT DISTINCT(cart_reference_id), orders.id FROM orders 
        ${
          admin ?
          `
            INNER JOIN users ON orders.user_id = users.id
          ` : ''
        }
        ${makeFilterQuery({ initialClause: 'WHERE' })}
        ORDER BY orders.id ASC
      )
      SELECT reference_id AS "referenceId", 
           products.name as "product", 
           orders.variations, 
           orders.amount, 
           orders.quantity, 
           orders.delivery_status AS "deliveryStatus",
           orders.price,
           orders.amount_paid AS "amountPaid",
           orders.status, 
           orders.cart_reference_id AS "cartReferenceId",
           orders.created_at as "createdAt", 
           ${
             admin ?
             `
             users.name,
             users.mobile,
             users.id AS "customerId",
             CONCAT(users.address, ', ', users.landmark, ', ', users.pincode, '.') AS "shippingAddress",
             ` : ''
           }
           products.id as "productId"
          FROM orders_by_cart
      INNER JOIN orders ON orders_by_cart.cart_reference_id = orders.cart_reference_id
      INNER JOIN products ON orders.product_id = products.id
      ${
        admin ?
        `
          INNER JOIN users ON orders.user_id = users.id
        ` : ''
      }
      WHERE orders.store_id = ${storeId} AND 
      ((orders.payment_mode = 'online' AND orders.razorpay_order_id IS NOT NULL) OR orders.payment_mode = 'cod')
      ${userId ? ' AND orders.user_id = ' + userId : ''}
      ${makeFilterQuery({ initialClause: 'AND' })}
  `, { type: QueryTypes.SELECT, replacements: {search: `${search}%`, deliveryStatus} });

    orders = orders.reduce((grouped, order) => {
      const index = grouped.findIndex(group => group[0] && group.cartReferenceId === order.cartReferenceId);
      const { cartReferenceId, amount, amountPaid, createdAt, name, mobile, shippingAddress, ...orderRest } = order;

      if (index < 0) {
        grouped.push({cartReferenceId, amount, amountPaid, createdAt, mobile, name, shippingAddress, items: [orderRest]});
      } else {
        grouped[index].items.push(orderRest);
      }

      return grouped;
    }, []);

    return { orders, deliveryStatuses: DELIVERY_STATUSES };
  }catch(error){
    throw error;
  }
};

export const cancelOrders = async ({referenceIds, storeId, customerId, admin, storeSupport}) => {
  try{
    var transaction = await models.sequelize.transaction();

    const [orders, user] = await Promise.all([
      models.Order.findAll({
        where: {
          referenceId: referenceIds,
          status: 'Active',
        },
        attributes: ['variations', 'quantity', ['product_id', 'id'], 'productVariationStockId']
      }, transaction),
      models.User.findOne({
        where: {
          id: customerId
        },
        select: ['email', 'name']
      })
    ]);
  
    await Promise.all([
      models.sequelize.query(`
        UPDATE orders SET status = 'Cancelled'
        WHERE orders.store_id = ${storeId}
        AND reference_id IN ('${referenceIds.join(`','`)}')
        ${!admin ? ' AND orders.user_id = ' + customerId : ''};
      `, { type: QueryTypes.UPDATE, transaction }),
      ...ProductService.updateStock({products: orders, transaction, operation: '+'})
    ]);

    await transaction.commit();

    const EmailService = new Email();

    await EmailService.send({
      to: user.email,
      subject: 'Order CANCELLED',
      html: `
        Hey ${user.name.split(' ')[0]},

        <p>Your order with referrence ID: <strong>${referenceIds.join(', ')}</strong> has been <strong>Cancelled</strong>${admin ? ' by the store!' : '!'}</p>
        <p>Doesn't seem right? You may get in touch by replying to this email</p>

        <p>Hope to see you again!</p>
      `,
    });
  }catch(error){
    try {
      await transaction.rollback(); 
    } catch (error) {}
    throw error;
  }
};

export const updateOrder = async ({storeId, customerId, referenceId, storeSupport, ...updates}) => {
  try{
    const [user] = await Promise.all([
      models.User.findOne({
        where: {
          id: customerId
        },
        select: ['email', 'name']
      }),
      models.Order.update(updates, {where: { referenceId, storeId }}),
    ]);

    if (updates.deliveryStatus !== undefined) {
      const EmailService = new Email();

      await EmailService.send({
        to: user.email,
        subject: 'Order updated',
        from: 'theoceanlabs@gmail.com',
        html: `
          Hey ${user.name.split(' ')[0]},
  
          <p>Your order with referrence ID: <strong>${referenceId}</strong> is in <strong>${DELIVERY_STATUSES.find(d => d.value === updates.deliveryStatus).label}</strong></p>
          <p>We're always here. You may get in touch by replying to this email</p>
  
          <p>Hope to see you again!</p>
        `,
      });
    }
  }catch(error){
    try {
    } catch (error) {}
    throw error;
  }
};
