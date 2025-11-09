import { privateInstance } from "themes/utils/api.config";

export const createReview = (payload) => privateInstance.post('/v1/stores/reviews', payload);
export const fetchReviews = ({productId}) => privateInstance.get(`/v1/stores/reviews/${productId}`);