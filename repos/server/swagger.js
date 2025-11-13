import { productSwagger } from "./src/api/routes/admin/addProduct";
import { categoriesSwagger } from "./src/api/routes/admin/categories";
import { ordersSwagger } from "./src/api/routes/admin/orders";
import { updateProductsSwagger } from "./src/api/routes/admin/updateProduct";
import { variationsSwagger } from "./src/api/routes/admin/variation";
import { storeCustomizeSwagger } from "./src/api/routes/admin/storeCustomize";
import { fetchStoreSwagger } from "./src/api/routes/store/fetchStore";
import { productsSwagger } from "./src/api/routes/store/fechProducts";
import { shopFiltersSwagger } from "./src/api/routes/store/fechShopFilters";
import { myOrdersSwagger, cancelStoreOrdersSwagger } from "./src/api/routes/store/orders";
import { createOrderSwagger, confirmPaymentSwagger } from "./src/api/routes/store/payments";
import { reviewsSwagger } from "./src/api/routes/store/reviews";
import { addSubscriberSwagger } from "./src/api/routes/store/newsletter";
import { supportSwagger } from "./src/api/routes/support/createTicket";
import { registerSwagger, loginSwagger, passwordResetEmailSwagger, passwordResetSwagger, customerLoginSwagger, logoutSwagger, registerCustomerSwagger, sendOTPSwagger } from "./src/api/routes/users/account";
import { cartAddSwagger } from "./src/api/routes/cart/index";

const prefixPaths = (paths, base) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const out = {};
  Object.entries(paths).forEach(([route, def]) => {
    const normalizedRoute = route === '/' ? '' : (route.startsWith('/') ? route : `/${route}`);
    const full = `${normalizedBase}${normalizedRoute}`.replace(/\/+$/, '');
    out[full || '/'] = def;
  });
  return out;
}

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'My Open Source API',
    version: '1.0.0',
    description: 'API documentation for my Node.js monorepo project',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local dev server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // 👈 important for Swagger UI to show as JWT
      },
    },
  },
  paths: {
    // Admin
    ...prefixPaths(productSwagger, '/v1/admin'),
    ...prefixPaths(updateProductsSwagger, '/v1/admin'),
    ...prefixPaths(categoriesSwagger, '/v1/admin'),
    ...prefixPaths(ordersSwagger, '/v1/admin'),
    ...prefixPaths(variationsSwagger, '/v1/admin'),
    ...prefixPaths(storeCustomizeSwagger, '/v1/admin'),
    // Stores
    ...prefixPaths(fetchStoreSwagger, '/v1/stores'),
    ...prefixPaths(productsSwagger, '/v1/stores'),
    ...prefixPaths(shopFiltersSwagger, '/v1/stores'),
    ...prefixPaths(myOrdersSwagger, '/v1/stores'),
    ...prefixPaths(cancelStoreOrdersSwagger, '/v1/stores'),
    ...prefixPaths(reviewsSwagger, '/v1/stores'),
    ...prefixPaths(addSubscriberSwagger, '/v1/stores'),
    ...prefixPaths(createOrderSwagger, '/v1/stores/payments'),
    ...prefixPaths(confirmPaymentSwagger, '/v1/stores/payments'),
    // Users
    ...prefixPaths(registerSwagger, '/v1/users'),
    ...prefixPaths(loginSwagger, '/v1/users'),
    ...prefixPaths(passwordResetEmailSwagger, '/v1/users'),
    ...prefixPaths(passwordResetSwagger, '/v1/users'),
    ...prefixPaths(customerLoginSwagger, '/v1/users'),
    ...prefixPaths(logoutSwagger, '/v1/users'),
    ...prefixPaths(registerCustomerSwagger, '/v1/users'),
    ...prefixPaths(sendOTPSwagger, '/v1/users'),
    // Unmounted/Other (left as-is)
    ...supportSwagger,
    ...cartAddSwagger,
  },
};

export default swaggerDocument;