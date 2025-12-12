import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();

const fetchStore = async ({subDomain}) => {
  try{
    return await models.Store.findOne({
      where: {subDomain, active: true}
    });
  }catch(error){
    throw error;
  }
};

export default fetchStore;