import BaseRepository from '../../base.repository';

class StoresRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async create({ name, userId, settings, transaction }) {
    const store = await this.models.Store.create({
      name, subDomain: name.replace(/\s/g, '').toLowerCase() + userId, settings
    }, {transaction});

    return store.get({ plain: true });
  }

  async fetch(payload) {
    try{
      const stores = await this.models.Store.findAll({
        where: payload
      });

      return stores.map((store) => store.get({ plain: true }));
    }catch(error){
      throw error;
    }
  };

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

  async fetchShopFilters({storeId, categoryIds, source}) {
    try{
      const categories = await models.sequelize.query(`
      SELECT 
        c1.id, c1.name, c2.name AS "parentName", c2.id AS "parentId"
      FROM categories AS c1 
      LEFT JOIN categories AS c2 ON c1.parent_id = c2.id
      WHERE c1.store_id = ${storeId} AND c1.deleted_at IS NULL AND c1.active = true
    `, { type: QueryTypes.SELECT });
  
      const grouped = [];
      let parentId = null, parentName = 'Categories';
      
      const makeFilters = () => {
        const children = categories.filter(category => category.parentId == parentId);
        
        if (!children.length) return;
        
        grouped.push({
          title: parentName,
          parentId,
          options: children
        });
        
         children.forEach(parent => {
           parentId = parent.id;
          parentName = parent.name;
  
          makeFilters();
        });
      }
      
      makeFilters();
  
      return grouped;
    }catch(error){
      throw error;
    }
  }
}

export default StoresRepository;
