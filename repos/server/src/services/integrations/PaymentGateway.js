import StripeGateway from "../../plugins/payments/Stripe";

let paymentGateway = null;

const getPaymentGateway = () => {
  if (!paymentGateway) {
    paymentGateway = new StripeGateway();
  }

  return paymentGateway;
}

PaymentGateway.prototype.createOrder = async function(...args) {
  return getPaymentGateway().createOrder(...args);
};

PaymentGateway.prototype.verifySignature = async function(...args) {
  return getPaymentGateway().verifySignature(...args);
};  

PaymentGateway.prototype.getInstance = function() {
  return getPaymentGateway();
};

PaymentGateway.prototype.webhook = function(...args) {
  return getPaymentGateway().webhook(...args);
};

PaymentGateway.prototype.getMetaData = function(...args) {
  return getPaymentGateway().getMetaData(...args);
};

PaymentGateway.prototype.name = getPaymentGateway().name;

function PaymentGateway() {}

export default PaymentGateway;