import React, { useState, useEffect } from 'react';
import type { PlayerRating } from './PlayerRatingCard';

export interface LeaderboardProps {
  format: string;
  limit?: number;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  format, 
  limit = 20, 
  className = '' 
}) => {
  const [leaderboard, setLeaderboard] = useState<PlayerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [format, limit]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matchmaking/leaderboard/${format}?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <span className="text-red-600 mr-2">❌</span>
          <span className="text-red-700">Error: {error}</span>
        </div>
        <button 
          onClick={fetchLeaderboard}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {format} Leaderboard
          </h3>
          <button 
            onClick={fetchLeaderboard}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="p-4">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">🏆</span>
            <p>No players yet in this format</p>
            <p className="text-sm mt-1">Be the first to compete!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((rating, index) => (
              <div key={rating.id} className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-10 text-center">
                  {index < 3 ? (
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-gray-600">
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Player info - mobile optimized */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Player {rating.userId.slice(-4)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{rating.matchesPlayed} matches</span>
                        <span>{Math.round(rating.winRate)}% win rate</span>
                        {rating.percentileRank && (
                          <span>{Math.round(rating.percentileRank)}th percentile</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Rating display */}
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(rating.conservativeRating)}
                      </div>
                      <div className="flex items-center justify-end space-x-1">
                        <span className={`text-xs ${
                          rating.trend === 'rising' ? 'text-green-600' : 
                          rating.trend === 'falling' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {rating.trend === 'rising' ? '📈' : 
                           rating.trend === 'falling' ? '📉' : '➖'}
                        </span>
                        {rating.isStable && (
                          <span className="text-xs text-green-600" title="Stable rating">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with stats */}
      {leaderboard.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-600 text-center border-t border-gray-200">
          Showing top {Math.min(limit, leaderboard.length)} players • 
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};