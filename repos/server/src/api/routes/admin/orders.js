import {Router} from 'express';
import {formatFromError, customJoiValidators, makeSwaggerFromJoi} from '../../../utils/helpers';
import { orderService } from '../../../services';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const getSchema = Joi.object({
  textSearchType: Joi.string(),
  search: Joi.string(),
  deliveryStatus: Joi.number().integer().allow(null),
  page: Joi.number().integer().required(),
});

const getOrdersSwagger = makeSwaggerFromJoi({ 
  JoiSchema: getSchema, 
  route: '/orders', 
  method: 'get', 
  summary: 'Fetch orders', 
  tags: ['Orders'] 
});

router.get('/orders', auth(['owner']), requestValidator(getSchema), async (req, res) => {
  try{
    const { orders, deliveryStatuses } = await orderService.fetchOrders({storeId: req.storeId, admin: true, ...req.values});

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

const cancelOrdersSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema.keys({
    products: Joi.forbidden(),
  }), 
  route: '/orders/cancel', 
  method: 'put', 
  summary: 'Cancel orders', 
  tags: ['Orders'] 
});

router.put('/orders/cancel', auth(['owner']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await orderService.cancelOrders({storeId: req.storeId, storeSupport: req.storeSupport, admin: true, ...req.values});

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

const updateOrdersSwagger = makeSwaggerFromJoi({ 
  JoiSchema: updateOrderSchema, 
  route: '/orders', 
  method: 'put', 
  summary: 'Update orders', 
  tags: ['Orders'] 
});

router.put('/orders', auth(['owner']), requestValidator(updateOrderSchema), getStore(), async (req, res) => {
  try{
    await orderService.updateOrder({storeId: req.storeId, storeSupport: req.storeSupport, ...req.values});

    res.status(200).send({message: 'Order updated!', success: true});
  }catch(error){
    console.error('[ADMIN-ORDER-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const ordersSwagger = {
  '/orders': {
    ...getOrdersSwagger['/orders'],
    ...updateOrdersSwagger['/orders'],
  },
  ...cancelOrdersSwagger,
}


export default router;