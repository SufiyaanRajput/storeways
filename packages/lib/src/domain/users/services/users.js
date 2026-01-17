import UsersRepository from "../repositories/users";
import UserStoresService from "../../stores/services/userStores";
import AuthTokenService from "./authToken";
import { getDatabase } from "../../../db";
import bcrypt from 'bcryptjs';
import { getAdapter } from "../../../boot/loaders/adapters";

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
    const user = await this.usersRepository.create({ name, mobile, password, storeName, email }, transaction);
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
    return this.usersRepository.updateById(id, payload);
  }

  async findUser(payload) {
    const user = await this.usersRepository.findUser(payload);
    return user;
  }

  async findAll(payload) {
    const users = await this.usersRepository.findAll(payload);
    return users;
  }

  async sendPasswordResetEmail({email}) {
    try{
      const user = await this.usersRepository.findUser({email, deletedAt: null});

      if (!user) {
        console.log.error('User not found!');
        return;
      }

      const token = await this.authTokenService.create(
        { payload: {userId: user.id, role: user.role, mobile: user.mobile},
        userId: user.id,
        }
      );

      const link = `${config.clientbaseUrl}/password-reset?token=${token}`;

      const emailService = getAdapter('email');
      await emailService.send({
        to: email,
        subject: 'Storeways admin password reset',
        html: `
          Hey there,

          <p>Here's your link to reset your password:</p>
          <p><a href="${link} target="_blank" rel="noreferrer">${link}</a></p>
          <p>We're always here. You may get in touch by replying to this email</p>

          <p>Team Storeways</p>
        `,
      });
    }catch(error){
      throw error;
    }
  }

  async passwordReset({token, password}) {
    try{
      const decoded = await this.authTokenService.decryptToken({token});
      const encryptedPassword = await bcrypt.hash(password, 8);

      await this.usersRepository.updateById(decoded.userId, {password: encryptedPassword});
    }catch(error){
      throw error;
    }
  }
}

export default UsersService;