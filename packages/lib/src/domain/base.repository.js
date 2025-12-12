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
}

export default BaseRepository;