export const startPayment = async (params) => {
  const gateway = params.paymentGateway;

  if (gateway === 'stripe') {
    return import('./strategies/stripe').then(module => module.default(params));
  }

  if (gateway === 'razorpay') {
    return import('./strategies/razorpay').then(module => module.default(params));
  }

  throw new Error('Unsupported or unknown payment gateway');
};

export default startPayment;

