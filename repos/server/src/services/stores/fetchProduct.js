import models from '../../models';

const fetchProduct = async ({storeId, id}) => {
  try{
    return models.Product.findOne({
      where: {
        id,
        storeId,
        deletedAt: null,
        active: true
      },
      include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }}]
    })
  }catch(error){
    throw error;
  }
};

export default fetchProduct;