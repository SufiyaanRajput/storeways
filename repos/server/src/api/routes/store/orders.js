import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';
import { Order as OrderService } from '@storeways/lib/domain';

const router = Router();

const Order = new OrderService();

router.get('/orders', auth(['customer']), getStore(), async (req, res) => {
  try{
    const orders = await Order.fetchAll({storeId: req.storeId, userId: req.user.id});

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

router.put('/orders/cancel', auth(['customer', 'owner']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await Order.cancel({storeId: req.storeId, customerId: req.user.id, storeSupport: req.storeSupport, ...req.values});

    res.status(200).send({message: 'Orders cancelled!', success: true});
  }catch(error){
    console.error('[STORES-ORDERS-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;