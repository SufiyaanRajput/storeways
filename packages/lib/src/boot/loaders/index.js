import expressLoader from './express';
import databaseLoader from './database';
import swaggerLoader from './swagger';

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