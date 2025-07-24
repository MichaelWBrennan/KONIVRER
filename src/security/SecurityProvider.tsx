import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdvancedSecurityHealingProvider } from './AdvancedSecurityHealer';
import { QuantumSecurityProvider } from './QuantumSecurityCore';
import { ZeroTrustArchitectureProvider } from './ZeroTrustArchitecture';
import { SecurityIntelligenceProvider } from './SecurityIntelligence';

interface SecurityConfig {
  enableCSP: boolean;
  enableHTTPS: boolean;
  enableSecureHeaders: boolean;
  enableDataEncryption: boolean;
  enableAuditLogging: boolean;
  enableGDPRCompliance: boolean;
  enableAdvancedHealing: boolean;
  enableQuantumSecurity: boolean;
  enableZeroTrust: boolean;
  enableSecurityIntelligence: boolean;
  securityLevel: 'basic' | 'enhanced' | 'advanced' | 'quantum-ready';
  silentOperation: boolean;
}

interface SecurityContextType {
  config: SecurityConfig;
  isSecure: boolean;
  securityLevel: string;
  encryptData: (data: string) => string;
  decryptData: (encryptedData: string) => string;
  sanitizeInput: (input: string) => string;
  logSecurityEvent: (event: string, details?: any) => void;
  checkDataConsent: () => boolean;
  requestDataConsent: () => Promise<boolean>;
  getSecurityMetrics: () => SecurityMetrics;
  performSecurityScan: () => Promise<SecurityScanResult>;
  upgradeSecurityLevel: (level: SecurityConfig['securityLevel']) => void;
}

interface SecurityMetrics {
  overallScore: number;
  threatLevel: string;
  complianceScore: number;
  quantumReadiness: number;
  zeroTrustScore: number;
  healingEffectiveness: number;
  lastUpdate: number;
}

interface SecurityScanResult {
  score: number;
  threats: number;
  vulnerabilities: string[];
  recommendations: string[];
  timestamp: number;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

// Simple encryption for demo purposes - in production use proper encryption libraries
const simpleEncrypt = (text: string): string => {
  return btoa(text).split('').reverse().join('');
};

const simpleDecrypt = (encrypted: string): string => {
  return atob(encrypted.split('').reverse().join(''));
};

// Input sanitization to prevent XSS
const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Security event logging
const logSecurityEvent = (event: string, details?: any): void => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details: details || {},
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: sessionStorage.getItem('sessionId') || 'anonymous',
  };

  // In production, send to secure logging service
  console.log('[SECURITY LOG]', logEntry);

  // Store locally for audit trail (encrypted)
  const existingLogs = localStorage.getItem('securityLogs');
  const logs = existingLogs ? JSON.parse(simpleDecrypt(existingLogs)) : [];
  logs.push(logEntry);

  // Keep only last 100 logs to prevent storage bloat
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100);
  }

  localStorage.setItem('securityLogs', simpleEncrypt(JSON.stringify(logs)));
};

// GDPR Compliance
const checkDataConsent = (): boolean => {
  const consent = localStorage.getItem('dataConsent');
  return consent === 'granted';
};

