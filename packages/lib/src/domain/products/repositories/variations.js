import BaseRepository from '../../base.repository';

class VariationsRepository extends BaseRepository {
    constructor({ models }) {
        super(models);
        this.models = models;
    };

    async fetch(payload) {
        try{
          const variations = await this.models.Variation.findAll({
            where: payload,
            include: [{
              model: this.models.Category,
              as: 'category',
              attributes: ['name', 'id']
            }]
          });

          return variations.map((variation) => variation.get({ plain: true }));
        }catch(error){
          throw error;
        }
      };
      
      async create(payload) {
        try{
          return this.models.Variation.create(payload);
        }catch(error){
          throw error;
        }
      };
      
      async update({id, storeId, ...payload}) {
        try{
          return this.models.Variation.update(payload, { where: {id, storeId} });
        }catch(error){
          throw error;
        }
      };
      
      async delete({id, storeId}) {
        try{
          await this.models.sequelize.transaction(async (transaction) => {
            try{
              return Promise.all([
                this.models.Variation.update({deletedAt: new Date()}, { where: {id, storeId}, transaction}),
                this.models.ProductVariation.update({deletedAt: new Date()}, {where: {variationId: id}, transaction})
              ]);
            }catch(error){
              throw error;
            }
          });
        }catch(error){
          throw error;
        }
      };
      
      
      
}

export default VariationsRepository;


