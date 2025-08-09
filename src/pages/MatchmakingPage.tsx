import React, { useState } from 'react';
import { Leaderboard } from '../components/matchmaking/Leaderboard';

export interface MatchmakingPageProps {
  userId?: string;
}

export const MatchmakingPage: React.FC<MatchmakingPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'rating' | 'leaderboard' | 'match'>('rating');

  return (
    <div className="matchmaking-page">
      <style>
        {`
          .matchmaking-page {
            padding: 1rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .tab-navigation {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 2px solid #e0e0e0;
          }
          .tab-button {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 1rem;
            color: #666;
            transition: all 0.3s ease;
          }
          .tab-button.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }
          .tab-content {
            padding: 1rem 0;
          }
          .rating-section {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
          }
        `}
      </style>

      <h1>Matchmaking</h1>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'rating' ? 'active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          My Rating
        </button>
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'match' ? 'active' : ''}`}
          onClick={() => setActiveTab('match')}
        >
          Find Match
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'rating' && (
          <div className="rating-section">
            <h3>Your Rating</h3>
            <p>Current Rating: 1200</p>
            <p>Rank: Silver II</p>
            <p>Games Played: 45</p>
            <p>Win Rate: 62%</p>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard format="standard" />
        )}

        {activeTab === 'match' && (
          <div className="rating-section">
            <h3>Find Match</h3>
            <p>Search for opponents with similar skill levels.</p>
            <button className="btn-primary">
              Search for Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;