import BaseRepository from "../../base.repository";

class UserStoreRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async findForUser(userId, storeId) {
    const userStores = await this.models.UserStore.findAll({ where: { userId, storeId, deletedAt: null } });
    return userStores.map((userStore) => userStore.get({ plain: true }));
  }

  async create({ userId, storeId, transaction }) {
    const userStore = await this.models.UserStore.create({ userId, storeId }, { transaction });
    return userStore.get({ plain: true });
  }
}

export default UserStoreRepository;