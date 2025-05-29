/**
 * Legacy API file - use src/config/api.js for new implementations
 * This file is kept for backward compatibility
 */
import { apiClient } from './config/api.js';

// Re-export the configured API client
export default apiClient;

// Legacy export for backward compatibility
export const api = apiClient;
