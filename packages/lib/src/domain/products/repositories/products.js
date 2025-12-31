import BaseRepository from '../../base.repository';
import { QueryTypes } from 'sequelize';

class ProductsRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  };

  async create({ categoryIds, variations = [], ...payload }) {
    try {
      const categories = await this.models.Category.findAll({
        where: { id: categoryIds, deletedAt: null },
        attributes: ['id'],
      });
  
      if (!categories.length) throw { status: 400, msgText: 'Category does not exit!', error: new Error() };
  
      return this.models.sequelize.transaction(async (transaction) => {
        const product = await this.models.Product.create({ ...payload }, { transaction });
        const promises = [];
  
        if (variations && variations.length && variations[0].variationGroup) {
          const productVariationStock = [];
  
          variations.forEach((v) => {
            productVariationStock.push({
              maxOrderQuantity: v.maxOrderQuantity,
              price: v.price,
              stock: v.stock,
              productId: product.id,
              storeId: payload.storeId,
              variationGroup: v.variationGroup,
            });
          });
  
          promises.push(this.models.ProductVariationStock.bulkCreate(productVariationStock, { transaction }));
        }
  
        const productCategories = categories.map((category) => {
          return {
            productId: product.id,
            categoryId: category.id,
          };
        });
  
        promises.push(this.models.ProductCategory.bulkCreate(productCategories, { transaction }));
  
        await Promise.all(promises);
  
        return product;
      });
    } catch (error) {
      throw error;
    }
  };

  async fetch(payload) {
    try {
      return this.models.Product.findOne({
        where: payload,
      });
    } catch (error) {
      throw error;
    }
  };

  async fetchAll({ storeId, type, limit, categories = [] }) {
    const orderByType = (t) => {
      switch (t) {
        case 'LATEST':
          return ' ORDER BY id DESC ';
        case 'MOST_RATED':
          return ' ORDER BY ratings DESC ';
        default:
          return '';
      }
    };
  
    const filterByCategories = () => {
      if (categories.length) {
        return `
          INNER JOIN product_categories ON product_categories.product_id = products.id AND product_categories.category_id IN (${categories.join(',')})
        `;
      }
  
      return '';
    };
  
    try {
      const products = await this.models.sequelize.query(
        `
        SELECT 
          ${
            categories.length
              ? 'DISTINCT ON (products.id)'
              : ''
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
          ROUND(AVG(reviews.ratings), 1) AS "ratings"
        FROM products
        ${filterByCategories()}
        LEFT JOIN reviews ON products.id = reviews.product_id
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
      `,
        { type: QueryTypes.SELECT }
      );
  
      if (products.length) {
        const productVariationsQuery = this.models.sequelize.query(
          `
          SELECT 
            product_variation_stocks.product_id AS "productId", 
            product_variation_stocks.variation_group AS "variationGroup",
            product_variation_stocks.stock AS stock,
            product_variation_stocks.images AS images,
            product_variation_stocks.max_order_quantity AS "maxOrderQuantity",
            product_variation_stocks.price
          FROM product_variation_stocks
          WHERE product_variation_stocks.product_id IN (${products.map(({ id }) => id)}) AND store_id = ${storeId} AND product_variation_stocks.deleted_at IS NULL;
        `,
          { type: QueryTypes.SELECT }
        );
  
        const productCategoriesQuery = this.models.sequelize.query(
          `
          SELECT 
            product_categories.product_id AS "productId", 
            product_categories.category_id AS "categoryId" ,
            categories.name AS "name",
            categories.id AS "id"
          FROM product_categories
          INNER JOIN categories ON categories.id = product_categories.category_id
          WHERE product_categories.product_id IN (${products.map(({ id }) => id)}) 
            AND categories.store_id = ${storeId} 
            AND product_categories.deleted_at IS NULL;
        `,
          { type: QueryTypes.SELECT }
        );
  
        const [productVariations, productCategories] = await Promise.all([productVariationsQuery, productCategoriesQuery]);
  
        const groupedCategories = this.groupRelationsByName({
          source: productCategories,
          parentKeyTarget: 'productIds',
          parentKey: 'productId',
          childKey: 'categoryId',
          optionKey: 'option'
        });
  
        products.forEach((product) => {
          const variations = productVariations.reduce((productVariation, variation) => {
            if (variation.productId === product.id) {
              const { productId, ...rest } = variation;
              productVariation.push(rest);
            }
  
            return productVariation;
          }, []);
          const categoriesForProduct = groupedCategories.filter((category) => category.productIds.includes(product.id));
          product.variations = variations;
          product.categories = categoriesForProduct;
        });
      }
  
      return products;
    } catch (error) {
      throw error;
    }
  };

  async fetchByIds(id) {
    try {
      const products = await this.models.Product.findAll({
        where: {
          id,
          active: true,
          deletedAt: null,
        },
        include: [{ model: this.models.ProductVariationStock, as: 'productVariationStocks', where: { deletedAt: null } }],
      });

      return products.map((product) => (product?.get ? product.get({ plain: true }) : product));
    } catch (error) {
      throw error;
    }
  };

  async update({ categoryIds, variations = [], storeId, ...payload }) {
    try {
      const categories = await this.models.Category.findAll({
        where: { id: categoryIds, deletedAt: null },
        attributes: ['id'],
      });
  
      if (!categories.length) throw { status: 400, msgText: 'Category does not exit!', error: new Error() };
  
      var transaction = await this.models.sequelize.transaction();
  
      const promises = [
        this.models.Product.update(
          { ...payload },
          {
            where: {
              id: payload.id,
              storeId,
            },
            transaction,
          }
        ),
      ];
  
      if (variations && variations.length && variations[0].variationGroup) {
        const productVariationStock = [];
  
        variations.forEach((v) => {
          productVariationStock.push({
            maxOrderQuantity: v.maxOrderQuantity,
            price: v.price,
            stock: v.stock,
            variationGroup: v.variationGroup,
            images: v.images,
            storeId,
            productId: payload.id,
          });
        });
  
        promises.push(this.models.ProductVariationStock.bulkCreate(productVariationStock, { transaction }));
      }
  
      const productCategories = categories.map((category) => {
        return {
          productId: payload.id,
          categoryId: category.id,
        };
      });
  
      await Promise.all([
        this.models.ProductVariationStock.update({ deletedAt: new Date() }, { where: { storeId, productId: payload.id } }, { transaction }),
        this.models.ProductCategory.update({ deletedAt: new Date() }, { where: { productId: payload.id }, transaction }),
      ]);
  
      promises.push(this.models.ProductCategory.bulkCreate(productCategories, { transaction }));
  
      await Promise.all(promises);
      await transaction.commit();
    } catch (error) {
      transaction && transaction.rollback();
      throw error;
    }
  }

  async delete({ storeId, id }) {
    try {
      await this.models.sequelize.transaction(async (transaction) => {
        try {
          await this.models.Product.update({ deletedAt: new Date() }, { where: { id, storeId }, transaction });
          // await this.models.ProductVariation.update({ deletedAt: new Date() }, { where: { productId: id }, transaction });
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  async updateStock({ products, transaction, operation = '-' }) {
    try {
      let variationStockUpdateQuery = `
      UPDATE product_variation_stocks SET stock = (
        CASE
    `;
  
      let stockUpdateQuery = `
      UPDATE products SET stock = (
        CASE
    `;
  
      let hasVariations = false,
        hasNonVariants = false,
        promises = [];
  
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
        ) WHERE product_id IN (${products.map(({ id }) => id).join(',')}) AND stock > 0 AND deleted_at IS NULL
      `;
  
      stockUpdateQuery += `
        END
        ) WHERE id IN (${products.map(({ id }) => id).join(',')}) AND stock > 0
      `;
  
      if (hasVariations) {
        promises.push(this.models.sequelize.query(variationStockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
      }
  
      if (hasNonVariants) {
        promises.push(this.models.sequelize.query(stockUpdateQuery, { type: QueryTypes.UPDATE, transaction }));
      }
  
      return promises;
    } catch (error) {
      throw error;
    }
  };
}

export default ProductsRepository;