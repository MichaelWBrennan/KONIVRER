/**
 * Advanced Self-Healing Configuration
 * 
 * Centralized configuration for all healing systems
 * Allows fine-tuning of healing behavior and strategies
 */

import React from 'react';

export interface HealingConfiguration {
  // Global settings
  enabled: boolean;
  silentMode: boolean;
  realTimeHealing: boolean;
  predictiveHealing: boolean;
  aggressiveHealing: boolean;
  
  // Error handling
  errorThresholds: {
    memory: number; // MB
    networkLatency: number; // ms
    errorRate: number; // errors per minute
    renderTime: number; // ms
  };
  
  // Healing strategies
  strategies: {
    memoryLeak: {
      enabled: boolean;
      threshold: number;
      cleanupInterval: number;
      aggressiveCleanup: boolean;
    };
    networkFailure: {
      enabled: boolean;
      maxRetries: number;
      retryDelay: number;
      adaptiveTimeout: boolean;
      offlineMode: boolean;
    };
    reactErrors: {
      enabled: boolean;
      stateBackup: boolean;
      propValidation: boolean;
      componentRecovery: boolean;
    };
    performanceDegradation: {
      enabled: boolean;
      animationReduction: boolean;
      lazyLoading: boolean;
      resourceOptimization: boolean;
    };
  };
  
  // Predictive analytics
  prediction: {
    enabled: boolean;
    confidenceThreshold: number;
    learningRate: number;
    patternAnalysis: boolean;
    preventiveMeasures: boolean;
  };
  
  // Monitoring
  monitoring: {
    performanceTracking: boolean;
    errorTracking: boolean;
    healthChecks: boolean;
    metricsCollection: boolean;
    reportingInterval: number; // ms
  };
  
  // Service Worker
  serviceWorker: {
    enabled: boolean;
    cachingStrategy: 'aggressive' | 'balanced' | 'minimal';
    offlineSupport: boolean;
    backgroundHealing: boolean;
  };
  
  // Development settings
  development: {
    debugMode: boolean;
    verboseLogging: boolean;
    healthMonitorVisible: boolean;
    healingIndicators: boolean;
  };
}

// Production configuration - optimized for performance and silence
export const PRODUCTION_CONFIG: HealingConfiguration = {
  enabled: true,
  silentMode: true,
  realTimeHealing: true,
  predictiveHealing: true,
  aggressiveHealing: true,
  
  errorThresholds: {
    memory: 200, // 200MB
    networkLatency: 2000, // 2 seconds
    errorRate: 5, // 5 errors per minute
    renderTime: 50 // 50ms
  },
  
  strategies: {
    memoryLeak: {
      enabled: true,
      threshold: 150, // 150MB
      cleanupInterval: 30000, // 30 seconds
      aggressiveCleanup: true
    },
    networkFailure: {
      enabled: true,
      maxRetries: 5,
      retryDelay: 1000, // 1 second base delay
      adaptiveTimeout: true,
      offlineMode: true
    },
    reactErrors: {
      enabled: true,
      stateBackup: true,
      propValidation: true,
      componentRecovery: true
    },
    performanceDegradation: {
      enabled: true,
      animationReduction: true,
      lazyLoading: true,
      resourceOptimization: true
    }
  },
  
  prediction: {
    enabled: true,
    confidenceThreshold: 0.7,
    learningRate: 0.1,
    patternAnalysis: true,
    preventiveMeasures: true
  },
  
  monitoring: {
    performanceTracking: true,
    errorTracking: true,
    healthChecks: true,
    metricsCollection: true,
    reportingInterval: 60000 // 1 minute
  },
  
  serviceWorker: {
    enabled: true,
    cachingStrategy: 'aggressive',
    offlineSupport: true,
    backgroundHealing: true
  },
  
  development: {
    debugMode: false,
    verboseLogging: false,
    healthMonitorVisible: false,
    healingIndicators: false
  }
};

// Development configuration - more visible and verbose
export const DEVELOPMENT_CONFIG: HealingConfiguration = {
  ...PRODUCTION_CONFIG,
  silentMode: false,
  
  errorThresholds: {
    memory: 100, // Lower threshold for testing
    networkLatency: 1000,
    errorRate: 3,
    renderTime: 30
  },
  
  strategies: {
    ...PRODUCTION_CONFIG.strategies,
    memoryLeak: {
      ...PRODUCTION_CONFIG.strategies.memoryLeak,
      threshold: 100,
      cleanupInterval: 15000 // More frequent in dev
    }
  },
  
  prediction: {
    ...PRODUCTION_CONFIG.prediction,
    confidenceThreshold: 0.5 // Lower threshold for testing
  },
  
  monitoring: {
    ...PRODUCTION_CONFIG.monitoring,
    reportingInterval: 30000 // More frequent reporting
  },
  
  development: {
    debugMode: true,
    verboseLogging: true,
    healthMonitorVisible: true,
    healingIndicators: true
  }
};

// Get configuration based on environment
export function getHealingConfig(): HealingConfiguration {
  const env = typeof process !== 'undefined' && process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return DEVELOPMENT_CONFIG;
    case 'production':
    default:
      return PRODUCTION_CONFIG;
  }
}

// Dynamic configuration updates
export class HealingConfigManager {
  private config: HealingConfiguration;
  private listeners: ((config: HealingConfiguration) => void)[] = [];
  
  constructor(initialConfig?: HealingConfiguration) {
    this.config = initialConfig || getHealingConfig();
  }
  
  getConfig(): HealingConfiguration {
    return { ...this.config };
  }
  
  updateConfig(updates: Partial<HealingConfiguration>): void {
    this.config = { ...this.config, ...updates };
    this.notifyListeners();
  }
  
  enableSilentMode(): void {
    this.updateConfig({ silentMode: true });
  }
  
  enableDebugMode(): void {
    this.updateConfig({
      development: {
        ...this.config.development,
        debugMode: true,
        verboseLogging: true,
        healthMonitorVisible: true
      }
    });
  }
  
  subscribe(listener: (config: HealingConfiguration) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }
}

// Global configuration manager instance
export const healingConfigManager = new HealingConfigManager();

// React hook for using healing configuration
export function useHealingConfig() {
  const [config, setConfig] = React.useState(healingConfigManager.getConfig());
  
  React.useEffect(() => {
    const unsubscribe = healingConfigManager.subscribe(setConfig);
    return unsubscribe;
  }, []);
  
  return {
    config,
    updateConfig: healingConfigManager.updateConfig.bind(healingConfigManager),
    enableSilentMode: healingConfigManager.enableSilentMode.bind(healingConfigManager),
    enableDebugMode: healingConfigManager.enableDebugMode.bind(healingConfigManager)
  };
}

export default {
  getHealingConfig,
  HealingConfigManager,
  healingConfigManager,
  useHealingConfig,
  PRODUCTION_CONFIG,
  DEVELOPMENT_CONFIG
};