import BaseRepository from "../../base.repository";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

  async findUser(payload, withPassword = false) {
    const user = await this.models.User.findOne({ where: payload });

    if (!withPassword) {
      delete user.dataValues.password;
    }

    return user.get({ plain: true });
  }

  async makeAuthToken({userId, role, storeId, mobile}) {
    try {
      return jwt.sign({userId, role, mobile, storeId}, process.env.JWT_SECRET, {expiresIn: '29d'});
    } catch (error) {
      throw error;
    }
  }

  async create({name, mobile, password, storeName, email, transaction}) {
    const user = await this.models.User.create({name, mobile, password, storeName, email}, {transaction});
    delete user.dataValues.password;
    return user.get({ plain: true });
  }
  
  async register({name, mobile, password, storeName, email}) {
    try{
      const isExistingUser = await models.User.findOne({
        where: {
          [models.Sequelize.Op.or]: [{mobile}, {email}],
          role: 'owner'
        }
      });
  
      if(isExistingUser){
        throw {status: 400, msgText: 'Mobile already exists!', error: new Error};
      }
    
      const encryptedPassword = await bcrypt.hash(password, 8);
      const user = await models.sequelize.transaction(async (transaction) => {
        const user = await models.User.create({name, mobile, email, password: encryptedPassword, role: 'owner'}, {transaction});
        delete user.dataValues.password;
        const store = await models.Store.create({name: storeName, subDomain: storeName.replace(/\s/g, '').toLowerCase() + user.id, settings: defaultStoreSettings}, {transaction});
        user.storeId = store.id;
        await user.save({transaction});
        const token = makeAuthToken({userId: user.id, role: 'owner', storeId: store.id, mobile});
        await models.AuthToken.create({token, userId: user.id}, {transaction});
        user.setDataValue("authToken", token);
        return user;
      });
  
      return user;
    }catch(error){
      throw error;
    }
  }
  
  async registerLoginCustomer({name, mobile, otp, storeId}) {
    try{
      const SmsService = new SMS();
      const otpVerification = await SmsService.verifyOTP({to: mobile, otp});
  
      if (otpVerification.status !== 'approved') {
        throw {status: 400, msgText: 'Icorrect OTP!', error: new Error};
      }
  
      const isExistingUser = await models.User.findOne({
        where: {
          mobile,
          role: 'customer',
          storeId
        }
      });
  
      if(isExistingUser){
        const token = jwt.sign({userId: isExistingUser.id, role: 'customer', mobile: isExistingUser.mobile}, config.JWTSecret, {expiresIn: '29d'});
        await models.AuthToken.create({token, userId: isExistingUser.id});
        delete isExistingUser.dataValues.password;
        isExistingUser.setDataValue("authToken", token);
  
        return isExistingUser;
      }
    
      const user = await models.sequelize.transaction(async (transaction) => {
        const user = await models.User.create({name, mobile, role: 'customer'}, {transaction});
        const token = jwt.sign({userId: user.id, role: 'customer', mobile}, config.JWTSecret, {expiresIn: '29d'});
        await models.AuthToken.create({token, userId: user.id}, {transaction});
        user.setDataValue("authToken", token);
        return user;
      });
  
      return user;
    }catch(error){
      throw error;
    }
  }
  
  async sendPasswordResetEmail({email}) {
    try{
      const user = await models.User.findOne({where: {email, deletedAt: null}});
  
      if (!user) {
        return;
      }
  
      const token = jwt.sign({userId: user.id, role: user.role, mobile: user.mobile, storeId: user.storeId}, config.JWTSecret, {expiresIn: '3h'});
      await models.AuthToken.create({token, userId: user.id});
      const link = `${config.clientbaseUrl}/password-reset?token=${jwt}`;
  
      const EmailService = new Email();
      await EmailService.send({
        to: email,
        subject: 'Storeways admin password reset',
        from: 'theoceanlabs@gmail.com',
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
  
  async sendOTPForLogin({mobile, ip}) {
    try{
      const user = await models.User.findOne({
        where: {
          mobile,
          active: true,
          deletedAt: null
        },
      });
  
      const SmsService = new SMS();
  
      await SmsService.sendSMS({to: mobile, ip});
  
      if(!user){
        return { msgText: 'Account not found! Your account is auto created when you first checkout.'};
      } 
  
      return { msgText: 'OTP sent successfully!'}
    }catch(error){
      throw error;
    }
  }
  
  async passwordReset({token, password}) {
    try{
      const activeToken = await models.AuthToken.findOne({where: {token, active: true}});
  
      if (!activeToken) {
        throw {status: 400, msgText: 'Invalid request!', error: new Error};
      }
  
      jwt.verify(token, config.JWTSecret);
  
      activeToken.active = false;
      const encryptedPassword = await bcrypt.hash(password, 8);
  
      await Promise.all([
        activeToken.save(),
        models.User.update({password: encryptedPassword}, {where: {id: activeToken.userId}}),
      ]);
    }catch(error){
      throw error;
    }
  }  
}

export default UsersRepository;
