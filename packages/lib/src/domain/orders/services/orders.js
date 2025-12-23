import { Product } from "../../products/services";
import OrdersRepository from "../repositories/orders";
import { Users } from "../../users/services";
import { getAdapter } from "../../../boot/loaders/adapters";
import { getTransaction, getDatabase } from "../../../db";
import { DELIVERY_STATUSES } from "../constants";

class OrderService {
  constructor() {
    this.ordersRepository = new OrdersRepository({ models: getDatabase() });
    this.productService = new Product();
    this.usersService = new Users();
  }

  async getProductIdsWithMostOrders({ storeId, limit = 10 }) {
    const productIdsWithMostOrders = await this.ordersRepository.getProductIdsWithMostOrders({ storeId, limit });
    return productIdsWithMostOrders;
  }

  async fetchAll({storeId, userId, admin, textSearchType, search, deliveryStatus}) {
    return this.ordersRepository.fetchAll({storeId, userId, admin, textSearchType, search, deliveryStatus});
  }

  async cancel({referenceIds, storeId, customerId, admin, storeSupport}) {
    const transaction = await getTransaction();
    const user = await this.usersService.fetchById(customerId);
    const orders = await this.ordersRepository.cancel({referenceIds, storeId, user, admin, storeSupport, transaction});
    await this.productService.updateStock({products: orders, transaction, operation: '+'});
    await transaction.commit();

    const EmailService = getAdapter('emailService');

    await EmailService.send({
      to: user.email,
      subject: 'Order CANCELLED',
      html: `
        Hey ${user.name.split(' ')[0]},

        <p>Your order with referrence ID: <strong>${referenceIds.join(', ')}</strong> has been <strong>Cancelled</strong>${admin ? ' by the store!' : '!'}</p>
        <p>Doesn't seem right? You may get in touch by replying to this email</p>

        <p>Hope to see you again!</p>
      `,
    });
  }

  async update({storeId, customerId, referenceId, storeSupport, ...updates}) {
    const user = await this.usersService.fetchById(customerId);
    await this.ordersRepository.update({user, storeId, referenceId, storeSupport, ...updates});

    if (updates.deliveryStatus !== undefined) {
      const EmailService = getAdapter('emailService');

      await EmailService.send({
        to: user.email,
        subject: 'Order updated',
        html: `
          Hey ${user.name.split(' ')[0]},
  
          <p>Your order with referrence ID: <strong>${referenceId}</strong> is in <strong>${DELIVERY_STATUSES.find(d => d.value === updates.deliveryStatus).label}</strong></p>
          <p>We're always here. You may get in touch by replying to this email</p>
  
          <p>Hope to see you again!</p>
        `,
      });
    }
  }
}

export default OrderService;