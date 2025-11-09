import {Router} from 'express';
import {formatFromError, customJoiValidators} from '../../../utils/helpers';
import { orderService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

router.get('/orders', auth(['customer']), getStore(), async (req, res) => {
  try{
    const orders = await orderService.fetchOrders({storeId: req.storeId, userId: req.user.id});

    res.status(200).send({orders, success: true});
  }catch(error){
    logger('STORES-ORDERS-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const schema = Joi.object({
  referenceIds: Joi.array().required(),
  products: Joi.array().items(Joi.object()).required(),
});

router.put('/orders/cancel', auth(['customer', 'owner']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await orderService.cancelOrders({storeId: req.storeId, customerId: req.user.id, storeSupport: req.storeSupport, ...req.values});

    res.status(200).send({message: 'Orders cancelled!', success: true});
  }catch(error){
    logger('STORES-ORDERS-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;