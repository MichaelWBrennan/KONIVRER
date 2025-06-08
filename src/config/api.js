/**
 * API configuration and axios instance
 */
import axios from 'axios';

import { env } from './env.js';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    if (env.ENABLE_DEBUG) {
      config.metadata = { startTime: new Date() };
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Log response time in development
    if (env.ENABLE_DEBUG && response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.warn(`API Request to ${response.config.url} took ${duration}ms`);
    }

    return response;
  },
  error => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Only redirect to login if we're actually trying to access protected resources
      // Don't redirect for general API failures
      const isProtectedRoute = error.config?.url?.includes('/auth/') || 
                              error.config?.url?.includes('/user/') ||
                              error.config?.url?.includes('/admin/');
      
      if (isProtectedRoute) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }

    // Log errors in development
    if (env.ENABLE_DEBUG) {
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
