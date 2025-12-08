import expressLoader from '@storeways/lib/loaders/express';
import databaseLoader from '@storeways/lib/loaders/database';
import swaggerLoader from '@storeways/lib/loaders/swagger';

export default async ({app, config}) => {
  try{
    await databaseLoader({dbConnectionUrl: config.dbConnectionUrl});
    swaggerLoader({app});
    expressLoader({app});
  }catch(error){
    throw error;
  }
}