import models from '../../models';
import FileStorage from '../integrations/FileStorage';

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

export const updateStock = ({products, transaction, operation='-'}) => {
  try {
    let variationStockUpdateQuery = `
    UPDATE product_variation_stocks SET stock = (
      CASE
  `;

  let stockUpdateQuery = `
    UPDATE products SET stock = (
      CASE
  `;

  let hasVariations = false, hasNonVariants = false, promises=[];

    for (const product of products) {
      if (product.variations && product.variations.length) {
        variationStockUpdateQuery += `
          WHEN product_id = ${product.id} AND id = ${product.productVariationStockId}
          THEN (stock ${operation} ${product.quantity}) 
          ELSE stock
            `;

        hasVariations = true;
        continue;
      }

      stockUpdateQuery += `
        WHEN id = ${product.id} 
        THEN (stock ${operation} ${product.quantity}) 
        ELSE stock
      `;

      hasNonVariants = true;
    }

    variationStockUpdateQuery += `
      END
      ) WHERE product_id IN (${products.map(({id}) => id).join(',')}) AND stock > 0 AND deleted_at IS NULL
    `;

    stockUpdateQuery += `
      END
      ) WHERE id IN (${products.map(({id}) => id).join(',')}) AND stock > 0
    `;

    if (hasVariations) {
      promises.push(models.sequelize.query(variationStockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
    }

    if (hasNonVariants) {
      promises.push(models.sequelize.query(stockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
    }

    return promises;
  } catch (error) {
    throw error;
  }
}