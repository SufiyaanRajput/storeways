import { FooterLayoutPage } from '@storeways/admin-ui/pages';
import { getFooterSettings, updateFooter, uploadFooterLogoImage } from '../api';

const Footer = () => {
  return <FooterLayoutPage 
    getFooterSettings={getFooterSettings} 
    updateFooter={updateFooter} 
    uploadFooterLogoImage={uploadFooterLogoImage} />;
}

export default Footer;