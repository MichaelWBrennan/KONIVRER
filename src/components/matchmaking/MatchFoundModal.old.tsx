/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock } from 'lucide-react';
import UnifiedPlayerCard from './UnifiedPlayerCard';

interface MatchFoundModalProps {
  isOpen
  match
  player
  onAccept
  onDecline
  timeLimit = 30;
}

const MatchFoundModal: React.FC<MatchFoundModalProps> = ({ 
  isOpen,
  match,
  player,
  onAccept,
  onDecline,
  timeLimit = 30,
 }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev: any) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLimit, onDecline]);

  if (!isOpen || !match) return null;
  return (
    <AnimatePresence />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
       />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
         />
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white text-center relative"></div>
            <motion.div
              className="absolute top-0 left-0 h-1 bg-white bg-opacity-30"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: timeLimit, ease: 'linear' }} />
            <h3 className="text-xl font-bold">Match Found!</h3>
            <div className="flex items-center justify-center space-x-2 text-blue-100"></div>
              <Clock className="w-4 h-4" />
              <p>Accept or decline within {timeLeft} seconds</p>
          </div>

          <div className="p-6"></div>
            <div className="flex items-center justify-between mb-6"></div>
              <div className="text-center flex-1"></div>
                <div className="text-sm text-gray-500 mb-2">You</div>
                <UnifiedPlayerCard player={player} variant="compact" size="small" showStats={false} />
                <div className="text-sm text-gray-500 mt-1"></div>
                  {player?.tier} {player?.division}
              </div>

              <div className="text-2xl font-bold text-gray-400 px-4">VS</div>

              <div className="text-center flex-1"></div>
                <div className="text-sm text-gray-500 mb-2">Opponent</div>
                <UnifiedPlayerCard
                  player={match.opponent}
                  variant="compact"
                  size="small"
                  showStats={false}
                />
                <div className="text-sm text-gray-500 mt-1"></div>
                  {match.opponent?.tier}
              </div>

            <div className="space-y-3 mb-6"></div>
              <div className="flex items-center justify-between text-sm"></div>
                <div className="text-gray-500">Format</div>
                <div className="font-medium">{match.format}
              </div>
              <div className="flex items-center justify-between text-sm"></div>
                <div className="text-gray-500">Game Mode</div>
                <div className="font-medium">{match.gameMode}
              </div>
              <div className="flex items-center justify-between text-sm"></div>
                <div className="text-gray-500">Estimated Duration</div>
                <div className="font-medium">{match.estimatedDuration}
              </div>
              {match.opponent.ping && (
                <div className="flex items-center justify-between text-sm"></div>
                  <div className="text-gray-500">Ping</div>
                  <div
                    className={`font-medium ${match.opponent.ping < 50 ? 'text-green-600' : match.opponent.ping < 100 ? 'text-yellow-600' : 'text-red-600'}`}></div>
                    {match.opponent.ping} ms
                  </div>
              )}
            </div>

            <div className="flex space-x-3"></div>
              <motion.button
                onClick={onDecline}
                className="flex-1 bg-red-100 text-red-600 py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
               />
                <X className="w-5 h-5" />
                <span>Decline</span>
              </motion.button>
              <motion.button
                onClick={onAccept}
                className="flex-1 bg-green-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
               />
                <CheckCircle className="w-5 h-5" />
                <span>Accept</span>
              </motion.button>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchFoundModal;