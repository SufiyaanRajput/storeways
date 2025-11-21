import Stripe from 'stripe';
import logger from "../../loaders/logger";
import { get } from 'lodash';
import config from '../../config';

StripeGateway.prototype.createOrder = async function({
  amount,
  currency = 'USD',
  products = [],
  successUrl,
  cancelUrl,
  cartReferenceId,
  storeId,
}) {
  try {
    const lineItems = products.map((product) => {
      const unitAmount = amount;
      return {
        price_data: {
          currency,
          product_data: {
            name: product.name,
            images: get(product, 'images', []).map(image => image.url),
          },
          unit_amount: unitAmount,
        },
        quantity: Number(product.quantity) || 1,
      };
    });

    console.log('lineItems', lineItems);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        cartReferenceId: cartReferenceId || '',
        storeId: String(storeId || ''),
      },
    });

    // Match axios-like response shape used by services
    return { data: session };
  } catch (error) {
    logger('PLUGINS-STRIPE-CREATE-CHECKOUT-ERROR').error(error);
    throw error;
  }
}

function StripeGateway(options = {}) {
  this.name = "stripe";
  this.options = options;
  const secretKey = config.paymentGateway.keySecret;

  if (!secretKey) {
    throw new Error('Stripe secretKey is required in plugin options');
  }
  this.stripe = new Stripe(secretKey);
}

export default StripeGateway;

