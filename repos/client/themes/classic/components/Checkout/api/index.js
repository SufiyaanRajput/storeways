import { publicInstance } from "themes/utils/api.config";

export const createOrder = (payload) => publicInstance.post('/v1/stores/payments/orders', payload);