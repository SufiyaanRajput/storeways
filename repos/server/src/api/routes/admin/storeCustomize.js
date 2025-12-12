import {Router} from 'express';
import {formatFromError, makeSwaggerFromJoi} from '../../../utils/helpers';
import { requestValidator, auth } from '../../middlewares';
import { adminService } from '../../../services';
import multer from 'multer';
import Joi from 'joi';

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const uploadLogoSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/uploads/logo', 
  method: 'post', 
  summary: 'Upload a logo', 
  tags: ['Customize'],
  contentType: 'multipart/form-data',
  formDataSchema: {
    type: 'object',
    required: ['logo', 'fileName'],
    properties: {
      logo: { type: 'string', format: 'binary' },
      fileName: { type: 'string' },
    },
  },
});

router.post('/uploads/logo', auth(['owner']), upload.single('logo'), async (req, res) => {
  try{
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({message: 'Invalid request payload!', success: false});
    }

    const logo = await adminService.uploadImageService({fileName: req.body.fileName, file: req.file.buffer, folder: '/logo'});
    res.status(200).send({logo, message: 'Logo uploaded successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-LOGO-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const imageDeleteSchema = Joi.object({
  imageId: Joi.string().required(),
});

const deleteLogoSwagger = makeSwaggerFromJoi({ 
  JoiSchema: imageDeleteSchema.keys({
    imageId: Joi.forbidden(),
  }), 
  route: '/uploads/logo/:imageId', 
  method: 'delete', 
  summary: 'Delete a logo image', 
  tags: ['Customize'] 
});

router.delete('/uploads/logo/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try{
    const { imageId } = req.values;
    await adminService.deleteImageService({imageId});
    res.status(200).send({message: 'Logo deleted successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-LOGO-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
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
    type: Joi.string().required()
  }),
  tax: Joi.object({
    value: Joi.number().integer().positive().required(),
    type: Joi.string().required()
  })
});

const updateStoreSettingsSwagger = makeSwaggerFromJoi({ 
  JoiSchema: storeSettingsSchema, 
  route: '/customize/store', 
  method: 'put', 
  summary: 'Update store settings', 
  tags: ['Customize'] 
});

router.put('/customize/store', auth(['owner']), requestValidator(storeSettingsSchema), async (req, res) => {
  try{
    req.values.storeId = req.user.storeId;
    await adminService.updateStoreSettings(req.values);
    res.status(200).send({message: 'Theme updated successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-THEME-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const footerSchema = Joi.object({
  bgColor: Joi.object({
    r: Joi.number().required(),
    g: Joi.number().required(),
    b: Joi.number().required(),
    a: Joi.number().required()
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

const updateFooterSwagger = makeSwaggerFromJoi({ 
  JoiSchema: footerSchema, 
  route: '/customize/footer', 
  method: 'put', 
  summary: 'Update footer', 
  tags: ['Customize'] 
});

router.put('/customize/footer', auth(['owner']), requestValidator(footerSchema), async (req, res) => {
  try{
    req.values.storeId = req.user.storeId;
    await adminService.updateFooter(req.values);
    res.status(200).send({message: 'Footer updated successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-FOOTER-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const getStoreSettingsSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/customize/settings', 
  method: 'get', 
  summary: 'Fetch store settings', 
  tags: ['Customize'] 
});

router.get('/customize/settings', auth(['owner']), async (req, res) => {
  try{
    const store = await adminService.getSettingByKey({ storeId: req.user.storeId, key: 'store' });
    res.status(200).send({store, message: 'Fetched theme successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-THEME-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const getFooterSettingsSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/customize/footer', 
  method: 'get', 
  summary: 'Fetch footer settings', 
  tags: ['Customize'] 
});

router.get('/customize/footer', auth(['owner']), async (req, res) => {
  try{
    const footer = await adminService.getSettingByKey({ storeId: req.user.storeId, key: ['footer'] });
    res.status(200).send({footer, message: 'Fetched theme successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-FOOTER-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const pageLayoutSchema = Joi.object({
  page: Joi.string().required(),
});

const getPageLayoutSwagger = makeSwaggerFromJoi({ 
  JoiSchema: pageLayoutSchema.keys({ page: Joi.forbidden() }), 
  route: '/customize/layout/:page', 
  method: 'get', 
  summary: 'Fetch layout for a page', 
  tags: ['Customize'] 
});

router.get('/customize/layout/:page', auth(['owner']), requestValidator(pageLayoutSchema), async (req, res) => {
  try{
    const layout = await adminService.getLayout({ storeId: req.user.storeId, ...req.values });
    res.status(200).send({layout, message: 'Fetched layout successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-LAYOUT-GET-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const updatePageLayoutSchema = Joi.object({
  page: Joi.string().required(),
  layout: Joi.array().min(3).required(),
});

const updatePageLayoutSwagger = makeSwaggerFromJoi({ 
  JoiSchema: updatePageLayoutSchema.keys({ page: Joi.forbidden() }), 
  route: '/customize/layout/:page', 
  method: 'put', 
  summary: 'Update layout for a page', 
  tags: ['Customize'] 
});

router.put('/customize/layout/:page', auth(['owner']), requestValidator(updatePageLayoutSchema), async (req, res) => {
  try{
    await adminService.updateLayout({ storeId: req.user.storeId, ...req.values });
    res.status(200).send({message: 'Update layout successfull!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-LAYOUT-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const uploadBannerSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/uploads/banner', 
  method: 'post', 
  summary: 'Upload a banner', 
  tags: ['Customize'],
  contentType: 'multipart/form-data',
  formDataSchema: {
    type: 'object',
    required: ['banner', 'fileName'],
    properties: {
      banner: { type: 'string', format: 'binary' },
      fileName: { type: 'string' },
    },
  },
});

router.post('/uploads/banner', auth(['owner']), upload.single('banner'), async (req, res) => {
  try{
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({message: 'Invalid request payload!', success: false});
    }

    const banner = await adminService.uploadImageService({fileName: req.body.fileName, file: req.file.buffer, folder: '/banners'});
    res.status(200).send({banner, message: 'Banner uploaded successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-BANNER-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deleteBannerSwagger = makeSwaggerFromJoi({ 
  JoiSchema: imageDeleteSchema.keys({
    imageId: Joi.forbidden(),
  }), 
  route: '/uploads/banner/:imageId', 
  method: 'delete', 
  summary: 'Delete a banner image', 
  tags: ['Customize'] 
});

router.delete('/uploads/banner/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try{
    const { imageId } = req.values;
    await adminService.deleteImageService({imageId});
    res.status(200).send({message: 'Banner deleted successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-BANNER-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
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
    a: Joi.number().required()
  }),
  features: Joi.array().min(1).max(6),
});

const updatePageLayoutSectionSwagger = makeSwaggerFromJoi({ 
  JoiSchema: updatePageLayoutSectionSchema.keys({ page: Joi.forbidden(), sectionId: Joi.forbidden() }), 
  route: '/customize/layout/:page/sections/:sectionId', 
  method: 'put', 
  summary: 'Update a section of a page layout', 
  tags: ['Customize'] 
});

router.put('/customize/layout/:page/sections/:sectionId', auth(['owner']), requestValidator(updatePageLayoutSectionSchema), async (req, res) => {
  try{
    await adminService.updateSection({ storeId: req.user.storeId, ...req.values });
    res.status(200).send({message: 'Update layout successfull!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-LAYOUT-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const uploadPosterSwagger = makeSwaggerFromJoi({ 
  JoiSchema: {}, 
  route: '/uploads/poster', 
  method: 'post', 
  summary: 'Upload a poster', 
  tags: ['Customize'],
  contentType: 'multipart/form-data',
  formDataSchema: {
    type: 'object',
    required: ['poster', 'fileName'],
    properties: {
      poster: { type: 'string', format: 'binary' },
      fileName: { type: 'string' },
    },
  },
});

router.post('/uploads/poster', auth(['owner']), upload.single('poster'), async (req, res) => {
  try{
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({message: 'Invalid request payload!', success: false});
    }

    const poster = await adminService.uploadImageService({fileName: req.body.fileName, file: req.file.buffer, folder: '/posters'});
    res.status(200).send({poster, message: 'Poster uploaded successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-POSTER-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const deletePosterSwagger = makeSwaggerFromJoi({ 
  JoiSchema: imageDeleteSchema.keys({
    imageId: Joi.forbidden(),
  }), 
  route: '/uploads/poster/:imageId', 
  method: 'delete', 
  summary: 'Delete a poster image', 
  tags: ['Customize'] 
});

router.delete('/uploads/poster/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try{
    const { imageId } = req.values;
    await adminService.deleteImageService({imageId});
    res.status(200).send({message: 'Poster deleted successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-POSTER-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});


router.post('/uploads/footer/logo', auth(['owner']), upload.single('logo'), async (req, res) => {
  try{
    if (!req.file || !req.body.fileName) {
      return res.status(400).send({message: 'Invalid request payload!', success: false});
    }

    const logo = await adminService.uploadImageService({fileName: req.body.fileName, file: req.file.buffer, folder: '/logo'});
    res.status(200).send({logo, message: 'Logo uploaded successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-LOGO-POST-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

router.delete('/uploads/footer/logo/:imageId', auth(['owner']), requestValidator(imageDeleteSchema), async (req, res) => {
  try{
    const { imageId } = req.values;
    await adminService.deleteImageService({imageId});
    res.status(200).send({message: 'Logo deleted successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-UPLOADS-LOGO-DELETE-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

const storeSchema = Joi.object({
  termsOfService: Joi.string().trim().allow(''),
  privacyPolicy: Joi.string().trim().allow(''),
  domain: Joi.string().trim().allow(''),
});

const updateStoreSwagger = makeSwaggerFromJoi({ 
  JoiSchema: storeSchema, 
  route: '/stores', 
  method: 'put', 
  summary: 'Update store', 
  tags: ['Customize'] 
});

router.put('/stores', auth(['owner']), requestValidator(storeSchema), async (req, res) => {
  try{
    req.values.storeId = req.user.storeId;
    await adminService.updateStore(req.values);
    res.status(200).send({message: 'Footer updated successfully!', success: true});
  }catch(error){
    console.error('[ADMIN-CUSTOMISE-FOOTER-PUT-CONTROLLER]', error);
    const {status, ...data} = formatFromError(error);
    res.status(status).send(data);
  }
});

export const storeCustomizeSwagger = {
  '/uploads/logo': {
    ...uploadLogoSwagger['/uploads/logo'],
  },
  '/uploads/logo/{imageId}': {
    delete: {
      ...deleteLogoSwagger['/uploads/logo/:imageId'].delete,
      parameters: [
        { name: 'imageId', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
  },
  '/customize/store': {
    ...updateStoreSettingsSwagger['/customize/store'],
  },
  '/customize/footer': {
    ...updateFooterSwagger['/customize/footer'],
    ...getFooterSettingsSwagger['/customize/footer'],
  },
  '/customize/settings': {
    ...getStoreSettingsSwagger['/customize/settings'],
  },
  '/customize/layout/{page}': {
    get: {
      ...getPageLayoutSwagger['/customize/layout/:page'].get,
      parameters: [
        { name: 'page', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
    put: {
      ...updatePageLayoutSwagger['/customize/layout/:page'].put,
      parameters: [
        { name: 'page', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
  },
  '/customize/layout/{page}/sections/{sectionId}': {
    put: {
      ...updatePageLayoutSectionSwagger['/customize/layout/:page/sections/:sectionId'].put,
      parameters: [
        { name: 'page', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'sectionId', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
  },
  '/uploads/banner': {
    ...uploadBannerSwagger['/uploads/banner'],
  },
  '/uploads/banner/{imageId}': {
    delete: {
      ...deleteBannerSwagger['/uploads/banner/:imageId'].delete,
      parameters: [
        { name: 'imageId', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
  },
  '/uploads/poster': {
    ...uploadPosterSwagger['/uploads/poster'],
  },
  '/uploads/poster/{imageId}': {
    delete: {
      ...deletePosterSwagger['/uploads/poster/:imageId'].delete,
      parameters: [
        { name: 'imageId', in: 'path', required: true, schema: { type: 'string' } },
      ],
    },
  },
  '/stores': {
    ...updateStoreSwagger['/stores'],
  },
}

export default router;