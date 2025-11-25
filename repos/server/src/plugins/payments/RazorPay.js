import axios from "axios";
import logger from "../../loaders/logger";
import crypto from 'crypto';
import config from "../../config";

RazorPay.prototype.createOrder = async function({ 
  amount,
  currency = 'INR',
  receipt = '1',
  cartReferenceId,
  storeId,
}) {
  try {
    const encodedBase64Token = 
		Buffer.from(`${config.paymentGateway.keyId}:${config.paymentGateway.keySecret}`).toString('base64');

    return axios.post('https://api.razorpay.com/v1/orders', {
      amount: amount * 100,
      currency,
      receipt,
      notes: {
        cartReferenceId: cartReferenceId || '',
        storeId: String(storeId || ''),
      }
    }, {
      headers: {
        Authorization: `Basic ${encodedBase64Token}`,
      }
    })
  } catch (error) {
    logger('PLUGINS-RAZORPAY-CREATE-ORDER-ERROR').error(error);
    throw error;
  }
}

RazorPay.prototype.getMetaData = function (payload) {
  try{
    const parsedPayload = JSON.parse(payload.toString("utf8"));
    const metadata = parsedPayload?.payload?.payment?.entity?.notes || {};

    return {
      ...metadata,
      gatewayReferenceId: parsedPayload.data.object.id,
    };
  } catch (error) {
    logger('PLUGINS-RAZORPAY-GET-META-DATA-ERROR').error(error);
    throw error;
  }
}

RazorPay.prototype.webhook = function (payload, signature) {
  let event;

  try {
    event = this.verifySignature(
      {
        signature,
        payload
      }
    );
  } catch (err) {
    logger('PLUGINS-RAZORPAY-WEBHOOK-ERROR').error(err);
    return { status: "verification_failed", type: 'error', isVerified: false };
  }

  const response = {
    // metadata: event.data.object.metadata,
    isVerified: true,
  };  

  switch (event.type) {
    case "payment.captured":
      response.type = "success";
      response.status = 'order_confirmed';
      break;
    case "payment.failed":
      response.type = "error";
      response.status = 'failed';
      break;
    default:
      response.type = "error";
      response.status = 'error';
      break;
  }

  return response;
};

RazorPay.prototype.verifySignature = function({ signature, payload }) {
  try{
    const expectedSignature = crypto
      .createHmac("sha256", config.paymentGateway.webhookSecret)
      .update(payload)
      .digest("hex");

    return expectedSignature == signature;
  }catch(error){
    throw error;
  }
}

function RazorPay(options = {}) {
  this.name = "razorpay";
  this.options = options;
}

export default RazorPay;