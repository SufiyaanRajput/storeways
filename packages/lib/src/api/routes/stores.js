import { Router } from 'express';
import { formatFromError } from '../utils/helpers';
import { requestValidator, auth } from '../middlewares';
import multer from 'multer';
import Joi from 'joi';
import { getAdapter } from '../../boot/loaders/adapters';
import { Store } from '../../domain';

const router = Router();

const storeService = new Store();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getFileStorage = () => {
  const fileStorage = getAdapter('fileStorage');
  if (!fileStorage) {
    throw { status: 500, msgText: 'File storage adapter not configured', error: new Error() };
  }
  return fileStorage;
};

router.post('/uploads/logo', auth(['owner']), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({ message: 'Invalid request payload!', success: false });
    }

    const storageAdapter = getFileStorage();
    const { url, fileId } = await storageAdapter.upload(
      req.file.buffer,
      `${req.body.fileName}.${req.body.ext}`,
      'uploads/logo'
    );
    res.status(200).send({
      logo: {
        url,
        fileId,
        name: req.body.fileName,
      },
      message: 'Logo uploaded successfully!',
      success: true,
    });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const imageDeleteSchema = Joi.object({
  imageId: Joi.string().required(),
});

router.delete('/uploads/logo/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try {
    const { imageId } = req.values;
    // await adminService.deleteImageService({imageId});
    res.status(200).send({ message: 'Logo deleted successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const storeSettingsSchema = Joi.object({
  logoText: Joi.string().required(),
  domain: Joi.string(),
  brandColor: Joi.string().required(),
  navBackgroundColor: Joi.string().required(),
  navTextColor: Joi.string().required(),
  logo: Joi.object().allow(null),
  filesToDelete: Joi.array(),
  isOnlinePaymentEnabled: Joi.boolean(),
  otherCharges: Joi.object({
    value: Joi.number().integer().positive().required(),
    type: Joi.string().required(),
  }),
  tax: Joi.object({
    value: Joi.number().integer().positive().required(),
    type: Joi.string().required(),
  }),
});

router.put('/customize/store', auth(['owner']), requestValidator(storeSettingsSchema), async (req, res) => {
  try {
    req.values.storeId = req.user.storeId;
    await storeService.updateSettings(req.values);
    res.status(200).send({ message: 'Theme updated successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const footerSchema = Joi.object({
  bgColor: Joi.object({
    r: Joi.number().required(),
    g: Joi.number().required(),
    b: Joi.number().required(),
    a: Joi.number().required(),
  }).required(),
  logo: Joi.object().allow(null),
  filesToDelete: Joi.array(),
  copyrightText: Joi.string(),
  email: Joi.string(),
  officeAddress: Joi.string(),
  phone: Joi.string(),
  summary: Joi.string(),
  sections: Joi.array(),
  facebook: Joi.string(),
  twitter: Joi.string(),
  instagram: Joi.string(),
});

router.put('/customize/footer', auth(['owner']), requestValidator(footerSchema), async (req, res) => {
  try {
    req.values.storeId = req.user.storeId;
    await storeService.updateFooter(req.values);
    res.status(200).send({ message: 'Footer updated successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/customize/settings', auth(['owner']), async (req, res) => {
  try {
    const store = await storeService.getSettingByKey({ storeId: req.user.storeId, key: 'store' });
    res.status(200).send({ store, message: 'Fetched theme successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/customize/footer', auth(['owner']), async (req, res) => {
  try {
    const footer = await storeService.getSettingByKey({ storeId: req.user.storeId, key: ['footer'] });
    res.status(200).send({ footer, message: 'Fetched theme successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const pageLayoutSchema = Joi.object({
  page: Joi.string().required(),
});

router.get('/customize/layout/:page', auth(['owner']), requestValidator(pageLayoutSchema), async (req, res) => {
  try {
    const layout = await storeService.getLayout({ storeId: req.user.storeId, ...req.values });
    res.status(200).send({ layout, message: 'Fetched layout successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const updatePageLayoutSchema = Joi.object({
  page: Joi.string().required(),
  layout: Joi.array().min(3).required(),
});

router.put('/customize/layout/:page', auth(['owner']), requestValidator(updatePageLayoutSchema), async (req, res) => {
  try {
    await storeService.updateLayout({ storeId: req.user.storeId, ...req.values });
    res.status(200).send({ message: 'Update layout successfull!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.post('/uploads/banner', auth(['owner']), upload.single('banner'), async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({ message: 'Invalid request payload!', success: false });
    }

    const storageAdapter = getFileStorage();
    const { url, fileId } = await storageAdapter.upload(
      req.file.buffer,
      `${req.body.fileName}.${req.body.ext}`,
      'uploads/banners'
    );
    res.status(200).send({
      banner: {
        url,
        fileId,
        name: req.body.fileName,
      },
      message: 'Banner uploaded successfully!',
      success: true,
    });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.delete('/uploads/banner/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try {
    const { imageId } = req.values;
    // await adminService.deleteImageService({imageId});
    res.status(200).send({ message: 'Banner deleted successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const updatePageLayoutSectionSchema = Joi.object({
  page: Joi.string().required(),
  sectionId: Joi.string().required(),
  banners: Joi.array().min(2).max(5),
  banner: Joi.object(),
  filesToDelete: Joi.array(),
  posters: Joi.array().min(1).max(3),
  products: Joi.object({
    type: Joi.string().required(),
    limit: Joi.number().integer().max(10).min(1).required(),
  }),
  sectionBgColor: Joi.object({
    r: Joi.number().required(),
    g: Joi.number().required(),
    b: Joi.number().required(),
    a: Joi.number().required(),
  }),
  features: Joi.array().min(1).max(6),
});

router.put(
  '/customize/layout/:page/sections/:sectionId',
  auth(['owner']),
  requestValidator(updatePageLayoutSectionSchema),
  async (req, res) => {
    try {
      await storeService.updateSection({ storeId: req.user.storeId, ...req.values });
      res.status(200).send({ message: 'Update layout successfull!', success: true });
    } catch (error) {
      const { status, ...data } = formatFromError(error);
      res.status(status).send(data);
    }
  }
);

router.post('/uploads/poster', auth(['owner']), upload.single('poster'), async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({ message: 'Invalid request payload!', success: false });
    }

    const storageAdapter = getFileStorage();
    const { url, fileId } = await storageAdapter.upload(
      req.file.buffer,
      `${req.body.fileName}.${req.body.ext}`,
      'uploads/posters'
    );
    res.status(200).send({
      poster: {
        url,
        fileId,
        name: req.body.fileName,
      },
      message: 'Poster uploaded successfully!',
      success: true,
    });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.delete('/uploads/poster/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try {
    const { imageId } = req.values;
    // await adminService.deleteImageService({imageId});
    res.status(200).send({ message: 'Poster deleted successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.post('/uploads/footer/logo', auth(['owner']), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({ message: 'Invalid request payload!', success: false });
    }

    const storageAdapter = getFileStorage();
    const { url, fileId } = await storageAdapter.upload(
      req.file.buffer,
      `${req.body.fileName}.${req.body.ext}`,
      'uploads/logo'
    );
    res.status(200).send({
      logo: {
        url,
        fileId,
        name: req.body.fileName,
      },
      message: 'Logo uploaded successfully!',
      success: true,
    });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.delete('/uploads/footer/logo/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try {
    const { imageId } = req.values;
    // await adminService.deleteImageService({imageId});
    res.status(200).send({ message: 'Logo deleted successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const storeSchema = Joi.object({
  termsOfService: Joi.string().trim().allow(''),
  privacyPolicy: Joi.string().trim().allow(''),
  domain: Joi.string().trim().allow(''),
});

router.put('/stores', auth(['owner']), requestValidator(storeSchema), async (req, res) => {
  try {
    req.values.storeId = req.user.storeId;
    await storeService.updateStore(req.values);
    res.status(200).send({ message: 'Footer updated successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const switchStoreSchema = Joi.object({
  storeId: Joi.number().integer().positive().required(),
});

router.get('/stores/switch/:storeId', auth(['owner']), requestValidator(switchStoreSchema), async (req, res) => {
  try {
    const token = await storeService.switch({ storeId: req.values.storeId, user: req.user });
    res.status(200).send({ token, message: 'Store switched successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

router.get('/stores', auth(['owner']), async (req, res) => {
  try {
    const stores = await storeService.fetch({ deletedAt: null });
    res.status(200).send({ stores, message: 'Stores fetched successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

const createStoreSchema = Joi.object({
  name: Joi.string().trim().required(),
});

router.post('/stores', auth(['owner']), requestValidator(createStoreSchema), async (req, res) => {
  try {
    const store = await storeService.create({ ...req.values, userId: req.user.id });
    res.status(200).send({ store, message: 'Store created successfully!', success: true });
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    res.status(status).send(data);
  }
});

export default router;
