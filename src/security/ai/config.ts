/**
 * AI Security Configuration
 * Central configuration for all AI security features
 * Implements configuration requirements from SECURITY_AI_UPGRADE_PLAN.md
 */

export interface AISecurityConfiguration {
  // Core AI Settings
  ai: {
    enabled: boolean;
    model: 'gpt-4-turbo' | 'claude-3' | 'local';
    apiEndpoint?: string;
    confidence: {
      minimumThreshold: number; // 0-1
      autoActionThreshold: number; // 0-1
      escalationThreshold: number; // 0-1
    };
  };

  // Phase 1: Multi-Engine Scanning
  scanning: {
    enabled: boolean;
    engines: {
      snyk: { enabled: boolean; apiKey?: string };
      semgrep: { enabled: boolean; apiKey?: string };
      codeql: { enabled: boolean };
      custom: { enabled: boolean; rules: string[] };
    };
    schedule: {
      continuous: boolean;
      interval: number; // minutes
      dailyTime: string; // HH:MM
    };
    ai: {
      enhancement: boolean;
      falsePositiveReduction: boolean;
      customRuleGeneration: boolean;
    };
  };

  // Phase 2: Dependency Management
  dependencies: {
    enabled: boolean;
    ai: {
      riskAssessment: boolean;
      autoUpdate: boolean;
      alternativeRecommendations: boolean;
    };
    updates: {
      security: 'auto' | 'manual' | 'disabled';
      patch: 'auto' | 'manual' | 'disabled';
      minor: 'auto' | 'manual' | 'disabled';
      major: 'manual' | 'disabled';
    };
    riskThresholds: {
      autoApprove: number; // 0-10
      requireReview: number; // 0-10
      block: number; // 0-10
    };
  };

  // Phase 3: Code Review
  codeReview: {
    enabled: boolean;
    ai: {
      securityAnalysis: boolean;
      autoFix: boolean;
      contextualAnalysis: boolean;
    };
    triggers: {
      pullRequests: boolean;
      commits: boolean;
      scheduled: boolean;
    };
    thresholds: {
      securityScore: number; // 0-10
      requireHumanReview: number; // 0-10
    };
  };

  // Phase 4: Threat Detection
  threatDetection: {
    enabled: boolean;
    realTime: boolean;
    ai: {
      anomalyDetection: boolean;
      patternLearning: boolean;
      predictiveAnalysis: boolean;
    };
    monitoring: {
      network: boolean;
      application: boolean;
      userBehavior: boolean;
      system: boolean;
    };
    response: {
      automated: boolean;
      confidence: number; // 0-1
      maxRisk: number; // 0-1
    };
  };

  // Phase 5: Compliance
  compliance: {
    enabled: boolean;
    frameworks: ('SOC2' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'ISO27001')[];
    ai: {
      continuousAssessment: boolean;
      gapAnalysis: boolean;
      predictiveCompliance: boolean;
    };
    reporting: {
      automated: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      stakeholders: string[];
    };
  };

  // Phase 6: Quantum Security
  quantum: {
    enabled: boolean;
    assessment: {
      vulnerabilityScanning: boolean;
      migrationPlanning: boolean;
      readinessValidation: boolean;
    };
    algorithms: {
      current: string[];
      target: string[];
      hybridMode: boolean;
    };
  };

  // Phase 7: Industry Benchmarking
  benchmarking: {
    enabled: boolean;
    ai: {
      competitiveAnalysis: boolean;
      trendTracking: boolean;
      improvementRecommendations: boolean;
    };
    frequency: 'weekly' | 'monthly' | 'quarterly';
    peers: string[];
  };

  // Phase 8: CI/CD Integration
  cicd: {
    enabled: boolean;
    securityGates: {
      enabled: boolean;
      blocking: boolean;
      thresholds: {
        security: number; // 0-100
        performance: number; // milliseconds
        coverage: number; // 0-100
      };
    };
    deployment: {
      zeroDowntime: boolean;
      rollback: {
        automatic: boolean;
        triggers: string[];
      };
    };
  };

