import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';
import { Reviews as ReviewService } from '@storeways/lib/domain';

const router = Router();
const Review = new ReviewService();

const schema = Joi.object({
  id: Joi.number().integer().positive(),
  ratings: Joi.number().required(),
  content: Joi.string().required(),
  productId: Joi.number().integer().positive().required(),
});

router.post('/reviews', auth(['customer']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await Review.createUpdateReview({storeId: req.storeId, userId: req.user.id, ...req.values});

    res.status(201).send({message: 'Review added!', success: true});
  }catch(error){
    console.error('[STORES-REVIEWS-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const getByProductschema = Joi.object({
  productId: Joi.number().integer().positive().required(),
});

router.get('/reviews/:productId', requestValidator(getByProductschema), getStore(), async (req, res) => {
  try{
    const reviews =  await Review.getReviewsByProduct({storeId: req.storeId, userId: req.user ? req.user.id : null, ...req.values});

    res.status(200).send({reviews, success: true});
  }catch(error){
    console.error('[STORES-REVIEWS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;