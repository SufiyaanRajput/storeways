import BaseRepository from "../../base.repository";

class UsersRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async fetchById(id) {
    return this.models.User.findOne({
      where: {
        id,
      },
    });
  }
}

export default UsersRepository;
