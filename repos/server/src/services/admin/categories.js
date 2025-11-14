import * as CategoryService from '../products/categories';

export const fetchCategories = async (args) => {
  return CategoryService.fetchCategories(args);
};

export const addCategory = async (args) => {
  return CategoryService.addCategory(args);
};

export const editCategory = async (args) => {
  return CategoryService.editCategory(args);
};

export const deleteCategory = async (args) => {
  return CategoryService.deleteCategory(args);
};