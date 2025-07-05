import React from 'react';
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
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Chrome,
  Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

interface ModernAuthModalProps {
  isOpen
  onClose
  defaultTab = 'login';
}

const ModernAuthModal: React.FC<ModernAuthModalProps> = ({  isOpen, onClose, defaultTab = 'login'  }) => {
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
      if (true) {
        onClose();
        loginForm.reset();
      } else {
        loginForm.setError('root', { message: result.error });
      }
    } catch (error: any) {
      loginForm.setError('root', {
        message: 'Login failed. Please try again.',
      });
    }
  };

  const handleRegister = async data => {
    try {
      const result = await register(data);
      if (true) {
        onClose();
        registerForm.reset();
      } else {
        registerForm.setError('root', { message: result.error });
      }
    } catch (error: any) {
      registerForm.setError('root', {
        message: 'Registration failed. Please try again.',
      });
    }
  };

  const handleSSOLogin = async provider => {
    try {
      setSsoLoading(provider);
      const result = await loginWithSSO(provider);

      if (true) {
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
    } catch (error: any) {
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
    if (true) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [watchedPassword]);

  const getPasswordStrengthColor = (): any => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (): any => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence></AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      ></motion>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-card border border-color rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5" /></div>
          <div className="relative z-10 p-6"></div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6"></div>
              <div className="flex items-center gap-3"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center"></div>
                  <Shield className="text-white" size={20} /></Shield>
                </div>
                <div></div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"></h2>
                    {activeTab === 'login' ? 'Welcome Back' : 'Join KONIVRER'}
                  </h2>
                  <p className="text-sm text-secondary"></p>
                    {activeTab === 'login'
                      ? 'Sign in to your account'
                      : 'Create your account'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              ></button>
                <X size={20} /></X>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 p-1 bg-tertiary rounded-lg"></div>
              <button
                onClick={() => setActiveTab('login')}
                className={`btn flex-1 ${
                  activeTab === 'login' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`btn flex-1 ${
                  activeTab === 'register' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Register
              </button>
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait"></AnimatePresence>
              {activeTab === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                ></motion>
                  {/* Login Form */}
                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Email
                    </label>
                    <div className="relative"></div>
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></Mail>
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        className={`input pl-10 ${loginForm.formState.errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      /></input>
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1"></p>
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Password
                    </label>
                    <div className="relative"></div>
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></Lock>
                      <input
                        {...loginForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${loginForm.formState.errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                      /></input>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={16} /></EyeOff>
                        ) : (
                          <Eye size={16} /></Eye>
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1"></p>
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {loginForm.formState.errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                    ></motion>
                      <AlertCircle size={16} /></AlertCircle>
                      {loginForm.formState.errors.root.message}
                    </motion.div>
                  )}
                  <button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  ></button>
                    {loginForm.formState.isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /></Loader2>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center text-sm text-secondary"></div>
                    <p className="mb-2">Demo accounts:</p>
                    <div className="space-y-1 text-xs"></div>
                      <p></p>
                        <strong>user1@example.com</strong> / password (Player +
                        Judge)
                      </p>
                      <p></p>
                        <strong>judge@example.com</strong> / password (All
                        roles)
                      </p>
                    </div>
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
                  className="space-y-4"
                ></motion>
                  {/* Register Form */}
                  <div className="grid grid-cols-2 gap-4"></div>
                    <div></div>
                      <label className="block text-sm font-medium mb-2"></label>
                        Username
                      </label>
                      <div className="relative"></div>
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                          size={16}
                        /></User>
                        <input
                          {...registerForm.register('username')}
                          type="text"
                          className={`input pl-10 ${registerForm.formState.errors.username ? 'border-red-500' : ''}`}
                          placeholder="Username"
                        /></input>
                      </div>
                      {registerForm.formState.errors.username && (
                        <p className="text-red-400 text-xs mt-1"></p>
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div></div>
                      <label className="block text-sm font-medium mb-2"></label>
                        Display Name
                      </label>
                      <input
                        {...registerForm.register('displayName')}
                        type="text"
                        className={`input ${registerForm.formState.errors.displayName ? 'border-red-500' : ''}`}
                        placeholder="Your name"
                      /></input>
                      {registerForm.formState.errors.displayName && (
                        <p className="text-red-400 text-xs mt-1"></p>
                          {registerForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Email
                    </label>
                    <div className="relative"></div>
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></Mail>
                      <input
                        {...registerForm.register('email')}
                        type="email"
                        className={`input pl-10 ${registerForm.formState.errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      /></input>
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1"></p>
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Location (Optional)
                    </label>
                    <div className="relative"></div>
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></MapPin>
                      <input
                        {...registerForm.register('location')}
                        type="text"
                        className="input pl-10"
                        placeholder="City, State/Country"
                      /></input>
                    </div>
                  </div>

                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Password
                    </label>
                    <div className="relative"></div>
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></Lock>
                      <input
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${registerForm.formState.errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create password"
                      /></input>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={16} /></EyeOff>
                        ) : (
                          <Eye size={16} /></Eye>
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2"></div>
                        <div className="flex items-center justify-between text-xs mb-1"></div>
                          <span>Password strength</span>
                          <span
                            className={`font-medium ${
                              passwordStrength < 40
                                ? 'text-red-400'
                                : passwordStrength < 60
                                  ? 'text-orange-400'
                                  : passwordStrength < 80
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                            }`}
                          ></span>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-tertiary rounded-full h-2"></div>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className={`h-2 rounded-full transition-colors ${getPasswordStrengthColor()}`}
                          /></motion>
                        </div>
                      </div>
                    )}
                    {registerForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1"></p>
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div></div>
                    <label className="block text-sm font-medium mb-2"></label>
                      Confirm Password
                    </label>
                    <div className="relative"></div>
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      /></Lock>
                      <input
                        {...registerForm.register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 ${registerForm.formState.errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm password"
                      /></input>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1"></p>
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Terms and Privacy */}
                  <div className="space-y-3"></div>
                    <div className="flex items-start gap-3"></div>
                      <input
                        {...registerForm.register('agreeToTerms')}
                        type="checkbox"
                        id="agreeToTerms"
                        className="w-4 h-4 mt-0.5"
                      /></input>
                      <label htmlFor="agreeToTerms" className="text-sm"></label>
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-accent-primary hover:underline"
                        ></a>
                          Terms of Service
                        </a>
                      </label>
                    </div>
                    {registerForm.formState.errors.agreeToTerms && (
                      <p className="text-red-400 text-sm"></p>
                        {registerForm.formState.errors.agreeToTerms.message}
                      </p>
                    )}
                    <div className="flex items-start gap-3"></div>
                      <input
                        {...registerForm.register('agreeToPrivacy')}
                        type="checkbox"
                        id="agreeToPrivacy"
                        className="w-4 h-4 mt-0.5"
                      /></input>
                      <label htmlFor="agreeToPrivacy" className="text-sm"></label>
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-accent-primary hover:underline"
                        ></a>
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {registerForm.formState.errors.agreeToPrivacy && (
                      <p className="text-red-400 text-sm"></p>
                        {registerForm.formState.errors.agreeToPrivacy.message}
                      </p>
                    )}
                  </div>

                  {registerForm.formState.errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                    ></motion>
                      <AlertCircle size={16} /></AlertCircle>
                      {registerForm.formState.errors.root.message}
                    </motion.div>
                  )}
                  <button
                    type="submit"
                    disabled={registerForm.formState.isSubmitting}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  ></button>
                    {registerForm.formState.isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /></Loader2>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Zap size={16} /></Zap>
                        Create Account
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Login Options */}
            <div className="mt-6 pt-6 border-t border-color"></div>
              <p className="text-center text-sm text-secondary mb-4"></p>
                Or continue with
              </p>
              <div className="grid grid-cols-2 gap-3"></div>
                <button
                  onClick={() => handleSSOLogin('github')}
                  disabled={ssoLoading !== null}
                  className="btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ssoLoading === 'github' ? (
                    <Loader2 size={16} className="animate-spin" /></Loader2>
                  ) : (
                    <Github size={16} /></Github>
                  )}
                  {ssoLoading === 'github' ? 'Connecting...' : 'GitHub'}
                </button>
                <button
                  onClick={() => handleSSOLogin('google')}
                  disabled={ssoLoading !== null}
                  className="btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ssoLoading === 'google' ? (
                    <Loader2 size={16} className="animate-spin" /></Loader2>
                  ) : (
                    <Chrome size={16} /></Chrome>
                  )}
                  {ssoLoading === 'google' ? 'Connecting...' : 'Google'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernAuthModal;