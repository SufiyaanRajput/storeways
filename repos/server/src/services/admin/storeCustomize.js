import * as StoreSettingsService from '../stores/customizations';

export const uploadImageService = async (...args) => {
  return StoreSettingsService.uploadImageService(...args);
}

export const deleteImageService = async (...args) => {
  return StoreSettingsService.deleteImageService(...args);
}

export const updateStoreSettings = async (...args) => {
  return StoreSettingsService.updateStoreSettings(...args);
}

export const updateFooter = async (...args) => {
  return StoreSettingsService.updateFooter(...args);
}

export const getSettingByKey = async (...args) => {
  return StoreSettingsService.getSettingByKey(...args);
}

export const getLayout = async (...args) => {
  return StoreSettingsService.getLayout(...args);
}

export const updateLayout = async (...args) => {
  return StoreSettingsService.updateLayout(...args);
}

export const updateSection = async (...args) => {
  return StoreSettingsService.updateSection(...args);
}

export const updateStore = async (...args) => {
  return StoreSettingsService.updateStore(...args);
}

