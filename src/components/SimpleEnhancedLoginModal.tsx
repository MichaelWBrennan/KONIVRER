import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDynamicSizing } from '../utils/userAgentSizing';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  avatar?: string;
  preferences?: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const SimpleEnhancedLoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);

  // Get dynamic sizing based on user agent and device capabilities
  const dynamicSizing = useDynamicSizing();

  // Check for biometric authentication availability
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        if (window.PublicKeyCredential) {
          const available =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);

          // Check for Face ID specifically (mainly for Safari/iOS)
          if (
            available &&
            navigator.userAgent.includes('Safari') &&
            !navigator.userAgent.includes('Chrome')
          ) {
            setFaceIdAvailable(true);
          }
        }
      } catch (_error) {
        console.warn('Biometric availability check failed:', _error);
        setBiometricAvailable(false);
        setFaceIdAvailable(false);
      }
    };

    if (isOpen) {
      checkBiometricAvailability();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login with email or username
    setTimeout(() => {
      const username = emailOrUsername.includes('@')
        ? emailOrUsername.split('@')[0]
        : emailOrUsername;
      onLogin({
        id: '1',
        username: username,
        email: emailOrUsername.includes('@')
          ? emailOrUsername
          : `${emailOrUsername}@konivrer.com`,
        level: 1,
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleSSOLogin = async (provider: string) => {
    setSsoLoading(provider);

    // Simulate SSO login
    setTimeout(() => {
      onLogin({
        id: `${provider}_user`,
        username: `${provider}User`,
        email: `user@${provider.toLowerCase()}.com`,
        level: 1,
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      });
      setSsoLoading(null);
    }, 1500);
  };

  const handleBiometricLogin = async (type: 'fingerprint' | 'faceid') => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn not supported');
      }

      // Create credential request options
      const publicKeyCredentialRequestOptions: {
        challenge: Uint8Array;
        allowCredentials: any[];
        userVerification: string;
      } = {
        challenge: new Uint8Array(32),
        allowCredentials: [],
        userVerification: 'required',
        timeout: 60000,
      };

      // Request credential
      const credential = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential;

      if (credential) {
        onLogin({
          id: 'biometric_user',
          username: `${type}User`,
          email: `${type}@konivrer.com`,
          level: 5,
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        });
      }
    } catch (_error) {
      console.error('Biometric authentication failed:', _error);
      alert('Biometric authentication failed. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="modal-content"
            style={{
              padding: `${dynamicSizing.containerPadding}px`,
              width: dynamicSizing.cssWidth,
              maxWidth: `${dynamicSizing.maxWidth}px`,
              minWidth: `${dynamicSizing.minWidth}px`,
              maxHeight: `${Math.min(dynamicSizing.maxHeight, dynamicSizing.height * 1.2)}px`,
              // Account for safe area insets on mobile devices
              marginTop: `${dynamicSizing.safeAreaInsets.top}px`,
              marginBottom: `${dynamicSizing.safeAreaInsets.bottom}px`,
              marginLeft: `${dynamicSizing.safeAreaInsets.left}px`,
              marginRight: `${dynamicSizing.safeAreaInsets.right}px`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <h2
                style={{
                  color: '#d4af37',
                  margin: '0 0 10px 0',
                  fontSize: '28px',
                  fontWeight: 'bold',
                }}
              >
                ⭐ Enhanced Login ⭐
              </h2>
              <p
                style={{
                  color: '#ccc',
                  margin: 0,
                  fontSize: '16px',
                }}
              >
                Welcome to KONIVRER Deck Database
              </p>
            </div>

            {/* Main Content Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: dynamicSizing.width < 768 
                  ? '1fr' 
                  : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: dynamicSizing.width < 768 ? '15px' : '25px',
                marginBottom: '30px',
              }}
            >
              {/* Email/Username & Password Section */}
              <div
                style={{
                  backgroundColor: '#2a2a2a',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #444',
                }}
              >
                <h3
                  style={{
                    color: '#d4af37',
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    textAlign: 'center',
                  }}
                >
                  🔐 Email & Password
                </h3>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#d4af37',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={e => setEmailOrUsername(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: dynamicSizing.width < 768 ? '10px' : '12px',
                        backgroundColor: '#1a1a1a',
                        border: '2px solid #444',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: dynamicSizing.width < 768 ? '14px' : '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#d4af37')}
                      onBlur={e => (e.target.style.borderColor = '#444')}
                      placeholder="Enter email or username"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#d4af37',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: dynamicSizing.width < 768 ? '10px' : '12px',
                        backgroundColor: '#1a1a1a',
                        border: '2px solid #444',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: dynamicSizing.width < 768 ? '14px' : '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#d4af37')}
                      onBlur={e => (e.target.style.borderColor = '#444')}
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: isLoading ? '#666' : '#d4af37',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isLoading ? '🔄 Logging in...' : '🚀 Login'}
                  </button>
                </form>
              </div>

              {/* SSO Section - All Options Shown */}
              <div
                style={{
                  backgroundColor: '#2a2a2a',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #444',
                }}
              >
                <h3
                  style={{
                    color: '#d4af37',
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    textAlign: 'center',
                  }}
                >
                  🔑 Single Sign-On
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Google SSO */}
                  <button
                    onClick={() => handleSSOLogin('Google')}
                    disabled={ssoLoading === 'Google'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor:
                        ssoLoading === 'Google' ? '#666' : '#4285f4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor:
                        ssoLoading === 'Google' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span>🔍</span>
                    {ssoLoading === 'Google'
                      ? 'Connecting...'
                      : 'Continue with Google'}
                  </button>

                  {/* GitHub SSO */}
                  <button
                    onClick={() => handleSSOLogin('GitHub')}
                    disabled={ssoLoading === 'GitHub'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor:
                        ssoLoading === 'GitHub' ? '#666' : '#333',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor:
                        ssoLoading === 'GitHub' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span>🐙</span>
                    {ssoLoading === 'GitHub'
                      ? 'Connecting...'
                      : 'Continue with GitHub'}
                  </button>

                  {/* Microsoft SSO */}
                  <button
                    onClick={() => handleSSOLogin('Microsoft')}
                    disabled={ssoLoading === 'Microsoft'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor:
                        ssoLoading === 'Microsoft' ? '#666' : '#0078d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor:
                        ssoLoading === 'Microsoft' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span>🪟</span>
                    {ssoLoading === 'Microsoft'
                      ? 'Connecting...'
                      : 'Continue with Microsoft'}
                  </button>

                  {/* Discord SSO */}
                  <button
                    onClick={() => handleSSOLogin('Discord')}
                    disabled={ssoLoading === 'Discord'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor:
                        ssoLoading === 'Discord' ? '#666' : '#5865f2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor:
                        ssoLoading === 'Discord' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span>🎮</span>
                    {ssoLoading === 'Discord'
                      ? 'Connecting...'
                      : 'Continue with Discord'}
                  </button>
                </div>
              </div>

              {/* Biometric Authentication Section - Security Feature */}
              {(biometricAvailable || faceIdAvailable) && (
                <div
                  style={{
                    backgroundColor: '#2a2a2a',
                    padding: '25px',
                    borderRadius: '10px',
                    border: '1px solid #444',
                  }}
                >
                  <h3
                    style={{
                      color: '#d4af37',
                      margin: '0 0 20px 0',
                      fontSize: '18px',
                      textAlign: 'center',
                    }}
                  >
                    👆 Biometric Security
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {biometricAvailable && (
                      <button
                        onClick={() => handleBiometricLogin('fingerprint')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                      >
                        <span>👆</span>
                        Fingerprint Login
                      </button>
                    )}

                    {faceIdAvailable && (
                      <button
                        onClick={() => handleBiometricLogin('faceid')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                      >
                        <span>🤳</span>
                        Face ID Login
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: '15px',
                      padding: '10px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#d4af37',
                      textAlign: 'center',
                    }}
                  >
                    🛡️ Secure biometric authentication using your device's
                    built-in sensors
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={e =>
                  ((e.target as HTMLElement).style.backgroundColor = '#777')
                }
                onMouseLeave={e =>
                  ((e.target as HTMLElement).style.backgroundColor = '#666')
                }
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onLogin({
                    id: 'demo',
                    username: 'DemoUser',
                    email: 'demo@konivrer.com',
                    level: 5,
                    preferences: {
                      theme: 'dark',
                      notifications: true,
                    },
                  });
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={e =>
                  ((e.target as HTMLElement).style.backgroundColor = '#45a049')
                }
                onMouseLeave={e =>
                  ((e.target as HTMLElement).style.backgroundColor = '#4CAF50')
                }
              >
                🎮 Demo Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleEnhancedLoginModal;
