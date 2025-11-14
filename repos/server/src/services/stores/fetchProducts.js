import * as ProductService from '../products';

export const fetchProducts = async (args) => ProductService.fetchProducts(args);

export const fetchProductsByIds = async (args) => ProductService.fetchProductsByIds(args);