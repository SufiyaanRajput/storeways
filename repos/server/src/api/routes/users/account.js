import {Router} from 'express';
import {formatFromError, customJoiValidators, makeSwaggerFromJoi} from '../../../utils/helpers';
import { auth, getStore, requestValidator } from '../../middlewares';
import { userService } from '../../../services';
import Joi from 'joi';
import { adminCorsOptions } from '../config.js';
import cors from 'cors';
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

export const registerSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/register', 
  method: 'post', 
  summary: 'Register store owner', 
  tags: ['Users'],
  security: false,
});

router.post('/register', cors(adminCorsOptions), requestValidator(schema), async (req, res) => {
  try{
    const user = await userService.register(req.values);
    res.status(201).send({success: true, user});
  }catch(error){
    console.error('[USERS-REGISTER-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const loginschema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

export const loginSwagger = makeSwaggerFromJoi({ 
  JoiSchema: loginschema, 
  route: '/login', 
  method: 'post', 
  summary: 'Login store owner', 
  tags: ['Users'],
  security: false,
});

router.post('/login', cors(adminCorsOptions), requestValidator(loginschema), async (req, res) => {
  try{
    const user = await User.login({...req.values, userType: 'owner'});
    res.status(200).send({success: true, user});
  }catch(error){
    console.error('[USERS-REGISTER-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const passwordResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const passwordResetEmailSwagger = makeSwaggerFromJoi({ 
  JoiSchema: passwordResetEmailSchema, 
  route: '/password-reset-email', 
  method: 'post', 
  summary: 'Send password reset email', 
  tags: ['Users'],
  security: false,
});

router.post('/password-reset-email', cors(adminCorsOptions), requestValidator(passwordResetEmailSchema), async (req, res) => {
  try{
    await userService.sendPasswordResetEmail({...req.values, userType: 'owner'});
    res.status(200).send({success: true});
  }catch(error){
    console.error('[USERS-PASSWORD-RESET-EMAIL-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const passwordResetchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().trim().required(),
  confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required()
});

export const passwordResetSwagger = makeSwaggerFromJoi({ 
  JoiSchema: passwordResetchema, 
  route: '/password-reset', 
  method: 'post', 
  summary: 'Reset password', 
  tags: ['Users'],
  security: false,
});

router.post('/password-reset', cors(adminCorsOptions), requestValidator(passwordResetchema), async (req, res) => {
  try{
    await userService.passwordReset({...req.values, userType: 'owner'});
    res.status(200).send({success: true});
  }catch(error){
    console.error('[USERS-PASSWORD-RESET-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const customerLoginschema = Joi.object({
  mobile: Joi.string().trim().custom(customJoiValidators.validateMobile).required(),
  otp: Joi.string().length(6).required(),
});

export const customerLoginSwagger = makeSwaggerFromJoi({ 
  JoiSchema: customerLoginschema, 
  route: '/customer-login', 
  method: 'post', 
  summary: 'Login customer via OTP', 
  tags: ['Users'],
  security: false,
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

export const logoutSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/logout', 
  method: 'post', 
  summary: 'Logout owner', 
  tags: ['Users'],
});

router.post('/logout', cors(adminCorsOptions), auth(['owner']), async (req, res) => {
  try{
    const user = await User.logout({userId: req.user.id, token: req.authToken});
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

export const registerCustomerSwagger = makeSwaggerFromJoi({ 
  JoiSchema: customerSchema, 
  route: '/customer', 
  method: 'post', 
  summary: 'Register/Login customer', 
  tags: ['Users'],
  security: false,
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

export const sendOTPSwagger = makeSwaggerFromJoi({ 
  JoiSchema: sendOTPSchema, 
  route: '/send-otp', 
  method: 'post', 
  summary: 'Send OTP to mobile', 
  tags: ['Users'],
  security: false,
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