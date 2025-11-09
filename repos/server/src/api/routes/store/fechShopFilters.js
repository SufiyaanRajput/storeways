import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { storeService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, requestValidator } from '../../middlewares';
import cors from 'cors';

const router = Router();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// const schema = Joi.object({
//   name: Joi.string().trim().required(),
//   parentId: Joi.number().integer().positive().allow(null)
// });

router.get('/filters', cors(corsOptions), getStore(), async (req, res) => {
  try{
    const filters = await storeService.fechShopFilters({storeId: req.storeId});
    res.status(200).send({filters, success: true});
  }catch(error){
    logger('STORE-FILTERS-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;