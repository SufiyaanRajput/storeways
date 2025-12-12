import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { Op, QueryTypes } from 'sequelize';

export const createUpdateReview = async ({id, storeId, userId, productId, ratings, content}) => {
  try{
    if (id) {
      return await models.Review.update({content, ratings}, {where: {productId, storeId, userId, id}});
    }

    const [hasBought, hasReviewed] = await Promise.all([
      models.Order.findOne({
        where: {
          userId,
          productId,
          storeId,
          status: {
            [Op.ne]: 'Cancelled'
          }
        },
        attributes: ['id']
      }),
      models.Review.findOne({
        where: {
          userId,
          productId,
          storeId
        },
        attributes: ['id']
      })
    ]);

    if (!hasBought) {
      throw {status: 400, msgText: 'Please purchase the product to add a review!', error: new Error()};
    }

    if (hasReviewed) {
      throw {status: 400, msgText: 'You have already added a review for this product!', error: new Error()};
    }

    await models.Review.create({productId, storeId, userId, content, ratings});
  }catch(error){
    throw error;
  }
};

export const getReviewsByProduct = async ({userId, storeId, productId}) => {
  try{
    return await models.sequelize.query(`
    SELECT reviews.id, reviews.content, reviews.ratings, reviews.updated_at as "date", users.name AS "author", user_id AS "authorId" FROM reviews 
    INNER JOIN users ON reviews.user_id = users.id AND users.deleted_at IS NULL AND users.active = true
    WHERE reviews.product_id = ${productId} AND reviews.store_id = ${storeId} ${userId ? `AND reviews.user_id = ${userId}` : ''}
    ORDER BY reviews.updated_at DESC;
  `, { type: QueryTypes.SELECT });
  }catch(error){
    throw error;
  }
};
