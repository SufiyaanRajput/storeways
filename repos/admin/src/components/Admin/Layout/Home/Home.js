import { HomeLayoutPage } from '@storeways/admin-ui/pages';
import { fetchLayout, updateLayout, updateLayoutSection, uploadBannerImage, uploadPosterImage } from '../api';

const Home = () => {
  return <HomeLayoutPage 
    fetchLayout={fetchLayout} 
    updateLayout={updateLayout} 
    updateLayoutSection={updateLayoutSection} 
    uploadBannerImage={uploadBannerImage} 
    uploadPosterImage={uploadPosterImage} />;
}

export default Home;