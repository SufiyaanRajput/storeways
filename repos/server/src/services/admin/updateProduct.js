import FileStorage from '../integrations/FileStorage';
import * as ProductService from '../products';

export const updateProduct = async (args) => {
  return ProductService.updateProduct(args);
};

export const addImage = async ({ file, fileName, ext }) => {
  try{
    const storage = new FileStorage();
    const { url, fileId } = await storage.upload(file, `${fileName}.${ext}`);
    
    return {
      url,
      fileId,
      name: fileName,
    };
  }catch(error){
    throw error;
  }
}

export const deleteProductImage = async ({ imageId }) => {
  try{
    const storage = new FileStorage();
    return await  storage.delete();
  }catch(error){
    throw error;
  }
}

export const deleteProduct = async (args) => {
  return ProductService.deleteProduct(args);
}