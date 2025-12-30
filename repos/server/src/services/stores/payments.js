import { getDatabase } from '@storeways/lib/db/models';
const models = getDatabase();
import { makeAuthToken } from '../users/account';
import { customAlphabet } from 'nanoid';
import { getVariationGroupBySelection } from '../../utils/helpers';
import PaymentGateway from '../integrations/PaymentGateway';
import config from '../../config';
import { sendOrderMail, confirmOrdersAfterPayment, processOrder } from '../orders';
import { Order as OrderService } from '@storeways/lib/domain';

const Order = new OrderService();

export const paymentWebhook = async (payload, headers, query) => {
  try{
    console.log('paymentWebhook');
    const paymentGateway = new PaymentGateway();
    const signature = headers[paymentGateway.getInstance()?.signatureKey];

    const { status, isVerified } = await paymentGateway.webhook(
      payload,
      signature,
    );

    const { cartReferenceId, storeId, gatewayReferenceId } = paymentGateway.getMetaData(payload);

    await Order.processOrder({ 
      cartReferenceId, 
      storeId: Number(storeId), 
      isVerified, 
      status, 
      metaData: { gatewayReferenceId }
    });
  } catch(error){
    throw error;
  }
};