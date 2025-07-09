import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdvancedLoginModal.css';

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

// Social login providers
const socialProviders = [
  { id: 'google', name: 'Google', icon: '🌐', color: '#DB4437' },
  { id: 'github', name: 'GitHub', icon: '🐙', color: '#333' },
  { id: 'discord', name: 'Discord', icon: '💬', color: '#7289DA' },
];

// Authentication methods
enum AuthMethod {
  PASSWORD = 'password',
  MAGIC_LINK = 'magic_link',
  SOCIAL = 'social',
  TWO_FACTOR = 'two_factor',
}

const AdvancedLoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [authMethod, setAuthMethod] = useState<AuthMethod>(AuthMethod.PASSWORD);
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  
  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  // Handle outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);
  
  // Handle escape key
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  // Check for biometric authentication
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        // This is a mock check - in a real app, you'd use the Web Authentication API
        const mockAvailable = Math.random() > 0.5;
        setBiometricAvailable(mockAvailable);
      } catch (error) {
        setBiometricAvailable(false);
      }
    };
    
    checkBiometricAvailability();
  }, []);
  
  // Focus username input on open
  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Add event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleOutsideClick, handleEscapeKey]);
  
  // Handle countdown for locked account
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown(prev => prev - 1);
      }, 1000);
    } else if (lockCountdown === 0 && isLocked) {
      setIsLocked(false);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, lockCountdown]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear error when user types
    if (error) setError(null);
  };
  
  // Handle verification code input
  const handleCodeDigitChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newDigits = [...codeDigits];
      newDigits[index] = value;
      setCodeDigits(newDigits);
      
      // Auto-advance to next input
      if (value && index < 5) {
        setCurrentDigitIndex(index + 1);
      }
      
      // Combine digits into verification code
      setVerificationCode(newDigits.join(''));
    }
  };
  
  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (authMethod === AuthMethod.PASSWORD) {
        // Validate credentials (mock validation)
        if (credentials.username === 'admin' && credentials.password === 'password') {
          const user: User = {
            id: '1',
            username: credentials.username,
            email: 'admin@example.com',
            level: 10
          };
          
          // Reset login attempts
          setLoginAttempts(0);
          
          // Call the onLogin callback
          onLogin(user);
          onClose();
        } else {
          // Increment login attempts
          const attempts = loginAttempts + 1;
          setLoginAttempts(attempts);
          
          // Lock account after 3 failed attempts
          if (attempts >= 3) {
            setIsLocked(true);
            setLockCountdown(30); // 30 seconds lockout
            setError('Too many failed attempts. Account locked for 30 seconds.');
          } else {
            setError('Invalid username or password');
          }
        }
      } else if (authMethod === AuthMethod.MAGIC_LINK) {
        // Simulate sending magic link
        if (credentials.email) {
          setError(null);
          // In a real app, you'd send an email with a magic link
          alert(`Magic link sent to ${credentials.email}`);
          onClose();
        } else {
          setError('Please enter your email address');
        }
      } else if (authMethod === AuthMethod.TWO_FACTOR) {
        // Validate 2FA code
        if (verificationCode.length === 6) {
          // Mock validation - in a real app, you'd verify with a server
          if (verificationCode === '123456') {
            const user: User = {
              id: '1',
              username: 'admin',
              email: 'admin@example.com',
              level: 10
            };
            
            onLogin(user);
            onClose();
          } else {
            setError('Invalid verification code');
          }
        } else {
          setError('Please enter the complete verification code');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = (providerId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd redirect to the OAuth provider
      const user: User = {
        id: '2',
        username: `user_${providerId}`,
        email: `user@${providerId}.com`,
        level: 5
      };
      
      onLogin(user);
      onClose();
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle biometric authentication
  const handleBiometricLogin = () => {
    setIsLoading(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      // In a real app, you'd use the Web Authentication API
      const user: User = {
        id: '3',
        username: 'biometric_user',
        email: 'biometric@example.com',
        level: 8
      };
      
      onLogin(user);
      onClose();
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle password reset request
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordResetEmail) {
      // In a real app, you'd send a password reset email
      setPasswordResetSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setPasswordResetSent(false);
        setPasswordResetEmail('');
      }, 3000);
    } else {
      setError('Please enter your email address');
    }
  };
  
  // Render password strength indicator
  const renderPasswordStrength = () => {
    const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const strengthColors = ['#ff4d4d', '#ffaa4d', '#ffff4d', '#4dff4d', '#4dffaa'];
    
    return (
      <div style={{ marginTop: '5px' }}>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '5px' }}>
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              style={{
                height: '4px',
                flex: 1,
                backgroundColor: level <= passwordStrength ? strengthColors[passwordStrength - 1] : '#444',
                borderRadius: '2px',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>
        {credentials.password && (
          <div style={{ fontSize: '12px', color: strengthColors[passwordStrength - 1] || '#666' }}>
            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter a password'}
          </div>
        )}
      </div>
    );
  };
  
  // Render the appropriate authentication form
  const renderAuthForm = () => {
    switch (authMethod) {
      case AuthMethod.PASSWORD:
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
                Username
              </label>
              <input
                ref={usernameInputRef}
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                disabled={isLoading || isLocked}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d4af37',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: '#333',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2) inset'
                }}
                placeholder="Enter your username"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  disabled={isLoading || isLocked}
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '1px solid #d4af37',
                    borderRadius: '5px',
                    fontSize: '16px',
                    backgroundColor: '#333',
                    color: 'white',
                    outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2) inset'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#d4af37',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {renderPasswordStrength()}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{ marginRight: '8px' }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Forgot password?
              </button>
            </div>
            
            {error && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                color: '#ff6b6b', 
                borderRadius: '5px', 
                marginBottom: '15px',
                borderLeft: '4px solid #ff6b6b'
              }}>
                {error}
              </div>
            )}
            
            {isLocked && (
              <div style={{ textAlign: 'center', marginBottom: '15px', color: '#ff6b6b' }}>
                Account locked for {lockCountdown} seconds
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || isLocked || !credentials.username || !credentials.password}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: isLoading || isLocked || !credentials.username || !credentials.password ? '#666' : '#d4af37',
                color: isLoading || isLocked || !credentials.username || !credentials.password ? '#aaa' : '#000',
                cursor: isLoading || isLocked || !credentials.username || !credentials.password ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>Logging in</span>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: '2px solid transparent',
                    borderTopColor: '#000',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        );
        
      case AuthMethod.MAGIC_LINK:
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d4af37',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: '#333',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="Enter your email"
              />
            </div>
            
            {error && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                color: '#ff6b6b', 
                borderRadius: '5px', 
                marginBottom: '15px',
                borderLeft: '4px solid #ff6b6b'
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !credentials.email}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: isLoading || !credentials.email ? '#666' : '#d4af37',
                color: isLoading || !credentials.email ? '#aaa' : '#000',
                cursor: isLoading || !credentials.email ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        );
        
      case AuthMethod.TWO_FACTOR:
        return (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ color: 'white', marginBottom: '15px' }}>
                Enter the 6-digit verification code sent to your device
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeDigitChange(index, e.target.value)}
                    onFocus={() => setCurrentDigitIndex(index)}
                    autoFocus={index === currentDigitIndex}
                    style={{
                      width: '40px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '24px',
                      border: '1px solid #d4af37',
                      borderRadius: '5px',
                      backgroundColor: '#333',
                      color: 'white'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {error && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                color: '#ff6b6b', 
                borderRadius: '5px', 
                marginBottom: '15px',
                borderLeft: '4px solid #ff6b6b'
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: isLoading || verificationCode.length !== 6 ? '#666' : '#d4af37',
                color: isLoading || verificationCode.length !== 6 ? '#aaa' : '#000',
                cursor: isLoading || verificationCode.length !== 6 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setCodeDigits(['', '', '', '', '', ''])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </form>
        );
        
      case AuthMethod.SOCIAL:
        return (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ color: 'white' }}>
                Continue with your social account
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {socialProviders.map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={isLoading}
                  style={{
                    padding: '12px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: provider.color,
                    color: '#fff',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <span>{provider.icon}</span>
                  <span>Continue with {provider.name}</span>
                </button>
              ))}
            </div>
            
            {biometricAvailable && (
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d4af37',
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  color: '#d4af37',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginTop: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span></span>
                <span>Use Biometric Login</span>
              </button>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render forgot password form
  const renderForgotPasswordForm = () => (
    <form onSubmit={handlePasswordReset}>
      <h3 style={{ color: '#d4af37', marginTop: 0 }}>Reset Your Password</h3>
      
      <p style={{ color: 'white', marginBottom: '20px' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
          Email Address
        </label>
        <input
          type="email"
          value={passwordResetEmail}
          onChange={(e) => setPasswordResetEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d4af37',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#333',
            color: 'white'
          }}
          placeholder="Enter your email"
        />
      </div>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
          color: '#ff6b6b', 
          borderRadius: '5px', 
          marginBottom: '15px',
          borderLeft: '4px solid #ff6b6b'
        }}>
          {error}
        </div>
      )}
      
      {passwordResetSent && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: 'rgba(0, 255, 0, 0.1)', 
          color: '#4dff4d', 
          borderRadius: '5px', 
          marginBottom: '15px',
          borderLeft: '4px solid #4dff4d'
        }}>
          Password reset link sent to your email!
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          style={{
            padding: '12px 20px',
            border: '1px solid #d4af37',
            borderRadius: '5px',
            backgroundColor: 'transparent',
            color: '#d4af37',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
        
        <button
          type="submit"
          disabled={!passwordResetEmail}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: !passwordResetEmail ? '#666' : '#d4af37',
            color: !passwordResetEmail ? '#aaa' : '#000',
            cursor: !passwordResetEmail ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Send Reset Link
        </button>
      </div>
    </form>
  );
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { 
        duration: 0.2 
      } 
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '30px',
              borderRadius: '10px',
              border: '2px solid #d4af37',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '5px',
              background: 'linear-gradient(90deg, #d4af37, #ffd700, #d4af37)',
              backgroundSize: '200% 100%',
              animation: 'gradient 2s ease infinite'
            }} />
            
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'color 0.3s',
                zIndex: 10
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#d4af37')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#999')}
            >
              ×
            </button>
            
            {!showForgotPassword ? (
              <>
                <h2 style={{ 
                  marginTop: 0, 
                  color: '#d4af37', 
                  textAlign: 'center',
                  fontSize: '28px',
                  marginBottom: '30px'
                }}>
                  ⭐ Login to KONIVRER ⭐
                </h2>
                
                {/* Auth method tabs */}
                <div style={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #333',
                  marginBottom: '25px'
                }}>
                  {[
                    { id: AuthMethod.PASSWORD, label: 'Password', icon: '' },
                    { id: AuthMethod.MAGIC_LINK, label: 'Magic Link', icon: '' },
                    { id: AuthMethod.SOCIAL, label: 'Social', icon: '' },
                    { id: AuthMethod.TWO_FACTOR, label: '2FA', icon: '' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setAuthMethod(method.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'none',
                        border: 'none',
                        borderBottom: authMethod === method.id ? '3px solid #d4af37' : '3px solid transparent',
                        color: authMethod === method.id ? '#d4af37' : '#999',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontSize: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
                
                {renderAuthForm()}
                
                <div style={{ 
                  marginTop: '25px', 
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d4af37',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </>
            ) : (
              renderForgotPasswordForm()
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedLoginModal;