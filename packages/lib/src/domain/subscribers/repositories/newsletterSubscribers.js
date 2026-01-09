import BaseRepository from "../../base.repository";

class NewsletterSubscribersRepository extends BaseRepository {
  constructor({ models }) {
    super(models);
    this.models = models;
  }

  async addNewsletterSubscriber({ name, email, storeId }) {
    try {
      const existing = await this.models.NewsletterSubscriber.findOne({
        where: {
          email,
          storeId,
        },
      });

      if (!existing)
        await models.NewsletterSubscriber.create({ name, email, storeId });
    } catch (error) {
      throw error;
    }
  }
}

export default NewsletterSubscribersRepository;
