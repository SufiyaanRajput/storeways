import CategoriesRepository from '../repositories/categories';
import { getDatabase } from '../../../db';

class CategoriesService {
  constructor() {
    this.categoriesRepository = new CategoriesRepository({ models: getDatabase() });
  }

  async create(payload) {
    const category = await this.categoriesRepository.create(payload);
    return category;
  }

  async fetch({ storeId }) {
    const categories = await this.categoriesRepository.fetch({ storeId });
    return categories;
  }

  async update(payload) {
    const category = await this.categoriesRepository.update(payload);
    return category;
  }

  async delete({ id, storeId }) {
    const category = await this.categoriesRepository.delete({ id, storeId });
    return category;
  }
}

export default CategoriesService;