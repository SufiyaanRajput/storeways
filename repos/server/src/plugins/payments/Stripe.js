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
      payment_intent_data: {
        metadata: {
          cartReferenceId: cartReferenceId || '',
          storeId: String(storeId || ''),
        }
      }
    });

    // const webhook = await this.stripe.webhookEndpoints.create({
    //   url: `https://christopher-bruce-skirt-trans.trycloudflare.com/v1/stores/payments/webhook`,
    //   enabled_events: [
    //     'payment_intent.succeeded', 
    //     'payment_intent.canceled', 
    //     'payment_intent.payment_failed', 
    //     'checkout.session.expired'
    //   ],
    // });

    // console.log('webhook', webhook);

    // Match axios-like response shape used by services
    return { data: session };
  } catch (error) {
    logger('PLUGINS-STRIPE-CREATE-CHECKOUT-ERROR').error(error);
    throw error;
  }
}

RazorPay.prototype.getMetaData = function (payload) {
  try{
    const parsedPayload = JSON.parse(payload.toString("utf8"));
    const metadata = parsedPayload?.data?.object?.metadata || {};
    return {
      ...metadata,
      gatewayReferenceId: parsedPayload.data.object.id,
    };
  } catch (error) {
    logger('PLUGINS-STRIPE-GET-META-DATA-ERROR').error(error);
    throw error;
  }
}

StripeGateway.prototype.webhook = function (rawBody, signature) {
  let event;

  try {
    event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.paymentGateway.webhookSecret
    );
  } catch (err) {
    logger('PLUGINS-STRIPE-WEBHOOK-ERROR').error(err);
    return { status: "verification_failed", type: 'error', isVerified: false };
  }

  const response = {
    metadata: event.data.object.metadata,
    isVerified: true,
  };  

  switch (event.type) {
    case "payment_intent.succeeded":
      response.type = "success";
      response.status = 'order_confirmed';
      break;
    case "payment_intent.canceled":
      response.type = "error";
      response.status = 'canceled';
      break;
    case "payment_intent.payment_failed":
      response.type = "error";
      response.status = 'failed';
      break;
    case "checkout.session.expired":
      response.type = "error";
      response.status = 'expired';
      break;
    default:
      response.type = "error";
      response.status = 'error';
      break;
  }

  return response;
};

function StripeGateway(options = {}) {
  this.name = "stripe";
  this.options = options;
  this.signatureKey = 'stripe-signature';
  const secretKey = config.paymentGateway.keySecret;

  if (!secretKey) {
    throw new Error('Stripe secretKey is required in plugin options');
  }
  this.stripe = new Stripe(secretKey);
}

export default StripeGateway;

