import { publicInstance, privateInstance } from "themes/utils/api.config";

export const createOrder = (payload) => publicInstance.post('/v1/stores/payments/orders', payload);
export const confirmPayment = (payload) => privateInstance.post('/v1/stores/payments/confirm', payload);