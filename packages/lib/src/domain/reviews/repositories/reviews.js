import BaseRepository from '../../base.repository';

class ReviewsRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async update(clause, updates) {
    return this.models.Review.update(updates, {where: clause});
  }

  async find(payload) {
    const reviews = await this.models.Review.findAll(payload);
    return reviews.map((review) => review.get({ plain: true }));
  }

  async create(payload) {
    const review = await this.models.Review.create(payload);
    return review.get({ plain: true });
  }
}

export default ReviewsRepository;
