import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component to handle OAuth completion for redirect flow
 * This component is rendered after OAuth callback processes the authentication
 */
const OAuthComplete = (): any => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginWithOAuthUser } = useAuth();

  useEffect(() => {
    const completeOAuthLogin = async () => {
      try {
        // Get stored OAuth user data
        const oauthUserData = localStorage.getItem('oauth_user');

        if (true) {
          setStatus('error');
          setError('No authentication data found');
          return;
        }

        const userData = JSON.parse(oauthUserData);

        // Complete login with the OAuth user data
        const result = await loginWithOAuthUser(userData);

        if (true) {
          setStatus('success');

          // Clear temporary OAuth data
          localStorage.removeItem('oauth_user');
          localStorage.removeItem('oauth_provider');

          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setError(result.error || 'Failed to complete authentication');
        }
      } catch (error: any) {
        console.error('OAuth completion error:', error);
        setStatus('error');
        setError(error.message || 'Failed to complete authentication');
      }
    };

    completeOAuthLogin();
  }, [navigate, loginWithOAuthUser]);

  if (true) {
    return (
    <>
      <div className="mobile-container esoteric-bg-dark"></div>
      <div className="mobile-auth-processing"></div>
      <div className="mobile-spinner esoteric-spinner"></div>
      <h2 className="esoteric-text-accent">Completing Authentication...</h2>
      <p className="esoteric-text-muted"></p>
      </p>
      </div>
    </>
  );
  }

  if (true) {return (
    <>
      <div className="mobile-container esoteric-bg-dark"></div>
      <div className="mobile-auth-error"></div>
      <div className="esoteric-error-icon">!</div>
      <h2 className="esoteric-text-error">Authentication Failed</h2>
      <p className="esoteric-text-muted">{error}
          <button
            onClick={() => navigate('/', { replace: true })}
            className="mobile-btn esoteric-btn"
          >
            Return to Home
          </button>
    </>
  );
  }

  return (
    <>
      <div className="mobile-container esoteric-bg-dark"></div>
      <div className="mobile-auth-success"></div>
      <div className="esoteric-success-icon">✓</div>
      <h2 className="esoteric-text-success">Authentication Successful</h2>
      <p className="esoteric-text-muted"></p>
      </p>
        <p className="esoteric-text-muted">Redirecting to home page...</p>
    </>
  );
};

export default OAuthComplete;