import express from 'express';
import dotenv from 'dotenv';
import logger from './loaders/logger.js';
import path from 'path';

const startServer = async () => {
  try{
    dotenv.config();
    const app = express();
    await require('./loaders').default({app});
    app.use("/uploads", express.static(path.resolve("uploads")));

    const PORT = process.env.PORT || 8080;
  
    app.listen(PORT, () => {
      console.log(`
      ################################################
        Server listening on port: ${PORT}
      ################################################
      `);
    });
  }catch(error){
    logger('App').fatal(error);
  }
}

startServer();