import UserStoreRepository from "../repositories/userStore";
import { getDatabase } from "../../../db";

class UserStoresService {
  constructor() {
    this.userStoresRepository = new UserStoreRepository({ models: getDatabase() });
  }

  async findForUser(userId, storeId) {
    return this.userStoresRepository.findForUser(userId, storeId);
  }

  async create({ userId, storeId, transaction }) {
    return this.userStoresRepository.create({ userId, storeId, transaction });
  }
}

export default UserStoresService;