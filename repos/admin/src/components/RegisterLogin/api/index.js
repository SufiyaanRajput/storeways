import { publicInstance } from "../../../utils/api.config";

export const register = (payload) => publicInstance.post('/v1/users/register', payload);
export const login = (payload) => publicInstance.post('/v1/users/login', payload);
export const sendPasswordResetEmail = (payload) => publicInstance.post('/v1/users/password-reset-email', payload);
export const resetPassword = (payload) => publicInstance.post('/v1/users/password-reset', payload);