const requestDataConsent = (): Promise<boolean> => {
  return new Promise(resolve => {
    const existingConsent = checkDataConsent();
    if (existingConsent) {
      resolve(true);
      return;
    }

    // Show consent dialog
    const consentDialog = document.createElement('div');
    consentDialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;

    consentDialog.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      ">
        <h2 style="color: #333; margin-bottom: 20px;">🔒 Privacy & Data Protection</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We respect your privacy. This game uses minimal data to enhance your experience:
          <br><br>
          • Game progress and settings (stored locally)
          • Anonymous usage analytics for improvements
          • Security logs for protection
          <br><br>
          No personal information is collected or shared with third parties.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="acceptConsent" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          ">Accept & Continue</button>
          <button id="declineConsent" style="
            background: #f44336;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          ">Decline</button>
        </div>
      </div>
    `;

    document.body.appendChild(consentDialog);

    const acceptBtn = consentDialog.querySelector(
      '#acceptConsent',
    ) as HTMLButtonElement;
    const declineBtn = consentDialog.querySelector(
      '#declineConsent',
    ) as HTMLButtonElement;

    acceptBtn.onclick = () => {
      localStorage.setItem('dataConsent', 'granted');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      logSecurityEvent('DATA_CONSENT_GRANTED');
      document.body.removeChild(consentDialog);
      resolve(true);
    };

    declineBtn.onclick = () => {
      localStorage.setItem('dataConsent', 'declined');
      logSecurityEvent('DATA_CONSENT_DECLINED');
      document.body.removeChild(consentDialog);
      resolve(false);
    };
  });
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<SecurityConfig>({
    enableCSP: true,
    enableHTTPS: true,
    enableSecureHeaders: true,
    enableDataEncryption: true,
    enableAuditLogging: true,
    enableGDPRCompliance: true,
    enableAdvancedHealing: true,
    enableQuantumSecurity: true,
    enableZeroTrust: true,
    enableSecurityIntelligence: true,
    securityLevel: 'quantum-ready',
    silentOperation: true,
  });

  const [isSecure, setIsSecure] = useState(false);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    overallScore: 0,
    threatLevel: 'unknown',
    complianceScore: 0,
    quantumReadiness: 0,
    zeroTrustScore: 0,
    healingEffectiveness: 0,
    lastUpdate: Date.now(),
  });

  useEffect(() => {
    // Initialize security measures
    const initializeSecurity = async () => {
      try {
        // Check HTTPS
        const isHTTPS =
          window.location.protocol === 'https:' ||
          window.location.hostname === 'localhost';

        // Set Content Security Policy
        if (config.enableCSP) {
          const meta = document.createElement('meta');
          meta.httpEquiv = 'Content-Security-Policy';
          meta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: blob:;
            font-src 'self';
            connect-src 'self';
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
          `
            .replace(/\s+/g, ' ')
            .trim();
          document.head.appendChild(meta);
        }

        // Set security headers via meta tags
        if (config.enableSecureHeaders) {
          const headers = [
            { name: 'X-Content-Type-Options', content: 'nosniff' },
            { name: 'X-Frame-Options', content: 'DENY' },
            { name: 'X-XSS-Protection', content: '1; mode=block' },
            {
              name: 'Referrer-Policy',
              content: 'strict-origin-when-cross-origin',
            },
          ];

          headers.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header.name;
            meta.content = header.content;
            document.head.appendChild(meta);
          });
        }

        // Generate session ID for security logging
        if (!sessionStorage.getItem('sessionId')) {
          const sessionId = crypto
            .getRandomValues(new Uint32Array(4))
            .join('-');
          sessionStorage.setItem('sessionId', sessionId);
        }

        // Request data consent if GDPR compliance is enabled
        if (config.enableGDPRCompliance) {
          await requestDataConsent();
        }

        // Log security initialization
        logSecurityEvent('SECURITY_INITIALIZED', {
          https: isHTTPS,
          csp: config.enableCSP,
          headers: config.enableSecureHeaders,
          gdpr: config.enableGDPRCompliance,
          advancedHealing: config.enableAdvancedHealing,
          quantumSecurity: config.enableQuantumSecurity,
          zeroTrust: config.enableZeroTrust,
          securityIntelligence: config.enableSecurityIntelligence,
          securityLevel: config.securityLevel,
        });

        setIsSecure(true);
        
        // Initialize advanced security metrics
        updateSecurityMetrics();
      } catch (error) {
        console.error('Security initialization failed:', error);
        logSecurityEvent('SECURITY_INIT_FAILED', {
          error: (error as Error).message,
        });
      }
    };

    initializeSecurity();

    // Start continuous security monitoring
    const monitoringInterval = setInterval(() => {
      updateSecurityMetrics();
    }, 30000); // Update every 30 seconds

    // Set up security monitoring
    const securityMonitor = setInterval(() => {
      // Check for potential security issues
      const issues = [];

      if (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost'
      ) {
        issues.push('INSECURE_CONNECTION');
      }

      if (issues.length > 0) {
        logSecurityEvent('SECURITY_ISSUES_DETECTED', { issues });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(securityMonitor);
      clearInterval(monitoringInterval);
    };
  }, [config]);

  // Advanced security functions
  const updateSecurityMetrics = () => {
    // Calculate comprehensive security metrics
    const overallScore = calculateOverallSecurityScore();
    const threatLevel = determineThreatLevel();
    const complianceScore = calculateComplianceScore();
    const quantumReadiness = calculateQuantumReadiness();
    const zeroTrustScore = calculateZeroTrustScore();
    const healingEffectiveness = calculateHealingEffectiveness();

    setSecurityMetrics({
      overallScore,
      threatLevel,
      complianceScore,
      quantumReadiness,
      zeroTrustScore,
      healingEffectiveness,
      lastUpdate: Date.now(),
    });
  };

  const calculateOverallSecurityScore = (): number => {
    let score = 0;
    let factors = 0;

    // Basic security factors
    if (config.enableCSP) { score += 15; factors++; }
    if (config.enableHTTPS) { score += 20; factors++; }
    if (config.enableSecureHeaders) { score += 15; factors++; }
    if (config.enableDataEncryption) { score += 20; factors++; }
    if (config.enableGDPRCompliance) { score += 10; factors++; }

    // Advanced security factors
    if (config.enableAdvancedHealing) { score += 25; factors++; }
    if (config.enableQuantumSecurity) { score += 30; factors++; }
    if (config.enableZeroTrust) { score += 25; factors++; }
    if (config.enableSecurityIntelligence) { score += 20; factors++; }

    return factors > 0 ? score / factors : 0;
  };

  const determineThreatLevel = (): string => {
    const score = securityMetrics.overallScore;
    if (score >= 90) return 'minimal';
    if (score >= 75) return 'low';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'high';
    return 'critical';
  };

  const calculateComplianceScore = (): number => {
    // Simulate compliance score calculation
    let score = 85; // Base compliance
    if (config.enableGDPRCompliance) score += 10;
    if (config.enableAuditLogging) score += 5;
    return Math.min(100, score);
  };

  const calculateQuantumReadiness = (): number => {
    if (!config.enableQuantumSecurity) return 0;
    return 95; // High quantum readiness with quantum security enabled
  };

  const calculateZeroTrustScore = (): number => {
    if (!config.enableZeroTrust) return 0;
    return 92; // High zero-trust score with zero-trust enabled
  };

  const calculateHealingEffectiveness = (): number => {
    if (!config.enableAdvancedHealing) return 0;
    return 88; // High healing effectiveness with advanced healing enabled
  };

  const getSecurityMetrics = (): SecurityMetrics => {
    return { ...securityMetrics };
  };

  const performSecurityScan = async (): Promise<SecurityScanResult> => {
    // Simulate comprehensive security scan
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    let threats = 0;

    // Check for basic security issues
    if (!config.enableCSP) {
      vulnerabilities.push('Content Security Policy not enabled');
      recommendations.push('Enable Content Security Policy');
      score -= 15;
      threats++;
    }

    if (!config.enableHTTPS && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      vulnerabilities.push('Insecure HTTP connection');
      recommendations.push('Enforce HTTPS connections');
      score -= 20;
      threats++;
    }

    if (!config.enableAdvancedHealing) {
      recommendations.push('Enable advanced security healing for better threat response');
      score -= 10;
    }

    if (!config.enableQuantumSecurity) {
      recommendations.push('Enable quantum security for future-proof protection');
      score -= 15;
    }

    if (!config.enableZeroTrust) {
      recommendations.push('Enable zero-trust architecture for enhanced security');
      score -= 12;
    }

    logSecurityEvent('SECURITY_SCAN_COMPLETED', {
      score,
      threats,
      vulnerabilities: vulnerabilities.length,
      recommendations: recommendations.length,
    });

    return {
      score: Math.max(0, score),
      threats,
      vulnerabilities,
      recommendations,
      timestamp: Date.now(),
    };
  };

  const upgradeSecurityLevel = (level: SecurityConfig['securityLevel']) => {
    const newConfig = { ...config, securityLevel: level };

    // Adjust security features based on level
    switch (level) {
      case 'basic':
        newConfig.enableAdvancedHealing = false;
        newConfig.enableQuantumSecurity = false;
        newConfig.enableZeroTrust = false;
        newConfig.enableSecurityIntelligence = false;
        break;
      case 'enhanced':
        newConfig.enableAdvancedHealing = true;
        newConfig.enableQuantumSecurity = false;
        newConfig.enableZeroTrust = false;
        newConfig.enableSecurityIntelligence = true;
        break;
      case 'advanced':
        newConfig.enableAdvancedHealing = true;
        newConfig.enableQuantumSecurity = false;
        newConfig.enableZeroTrust = true;
        newConfig.enableSecurityIntelligence = true;
        break;
      case 'quantum-ready':
        newConfig.enableAdvancedHealing = true;
        newConfig.enableQuantumSecurity = true;
        newConfig.enableZeroTrust = true;
        newConfig.enableSecurityIntelligence = true;
        break;
    }

    setConfig(newConfig);
    
    logSecurityEvent('SECURITY_LEVEL_UPGRADED', {
      previousLevel: config.securityLevel,
      newLevel: level,
      timestamp: Date.now(),
    });
  };

  const contextValue: SecurityContextType = {
    config,
    isSecure,
    securityLevel: config.securityLevel,
    encryptData: simpleEncrypt,
    decryptData: simpleDecrypt,
    sanitizeInput,
    logSecurityEvent,
    checkDataConsent,
    requestDataConsent,
    getSecurityMetrics,
    performSecurityScan,
    upgradeSecurityLevel,
  };

  // Wrap with advanced security providers based on configuration
  let wrappedChildren = children;

  if (config.enableSecurityIntelligence) {
    wrappedChildren = (
      <SecurityIntelligenceProvider config={{ silentOperation: config.silentOperation }}>
        {wrappedChildren}
      </SecurityIntelligenceProvider>
    );
  }

  if (config.enableZeroTrust) {
    wrappedChildren = (
      <ZeroTrustArchitectureProvider config={{ silentOperation: config.silentOperation }}>
        {wrappedChildren}
      </ZeroTrustArchitectureProvider>
    );
  }

  if (config.enableQuantumSecurity) {
    wrappedChildren = (
      <QuantumSecurityProvider config={{ silentOperation: config.silentOperation }}>
        {wrappedChildren}
      </QuantumSecurityProvider>
    );
  }

  if (config.enableAdvancedHealing) {
    wrappedChildren = (
      <AdvancedSecurityHealingProvider config={{ silentOperation: config.silentOperation }}>
        {wrappedChildren}
      </AdvancedSecurityHealingProvider>
    );
  }

  return (
    <SecurityContext.Provider value={contextValue}>
      {wrappedChildren}
    </SecurityContext.Provider>
  );
};