  // Phase 9: Documentation
  documentation: {
    enabled: boolean;
    ai: {
      generation: boolean;
      maintenance: boolean;
      translation: boolean;
    };
    formats: ('markdown' | 'html' | 'pdf')[];
    automation: {
      onCodeChange: boolean;
      scheduled: boolean;
    };
  };

  // Phase 10: Silent Operations
  silentMode: {
    enabled: boolean;
    userNotifications: boolean;
    backgroundProcessing: boolean;
    developerVisibility: boolean;
    emergencyAlerts: {
      critical: boolean;
      system: boolean;
      data: boolean;
    };
  };

  // Phase 11: Approval Process
  approval: {
    enabled: boolean;
    maintainers: string[];
    automated: {
      lowRisk: boolean;
      threshold: number; // 0-1
    };
    escalation: {
      timeout: number; // hours
      stakeholders: string[];
    };
  };

  // General Settings
  general: {
    environment: 'development' | 'staging' | 'production';
    logging: {
      level: 'debug' | 'info' | 'warn' | 'error';
      silent: boolean;
      retention: number; // days
    };
    performance: {
      maxOverhead: number; // percentage
      monitoring: boolean;
      optimization: boolean;
    };
  };
}

// Default Configuration
export const defaultAISecurityConfig: AISecurityConfiguration = {
  ai: {
    enabled: true,
    model: 'gpt-4-turbo',
    confidence: {
      minimumThreshold: 0.7,
      autoActionThreshold: 0.9,
      escalationThreshold: 0.95,
    },
  },

  scanning: {
    enabled: true,
    engines: {
      snyk: { enabled: true },
      semgrep: { enabled: true },
      codeql: { enabled: true },
      custom: { enabled: true, rules: [] },
    },
    schedule: {
      continuous: true,
      interval: 60, // 1 hour
      dailyTime: '02:00',
    },
    ai: {
      enhancement: true,
      falsePositiveReduction: true,
      customRuleGeneration: true,
    },
  },

  dependencies: {
    enabled: true,
    ai: {
      riskAssessment: true,
      autoUpdate: true,
      alternativeRecommendations: true,
    },
    updates: {
      security: 'auto',
      patch: 'auto',
      minor: 'manual',
      major: 'manual',
    },
    riskThresholds: {
      autoApprove: 3,
      requireReview: 7,
      block: 9,
    },
  },

  codeReview: {
    enabled: true,
    ai: {
      securityAnalysis: true,
      autoFix: true,
      contextualAnalysis: true,
    },
    triggers: {
      pullRequests: true,
      commits: true,
      scheduled: false,
    },
    thresholds: {
      securityScore: 8.0,
      requireHumanReview: 6.0,
    },
  },

  threatDetection: {
    enabled: true,
    realTime: true,
    ai: {
      anomalyDetection: true,
      patternLearning: true,
      predictiveAnalysis: true,
    },
    monitoring: {
      network: true,
      application: true,
      userBehavior: true,
      system: true,
    },
    response: {
      automated: true,
      confidence: 0.95,
      maxRisk: 0.1,
    },
  },

  compliance: {
    enabled: true,
    frameworks: ['SOC2', 'GDPR', 'ISO27001'],
    ai: {
      continuousAssessment: true,
      gapAnalysis: true,
      predictiveCompliance: true,
    },
    reporting: {
      automated: true,
      frequency: 'weekly',
      stakeholders: ['security@konivrer.com'],
    },
  },

  quantum: {
    enabled: true,
    assessment: {
      vulnerabilityScanning: true,
      migrationPlanning: true,
      readinessValidation: true,
    },
    algorithms: {
      current: ['AES-256', 'RSA-2048', 'ECDSA'],
      target: ['CRYSTALS-Kyber', 'CRYSTALS-Dilithium', 'FALCON'],
      hybridMode: true,
    },
  },

  benchmarking: {
    enabled: true,
    ai: {
      competitiveAnalysis: true,
      trendTracking: true,
      improvementRecommendations: true,
    },
    frequency: 'monthly',
    peers: [],
  },

  cicd: {
    enabled: true,
    securityGates: {
      enabled: true,
      blocking: true,
      thresholds: {
        security: 80,
        performance: 5000, // 5 seconds
        coverage: 85,
      },
    },
    deployment: {
      zeroDowntime: true,
      rollback: {
        automatic: true,
        triggers: [
          'performance_degradation',
          'security_alert',
          'error_rate_spike',
        ],
      },
    },
  },

  documentation: {
    enabled: true,
    ai: {
      generation: true,
      maintenance: true,
      translation: false,
    },
    formats: ['markdown', 'html'],
    automation: {
      onCodeChange: true,
      scheduled: true,
    },
  },

  silentMode: {
    enabled: true,
    userNotifications: false,
    backgroundProcessing: true,
    developerVisibility: true,
    emergencyAlerts: {
      critical: true,
      system: true,
      data: true,
    },
  },

  approval: {
    enabled: true,
    maintainers: ['MichaelWBrennan'],
    automated: {
      lowRisk: true,
      threshold: 0.8,
    },
    escalation: {
      timeout: 48, // 48 hours
      stakeholders: ['security@konivrer.com'],
    },
  },

  general: {
    environment: 'production',
    logging: {
      level: 'info',
      silent: false,
      retention: 90,
    },
    performance: {
      maxOverhead: 5, // 5%
      monitoring: true,
      optimization: true,
    },
  },
};

