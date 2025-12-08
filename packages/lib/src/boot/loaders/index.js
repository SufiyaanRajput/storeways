import expressLoader from '@storeways/lib/loaders/express';
import databaseLoader from '@storeways/lib/loaders/database';
import swaggerLoader from '@storeways/lib/loaders/swagger';

export default async ({app, config}) => {
  try{
    const { database, domains } = config;
    await databaseLoader({dbConnectionUrl: database.connectionUrl, domains});
    swaggerLoader({app});
    expressLoader({app});
  }catch(error){
    throw error;
  }
}