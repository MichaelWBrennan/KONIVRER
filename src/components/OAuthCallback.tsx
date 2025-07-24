import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SSOService } from '../services/ssoService';

// OAuth Callback Component
const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [provider, setProvider] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth error
        if (error) {
          setStatus('error');
          setMessage(errorDescription || `Authentication failed: ${error}`);
          
          // Dispatch error event
          window.dispatchEvent(new CustomEvent('sso-login-error', {
            detail: { error: errorDescription || error, provider: 'unknown' }
          }));
          
          // Redirect back to main page after delay
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus('error');
          setMessage('Invalid authentication response. Missing required parameters.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Parse state to get provider
        let providerId: string;
        try {
          const stateData = JSON.parse(atob(state));
          providerId = stateData.provider;
          setProvider(providerId);
        } catch {
          setStatus('error');
          setMessage('Invalid authentication state. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Get SSO service instance
        const ssoService = SSOService.getInstance();

        // Handle the OAuth callback
        setMessage(`Completing ${providerId} authentication...`);
        const profile = await ssoService.handleCallback(code, state, providerId);

        // Success
        setStatus('success');
        setMessage(`Successfully authenticated with ${profile.provider}!`);

        // Redirect back to main page
        setTimeout(() => navigate('/'), 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        
        // Dispatch error event
        window.dispatchEvent(new CustomEvent('sso-login-error', {
          detail: { error: String(error), provider }
        }));
        
        // Redirect back to main page after delay
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, provider]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          width: '90%'
        }}
      >
        {/* Status Icon */}
        <motion.div
          animate={status === 'loading' ? { rotate: 360 } : {}}
          transition={status === 'loading' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
          style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}
        >
          {status === 'loading' && '⏳'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </motion.div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>

        {/* Message */}
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          opacity: 0.9,
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* Provider Info */}
        {provider && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              Provider: {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </span>
          </div>
        )}

        {/* Loading Progress */}
        {status === 'loading' && (
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                borderRadius: '2px'
              }}
            />
          </div>
        )}

        {/* Redirect Notice */}
        {status !== 'loading' && (
          <p style={{
            fontSize: '12px',
            opacity: 0.7,
            margin: '16px 0 0 0'
          }}>
            Redirecting to main page...
          </p>
        )}
      </motion.div>

      {/* Background Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden'
      }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OAuthCallback;