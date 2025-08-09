import React from 'react';

export interface MatchQuality {
  quality: number;
  winProbabilities: number[];
  skillDifference: number;
  uncertaintyFactor: number;
  balanceCategory: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface MatchQualityIndicatorProps {
  matchQuality: MatchQuality;
  player1Name?: string;
  player2Name?: string;
  className?: string;
  compact?: boolean;
}

export const MatchQualityIndicator: React.FC<MatchQualityIndicatorProps> = ({
  matchQuality,
  player1Name = 'Player 1',
  player2Name = 'Player 2',
  className = '',
  compact = false
}) => {
  const getQualityColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityTextColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-700';
      case 'good': return 'text-blue-700';
      case 'fair': return 'text-yellow-700';
      case 'poor': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Quality indicator dot */}
        <div 
          className={`w-3 h-3 rounded-full ${getQualityColor(matchQuality.balanceCategory)}`}
          title={`Match Quality: ${matchQuality.balanceCategory}`}
        />
        <span className="text-sm text-gray-600">
          Quality: {formatPercentage(matchQuality.quality)}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Match Quality</h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getQualityTextColor(matchQuality.balanceCategory)} bg-opacity-10`}>
          {matchQuality.balanceCategory}
        </span>
      </div>

      {/* Quality bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Overall Quality</span>
          <span className="text-sm font-medium">{formatPercentage(matchQuality.quality)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getQualityColor(matchQuality.balanceCategory)}`}
            style={{ width: `${matchQuality.quality * 100}%` }}
          />
        </div>
      </div>

      {/* Win probabilities */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Expected Outcome</h5>
        
        {/* Player 1 probability */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">{player1Name}</span>
          <span className="text-sm font-medium text-green-600">
            {formatPercentage(matchQuality.winProbabilities[0])}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${matchQuality.winProbabilities[0] * 100}%` }}
          />
        </div>

        {/* Player 2 probability */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">{player2Name}</span>
          <span className="text-sm font-medium text-blue-600">
            {formatPercentage(matchQuality.winProbabilities[1])}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${matchQuality.winProbabilities[1] * 100}%` }}
          />
        </div>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Skill Gap:</span>
          <span className="font-medium">{matchQuality.skillDifference.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Uncertainty:</span>
          <span className="font-medium">±{matchQuality.uncertaintyFactor.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};