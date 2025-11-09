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

export const updateStock = ({products, transaction, operation='-'}) => {
  try {
    let variationStockUpdateQuery = `
    UPDATE product_variation_stocks SET stock = (
      CASE
  `;

  let stockUpdateQuery = `
    UPDATE products SET stock = (
      CASE
  `;

  let hasVariations = false, hasNonVariants = false, promises=[];

    for (const product of products) {
      if (product.variations && product.variations.length) {
        variationStockUpdateQuery += `
          WHEN product_id = ${product.id} AND id = ${product.productVariationStockId}
          THEN (stock ${operation} ${product.quantity}) 
          ELSE stock
            `;

        hasVariations = true;
        continue;
      }

      stockUpdateQuery += `
        WHEN id = ${product.id} 
        THEN (stock ${operation} ${product.quantity}) 
        ELSE stock
      `;

      hasNonVariants = true;
    }

    variationStockUpdateQuery += `
      END
      ) WHERE product_id IN (${products.map(({id}) => id).join(',')}) AND stock > 0 AND deleted_at IS NULL
    `;

    stockUpdateQuery += `
      END
      ) WHERE id IN (${products.map(({id}) => id).join(',')}) AND stock > 0
    `;

    if (hasVariations) {
      promises.push(models.sequelize.query(variationStockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
    }

    if (hasNonVariants) {
      promises.push(models.sequelize.query(stockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
    }

    return promises;
  } catch (error) {
    throw error;
  }
}