import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { reviewSrvice } from '../../../services';
import { getStore, auth, requestValidator } from '../../middlewares';
import Joi from 'joi';

const router = Router();

const schema = Joi.object({
  id: Joi.number().integer().positive(),
  ratings: Joi.number().required(),
  content: Joi.string().required(),
  productId: Joi.number().integer().positive().required(),
});

export const createReviewSwagger = makeSwaggerFromJoi({ 
  JoiSchema: schema, 
  route: '/reviews', 
  method: 'post', 
  summary: 'Create or update a review', 
  tags: ['Reviews'],
  roles: ['customer'],
});

router.post('/reviews', auth(['customer']), requestValidator(schema), getStore(), async (req, res) => {
  try{
    await reviewSrvice.createUpdateReview({storeId: req.storeId, userId: req.user.id, ...req.values});

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

export const getReviewsByProductSwagger = makeSwaggerFromJoi({ 
  JoiSchema: getByProductschema.keys({
    productId: Joi.forbidden(),
  }), 
  route: '/reviews/:productId', 
  method: 'get', 
  summary: 'Fetch reviews for a product', 
  tags: ['Reviews'],
  security: false,
});

router.get('/reviews/:productId', requestValidator(getByProductschema), getStore(), async (req, res) => {
  try{
    const reviews =  await reviewSrvice.getReviewsByProduct({storeId: req.storeId, userId: req.user ? req.user.id : null, ...req.values});

    res.status(200).send({reviews, success: true});
  }catch(error){
    console.error('[STORES-REVIEWS-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const reviewsSwagger = {
  '/reviews': {
    ...createReviewSwagger['/reviews'],
  },
  '/reviews/{productId}': {
    get: {
      ...getReviewsByProductSwagger['/reviews/:productId'].get,
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          description: 'The ID of the product',
          schema: { type: 'integer' },
        },
      ],
    },
  },
}

export default router;