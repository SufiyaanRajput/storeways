import BaseRepository from '../../base.repository';
import { QueryTypes } from 'sequelize';
import { DELIVERY_STATUSES } from '../constants';
import { filtercolumnFields } from '../utils';

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

  async fetchAll({storeId, userId, admin, filters = []}) {
    try{
      const resolveColumn = (field) => {
        if (!field) return null;

        if (field === 'product') return filtercolumnFields.product[field];
        if (filtercolumnFields[field]) return filtercolumnFields[field];
        if (filtercolumnFields.product[field]) return filtercolumnFields.product[field];
        return null;
      };

      const makeFilterQuery = () => {
        return filters.reduce((acc, filter) => {   
          const column = resolveColumn(filter.field);
          if (!column) return acc;

          const { operator, value, field, range } = filter;

          if (operator === 'eq') {
            acc.clauses.push(`${column} = :${field}`);
            acc.replacements[field] = value;
          } else if (operator === 'contains') {
            acc.clauses.push(`${column} ILIKE :${field}`);
            acc.replacements[field] = `%${value}%`;
          } else if (operator === 'range') {
            acc.clauses.push(`${column} BETWEEN DATE_TRUNC('day', TIMESTAMP :start_range AT TIME ZONE 'Asia/Kolkata') AND DATE_TRUNC('day', TIMESTAMP :end_range AT TIME ZONE 'Asia/Kolkata') + INTERVAL '1 day'`);
            acc.replacements['start_range'] = range.start;
            acc.replacements['end_range'] = range.end;
          }

          return acc;
        }, { clauses: [], replacements: {} });
      };

      const { clauses, replacements } = makeFilterQuery();
      const whereClause = clauses.length ? ` AND ${clauses.join(' AND ')}` : '';
  
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
        ${whereClause}
        GROUP BY ${groupByColumns.join(', ')}
        ORDER BY MAX(o.id) DESC;
    `,
        {
          type: QueryTypes.SELECT,
          replacements,
        }
      );
  
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
  
  async update(clause, updates) {
    try{
      return this.models.Order.update(updates, {where: clause});
    }catch(error){
      try {
      } catch (error) {}
      throw error;
    }
  };

  async create(entries) {
    if (Array.isArray(entries)) {
      const orders = await this.models.Order.bulkCreate(entries, {returning: true, raw: true});
      return orders;
    }

    const order = await this.models.Order.create(entries);
    return order.get({ plain: true });
  }

  async find(payload) {
    const orders = await this.models.Order.findAll({
      where: payload,
    });

    return orders.map((order) => (order?.get ? order.get({ plain: true }) : order));
  }
}

export default OrdersRepository;
