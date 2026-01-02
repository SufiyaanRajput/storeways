import StoresRepository from '../repositories/stores';
import UserStoresService from './userStores';
import AuthTokenService from '../../users/services/authToken';
import { getDatabase, getTransaction } from '../../../db';
import defaultStoreSettings from '../../../db/seed/defaultStoreSettings';
class StoreService {
  constructor() {
    this.storesRepository = new StoresRepository({ models: getDatabase() });
    this.userStoresRepository = new UserStoresService({ models: getDatabase() });
    this.authTokenService = new AuthTokenService({ models: getDatabase() });
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

  async fetch(payload) {
    return this.storesRepository.fetch(payload);
  }

  async create({ name, userId }) {
    const transaction = await getTransaction();
    const store = await this.storesRepository.create({ name, userId, settings: defaultStoreSettings, transaction });
    await this.userStoresRepository.create({ userId, storeId: store.id, transaction });
    await transaction.commit();

    return store;
  }

  async switch({ storeId, user }) {
    await this.authTokenService.update({ active: false, deletedAt: new Date() }, { userId: user.id });
    const token = await this.authTokenService.create(
      { payload: { userId: user.id, role: user.role, mobile: user.mobile, storeId },
      userId: user.id,
      }
    );

    return token;
  }
}

export default StoreService;