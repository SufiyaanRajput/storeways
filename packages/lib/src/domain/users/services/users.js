import UsersRepository from "../repositories/users";
import UserStoresService from "../../stores/services/userStores";
import AuthTokenService from "./authToken";
import { getDatabase } from "../../../db";
import bcrypt from 'bcryptjs';

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository({ models: getDatabase() });
    this.userStoresService = new UserStoresService();
    this.authTokenService = new AuthTokenService();
  }

  async fetchById(id) {
    const user = await this.usersRepository.fetchById(id);
    return user;
  }

  async register({ name, mobile, password, storeName, email }) {
    const transaction = await this.models.sequelize.transaction();
    const user = await this.usersRepository.create({ name, mobile, password, storeName, email, transaction });
    const store = await this.storesRepository.create({ storeName, userId: user.id, settings: defaultStoreSettings, transaction });
    const token = await this.authTokenRepository.create({ userId: user.id, role: 'owner', storeId: store.id, mobile, transaction });
    user.authToken = token;
    await transaction.commit();
    return user;
  }

  async login({ email, password, mobile, userType }) {
    if (userType === 'owner') {
      const msgText = 'Email or password is incorrect!';
      var user = await this.usersRepository.findUser({ email: email.toLowerCase(), active: true, deletedAt: null, role: 'owner' }, true);
  
      if(!user || !user.password){
        throw {status: 400, msgText, error: new Error};
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if(!isMatch){
        throw {status: 400, msgText, error: new Error};
      }
    }

    if (userType === 'customer') {
      var user = await this.usersRepository.findUser({ mobile, active: true, deletedAt: null, role: 'customer' });

      if(!user){
        throw {status: 400, msgText, error: new Error};
      } 
    }

    const [userStore] = await this.userStoresService.findForUser(user.id);

    if(!userStore){
      throw {status: 400, msgText: 'User store not found!', error: new Error};
    }

    const token = await this.authTokenService.create(
      { payload: { userId: user.id, role: user.role, mobile: user.mobile, storeId: userStore.storeId },
      userId: user.id,
      }
    );

    user.authToken = token;
    delete user.password;
    return user;
  }

  async logout({ token, userId }) {
    await this.authTokenService.update({ active: false, deletedAt: new Date() }, { token, userId });
  }

  async create(payload) {
    const user = await this.usersRepository.create(payload);
    return user;
  }

  async updateById(id, payload) {
    const user = await this.usersRepository.updateById(id, payload);
    return user;
  }

  async findUser(payload) {
    const user = await this.usersRepository.findUser(payload);
    return user;
  }
}

export default UsersService;