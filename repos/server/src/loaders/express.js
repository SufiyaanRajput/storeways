import express from 'express';
import routes from '../api/routes';
import loggerInstance from './logger';

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
  app.use(express.json());
  app.use((req, res, next) => {
    logger.info(reqSerializer(req));
    next();
  });
  app.use(routes);
}