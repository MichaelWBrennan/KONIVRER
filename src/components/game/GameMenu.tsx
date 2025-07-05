import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { motion } from 'framer-motion';
import {
  X,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Flag,
  HelpCircle,
  Brain,
  Zap,
  TestTube,
  Eye,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Game menu with options like settings, concede, etc.
 */
interface GameMenuProps {
  onClose
  onAction
  gameMode
  aiTestingEnabled = false;
}

const GameMenu: React.FC<GameMenuProps> = ({  onClose, onAction, gameMode, aiTestingEnabled = false  }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
    ></motion>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-xl"
      ></motion>
        <div className="flex items-center justify-between mb-6"></div>
          <h2 className="text-white text-xl font-bold">Game Menu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"></button>
            <X className="w-6 h-6" /></X>
          </button>
        </div>

        <div className="space-y-4"></div>
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3"></div>
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-400" /></Volume2>
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" /></VolumeX>
              )}
              <span className="text-white">Sound Effects</span>
            </div>
            <div
              className={`w-10 h-6 rounded-full flex items-center ${soundEnabled ? 'bg-blue-600 justify-end' : 'bg-gray-600 justify-start'}`}
            ></div>
              <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
            </div>
          </button>

          {/* Settings */}
          <button className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"></button>
            <Settings className="w-5 h-5 text-purple-400" /></Settings>
            <span className="text-white">Game Settings</span>
          </button>

          {/* AI Testing Mode Toggle */}
          {gameMode === 'ai' && (
            <button
              onClick={() => {
                onAction('toggleAITesting');
                setShowAIPanel(!showAIPanel);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg ${
                aiTestingEnabled 
                  ? 'bg-blue-900 hover:bg-blue-800 border border-blue-400' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3"></div>
                <Brain className={`w-5 h-5 ${aiTestingEnabled ? 'text-blue-300' : 'text-blue-400'}`} /></Brain>
                <span className="text-white">AI Testing Mode</span>
              </div>
              <div className="flex items-center space-x-2"></div>
                {aiTestingEnabled && <Activity className="w-4 h-4 text-blue-300 animate-pulse" />}
                <div
                  className={`w-10 h-6 rounded-full flex items-center ${
                    aiTestingEnabled ? 'bg-blue-600 justify-end' : 'bg-gray-600 justify-start'
                  }`}
                ></div>
                  <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                </div>
              </div>
            </button>
          )}
          {/* AI Consciousness Panel Toggle */}
          {gameMode === 'ai' && aiTestingEnabled && (
            <button
              onClick={() => {
                onAction('toggleAIPanel');
                setShowAIPanel(!showAIPanel);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                showAIPanel 
                  ? 'bg-purple-900 hover:bg-purple-800 border border-purple-400' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Eye className={`w-5 h-5 ${showAIPanel ? 'text-purple-300' : 'text-purple-400'}`} /></Eye>
              <span className="text-white">AI Consciousness Panel</span>
              {showAIPanel && <Zap className="w-4 h-4 text-purple-300 animate-pulse" />}
            </button>
          )}
          {/* Performance Testing */}
          {gameMode === 'ai' && aiTestingEnabled && (
            <button
              onClick={() => {
                onAction('runPerformanceTest');
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 bg-green-900 hover:bg-green-800 rounded-lg border border-green-400"
            >
              <TestTube className="w-5 h-5 text-green-300" /></TestTube>
              <span className="text-white">Run AI Performance Test</span>
            </button>
          )}
          {/* Help */}
          <button className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"></button>
            <HelpCircle className="w-5 h-5 text-green-400" /></HelpCircle>
            <span className="text-white">Game Rules</span>
          </button>

          {/* Concede */}
          <button
            onClick={() => {
              onAction('concede');
              onClose();
            }}
            className="w-full flex items-center space-x-3 p-3 bg-red-900 hover:bg-red-800 rounded-lg"
          >
            <Flag className="w-5 h-5 text-red-300" /></Flag>
            <span className="text-white">Concede Game</span>
          </button>

          {/* Return to Home */}
          <Link
            to="/"
            className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          ></Link>
            <Home className="w-5 h-5 text-blue-400" /></Home>
            <span className="text-white">Exit to Main Menu</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameMenu;