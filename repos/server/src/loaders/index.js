import expressLoader from './express';
import databaseLoader from './database';
import pluginsLoader from './plugins';
import getConfig from '../../config';
import swaggerLoader from './swagger';

export default async ({app}) => {
  try{
    await databaseLoader();
    swaggerLoader({app});
    expressLoader({app});
    await pluginsLoader(getConfig());
  }catch(error){
    throw error;
  }
}