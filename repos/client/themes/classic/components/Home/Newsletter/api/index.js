import { publicInstance } from "themes/utils/api.config";

export const addSubscriber = (payload) => publicInstance.post('/v1/stores/newsletter', payload);