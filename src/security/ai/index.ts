/**
 * AI Security Module Exports
 * Central export point for all AI security features
 */

// Core Types
export * from './types.js';

// Configuration
export * from './config.js';

// Core Services
export { AISecurityAnalyzer } from './SecurityAnalyzer.js';
export { AIThreatDetector } from './ThreatDetector.js';
export { aiSecurityService, AISecurityService } from './AISecurityService.js';

// React Components and Hooks
export { 
  SilentSecurityOperations,
  SilentSecurityProvider,
  SilentSecurityDashboard,
  useSilentSecurity
} from './SilentOperations.js';

// Utility functions
export const getAISecurityVersion = () => '1.0.0';

export const isAISecurityEnabled = () => {
  return typeof window !== 'undefined' && 
         process.env.NODE_ENV !== 'test';
};

export const getAISecurityStatus = () => {
  return aiSecurityService.getStatus();
};