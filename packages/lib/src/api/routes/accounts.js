import { Router } from 'express';
import { formatFromError } from '../utils/helpers';
import { requestValidator, auth } from '../middlewares';
import { Users } from '../../domain';
import Joi from 'joi';

const router = Router();
const userService = new Users();

const loginschema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

router.post('/login', requestValidator(loginschema), async (req, res) => {
  try{
    const user = await userService.login({...req.values, userType: 'owner'});
    res.status(200).send({success: true, user});
  }catch(error){
    console.error('[USERS-REGISTER-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.post('/logout', auth(['owner']), async (req, res) => {
  try{
    const user = await userService.logout({userId: req.user.id, token: req.authToken});
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

router.post('/password-reset-email', requestValidator(passwordResetEmailSchema), async (req, res) => {
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

router.post('/password-reset', requestValidator(passwordResetchema), async (req, res) => {
  try{
    await userService.passwordReset({...req.values, userType: 'owner'});
    res.status(200).send({success: true});
  }catch(error){
    console.error('[USERS-PASSWORD-RESET-POST-CONTROLLER]', error)
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;