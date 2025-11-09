import expressLoader from './express';
import databaseLoader from './database';
import pluginsLoader from './plugins';
import getConfig from '../../config';

export default async ({app}) => {
  try{
    await databaseLoader();
    expressLoader({app});
    await pluginsLoader(getConfig());
  }catch(error){
    throw error;
  }
}