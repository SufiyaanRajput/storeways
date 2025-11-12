import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import logger from '../../../loaders/logger';
import sanitizeHtml from 'sanitize-html';
import multer from 'multer';
import Joi from 'joi';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const updateProductImageUploadSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/products/image', 
  method: 'post', 
  summary: 'Upload a product image', 
  tags: ['Products'],
  contentType: 'multipart/form-data',
  formDataSchema: {
    type: 'object',
    required: ['productImage', 'fileName'],
    properties: {
      productImage: { type: 'string', format: 'binary' },
      fileName: { type: 'string' },
      ext: { type: 'string' },
    },
  },
});

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

const deleteProductImageSwagger = makeSwaggerFromJoi({ 
  JoiSchema: imageDeleteSchema.keys({
    imageId: Joi.forbidden(),
  }), 
  route: '/products/image/:imageId', 
  method: 'delete', 
  summary: 'Delete a product image', 
  tags: ['Products'] 
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

const updateProductSwagger = makeSwaggerFromJoi({ 
  JoiSchema: productSchema.keys({ id: Joi.forbidden() }), 
  route: '/products/:id', 
  method: 'put', 
  summary: 'Update a product', 
  tags: ['Products'] 
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

const deleteProductSwagger = makeSwaggerFromJoi({ 
  JoiSchema: deleteProductSchema.keys({
    id: Joi.forbidden(),
  }), 
  route: '/products/:id', 
  method: 'delete', 
  summary: 'Delete a product', 
  tags: ['Products'] 
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

export const updateProductsSwagger = {
  '/products/image': {
    ...updateProductImageUploadSwagger['/products/image'],
  },
  '/products/image/{imageId}': {
    delete: {
      ...deleteProductImageSwagger['/products/image/:imageId'].delete,
      parameters: [
        {
          name: 'imageId',
          in: 'path',
          required: true,
          description: 'The ID of the image to delete',
          schema: { type: 'string' },
        },
      ],
    },
  },
  '/products/{id}': {
    put: {
      ...updateProductSwagger['/products/:id'].put,
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The unique ID of the product',
          schema: { type: 'integer' },
        },
      ],
    },
    delete: {
      ...deleteProductSwagger['/products/:id'].delete,
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The unique ID of the product',
          schema: { type: 'integer' },
        },
      ],
    },
  },
}

export default router;