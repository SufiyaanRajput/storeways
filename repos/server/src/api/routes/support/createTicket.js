import {Router} from 'express';
import {formatJoiData, formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import {supportService} from '../../../services';
import {auth} from '../../middlewares';
import Joi from 'joi';

const router = Router();

const ticketSchema = Joi.object({
  subject: Joi.string().required().max(100),
  description: Joi.string().required().max(1300),
  classification: Joi.string().required().valid('Problem', 'Request', 'Question', 'Others'),
  priority: Joi.string().required().valid('High', 'Medium', 'Low'),
  category: Joi.string().valid('General', 'Defects').required().default('General')
});

export const supportSwagger = makeSwaggerFromJoi({ 
  JoiSchema: ticketSchema, 
  route: '/tickets', 
  method: 'post', 
  summary: 'Create a support ticket', 
  tags: ['Support'] 
});

router.post('/tickets', auth(), async (req, res) => {
  try{
    const validatedData = ticketSchema.validate(req.body, {abortEarly: false});
    const {values, errors, isInValid} = formatJoiData(validatedData);

    if(isInValid){
      throw {status: 400, msgText: 'Invalid data!', data: {errors}, error: new Error};
    }

    const message = await supportService.createTicket({user: req.user, ...values});
    res.status(201).send({message, success: true});
  }catch(error){
    console.log(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;