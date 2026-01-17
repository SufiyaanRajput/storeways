import express from 'express';
// import logger from './loaders/logger.js';
import path from 'path';
import { createStorewaysApp } from "@storeways/lib";
import config from './config';
import routes from './api/routes';
import { EventBus, EmailService, PaymentGateway, FileStorage } from './services/integrations';
export let app = null;
import './events';

const startServer = async () => {
  try{
    const appConfig = {
      database: {
        connectionUrl: config.databaseURL,
      },
      domains: ['products', 'stores', 'users', 'orders', 'reviews'],
      auth: {
        jwtSecret: config.JWTSecret,
      },
      api: {
        adminbaseUrl: config.adminbaseUrl,
      },
      adapters: {
        fileStorage: new FileStorage({
          uploadDir: 'uploads',
        }),
        email: new EmailService(),
        paymentGateway: new PaymentGateway(),
        eventBus: new EventBus(),
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