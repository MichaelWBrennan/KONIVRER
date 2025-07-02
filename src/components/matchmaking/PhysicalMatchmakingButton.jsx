/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Smartphone, Tablet, Laptop, Trophy, QrCode } from 'lucide-react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';

const PhysicalMatchmakingButton = () => {
  const { goToPhysicalMatchmaking } = usePhysicalMatchmaking();

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Trophy className="w-5 h-5 text-yellow-300" />
        <h2 className="text-lg font-semibold">Physical Card Game?</h2>
      </div>
      <p className="text-sm text-purple-200 mb-4">
        Use our enhanced physical matchmaking system for in-person tournaments, quick matches, and player tracking.
      </p>
      <motion.button
        onClick={goToPhysicalMatchmaking}
        className="w-full bg-white text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Users className="w-5 h-5" />
        <span>Open Physical Matchmaking</span>
      </motion.button>
      
      <div className="mt-3 pt-3 border-t border-purple-500 border-opacity-30">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <Smartphone className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Mobile</p>
          </div>
          <div className="text-center">
            <Tablet className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Tablet</p>
          </div>
          <div className="text-center">
            <Laptop className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Desktop</p>
          </div>
          <div className="text-center">
            <QrCode className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">QR Codes</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-purple-200">
          <p>Works offline! Perfect for tournaments and game stores.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PhysicalMatchmakingButton;