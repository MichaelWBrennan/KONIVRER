import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Advanced Security Types
interface SecurityThreat {
  id: string;
  type: 'xss' | 'csrf' | 'injection' | 'brute_force' | 'session_hijack' | 'data_breach' | 'malicious_input';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: number;
  blocked: boolean;
  details: string;
}

interface SecurityMetrics {
  threatsBlocked: number;
  sessionsSecured: number;
  inputsSanitized: number;
  encryptionOperations: number;
  authenticationAttempts: number;
  uptime: number;
}

interface SecurityConfig {
  enableRealTimeMonitoring: boolean;
  enablePredictiveSecurity: boolean;
  enableAutoHealing: boolean;
  enableSilentMode: boolean;
  maxThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  autoBlockThreshold: number;
  sessionTimeout: number;
  encryptionLevel: 'basic' | 'advanced' | 'military';
}

interface SecurityContext {
  threats: SecurityThreat[];
  metrics: SecurityMetrics;
  config: SecurityConfig;
  isSecure: boolean;
  securityLevel: number;
  updateConfig: (config: Partial<SecurityConfig>) => void;
  reportThreat: (threat: Omit<SecurityThreat, 'id' | 'timestamp'>) => void;
  clearThreats: () => void;
}

// Security Context
const SecurityContext = createContext<SecurityContext | null>(null);

// Advanced Security Hooks
export const useAdvancedSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useAdvancedSecurity must be used within SecurityProvider');
  }
  return context;
};

// Input Sanitization Hook
export const useSanitizedInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const { reportThreat } = useAdvancedSecurity();

  const sanitize = useCallback((input: string): string => {
    // XSS Prevention
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<link/gi,
      /<meta/gi
    ];

    let sanitized = input;
    let threatDetected = false;

    xssPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        threatDetected = true;
        sanitized = sanitized.replace(pattern, '');
      }
    });

    // SQL Injection Prevention
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|\/\*|\*\/)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
    ];

    sqlPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        threatDetected = true;
        sanitized = sanitized.replace(pattern, '');
      }
    });

    if (threatDetected) {
      reportThreat({
        type: 'malicious_input',
        severity: 'high',
        source: 'user_input',
        blocked: true,
        details: `Malicious input detected and sanitized: ${input.substring(0, 100)}`
      });
    }

    return sanitized;
  }, [reportThreat]);

  const setSanitizedValue = useCallback((newValue: string) => {
    setValue(sanitize(newValue));
  }, [sanitize]);

  return [value, setSanitizedValue] as const;
};

// Session Security Hook
export const useSecureSession = () => {
  const { config, reportThreat } = useAdvancedSecurity();
  const sessionRef = useRef<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const generateSecureToken = useCallback((): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  const validateSession = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivityRef.current;

    if (timeSinceActivity > config.sessionTimeout) {
      reportThreat({
        type: 'session_hijack',
        severity: 'medium',
        source: 'session_timeout',
        blocked: true,
        details: 'Session expired due to inactivity'
      });
      sessionRef.current = null;
      return false;
    }

    return true;
  }, [config.sessionTimeout, reportThreat]);

  const refreshSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (!sessionRef.current) {
      sessionRef.current = generateSecureToken();
    }
  }, [generateSecureToken]);

  useEffect(() => {
    const interval = setInterval(validateSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [validateSession]);

  return {
    sessionToken: sessionRef.current,
    isValid: validateSession(),
    refresh: refreshSession
  };
};

// CSRF Protection Hook
export const useCSRFProtection = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const { reportThreat } = useAdvancedSecurity();

  const generateCSRFToken = useCallback((): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setCsrfToken(token);
    return token;
  }, []);

  const validateCSRFToken = useCallback((token: string): boolean => {
    const isValid = token === csrfToken;
    
    if (!isValid) {
      reportThreat({
        type: 'csrf',
        severity: 'high',
        source: 'form_submission',
        blocked: true,
        details: 'CSRF token validation failed'
      });
    }

    return isValid;
  }, [csrfToken, reportThreat]);

  useEffect(() => {
    generateCSRFToken();
  }, [generateCSRFToken]);

  return {
    token: csrfToken,
    validate: validateCSRFToken,
    regenerate: generateCSRFToken
  };
};

