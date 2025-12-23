import BaseRepository from '../../base.repository';
import { QueryTypes } from 'sequelize';
import { DELIVERY_STATUSES } from '../constants';

class OrdersRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async getProductIdsWithMostOrders({ storeId, limit = 10 }) {
    try {
      return this.models.sequelize.query(
        `
        SELECT 
					product_id AS "productId", 
					COUNT(*) as "orderCount" 
					FROM orders 
        WHERE store_id = ${storeId} 
          AND deleted_at IS NULL 
					AND status = 'confirmed'
        GROUP BY product_id 
        ORDER BY order_count DESC LIMIT ${limit};
        `
      );
    } catch (error) {
      throw error;
    }
  }

  async fetchAll({storeId, userId, admin, textSearchType, search, deliveryStatus}) {
    try{
      const makeFilterQuery = ({ initialClause }) => {
        let query = '';
        
        if (admin) {
          if (search && textSearchType) {
            if (textSearchType === 'mobile') {
              query = `${initialClause} u.mobile ILIKE :search`;
            } else {
              query = `${initialClause} u.name ILIKE :search`;
            }
          }
  
          if (deliveryStatus && !isNaN(deliveryStatus)) {
            query+= `${query ? ' AND' : initialClause} o.delivery_status = :deliveryStatus`;
          }
        }
  
        return query;
      }
  
      const groupByColumns = ['o.cart_reference_id', 'o.created_at', ' o.internal_status', 'o.is_suspicious', 'o.amount', 'o.amount_paid'];
  
      if (admin) {
        groupByColumns.push('u.id');
      }
  
      let orders = await this.models.sequelize.query(
        `
        SELECT o.cart_reference_id AS "cartReferenceId",
        amount,
        o.created_at AS "createdAt",
        o.amount_paid AS "amountPaid",
          ${
            admin
              ? `
        u.name,
        u.mobile,
        u.id AS "customerId",
        CONCAT(u.address, ', ', u.landmark, ', ', u.pincode, '.') AS "shippingAddress",
        o.internal_status AS "paymentStatus",
        o.is_suspicious AS "isSuspicious",
        `
              : ''
          }
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'referenceId', o.reference_id,
            'product', p.name,
            'variations', o.variations,
            'quantity', o.quantity,
            'deliveryStatus', o.delivery_status,
            'price', o.price,
            'status', o.status,
            'productId', p.id
          )
        ) AS items
        FROM orders AS o
        INNER JOIN products p ON o.product_id = p.id
        ${
          admin
            ? `
            INNER JOIN users u ON o.user_id = u.id
          `
            : ""
        }
        WHERE o.store_id = ${storeId}
        ${userId ? " AND o.user_id = " + userId : ""}
        ${makeFilterQuery({ initialClause: "AND" })}
        GROUP BY ${groupByColumns.join(', ')}
        ORDER BY MAX(o.id) DESC;
    `,
        {
          type: QueryTypes.SELECT,
          replacements: { search: `${search}%`, deliveryStatus },
        }
      );
  
      // orders = orders.reduce((grouped, order) => {
      //   const index = grouped.findIndex(group => group[0] && group.cartReferenceId === order.cartReferenceId);
      //   const { cartReferenceId, amount, amountPaid, createdAt, name, mobile, shippingAddress, ...orderRest } = order;
  
      //   if (index < 0) {
      //     grouped.push({cartReferenceId, amount, amountPaid, createdAt, mobile, name, shippingAddress, items: [orderRest]});
      //   } else {
      //     grouped[index].items.push(orderRest);
      //   }
  
      //   return grouped;
      // }, []);
  
      return { orders, deliveryStatuses: DELIVERY_STATUSES };
    }catch(error){
      throw error;
    }
  };

  async cancel({referenceIds, storeId, user, admin, storeSupport, transaction}) {
    try{
      const orders = await this.models.Order.findAll({
        where: {
          referenceId: referenceIds,
          status: 'Active',
        },
        attributes: ['variations', 'quantity', ['product_id', 'id'], 'productVariationStockId']
      }, transaction);
    
      await this.models.sequelize.query(`
        UPDATE orders SET status = 'Cancelled'
        WHERE orders.store_id = ${storeId}
        AND reference_id IN ('${referenceIds.join(`','`)}')
        ${!admin ? ' AND orders.user_id = ' + user.id : ''};
      `, { type: QueryTypes.UPDATE, transaction })

      return orders;
    }catch(error){
      try {
        await transaction.rollback(); 
      } catch (error) {}
      throw error;
    }
  };
  
  async update({user, storeId, referenceId, storeSupport, ...updates}) {
    try{
      return this.models.Order.update(updates, {where: { referenceId, storeId }});
    }catch(error){
      try {
      } catch (error) {}
      throw error;
    }
  };
}

export default OrdersRepository;
