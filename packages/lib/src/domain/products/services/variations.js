import VariationsRepository from '../repositories/variations';
import { getDatabase } from '../../../db';

class VariationsService {
  constructor() {
    this.variationsRepository = new VariationsRepository({ models: getDatabase() });
  }

  async create(payload) {
    const variation = await this.variationsRepository.create(payload);
    return variation;
  }

  async fetch(payload) {
    const variations = await this.variationsRepository.fetch(payload);
    return variations;
  }

  async update(payload) {
    const variation = await this.variationsRepository.update(payload);
    return variation;
  }

  async delete({id, storeId}) {
    const variation = await this.variationsRepository.delete({id, storeId});
    return variation;
  }
}

export default VariationsService;