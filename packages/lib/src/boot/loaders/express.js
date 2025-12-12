import express from 'express';
// import routes from '../api/routes';
import loggerInstance from './logger';
import cors from 'cors';

export default ({app}) => {
  const logger = loggerInstance({name: 'Incoming Request'});
  const reqSerializer = (req) => {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    };
  }

  app.enable('trust proxy');
  app.use(cors());
  app.use((req, res, next) => {
    console.log('req.originalUrl', req.originalUrl, req.originalUrl.includes('/payments/webhook'));
    if (req.originalUrl.includes('/payments/webhook')) {
      return next();
    }
    return express.json()(req, res, next);
  });
  app.use((req, res, next) => {
    logger.info(reqSerializer(req));
    next();
  });
  // app.use(routes);
}