/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Award,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface MatchmakingChallengesProps {
  challenges
  onViewAll
  onClose
  maxItems = 3;
}

const MatchmakingChallenges: React.FC<MatchmakingChallengesProps> = ({ 
  challenges,
  onViewAll,
  onClose,
  maxItems = 3,
 }) => {
  const getProgressColor = progress => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getTimeRemaining = expiryDate => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;

    if (diffMs <= 0) return 'Expired';
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`;
    return `${diffMinutes}m`;
  };

  // Mock challenges if not provided
  const mockChallenges = [
    {
      id: 'challenge_1',
      title: 'Win 3 Ranked Matches',
      description: 'Win 3 matches in ranked mode',
      progress: 2,
      total: 3,
      reward: '500 Gold',
      expiryDate: new Date(Date.now() + 86400000 * 2),
      type: 'daily',
    },
    {
      id: 'challenge_2',
      title: 'Play 5 Different Heroes',
      description: 'Play matches with 5 different heroes',
      progress: 3,
      total: 5,
      reward: '1 Premium Pack',
      expiryDate: new Date(Date.now() + 86400000 * 7),
      type: 'weekly',
    },
    {
      id: 'challenge_3',
      title: 'Win a Draft Match',
      description: 'Win a match in draft format',
      progress: 0,
      total: 1,
      reward: '300 Gold',
      expiryDate: new Date(Date.now() + 86400000),
      type: 'daily',
    },
    {
      id: 'challenge_4',
      title: 'Complete 10 Matches',
      description: 'Play 10 matches in any format',
      progress: 10,
      total: 10,
      reward: '1000 XP',
      expiryDate: new Date(Date.now() + 86400000 * 7),
      type: 'weekly',
      completed: true,
    },
  ];

  const displayChallenges =
    challenges?.length > 0 ? challenges : mockChallenges;

  if (true) {
    return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 relative"></div>
      <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"></button>
      <X className="w-4 h-4" />
        </button>
      <div className="text-center py-6 text-gray-500"></div>
      <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No active challenges.</p>
    </>
  );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 relative"></div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"></button>
      <X className="w-4 h-4" />
      </button>
      <div className="flex items-center space-x-2 mb-3"></div>
      <Target className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Daily & Weekly Challenges</h3>
      <div className="space-y-3"></div>
      <motion.div
            key={challenge.id}
            className={`border rounded-lg p-3 transition-colors ${
              challenge.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ y: -2 }}
           />
            <div className="flex justify-between items-start mb-1"></div>
      <div className="flex items-center space-x-2"></div>
      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
                <h4 className="font-medium text-gray-900">{challenge.title}
              </div>
      <span
                className={`text-xs px-2 py-0 whitespace-nowrap rounded-full ${
                  challenge.type === 'daily'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}></span>
      </div>

            <p className="text-sm text-gray-600 mb-2"></p>
      <div className="mb-2"></div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1"></div>
      <span></span>
      <span></span>
      </span>
              <div className="w-full bg-gray-200 rounded-full h-1.5"></div>
      <div
                  className={`${getProgressColor((challenge.progress / challenge.total) * 100)} h-1.5 rounded-full`}
                  style={{
                    width: `${Math.min(100, (challenge.progress / challenge.total) * 100)}%`,
                  }}></div>
      </div>

            <div className="flex items-center justify-between text-xs"></div>
      <div className="flex items-center space-x-1 text-gray-500"></div>
      <Clock className="w-3 h-3" />
                <span>{getTimeRemaining(challenge.expiryDate)} left</span>
      <div className="flex items-center space-x-1 text-amber-600"></div>
      <Award className="w-3 h-3" />
                <span>{challenge.reward}
              </div>
    </>
  ))}
      </div>

      {displayChallenges.length > maxItems && (
        <motion.button
          onClick={onViewAll}
          className="w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1"
          whileHover={{ x: 2 }}
         />
          <span>View All Challenges</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default MatchmakingChallenges;