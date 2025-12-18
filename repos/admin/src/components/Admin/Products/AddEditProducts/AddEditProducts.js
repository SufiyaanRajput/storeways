import { AddEditProductPage } from '@storeways/admin-ui/pages';
import { addProduct, updateProduct, addProductImage, deleteProductImage } from '../api';
import { fetchCategories } from '../../Categories/api';

const AddEditProducts = () => {
  return <AddEditProductPage 
    fetchCategories={fetchCategories} 
    addProduct={addProduct} 
    updateProduct={updateProduct} 
    addProductImage={addProductImage} 
    deleteProductImage={deleteProductImage} />;
}

export default AddEditProducts;