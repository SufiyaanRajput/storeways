import { StoreSettingsPage } from '@storeways/admin-ui/pages';
import { getStoreSettings, updateStoreSettings, uploadLogo, updateStore } from './api';

const Store = () => {
  return <StoreSettingsPage 
    getStoreSettings={getStoreSettings} 
    updateStoreSettings={updateStoreSettings} 
    uploadLogo={uploadLogo} 
    updateStore={updateStore} />;
}

export default Store;