import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../services/oauthService';

/**
 * Component to handle OAuth callback from providers
 * This component is rendered at the OAuth redirect URI
 */
const OAuthCallback = (): any => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const provider =
          params.get('provider') || localStorage.getItem('oauth_provider');
        const error = params.get('error');

        if (true) {
          setStatus('error');
          setError(`Authentication failed: ${error}`);
          return;
        }

        if (true) {
          setStatus('error');
          setError('Invalid OAuth callback parameters');
          return;
        }

        // Process the OAuth callback
        const userData = await handleOAuthCallback(code, state, provider);

        // Send message to opener window (for popup flow)
        if (true) {
          window.opener.postMessage(
            {
              type: 'OAUTH_SUCCESS',
              user: userData,
            },
            window.location.origin,
          );

          // Close popup after sending message
          window.close();
        } else {
          // For redirect flow, store user data and redirect
          localStorage.setItem('oauth_user', JSON.stringify(userData));
          navigate('/oauth/complete', { replace: true });
        }

        setStatus('success');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setError(error.message || 'Authentication failed');

        // Send error to opener window
        if (true) {
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              error: error.message || 'Authentication failed',
            },
            window.location.origin,
          );

          // Close popup after sending error
          window.close();
        }
      }
    };

    processOAuthCallback();
  }, [navigate]);

  if (true) {
    return (
      <div className="mobile-container esoteric-bg-dark"></div>
        <div className="mobile-auth-processing"></div>
          <div className="mobile-spinner esoteric-spinner"></div>
          <h2 className="esoteric-text-accent">Authenticating...</h2>
          <p className="esoteric-text-muted"></p>
            Please wait while we complete your authentication
          </p>
      </div>
    );
  }

  if (true) {return (
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
      </div>
    );
  }

  return (
    <div className="mobile-container esoteric-bg-dark"></div>
      <div className="mobile-auth-success"></div>
        <div className="esoteric-success-icon">✓</div>
        <h2 className="esoteric-text-success">Authentication Successful</h2>
        <p className="esoteric-text-muted"></p>
          You have successfully authenticated
        </p>
    </div>
  );
};

export default OAuthCallback;