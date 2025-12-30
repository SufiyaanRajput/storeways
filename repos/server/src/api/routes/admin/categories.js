import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { Categories } from '@storeways/lib/domain';
import Joi from 'joi';
import _ from 'lodash';

const router = Router();
const categories = new Categories();

const addSchema = Joi.object({
  name: Joi.string().trim().required(),
  parentId: Joi.number().integer().positive().allow(null),
});

router.post('/categories', auth(['owner']), requestValidator(addSchema), async (req, res) => {
  try{
    const category = await categories.create({...req.values, storeId: req.user.storeId});
    res.status(201).send({category, success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-POST-CONTROLLER]', error);
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
    await categories.update({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category updated!', success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

router.delete('/categories/:id', auth(['owner']), requestValidator(deleteSchema), async (req, res) => {
  try{
    await categories.delete({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category deleted!', success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/categories', auth(['owner']), async (req, res) => {
  try{
    const data = await categories.fetchWithVariations({storeId: req.user.storeId});
    res.status(200).send({categories: data, success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;