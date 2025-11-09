import models from '../../models';

const addProduct = async ({ categoryIds, variations=[], ...payload }) => {
  try{
    const categories = await models.Category.findAll({where: { id: categoryIds, deletedAt: null }, attributes: ['id']});

    if (!categories.length) throw {status: 400, msgText: 'Category does not exit!', error: new Error};

    return await models.sequelize.transaction(async (transaction) => {
      const product = await models.Product.create({ ...payload }, {transaction});
      const promises = [];

      if (variations && variations.length && variations[0].variationGroup) {
        const productVariationStock = [];

        variations.forEach((v) => {
          productVariationStock.push({
            maxOrderQuantity: v.maxOrderQuantity,
            price: v.price,
            stock: v.stock,
            productId: product.id,
            storeId: payload.storeId,
            variationGroup: v.variationGroup
          });
        });

        promises.push(models.ProductVariationStock.bulkCreate(productVariationStock, {transaction}));
      }

      const productCategories = categories.map((category) => {
        return {
          productId: product.id, 
          categoryId: category.id,
        };
      });

      promises.push(models.ProductCategory.bulkCreate(productCategories, {transaction}));

      await Promise.all(promises);

      return product;
    });
  }catch(error){
    throw error;
  }
};

export default addProduct;