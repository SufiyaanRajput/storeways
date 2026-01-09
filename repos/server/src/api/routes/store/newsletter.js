import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { getStore, requestValidator } from '../../middlewares';
import { Subscribers } from '@storeways/lib/domain';
import Joi from 'joi';

const router = Router();
const subscribersService = new Subscribers();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

export const addSubscriberSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/newsletter', 
  method: 'post', 
  summary: 'Add newsletter subscriber', 
  tags: ['Store'],
  security: false,
});

router.post('/newsletter', requestValidator(schema), getStore(), async (req, res) => {
  try{
    await subscribersService.addNewsletterSubscriber({storeId: req.storeId, ...req.values});

    res.status(201).send({message: 'Subscriber added!', success: true});
  }catch(error){
    console.error('[STORES-NEWSLETTER-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});


export default router;