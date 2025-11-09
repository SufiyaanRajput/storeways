import {Router} from 'express';
import {formatFromError} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import sanitizeHtml from 'sanitize-html';
import multer from 'multer';
import Joi from 'joi';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/products/image', auth(['owner']), upload.single('productImage'), async (req, res) => {
  try{
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({message: 'Invalid request payload!', success: false});
    }

    const image = await adminService.addImage({fileName: req.body.fileName, file: req.file.buffer, ext: req.body.ext});
    res.status(200).send({image, message: 'Images updated successfully!', success: true});
  }catch(error){
    logger('ADMIN-PRODUCTS-IMAGES-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const imageDeleteSchema = Joi.object({
  imageId: Joi.string().required(),
});

router.delete('/products/image/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try{
    const { imageId } = req.values;
    await adminService.deleteProductImage({imageId});
    res.status(200).send({message: 'Image deleted successfully!', success: true});
  }catch(error){
    logger('ADMIN-PRODUCTS-IMAGES-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const productSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().max(255).required(),
  sku: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('').allow(null),
  maxOrderQuantity: Joi.number().integer(),
  images: Joi.array().required(),
  returnPolicy: Joi.string().trim().allow('').allow(null),
  categoryIds: Joi.array().required(),
  price: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  variations: Joi.array().items(Joi.object().keys({
    maxOrderQuantity: Joi.number().integer(),
    price: Joi.number().positive().required().allow(0),
    stock: Joi.number().integer().positive().required().allow(0),
    variationGroup: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })),
  })),
});

router.put('/products/:id', auth(['owner']), requestValidator(productSchema), async (req, res) => {
  try{
    const description = sanitizeHtml(req.values.description);
    const returnPolicy = sanitizeHtml(req.values.returnPolicy);
    await adminService.updateProduct({...req.values, description, returnPolicy, storeId: req.user.storeId});
    res.status(200).send({message: 'Product updated successfully!', success: true});
  }catch(error){
    logger('ADMIN-PRODUCTS-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteProductSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

router.delete('/products/:id', auth(['owner']), requestValidator(deleteProductSchema), async (req, res) => {
  try{
    await adminService.deleteProduct({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Product updated successfully!', success: true});
  }catch(error){
    logger('ADMIN-PRODUCTS-PUT-CONTROLLER').error(error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;