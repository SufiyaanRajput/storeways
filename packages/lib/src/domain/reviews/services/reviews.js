import { getDatabase } from '../../../db';
import { Order } from '../../orders/services';
import ReviewsRepository from '../repositories/reviews';
import { Users } from '../../users/services';

class ReviewService {
  constructor() {
    this.reviewsRepository = new ReviewsRepository({ models: getDatabase() });
    this.orderService = new Order({ models: getDatabase() });
    this.usersService = new Users({ models: getDatabase() });
  }

  async createUpdateReview({id, storeId, userId, productId, ratings, content}) {
    try{
      if (id) {
        return await this.reviewsRepository.update({productId, storeId, userId, id}, {content, ratings});
      }
  
      const [hasBought, hasReviewed] = await Promise.all([
        this.orderService.fetch({
          userId,
          productId,
          storeId
        }),
        this.reviewsRepository.find({
          userId,
          productId,
          storeId
        }),
      ]);
  
      if (!hasBought) {
        throw {status: 400, msgText: 'Please purchase the product to add a review!', error: new Error()};
      }
  
      if (hasReviewed) {
        throw {status: 400, msgText: 'You have already added a review for this product!', error: new Error()};
      }
  
      await this.reviewsRepository.create({productId, storeId, userId, content, ratings});
    }catch(error){
      throw error;
    }
  };

  async getReviewsByProduct({userId, storeId, productId}) {
    try{
      let reviews = await this.reviewsRepository.find({
        productId,
        storeId,
      });

      if (!reviews.length) {
        return [];
      }

      const users = await this.usersService.fetchById(reviews.map((review) => review.userId));

      reviews = this.reviewsRepository.hydrateRelation({
        parentList: reviews,
        childList: [{
          parentForeignKey: 'userId',
          childKey: 'id',
          as: 'users',
          items: users
        }],
      });

      return reviews;
    }catch(error){
      throw error;
    }
  };
}

export default ReviewService;