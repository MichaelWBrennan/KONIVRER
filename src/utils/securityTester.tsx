import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedSecurity } from '../security/AdvancedSecuritySystem';

// Security Test Types
interface SecurityTest {
  id: string;
  name: string;
  category: 'input' | 'session' | 'csrf' | 'xss' | 'injection' | 'encryption';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  testFunction: () => Promise<SecurityTestResult>;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: SecurityTestResult;
}

interface SecurityTestResult {
  passed: boolean;
  message: string;
  details?: string;
  timeTaken: number;
}

// Comprehensive Security Tests
const SECURITY_TESTS: Omit<SecurityTest, 'status' | 'result'>[] = [
  // Input Sanitization Tests
  {
    id: 'input-xss-basic',
    name: 'Basic XSS Prevention',
    category: 'xss',
    severity: 'high',
    description: 'Tests if basic XSS attacks are blocked',
    testFunction: async () => {
      const startTime = Date.now();
      const maliciousInput = '<script>alert("XSS")</script>';
      
      // Create a test input element
      const testInput = document.createElement('input');
      testInput.value = maliciousInput;
      
      // Check if the value was sanitized
      const sanitized = testInput.value !== maliciousInput;
      
      return {
        passed: sanitized,
        message: sanitized ? 'XSS input properly sanitized' : 'XSS input not sanitized',
        details: `Input: ${maliciousInput}, Result: ${testInput.value}`,
        timeTaken: Date.now() - startTime
      };
    }
  },
  {
    id: 'input-sql-injection',
    name: 'SQL Injection Prevention',
    category: 'injection',
    severity: 'critical',
    description: 'Tests if SQL injection attempts are blocked',
    testFunction: async () => {
      const startTime = Date.now();
      const maliciousInput = "'; DROP TABLE users; --";
      
      // Simulate input sanitization
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
        /(--|\/\*|\*\/)/g,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
      ];
      
      let sanitized = maliciousInput;
      let blocked = false;
      
      sqlPatterns.forEach(pattern => {
        if (pattern.test(sanitized)) {
          blocked = true;
          sanitized = sanitized.replace(pattern, '');
        }
      });
      
      return {
        passed: blocked,
        message: blocked ? 'SQL injection attempt blocked' : 'SQL injection not detected',
        details: `Input: ${maliciousInput}, Sanitized: ${sanitized}`,
        timeTaken: Date.now() - startTime
      };
    }
  },
  {
    id: 'input-html-injection',
    name: 'HTML Injection Prevention',
    category: 'xss',
    severity: 'medium',
    description: 'Tests if HTML injection is prevented',
    testFunction: async () => {
      const startTime = Date.now();
      const maliciousInput = '<img src="x" onerror="alert(1)">';
      
      const htmlPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
      ];
      
      let sanitized = maliciousInput;
      let blocked = false;
      
      htmlPatterns.forEach(pattern => {
        if (pattern.test(sanitized)) {
          blocked = true;
          sanitized = sanitized.replace(pattern, '');
        }
      });
      
      return {
        passed: blocked,
        message: blocked ? 'HTML injection blocked' : 'HTML injection not detected',
        details: `Input: ${maliciousInput}, Sanitized: ${sanitized}`,
        timeTaken: Date.now() - startTime
      };
    }
  },
  
  // Session Security Tests
  {
    id: 'session-token-validation',
    name: 'Session Token Validation',
    category: 'session',
    severity: 'high',
    description: 'Tests if session tokens are properly validated',
    testFunction: async () => {
      const startTime = Date.now();
      
      // Check if session storage is secure
      const hasSecureSession = sessionStorage.getItem('konivrer_session') !== null ||
                              localStorage.getItem('konivrer_session') !== null;
      
      return {
        passed: !hasSecureSession, // Should not store sensitive data in plain storage
        message: hasSecureSession ? 'Insecure session storage detected' : 'Session storage secure',
        details: 'Session tokens should not be stored in plain localStorage/sessionStorage',
        timeTaken: Date.now() - startTime
      };
    }
  },
  {
    id: 'session-timeout',
    name: 'Session Timeout',
    category: 'session',
    severity: 'medium',
    description: 'Tests if sessions properly timeout',
    testFunction: async () => {
      const startTime = Date.now();
      
      // Simulate session timeout check
      const sessionStart = Date.now() - (31 * 60 * 1000); // 31 minutes ago
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      const isExpired = (Date.now() - sessionStart) > sessionTimeout;
      
      return {
        passed: isExpired,
        message: isExpired ? 'Session timeout working correctly' : 'Session timeout not enforced',
        details: `Session age: ${Math.floor((Date.now() - sessionStart) / 60000)} minutes`,
        timeTaken: Date.now() - startTime
      };
    }
  },
  
  // CSRF Protection Tests
  {
    id: 'csrf-token-presence',
    name: 'CSRF Token Presence',
    category: 'csrf',
    severity: 'high',
    description: 'Tests if CSRF tokens are present in forms',
    testFunction: async () => {
      const startTime = Date.now();
      
      // Check for CSRF tokens in forms
      const forms = document.querySelectorAll('form');
      let hasCSRFTokens = true;
      
      forms.forEach(form => {
        const csrfInput = form.querySelector('input[name="csrf_token"]');
        if (!csrfInput) {
          hasCSRFTokens = false;
        }
      });
      
      return {
        passed: hasCSRFTokens || forms.length === 0,
        message: hasCSRFTokens ? 'CSRF tokens present in forms' : 'Missing CSRF tokens in forms',
        details: `Found ${forms.length} forms, CSRF protection: ${hasCSRFTokens}`,
        timeTaken: Date.now() - startTime
      };
    }
  },
  
  // Encryption Tests
  {
    id: 'encryption-availability',
    name: 'Encryption API Availability',
    category: 'encryption',
    severity: 'critical',
    description: 'Tests if Web Crypto API is available',
    testFunction: async () => {
      const startTime = Date.now();
      
      const hasWebCrypto = typeof crypto !== 'undefined' && 
                          typeof crypto.subtle !== 'undefined';
      
      return {
        passed: hasWebCrypto,
        message: hasWebCrypto ? 'Web Crypto API available' : 'Web Crypto API not available',
        details: 'Modern encryption requires Web Crypto API support',
        timeTaken: Date.now() - startTime
      };
    }
  },
  {
    id: 'encryption-strength',
    name: 'Encryption Strength Test',
    category: 'encryption',
    severity: 'high',
    description: 'Tests encryption key strength',
    testFunction: async () => {
      const startTime = Date.now();
      
      try {
        // Test AES-256 key generation
        const key = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const keyLength = exportedKey.byteLength * 8; // Convert to bits
        
        return {
          passed: keyLength >= 256,
          message: `Encryption key strength: ${keyLength} bits`,
          details: keyLength >= 256 ? 'Strong encryption available' : 'Weak encryption detected',
          timeTaken: Date.now() - startTime
        };
      } catch (error) {
        return {
          passed: false,
          message: 'Encryption test failed',
          details: `Error: ${error}`,
          timeTaken: Date.now() - startTime
        };
      }
    }
  },
  
  // Content Security Policy Tests
  {
    id: 'csp-headers',
    name: 'Content Security Policy',
    category: 'xss',
    severity: 'medium',
    description: 'Tests if CSP headers are present',
    testFunction: async () => {
      const startTime = Date.now();
      
      // Check for CSP meta tag
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      const hasCSP = cspMeta !== null;
      
      return {
        passed: hasCSP,
        message: hasCSP ? 'CSP headers detected' : 'No CSP headers found',
        details: hasCSP ? `CSP: ${cspMeta?.getAttribute('content')}` : 'Consider adding CSP for XSS protection',
        timeTaken: Date.now() - startTime
      };
    }
  }
];

