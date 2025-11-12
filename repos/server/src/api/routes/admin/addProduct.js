import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import sanitizeHtml from 'sanitize-html';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  sku: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('').allow(null),
  maxOrderQuantity: Joi.number().integer(),
  images: Joi.array().required(),
  returnPolicy: Joi.string().trim().allow('').allow(null),
  categoryIds: Joi.array().required(),
  price: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  variations: Joi.array().items(Joi.object().keys({
    maxOrderQuantity: Joi.number().integer(),
    price: Joi.number().positive().required().allow(0),
    stock: Joi.number().integer().positive().required().allow(0),
    variationGroup: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })),
  })),
});

export const productSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/products', 
  method: 'post', 
  summary: 'Create a product', 
  tags: ['Products'] 
});

router.post('/products', auth(['owner']), requestValidator(schema), async (req, res) => {
  try{
    const description = sanitizeHtml(req.values.description);
    const returnPolicy = sanitizeHtml(req.values.returnPolicy);
    const product = await adminService.addProduct({...req.values, description, returnPolicy, storeId: req.user.storeId});
    res.status(201).send({product, success: true});
  }catch(error){
    logger('ADMIN-PRODUCTS-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;