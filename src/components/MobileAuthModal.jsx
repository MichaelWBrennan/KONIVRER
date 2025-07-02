/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

// Form validation schemas
const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const RegisterSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character',
      ),
    confirmPassword: z.string(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ),
    displayName: z.string().min(1, 'Display name is required').max(50),
    location: z.string().optional(),
    agreeToTerms: z
      .boolean()
      .refine(val => val === true, 'You must agree to the terms'),
    agreeToPrivacy: z
      .boolean()
      .refine(val => val === true, 'You must agree to the privacy policy'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const MobileAuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [ssoLoading, setSsoLoading] = useState(null);
  const { login, register, loginWithSSO } = useAuth();

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      displayName: '',
      location: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  // Password strength calculator
  const calculatePasswordStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const handleLogin = async data => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        onClose();
        loginForm.reset();
      } else {
        loginForm.setError('root', { message: result.error });
      }
    } catch (err) {
      loginForm.setError('root', {
        message: 'Login failed. Please try again.',
      });
    }
  };

  const handleRegister = async data => {
    try {
      const result = await register(data);
      if (result.success) {
        onClose();
        registerForm.reset();
      } else {
        registerForm.setError('root', { message: result.error });
      }
    } catch (err) {
      registerForm.setError('root', {
        message: 'Registration failed. Please try again.',
      });
    }
  };

  const handleSSOLogin = async provider => {
    try {
      setSsoLoading(provider);
      const result = await loginWithSSO(provider);

      if (result.success) {
        onClose();
        // Reset forms
        loginForm.reset();
        registerForm.reset();
      } else {
        // Show error on the current active form
        const currentForm = activeTab === 'login' ? loginForm : registerForm;
        currentForm.setError('root', {
          message:
            result.error ||
            `${provider} authentication failed. Please try again.`,
        });
      }
    } catch (err) {
      console.error(`SSO ${provider} error:`, err);
      const currentForm = activeTab === 'login' ? loginForm : registerForm;
      currentForm.setError('root', {
        message: `${provider} authentication failed. Please try again.`,
      });
    } finally {
      setSsoLoading(null);
    }
  };

  // Watch password for strength indicator
  const watchedPassword = registerForm.watch('password');

  // Update password strength when password changes
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [watchedPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -50 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="mobile-card esoteric-card max-w-md w-full relative overflow-hidden mobile-auth-top"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mobile-card-header esoteric-card-header">
            <h2 className="mobile-card-title esoteric-rune">
              {activeTab === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="mobile-btn esoteric-btn-small"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mobile-tabs">
            <button
              onClick={() => setActiveTab('login')}
              className={`mobile-tab ${activeTab === 'login' ? 'active esoteric-tab-active' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`mobile-tab ${activeTab === 'register' ? 'active esoteric-tab-active' : ''}`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {activeTab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="mobile-p"
              >
                {/* Login Form */}
                <div className="mobile-mb">
                  <label className="mobile-label">Email</label>
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    className="mobile-input esoteric-input"
                    placeholder="Enter your email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mobile-error">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mobile-mb">
                  <label className="mobile-label">Password</label>
                  <div className="mobile-input-group">
                    <input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="mobile-input esoteric-input"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mobile-input-icon"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mobile-error">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {loginForm.formState.errors.root && (
                  <div className="mobile-error-box mobile-mb">
                    {loginForm.formState.errors.root.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="mobile-btn mobile-btn-primary mobile-btn-block esoteric-btn esoteric-btn-primary"
                >
                  {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
                
                {/* SSO Login Options */}
                <div className="mobile-mt mobile-mb">
                  <div className="mobile-divider esoteric-divider">
                    <span className="esoteric-text-muted">or continue with</span>
                  </div>
                  
                  <div className="mobile-sso-buttons">
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('google')}
                      disabled={ssoLoading}
                      className="mobile-sso-btn esoteric-sso-btn"
                    >
                      <div className="mobile-sso-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path
                            fill="currentColor"
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                          />
                        </svg>
                      </div>
                      <span>Google</span>
                      {ssoLoading === 'google' && (
                        <div className="mobile-spinner esoteric-spinner-small"></div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('github')}
                      disabled={ssoLoading}
                      className="mobile-sso-btn esoteric-sso-btn"
                    >
                      <div className="mobile-sso-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path
                            fill="currentColor"
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                          />
                        </svg>
                      </div>
                      <span>GitHub</span>
                      {ssoLoading === 'github' && (
                        <div className="mobile-spinner esoteric-spinner-small"></div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('discord')}
                      disabled={ssoLoading}
                      className="mobile-sso-btn esoteric-sso-btn"
                    >
                      <div className="mobile-sso-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path
                            fill="currentColor"
                            d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
                          />
                        </svg>
                      </div>
                      <span>Discord</span>
                      {ssoLoading === 'discord' && (
                        <div className="mobile-spinner esoteric-spinner-small"></div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mobile-text-center mobile-mt mobile-text-small esoteric-text-muted">
                  <p className="mobile-mb-sm">Demo accounts:</p>
                  <p className="mobile-mb-sm">
                    <strong>user1@example.com</strong> / password
                  </p>
                  <p className="mobile-mb-sm">
                    <strong>judge@example.com</strong> / password
                  </p>
                </div>
              </motion.form>
            )}

            {activeTab === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="mobile-p"
              >
                {/* Register Form */}
                <div className="mobile-grid mobile-grid-2 mobile-gap">
                  <div>
                    <label className="mobile-label">Username</label>
                    <input
                      {...registerForm.register('username')}
                      type="text"
                      className="mobile-input esoteric-input"
                      placeholder="Username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="mobile-error">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mobile-label">Display Name</label>
                    <input
                      {...registerForm.register('displayName')}
                      type="text"
                      className="mobile-input esoteric-input"
                      placeholder="Your name"
                    />
                    {registerForm.formState.errors.displayName && (
                      <p className="mobile-error">
                        {registerForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mobile-mb">
                  <label className="mobile-label">Email</label>
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    className="mobile-input esoteric-input"
                    placeholder="Enter your email"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mobile-error">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mobile-mb">
                  <label className="mobile-label">Password</label>
                  <div className="mobile-input-group">
                    <input
                      {...registerForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="mobile-input esoteric-input"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mobile-input-icon"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="mobile-error">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}

                  {/* Password strength meter */}
                  {watchedPassword && (
                    <div className="mobile-mt-sm">
                      <div className="mobile-progress-bg">
                        <div
                          className={`mobile-progress esoteric-progress-${getPasswordStrengthText().toLowerCase()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <div className="mobile-text-small mobile-text-right esoteric-text-muted">
                        {getPasswordStrengthText()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mobile-mb">
                  <label className="mobile-label">Confirm Password</label>
                  <input
                    {...registerForm.register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="mobile-input esoteric-input"
                    placeholder="Confirm your password"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mobile-error">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="mobile-mb">
                  <label className="mobile-label">Location (Optional)</label>
                  <input
                    {...registerForm.register('location')}
                    type="text"
                    className="mobile-input esoteric-input"
                    placeholder="Your location"
                  />
                </div>

                <div className="mobile-mb">
                  <div className="mobile-checkbox">
                    <input
                      {...registerForm.register('agreeToTerms')}
                      type="checkbox"
                      id="agreeToTerms"
                      className="mobile-checkbox-input"
                    />
                    <label htmlFor="agreeToTerms" className="mobile-checkbox-label">
                      I agree to the Terms of Service
                    </label>
                  </div>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className="mobile-error">
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                </div>

                <div className="mobile-mb">
                  <div className="mobile-checkbox">
                    <input
                      {...registerForm.register('agreeToPrivacy')}
                      type="checkbox"
                      id="agreeToPrivacy"
                      className="mobile-checkbox-input"
                    />
                    <label htmlFor="agreeToPrivacy" className="mobile-checkbox-label">
                      I agree to the Privacy Policy
                    </label>
                  </div>
                  {registerForm.formState.errors.agreeToPrivacy && (
                    <p className="mobile-error">
                      {registerForm.formState.errors.agreeToPrivacy.message}
                    </p>
                  )}
                </div>

                {registerForm.formState.errors.root && (
                  <div className="mobile-error-box mobile-mb">
                    {registerForm.formState.errors.root.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="mobile-btn mobile-btn-primary mobile-btn-block esoteric-btn esoteric-btn-primary"
                >
                  {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileAuthModal;