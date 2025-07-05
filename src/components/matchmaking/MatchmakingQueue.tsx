/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Trophy, Globe, X } from 'lucide-react';

interface MatchmakingQueueProps {
  isSearching
  searchTime
  queuePosition
  selectedFormat
  preferences
  onCancel
  estimatedTime
}

const MatchmakingQueue: React.FC<MatchmakingQueueProps> = ({ 
  isSearching,
  searchTime,
  queuePosition,
  selectedFormat,
  preferences,
  onCancel,
  estimatedTime,
 }) => {
  const formatSearchTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4"></div>
      <div className="flex items-center justify-between"></div>
        <div></div>
          <h3 className="text-lg font-semibold text-gray-900"></h3>
            Searching for Match
          </h3>
          <p className="text-sm text-gray-500"></p>
            {formatSearchTime(searchTime)} • Queue Position: {queuePosition}
            {estimatedTime && ` • Est. Wait: ~${estimatedTime}`}
          </p>
        </div>
        <motion.button
          onClick={onCancel}
          className="bg-red-100 text-red-600 px-4 py-0 whitespace-nowrap rounded-lg font-medium hover:bg-red-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        ></motion>
          <span className="flex items-center space-x-1"></span>
            <X className="w-4 h-4" /></X>
            <span>Cancel</span>
          </span>
        </motion.button>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: '5%' }}
          animate={{ width: ['5%', '95%'] }}
          transition={{
            duration: 15,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
      </div>

      <div className="flex items-center space-x-3 text-sm text-gray-500"></div>
        <div className="flex items-center space-x-1"></div>
          <Target className="w-4 h-4" /></Target>
          <span>{selectedFormat}</span>
        </div>
        <div className="flex items-center space-x-1"></div>
          <Trophy className="w-4 h-4" /></Trophy>
          <span>{preferences.gameMode}</span>
        </div>
        <div className="flex items-center space-x-1"></div>
          <Globe className="w-4 h-4" /></Globe>
          <span>{preferences.region}</span>
        </div>
        <div className="flex items-center space-x-1"></div>
          <Clock className="w-4 h-4" /></Clock>
          <span>{formatSearchTime(searchTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingQueue;