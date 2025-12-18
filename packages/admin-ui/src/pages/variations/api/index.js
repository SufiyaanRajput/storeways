import { privateInstance } from "../../../internals/api.config";

export const addVariation = (payload) => privateInstance.post("/v1/admin/variations", payload);
export const updateVariation = ({ id, ...payload }) =>
  privateInstance.put(`/v1/admin/variations/${id}`, payload);
export const deleteVariation = ({ id }) => privateInstance.delete(`/v1/admin/variations/${id}`);
export const fetchVariations = () => privateInstance.get("/v1/admin/variations");

