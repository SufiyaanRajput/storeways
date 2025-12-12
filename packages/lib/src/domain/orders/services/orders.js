class OrderService {
  constructor({ ordersRepository }) {
    this.ordersRepository = ordersRepository;
  }

  async getProductIdsWithMostOrders({ storeId, limit = 10 }) {
    const productIdsWithMostOrders = await this.ordersRepository.getProductIdsWithMostOrders({ storeId, limit });
    return productIdsWithMostOrders;
  }
}

export default OrderService;