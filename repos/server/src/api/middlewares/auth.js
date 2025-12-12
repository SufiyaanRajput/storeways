import jwt from 'jsonwebtoken';
import { getDatabase } from '@storeways/lib/db/models';
import {formatFromError} from '../../utils/helpers';
import config from '../../config';

const models = getDatabase();

const removeTokenFromUser = async (token) => {
  try{
    await models.AuthToken.update({active: false}, {where: {token}});
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

    const user = await models.User.findOne({ where: {id: userId, mobile, storeId, role, active: true} });

    if(!user){
      throw {status: 401, msgText: 'Not authorised!', error: new Error()};
    }

    req.user = user.toJSON();
    req.storeId = user.storeId;
    req.authToken = token;
    next();
  }catch(error){
    console.log(error);
    const {status, ...data} = formatFromError(error);
    return res.status(status).send(data);
  } 
}

export default auth;