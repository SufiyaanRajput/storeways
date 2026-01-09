import { EventBus, EmailService } from '../services/integrations';

const eventBus = new EventBus();
const Email = new EmailService();

eventBus.on('order.cancelled', async (payload) => {
  const { customer, currentUser, orders } = payload;
  const referenceIds = orders.map((order) => order.referenceId);

  await Email.send({
    to: customer.email,
    subject: 'Order CANCELLED',
    html: `
      Hey ${customer.name.split(' ')[0]},

      <p>Your order with referrence ID: <strong>${referenceIds.join(', ')}</strong> has been <strong>Cancelled</strong>${currentUser.admin ? ' by the store!' : '!'}</p>
      <p>Doesn't seem right? You may get in touch by replying to this email</p>

      <p>Hope to see you again!</p>
    `,
  });
});