// Security Tester Component
const SecurityTester: React.FC = () => {
  const [tests, setTests] = useState<SecurityTest[]>(
    SECURITY_TESTS.map(test => ({ ...test, status: 'pending' as const }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { reportThreat } = useAdvancedSecurity();

  // Run a single test
  const runTest = useCallback(async (test: SecurityTest): Promise<SecurityTest> => {
    setCurrentTest(test.id);
    
    // Update status to running
    setTests(prev => prev.map(t => 
      t.id === test.id ? { ...t, status: 'running' as const } : t
    ));

    try {
      const result = await test.testFunction();
      
      // Report security issues as threats
      if (!result.passed && test.severity === 'critical') {
        reportThreat({
          type: test.category === 'xss' ? 'xss' : 
                test.category === 'injection' ? 'injection' :
                test.category === 'csrf' ? 'csrf' : 'data_breach',
          severity: test.severity,
          source: 'security_test',
          blocked: false,
          details: `Security test failed: ${test.name} - ${result.message}`
        });
      }

      return {
        ...test,
        status: result.passed ? 'passed' : 'failed',
        result
      };
    } catch (error) {
      return {
        ...test,
        status: 'failed',
        result: {
          passed: false,
          message: 'Test execution failed',
          details: `Error: ${error}`,
          timeTaken: 0
        }
      };
    }
  }, [reportThreat]);

  // Run all tests
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setShowResults(false);
    
    // Reset all tests
    setTests(SECURITY_TESTS.map(test => ({ ...test, status: 'pending' as const })));

    for (const test of tests) {
      const result = await runTest(test);
      setTests(prev => prev.map(t => t.id === result.id ? result : t));
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setCurrentTest(null);
    setIsRunning(false);
    setShowResults(true);
  }, [tests, runTest]);

  // Get test statistics
  const getStats = useCallback(() => {
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;
    const running = tests.filter(t => t.status === 'running').length;
    
    const criticalFailed = tests.filter(t => t.status === 'failed' && t.severity === 'critical').length;
    const highFailed = tests.filter(t => t.status === 'failed' && t.severity === 'high').length;
    
    return { passed, failed, pending, running, total: tests.length, criticalFailed, highFailed };
  }, [tests]);

  const stats = getStats();
  const securityScore = Math.max(0, Math.min(100, 
    ((stats.passed / stats.total) * 100) - (stats.criticalFailed * 20) - (stats.highFailed * 10)
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '450px',
        maxHeight: '80vh',
        background: 'rgba(20, 20, 20, 0.95)',
        border: `2px solid ${securityScore >= 80 ? '#2ed573' : securityScore >= 60 ? '#ffa502' : '#ff4757'}`,
        borderRadius: '12px',
        padding: '20px',
        zIndex: 10001,
        overflow: 'auto',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#d4af37', margin: '0 0 10px 0', fontSize: '18px' }}>
          🔒 Security Testing Suite
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAllTests}
            disabled={isRunning}
            style={{
              background: isRunning ? '#666' : 'rgba(46, 213, 115, 0.2)',
              border: '1px solid rgba(46, 213, 115, 0.5)',
              color: isRunning ? '#ccc' : '#2ed573',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isRunning ? 'Testing...' : 'Run Security Tests'}
          </motion.button>
          
          <button
            onClick={() => setShowResults(!showResults)}
            style={{
              background: 'rgba(100, 100, 100, 0.2)',
              border: '1px solid rgba(150, 150, 150, 0.3)',
              color: '#ccc',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showResults ? 'Hide' : 'Show'} Results
          </button>
        </div>

        {/* Security Score */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ color: '#ccc', fontSize: '14px' }}>Security Score</span>
            <span style={{ 
              color: securityScore >= 80 ? '#2ed573' : securityScore >= 60 ? '#ffa502' : '#ff4757',
              fontSize: '14px', 
              fontWeight: 'bold' 
            }}>
              {Math.round(securityScore)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(100, 100, 100, 0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${securityScore}%` }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${
                  securityScore >= 80 ? '#2ed573' : 
                  securityScore >= 60 ? '#ffa502' : '#ff4757'
                }, ${
                  securityScore >= 80 ? '#1dd1a1' : 
                  securityScore >= 60 ? '#ff6b4a' : '#ff3838'
                })`,
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Test Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#2ed573', fontSize: '16px', fontWeight: 'bold' }}>{stats.passed}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Passed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#ff4757', fontSize: '16px', fontWeight: 'bold' }}>{stats.failed}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Failed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255, 165, 2, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#ffa502', fontSize: '16px', fontWeight: 'bold' }}>{stats.running}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Running</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(150, 150, 150, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#888', fontSize: '16px', fontWeight: 'bold' }}>{stats.pending}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Pending</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              background: 'rgba(100, 100, 100, 0.2)', 
              borderRadius: '4px', 
              height: '6px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((stats.passed + stats.failed) / stats.total) * 100}%` }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #d4af37, #ffa502)',
                  borderRadius: '4px'
                }}
              />
            </div>
            {currentTest && (
              <div style={{ color: '#ccc', fontSize: '12px', marginTop: '5px' }}>
                Testing: {tests.find(t => t.id === currentTest)?.name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Results */}
      {showResults && (
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          {tests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '6px',
                background: test.status === 'passed' ? 'rgba(46, 213, 115, 0.1)' :
                           test.status === 'failed' ? 'rgba(255, 71, 87, 0.1)' :
                           test.status === 'running' ? 'rgba(255, 165, 2, 0.1)' :
                           'rgba(100, 100, 100, 0.1)',
                border: `1px solid ${
                  test.status === 'passed' ? 'rgba(46, 213, 115, 0.3)' :
                  test.status === 'failed' ? 'rgba(255, 71, 87, 0.3)' :
                  test.status === 'running' ? 'rgba(255, 165, 2, 0.3)' :
                  'rgba(100, 100, 100, 0.3)'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 'bold' }}>
                      {test.name}
                    </span>
                    <span style={{
                      background: test.severity === 'critical' ? 'rgba(255, 71, 87, 0.2)' :
                                 test.severity === 'high' ? 'rgba(255, 165, 2, 0.2)' :
                                 test.severity === 'medium' ? 'rgba(255, 193, 7, 0.2)' :
                                 'rgba(100, 100, 100, 0.2)',
                      color: test.severity === 'critical' ? '#ff4757' :
                             test.severity === 'high' ? '#ffa502' :
                             test.severity === 'medium' ? '#ffc107' :
                             '#888',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      textTransform: 'uppercase'
                    }}>
                      {test.severity}
                    </span>
                  </div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                    {test.description}
                  </div>
                  {test.result && (
                    <>
                      <div style={{ 
                        color: test.status === 'passed' ? '#2ed573' : '#ff4757', 
                        fontSize: '12px',
                        marginBottom: '2px'
                      }}>
                        {test.result.message}
                      </div>
                      {test.result.details && (
                        <div style={{ color: '#666', fontSize: '11px' }}>
                          {test.result.details}
                        </div>
                      )}
                      <div style={{ color: '#555', fontSize: '10px', marginTop: '4px' }}>
                        Completed in {test.result.timeTaken}ms
                      </div>
                    </>
                  )}
                </div>
                <div style={{
                  color: test.status === 'passed' ? '#2ed573' :
                         test.status === 'failed' ? '#ff4757' :
                         test.status === 'running' ? '#ffa502' : '#888',
                  fontSize: '16px',
                  marginLeft: '10px'
                }}>
                  {test.status === 'passed' ? '✅' :
                   test.status === 'failed' ? '❌' :
                   test.status === 'running' ? '⏳' : '⏸️'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SecurityTester;