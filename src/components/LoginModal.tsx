import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as st from "./loginModal.css.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ emailOrUsername: email, password });
      onClose();
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={st.overlay} onClick={onClose}>
      <div className={st.modal} onClick={(e) => e.stopPropagation()}>
        <button className={st.close} onClick={onClose} aria-label="Close login">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className={st.header}>
          <h1 className={st.title}>Welcome back</h1>
          <p className={st.subtitle}>Sign in to your account to continue</p>
        </div>

        <form className={st.form} onSubmit={handleSubmit}>
          {error && (
            <div className={st.errorMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          <div className={st.inputGroup}>
            <label htmlFor="email" className={st.label}>Email or username</label>
            <input
              className={st.input}
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or username"
              required
              disabled={isLoading}
            />
          </div>

          <div className={st.inputGroup}>
            <label htmlFor="password" className={st.label}>Password</label>
            <div className={st.passwordWrapper}>
              <input
                className={st.input}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className={st.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={st.options}>
            <label className={st.checkboxWrapper}>
              <input type="checkbox" className={st.checkbox} />
              <span className={st.checkboxLabel}>Remember me</span>
            </label>
            <a href="#" className={st.forgotLink} onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={st.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className={st.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className={st.divider}>
          <span className={st.dividerText}>or continue with</span>
        </div>

        <div className={st.socialSection}>
          <button className={st.socialBtn} disabled aria-disabled>
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google" 
              className={st.socialIcon}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'block';
                  fallback.textContent = 'G';
                }
              }}
            />
            <span className={st.socialFallback}>G</span>
            Google
          </button>
          <button className={st.socialBtn} disabled aria-disabled>
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub" 
              className={st.socialIcon}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'block';
                  fallback.textContent = '⚡';
                }
              }}
            />
            <span className={st.socialFallback}>⚡</span>
            GitHub
          </button>
        </div>

        <div className={st.footer}>
          <p className={st.footerText}>
            Don't have an account?{" "}
            <a href="#" className={st.signupLink} onClick={(e) => e.preventDefault()}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
