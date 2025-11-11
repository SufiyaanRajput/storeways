import axios from "axios";
import logger from "../../loaders/logger";
import crypto from 'crypto';

RazorPay.prototype.createOrder = async function({ amount, currency = 'INR', accountId, receipt = '1' }) {
  try {
    const encodedBase64Token = 
		Buffer.from(`${this.options.keyId}:${this.options.keySecret}`).toString('base64');

    return axios.post('https://api.razorpay.com/v1/orders', {
      amount: amount * 100,
      currency,
      receipt,
      account_id: accountId
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

RazorPay.prototype.verifySignature = function({razorpayOrderId, razorpayPaymentId, razorpaySignature}) {
    try{
      const hmac = crypto.createHmac('sha256', this.options.keySecret);
      hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
      const generatedSignature = hmac.digest('hex');
  
      return generatedSignature == razorpaySignature;
    }catch(error){
      throw error;
    }
  }

function RazorPay(options = {}) {
  this.name = "razorpay";
  this.options = options;
}

export default RazorPay;