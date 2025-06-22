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