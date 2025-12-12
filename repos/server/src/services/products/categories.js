import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { QueryTypes } from 'sequelize';
import { groupRelationsByName } from '../../utils/helpers';

export const fetchCategories = async ({storeId}) => {
  try{
    const categories = await models.sequelize.query(`
    SELECT 
      c1.id, c1.name, c2.name AS "parentName", c1.parent_id AS "parentId", c1.active
    FROM categories AS c1 
    LEFT JOIN categories AS c2 ON c1.parent_id = c2.id
    WHERE c1.store_id = ${storeId} AND c1.deleted_at IS NULL
  `, { type: QueryTypes.SELECT });

  if (categories.length) {
    const variations = await models.Variation.findAll({
      where: {
        deletedAt: null,
        categoryId: categories.map(({id}) => id)
      }
    });

    const groupedVariations = groupRelationsByName({
      source: variations,
      parentKeyTarget: 'categoryIds',
      parentKey: 'categoryId',
      childKey: 'id',
      optionsKey: 'options'
    });

    categories.forEach(category => {
      const variations = groupedVariations.filter(variation => variation.categoryIds.includes(category.id));
      category.variations = variations;
    });
  }

    return categories;
  }catch(error){
    throw error;
  }
};

export const addCategory = async ({ name, parentId = null, storeId }) => {
  try{
    return await models.Category.create({ name, parentId, storeId });
  }catch(error){
    throw error;
  }
};

export const editCategory = async ({id, storeId, ...updates}) => {
  try{
    await models.Category.update(updates, {
      where: {id, storeId}
    });
  }catch(error){
    throw error;
  }
};

export const deleteCategory = async ({id, storeId}) => {
  try{
    await models.sequelize.transaction(async (transaction) => {
      try{
        const deletedProducts = await models.ProductCategory.update({deletedAt: new Date()}, { where: {categoryId: id}, transaction, returning: true});
        let promises = [
          models.Variation.update({deletedAt: new Date()}, { where: {categoryId: id, storeId}, transaction}),
          models.Category.update({deletedAt: new Date()}, { where: {id, storeId} , transaction})
        ];
        
        if (deletedProducts[1] && deletedProducts[1].length) {
          const productIds = deletedProducts[1].map(product => product.id);
          promises.push(models.ProductVariation.update({deletedAt: new Date()}, {where: {productId: productIds}, transaction}));
        }

        return await Promise.all(promises);
      }catch(error){
        throw error;
      }
    });
  }catch(error){
    throw error;
  }
};


