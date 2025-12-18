import { privateInstance } from "../../../internals/api.config";

export const addCategory = (payload) => privateInstance.post("/v1/admin/categories", payload);
export const updateCategory = ({ id, ...payload }) =>
  privateInstance.put(`/v1/admin/categories/${id}`, payload);
export const deleteCategory = ({ id }) => privateInstance.delete(`/v1/admin/categories/${id}`);
export const fetchCategories = () => privateInstance.get("/v1/admin/categories");

