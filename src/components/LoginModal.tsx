import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as st from './loginModal.css.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ emailOrUsername: email, password });
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login:', provider);
  };

  const handleBiometricLogin = (type: 'fingerprint' | 'faceid') => {
    console.log('Biometric login:', type);
  };

  if (!isOpen) return null;

  return (
    <div className={st.overlay} onClick={onClose}>
      <div className={st.modal} onClick={(e) => e.stopPropagation()}>
        <button className={st.close} onClick={onClose} aria-label="Close login">×</button>
        <div className={st.header}>
          <h2>Welcome to KONIVRER</h2>
          <p>Sign in to your account</p>
        </div>
        <form className={st.form} onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ padding: '0.5rem', marginBottom: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
              {error}
            </div>
          )}
          <div className={st.inputGroup}>
            <label htmlFor="email">Username or Email</label>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your username or email" required disabled={isLoading} />
          </div>
          <div className={st.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={st.passwordInput}>
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required disabled={isLoading} />
              <button type="button" className={st.passwordToggle} onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className={st.loginBtn} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className={st.divider}>
          <span className={st.dividerSpan}>or continue with</span>
        </div>
        <div className={st.socialSection}>
          <button className={st.socialBtn} onClick={() => handleSocialLogin('google')}>Continue with Google</button>
          <button className={st.socialBtn} onClick={() => handleSocialLogin('github')}>Continue with GitHub</button>
          <button className={st.socialBtn} onClick={() => handleSocialLogin('microsoft')}>Continue with Microsoft</button>
          <button className={st.socialBtn} onClick={() => handleSocialLogin('discord')}>Continue with Discord</button>
        </div>
        <div className={st.biometricSection}>
          <h3>Quick Login</h3>
          <div className={st.biometricButtons}>
            <button className={st.biometricBtn} onClick={() => handleBiometricLogin('fingerprint')}>Fingerprint Login</button>
            <button className={st.biometricBtn} onClick={() => handleBiometricLogin('faceid')}>Face ID Login</button>
          </div>
          <div className={st.biometricTip}>
            <p><strong>Biometric Authentication Tip:</strong></p>
            <p>Enable biometric login for faster and more secure access to your KONIVRER account. Your biometric data is stored locally on your device and never transmitted to our servers.</p>
          </div>
        </div>
        <div className={st.footer}>
          <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); console.log('Register clicked'); }}>Sign up</a></p>
          <p><a href="#" onClick={(e) => { e.preventDefault(); console.log('Forgot password clicked'); }}>Forgot your password?</a></p>
        </div>
      </div>
    </div>
  );
};