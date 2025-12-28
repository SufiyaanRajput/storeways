import { privateInstance } from "../../../internals/api.config";

export const fetchOrders = ({ deliveryStatus, search, page = 1, textSearchType, filters } = {}) => {
  const params = { page };

  if (deliveryStatus !== undefined && deliveryStatus !== null && !isNaN(deliveryStatus)) {
    params.deliveryStatus = deliveryStatus;
  }

  if (search && textSearchType) {
    params.search = search;
    params.textSearchType = textSearchType;
  }

  if (Array.isArray(filters) && filters.length) {
    params.filters = JSON.stringify(filters);
  }

  return privateInstance.get("/v1/admin/orders", { params });
};

export const fetchOrderFilters = () => privateInstance.get("/v1/admin/orders/filters");

export const cancelOrders = (payload) => privateInstance.put("/v1/admin/orders/cancel", payload);
export const updateOrder = (payload) => privateInstance.put("/v1/admin/orders", payload);

