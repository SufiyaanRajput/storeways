const stripeStrategy = async ({ paymentOrder }) => {
    if (paymentOrder?.url) {
      window.location.href = paymentOrder.url;
      return;
    }
    throw new Error('Stripe session URL missing');
  };

  export default stripeStrategy;