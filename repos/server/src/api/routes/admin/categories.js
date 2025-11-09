import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import Joi from 'joi';

const router = Router();

const addSchema = Joi.object({
  name: Joi.string().trim().required(),
  parentId: Joi.number().integer().positive().allow(null),
});

router.post('/categories', auth(['owner']), requestValidator(addSchema), async (req, res) => {
  try{
    const category = await adminService.addCategory({...req.values, storeId: req.user.storeId});
    res.status(201).send({category, success: true});
  }catch(error){
    logger('ADMIN-CATEGORIES-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  active: Joi.boolean(),
  parentId: Joi.number().integer().positive().allow(null),
});

router.put('/categories/:id', auth(['owner']), requestValidator(updateSchema), async (req, res) => {
  try{
    await adminService.editCategory({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category updated!', success: true});
  }catch(error){
    logger('ADMIN-CATEGORIES-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

router.delete('/categories/:id', auth(['owner']), requestValidator(deleteSchema), async (req, res) => {
  try{
    await adminService.deleteCategory({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category deleted!', success: true});
  }catch(error){
    logger('ADMIN-CATEGORIES-DELETE-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/categories', auth(['owner']), async (req, res) => {
  try{
    const categories = await adminService.fetchCategories({storeId: req.user.storeId});
    res.status(200).send({categories, success: true});
  }catch(error){
    logger('ADMIN-CATEGORIES-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;