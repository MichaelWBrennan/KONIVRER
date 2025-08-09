import React, { useState } from 'react';

interface Friend {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'playing';
  avatar: string;
  level: number;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  deckShared?: {
    name: string;
    format: string;
  };
}

export const Social: React.FC = () => {
  const [friends] = useState<Friend[]>([
    {
      id: '1',
      username: 'CardMaster_Sarah',
      status: 'online',
      avatar: '👩',
      level: 45
    },
    {
      id: '2',
      username: 'ProPlayer_Mike',
      status: 'playing',
      avatar: '👨',
      level: 62
    },
    {
      id: '3',
      username: 'Lightning_Joe',
      status: 'offline',
      avatar: '⚡',
      level: 38
    }
  ]);

  const [posts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'CardMaster_Sarah',
      avatar: '👩',
      content: 'Just finished building my new control deck! The synergy between these cards is incredible. Anyone want to test it out?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      likes: 24,
      comments: 7,
      deckShared: {
        name: 'Blue-White Control v2.1',
        format: 'Standard'
      }
    },
    {
      id: '2',
      author: 'ProPlayer_Mike',
      avatar: '👨',
      content: 'Great tournament today! That final match was intense. Thanks to everyone who came out to watch the stream!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 156,
      comments: 23
    },
    {
      id: '3',
      author: 'Lightning_Joe',
      avatar: '⚡',
      content: 'Looking for practice partners for the upcoming Modern tournament. Hit me up if you want to do some test games!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      likes: 12,
      comments: 8
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'feed' | 'friends' | 'communities' | 'messages'>('feed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'playing': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'playing': return 'In Game';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      return date.toLocaleDateString();
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="social-container">
      <div className="social-header">
        <h1>Social Hub</h1>
        <p>Connect with the KONIVRER community</p>
      </div>

      <div className="social-tabs">
        <button 
          className={`tab ${selectedTab === 'feed' ? 'active' : ''}`}
          onClick={() => setSelectedTab('feed')}
        >
          Community Feed
        </button>
        <button 
          className={`tab ${selectedTab === 'friends' ? 'active' : ''}`}
          onClick={() => setSelectedTab('friends')}
        >
          Friends
        </button>
        <button 
          className={`tab ${selectedTab === 'communities' ? 'active' : ''}`}
          onClick={() => setSelectedTab('communities')}
        >
          Communities
        </button>
        <button 
          className={`tab ${selectedTab === 'messages' ? 'active' : ''}`}
          onClick={() => setSelectedTab('messages')}
        >
          Messages
        </button>
      </div>

      <div className="social-content">
        {selectedTab === 'feed' && (
          <div className="feed-section">
            <div className="post-composer">
              <div className="composer-avatar">👤</div>
              <div className="composer-input">
                <textarea 
                  placeholder="Share your latest deck, tournament results, or thoughts with the community..."
                  className="post-input"
                />
                <div className="composer-actions">
                  <button className="btn btn-secondary">📷 Photo</button>
                  <button className="btn btn-secondary">🃏 Share Deck</button>
                  <button className="btn btn-primary">Post</button>
                </div>
              </div>
            </div>

            <div className="posts-feed">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-avatar">{post.avatar}</div>
                    <div className="post-author-info">
                      <div className="post-author">{post.author}</div>
                      <div className="post-timestamp">{formatTimestamp(post.timestamp)}</div>
                    </div>
                  </div>

                  <div className="post-content">
                    {post.content}
                  </div>

                  {post.deckShared && (
                    <div className="shared-deck">
                      <div className="deck-icon">🃏</div>
                      <div className="deck-info">
                        <div className="deck-name">{post.deckShared.name}</div>
                        <div className="deck-format">{post.deckShared.format}</div>
                      </div>
                      <button className="btn btn-small">Import</button>
                    </div>
                  )}

                  <div className="post-actions">
                    <button className="post-action">
                      ❤️ {post.likes}
                    </button>
                    <button className="post-action">
                      💬 {post.comments}
                    </button>
                    <button className="post-action">
                      🔄 Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'friends' && (
          <div className="friends-section">
            <div className="friends-header">
              <h2>Friends ({friends.length})</h2>
              <button className="btn btn-primary">Add Friend</button>
            </div>
            
            <div className="friends-list">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-avatar">{friend.avatar}</div>
                  <div className="friend-info">
                    <div className="friend-name">{friend.username}</div>
                    <div className="friend-level">Level {friend.level}</div>
                    <div 
                      className="friend-status"
                      style={{ color: getStatusColor(friend.status) }}
                    >
                      ● {getStatusText(friend.status)}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button className="btn btn-small">Message</button>
                    {friend.status === 'online' && (
                      <button className="btn btn-small btn-primary">Invite to Game</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'communities' && (
          <div className="communities-section">
            <div className="communities-header">
              <h2>Your Communities</h2>
              <button className="btn btn-primary">Join Community</button>
            </div>

            <div className="communities-grid">
              <div className="community-card">
                <div className="community-icon">🏆</div>
                <div className="community-info">
                  <h3>Competitive Players</h3>
                  <p>12,845 members</p>
                  <div className="community-tags">
                    <span className="tag">Tournament</span>
                    <span className="tag">Strategy</span>
                  </div>
                </div>
                <button className="btn btn-secondary">View</button>
              </div>

              <div className="community-card">
                <div className="community-icon">🃏</div>
                <div className="community-info">
                  <h3>Deck Builders United</h3>
                  <p>8,234 members</p>
                  <div className="community-tags">
                    <span className="tag">Deck Building</span>
                    <span className="tag">Theory</span>
                  </div>
                </div>
                <button className="btn btn-secondary">View</button>
              </div>

              <div className="community-card">
                <div className="community-icon">⚡</div>
                <div className="community-info">
                  <h3>Aggro Alliance</h3>
                  <p>5,967 members</p>
                  <div className="community-tags">
                    <span className="tag">Aggro</span>
                    <span className="tag">Fast Games</span>
                  </div>
                </div>
                <button className="btn btn-secondary">View</button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'messages' && (
          <div className="messages-section">
            <div className="messages-header">
              <h2>Messages</h2>
            </div>
            
            <div className="messages-placeholder">
              <div className="placeholder-icon">💬</div>
              <h3>No messages yet</h3>
              <p>Start a conversation with your friends!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};