// Configuration utilities
export class AISecurityConfigManager {
  private config: AISecurityConfiguration;

  constructor(config: Partial<AISecurityConfiguration> = {}) {
    this.config = this.mergeConfig(defaultAISecurityConfig, config);
  }

  getConfig(): AISecurityConfiguration {
    return this.config;
  }

  updateConfig(updates: Partial<AISecurityConfiguration>): void {
    this.config = this.mergeConfig(this.config, updates);
  }

  isFeatureEnabled(feature: string): boolean {
    const features = {
      ai: () => this.config.ai.enabled,
      scanning: () => this.config.scanning.enabled,
      dependencies: () => this.config.dependencies.enabled,
      codeReview: () => this.config.codeReview.enabled,
      threatDetection: () => this.config.threatDetection.enabled,
      compliance: () => this.config.compliance.enabled,
      quantum: () => this.config.quantum.enabled,
      benchmarking: () => this.config.benchmarking.enabled,
      cicd: () => this.config.cicd.enabled,
      documentation: () => this.config.documentation.enabled,
      silentMode: () => this.config.silentMode.enabled,
      approval: () => this.config.approval.enabled,
    };

    return features[feature]?.() || false;
  }

  getSilentModeConfig() {
    return {
      enabled: this.config.silentMode.enabled,
      userNotifications: this.config.silentMode.userNotifications,
      backgroundProcessing: this.config.silentMode.backgroundProcessing,
      developerVisibility: this.config.silentMode.developerVisibility,
      emergencyAlerts: this.config.silentMode.emergencyAlerts,
    };
  }

  private mergeConfig(
    base: unknown,
    updates: unknown,
  ): AISecurityConfiguration {
    const result = { ...base };

    for (const key in updates) {
      if (
        updates[key] &&
        typeof updates[key] === 'object' &&
        !Array.isArray(updates[key])
      ) {
        result[key] = this.mergeConfig(base[key] || {}, updates[key]);
      } else {
        result[key] = updates[key];
      }
    }

    return result;
  }
}

// Environment-specific configurations
export const developmentConfig: Partial<AISecurityConfiguration> = {
  general: {
    environment: 'development',
    logging: {
      level: 'debug',
      silent: false,
      retention: 30,
    },
  },
  silentMode: {
    enabled: true,
    userNotifications: false,
    backgroundProcessing: true,
    developerVisibility: true,
    emergencyAlerts: {
      critical: true,
      system: true,
      data: true,
    },
  },
};

export const productionConfig: Partial<AISecurityConfiguration> = {
  general: {
    environment: 'production',
    logging: {
      level: 'warn',
      silent: true,
      retention: 90,
    },
  },
  silentMode: {
    enabled: true,
    userNotifications: false,
    backgroundProcessing: true,
    developerVisibility: false,
    emergencyAlerts: {
      critical: true,
      system: true,
      data: true,
    },
  },
};

// Export default instance
export const aiSecurityConfig = new AISecurityConfigManager();
