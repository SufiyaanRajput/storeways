export const updateSettings = async ({ storeId, ...payload }) => {
    try{
      return models.Store.update({
        settings: models.Sequelize.literal(`settings :: jsonb || '${JSON.stringify({...payload})}' :: jsonb`)
      }, {
        where: {
          id: storeId,
          deletedAt: null,
        }
      });
    }catch(error){
      throw error;
    }
  }