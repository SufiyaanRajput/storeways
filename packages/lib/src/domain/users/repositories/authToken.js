import jwt from 'jsonwebtoken';

class AuthTokenRepository {
  constructor({ models }) {
    this.models = models;
  }

  async makeAuthToken(payload) {
    try {
      return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '29d'});
    } catch (error) {
      throw error;
    }
  }

  async create({ payload, transaction, userId }) {
    const token = await this.makeAuthToken(payload);
    await this.models.AuthToken.create({ token, userId }, { transaction });
    return token;
  }

  async update(payload, clause) {
    return this.models.AuthToken.update(payload, { where: clause });
  }

  async findAll({clause}) {
    const tokens = await this.models.AuthToken.findAll({ where: clause });
    return tokens.map((token) => token?.get({ plain: true }));
  }
}

export default AuthTokenRepository;