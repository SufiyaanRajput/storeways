import * as ProductService from '../products';

const fetchProduct = async (args) => {
  return ProductService.fetchProduct(args);
};

export default fetchProduct;