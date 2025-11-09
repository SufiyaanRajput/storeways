import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { reviewSrvice } from '../../../services';
import logger from '../../../loaders/logger';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  id: Joi.number().integer().positive(),
  ratings: Joi.number().required(),
  content: Joi.string().required(),
  productId: Joi.number().integer().positive().required(),
});

router.post('/reviews', auth(['customer']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await reviewSrvice.createUpdateReview({storeId: req.storeId, userId: req.user.id, ...req.values});

    res.status(201).send({message: 'Review added!', success: true});
  }catch(error){
    logger('STORES-REVIEWS-POST-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const getByProductschema = Joi.object({
  productId: Joi.number().integer().positive().required(),
});

router.get('/reviews/:productId', requestValidator(getByProductschema), getStore(), async (req, res) => {
  try{
    const reviews =  await reviewSrvice.getReviewsByProduct({storeId: req.storeId, userId: req.user ? req.user.id : null, ...req.values});

    res.status(200).send({reviews, success: true});
  }catch(error){
    logger('STORES-REVIEWS-GET-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;