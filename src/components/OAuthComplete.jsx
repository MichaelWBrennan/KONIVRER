import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component to handle OAuth completion for redirect flow
 * This component is rendered after OAuth callback processes the authentication
 */
const OAuthComplete = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginWithOAuthUser } = useAuth();

  useEffect(() => {
    const completeOAuthLogin = async () => {
      try {
        // Get stored OAuth user data
        const oauthUserData = localStorage.getItem('oauth_user');
        
        if (!oauthUserData) {
          setStatus('error');
          setError('No authentication data found');
          return;
        }

        const userData = JSON.parse(oauthUserData);
        
        // Complete login with the OAuth user data
        const result = await loginWithOAuthUser(userData);
        
        if (result.success) {
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
      } catch (error) {
        console.error('OAuth completion error:', error);
        setStatus('error');
        setError(error.message || 'Failed to complete authentication');
      }
    };

    completeOAuthLogin();
  }, [navigate, loginWithOAuthUser]);

  if (status === 'processing') {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-auth-processing">
          <div className="mobile-spinner esoteric-spinner"></div>
          <h2 className="esoteric-text-accent">Completing Authentication...</h2>
          <p className="esoteric-text-muted">Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mobile-container esoteric-bg-dark">
        <div className="mobile-auth-error">
          <div className="esoteric-error-icon">!</div>
          <h2 className="esoteric-text-error">Authentication Failed</h2>
          <p className="esoteric-text-muted">{error}</p>
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="mobile-btn esoteric-btn"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container esoteric-bg-dark">
      <div className="mobile-auth-success">
        <div className="esoteric-success-icon">✓</div>
        <h2 className="esoteric-text-success">Authentication Successful</h2>
        <p className="esoteric-text-muted">You have successfully authenticated</p>
        <p className="esoteric-text-muted">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default OAuthComplete;