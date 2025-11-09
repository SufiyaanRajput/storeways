import axios from 'axios';
import Router from 'next/router'

export const endpointBaseUrl = process.env.NEXT_PUBLIC_ENDPOINT_BASE_URL || 'http://www.localhost:8080';

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
  if (error.response.status === 400 && error.response.data.errorCode === 1000) {
    window.location = '/404';
  }

  if (error.response.status === 401) {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    window.location = '/';
  }

  return Promise.reject(error);
});

export const publicInstance = axios.create({
  baseURL: endpointBaseUrl
});

publicInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 400 && error.response.data.errorCode === 1000) {
    Router.push('/site-not-found');
  }

  return Promise.reject(error);
});