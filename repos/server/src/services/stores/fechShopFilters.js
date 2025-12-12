import { QueryTypes } from 'sequelize';
import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();

const fechShopFilters = async ({storeId, categoryIds, source}) => {
  try{
    const categories = await models.sequelize.query(`
    SELECT 
      c1.id, c1.name, c2.name AS "parentName", c2.id AS "parentId"
    FROM categories AS c1 
    LEFT JOIN categories AS c2 ON c1.parent_id = c2.id
    WHERE c1.store_id = ${storeId} AND c1.deleted_at IS NULL AND c1.active = true
  `, { type: QueryTypes.SELECT });

    // const parents = categories.filter(category => category.parentId == null);

    // const getChildren = (parentId) => {
    //   const children = categories.filter(category => category.parentId == parentId);
      
    //   if (!children.length) return null;
      
    //   return children.map(child => {
    //     child.children = getChildren(child.id);
    //     return child;
    //   });
    // }
    
    // categories = parents.map(parent => {
    //   parent.children = getChildren(parent.id);
    //   return parent;
    // });

    const grouped = [];
    let parentId = null, parentName = 'Categories';
    
    const makeFilters = () => {
      const children = categories.filter(category => category.parentId == parentId);
      
      if (!children.length) return;
      
      grouped.push({
      	title: parentName,
        parentId,
        options: children
      });
      
       children.forEach(parent => {
       	parentId = parent.id;
        parentName = parent.name;

        makeFilters();
      });
    }
    
    makeFilters();

    return grouped;
  }catch(error){
    throw error;
  }
};

export default fechShopFilters;