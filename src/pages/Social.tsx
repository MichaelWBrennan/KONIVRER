import React, { useState } from 'react';

export const Social: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'feed' | 'friends' | 'communities' | 'messages'>('feed');

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
            <div className="coming-soon">
              <h2>Community Feed Coming Soon</h2>
              <p>Share your latest decks, tournament results, and connect with the community.</p>
            </div>
          </div>
        )}

        {selectedTab === 'friends' && (
          <div className="friends-section">
            <div className="coming-soon">
              <h2>Friends System Coming Soon</h2>
              <p>Add friends, see their status, and organize practice matches.</p>
            </div>
          </div>
        )}

        {selectedTab === 'communities' && (
          <div className="communities-section">
            <div className="coming-soon">
              <h2>Communities Coming Soon</h2>
              <p>Join communities based on your favorite formats and playstyles.</p>
            </div>
          </div>
        )}

        {selectedTab === 'messages' && (
          <div className="messages-section">
            <div className="coming-soon">
              <h2>Messaging Coming Soon</h2>
              <p>Private messaging with other players in the community.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};