import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {
  port: process.env.PORT || 8080,
  endpointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8080' : 'api.storeways.io',
  isProduction: process.env.NODE_ENV == 'production',
  clientbaseUrl: process.env.CLIENT_URL || 'http://store.localhost:3000',
  adminbaseUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  databaseURL: process.env.POSTGRES_URI,
  JWTSecret: process.env.JWT_SECRET,
  currency: process.env.CURRENCY || 'INR',
  paymentGateway: {
    keyId: process.env.PAYMENT_GATEWAY_KEY_ID,
    keySecret: process.env.PAYMENT_GATEWAY_KEY_SECRET,
    webhookSecret: process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET
  },
};