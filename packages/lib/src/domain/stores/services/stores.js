import StoresRepository from '../repositories/stores';
import { getDatabase } from '../../../db';

class StoreService {
  constructor() {
    this.storesRepository = new StoresRepository({ models: getDatabase() });
  }

  async updateSettings({ storeId, filesToDelete=[], logoText, logo, tax, otherCharges, domain, isOnlinePaymentEnabled = false, ...payload }) {
    return this.storesRepository.updateSettings(
      { storeId, filesToDelete, logoText, logo, tax, otherCharges, domain, isOnlinePaymentEnabled, ...payload }
    );
  }

  async getSettingByKey({ storeId, key }) {
    return this.storesRepository.getSettingByKey({ storeId, key });
  }

  async getLayout({ storeId, page }) {
    return this.storesRepository.getLayout({ storeId, page });
  }

  async updateLayout({ storeId, page, layout }) {
    return this.storesRepository.updateLayout({ storeId, page, layout });
  }

  async updateStore({storeId, ...updates}) {
    return this.storesRepository.updateStore({storeId, ...updates});
  }
}

export default StoreService;