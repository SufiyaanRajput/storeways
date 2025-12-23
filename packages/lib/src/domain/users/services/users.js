import UsersRepository from "../repositories/users";
import { getDatabase } from "../../../db";

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository({ models: getDatabase() });
  }

  async fetchById(id) {
    const user = await this.usersRepository.fetchById(id);
    return user;
  }
}

export default UsersService;