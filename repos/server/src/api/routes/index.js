import { Router } from 'express';
import cors from 'cors';
import userController from './users';
import storeController from './store';

const router = Router();

const openCorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

router.use('/v1/users', cors(openCorsOptions), userController);
router.use('/v1/stores', cors(openCorsOptions), storeController);

export default router;