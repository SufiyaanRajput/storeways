import { getDatabase } from '../../../db';
import NewsletterSubscribersRepository from '../repositories/newsletterSubscribers';

class SubscribersService {
  constructor() {
    this.newsletterSubscribersRepository = new NewsletterSubscribersRepository({ models: getDatabase() });
  }

  async addNewsletterSubscriber({ name, email, storeId }) {
    return this.newsletterSubscribersRepository.addNewsletterSubscriber({ name, email, storeId });
  }
}

export default SubscribersService;