import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();

export const addSubscriber = async ({name, email, storeId}) => {
  try{
    const existing = await models.NewsletterSubscriber.findOne({
      where: {
        email,
        storeId
      }
    });

    if (!existing) await models.NewsletterSubscriber.create({name, email, storeId});
  }catch(error){
    throw error;
  }
};
