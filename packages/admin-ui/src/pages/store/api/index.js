import { privateInstance } from "../../../internals/api.config";

export const uploadLogo = (form) => privateInstance.post("/v1/admin/uploads/logo", form);
export const updateStoreSettings = (payload) => privateInstance.put("/v1/admin/customize/store", payload);
export const getStoreSettings = () => privateInstance.get("/v1/admin/customize/settings");
export const deleteLogo = (fileId) => privateInstance.delete(`/v1/admin/uploads/logo/${fileId}`);
export const updateStore = (payload) => privateInstance.put("/v1/admin/stores", payload);

