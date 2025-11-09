import axios from 'axios';

export const endpointBaseUrl = process.env.REACT_APP_ENDPOINT_BASE_URL || 'http://www.localhost:8080';

export const privateInstance = axios.create({
  baseURL: endpointBaseUrl
});

privateInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

privateInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 401) {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    window.location = '/login';
  } else {
      return Promise.reject(error);
  }
});

export const publicInstance = axios.create({
  baseURL: endpointBaseUrl
});