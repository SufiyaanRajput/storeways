import {Router} from 'express';
import {formatFromError, customJoiValidators, makeSwaggerFromJoi} from '../../../utils/helpers';
import { orderService } from '../../../services';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

export const myOrdersSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/orders', 
  method: 'get', 
  summary: 'Fetch my orders', 
  tags: ['Orders'],
  roles: ['customer'],
});

router.get('/orders', auth(['customer']), getStore(), async (req, res) => {
  try{
    const orders = await orderService.fetchOrders({storeId: req.storeId, userId: req.user.id});

    res.status(200).send({orders, success: true});
  }catch(error){
    console.error('[STORES-ORDERS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const schema = Joi.object({
  referenceIds: Joi.array().required(),
  products: Joi.array().items(Joi.object()).required(),
});

export const cancelStoreOrdersSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/orders/cancel', 
  method: 'put', 
  summary: 'Cancel my orders', 
  tags: ['Orders'],
  roles: ['owner', 'customer'],
});

router.put('/orders/cancel', auth(['customer', 'owner']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await orderService.cancelOrders({storeId: req.storeId, customerId: req.user.id, storeSupport: req.storeSupport, ...req.values});

    res.status(200).send({message: 'Orders cancelled!', success: true});
  }catch(error){
    console.error('[STORES-ORDERS-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;