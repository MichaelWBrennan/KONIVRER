import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecurityConfig {
  enableCSP: boolean;
  enableHTTPS: boolean;
  enableSecureHeaders: boolean;
  enableDataEncryption: boolean;
  enableAuditLogging: boolean;
  enableGDPRCompliance: boolean;
}

interface SecurityContextType {
  config: SecurityConfig;
  isSecure: boolean;
  encryptData: (data: string) => string;
  decryptData: (encryptedData: string) => string;
  sanitizeInput: (input: string) => string;
  logSecurityEvent: (event: string, details?: any) => void;
  checkDataConsent: () => boolean;
  requestDataConsent: () => Promise<boolean>;
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
  const [config] = useState<SecurityConfig>({
    enableCSP: true,
    enableHTTPS: true,
    enableSecureHeaders: true,
    enableDataEncryption: true,
    enableAuditLogging: true,
    enableGDPRCompliance: true,
  });

  const [isSecure, setIsSecure] = useState(false);

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
        });

        setIsSecure(true);
      } catch (error) {
        console.error('Security initialization failed:', error);
        logSecurityEvent('SECURITY_INIT_FAILED', {
          error: (error as Error).message,
        });
      }
    };

    initializeSecurity();

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

    return () => clearInterval(securityMonitor);
  }, [config]);

  const contextValue: SecurityContextType = {
    config,
    isSecure,
    encryptData: simpleEncrypt,
    decryptData: simpleDecrypt,
    sanitizeInput,
    logSecurityEvent,
    checkDataConsent,
    requestDataConsent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
