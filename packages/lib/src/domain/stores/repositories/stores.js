import BaseRepository from '../../base.repository';

class StoresRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async create({ storeName, userId, settings, transaction }) {
    return this.models.Store.create({
      name: storeName, subDomain: storeName.replace(/\s/g, '').toLowerCase() + userId, settings
    }, {transaction});
  }

  async updateSettings({ 
    storeId, 
    filesToDelete=[], 
    logoText, 
    logo, 
    tax, 
    otherCharges, 
    domain, 
    isOnlinePaymentEnabled = false, 
    ...payload 
  }){
    try{
      if (filesToDelete.length) {
      }
  
      return this.models.Store.update({
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

  async getSettingByKey({ storeId, key }) {
    try{
      const store = await this.models.Store.findOne({
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

    async getLayout({ storeId, page }) {
    try{
      const store = await this.models.Store.findOne({
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
  
  async updateLayout({ storeId, page, layout }) {
    try{
        await this.models.sequelize.query(`
          UPDATE stores SET settings = jsonb_set("settings"::jsonb,
          '{pages, ${page}, layout}',
            '${JSON.stringify(layout)}' :: jsonb)
          WHERE id = ${storeId};
        `);
    }catch(error){
      throw error;
    }
  }

  async updateStore({storeId, ...updates}) {
    try{
      return this.models.Store.update(updates, {where: {id: storeId}});
    }catch(error){
      throw error;
    }
  }
}

export default StoresRepository;
