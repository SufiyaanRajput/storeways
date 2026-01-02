import jwt from 'jsonwebtoken';
import {formatFromError} from '../../utils/helpers';
import config from '../../config';
import { Users as UserService, AuthToken as AuthTokenService } from '@storeways/lib/domain';

const User = new UserService();
const AuthToken = new AuthTokenService();

const removeTokenFromUser = async (token) => {
  try{
    await AuthToken.update({active: false}, {token});
  }catch(error){
    throw error;
  }
}

export const verifyToken = async ({token}) => {
  try{
    return jwt.verify(token, config.JWTSecret);
  }catch(error){
    console.log(error);
    await removeTokenFromUser(token);
    throw {status: 401, msgText: 'Not authorised!', error: new Error()};
  }
}

const auth = (authorisedRoles=null, optional=false) => async (req, res, next) => {
  try{
    if (optional && !req.header('Authorization'))  {
      next();
      return;
    }

    if(!req.header('Authorization')){
      throw {status: 401, msgText: 'Not authorised!', error: new Error()};
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    const {userId, storeId, mobile, role} = await verifyToken({token});

    if(authorisedRoles && !authorisedRoles.includes(role)){
      await removeTokenFromUser(token);
      throw {status: 401, msgText: 'Not authorised!', error: new Error()};
    }

    req.user = await User.findUser({ id: userId, mobile, role, active: true} );

    if(!req.user){
      throw {status: 401, msgText: 'Not authorised!', error: new Error()};
    }

    req.user.storeId = storeId;
    req.storeId = storeId;
    req.authToken = token;
    next();
  }catch(error){
    console.log(error);
    const {status, ...data} = formatFromError(error);
    return res.status(status).send(data);
  } 
}

export default auth;