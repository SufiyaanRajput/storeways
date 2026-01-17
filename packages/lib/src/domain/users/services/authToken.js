import AuthTokenRepository from "../repositories/authToken";
import { getDatabase } from "../../../db";
import jwt from 'jsonwebtoken';
import { getAppConfig } from "../../../boot/app-context";

class AuthTokenService {
  constructor() {
    this.authTokenRepository = new AuthTokenRepository({ models: getDatabase() });
  }

  async create({ payload, transaction, userId }) {
    const token = await this.authTokenRepository.create({ payload, transaction, userId });
    return token;
  }

  async update(payload, clause) {
    const token = await this.authTokenRepository.update(payload, clause);
    return token;
  }

  async decryptToken({token}) {
    const [activeToken] = await this.authTokenRepository.findAll({clause: {token, active: true}});

    if (!activeToken) {
      throw {status: 400, msgText: 'Invalid request!', error: new Error};
    }

    const { auth } = getAppConfig();
    const { jwtSecret } = auth;

    const decoded = jwt.verify(token, jwtSecret);

    await this.update({active: false, deletedAt: new Date()}, {token});

    return decoded;
  }
}

export default AuthTokenService;