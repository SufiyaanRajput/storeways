import models from '../../models';
import jwt from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcryptjs';
import defaultStoreSettings from './defaultStoreSettings';
import Email from '../integrations/Email';
import SMS from '../integrations/SMS';
// const twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

export const makeAuthToken = ({userId, role, storeId, mobile}) => {
  try {
    return jwt.sign({userId, role, mobile, storeId}, config.JWTSecret, {expiresIn: '29d'});
  } catch (error) {
    throw error;
  }
}

export const register = async ({name, mobile, password, storeName, inviteCode, email}) => {
  try{
    const validInviteCode = await models.InviteCode.findOne({
      where: {
        code: inviteCode,
        active: true,
      }
    });

    if (!validInviteCode) {
      throw {status: 400, msgText: 'Invalid invite code!', error: new Error};
    }

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
      validInviteCode.active = false;
      await validInviteCode.save({transaction});
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

export const login = async ({email, password, mobile, otp, userType}) => {
  try{
    if (userType === 'owner') {
      const msgText = 'Email or password is incorrect!';
      var user = await models.User.scope('withPassword').findOne({
        where: {
          email: email.toLowerCase(),
          active: true,
          deletedAt: null,
          role: 'owner',
        },
      });
  
      if(!user || !user.password){
        throw {status: 400, msgText, error: new Error};
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if(!isMatch){
        throw {status: 400, msgText, error: new Error};
      }
    }
    
    if (userType === 'customer' && otp) {
      const SmsService = new SMS();
      const otpVerification = await SmsService.verifyOTP({to: mobile, otp});

      if (otpVerification.status !== 'approved') {
        throw {status: 400, msgText: 'Icorrect OTP!', error: new Error};
      }

      var user = await models.User.findOne({
        where: {
          mobile,
          role: 'customer',
          active: true,
          deletedAt: null
        },
      });
  
      if(!user){
        throw {status: 400, msgText, error: new Error};
      } 
    }

    const token = jwt.sign({userId: user.id, role: user.role, mobile: user.mobile, storeId: user.storeId}, config.JWTSecret, {expiresIn: '29d'});
    await models.AuthToken.create({token, userId: user.id});
    delete user.dataValues.password;
    user.setDataValue("authToken", token);

    return user;
  }catch(error){
    throw error;
  }
}

export const logout = async ({token, userId}) => {
  try{
    await models.AuthToken.update({active: false, deletedAt: new Date()}, {where: {token, userId}});
  }catch(error){
    throw error;
  }
}

export const registerLoginCustomer = async ({name, mobile, otp, storeId}) => {
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

export const sendPasswordResetEmail = async ({email}) => {
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

export const sendOTPForLogin = async ({mobile, ip}) => {
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

export const passwordReset = async ({token, password}) => {
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