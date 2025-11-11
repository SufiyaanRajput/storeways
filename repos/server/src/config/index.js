process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  endpointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8080' : 'api.storeways.io',
  isProduction: process.env.NODE_ENV == 'production',
  clientbaseUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  databaseURL: process.env.POSTGRES_URI,
  JWTSecret: process.env.JWT_SECRET,
  paymentGateway: {
    keyId: process.env.PAYMENT_GATEWAY_KEY_ID,
    keySecret: process.env.PAYMENT_GATEWAY_KEY_SECRET
  },
};