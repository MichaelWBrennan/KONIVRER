import React from 'react';

export interface PlayerRating {
  id: string;
  userId: string;
  format: string;
  skill: number;
  uncertainty: number;
  conservativeRating: number;
  matchesPlayed: number;
  winRate: number;
  trend: 'rising' | 'falling' | 'stable';
  isStable: boolean;
  percentileRank?: number;
  currentStreak: number;
  streakType: 'win' | 'loss' | 'none';
  peakRating?: number;
}

export interface PlayerRatingCardProps {
  rating: PlayerRating;
  playerName?: string;
  showDetailed?: boolean;
  className?: string;
}

export const PlayerRatingCard: React.FC<PlayerRatingCardProps> = ({ 
  rating, 
  playerName = 'Player',
  showDetailed = false,
  className = '' 
}) => {
  const getTrendIcon = (trend: PlayerRating['trend']) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➖';
    }
  };

  const getTrendColor = (trend: PlayerRating['trend']) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStreakDisplay = () => {
    if (rating.streakType === 'none' || rating.currentStreak === 0) return null;
    
    const streakIcon = rating.streakType === 'win' ? '🔥' : '❄️';
    const streakColor = rating.streakType === 'win' ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${streakColor}`}>
        <span>{streakIcon}</span>
        <span className="text-sm font-medium">{rating.currentStreak}</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Header with player name and format */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{playerName}</h3>
          <p className="text-sm text-gray-600">{rating.format}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStreakDisplay()}
          <div className={`flex items-center gap-1 ${getTrendColor(rating.trend)}`}>
            <span>{getTrendIcon(rating.trend)}</span>
            <span className="text-sm font-medium capitalize">{rating.trend}</span>
          </div>
        </div>
      </div>

      {/* Main rating display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-blue-600">
            {Math.round(rating.conservativeRating)}
          </span>
          <span className="text-sm text-gray-500">rating</span>
          {rating.isStable && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Stable
            </span>
          )}
        </div>
        
        {/* Uncertainty indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(10, 100 - (rating.uncertainty * 10))}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">
          Confidence: {Math.max(10, 100 - Math.round(rating.uncertainty * 10))}%
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-900">{rating.matchesPlayed}</div>
          <div className="text-gray-600">Matches</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-900">{Math.round(rating.winRate)}%</div>
          <div className="text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Detailed stats for expanded view */}
      {showDetailed && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {rating.percentileRank && (
              <div>
                <span className="text-gray-600">Percentile:</span>
                <span className="ml-2 font-medium">{Math.round(rating.percentileRank)}th</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Skill:</span>
              <span className="ml-2 font-medium">{rating.skill.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-gray-600">Uncertainty:</span>
              <span className="ml-2 font-medium">±{rating.uncertainty.toFixed(1)}</span>
            </div>
            {rating.peakRating && (
              <div>
                <span className="text-gray-600">Peak:</span>
                <span className="ml-2 font-medium">{Math.round(rating.peakRating)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};