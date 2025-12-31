import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { QueryTypes } from 'sequelize';
import { DELIVERY_STATUSES } from '../../utils/constants';
import Email from '../integrations/Email';
import { getVariationGroupBySelection } from '../../utils/helpers';
import config from '../../config';
import { Product } from '@storeways/lib/domain';

const product = new Product();

export const sendOrderMail = async ({
  to, 
  firstName, 
  subTotal, 
  cartReferenceId, 
  items, 
  total, 
  address, 
  supportEmail, 
  storeName
}) => {
  try {
    const EmailService = new Email();
    return EmailService.send({
      to,
      template_id: 'd-8b28c8c38a8149a883a27f27b02f177f',
      dynamic_template_data: {
        customer_name: firstName,
        order_id: cartReferenceId,
        order_date: new Date().toLocaleDateString(),
        order_note: "",
        subtotal: subTotal,
        shipping: 0,
        tax: 0,
        total: total,
        order_url: `${config.clientbaseUrl}/orders`,
        items: items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.amount,
          image: item.image,
        })),
        shipping_address: address,
      },
    });
  } catch (error) {
    console.error('[ORDERS]-sendOrderMail', error);
  }
}
