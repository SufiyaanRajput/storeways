import express from 'express';
import dotenv from 'dotenv';
// import logger from './loaders/logger.js';
import path from 'path';
import { createStorewaysApp } from "@storeways/lib";
import config from './config';

const startServer = async () => {
  try{
    const appConfig = {
      dbConnectionUrl: config.databaseURL,
    }

    const app = await createStorewaysApp(appConfig);
    app.use("/uploads", express.static(path.resolve("uploads")));

    app.listen(config.port, () => {
      console.log(`
      ################################################
        Storeways server listening on port: ${config.port}
      ################################################
      `);
    });
  }catch(error){
    // logger('App').fatal(error);
    console.error(error);
  }
}

startServer();