import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password });
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login logic
    console.log('Social login:', provider);
  };

  const handleBiometricLogin = (type: 'fingerprint' | 'faceid') => {
    // TODO: Implement biometric login logic
    console.log('Biometric login:', type);
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="login-modal-header">
          <h2>Welcome to KONIVRER</h2>
          <p>Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Username or Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn primary">
            Login
          </button>
        </form>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <div className="social-login-section">
          <button 
            className="social-login-btn google"
            onClick={() => handleSocialLogin('google')}
          >
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          
          <button 
            className="social-login-btn github"
            onClick={() => handleSocialLogin('github')}
          >
            <span className="social-icon">🐙</span>
            Continue with GitHub
          </button>
          
          <button 
            className="social-login-btn microsoft"
            onClick={() => handleSocialLogin('microsoft')}
          >
            <span className="social-icon">🪟</span>
            Continue with Microsoft
          </button>
          
          <button 
            className="social-login-btn discord"
            onClick={() => handleSocialLogin('discord')}
          >
            <span className="social-icon">🎮</span>
            Continue with Discord
          </button>
        </div>

        <div className="biometric-login-section">
          <h3>Quick Login</h3>
          <div className="biometric-buttons">
            <button 
              className="biometric-btn fingerprint"
              onClick={() => handleBiometricLogin('fingerprint')}
            >
              <span className="biometric-icon">👆</span>
              Fingerprint Login
            </button>
            
            <button 
              className="biometric-btn faceid"
              onClick={() => handleBiometricLogin('faceid')}
            >
              <span className="biometric-icon">🧑‍💻</span>
              Face ID Login
            </button>
          </div>
          
          <div className="biometric-tip">
            <p>💡 <strong>Biometric Authentication Tip:</strong></p>
            <p>Enable biometric login for faster and more secure access to your KONIVRER account. Your biometric data is stored locally on your device and never transmitted to our servers.</p>
          </div>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); console.log('Register clicked'); }}>Sign up</a></p>
          <p><a href="#" onClick={(e) => { e.preventDefault(); console.log('Forgot password clicked'); }}>Forgot your password?</a></p>
        </div>
      </div>
    </div>
  );
};