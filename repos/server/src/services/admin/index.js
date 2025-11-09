import {addCategory, editCategory, deleteCategory, fetchCategories} from './categories';
import {addVariation, updateVariation, deleteVariation, fetchVariations} from './variation';
import addProduct from './addProduct';
import { addImage, updateProduct, deleteProductImage, deleteProduct } from './updateProduct';
import { uploadImageService, deleteImageService, updateStoreSettings, getSettingByKey, getLayout, updateLayout, updateSection, updateFooter, updateStore } from './storeCustomize';

export {
  addCategory,
  fetchCategories,
  editCategory,
  addVariation,
  updateVariation,
  deleteCategory,
  fetchVariations,
  addProduct,
  updateProduct,
  addImage,
  deleteProductImage,
  updateFooter,
  deleteProduct,
  deleteVariation,
  updateSection,
  getSettingByKey,
  uploadImageService,
  deleteImageService,
  updateStoreSettings,
  getLayout,
  updateLayout,
  updateStore,
}