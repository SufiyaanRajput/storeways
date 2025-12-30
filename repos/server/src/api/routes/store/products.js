import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { getStore, requestValidator } from '../../middlewares';
import { auth } from '../../middlewares';
import Joi from 'joi';
import { Product as ProductService } from '@storeways/lib/domain';

const router = Router();

const Product = new ProductService();

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
        var products = await Product.fetchByIds(req.values.id);
      } else {
        var [product] = await Product.fetchByIds(req.params.id);
      }
    } else {
      var products = await Product.fetchAll({storeId: req.storeId, ...req.values});
    }

    res.status(200).send({products, product, success: true});
  }catch(error){
    console.error('[STORES-PRODUCTS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;