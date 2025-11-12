import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import Joi from 'joi';

const router = Router();

const fetchVariationsSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/variations', 
  method: 'get', 
  summary: 'Fetch variations', 
  tags: ['Variations'] 
});

router.get('/variations', auth(['owner']), async (req, res) => {
  try{
    const variations = await adminService.fetchVariations({storeId: req.user.storeId});
    res.status(200).send({variations, success: true});
  }catch(error){
    logger('ADMIN-VARIATIONS-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const schema = Joi.object({
  name: Joi.string().trim().required(),
  categoryId: Joi.number().integer().positive().allow(null),
  options: Joi.array().items(Joi.string().required()).required()
});

const addVariationSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/variations', 
  method: 'post', 
  summary: 'Create a variation', 
  tags: ['Variations'] 
});

router.post('/variations', auth(['owner']), requestValidator(schema), async (req, res) => {
  try{
    const variation = await adminService.addVariation({...req.values, storeId: req.user.storeId});
    res.status(201).send({variation, success: true});
  }catch(error){
    logger('ADMIN-VARIATION-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  categoryId: Joi.number().integer().positive().allow(null),
  options: Joi.array().items(Joi.string().required()).required()
});

const updateVariationSwagger = makeSwaggerFromJoi({ 
  JoiSchema: updateSchema.keys({ id: Joi.forbidden() }), 
  route: '/variations/:id', 
  method: 'put', 
  summary: 'Update a variation', 
  tags: ['Variations'] 
});

router.put('/variations/:id', auth(['owner']), requestValidator(updateSchema), async (req, res) => {
  try{
    const variation = await adminService.updateVariation({...req.values, storeId: req.user.storeId});
    res.status(200).send({variation, success: true});
  }catch(error){
    logger('ADMIN-VARIATION-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const deleteVariationSwagger = makeSwaggerFromJoi({ 
  JoiSchema: deleteSchema.keys({ id: Joi.forbidden() }), 
  route: '/variations/:id', 
  method: 'delete', 
  summary: 'Delete a variation', 
  tags: ['Variations'] 
});

router.delete('/variations/:id', auth(['owner']), requestValidator(deleteSchema), async (req, res) => {
  try{
    await adminService.deleteVariation({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Variation deleted!', success: true});
  }catch(error){
    logger('ADMIN-VARIATION-DELETE-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const variationsSwagger = {
  '/variations': {
    ...fetchVariationsSwagger['/variations'],
    ...addVariationSwagger['/variations'],
  },
  '/variations/{id}': {
    put: {
      ...updateVariationSwagger['/variations/:id'].put,
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The unique ID of the variation',
          schema: { type: 'integer' },
        },
      ],
    },
    delete: {
      ...deleteVariationSwagger['/variations/:id'].delete,
      requestBody: undefined,
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The unique ID of the variation',
          schema: { type: 'integer' },
        },
      ],
    },
  },
}

export default router;