import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { Categories as CategoriesService } from '@storeways/lib/domain';
import { getStore, requestValidator } from '../../middlewares';
import cors from 'cors';

const router = Router();
const Categories = new CategoriesService();

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
    const filters = await Categories.fetchForFilters({storeId: req.storeId});
    res.status(200).send({filters, success: true});
  }catch(error){
    console.error('[STORE-FILTERS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;