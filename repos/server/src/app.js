import express from 'express';
import dotenv from 'dotenv';
// import logger from './loaders/logger.js';
import path from 'path';
import { createStorewaysApp } from "@storeways/lib";
import config from './config';
import routes from './api/routes';
import LocalFileStorage from './plugins/storage/LocalFileStorage';
import Email from './services/integrations/Email';

export let app = null;

const startServer = async () => {
  try{
    const appConfig = {
      database: {
        connectionUrl: config.databaseURL,
      },
      domains: ['products', 'stores', 'users', 'orders'],
      adapters: {
        fileStorage: new LocalFileStorage({
          uploadDir: 'uploads',
        }),
        emailService: new Email(),
      },
    }

    app = await createStorewaysApp(appConfig);
    app.use("/uploads", express.static(path.resolve("uploads")));
    app.use(routes)

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