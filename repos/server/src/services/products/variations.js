import models from '../../models';

export const fetchVariations = async ({storeId}) => {
  try{
    return await models.Variation.findAll({
      where: {storeId, deletedAt: null},
      attributes: ['name', 'id', 'options', 'active', 'deleted_at'],
      include: [{
        model: models.Category,
        as: 'category',
        attributes: ['name', 'id']
      }]
    });
  }catch(error){
    throw error;
  }
};

export const addVariation = async (payload) => {
  try{
    return await models.Variation.create(payload);
  }catch(error){
    throw error;
  }
};

export const updateVariation = async ({id, storeId, ...payload}) => {
  try{
    return await models.Variation.update(payload, { where: {id, storeId} });
  }catch(error){
    throw error;
  }
};

export const deleteVariation = async ({id, storeId}) => {
  try{
    await models.sequelize.transaction(async (transaction) => {
      try{
        return await Promise.all([
          models.Variation.update({deletedAt: new Date()}, { where: {id, storeId}, transaction}),
          models.ProductVariation.update({deletedAt: new Date()}, {where: {variationId: id}, transaction})
        ]);
      }catch(error){
        throw error;
      }
    });
  }catch(error){
    throw error;
  }
};


