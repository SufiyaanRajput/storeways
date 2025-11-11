import {Router} from 'express';
import {formatFromError, customJoiValidators} from '../../../utils/helpers';
import { storeService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  amount: Joi.number().positive().required(),
  name: Joi.string().required(), 
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(), 
  address: Joi.string().required(),
  landmark: Joi.string().required(),
  pincode: Joi.string().required(),
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  products: Joi.array().items(Joi.object()).required(),
  paymentMode: Joi.string().valid('online', 'cod').required(),
});

router.post('/orders', getStore(), requestValidator(schema), async (req, res) => {
  try{
    const response = await storeService.createOrder({
      storeId: req.storeId, 
      storeSettings: req.storeSettings, 
      storeName: req.storeName, 
      storeSupport: req.storeSupport,
      ...req.values
    });

    res.status(200).send({...response, success: true});
  }catch(error){
    logger('STORES-PAYMENTS-ORDERS-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const confirmSchema = Joi.object({
  products: Joi.array().items(Joi.object()).required(),
  razorpayPaymentId: Joi.string().required(), 
  razorpayOrderId: Joi.string().required(), 
  razorpaySignature: Joi.string().required(), 
  orderIds: Joi.array().items(Joi.number().integer().positive()).required()
});

router.post('/confirm', getStore(), auth(['customer']), requestValidator(confirmSchema), async (req, res) => {
  try{
    await storeService.confirmPayment({
      storeId: req.storeId, 
      user: req.user, 
      storeSettings: req.storeSettings,
      storeName: req.storeName, 
      storeSupport: req.storeSupport, 
      ...req.values,
    });

    res.status(200).send({message: 'Order confirmed succesfully', success: true});
  }catch(error){
    logger('STORES-PAYMENTS-CONFIRM-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;