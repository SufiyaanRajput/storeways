import { Router } from 'express';
import cors from 'cors';
import adminController from './routes';

const normalizeOrigin = (origin) => {
  if (!origin) return '*';
  return origin;
};

export const createApiRouter = (config = {}) => {
  const router = Router();
  const { api = {} } = config;

  const adminCorsOrigin = api.adminBaseUrl;

  const adminCorsOptions = {
    origin: normalizeOrigin(adminCorsOrigin),
    optionsSuccessStatus: 200,
  };

  router.use('/v1/admin', cors(adminCorsOptions), adminController);

  return router;
};

export default createApiRouter;
