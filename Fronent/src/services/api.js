import axios from 'axios';
import config, { debugLog } from '../config/config.js';

// Configuración base de Axios
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitudes para agregar el token JWT
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de debug para requests
    debugLog('API Request:', {
      method: requestConfig.method,
      url: requestConfig.url,
      data: requestConfig.data
    });
    
    return requestConfig;
  },
  (error) => {
    debugLog('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Log de debug para responses exitosas
    debugLog('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
    return response;
  },
  (error) => {
    // Log de debug para errores
    debugLog('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.userKey);
      window.location.href = '/login';
    }
    
    // Mapear errores comunes
    let errorMessage;
    switch (error.response?.status) {
      case 400:
        errorMessage = error.response?.data?.message || config.errors.validation;
        break;
      case 401:
        errorMessage = config.errors.unauthorized;
        break;
      case 403:
        errorMessage = config.errors.forbidden;
        break;
      case 404:
        errorMessage = config.errors.notFound;
        break;
      case 500:
        errorMessage = config.errors.serverError;
        break;
      default:
        if (error.code === 'ECONNABORTED') {
          errorMessage = config.errors.timeout;
        } else if (error.message === 'Network Error') {
          errorMessage = config.errors.network;
        } else {
          errorMessage = error.response?.data?.message || error.message || config.errors.unknown;
        }
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    });
  }
);

export default api;

// Funciones de utilidad para peticiones comunes
export const apiUtils = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
};