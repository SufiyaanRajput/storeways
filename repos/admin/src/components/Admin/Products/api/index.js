import { privateInstance } from "../../../../utils/api.config";

export const addProduct = (payload) => privateInstance.post('/v1/admin/products', payload);
export const updateProduct = ({id, ...payload}) => privateInstance.put(`/v1/admin/products/${id}`, payload);
export const deleteProduct = ({id}) => privateInstance.delete(`/v1/admin/products/${id}`);
export const addProductImage = (form) => privateInstance.post(`/v1/admin/products/image`, form);
export const deleteProductImage = ({imageId}) => privateInstance.delete(`/v1/admin/products/image/${imageId}`);
export const fetchProducts = () => privateInstance.get('/v1/stores/products');