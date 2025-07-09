import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SSOProvider } from '../services/ssoService';

interface SSOButtonProps {
  provider: SSOProvider;
  onLogin: (providerId: string) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

const SSOButton: React.FC<SSOButtonProps> = ({ 
  provider, 
  onLogin, 
  disabled = false, 
  loading = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading || loading) return;

    setIsLoading(true);
    try {
      await onLogin(provider.id);
    } catch (error) {
      console.error(`SSO login failed for ${provider.name}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = disabled || isLoading || loading;

  return (
    <motion.button
      whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
      whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={isButtonDisabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        backgroundColor: provider.bgColor,
        color: provider.color,
        border: provider.bgColor === '#fff' ? '1px solid #ddd' : 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
        opacity: isButtonDisabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      data-testid={`sso-button-${provider.id}`}
      aria-label={`Sign in with ${provider.name}`}
    >
      {/* Provider Icon */}
      <div style={{ 
        width: '20px', 
        height: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {(isLoading || loading) ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '16px',
              height: '16px',
              border: `2px solid ${provider.color}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%'
            }}
          />
        ) : (
          <img 
            src={provider.iconUrl} 
            alt={`${provider.name} icon`}
            style={{ 
              width: '20px', 
              height: '20px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.textContent = provider.name.charAt(0);
            }}
          />
        )}
        <span style={{ 
          display: 'none', 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: provider.color
        }} />
      </div>

      {/* Button Text */}
      <span style={{ flex: 1, textAlign: 'left' }}>
        {isLoading || loading ? 'Connecting...' : `Continue with ${provider.name}`}
      </span>

      {/* Loading Overlay */}
      {(isLoading || loading) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: provider.color === '#fff' ? '#000' : '#fff',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.button>
  );
};

// SSO Button Group Component
interface SSOButtonGroupProps {
  providers: SSOProvider[];
  onLogin: (providerId: string) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  maxVisible?: number;
}

export const SSOButtonGroup: React.FC<SSOButtonGroupProps> = ({ 
  providers, 
  onLogin, 
  disabled = false, 
  loading = false,
  maxVisible = 5
}) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleProviders = showAll ? providers : providers.slice(0, maxVisible);
  const hasMore = providers.length > maxVisible;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {visibleProviders.map((provider) => (
        <SSOButton
          key={provider.id}
          provider={provider}
          onLogin={onLogin}
          disabled={disabled}
          loading={loading}
        />
      ))}
      
      {hasMore && !showAll && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAll(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px dashed #ddd',
            borderRadius: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          data-testid="show-more-sso-providers"
        >
          Show {providers.length - maxVisible} more options
        </motion.button>
      )}
    </div>
  );
};

// Popular SSO Providers Component
export const PopularSSOProviders: React.FC<{
  onLogin: (providerId: string) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}> = ({ onLogin, disabled, loading }) => {
  // Most popular providers in order
  const popularProviders: SSOProvider[] = [
    {
      id: 'google',
      name: 'Google',
      clientId: '',
      redirectUri: '',
      scope: [],
      authUrl: '',
      tokenUrl: '',
      userInfoUrl: '',
      iconUrl: 'https://developers.google.com/identity/images/g-logo.png',
      color: '#DB4437',
      bgColor: '#fff'
    },
    {
      id: 'github',
      name: 'GitHub',
      clientId: '',
      redirectUri: '',
      scope: [],
      authUrl: '',
      tokenUrl: '',
      userInfoUrl: '',
      iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      color: '#fff',
      bgColor: '#333'
    },
    {
      id: 'discord',
      name: 'Discord',
      clientId: '',
      redirectUri: '',
      scope: [],
      authUrl: '',
      tokenUrl: '',
      userInfoUrl: '',
      iconUrl: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
      color: '#fff',
      bgColor: '#7289DA'
    }
  ];

  return (
    <SSOButtonGroup
      providers={popularProviders}
      onLogin={onLogin}
      disabled={disabled}
      loading={loading}
      maxVisible={3}
    />
  );
};

export default SSOButton;