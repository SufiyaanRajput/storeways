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
    },
    {
			key: 'email-service',
      resolve: `./communications/SendGrid`,
      packages: ['@sendgrid/mail'],
      options: {
        from: 'theoceanlabs@gmail.com',
      },
    },
  ],
});

export default getConfig;