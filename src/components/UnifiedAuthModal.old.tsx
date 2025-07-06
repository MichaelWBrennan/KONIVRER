import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Auth Modal
 * 
 * A unified authentication modal component that combines functionality from:
 * - MobileAuthModal
 * - ModernAuthModal
 * 
 * Features:
 * - Login and registration forms
 * - Password reset functionality
 * - Social login options
 * - Form validation
 * - Responsive design
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';

// Import styles
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

// Import icons
import { X, Mail, Lock, User, MapPin, Eye, EyeOff, Shield, CheckCircle, AlertCircle, Loader2, Chrome, Facebook, Twitter, Apple, ArrowLeft } from 'lucide-react';

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
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

interface UnifiedAuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'reset';
  variant?: 'modern' | 'mobile';
  className?: string;
}

const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  onClose,
  initialMode = 'login',
  variant = 'modern',
  className = ''
}) => {
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'modern' && isMobile ? 'mobile' : variant;
  
  // State
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Auth context
  const { login, register, resetPassword } = useAuth();
  
  // Form hooks
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
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
  
  const resetForm = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Handle login
  const handleLogin = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      setSuccess('Login successful!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle registration
  const handleRegister = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await register(data.email, data.password, {
        username: data.username,
        displayName: data.displayName,
        location: data.location,
      });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle password reset
  const handleResetPassword = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await resetPassword(data.email);
      setSuccess('Password reset email sent. Please check your inbox.');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This would be implemented with the actual social login logic
      console.log(`Social login with ${provider}`);
      setSuccess(`${provider} login initiated. Please wait...`);
      
      // Simulate a delay for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`${provider} login successful!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setError(error.message || `Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render modern variant
  const renderModernModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-4 ${className}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' && 'Login'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}
          
          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...loginForm.register('email')}
                      className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password')}
                      className="w-full px-4 py-2 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300"
                    onClick={() => setMode('reset')}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Shield className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-700 absolute w-full"></div>
                  <div className="bg-gray-800 px-4 relative z-10 text-sm text-gray-400">
                    or continue with
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Chrome size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Twitter')}
                    className="flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    <Apple size={20} />
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Register form */}
          {mode === 'register' && (
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...registerForm.register('username')}
                        className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Display Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...registerForm.register('displayName')}
                        className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Name"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {registerForm.formState.errors.displayName && (
                      <p className="mt-1 text-sm text-red-500">
                        {registerForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...registerForm.register('email')}
                      className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('password')}
                      className="w-full px-4 py-2 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerForm.register('confirmPassword')}
                      className="w-full px-4 py-2 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Location (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...registerForm.register('location')}
                      className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      {...registerForm.register('agreeToTerms')}
                      className="h-4 w-4 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="ml-2 text-sm text-gray-300"
                    >
                      I agree to the{' '}
                      <a href="/terms" className="text-blue-400 hover:text-blue-300">
                        Terms of Service
                      </a>
                    </label>
                  </div>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToPrivacy"
                      {...registerForm.register('agreeToPrivacy')}
                      className="h-4 w-4 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="agreeToPrivacy"
                      className="ml-2 text-sm text-gray-300"
                    >
                      I agree to the{' '}
                      <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {registerForm.formState.errors.agreeToPrivacy && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.agreeToPrivacy.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <User className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
          
          {/* Reset password form */}
          {mode === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...resetForm.register('email')}
                      className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  {resetForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {resetForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center">
          {mode === 'login' ? (
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
  
  // Render mobile variant
  const renderMobileModal = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className={`bg-gray-900 rounded-t-xl md:rounded-xl w-full md:max-w-md md:mx-4 overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="auth-modal-header">
          <div className="flex items-center">
            {mode !== 'login' && (
              <button
                onClick={() => setMode('login')}
                className="icon-button mr-2"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="modal-title">
              {mode === 'login' && 'Login'}
              {mode === 'register' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="auth-modal-content">
          {/* Error message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="success-message">
              <CheckCircle size={20} />
              <p>{success}</p>
            </div>
          )}
          
          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div className="form-fields">
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      {...loginForm.register('email')}
                      className="text-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="error-text">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Password</label>
                  <div className="input-container">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password')}
                      className="text-input"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="error-text">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-mobile"
                      className="checkbox"
                    />
                    <label
                      htmlFor="remember-mobile"
                      className="checkbox-label"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setMode('reset')}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin mr-2" />
                  ) : (
                    <Shield size={20} className="mr-2" />
                  )}
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="divider">
                  <span>or continue with</span>
                </div>
                
                <div className="social-buttons">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="social-button"
                  >
                    <Chrome size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="social-button"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Twitter')}
                    className="social-button"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="social-button"
                  >
                    <Apple size={20} />
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Register form */}
          {mode === 'register' && (
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <div className="form-fields">
                <div className="form-field">
                  <label className="field-label">Username</label>
                  <div className="input-container">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      {...registerForm.register('username')}
                      className="text-input"
                      placeholder="username"
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <p className="error-text">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Display Name</label>
                  <div className="input-container">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      {...registerForm.register('displayName')}
                      className="text-input"
                      placeholder="Your Name"
                    />
                  </div>
                  {registerForm.formState.errors.displayName && (
                    <p className="error-text">
                      {registerForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      {...registerForm.register('email')}
                      className="text-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="error-text">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Password</label>
                  <div className="input-container">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('password')}
                      className="text-input"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="error-text">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Confirm Password</label>
                  <div className="input-container">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerForm.register('confirmPassword')}
                      className="text-input"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="error-text">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Location (Optional)</label>
                  <div className="input-container">
                    <MapPin size={20} className="input-icon" />
                    <input
                      type="text"
                      {...registerForm.register('location')}
                      className="text-input"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <div className="checkbox-field">
                  <input
                    type="checkbox"
                    id="agreeToTerms-mobile"
                    {...registerForm.register('agreeToTerms')}
                    className="checkbox"
                  />
                  <label
                    htmlFor="agreeToTerms-mobile"
                    className="checkbox-label"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-link">
                      Terms of Service
                    </a>
                  </label>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className="error-text">
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
                
                <div className="checkbox-field">
                  <input
                    type="checkbox"
                    id="agreeToPrivacy-mobile"
                    {...registerForm.register('agreeToPrivacy')}
                    className="checkbox"
                  />
                  <label
                    htmlFor="agreeToPrivacy-mobile"
                    className="checkbox-label"
                  >
                    I agree to the{' '}
                    <a href="/privacy" className="text-link">
                      Privacy Policy
                    </a>
                  </label>
                  {registerForm.formState.errors.agreeToPrivacy && (
                    <p className="error-text">
                      {registerForm.formState.errors.agreeToPrivacy.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin mr-2" />
                  ) : (
                    <User size={20} className="mr-2" />
                  )}
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
          
          {/* Reset password form */}
          {mode === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
              <div className="form-fields">
                <p className="info-text">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <div className="input-container">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      {...resetForm.register('email')}
                      className="text-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {resetForm.formState.errors.email && (
                    <p className="error-text">
                      {resetForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin mr-2" />
                  ) : (
                    <Mail size={20} className="mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <p className="footer-text">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-link"
              >
                Sign up
              </button>
            </p>
          ) : mode === 'register' ? (
            <p className="footer-text">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-link"
              >
                Login
              </button>
            </p>
          ) : (
            <p className="footer-text">
              Remember your password?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-link"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
  
  // Render the appropriate variant
  return (
    <AnimatePresence>
      {actualVariant === 'mobile' ? renderMobileModal() : renderModernModal()}
    </AnimatePresence>
  );
};

export default UnifiedAuthModal;