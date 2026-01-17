import { Router } from 'express';
import { formatFromError } from '../utils/helpers';
import { requestValidator, auth, getStore } from '../middlewares';
import sanitizeHtml from 'sanitize-html';
import { Product } from '../../domain';
import Joi from 'joi';
import multer from 'multer';
import { getAdapter } from '../../boot/loaders/adapters';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const product = new Product();

const getFileStorage = () => {
  const fileStorage = getAdapter('fileStorage');
  if (!fileStorage) {
    throw { status: 500, msgText: 'File storage adapter not configured', error: new Error() };
  }
  return fileStorage;
};

router.post('/products/image', auth(['owner']), upload.single('productImage'), async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({ message: 'Invalid request payload!', success: false });
    }

    const storageAdapter = getFileStorage();
    const { url, fileId } = await storageAdapter.upload(
      req.file.buffer,
      `${req.body.fileName}.${req.body.ext}`,
      'uploads/products'
    );
    res.status(200).send({
      image: {
        url,
        fileId,
        name: req.body.fileName,
      },
      message: 'Images updated successfully!',
      success: true,
    });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const createProductSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  sku: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('').allow(null),
  maxOrderQuantity: Joi.number().integer().allow(null),
  images: Joi.array().required(),
  returnPolicy: Joi.string().trim().allow('').allow(null),
  categoryIds: Joi.array().required(),
  price: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  variations: Joi.array().items(
    Joi.object().keys({
      maxOrderQuantity: Joi.number().integer().allow(null),
      price: Joi.number().positive().required().allow(0),
      stock: Joi.number().integer().positive().required().allow(0),
      images: Joi.array(),
      variationGroup: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          value: Joi.string().required(),
        })
      ),
    })
  ),
});

router.post('/products', auth(['owner']), requestValidator(createProductSchema), async (req, res) => {
  try {
    const description = sanitizeHtml(req.values.description);
    const returnPolicy = sanitizeHtml(req.values.returnPolicy);
    const data = await product.create({ ...req.values, description, returnPolicy, storeId: req.user.storeId });
    res.status(201).send({ product: data, success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const fetchProductsSchema = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.array().items(Joi.number().integer().positive())
  ),
  limit: Joi.number().integer().positive(),
  type: Joi.string().valid('MOST_RATED', 'BEST_SELLING', 'LATEST'),
  categories: Joi.array(),
});

router.get('/products/:id?', auth(['owner'], true), requestValidator(fetchProductsSchema), getStore(), async (req, res) => {
  try {
    if (req.values.id) {
      if (Array.isArray(req.values.id)) {
        const data = await product.fetchByIds(req.values.id);
        return res.status(200).send({ products: data, success: true });
      }

      const data = await product.fetch({ storeId: req.storeId, id: req.params.id, deletedAt: null, active: true });
      return res.status(200).send({ product: data, success: true });
    }

    const data = await product.fetchAll({ storeId: req.storeId, ...req.values });
    res.status(200).send({ products: data, success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteProductSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

router.delete('/products/:id', auth(['owner']), requestValidator(deleteProductSchema), async (req, res) => {
  try {
    await product.delete({ ...req.values, storeId: req.user.storeId });
    res.status(200).send({ message: 'Product updated successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const productSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().max(255).required(),
  sku: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().allow('').allow(null),
  maxOrderQuantity: Joi.number().integer().allow(null),
  images: Joi.array().required(),
  returnPolicy: Joi.string().trim().allow('').allow(null),
  categoryIds: Joi.array().required(),
  price: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  variations: Joi.array().items(
    Joi.object().keys({
      maxOrderQuantity: Joi.number().integer().allow(null),
      price: Joi.number().positive().required().allow(0),
      stock: Joi.number().integer().positive().required().allow(0),
      images: Joi.array(),
      variationGroup: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          value: Joi.string().required(),
        })
      ),
    })
  ),
});

router.put('/products/:id', auth(['owner']), requestValidator(productSchema), async (req, res) => {
  try {
    const description = sanitizeHtml(req.values.description);
    const returnPolicy = sanitizeHtml(req.values.returnPolicy);
    await product.update({ ...req.values, description, returnPolicy, storeId: req.user.storeId });
    res.status(200).send({ message: 'Product updated successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;
