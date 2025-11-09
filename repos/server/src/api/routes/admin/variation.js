import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import Joi from 'joi';

const router = Router();

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

export default router;