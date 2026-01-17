import BaseRepository from "../../base.repository";

class UserStoreRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async findForUser(userId, storeId) {
    const clause = { userId, deletedAt: null };

    if (storeId) {
      clause.storeId = storeId;
    }

    const userStores = await this.models.UserStore.findAll({ where: clause });
    return userStores.map((userStore) => userStore.get({ plain: true }));
  }

  async create({ userId, storeId, transaction }) {
    const userStore = await this.models.UserStore.create({ userId, storeId }, { transaction });
    return userStore.get({ plain: true });
  }
}

export default UserStoreRepository;