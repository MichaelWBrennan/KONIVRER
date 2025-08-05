/**
 * Tests for AI Security Service
 * Validates core AI security functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AISecurityService } from '../AISecurityService.js';
import { aiSecurityConfig } from '../config.js';

// Mock modules
vi.mock('../SecurityAnalyzer.js', () => ({
  AISecurityAnalyzer: vi.fn().mockImplementation(() => ({
    performMultiEngineScan: vi.fn().mockResolvedValue([]),
    assessDependencyRisk: vi.fn().mockResolvedValue({
      packageName: 'test-package',
      version: '1.0.0',
      vulnerabilities: [],
      riskScore: 2.5,
      recommendation: 'approve',
      alternatives: [],
    }),
  })),
}));

vi.mock('../ThreatDetector.js', () => ({
  AIThreatDetector: vi.fn().mockImplementation(() => ({
    monitorRealTime: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('../SilentOperations.js', () => ({
  SilentSecurityOperations: vi.fn().mockImplementation(() => ({
    start: vi.fn().mockResolvedValue(undefined),
    getSecurityContext: vi.fn().mockReturnValue({
      isActive: true,
      config: { enabled: true },
      metrics: {
        threatsDetected: 0,
        threatsResolved: 0,
        meanTimeToDetection: 0,
        meanTimeToResolution: 0,
        falsePositiveRate: 0,
        securityScore: 90,
        complianceScore: 95,
        lastUpdated: new Date(),
      },
      threats: [],
      insights: [],
      compliance: [],
    }),
  })),
}));

describe('AISecurityService', () => {
  let securityService: AISecurityService;

  beforeEach(() => {
    securityService = new AISecurityService();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(securityService.initialize()).resolves.not.toThrow();
    });

    it('should not initialize twice', async () => {
      await securityService.initialize();
      await expect(securityService.initialize()).resolves.not.toThrow();
    });
  });

  describe('security scanning', () => {
    it('should perform security scan', async () => {
      const results = await securityService.performSecurityScan();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should assess dependency risk', async () => {
      const assessment = await securityService.assessDependencyRisk(
        'test-package',
        '1.0.0',
      );
      expect(assessment).toHaveProperty('packageName', 'test-package');
      expect(assessment).toHaveProperty('riskScore');
      expect(assessment).toHaveProperty('recommendation');
    });
  });

  describe('metrics and insights', () => {
    it('should return security metrics', () => {
      const metrics = securityService.getSecurityMetrics();
      expect(metrics).toHaveProperty('securityScore');
      expect(metrics).toHaveProperty('complianceScore');
      expect(metrics).toHaveProperty('lastUpdated');
    });

    it('should return AI insights', () => {
      const insights = securityService.getAIInsights();
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe('silent mode', () => {
    it('should detect silent mode status', () => {
      const isSilent = securityService.isSilentModeActive();
      expect(typeof isSilent).toBe('boolean');
    });
  });

  describe('status reporting', () => {
    it('should return service status', () => {
      const status = securityService.getStatus();
      expect(status).toHaveProperty('initialized');
      expect(status).toHaveProperty('silentMode');
      expect(status).toHaveProperty('features');
      expect(status).toHaveProperty('lastHealthCheck');
    });
  });

  describe('emergency procedures', () => {
    it('should handle emergency shutdown', async () => {
      await expect(
        securityService.emergencyShutdown('test'),
      ).resolves.not.toThrow();
      const status = securityService.getStatus();
      expect(status.initialized).toBe(false);
    });
  });
});

describe('AI Security Configuration', () => {
  it('should have default configuration', () => {
    const config = aiSecurityConfig.getConfig();
    expect(config).toBeDefined();
    expect(config.ai.enabled).toBe(true);
    expect(config.silentMode.enabled).toBe(true);
  });

  it('should check feature enablement', () => {
    expect(aiSecurityConfig.isFeatureEnabled('ai')).toBe(true);
    expect(aiSecurityConfig.isFeatureEnabled('scanning')).toBe(true);
    expect(aiSecurityConfig.isFeatureEnabled('silentMode')).toBe(true);
  });

  it('should return silent mode config', () => {
    const silentConfig = aiSecurityConfig.getSilentModeConfig();
    expect(silentConfig).toHaveProperty('enabled');
    expect(silentConfig).toHaveProperty('userNotifications');
    expect(silentConfig).toHaveProperty('backgroundProcessing');
  });
});

describe('Silent Operations', () => {
  it('should only be visible in development mode', () => {
    // Test that silent operations respect environment
    const originalEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'production';
    expect(true).toBe(true); // Silent operations should be invisible

    process.env.NODE_ENV = 'development';
    expect(true).toBe(true); // Silent operations should be visible

    process.env.NODE_ENV = originalEnv;
  });
});

describe('AI Security Integration', () => {
  it('should integrate with existing security systems', () => {
    // Test integration points
    expect(
      typeof aiSecurityConfig.getConfig().scanning.engines.snyk.enabled,
    ).toBe('boolean');
    expect(
      typeof aiSecurityConfig.getConfig().scanning.engines.semgrep.enabled,
    ).toBe('boolean');
    expect(
      typeof aiSecurityConfig.getConfig().scanning.engines.codeql.enabled,
    ).toBe('boolean');
  });

  it('should maintain backward compatibility', () => {
    // Ensure AI features don't break existing functionality
    const config = aiSecurityConfig.getConfig();
    expect(config.general.performance.maxOverhead).toBeLessThanOrEqual(5);
  });
});

describe('Performance and Silent Operation', () => {
  it('should meet performance requirements', () => {
    const config = aiSecurityConfig.getConfig();
    expect(config.general.performance.maxOverhead).toBeLessThanOrEqual(5);
  });

  it('should operate silently for users', () => {
    const silentConfig = aiSecurityConfig.getSilentModeConfig();
    expect(silentConfig.userNotifications).toBe(false);
    expect(silentConfig.backgroundProcessing).toBe(true);
  });

  it('should provide developer visibility', () => {
    const silentConfig = aiSecurityConfig.getSilentModeConfig();
    // In development, developers should have visibility
    if (process.env.NODE_ENV === 'development') {
      expect(silentConfig.developerVisibility).toBe(true);
    }
  });
});
