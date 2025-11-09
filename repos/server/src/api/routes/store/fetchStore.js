import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { storeService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, auth } from '../../middlewares';
import cors from 'cors';

const router = Router();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

router.get('/', cors(corsOptions), auth(['owner'], true), getStore(), async (req, res) => {
  try{
    const store = await storeService.fetchStore({subDomain: req.subDomain});

    res.status(200).send({store, success: true});
  }catch(error){
    logger('STORES-STORE-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;