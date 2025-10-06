import React, { useState, useEffect } from 'react';
import { Play, Square, Settings, Users, MessageCircle, Eye } from 'lucide-react';
import { Button, Card, Badge, Progress } from 'react-bootstrap';
import { socialMediaService } from '../../services/socialMediaService';

interface SocialStreamingPanelProps {
  gameId?: string;
  deckId?: string;
  className?: string;
}

interface StreamInfo {
  platform: string;
  streamId: string;
  streamUrl: string;
  chatUrl?: string;
  overlayUrl?: string;
}

export const SocialStreamingPanel: React.FC<SocialStreamingPanelProps> = ({
  gameId,
  deckId,
  className = '',
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streams, setStreams] = useState<StreamInfo[]>([]);
  const [streamTitle, setStreamTitle] = useState('KONIVRER TCG Stream');
  const [streamDescription, setStreamDescription] = useState('Live KONIVRER gameplay and deck building');
  const [selectedPlatforms, setSelectedPlatforms] = useState<('twitch' | 'youtube')[]>(['twitch']);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const platformIcons = {
    twitch: '📡',
    youtube: '📺',
  };

  const platformNames = {
    twitch: 'Twitch',
    youtube: 'YouTube',
  };

  const platformColors = {
    twitch: '#9146ff',
    youtube: '#ff0000',
  };

  useEffect(() => {
    // Simulate viewer count updates
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const startStreaming = async () => {
    if (selectedPlatforms.length === 0) return;

    setIsLoading(true);
    try {
      const streamResults = await socialMediaService.startStreaming({
        userId: 'current_user', // This would come from auth context
        platforms: selectedPlatforms,
        title: streamTitle,
        description: streamDescription,
        gameId,
        deckId,
      });

      setStreams(streamResults);
      setIsStreaming(true);
    } catch (error) {
      console.error('Failed to start streaming:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopStreaming = async () => {
    setIsStreaming(false);
    setStreams([]);
    setViewerCount(0);
  };

  const togglePlatform = (platform: 'twitch' | 'youtube') => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <Card className={`${className}`}>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Live Streaming</h5>
        <div className="d-flex align-items-center gap-2">
          {isStreaming && (
            <Badge bg="danger" className="d-flex align-items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-circle animate-pulse" />
              LIVE
            </Badge>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {/* Settings modal */}}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {!isStreaming ? (
          <div className="space-y-4">
            <div>
              <label className="form-label">Stream Title</label>
              <input
                type="text"
                className="form-control"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Enter stream title..."
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Enter stream description..."
              />
            </div>

            <div>
              <label className="form-label">Streaming Platforms</label>
              <div className="d-flex gap-2">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <div
                    key={platform}
                    className={`card cursor-pointer ${
                      selectedPlatforms.includes(platform as any) ? 'border-primary' : ''
                    }`}
                    onClick={() => togglePlatform(platform as any)}
                    style={{ 
                      cursor: 'pointer',
                      minWidth: '120px',
                      border: selectedPlatforms.includes(platform as any) 
                        ? `2px solid ${platformColors[platform as keyof typeof platformColors]}` 
                        : '1px solid #dee2e6'
                    }}
                  >
                    <div className="card-body text-center p-3">
                      <div className="fs-4 mb-1">{icon}</div>
                      <div className="small">{platformNames[platform as keyof typeof platformNames]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={startStreaming}
              disabled={isLoading || selectedPlatforms.length === 0}
              className="w-100"
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Starting Stream...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 me-2" />
                  Start Streaming
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mb-0">Active Streams</h6>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={stopStreaming}
              >
                <Square className="w-4 h-4 me-1" />
                Stop Stream
              </Button>
            </div>

            {streams.map((stream) => (
              <div
                key={stream.platform}
                className="p-3 rounded"
                style={{ backgroundColor: '#f8f9fa' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">
                      {platformIcons[stream.platform as keyof typeof platformIcons]}
                    </span>
                    <span className="fw-medium">
                      {platformNames[stream.platform as keyof typeof platformNames]}
                    </span>
                  </div>
                  <Badge bg="success">Connected</Badge>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => window.open(stream.streamUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 me-1" />
                      View Stream
                    </Button>
                  </div>
                  {stream.chatUrl && (
                    <div className="col-6">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="w-100"
                        onClick={() => window.open(stream.chatUrl, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 me-1" />
                        Chat
                      </Button>
                    </div>
                  )}
                </div>

                {stream.overlayUrl && (
                  <div className="mt-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="w-100"
                      onClick={() => window.open(stream.overlayUrl, '_blank')}
                    >
                      <Settings className="w-4 h-4 me-1" />
                      Overlay Settings
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <div className="d-flex align-items-center justify-content-between p-3 bg-primary-subtle rounded">
              <div className="d-flex align-items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="small">Viewers</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fs-5 fw-bold">{viewerCount}</span>
                <div className="w-2 h-2 bg-success rounded-circle animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};