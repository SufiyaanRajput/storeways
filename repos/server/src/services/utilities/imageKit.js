import config from '../../config';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey : config.imageKit.publicKey,
  privateKey : config.imageKit.privateKey,
  urlEndpoint : config.imageKit.urlEndpoint
});

export const uploadImage = async ({file, fileName, folder='/'}) => {
  try{
    return await imagekit.upload({
      file,
      fileName,
      useUniqueFileName: true,
      folder
    });
  }catch(error){
    throw error;
  }
}

export const deleteImage = async ({imageId}) => {
  try{
    return await imagekit.deleteFile(imageId);
  }catch(error){
    throw error;
  }
}

export const deleteImageBulk = async (imageIds) => {
  try{
    return await imagekit.bulkDeleteFiles(imageIds);
  }catch(error){
    throw error;
  }
}