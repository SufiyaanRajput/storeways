import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { newsletterService } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

router.post('/newsletter', requestValidator(schema), getStore(), async (req, res) => {
  try{
    await newsletterService.addSubscriber({storeId: req.storeId, ...req.values});

    res.status(201).send({message: 'Subscriber added!', success: true});
  }catch(error){
    logger('STORES-NEWSLETTER-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});


export default router;