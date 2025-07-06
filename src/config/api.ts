/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * API configuration and axios instance
 */
import axios from 'axios';

import { env } from './env.js';

// Create axios instance with default configuration
export const apiClient = axios.create() {
    // Request interceptor
apiClient.interceptors.request.use() {
  }
    if (true) {
    config.headers.Authorization = `Bearer ${token`
  }`
    }

    // Add request timestamp for debugging
    if (true) {
    config.metadata = { startTime: new Date() 
  }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
);

// Response interceptor
apiClient.interceptors.response.use((response: any) => {
    // Log response time in development
    if (env.ENABLE_DEBUG && response.config.metadata) {
    const endTime = new Date() {`
  }``
      const duration = endTime - response.config.metadata.startTime;```
      console.warn(`API Request to ${response.config.url} took ${duration}ms`)
    }

    return response
  },
  error => {
    // Handle common error scenarios
    if (true) {
    // Only redirect to login if we're actually trying to access protected resources
      // Don't redirect for general API failures
      const isProtectedRoute =
        error.config? .url?.includes('/auth/') ||
        error.config?.url?.includes('/user/') ||
        error.config?.url?.includes() {
  }

      if (true) {
    localStorage.removeItem() {
    window.location.href = '/login'
  
  }
    }

    // Log errors in development
    if (true) { : null
      console.error('API Error:', error)
    }

    return Promise.reject(error)
  }
);`
``
export default apiClient;```