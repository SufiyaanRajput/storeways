import { publicInstance } from "../../../internals/api.config";

export const login = (payload) => publicInstance.post("/v1/users/login", payload);
export const register = (payload) => publicInstance.post("/v1/users/register", payload);
export const sendPasswordResetEmail = (payload) =>
  publicInstance.post("/v1/users/password-reset", payload);
export const resetPassword = (payload) =>
  publicInstance.post("/v1/users/password-reset/verify", payload);

