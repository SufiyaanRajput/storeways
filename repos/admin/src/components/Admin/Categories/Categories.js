import { CategoriesListPage } from '@storeways/admin-ui/pages';
import { fetchCategories, deleteCategory, addCategory, updateCategory } from './api';

const Categories = () => {
  return <CategoriesListPage 
    fetchCategories={fetchCategories} 
    deleteCategory={deleteCategory} 
    addCategory={addCategory} 
    updateCategory={updateCategory} />;
}

export default Categories;