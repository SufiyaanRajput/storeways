import models from '../../models';
import { uploadImage, deleteImage, deleteImageBulk } from '../utilities';

export const uploadImageService = async ({ file, fileName, folder='/' }) => {
  try{
    const {fileId, url, name, filePath} = await uploadImage({ file, fileName, folder });
    
    return {
      fileId,
      url,
      name,
      filePath
    };
  }catch(error){
    throw error;
  }
}

export const deleteImageService = async ({ imageId }) => {
  try{
    return await deleteImage({ imageId });
  }catch(error){
    throw error;
  }
}

export const updateStoreSettings = async ({ storeId, filesToDelete=[], logoText, logo, tax, otherCharges, domain, ...payload }) => {
  try{
    if (filesToDelete.length) {
      await deleteImageBulk(filesToDelete.map(({fileId}) => fileId));
    }

    return await models.Store.update({
      settings: models.Sequelize.literal(`settings :: jsonb || '${JSON.stringify({store: {theme: payload, logoText, otherCharges, tax}})}' :: jsonb`),
      logo,
      domain
    }, {
      where: {
        id: storeId,
        deletedAt: null,
      }
    });
  }catch(error){
    throw error;
  }
}

export const updateFooter = async ({ storeId, filesToDelete=[], ...payload }) => {
  try{
    if (filesToDelete.length) {
      await deleteImageBulk(filesToDelete.map(({fileId}) => fileId));
    }

    return await models.Store.update({
      settings: models.Sequelize.literal(`settings :: jsonb || '${JSON.stringify({footer: payload})}' :: jsonb`)
    }, {
      where: {
        id: storeId,
        deletedAt: null,
      }
    });
  }catch(error){
    throw error;
  }
}

export const getSettingByKey = async ({ storeId, key }) => {
  try{
    const store = await models.Store.findOne({
      where: {
        id: storeId,
        deletedAt: null,
      },
      attributes: ['settings', 'subDomain', 'logo', 'termsOfService', 'privacyPolicy'],
      raw: true,
    });

    const storeSettings = {...store.settings[key], siteUrl: store.domain ? store.domain : `https://${store.subDomain}.storeways.io`, logo: store?.logo || store.settings[key]?.logo} || {};

    if (key === 'store') {
      storeSettings.termsOfService = store.termsOfService;
      storeSettings.privacyPolicy = store.privacyPolicy;
    }

    return storeSettings;
  }catch(error){
    throw error;
  }
}

export const getLayout = async ({ storeId, page }) => {
  try{
    const store = await models.Store.findOne({
      where: {
        id: storeId
      },
      attributes: ['settings'],
      raw: true,
    });

    return store.settings.pages?.[page] || {};
  }catch(error){
    throw error;
  }
}

export const updateLayout = async ({ storeId, page, layout }) => {
  try{
      await models.sequelize.query(`
        UPDATE stores SET settings = jsonb_set("settings"::jsonb,
        '{pages, ${page}, layout}',
          '${JSON.stringify(layout)}' :: jsonb)
        WHERE id = ${storeId};
      `);
  }catch(error){
    throw error;
  }
}

export const updateSection = async ({ storeId, page, sectionId, filesToDelete=[], ...payload }) => {
  try{
    if (filesToDelete.length) {
      await deleteImageBulk(filesToDelete.map(({fileId}) => fileId));
    }

    const store = await models.Store.findOne({
      where: {
        id: storeId,
      },
      attributes: ['id', 'settings'],
    });

    store.settings.pages[page].layout = store.settings.pages[page].layout.map((layout) => {
      if (layout.id === sectionId) {
        switch(sectionId){
          case 'CAROUSEL':
            return {
              items: payload.banners,
              ...layout
            }
          case 'BANNER':
            return {
              items: payload.banner,
              ...layout
            }
          case 'POSTERS':
            return {
              items: payload.posters,
              ...layout
            }
          case 'FEATURES':
            return {
              sectionBgColor: payload.sectionBgColor,
              items: payload.features,
              ...layout
            }
          case 'PRODUCTS_SHOWCASE':
            return {
              selection: payload.products,
              ...layout
            }
        }
      }

      return layout;
    });

    store.changed('settings', true);
    await store.save();
  }catch(error){
    throw error;
  }
}

export const updateStore = async ({storeId, ...updates}) => {
  try{
    return await models.Store.update(updates, {where: {id: storeId}});
  }catch(error){
    throw error;
  }
}

