import { privateInstance } from "../../../../utils/api.config";

export const fetchOrders = ({deliveryStatus, search, page=1, textSearchType} = {}) => privateInstance.get(
  `/v1/admin/orders?page=${page}${deliveryStatus && !isNaN(deliveryStatus) ? '&deliveryStatus='+deliveryStatus: ''}${search && textSearchType ? '&search=' + encodeURIComponent(search) + '&textSearchType=' + textSearchType : ''}`
);
export const cancelOrders = (payload) => privateInstance.put('/v1/admin/orders/cancel', payload);
export const updateOrder = (payload) => privateInstance.put('/v1/admin/orders', payload);