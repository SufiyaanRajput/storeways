import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { Order } from '@storeways/lib/domain';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const orderService = new Order();
const router = Router();

const getSchema = Joi.object({
  textSearchType: Joi.string(),
  search: Joi.string(),
  deliveryStatus: Joi.number().integer().allow(null),
  page: Joi.number().integer().required(),
  filters: Joi.string(),
});

router.get('/orders', auth(['owner']), requestValidator(getSchema), async (req, res) => {
  try{
    const { filters: rawFilters, ...rest } = req.values;
    let filters = [];
    if (rawFilters) {
      try {
        const parsed = typeof rawFilters === 'string' ? JSON.parse(rawFilters) : rawFilters;
        filters = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        filters = [];
      }
    }

    const { orders, deliveryStatuses } = await orderService.fetchAll({storeId: req.storeId, admin: true, filters, ...rest});

    res.status(200).send({orders, deliveryStatuses, success: true});
  }catch(error){
    console.error('[ADMIN-ORDERS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const schema = Joi.object({
  referenceIds: Joi.array().required(),
  customerId: Joi.number().integer().positive().required(),
  products: Joi.array().items(Joi.object()).required(),
});

router.put('/orders/cancel', auth(['owner']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await orderService.cancel({storeId: req.storeId, storeSupport: req.storeSupport, admin: true, ...req.values});

    res.status(200).send({message: 'Orders cancelled!', success: true});
  }catch(error){
    console.error('[ADMIN-ORDERS-CANCEL-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const updateOrderSchema = Joi.object({
  referenceId: Joi.string().required(),
  customerId: Joi.number().integer().positive().required(),
  deliveryStatus: Joi.number().integer().positive().allow(0).required(),
});

router.put('/orders', auth(['owner']), requestValidator(updateOrderSchema), getStore(), async (req, res) => {
  try{
    await orderService.update({storeId: req.storeId, storeSupport: req.storeSupport, ...req.values});

    res.status(200).send({message: 'Order updated!', success: true});
  }catch(error){
    console.error('[ADMIN-ORDER-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/orders/filters', auth(['owner']), async (req, res) => {
  try{
    const filters = await orderService.getOrderFilters();
    res.status(200).send({filters, success: true});
  }catch(error){
    console.error('[ADMIN-ORDERS-FILTERS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});


export default router;