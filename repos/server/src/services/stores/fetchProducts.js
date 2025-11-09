import { QueryTypes } from 'sequelize';
import models from '../../models';

export const fetchProducts = async ({storeId, type, limit, categories = []}) => {
  const orderByType = (type) => {
    switch(type) {
      case 'LATEST':
        return ' ORDER BY id DESC ';
      case 'MOST_RATED':
        return ' ORDER BY ratings DESC ';
      case 'BEST_SELLING':
        return ' ORDER BY totalOrders DESC ';
      default:
        return '';
    }
  }

  const filterByCategories = () => {
    if (categories.length) {
      return `
        INNER JOIN product_categories ON product_categories.product_id = products.id AND product_categories.category_id IN (${categories.join(',')})
      `;
    }

    return '';
  }

  try{
    const products = await models.sequelize.query(`
      SELECT 
        ${
          categories.length ?
          'DISTINCT ON (products.id)' : ''
        }
        products.id,
        products.name, 
        products.sku, 
        products.images, 
        products.max_order_quantity as "maxOrderQuantity",
        products.active as "active",
        products.return_policy as "returnPolicy",
        products.description as "description",
        products.stock as "stock",
        products.price as "price",
        ROUND(AVG(reviews.ratings), 1) AS "ratings",
        COUNT(orders.id) AS totalOrders
      FROM products
      ${filterByCategories()}
      LEFT JOIN reviews ON products.id = reviews.product_id
      LEFT JOIN orders ON products.id = orders.product_id 
      WHERE products.store_id = ${storeId} AND products.deleted_at IS NULL 
      GROUP BY  
        products.id,
        products.name, 
        products.sku, 
        products.max_order_quantity,
        products.active,
        products.return_policy,
        products.description,
        products.stock,
        products.price
      ${orderByType(type)}
      ${limit ? ` LIMIT ${limit} ` : ''};
    `, { type: QueryTypes.SELECT });

    if (products.length) {
      const productVariationsQuery = models.sequelize.query(`
        SELECT 
          product_variation_stocks.product_id AS "productId", 
          product_variation_stocks.variation_group AS "variationGroup",
          product_variation_stocks.stock AS stock,
          product_variation_stocks.max_order_quantity AS "maxOrderQuantity",
          product_variation_stocks.price
        FROM product_variation_stocks
        WHERE product_variation_stocks.product_id IN (${products.map(({id}) => id)}) AND store_id = ${storeId} AND product_variation_stocks.deleted_at IS NULL;
      `, { type: QueryTypes.SELECT });

      const productCategoriesQuery = models.sequelize.query(`
        SELECT 
          product_categories.product_id AS "productId", 
          product_categories.category_id AS "categoryId" ,
          categories.name AS "name",
          categories.id AS "id"
        FROM product_categories
        INNER JOIN categories ON categories.id = product_categories.category_id
        WHERE product_categories.product_id IN (${products.map(({id}) => id)}) AND categories.store_id = ${storeId} AND product_categories.deleted_at IS NULL;
      `, { type: QueryTypes.SELECT });

      const [productVariations, productCategories] = await Promise.all([productVariationsQuery, productCategoriesQuery]);

      const groupRelations = (source) => {
        let result = source.reduce((target, item) => {

          if (!target[item.name]) {
            target[item.name] = {productIds: [item.productId], id: item.variationId || item.categoryId};
          } else {
            target[item.name].productIds.push(item.productId)
          }
  
          if (item.option) {
            if (!target[item.name].values) target[item.name].values = [];
            target[item.name].values.push(item.option);
          }

          return target;
        }, {});

        result = Object.keys(result).map(key => ({name: key, ...result[key]}));

        return result;
      }

      const groupedCategories = groupRelations(productCategories);

      products.forEach(product => {
        const variations = productVariations.reduce((productVariation, variation) => {
          if (variation.productId === product.id) {
            const {productId, ...rest} = variation;
            productVariation.push(rest);
          }

          return productVariation;
        }, []);
        const categories = groupedCategories.filter(category => category.productIds.includes(product.id));
        product.variations = variations;
        product.categories = categories;
      });
    }

    return products;
  }catch(error){
    throw error;
  }
};

export const fetchProductsByIds = async ({storeId, id}) => {
  try {
    return await models.Product.findAll({
      where: {
        storeId,
        id,
        active: true,
        deletedAt: null
      },
      include: [{ model: models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null }}]
    })
  } catch (error) {
    throw error;
  }
}