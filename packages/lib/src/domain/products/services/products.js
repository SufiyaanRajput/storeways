import ProductsRepository from '../repositories/products';
import { getDatabase } from '../../../db';
import BaseUtilityService from './base.utility';

class ProductService extends BaseUtilityService {
  constructor() {
    super();
    this.productsRepository = new ProductsRepository({ models: getDatabase() });
  }

  async create(payload) {
    const product = await this.productsRepository.create(payload);
    return product;
  }

  async fetchAll({ storeId, type, limit, categories = [] }) {
    if (type === 'BEST_SELLING') {
      const productIdsWithMostOrders = await this.productsRepository.getProductIdsWithMostOrders({ storeId, limit });
      const productIds = productIdsWithMostOrders.map(({ productId }) => productId);
      return this.productsRepository.fetchByIds(productIds);
    }

    const products = await this.productsRepository.fetchAll({ storeId, type, limit, categories });
    return products;
  }

  async fetch(payload) {
    const product = await this.productsRepository.fetch(payload);
    return product;
  }

  async fetchByIds(id) {
    const products = await this.productsRepository.fetchByIds(id);
    return products;
  }

  async update(payload) {
    const product = await this.productsRepository.update(payload);
    return product;
  }

  async delete({ storeId, id }) {
    const product = await this.productsRepository.delete({ storeId, id });
    return product;
  }

  async updateStock({ products, transaction, operation = '-' }) {
    const stock = await this.productsRepository.updateStock({ products, transaction, operation });
    return stock;
  }
}

export default ProductService;