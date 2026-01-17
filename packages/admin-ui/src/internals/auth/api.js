import { privateInstance } from "../api.config";

export const logout = () => privateInstance.post(`/v1/admin/logout`);

