import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { storeService } from '../../../services';
import { getStore, auth } from '../../middlewares';
import cors from 'cors';

const router = Router();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

export const fetchStoreSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/', 
  method: 'get', 
  summary: 'Fetch store by domain', 
  tags: ['Store'] 
});

router.get('/', cors(corsOptions), auth(['owner'], true), getStore(), async (req, res) => {
  try{
    const store = await storeService.fetchStore({subDomain: req.subDomain});

    res.status(200).send({store, success: true});
  }catch(error){
    console.error('[STORES-STORE-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;