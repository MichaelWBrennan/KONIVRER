import React, { useState } from 'react';
import { Share2, Check, X, Clock, Loader2 } from 'lucide-react';
import { Button } from 'react-bootstrap';
import { socialMediaService } from '../../services/socialMediaService';

interface SocialShareButtonProps {
  content: {
    type: 'deck' | 'tournament' | 'achievement' | 'match_result';
    data: any;
  };
  platforms?: ('discord' | 'twitter' | 'youtube' | 'twitch' | 'reddit' | 'instagram')[];
  message?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  content,
  platforms = ['discord', 'twitter', 'reddit'],
  message,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareResults, setShareResults] = useState<Record<string, { success: boolean; url?: string; error?: string }>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(platforms);
  const [customMessage, setCustomMessage] = useState(message || '');

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

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) return;

    setIsSharing(true);
    setShareResults({});

    try {
      const results = await socialMediaService.shareContent({
        userId: 'current_user', // This would come from auth context
        content,
        platforms: selectedPlatforms as any[],
        message: customMessage,
      });

      const resultMap: Record<string, any> = {};
      results.forEach(result => {
        resultMap[result.platform] = result;
      });
      setShareResults(resultMap);

      // Close modal after successful share
      if (results.some(r => r.success)) {
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      console.error('Failed to share content:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`d-flex align-items-center gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        Share
      </Button>

      {isOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share to Social Media</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Message (optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a message to your post..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Platforms</label>
                  <div className="row g-2">
                    {Object.entries(platformIcons).map(([platform, icon]) => (
                      <div key={platform} className="col-6 col-md-4">
                        <div
                          className={`card h-100 cursor-pointer ${
                            selectedPlatforms.includes(platform) ? 'border-primary' : ''
                          }`}
                          onClick={() => togglePlatform(platform)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body text-center p-2">
                            <div className="fs-4 mb-1">{icon}</div>
                            <div className="small">{platformNames[platform as keyof typeof platformNames]}</div>
                            {selectedPlatforms.includes(platform) && (
                              <Check className="w-4 h-4 text-primary position-absolute top-0 end-0 m-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.keys(shareResults).length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Share Results</label>
                    <div className="space-y-2">
                      {Object.entries(shareResults).map(([platform, result]) => (
                        <div
                          key={platform}
                          className={`d-flex align-items-center justify-content-between p-2 rounded ${
                            result.success ? 'bg-success-subtle' : 'bg-danger-subtle'
                          }`}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span>{platformIcons[platform as keyof typeof platformIcons]}</span>
                            <span className="small">{platformNames[platform as keyof typeof platformNames]}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {result.success ? (
                              <>
                                <Check className="w-4 h-4 text-success" />
                                {result.url && (
                                  <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    View
                                  </a>
                                )}
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-danger" />
                                <span className="small text-danger">{result.error}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShare}
                  disabled={isSharing || selectedPlatforms.length === 0}
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin me-2" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 me-2" />
                      Share to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};