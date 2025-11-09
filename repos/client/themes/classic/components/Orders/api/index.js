import { privateInstance } from "themes/utils/api.config";

export const fetchOrders = () => privateInstance.get('/v1/stores/orders');
export const cancelOrders = (payload) => privateInstance.put('/v1/stores/orders/cancel', payload);