import AuthTokenRepository from "../repositories/authToken";
import { getDatabase } from "../../../db";

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
}

export default AuthTokenService;