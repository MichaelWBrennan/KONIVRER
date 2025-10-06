import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Heart, MessageCircle, Share2, BarChart3 } from 'lucide-react';
import { Card, Row, Col, Badge, Progress } from 'react-bootstrap';
import { socialMediaService } from '../../services/socialMediaService';

interface SocialAnalyticsProps {
  userId: string;
  className?: string;
}

interface PlatformStats {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  growth?: number;
  topPost?: {
    content: string;
    engagement: number;
    url: string;
  };
}

export const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  userId,
  className = '',
}) => {
  const [analytics, setAnalytics] = useState<PlatformStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const platformIcons = {
    discord: '🎮',
    twitter: '🐦',
    youtube: '📺',
    twitch: '📡',
    reddit: '🤖',
    instagram: '📷',
  };

  const platformColors = {
    discord: '#5865f2',
    twitter: '#1da1f2',
    youtube: '#ff0000',
    twitch: '#9146ff',
    reddit: '#ff4500',
    instagram: '#e4405f',
  };

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await socialMediaService.getSocialAnalytics(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load social analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalFollowers = () => {
    return analytics.reduce((sum, platform) => sum + platform.followers, 0);
  };

  const getTotalEngagement = () => {
    return analytics.reduce((sum, platform) => sum + platform.engagement, 0);
  };

  const getTotalPosts = () => {
    return analytics.reduce((sum, platform) => sum + platform.posts, 0);
  };

  const getAverageEngagement = () => {
    const totalEngagement = getTotalEngagement();
    const totalPosts = getTotalPosts();
    return totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0;
  };

  const getTopPlatform = () => {
    return analytics.reduce((top, platform) => 
      platform.followers > top.followers ? platform : top, 
      analytics[0] || { platform: 'none', followers: 0 }
    );
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card>
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading social analytics...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Social Media Analytics</h4>
        <div className="btn-group" role="group">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              type="button"
              className={`btn btn-sm ${timeRange === range ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="mb-1">{getTotalFollowers().toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Followers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Heart className="w-8 h-8 text-danger mb-2" />
              <h3 className="mb-1">{getTotalEngagement().toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Engagement</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Share2 className="w-8 h-8 text-success mb-2" />
              <h3 className="mb-1">{getTotalPosts().toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Posts</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <TrendingUp className="w-8 h-8 text-warning mb-2" />
              <h3 className="mb-1">{getAverageEngagement()}</h3>
              <p className="text-muted mb-0">Avg Engagement</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Platform Breakdown */}
      <Row>
        {analytics.map((platform) => (
          <Col md={6} lg={4} key={platform.platform} className="mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4">
                    {platformIcons[platform.platform as keyof typeof platformIcons]}
                  </span>
                  <span className="fw-medium text-capitalize">
                    {platform.platform}
                  </span>
                </div>
                {platform.growth && (
                  <Badge 
                    bg={platform.growth > 0 ? 'success' : 'danger'}
                    className="d-flex align-items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    {platform.growth > 0 ? '+' : ''}{platform.growth}%
                  </Badge>
                )}
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Followers</span>
                    <span className="fw-medium">{platform.followers.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Engagement</span>
                    <span className="fw-medium">{platform.engagement.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Posts</span>
                    <span className="fw-medium">{platform.posts.toLocaleString()}</span>
                  </div>

                  {platform.topPost && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="small fw-medium">Top Post</span>
                      </div>
                      <p className="small text-muted mb-2">
                        {platform.topPost.content.length > 100 
                          ? `${platform.topPost.content.substring(0, 100)}...`
                          : platform.topPost.content
                        }
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          {platform.topPost.engagement} engagement
                        </span>
                        <a
                          href={platform.topPost.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {analytics.length === 0 && (
        <Card>
          <Card.Body className="text-center py-5">
            <MessageCircle className="w-12 h-12 text-muted mb-3" />
            <h5 className="mb-2">No Social Media Connected</h5>
            <p className="text-muted mb-4">
              Connect your social media accounts to see analytics and insights.
            </p>
            <button className="btn btn-primary">
              Connect Accounts
            </button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};