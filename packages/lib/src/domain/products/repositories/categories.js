import { QueryTypes } from 'sequelize';
import BaseRepository from '../../base.repository';

class CategoriesRepository extends BaseRepository {
    constructor({ models }) {
        super(models);
        this.models = models;
    };

    async fetch({storeId}) {
        try{
          const categories = await this.models.sequelize.query(`
          SELECT 
            c1.id, c1.name, c2.name AS "parentName", c1.parent_id AS "parentId", c1.active
          FROM categories AS c1 
          LEFT JOIN categories AS c2 ON c1.parent_id = c2.id
          WHERE c1.store_id = ${storeId} AND c1.deleted_at IS NULL
        `, { type: QueryTypes.SELECT });
      
        if (categories.length) {
          const variations = await this.models.Variation.findAll({
            where: {
              deletedAt: null,
              categoryId: categories.map(({id}) => id)
            }
          });
      
          const groupedVariations = this.groupRelationsByName({
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
      
    async create({ name, parentId = null, storeId }) {
        try{
          return await this.models.Category.create({ name, parentId, storeId });
        }catch(error){
          throw error;
        }
      };
      
    async update({id, storeId, ...updates}) {
        try{
          await this.models.Category.update(updates, {
            where: {id, storeId}
          });
        }catch(error){
          throw error;
        }
      };
      
    async delete({id, storeId}) {
        try{
          await this.models.sequelize.transaction(async (transaction) => {
            try{
              const deletedProducts = await this.models.ProductCategory.update({deletedAt: new Date()}, { where: {categoryId: id}, transaction, returning: true});
              let promises = [
                this.models.Variation.update({deletedAt: new Date()}, { where: {categoryId: id, storeId}, transaction}),
                this.models.Category.update({deletedAt: new Date()}, { where: {id, storeId} , transaction})
              ];
              
              if (deletedProducts[1] && deletedProducts[1].length) {
                const productIds = deletedProducts[1].map(product => product.id);
                promises.push(this.models.ProductVariation.update({deletedAt: new Date()}, {where: {productId: productIds}, transaction}));
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
}

export default CategoriesRepository;


