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

    // const webhook = await this.stripe.webhookEndpoints.create({
    //   url: `https://walter-clean-marketplace-territory.trycloudflare.com/v1/stores/payments/webhook?storeId=${storeId}&cartReferenceId=${cartReferenceId}`,
    //   enabled_events: ['checkout.session.completed'],
    // });

    // console.log('webhook', webhook);

    // Match axios-like response shape used by services
    return { data: session };
  } catch (error) {
    logger('PLUGINS-STRIPE-CREATE-CHECKOUT-ERROR').error(error);
    throw error;
  }
}

StripeGateway.prototype.webhook = function (rawBody, signature, secret) {
  let event;

  try {
    event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      secret
    );
  } catch (err) {
    logger('PLUGINS-STRIPE-WEBHOOK-ERROR').error(err);
    return { status: "error", type: event.type };
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      return {
        status: "success",
        type: 'completed',
        metadata: session.metadata,
        session
      };

    default:
      return { status: "ignored", type: event.type };
  }
};

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

