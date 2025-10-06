import React, { useState } from 'react';
import { Share2, BarChart3, Settings, Users, TrendingUp, Calendar } from 'lucide-react';
import { Card, Row, Col, Nav, Tab, Badge } from 'react-bootstrap';
import { SocialShareButton } from './SocialShareButton';
import { SocialStreamingPanel } from './SocialStreamingPanel';
import { SocialAnalytics } from './SocialAnalytics';
import { SocialAuthManager } from './SocialAuthManager';

interface SocialDashboardProps {
  userId: string;
  className?: string;
}

export const SocialDashboard: React.FC<SocialDashboardProps> = ({
  userId,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'share', label: 'Share Content', icon: Share2 },
    { id: 'streaming', label: 'Live Streaming', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userId={userId} />;
      case 'share':
        return <ShareTab userId={userId} />;
      case 'streaming':
        return <StreamingTab userId={userId} />;
      case 'analytics':
        return <AnalyticsTab userId={userId} />;
      case 'accounts':
        return <AccountsTab userId={userId} />;
      case 'settings':
        return <SettingsTab userId={userId} />;
      default:
        return <OverviewTab userId={userId} />;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0">Social Media Dashboard</h3>
        <Badge bg="primary" className="fs-6">
          Beta
        </Badge>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')}>
        <Row>
          <Col md={3}>
            <Card>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Nav.Item key={tab.id}>
                        <Nav.Link
                          eventKey={tab.id}
                          className="d-flex align-items-center gap-2 px-3 py-3"
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Tab.Content>
              {tabs.map((tab) => (
                <Tab.Pane key={tab.id} eventKey={tab.id}>
                  {renderTabContent()}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div className="space-y-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Share</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Share your latest deck, tournament result, or achievement across all your connected social media platforms.
              </p>
              <SocialShareButton
                content={{
                  type: 'deck',
                  data: {
                    id: 'sample-deck',
                    name: 'Sample Deck',
                    format: 'Standard',
                    winRate: 65,
                  },
                }}
                platforms={['discord', 'twitter', 'reddit']}
                className="w-100"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Live Streaming</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-3">
                Start streaming your KONIVRER gameplay to Twitch or YouTube with integrated chat and overlays.
              </p>
              <SocialStreamingPanel
                gameId="sample-game"
                deckId="sample-deck"
                className="border-0 shadow-none"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div className="fs-4">🎮</div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Deck shared to Discord</div>
                    <div className="text-muted small">2 hours ago</div>
                  </div>
                  <Badge bg="success">Success</Badge>
                </div>
                
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div className="fs-4">🐦</div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Tournament result tweeted</div>
                    <div className="text-muted small">5 hours ago</div>
                  </div>
                  <Badge bg="success">Success</Badge>
                </div>
                
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div className="fs-4">📺</div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">YouTube stream ended</div>
                    <div className="text-muted small">1 day ago</div>
                  </div>
                  <Badge bg="info">Completed</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Share Tab Component
const ShareTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <Card.Header>
          <h5 className="mb-0">Share Content</h5>
        </Card.Header>
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-3">🃏</div>
                  <h6>Share Deck</h6>
                  <p className="text-muted small mb-3">
                    Share your deck list with win rate and strategy
                  </p>
                  <SocialShareButton
                    content={{
                      type: 'deck',
                      data: {
                        id: 'deck-123',
                        name: 'Control Deck',
                        format: 'Standard',
                        winRate: 72,
                        strategy: 'Control the board and win with card advantage',
                      },
                    }}
                    platforms={['discord', 'twitter', 'reddit', 'instagram']}
                    message="Check out my latest control deck!"
                    className="w-100"
                  />
                </Card.Body>
              </Card>
            </div>
            
            <div className="col-md-6">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-3">🏆</div>
                  <h6>Share Tournament Result</h6>
                  <p className="text-muted small mb-3">
                    Share your tournament victory or achievement
                  </p>
                  <SocialShareButton
                    content={{
                      type: 'tournament',
                      data: {
                        id: 'tournament-456',
                        name: 'Weekly Championship',
                        format: 'Standard',
                        placement: 1,
                        totalPlayers: 32,
                      },
                    }}
                    platforms={['discord', 'twitter', 'reddit']}
                    message="Just won the Weekly Championship! 🎉"
                    className="w-100"
                  />
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// Streaming Tab Component
const StreamingTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div>
      <SocialStreamingPanel
        gameId="current-game"
        deckId="current-deck"
      />
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div>
      <SocialAnalytics userId={userId} />
    </div>
  );
};

// Accounts Tab Component
const AccountsTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div>
      <SocialAuthManager userId={userId} />
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <Card.Header>
          <h5 className="mb-0">Notification Settings</h5>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="notify-success"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="notify-success">
                Notify when content is successfully shared
              </label>
            </div>
            
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="notify-errors"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="notify-errors">
                Notify when sharing fails
              </label>
            </div>
            
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="notify-streaming"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="notify-streaming">
                Notify when streaming starts/stops
              </label>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Default Settings</h5>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <div>
              <label className="form-label">Default Sharing Platforms</label>
              <div className="d-flex gap-2 flex-wrap">
                {['discord', 'twitter', 'reddit'].map((platform) => (
                  <Badge key={platform} bg="primary" className="fs-6">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="form-label">Default Hashtags</label>
              <input
                type="text"
                className="form-control"
                defaultValue="#KONIVRER #TCG"
                placeholder="Enter default hashtags separated by spaces"
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};