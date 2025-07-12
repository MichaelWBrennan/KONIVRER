import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdvancedLoginModal.css';
import { useAdvancedSecurity, useSanitizedInput, useCSRFProtection, useSecureSession } from '../security/AdvancedSecuritySystem';
import { useSSO, SSOUserProfile } from '../services/ssoService';
import { SSOButtonGroup } from './SSOButton';

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

// Remove the old socialProviders array - now using SSO service

// Authentication methods
enum AuthMethod {
  PASSWORD = 'password',
}

// Enhanced login modal with modern features
const EnhancedLoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  // Security hooks
  const { reportThreat } = useAdvancedSecurity();
  const { token: csrfToken, validate: validateCSRF } = useCSRFProtection();
  const { sessionToken, isValid: isSessionValid, refresh: refreshSession } = useSecureSession();
  
  // SSO hooks
  const { initiateLogin, getCurrentUser, getProviders } = useSSO();
  
  // Sanitized inputs
  const [username, setUsername] = useSanitizedInput('');
  const [password, setPassword] = useSanitizedInput('');
  const [email, setEmail] = useSanitizedInput('');
  const [confirmPassword, setConfirmPassword] = useSanitizedInput('');
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [authMethod, setAuthMethod] = useState<AuthMethod>(AuthMethod.PASSWORD);
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '', 
    email: '',
    confirmPassword: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const [ssoLoading, setSsoLoading] = useState<string | null>(null);

  // SSO event handlers
  useEffect(() => {
    const handleSSOSuccess = (event: CustomEvent) => {
      const { profile } = event.detail as { profile: SSOUserProfile };
      
      // Convert SSO profile to User format
      const user: User = {
        id: profile.id,
        username: profile.name,
        email: profile.email,
        avatar: profile.avatar
      };
      
      setSsoLoading(null);
      setSuccess(`Successfully logged in with ${profile.provider}`);
      onLogin(user);
      onClose();
    };

    const handleSSOError = (event: CustomEvent) => {
      const { error, provider } = event.detail;
      setSsoLoading(null);
      setError(`Login failed with ${provider}: ${error}`);
    };

    window.addEventListener('sso-login-success', handleSSOSuccess as EventListener);
    window.addEventListener('sso-login-error', handleSSOError as EventListener);

    return () => {
      window.removeEventListener('sso-login-success', handleSSOSuccess as EventListener);
      window.removeEventListener('sso-login-error', handleSSOError as EventListener);
    };
  }, [onLogin, onClose]);

  // Handle SSO login
  const handleSSOLogin = async (providerId: string) => {
    try {
      setSsoLoading(providerId);
      setError(null);
      await initiateLogin(providerId);
    } catch (error) {
      setSsoLoading(null);
      setError(`Failed to login with ${providerId}: ${error}`);
    }
  };

  // Enhanced password strength checker
  const checkPasswordStrength = useCallback((password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
      password.length >= 12,
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    setPasswordStrength(Math.min(strength, 5));
  }, []);

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



  // Focus username input on open
  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, authMethod]);

  // Add event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
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
      setLoginAttempts(0);
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
    if (success) setSuccess(null);
  };



  // Validate form inputs
  const validateForm = () => {
    if (authMethod === AuthMethod.PASSWORD) {
      if (!credentials.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!credentials.password) {
        setError('Password is required');
        return false;
      }
      if (isSignUp) {
        if (!credentials.username.trim()) {
          setError('Username is required');
          return false;
        }
        if (credentials.password !== credentials.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (passwordStrength < 3) {
          setError('Password is too weak. Please choose a stronger password.');
          return false;
        }
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      if (authMethod === AuthMethod.PASSWORD) {
        if (isSignUp) {
          // Handle sign up
          const user: User = {
            id: `user_${Date.now()}`,
            username: credentials.username,
            email: credentials.email,
            level: 1,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
            preferences: {
              theme: 'dark',
              notifications: true
            }
          };
          
          setSuccess('Account created successfully! Welcome to KONIVRER!');
          setTimeout(() => {
            onLogin(user);
            onClose();
            resetForm();
          }, 1500);
        } else {
          // Handle login - mock validation
          if (credentials.email === 'admin@konivrer.com' && credentials.password === 'password') {
            const user: User = {
              id: '1',
              username: 'admin',
              email: credentials.email,
              level: 10,
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              preferences: {
                theme: 'dark',
                notifications: true
              }
            };
            
            setLoginAttempts(0);
            setSuccess('Login successful! Welcome back!');
            
            setTimeout(() => {
              onLogin(user);
              onClose();
              resetForm();
            }, 1000);
          } else {
            // Increment login attempts
            const attempts = loginAttempts + 1;
            setLoginAttempts(attempts);
            
            if (attempts >= 3) {
              setIsLocked(true);
              setLockCountdown(30);
              setError('Too many failed attempts. Account locked for 30 seconds.');
            } else {
              setError(`Invalid credentials. ${3 - attempts} attempts remaining.`);
            }
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Old social login handler removed - now using SSO service

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordResetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passwordResetEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPasswordResetSent(true);
      setSuccess(`Password reset instructions sent to ${passwordResetEmail}`);
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setPasswordResetSent(false);
        setPasswordResetEmail('');
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCredentials({ username: '', password: '', email: '', confirmPassword: '' });
    setPasswordResetEmail('');
    setError(null);
    setSuccess(null);
    setIsSignUp(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForgotPassword(false);
    setPasswordResetSent(false);
    setShowQrCode(false);
    setAuthMethod(AuthMethod.PASSWORD);
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#ff4757', '#ff6b4a', '#ffa502', '#2ed573', '#1dd1a1'];
    
    if (!credentials.password) return null;
    
    return (
      <div className="password-strength-container">
        <div className="password-strength-bars">
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`password-strength-bar ${level <= passwordStrength ? 'active' : ''}`}
              style={{
                backgroundColor: level <= passwordStrength ? strengthColors[passwordStrength - 1] : '#333'
              }}
            />
          ))}
        </div>
        <span className="password-strength-label" style={{ color: strengthColors[passwordStrength - 1] || '#666' }}>
          {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter a password'}
        </span>
      </div>
    );
  };

  // Render authentication tabs
  // Removed tabs as we'll show all authentication options at once


  // Render password authentication form
  const renderPasswordForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      setAuthMethod(AuthMethod.PASSWORD);
      handleSubmit(e);
    }} className="auth-form">
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          ref={usernameInputRef}
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          disabled={isLoading || isLocked}
          className="form-input input-focus"
          placeholder="Enter your email"
          autoComplete="email"
        />
      </div>
      
      {isSignUp && (
        <div className="form-group">
          <label className="form-label">Choose Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            disabled={isLoading || isLocked}
            className="form-input input-focus"
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>
      )}
      
      <div className="form-group">
        <div className="password-label-container">
          <label className="form-label">Password</label>
          {!isSignUp && (
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading || isLocked}
            >
              Forgot Password?
            </button>
          )}
        </div>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            disabled={isLoading || isLocked}
            className="form-input input-focus"
            placeholder="Enter your password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
          <button
            type="button"
            className="toggle-password-button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isLocked}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '\u{1F441}\uFE0F' : '\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F'}
          </button>
        </div>
        {isSignUp && renderPasswordStrength()}
      </div>
      
      {isSignUp && (
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading || isLocked}
              className="form-input input-focus"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading || isLocked}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? '\u{1F441}\uFE0F' : '\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F'}
            </button>
          </div>
        </div>
      )}
      
      <div className="form-options">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            disabled={isLoading || isLocked}
          />
          <span className="checkbox-label">Remember me</span>
        </label>
        
        <button
          type="button"
          className="toggle-signup-button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setSuccess(null);
          }}
          disabled={isLoading || isLocked}
        >
          {isSignUp ? 'Login Instead' : 'Create Account'}
        </button>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || isLocked}
        className={`submit-button button-hover ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <span className="loading-spinner"></span>
        ) : isSignUp ? (
          'Sign Up'
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
  

  
  // Render SSO login buttons
  const renderSSOLogin = () => (
    <div className="social-login-section">
      <div className="divider">
        <span>or continue with</span>
      </div>
      <div className="sso-buttons-container">
        <SSOButtonGroup
          providers={getProviders()}
          onLogin={handleSSOLogin}
          disabled={isLoading}
          loading={ssoLoading !== null}
          maxVisible={3}
        />
      </div>
      <div className="divider" style={{ marginTop: '15px' }}>
        <span>or</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <motion.button
          type="button"
          onClick={() => {
            // Close the login modal
            onClose();
            
            // Navigate to the play page and start practice mode
            window.location.href = '/play';
            
            // After a short delay, simulate clicking the Practice Mode button
            setTimeout(() => {
              // Find and click the Practice Mode button
              const practiceButton = document.querySelector('[data-game-mode="practice"]');
              if (practiceButton) {
                (practiceButton as HTMLElement).click();
              }
            }, 500);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="guest-button"
          style={{
            background: 'transparent',
            border: '1px solid #888',
            color: '#888',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Play as Guest
        </motion.button>
      </div>
    </div>
  );

  // Render forgot password modal
  const renderForgotPasswordModal = () => (
    <AnimatePresence>
      {showForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="forgot-password-overlay"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="forgot-password-modal"
          >
            <h3>Reset Password</h3>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={passwordResetEmail}
                  onChange={(e) => setPasswordResetEmail(e.target.value)}
                  disabled={isLoading}
                  className="form-input input-focus"
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              
              <div className="forgot-password-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setPasswordResetEmail('');
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !passwordResetEmail}
                  className={`submit-button button-hover ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="modal-content gradient-border"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">
              Welcome to KONIVRER
            </h2>
            <button
              className="close-button"
              onClick={onClose}
              disabled={isLoading}
            >
              {'\u{2715}'}
            </button>
          </div>

          <div className="modal-body">
            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="error-message shake"
                >
                  <span className="message-icon">{'\u{26A0}\uFE0F'}</span>
                  <span>{error}</span>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="success-message pulse"
                >
                  <span className="message-icon">{'\u{2705}'}</span>
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Account Lock Warning */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lock-warning"
              >
                <span className="lock-icon"></span>
                <span>Account locked for {lockCountdown} seconds</span>
              </motion.div>
            )}

            <div className="auth-options-grid">
              {/* Email/Password Login Section */}
              <div className="auth-option-card">
                <h3>Email & Password</h3>
                {renderPasswordForm()}
              </div>
              
              {/* SSO Login Section */}
              <div className="auth-option-card">
                <h3>Single Sign-On</h3>
                {renderSSOLogin()}
              </div>
            </div>
          </div>

          {renderForgotPasswordModal()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedLoginModal;