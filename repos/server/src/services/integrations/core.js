import models from '../../models';
import { QueryTypes } from 'sequelize';

export const groupRelations = ({source, parentKeyTarget, parentKey, childKey, parent, childRelationKey}) => {
  let result = source.reduce((target, item) => {

    if (!target[item.name]) {
      target[item.name] = {[parentKeyTarget]: [item[parentKey]], id: item[childKey]};
    } else {
      target[item.name][parentKeyTarget].push(item[parentKey])
    }

    if (item.option) {
      if (!target[item.name].values) target[item.name].values = [];
      target[item.name].values.push(item.option);
    }

    if (item.options) {
      target[item.name].options = item.options;
    }

    return target;
  }, {});


  result = Object.keys(result).map(key => ({name: key, ...result[key]}));

  if (Array.isArray(parent)) {
    parent.forEach(parent => {
      const children = result.filter(item => item[parentKeyTarget].includes(parent.id));
      parent.setDataValue(childRelationKey,  children);
    });
  
    return parent;
  }

  if (typeof(parent) === 'object' && parent) {
    parent.setDataValue(childRelationKey, result);
    return parent;
  }

  return parent;
}