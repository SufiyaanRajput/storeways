import models from '../../models';
import FileStorage from '../utilities/FileStorage';

export const updateProduct = async ({ categoryIds, variations=[], storeId, ...payload }) => {
  try{   
    const categories = await models.Category.findAll({where: { id: categoryIds, deletedAt: null }, attributes: ['id']});

    if (!categories.length) throw {status: 400, msgText: 'Category does not exit!', error: new Error};

    var transaction = await models.sequelize.transaction();

    const promises = [models.Product.update({ ...payload }, {
      where: {
        id: payload.id,
        storeId
      },
      transaction
    })];

    if (variations && variations.length && variations[0].variationGroup) {
      const productVariationStock = [];

      variations.forEach((v) => {
        productVariationStock.push({
          maxOrderQuantity: v.maxOrderQuantity,
          price: v.price,
          stock: v.stock,
          variationGroup: v.variationGroup,
          storeId,
          productId: payload.id
        });
      });

      promises.push(models.ProductVariationStock.bulkCreate(productVariationStock, {transaction}));
    }

    const productCategories = categories.map((category) => {
      return {
        productId: payload.id, 
        categoryId: category.id,
      };
    });

    await Promise.all([
      models.ProductVariationStock.update({deletedAt: new Date()}, {where: {storeId, productId: payload.id}}, {transaction}),
      models.ProductCategory.update({deletedAt: new Date()}, { where: { productId: payload.id }, transaction}),
    ]);

    promises.push(
      models.ProductCategory.bulkCreate(productCategories, {transaction})
    );

    await Promise.all(promises);
    await transaction.commit();
  }catch(error){
    transaction && transaction.rollback();
    throw error;
  }
};

export const addImage = async ({ file, fileName, ext }) => {
  try{
    const storage = new FileStorage();
    const { url, fileId } = await storage.upload(file, `${fileName}.${ext}`);
    
    return {
      url,
      fileId,
      name: fileName,
    };
  }catch(error){
    throw error;
  }
}

export const deleteProductImage = async ({ imageId }) => {
  try{
    const storage = new FileStorage();
    return await  storage.delete();
  }catch(error){
    throw error;
  }
}

export const deleteProduct = async ({ storeId, id }) => {
  try{
    await models.sequelize.transaction(async (transaction) => {
      try{
        return await Promise.all([
          models.Product.update({deletedAt: new Date()}, { where: {id, storeId}, transaction}),
          models.ProductVariation.update({deletedAt: new Date()}, {where: {productId: id}, transaction})
        ]);
      }catch(error){
        throw error;
      }
    });
  }catch(error){
    throw error;
  }
}