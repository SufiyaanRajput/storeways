import * as ProductService from '../products';

const addProduct = async (args) => {
  return ProductService.createProduct(args);
};

export default addProduct;