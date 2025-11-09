import { publicInstance } from "themes/utils/api.config";

export const getProductsByIds = (payload) => publicInstance.get('/v1/stores/products', {params: payload});