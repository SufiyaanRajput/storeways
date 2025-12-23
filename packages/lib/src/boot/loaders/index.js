import expressLoader from './express';
import databaseLoader from './database';
import swaggerLoader from './swagger';
import adaptersLoader from './adapters';

export default async ({app, config}) => {
  try{
    const { database, domains } = config;
    await databaseLoader({dbConnectionUrl: database.connectionUrl, domains});
    swaggerLoader({app});
    adaptersLoader({config});
    expressLoader({app});
  }catch(error){
    throw error;
  }
}