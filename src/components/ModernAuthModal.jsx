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

const ModernAuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-card border border-color rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5" />

          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                    {activeTab === 'login' ? 'Welcome Back' : 'Join KONIVRER'}
                  </h2>
                  <p className="text-sm text-secondary">
                    {activeTab === 'login'
                      ? 'Sign in to your account'
                      : 'Create your account'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 p-1 bg-tertiary rounded-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`btn flex-1 ${
                  activeTab === 'login'
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`btn flex-1 ${
                  activeTab === 'register'
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
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
                  className="space-y-4"
                >
                  {/* Login Form */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        className={`input pl-10 ${loginForm.formState.errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...loginForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${loginForm.formState.errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {loginForm.formState.errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      {loginForm.formState.errors.root.message}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loginForm.formState.isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center text-sm text-secondary">
                    <p className="mb-2">Demo accounts:</p>
                    <div className="space-y-1 text-xs">
                      <p>
                        <strong>user1@example.com</strong> / password (Player +
                        Judge)
                      </p>
                      <p>
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
                >
                  {/* Register Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                          size={16}
                        />
                        <input
                          {...registerForm.register('username')}
                          type="text"
                          className={`input pl-10 ${registerForm.formState.errors.username ? 'border-red-500' : ''}`}
                          placeholder="Username"
                        />
                      </div>
                      {registerForm.formState.errors.username && (
                        <p className="text-red-400 text-xs mt-1">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Display Name
                      </label>
                      <input
                        {...registerForm.register('displayName')}
                        type="text"
                        className={`input ${registerForm.formState.errors.displayName ? 'border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {registerForm.formState.errors.displayName && (
                        <p className="text-red-400 text-xs mt-1">
                          {registerForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...registerForm.register('email')}
                        type="email"
                        className={`input pl-10 ${registerForm.formState.errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...registerForm.register('location')}
                        type="text"
                        className="input pl-10"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 pr-10 ${registerForm.formState.errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
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
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-tertiary rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            className={`h-2 rounded-full transition-colors ${getPasswordStrengthColor()}`}
                          />
                        </div>
                      </div>
                    )}

                    {registerForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                        size={16}
                      />
                      <input
                        {...registerForm.register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className={`input pl-10 ${registerForm.formState.errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm password"
                      />
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Terms and Privacy */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        {...registerForm.register('agreeToTerms')}
                        type="checkbox"
                        id="agreeToTerms"
                        className="w-4 h-4 mt-0.5"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-accent-primary hover:underline"
                        >
                          Terms of Service
                        </a>
                      </label>
                    </div>
                    {registerForm.formState.errors.agreeToTerms && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.agreeToTerms.message}
                      </p>
                    )}

                    <div className="flex items-start gap-3">
                      <input
                        {...registerForm.register('agreeToPrivacy')}
                        type="checkbox"
                        id="agreeToPrivacy"
                        className="w-4 h-4 mt-0.5"
                      />
                      <label htmlFor="agreeToPrivacy" className="text-sm">
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-accent-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {registerForm.formState.errors.agreeToPrivacy && (
                      <p className="text-red-400 text-sm">
                        {registerForm.formState.errors.agreeToPrivacy.message}
                      </p>
                    )}
                  </div>

                  {registerForm.formState.errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      {registerForm.formState.errors.root.message}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={registerForm.formState.isSubmitting}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {registerForm.formState.isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Create Account
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social Login Options */}
            <div className="mt-6 pt-6 border-t border-color">
              <p className="text-center text-sm text-secondary mb-4">
                Or continue with
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSSOLogin('github')}
                  disabled={ssoLoading !== null}
                  className="btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ssoLoading === 'github' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Github size={16} />
                  )}
                  {ssoLoading === 'github' ? 'Connecting...' : 'GitHub'}
                </button>
                <button
                  onClick={() => handleSSOLogin('google')}
                  disabled={ssoLoading !== null}
                  className="btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ssoLoading === 'google' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Chrome size={16} />
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
