import getConfig from "../../../config";
import { getPlugin } from "../../plugins/registry";

let paymentGateway = null;

const getPaymentGateway = () => {
  if (!paymentGateway) {
    const pluginConfig = getConfig().plugins.find(plugin => plugin.key === 'payment-gateway');
    const PaymentService = getPlugin('payment-gateway'); 
    paymentGateway = new PaymentService(pluginConfig.options);
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

function PaymentGateway() {}

export default PaymentGateway;