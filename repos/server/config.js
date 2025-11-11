import config from './src/config';

const getConfig = () => ({
  plugins: [
    {
			key: 'storage',
      resolve: `./storage/LocalFileStorage`,
      options: {
        uploadDir: "uploads", // relative to your project root
      },
    },
    {
			key: 'payment-gateway',
      resolve: `./payments/RazorPay`,
      options: {
        keyId: config.paymentGateway.keyId,
        keySecret: config.paymentGateway.keySecret
      },
    },
  ],
});

export default getConfig;