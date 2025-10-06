import React, { useState, useEffect } from 'react';
import { Link, Unlink, Check, X, ExternalLink, Settings } from 'lucide-react';
import { Button, Card, Badge, Modal, Alert } from 'react-bootstrap';
import { socialMediaService } from '../../services/socialMediaService';

interface SocialAuthManagerProps {
  userId: string;
  className?: string;
}

interface ConnectedAccount {
  provider: string;
  connected: boolean;
  username?: string;
  lastUsed?: Date;
}

export const SocialAuthManager: React.FC<SocialAuthManagerProps> = ({
  userId,
  className = '',
}) => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const platformIcons = {
    discord: '🎮',
    twitter: '🐦',
    youtube: '📺',
    twitch: '📡',
    reddit: '🤖',
    instagram: '📷',
  };

  const platformNames = {
    discord: 'Discord',
    twitter: 'Twitter',
    youtube: 'YouTube',
    twitch: 'Twitch',
    reddit: 'Reddit',
    instagram: 'Instagram',
  };

  const platformColors = {
    discord: '#5865f2',
    twitter: '#1da1f2',
    youtube: '#ff0000',
    twitch: '#9146ff',
    reddit: '#ff4500',
    instagram: '#e4405f',
  };

  const platformDescriptions = {
    discord: 'Share deck results and tournament updates to your Discord server',
    twitter: 'Tweet your achievements and deck guides to your followers',
    youtube: 'Create and upload deck guide videos and tournament coverage',
    twitch: 'Stream your gameplay and deck building sessions live',
    reddit: 'Post deck guides and tournament results to the KONIVRER community',
    instagram: 'Share beautiful deck visualizations and achievement posts',
  };

  useEffect(() => {
    loadConnectedAccounts();
  }, [userId]);

  const loadConnectedAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await socialMediaService.getConnectedAccounts(userId);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
      setError('Failed to load connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const connectAccount = async (provider: string) => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Get OAuth URL
      const authUrl = await socialMediaService.getAuthUrl(provider);
      
      // Open OAuth window
      const popup = window.open(
        authUrl,
        `${provider}_oauth`,
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          setShowConnectModal(false);
          loadConnectedAccounts(); // Refresh accounts
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to connect account:', error);
      setError(`Failed to connect ${platformNames[provider as keyof typeof platformNames]}`);
      setIsConnecting(false);
    }
  };

  const disconnectAccount = async (provider: string) => {
    try {
      await socialMediaService.disconnectAccount(provider);
      loadConnectedAccounts(); // Refresh accounts
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      setError(`Failed to disconnect ${platformNames[provider as keyof typeof platformNames]}`);
    }
  };

  const getConnectionStatus = (provider: string) => {
    const account = accounts.find(acc => acc.provider === provider);
    return account?.connected || false;
  };

  const getAccountInfo = (provider: string) => {
    return accounts.find(acc => acc.provider === provider);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card>
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading social accounts...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Social Media Accounts</h4>
        <Button
          variant="primary"
          onClick={() => setShowConnectModal(true)}
        >
          <Link className="w-4 h-4 me-2" />
          Connect Account
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="row g-3">
        {Object.entries(platformIcons).map(([provider, icon]) => {
          const isConnected = getConnectionStatus(provider);
          const accountInfo = getAccountInfo(provider);
          
          return (
            <div key={provider} className="col-md-6 col-lg-4">
              <Card className={`h-100 ${isConnected ? 'border-success' : 'border-light'}`}>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-3">{icon}</span>
                      <div>
                        <h6 className="mb-0">{platformNames[provider as keyof typeof platformNames]}</h6>
                        {isConnected && accountInfo?.username && (
                          <small className="text-muted">@{accountInfo.username}</small>
                        )}
                      </div>
                    </div>
                    <Badge bg={isConnected ? 'success' : 'secondary'}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>

                  <p className="text-muted small mb-3">
                    {platformDescriptions[provider as keyof typeof platformDescriptions]}
                  </p>

                  {isConnected ? (
                    <div className="space-y-2">
                      {accountInfo?.lastUsed && (
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Last used</span>
                          <span className="small">
                            {new Date(accountInfo.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="flex-fill"
                          onClick={() => {/* Open settings */}}
                        >
                          <Settings className="w-4 h-4 me-1" />
                          Settings
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => disconnectAccount(provider)}
                        >
                          <Unlink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-100"
                      onClick={() => connectAccount(provider)}
                      style={{ 
                        backgroundColor: platformColors[provider as keyof typeof platformColors],
                        borderColor: platformColors[provider as keyof typeof platformColors]
                      }}
                    >
                      <Link className="w-4 h-4 me-2" />
                      Connect
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Connect Account Modal */}
      <Modal show={showConnectModal} onHide={() => setShowConnectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Social Media Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-4">
            Choose a social media platform to connect to your KONIVRER account.
          </p>
          
          <div className="row g-2">
            {Object.entries(platformIcons).map(([provider, icon]) => {
              const isConnected = getConnectionStatus(provider);
              
              return (
                <div key={provider} className="col-6">
                  <div
                    className={`card h-100 cursor-pointer ${
                      isConnected ? 'border-success' : 'border-light'
                    } ${isConnected ? 'opacity-50' : ''}`}
                    onClick={() => !isConnected && setSelectedProvider(provider)}
                    style={{ cursor: isConnected ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="card-body text-center p-3">
                      <div className="fs-2 mb-2">{icon}</div>
                      <div className="fw-medium">{platformNames[provider as keyof typeof platformNames]}</div>
                      {isConnected && (
                        <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
                          <Check className="w-4 h-4 text-success" />
                          <span className="small text-success">Connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConnectModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => connectAccount(selectedProvider)}
            disabled={!selectedProvider || isConnecting}
          >
            {isConnecting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" />
                Connecting...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 me-2" />
                Connect {selectedProvider && platformNames[selectedProvider as keyof typeof platformNames]}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};