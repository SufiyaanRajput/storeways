import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { storeService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, requestValidator } from '../../middlewares';
import { auth } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.array().items(Joi.number().integer().positive())
  ),
  limit: Joi.number().integer().positive(),
  type: Joi.string().valid('MOST_RATED', 'BEST_SELLING', 'LATEST'),
  categories: Joi.array(),
});

router.get('/products/:id?', auth(['owner'], true), requestValidator(schema), getStore(), async (req, res) => {
  try{
    if (req.values.id) {
      if (Array.isArray(req.values.id)) {
        var products = await storeService.fetchProductsByIds({storeId: req.storeId, id: req.values.id});
      } else {
        var product = await storeService.fetchProduct({storeId: req.storeId, id: req.params.id});
      }
    } else {
      var products = await storeService.fetchProducts({storeId: req.storeId, ...req.values});
    }

    res.status(200).send({products, product, success: true});
  }catch(error){
    logger('STORES-PRODUCTS-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;