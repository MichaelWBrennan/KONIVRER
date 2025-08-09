import React, { useState, useEffect } from 'react';
import { PlayerRating, PlayerRatingCard } from '../components/matchmaking/PlayerRatingCard';
import { MatchQualityIndicator, MatchQuality } from '../components/matchmaking/MatchQualityIndicator';
import { Leaderboard } from '../components/matchmaking/Leaderboard';

interface MatchPreview {
  player1Id: string;
  player2Id: string;
  quality: MatchQuality;
  expectedDuration?: number;
}

export const MatchmakingPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('Standard');
  const [playerRating, setPlayerRating] = useState<PlayerRating | null>(null);
  const [matchPreview, setMatchPreview] = useState<MatchPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'rating' | 'leaderboard' | 'match'>('rating');

  // Mock user ID - in real app this would come from auth context
  const currentUserId = 'current-user-id';
  const formats = ['Standard', 'Modern', 'Legacy', 'Limited'];

  useEffect(() => {
    fetchPlayerRating();
  }, [selectedFormat]);

  const fetchPlayerRating = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matchmaking/ratings/${currentUserId}/${selectedFormat}`);
      if (response.ok) {
        const data = await response.json();
        setPlayerRating(data);
      } else {
        console.error('Failed to fetch player rating');
      }
    } catch (error) {
      console.error('Error fetching player rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const findMatch = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call a matchmaking endpoint
      // For now, we'll simulate finding a match
      const mockOpponentId = 'opponent-user-id';
      
      const response = await fetch(`/api/matchmaking/match-quality/${currentUserId}/${mockOpponentId}/${selectedFormat}`);
      if (response.ok) {
        const quality = await response.json();
        setMatchPreview({
          player1Id: currentUserId,
          player2Id: mockOpponentId,
          quality,
          expectedDuration: 45,
        });
        setActiveTab('match');
      }
    } catch (error) {
      console.error('Error finding match:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{ 
    tab: string; 
    label: string; 
    icon: string; 
    isActive: boolean; 
    onClick: () => void 
  }> = ({ tab, label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center p-3 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <span className="text-lg mb-1">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Matchmaking</h1>
              <p className="text-gray-600">Bayesian skill-based competitive play</p>
            </div>
            
            {/* Format selector */}
            <div className="flex flex-col sm:items-end gap-2">
              <label className="text-sm font-medium text-gray-700">Format:</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-first tab navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex">
            <TabButton
              tab="rating"
              label="My Rating"
              icon="📊"
              isActive={activeTab === 'rating'}
              onClick={() => setActiveTab('rating')}
            />
            <TabButton
              tab="leaderboard"
              label="Leaderboard"
              icon="🏆"
              isActive={activeTab === 'leaderboard'}
              onClick={() => setActiveTab('leaderboard')}
            />
            <TabButton
              tab="match"
              label="Find Match"
              icon="⚔️"
              isActive={activeTab === 'match'}
              onClick={() => setActiveTab('match')}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* My Rating Tab */}
        {activeTab === 'rating' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ) : playerRating ? (
              <>
                <PlayerRatingCard
                  rating={playerRating}
                  playerName="You"
                  showDetailed={true}
                  className="max-w-md mx-auto"
                />
                
                {/* Rating insights */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Rating Insights
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    {playerRating.matchesPlayed < 10 && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                        <span className="text-blue-600">ℹ️</span>
                        <div>
                          <p className="font-medium text-blue-900">Build Your Rating</p>
                          <p className="text-blue-700">
                            Play {10 - playerRating.matchesPlayed} more matches to stabilize your rating.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {playerRating.currentStreak >= 3 && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                        <span className="text-green-600">
                          {playerRating.streakType === 'win' ? '🔥' : '❄️'}
                        </span>
                        <div>
                          <p className="font-medium text-green-900">
                            {playerRating.streakType === 'win' ? 'On Fire!' : 'Tough Streak'}
                          </p>
                          <p className="text-green-700">
                            {playerRating.currentStreak} {playerRating.streakType}s in a row
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {playerRating.trend === 'rising' && (
                      <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-md">
                        <span className="text-purple-600">📈</span>
                        <div>
                          <p className="font-medium text-purple-900">Rising Star</p>
                          <p className="text-purple-700">
                            Your rating is trending upward. Keep it up!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <span className="text-4xl mb-4 block">🎮</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to Competitive Play
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your journey in {selectedFormat} to get your skill rating!
                </p>
                <button
                  onClick={findMatch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Play Your First Match
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            format={selectedFormat}
            limit={50}
            className="max-w-2xl mx-auto"
          />
        )}

        {/* Find Match Tab */}
        {activeTab === 'match' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {!matchPreview ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <span className="text-4xl mb-4 block">⚔️</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Find Your Match
                </h3>
                <p className="text-gray-600 mb-6">
                  We'll find you a skilled opponent for competitive play
                </p>
                <button
                  onClick={findMatch}
                  disabled={loading}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Finding Match...
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      Find Match
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <span className="text-4xl mb-4 block">🎯</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Match Found!
                  </h3>
                  <p className="text-gray-600">
                    A competitive opponent has been found
                  </p>
                </div>

                <MatchQualityIndicator
                  matchQuality={matchPreview.quality}
                  player1Name="You"
                  player2Name="Opponent"
                />

                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => {
                      // In real app, this would start the game
                      alert('Starting match... (This would launch the game)');
                    }}
                  >
                    Accept Match
                  </button>
                  <button
                    className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setMatchPreview(null)}
                  >
                    Decline
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};