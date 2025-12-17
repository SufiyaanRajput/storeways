import { VariationsListPage } from '@storeways/admin-ui/pages';
import { fetchVariations, deleteVariation, addVariation, updateVariation } from './api';

const Variations = () => {
  return <VariationsListPage 
    fetchVariations={fetchVariations} 
    deleteVariation={deleteVariation} 
    addVariation={addVariation} 
    updateVariation={updateVariation} />;
}

export default Variations;