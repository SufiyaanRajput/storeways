process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  endpointBaseUrl: process.env.NODE_ENV != 'production' ? 'http://localhost:8080' : 'api.storeways.io',
  isProduction: process.env.NODE_ENV == 'production',
  clientbaseUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  databaseURL: process.env.POSTGRES_URI,
  JWTSecret: process.env.JWT_SECRET,
  postmarkKey: process.env.POSTMARK_KEY,
  ZOHO: {
    refreshToken: process.env.ZOHO_REFRESH_TOKEN,
    clientId: process.env.ZOHO_CLIENT_ID,
    secret: process.env.ZOHO_SECRET_KEY
  },
  imageKit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/oceanlabs"
  },
  razorpay: {
    clientId: process.env.RAZORPAY_KEY_ID,
    clientSecret: process.env.RAZORPAY_KEY_SECRET
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifyServiceId: process.env.TWILIO_VERIFY_SERVICE_ID,
  }
};