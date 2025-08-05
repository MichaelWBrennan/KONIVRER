/**
 * AI Security Service Integration
 * Main service orchestrator for all AI security features
 */

import { AISecurityAnalyzer } from './SecurityAnalyzer.js';
import { AIThreatDetector } from './ThreatDetector.js';
import { SilentSecurityOperations } from './SilentOperations.js';
import { aiSecurityConfig } from './config.js';
import {
  SecurityThreat,
  SecurityMetrics,
  AIInsight,
  SecurityScanResult,
  VulnerabilityAssessment,
} from './types.js';

export class AISecurityService {
  private analyzer: AISecurityAnalyzer;
  private threatDetector: AIThreatDetector;
  private silentOps: SilentSecurityOperations;
  private isInitialized: boolean = false;

  constructor() {
    const config = aiSecurityConfig.getConfig();

    this.analyzer = new AISecurityAnalyzer(config.ai);
    this.threatDetector = new AIThreatDetector(config.silentMode);
    this.silentOps = new SilentSecurityOperations();
  }

  /**
   * Initialize AI Security Service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Start silent operations first
      await this.silentOps.start();

      // Initialize threat detection if enabled
      if (aiSecurityConfig.isFeatureEnabled('threatDetection')) {
        // Start real-time monitoring in background
        this.threatDetector.monitorRealTime().catch(error => {
          console.error('Threat detection error:', error);
        });
      }

      this.isInitialized = true;

      if (aiSecurityConfig.getSilentModeConfig().developerVisibility) {
        console.log('🤖 AI Security Service initialized');
      }
    } catch (error) {
      console.error('Failed to initialize AI Security Service:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive security scan
   */
  async performSecurityScan(
    codebase?: string[],
  ): Promise<SecurityScanResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const targetCodebase = codebase || (await this.getCodebaseFiles());
    return this.analyzer.performMultiEngineScan(targetCodebase);
  }

  /**
   * Assess dependency risk
   */
  async assessDependencyRisk(
    packageName: string,
    version: string,
  ): Promise<VulnerabilityAssessment> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.analyzer.assessDependencyRisk(packageName, version);
  }

  /**
   * Get current security metrics
   */
  getSecurityMetrics(): SecurityMetrics {
    return (
      this.silentOps.getSecurityContext().metrics || {
        threatsDetected: 0,
        threatsResolved: 0,
        meanTimeToDetection: 0,
        meanTimeToResolution: 0,
        falsePositiveRate: 0,
        securityScore: 85,
        complianceScore: 90,
        lastUpdated: new Date(),
      }
    );
  }

  /**
   * Get AI-generated security insights
   */
  getAIInsights(): AIInsight[] {
    return this.silentOps.getSecurityContext().insights || [];
  }

  /**
   * Check if operating in silent mode
   */
  isSilentModeActive(): boolean {
    return aiSecurityConfig.getSilentModeConfig().enabled;
  }

  /**
   * Get security service status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      silentMode: this.isSilentModeActive(),
      features: {
        scanning: aiSecurityConfig.isFeatureEnabled('scanning'),
        dependencies: aiSecurityConfig.isFeatureEnabled('dependencies'),
        threatDetection: aiSecurityConfig.isFeatureEnabled('threatDetection'),
        compliance: aiSecurityConfig.isFeatureEnabled('compliance'),
        quantum: aiSecurityConfig.isFeatureEnabled('quantum'),
      },
      lastHealthCheck: new Date(),
    };
  }

  /**
   * Emergency shutdown
   */
  async emergencyShutdown(reason: string): Promise<void> {
    console.error(`🚨 AI Security Service emergency shutdown: ${reason}`);
    // Implement emergency shutdown procedures
    this.isInitialized = false;
  }

  // Private helper methods
  private async getCodebaseFiles(): Promise<string[]> {
    // Simulate getting codebase files
    return ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'];
  }
}

// Export singleton instance
export const aiSecurityService = new AISecurityService();

// Auto-initialize in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  aiSecurityService.initialize().catch(error => {
    console.error('Failed to auto-initialize AI Security Service:', error);
  });
}
