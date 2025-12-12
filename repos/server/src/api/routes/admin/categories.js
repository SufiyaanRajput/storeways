import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import Joi from 'joi';
import _ from 'lodash';

const router = Router();

const addSchema = Joi.object({
  name: Joi.string().trim().required(),
  parentId: Joi.number().integer().positive().allow(null),
});

const addCategorySwagger = makeSwaggerFromJoi({ 
  JoiSchema: addSchema, 
  route: '/categories', 
  method: 'post', 
  summary: 'Create a category', 
  tags: ['Categories'] 
});

router.post('/categories', auth(['owner']), requestValidator(addSchema), async (req, res) => {
  try{
    const category = await adminService.addCategory({...req.values, storeId: req.user.storeId});
    res.status(201).send({category, success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
  active: Joi.boolean(),
  parentId: Joi.number().integer().positive().allow(null),
});

const updateCategorySwagger = makeSwaggerFromJoi({ 
  JoiSchema: updateSchema.keys({
    id: Joi.forbidden(),
  }), 
  route: '/categories/:id', 
  method: 'put', 
  summary: 'Update a category', 
  tags: ['Categories'] 
});

router.put('/categories/:id', auth(['owner']), requestValidator(updateSchema), async (req, res) => {
  try{
    await adminService.editCategory({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category updated!', success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const deleteCategorySwagger = makeSwaggerFromJoi({ 
  JoiSchema: deleteSchema.keys({
    id: Joi.forbidden(),
  }), 
  route: '/categories/:id', 
  method: 'delete', 
  summary: 'Delete a category', 
  tags: ['Categories'] 
});

router.delete('/categories/:id', auth(['owner']), requestValidator(deleteSchema), async (req, res) => {
  try{
    await adminService.deleteCategory({...req.values, storeId: req.user.storeId});
    res.status(200).send({message: 'Category deleted!', success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const fetchCategorySwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/categories', 
  method: 'get', 
  summary: 'Fetch categories', 
  tags: ['Categories'] 
});

router.get('/categories', auth(['owner']), async (req, res) => {
  try{
    const categories = await adminService.fetchCategories({storeId: req.user.storeId});
    res.status(200).send({categories, success: true});
  }catch(error){
    console.error('[ADMIN-CATEGORIES-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const categoriesSwagger = {
  '/categories': {
    ...addCategorySwagger['/categories'],
    ...fetchCategorySwagger['/categories'],
  },
  '/categories/{id}': {
    put: {
      ...updateCategorySwagger['/categories/:id'].put,
      parameters: [
        {
          name: 'id',
          in: 'path', // 👈 tells Swagger it's from the URL
          required: true,
          description: 'The unique ID of the category',
          schema: {
            type: 'string',
          },
        },
      ],
    },
    ...{
      delete: {
        ...deleteCategorySwagger['/categories/:id'].delete,
        parameters: [
          {
            name: 'id',
            in: 'path', // 👈 tells Swagger it's from the URL
            required: true,
            description: 'The unique ID of the category',
            schema: {
              type: 'string',
            },
          },
        ],
      }
    },
  }
}

export default router;