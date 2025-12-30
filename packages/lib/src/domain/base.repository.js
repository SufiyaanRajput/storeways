import _ from 'lodash';
class BaseRepository {
  constructor() {}

  groupRelationsByName({ 
    source, 
    parentKeyTarget,   // e.g., 'productIds' or 'categoryIds'
    parentKey,         // e.g., 'productId' or 'categoryId'
    childKey,          // e.g., 'categoryId' or 'id'
    optionKey = 'option', 
    optionsKey = 'options' 
  }) {
    let result = source.reduce((target, item) => {
      if (!target[item.name]) {
        target[item.name] = { [parentKeyTarget]: [item[parentKey]], id: item[childKey] };
      } else {
        target[item.name][parentKeyTarget].push(item[parentKey]);
      }
  
      if (item[optionKey]) {
        if (!target[item.name].values) target[item.name].values = [];
        target[item.name].values.push(item[optionKey]);
      }
  
      if (item[optionsKey]) {
        target[item.name].options = item[optionsKey];
      }
  
      return target;
    }, {});
  
    result = Object.keys(result).map(key => ({ name: key, ...result[key] }));
    return result;
  }


  //orders: [{productId: 1, userId: 1, productVariationStockId: 1}, {productId: 2, userId: 1, productVariationStockId: 2}]

  hydrateRelation({
    parentList,
    childList,
    // parentForeignKey,
    // childKey,
    // as
  }) {
    const relations = childList.reduce((map, child) => {
      const data = _.keyBy(child.items, child.childKey);
      map.push({ parentForeignKey: child.parentForeignKey, items: { as: child.as, data } });
      return map;
    }, []);

    const populated = parentList.map(parent => {
      relations.forEach(relation => {
        _.set(parent, [relation.items.as], relation.items.data[parent[relation.parentForeignKey]]);
      });

      return parent;
    });

    return populated;
  }
}

export default BaseRepository;