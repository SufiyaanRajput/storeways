import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { storeService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, requestValidator } from '../../middlewares';
import { auth } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  id: Joi.number().integer().positive(),
  limit: Joi.number().integer().positive(),
  type: Joi.string().valid('MOST_RATED', 'BEST_SELLING', 'LATEST'),
  categories: Joi.array(),
});

export const cartAddSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/cart', 
  method: 'post', 
  summary: 'Add items to cart', 
  tags: ['Cart'],
  roles: ['customer'],
});

router.post('/', auth(['customer']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    if (req.params.id) {
      var product = await storeService.fetchProduct({storeId: req.storeId, id: req.params.id});
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