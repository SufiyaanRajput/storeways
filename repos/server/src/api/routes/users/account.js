import {Router} from 'express';
import {formatFromError, customJoiValidators} from '../../../utils/helpers';
import { auth, getStore, requestValidator } from '../../middlewares';
import { userService } from '../../../services';
import logger from '../../../loaders/logger';
import Joi from 'joi';
import { adminCorsOptions } from '../config.js';
import cors from 'cors';

const router = Router();

const schema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
  storeName: Joi.string().trim().required(),
  inviteCode: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required()
});

router.post('/register', cors(adminCorsOptions), requestValidator(schema), async (req, res) => {
  try{
    const user = await userService.register(req.values);
    res.status(201).send({success: true, user});
  }catch(error){
    logger('USERS-REGISTER-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const loginschema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

router.post('/login', cors(adminCorsOptions), requestValidator(loginschema), async (req, res) => {
  try{
    const user = await userService.login({...req.values, userType: 'owner'});
    res.status(200).send({success: true, user});
  }catch(error){
    logger('USERS-REGISTER-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const passwordResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

router.post('/password-reset-email', cors(adminCorsOptions), requestValidator(passwordResetEmailSchema), async (req, res) => {
  try{
    await userService.sendPasswordResetEmail({...req.values, userType: 'owner'});
    res.status(200).send({success: true});
  }catch(error){
    logger('USERS-PASSWORD-RESET-EMAIL-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const passwordResetchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().trim().required(),
  confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required()
});

router.post('/password-reset', cors(adminCorsOptions), requestValidator(passwordResetchema), async (req, res) => {
  try{
    await userService.passwordReset({...req.values, userType: 'owner'});
    res.status(200).send({success: true});
  }catch(error){
    logger('USERS-PASSWORD-RESET-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const customerLoginschema = Joi.object({
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
  otp: Joi.string().length(6).required(),
});

router.post('/customer-login', requestValidator(customerLoginschema), async (req, res) => {
  try{
    const user = await userService.login({...req.values, userType: 'customer'});
    res.status(200).send({success: true, user});
  }catch(error){
    logger('USERS-REGISTER-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.post('/logout', cors(adminCorsOptions), auth(['owner']), async (req, res) => {
  try{
    const user = await userService.logout({userId: req.user.id, token: req.authToken});
    res.status(200).send({success: true, user});
  }catch(error){
    logger('USERS-REGISTER-POST-CONTROLLER').error(error)
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
    logger('USERS-CUSTOMER-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const sendOTPSchema = Joi.object({
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
});

router.post('/send-otp', requestValidator(sendOTPSchema), async (req, res) => {
  try{
    const user = await userService.sendOTPForLogin({...req.values, ip: req['x-real-ip'] || req.ip});
    res.status(200).send({success: true});
  }catch(error){
    logger('USERS-SEND-OTP-FOR-LOGIN-POST-CONTROLLER').error(error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;