import models from '../../models';
import FileStorage from '../utilities/FileStorage';

export const uploadImageService = async ({ file, fileName, ext }) => {
  try{
    const storage = new FileStorage();
    const { url, fileId } = await storage.upload(file, `${fileName}.${ext}`);
    
    return {
      fileId,
      url,
      name,
    };
  }catch(error){
    throw error;
  }
}

export const deleteImageService = async ({ imageId }) => {
  try{
    const storage = new FileStorage();
    await storage.delete();
  }catch(error){
    throw error;
  }
}

export const updateStoreSettings = async ({ 
  storeId, 
  filesToDelete=[], 
  logoText, 
  logo, 
  tax, 
  otherCharges, 
  domain, 
  isOnlinePaymentEnabled = false, 
  ...payload 
}) => {
  try{
    if (filesToDelete.length) {
    }

    return await models.Store.update({
      settings: models.Sequelize.literal(`settings :: jsonb || '${JSON.stringify({
        store: {
          theme: payload, 
          logoText, 
          otherCharges, 
          tax, 
          isOnlinePaymentEnabled
        }})}' :: jsonb`),
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

