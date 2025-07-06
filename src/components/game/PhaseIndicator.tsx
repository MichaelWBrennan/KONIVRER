import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { motion } from 'framer-motion';
import { Sunrise, Sun, Swords, Moon, ArrowRight } from 'lucide-react';

/**
 * Displays the simultaneous play mode indicator
 */
const PhaseIndicator = ({
  playerName,
  opponentName,
}): any => {// In simultaneous mode, there are no phases and both players are active
  
  // Get turn number (simulated)
  const turnNumber = Math.floor(Math.random() * 10) + 1; // This would normally come from game state

  return (
    <div className="flex flex-col items-center"></div>
      <div className="text-white text-xs mb-1 font-medium flex items-center"></div>
        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-0.5 rounded-full mr-2"></span>
          Turn {turnNumber}
        <span className="text-white">Simultaneous Play</span>

      {/* Simultaneous mode indicator */}
      <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg"></div>
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-br from-purple-500 to-blue-600 px-3 py-0 whitespace-nowrap rounded-full text-white text-sm font-medium"
         />
          Free Play Mode - Play Any Card Anytime
        </motion.div>
      </div>
  );
};

export default PhaseIndicator;