import { privateInstance } from "../../../utils/api.config";

export const logout = () => privateInstance.post(`/v1/users/logout`);