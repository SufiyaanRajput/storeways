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
}

export default OrdersRepository;
