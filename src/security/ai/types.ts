/**
 * Core AI Security Types and Interfaces
 * Foundation for AI-powered security features as per SECURITY_AI_UPGRADE_PLAN.md
 */

export interface SecurityThreat {
  id: string;
  type: 'vulnerability' | 'malware' | 'injection' | 'crypto_weakness' | 'access_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  description: string;
  source: string;
  timestamp: Date;
  mitigation?: string;
  autoFixable: boolean;
}

export interface VulnerabilityAssessment {
  packageName: string;
  version: string;
  vulnerabilities: SecurityThreat[];
  riskScore: number; // 0-10
  recommendation: 'approve' | 'review' | 'block';
  alternatives?: string[];
}

export interface AISecurityConfig {
  silentMode: boolean;
  aiModel: 'gpt-4-turbo' | 'claude-3' | 'local';
  scanThreshold: number; // 0-1
  autoRemediationEnabled: boolean;
  quantumReadyMode: boolean;
  developerMode: boolean;
}

export interface SecurityScanResult {
  engine: 'snyk' | 'semgrep' | 'codeql' | 'custom';
  findings: SecurityThreat[];
  scanDuration: number;
  coverage: number; // 0-1
  aiEnhanced: boolean;
}

export interface ComplianceFramework {
  name: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'ISO27001';
  requirements: string[];
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  lastAssessed: Date;
  nextReview: Date;
}

export interface QuantumSecurityAssessment {
  currentAlgorithms: string[];
  quantumVulnerable: boolean;
  migrationRequired: boolean;
  timeToQuantumThreat: number; // years
  recommendedAlgorithms: string[];
}

export interface SilentOperationConfig {
  userNotifications: boolean;
  backgroundScanning: boolean;
  automaticRemediation: boolean;
  silentUpdates: boolean;
  transparentLogging: boolean;
  emergencyAlerts: {
    criticalThreats: boolean;
    systemCompromise: boolean;
    dataBreaches: boolean;
  };
}

export interface AIInsight {
  type: 'prediction' | 'recommendation' | 'analysis' | 'alert';
  content: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: Date;
}

export interface SecurityMetrics {
  threatsDetected: number;
  threatsResolved: number;
  meanTimeToDetection: number; // seconds
  meanTimeToResolution: number; // seconds
  falsePositiveRate: number; // 0-1
  securityScore: number; // 0-100
  complianceScore: number; // 0-100
  lastUpdated: Date;
}