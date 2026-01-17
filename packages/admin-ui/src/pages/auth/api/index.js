import { publicInstance } from "../../../internals/api.config";

export const login = (payload) => publicInstance.post("/v1/admin/login", payload);
export const register = (payload) => publicInstance.post("/v1/users/register", payload);
export const sendPasswordResetEmail = (payload) =>
  publicInstance.post("/v1/admin/password-reset", payload);
export const resetPassword = (payload) =>
  publicInstance.post("/v1/admin/password-reset/verify", payload);

