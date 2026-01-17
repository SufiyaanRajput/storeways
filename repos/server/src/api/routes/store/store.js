import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { Categories, Store } from '@storeways/lib/domain';
import { getStore } from '../../middlewares';
import { auth } from '@storeways/lib/middlewares';
import cors from 'cors';

const router = Router();
const categories = new Categories();
const store = new Store();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

router.get('/', cors(corsOptions), auth(['owner'], true), getStore(), async (req, res) => {
  try{
    const [storeData] = await store.fetch({subDomain: req.subDomain});

    res.status(200).send({store: storeData, success: true});
  }catch(error){
    console.error('[STORES-STORE-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

// const schema = Joi.object({
//   name: Joi.string().trim().required(),
//   parentId: Joi.number().integer().positive().allow(null)
// });

router.get('/filters', cors(corsOptions), getStore(), async (req, res) => {
  try{
    const filters = await categories.fetchForFilters({storeId: req.storeId});
    res.status(200).send({filters, success: true});
  }catch(error){
    console.error('[STORE-FILTERS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;