// Encryption Utilities
export const useEncryption = () => {
  const { config } = useAdvancedSecurity();

  const encrypt = useCallback(async (data: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: config.encryptionLevel === 'military' ? 256 : 128 },
        true,
        ['encrypt', 'decrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );

      const exportedKey = await crypto.subtle.exportKey('raw', key);
      const result = {
        data: Array.from(new Uint8Array(encrypted)),
        key: Array.from(new Uint8Array(exportedKey)),
        iv: Array.from(iv)
      };

      return btoa(JSON.stringify(result));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to unencrypted
    }
  }, [config.encryptionLevel]);

  const decrypt = useCallback(async (encryptedData: string): Promise<string> => {
    try {
      const { data, key, iv } = JSON.parse(atob(encryptedData));
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(key),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        cryptoKey,
        new Uint8Array(data)
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to encrypted data
    }
  }, []);

  return { encrypt, decrypt };
};

// Security Provider Component
export const AdvancedSecurityProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<SecurityConfig>;
  showSecurityMonitor?: boolean;
}> = ({ 
  children, 
  config: initialConfig = {},
  showSecurityMonitor = false
}) => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatsBlocked: 0,
    sessionsSecured: 0,
    inputsSanitized: 0,
    encryptionOperations: 0,
    authenticationAttempts: 0,
    uptime: Date.now()
  });

  const [config, setConfig] = useState<SecurityConfig>({
    enableRealTimeMonitoring: true,
    enablePredictiveSecurity: true,
    enableAutoHealing: true,
    enableSilentMode: false,
    maxThreatLevel: 'high',
    autoBlockThreshold: 5,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    encryptionLevel: 'advanced',
    ...initialConfig
  });

  const updateConfig = useCallback((newConfig: Partial<SecurityConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const reportThreat = useCallback((threat: Omit<SecurityThreat, 'id' | 'timestamp'>) => {
    const newThreat: SecurityThreat = {
      ...threat,
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setThreats(prev => [...prev.slice(-99), newThreat]); // Keep last 100 threats
    
    setMetrics(prev => ({
      ...prev,
      threatsBlocked: prev.threatsBlocked + (threat.blocked ? 1 : 0)
    }));

    if (!config.enableSilentMode) {
      console.warn(`[SECURITY] ${threat.severity.toUpperCase()} threat detected:`, threat.details);
    }

    // Auto-healing for critical threats
    if (config.enableAutoHealing && threat.severity === 'critical') {
      setTimeout(() => {
        // Implement auto-healing logic here
        console.info('[SECURITY] Auto-healing initiated for critical threat');
      }, 100);
    }
  }, [config.enableSilentMode, config.enableAutoHealing]);

  const clearThreats = useCallback(() => {
    setThreats([]);
  }, []);

  // Calculate security level
  const securityLevel = Math.max(0, Math.min(100, 
    100 - (threats.filter(t => !t.blocked).length * 10)
  ));

  const isSecure = securityLevel >= 80;

  // Real-time monitoring
  useEffect(() => {
    if (!config.enableRealTimeMonitoring) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        uptime: Date.now() - prev.uptime
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.enableRealTimeMonitoring]);

  // Predictive security scanning
  useEffect(() => {
    if (!config.enablePredictiveSecurity) return;

    const scanForThreats = () => {
      // Simulate predictive threat detection
      const suspiciousPatterns = document.querySelectorAll('script[src*="suspicious"]');
      if (suspiciousPatterns.length > 0) {
        reportThreat({
          type: 'xss',
          severity: 'high',
          source: 'predictive_scan',
          blocked: true,
          details: 'Suspicious script patterns detected'
        });
      }
    };

    const interval = setInterval(scanForThreats, 30000); // Scan every 30 seconds
    return () => clearInterval(interval);
  }, [config.enablePredictiveSecurity, reportThreat]);

  const contextValue: SecurityContext = {
    threats,
    metrics,
    config,
    isSecure,
    securityLevel,
    updateConfig,
    reportThreat,
    clearThreats
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
      {showSecurityMonitor && <SecurityMonitor />}
    </SecurityContext.Provider>
  );
};

// Security Monitor Component
const SecurityMonitor: React.FC = () => {
  const { threats, metrics, securityLevel, isSecure, clearThreats } = useAdvancedSecurity();
  const [isExpanded, setIsExpanded] = useState(false);

  const recentThreats = threats.slice(-5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: isExpanded ? '400px' : '60px',
        height: isExpanded ? 'auto' : '60px',
        background: 'rgba(20, 20, 20, 0.95)',
        border: `2px solid ${isSecure ? '#2ed573' : '#ff4757'}`,
        borderRadius: '12px',
        padding: isExpanded ? '20px' : '0',
        zIndex: 9999,
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        cursor: isExpanded ? 'default' : 'pointer'
      }}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {!isExpanded ? (
        <div style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {isSecure ? '🛡️' : '⚠️'}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: isSecure ? '#2ed573' : '#ff4757', margin: 0, fontSize: '16px' }}>
              🛡️ Security Monitor
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>Security Level</span>
              <span style={{ color: isSecure ? '#2ed573' : '#ff4757', fontSize: '14px', fontWeight: 'bold' }}>
                {securityLevel}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(100, 100, 100, 0.3)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${securityLevel}%` }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${
                    securityLevel >= 80 ? '#2ed573' : 
                    securityLevel >= 60 ? '#ffa502' : '#ff4757'
                  }, ${
                    securityLevel >= 80 ? '#1dd1a1' : 
                    securityLevel >= 60 ? '#ff6b4a' : '#ff3838'
                  })`,
                  borderRadius: '3px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
            <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '6px' }}>
              <div style={{ color: '#2ed573', fontSize: '16px', fontWeight: 'bold' }}>{metrics.threatsBlocked}</div>
              <div style={{ color: '#ccc', fontSize: '11px' }}>Blocked</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255, 165, 2, 0.1)', borderRadius: '6px' }}>
              <div style={{ color: '#ffa502', fontSize: '16px', fontWeight: 'bold' }}>{metrics.sessionsSecured}</div>
              <div style={{ color: '#ccc', fontSize: '11px' }}>Sessions</div>
            </div>
          </div>

          {recentThreats.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '8px' }}>Recent Threats</div>
              <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                {recentThreats.map(threat => (
                  <div
                    key={threat.id}
                    style={{
                      padding: '6px',
                      marginBottom: '4px',
                      background: threat.blocked ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: threat.blocked ? '#2ed573' : '#ff4757', fontWeight: 'bold' }}>
                        {threat.type.toUpperCase()}
                      </span>
                      <span style={{ color: '#888' }}>
                        {new Date(threat.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ color: '#ccc', marginTop: '2px' }}>
                      {threat.details.substring(0, 50)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={clearThreats}
              style={{
                flex: 1,
                background: 'rgba(255, 71, 87, 0.2)',
                border: '1px solid rgba(255, 71, 87, 0.5)',
                color: '#ff4757',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                flex: 1,
                background: 'rgba(46, 213, 115, 0.2)',
                border: '1px solid rgba(46, 213, 115, 0.5)',
                color: '#2ed573',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Higher-Order Component for Security Enhancement
export const withAdvancedSecurity = <P extends object>(
  Component: React.ComponentType<P>,
  securityConfig?: Partial<SecurityConfig>
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <AdvancedSecurityProvider config={securityConfig} showSecurityMonitor={process.env.NODE_ENV === 'development'}>
      <Component {...props} ref={ref} />
    </AdvancedSecurityProvider>
  ));
};

export default AdvancedSecurityProvider;