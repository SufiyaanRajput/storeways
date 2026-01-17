import jwt from 'jsonwebtoken';
import { formatFromError } from '../utils/helpers';
import { Users as UserService, AuthToken as AuthTokenService } from '../../domain';
import { getAppConfig } from '../../boot/app-context';

const User = new UserService();
const AuthToken = new AuthTokenService();

const removeTokenFromUser = async (token) => {
  try {
    await AuthToken.update({ active: false }, { token });
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async ({ token, jwtSecret }) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    await removeTokenFromUser(token);
    throw { status: 401, msgText: 'Not authorised!', error: new Error() };
  }
};

const auth = (authorisedRoles = null, optional = false) => async (req, res, next) => {
  try {
    const { auth: authConfig = {} } = getAppConfig() || {};
    const jwtSecret = authConfig.jwtSecret;

    if (!jwtSecret) {
      throw { status: 500, msgText: 'Auth secret not configured', error: new Error() };
    }

    if (optional && !req.header('Authorization')) {
      next();
      return;
    }

    if (!req.header('Authorization')) {
      throw { status: 401, msgText: 'Not authorised!', error: new Error() };
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    const { userId, storeId, mobile, role } = await verifyToken({ token, jwtSecret });

    if (authorisedRoles && !authorisedRoles.includes(role)) {
      await removeTokenFromUser(token);
      throw { status: 401, msgText: 'Not authorised!', error: new Error() };
    }

    req.user = await User.findUser({ id: userId, mobile, role, active: true });

    if (!req.user) {
      throw { status: 401, msgText: 'Not authorised!', error: new Error() };
    }

    if (role !== 'customer') {
      req.user.admin = true;
    }

    req.user.storeId = storeId;
    req.storeId = storeId;
    req.authToken = token;
    next();
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    return res.status(status).send(data);
  }
};

export default auth;
