import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const SimpleEnhancedLoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);

  // Check for biometric authentication availability
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        if (window.PublicKeyCredential) {
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
          
          // Check for Face ID specifically (mainly for Safari/iOS)
          if (available && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
            setFaceIdAvailable(true);
          }
        }
      } catch (error) {
        console.warn('Biometric availability check failed:', error);
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
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
      onLogin({
        id: '1',
        username: username,
        email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@konivrer.com`,
        level: 1,
        preferences: {
          theme: 'dark',
          notifications: true
        }
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
          notifications: true
        }
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
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        allowCredentials: [],
        userVerification: 'required',
        timeout: 60000,
      };

      // Request credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (credential) {
        onLogin({
          id: 'biometric_user',
          username: `${type}User`,
          email: `${type}@konivrer.com`,
          level: 5,
          preferences: {
            theme: 'dark',
            notifications: true
          }
        });
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '10px'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              backgroundColor: '#1a1a1a',
              padding: window.innerWidth <= 768 ? '20px' : window.innerWidth <= 480 ? '15px' : '40px',
              borderRadius: '12px',
              border: '2px solid #d4af37',
              width: window.innerWidth <= 480 ? '98vw' : window.innerWidth <= 768 ? '95vw' : '90vw',
              maxWidth: window.innerWidth <= 768 ? '95vw' : '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >


            {/* Main Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: window.innerWidth <= 480 ? '15px' : '25px',
              marginBottom: window.innerWidth <= 480 ? '20px' : '30px'
            }}>
              
              {/* Email/Username & Password Section */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #444'
              }}>
                <h3 style={{ 
                  color: '#d4af37', 
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  textAlign: 'center'
                }}>
                  Email & Password
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      color: '#d4af37', 
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#1a1a1a',
                        border: '2px solid #444',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                      onBlur={(e) => e.target.style.borderColor = '#444'}
                      placeholder="Enter email or username"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      color: '#d4af37', 
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#1a1a1a',
                        border: '2px solid #444',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                      onBlur={(e) => e.target.style.borderColor = '#444'}
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
                      transition: 'all 0.3s'
                    }}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>

              {/* SSO Section - All Options Shown */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #444'
              }}>
                <h3 style={{ 
                  color: '#d4af37', 
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  textAlign: 'center'
                }}>
                  Single Sign-On
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      backgroundColor: ssoLoading === 'Google' ? '#666' : '#4285f4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: ssoLoading === 'Google' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {ssoLoading === 'Google' ? 'Connecting...' : 'Continue with Google'}
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
                      backgroundColor: ssoLoading === 'GitHub' ? '#666' : '#333',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: ssoLoading === 'GitHub' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {ssoLoading === 'GitHub' ? 'Connecting...' : 'Continue with GitHub'}
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
                      backgroundColor: ssoLoading === 'Microsoft' ? '#666' : '#0078d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: ssoLoading === 'Microsoft' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {ssoLoading === 'Microsoft' ? 'Connecting...' : 'Continue with Microsoft'}
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
                      backgroundColor: ssoLoading === 'Discord' ? '#666' : '#5865f2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: ssoLoading === 'Discord' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {ssoLoading === 'Discord' ? 'Connecting...' : 'Continue with Discord'}
                  </button>
                </div>
              </div>

              {/* Biometric Authentication Section - Security Feature */}
              {(biometricAvailable || faceIdAvailable) && (
                <div style={{
                  backgroundColor: '#2a2a2a',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #444'
                }}>
                  <h3 style={{ 
                    color: '#d4af37', 
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}>
                    Biometric Security
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {biometricAvailable && (
                      <button
                        onClick={() => handleBiometricLogin('fingerprint')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
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
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        Face ID Login
                      </button>
                    )}
                  </div>
                  
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#d4af37',
                    textAlign: 'center'
                  }}>
                    Secure biometric authentication using your device's built-in sensors
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
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
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#777'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#666'}
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
                      notifications: true
                    }
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
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#4CAF50'}
              >
                Demo Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleEnhancedLoginModal;