import CategoriesRepository from '../repositories/categories';
import VariationsService from './variations';
import BaseServiceRepository from '../../base.repository';
import { getDatabase } from '../../../db';

class CategoriesService extends BaseServiceRepository {
  constructor() {
    super();
    this.categoriesRepository = new CategoriesRepository({ models: getDatabase() });
    this.variationsService = new VariationsService();
  }

  async create(payload) {
    const category = await this.categoriesRepository.create(payload);
    return category;
  }

  async fetchWithVariations({ storeId }) {
    const categories = await this.categoriesRepository.fetch({ storeId });

    if (categories.length) {
      const variations = await this.variationsService.fetch({
        deletedAt: null,
        categoryId: categories.map(({id}) => id)
      });
  
      const groupedVariations = this.groupRelationsByName({
        source: variations,
        parentKeyTarget: 'categoryIds',
        parentKey: 'categoryId',
        childKey: 'id',
        optionsKey: 'options'
      });
  
      categories.forEach(category => {
        const variations = groupedVariations.filter(variation => variation.categoryIds.includes(category.id));
        category.variations = variations;
      });
    }
    return categories;
  }

  async fetchForFilters({ storeId }) {
    const categories = await this.categoriesRepository.fetch({ storeId });

    const grouped = [];
    let parentId = null, parentName = 'Categories';
    
    const makeFilters = () => {
      const children = categories.filter(category => category.parentId == parentId);
      
      if (!children.length) return;
      
      grouped.push({
      	title: parentName,
        parentId,
        options: children
      });
      
       children.forEach(parent => {
       	parentId = parent.id;
        parentName = parent.name;

        makeFilters();
      });
    }
    
    makeFilters();

    return grouped;
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