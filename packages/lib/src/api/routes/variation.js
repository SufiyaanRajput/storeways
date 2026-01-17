import { Router } from 'express';
import { formatFromError } from '../utils/helpers';
import { requestValidator, auth } from '../middlewares';
import { Variations } from '../../domain';
import Joi from 'joi';

const router = Router();
const variations = new Variations();

router.get('/variations', auth(['owner']), async (req, res) => {
  try {
    const data = await variations.fetch({ storeId: req.user.storeId });
    res.status(200).send({ variations: data, success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const schema = Joi.object({
  name: Joi.string().trim().required(),
  categoryId: Joi.number().integer().positive().allow(null),
  options: Joi.array().items(Joi.string().required()).required(),
});

router.post('/variations', auth(['owner']), requestValidator(schema), async (req, res) => {
  try {
    const variation = await variations.create({ ...req.values, storeId: req.user.storeId });
    res.status(201).send({ variation, success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  categoryId: Joi.number().integer().positive().allow(null),
  options: Joi.array().items(Joi.string().required()).required(),
  active: Joi.boolean().required(),
});

router.put('/variations/:id', auth(['owner']), requestValidator(updateSchema), async (req, res) => {
  try {
    const variation = await variations.update({ ...req.values, storeId: req.user.storeId });
    res.status(200).send({ variation, success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

router.delete('/variations/:id', auth(['owner']), requestValidator(deleteSchema), async (req, res) => {
  try {
    await variations.delete({ ...req.values, storeId: req.user.storeId });
    res.status(200).send({ message: 'Variation deleted!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;
