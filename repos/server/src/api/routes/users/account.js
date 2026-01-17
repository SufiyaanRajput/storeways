import {Router} from 'express';
import {formatFromError, customJoiValidators} from '../../../utils/helpers';
import { getStore, requestValidator } from '../../middlewares';
import { userService } from '../../../services';
import Joi from 'joi';
import { Users } from '@storeways/lib/domain';

const router = Router();
const User = new Users();

const schema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
  storeName: Joi.string().trim().required(),
  inviteCode: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required()
});

// router.post('/register', cors(adminCorsOptions), requestValidator(schema), async (req, res) => {
//   try{
//     const user = await userService.register(req.values);
//     res.status(201).send({success: true, user});
//   }catch(error){
//     console.error('[USERS-REGISTER-POST-CONTROLLER]', error)
//     const {status, ...data} = formatFromError(error);
//     res.status(status).send(data);
//   }
// });

const customerLoginschema = Joi.object({
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
  otp: Joi.string().length(6).required(),
});

router.post('/customer-login', requestValidator(customerLoginschema), async (req, res) => {
  try{
    const user = await userService.login({...req.values, userType: 'customer'});
    res.status(200).send({success: true, user});
  }catch(error){
    console.error('[USERS-REGISTER-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const customerSchema = Joi.object({
  name: Joi.string().trim().required(),
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
});

router.post('/customer', requestValidator(customerSchema), getStore(), async (req, res) => {
  try{
    const user = await userService.registerLoginCustomer({...req.values, storeId: req.storeId});
    res.status(201).send({success: true, user});
  }catch(error){
    console.error('[USERS-CUSTOMER-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const sendOTPSchema = Joi.object({
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
});

router.post('/send-otp', requestValidator(sendOTPSchema), async (req, res) => {
  try{
    const response = await userService.sendOTPForLogin({...req.values, ip: req['x-real-ip'] || req.ip});
    res.status(200).send({success: true, response });
  }catch(error){
    console.error('[USERS-SEND-OTP-FOR-LOGIN-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;