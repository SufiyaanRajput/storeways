const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
};

const razorpayStrategy = async ({ paymentOrder, amount, store, customer, callback }) => {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  const options = {
    key: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_KEY_ID,
    amount,
    currency: 'INR',
    name: store.name,
    description: ``,
    order_id: paymentOrder.id,
    handler: function (response){
      callback?.(response);
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.mobile
    },
  }

  const razorpay = new window.Razorpay(options);
  razorpay.on('payment.failed', function (){
    // Modal.error({
    //   title: '',
    //   wrapClassName: 'modalInstance',
    //   content: (
    //     <div>
    //       <Space direction="vertical">
    //         <p>Payment failed. Please try again.</p>
    //       </Space>
    //     </div>
    //   ),
    //   maskClosable: true,
    //   okButtonProps: {style: {display: 'none'}}
    // });
  });
  razorpay.open();
};

export default razorpayStrategy;
