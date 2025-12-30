import {Router, raw } from 'express';
import {formatFromError, customJoiValidators, makeSwaggerFromJoi} from '../../../utils/helpers';
import { storeService } from '../../../services';
import { Order as OrderService } from '@storeways/lib/domain';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';
import PaymentGateway from '../../../services/integrations/PaymentGateway';

const router = Router();
const Order = new OrderService();

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

export const createOrderSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/orders', 
  method: 'post', 
  summary: 'Create an order', 
  tags: ['Payments'],
  security: false,
});

router.post('/orders', getStore(), requestValidator(schema), async (req, res) => {
  try{
    const response = await Order.processCheckout({
      storeId: req.storeId, 
      storeSettings: req.storeSettings, 
      storeName: req.storeName, 
      storeSupport: req.storeSupport,
      ...req.values
    });

    res.status(200).send({...response, success: true});
  }catch(error){
    console.error('[STORES-PAYMENTS-ORDERS-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.post('/webhook', raw({ type: "*/*" }),
  async (req, res) => {
    try{
      const paymentGateway = new PaymentGateway();
      const signature = req.headers[paymentGateway.getInstance()?.signatureKey];
  
      const { status, isVerified } = await paymentGateway.webhook(
        req.body,
        signature,
      );
  
      const { cartReferenceId, storeId, gatewayReferenceId } = paymentGateway.getMetaData(req.body);

      await Order.processOrder({ 
        cartReferenceId, 
        storeId: Number(storeId), 
        isVerified, 
        status, 
        metaData: { gatewayReferenceId }
      });

      res.status(200).send({message: 'Webhook received', success: true});
    }catch(error){
      console.error('[STORES-PAYMENTS-WEBHOOK-POST-CONTROLLER]', error);
      const {status, ...data} = formatFromError(error);
      res.status(status).send(data);
    }
});

export default router;