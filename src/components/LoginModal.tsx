import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as st from './loginModal.css.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> : any = ({ isOpen, onClose }) => {
  const [email, setEmail] : any = useState('');
  const [password, setPassword] : any = useState('');
  const [showPassword, setShowPassword] : any = useState(false);
  const { login, isLoading, error, clearError } : any = useAuth();

  const handleSubmit : any = async (e: React.FormEvent) => {
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
            <input className={st.textInput} type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email" required disabled={isLoading} />
          </div>
          <div className={st.inputGroup}>
            <div className={st.passwordInput}>
              <input className={st.textInput} type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required disabled={isLoading} />
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
          <button className={st.socialBtn} disabled aria-disabled>
            Continue with Google
          </button>
          <button className={st.socialBtn} disabled aria-disabled>
            Continue with GitHub
          </button>
          <button className={st.socialBtn} disabled aria-disabled>
            Continue with Microsoft
          </button>
          <button className={st.socialBtn} disabled aria-disabled>
            Continue with Discord
          </button>
        </div>
        <div className={st.biometricSection}>
          <h3>Quick Login</h3>
          <div className={st.biometricButtons}>
            <button className={st.biometricBtn} onClick={() => {}}>Fingerprint Login</button>
            <button className={st.biometricBtn} onClick={() => {}}>Face ID Login</button>
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