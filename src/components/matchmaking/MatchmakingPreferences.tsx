/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Laptop,
  Headphones,
  Trophy,
  Sliders,
} from 'lucide-react';

interface MatchmakingPreferencesProps {
  preferences
  onChange
  showAdvanced = true;
  isAdvancedOpen = false;
  onToggleAdvanced
}

const MatchmakingPreferences: React.FC<MatchmakingPreferencesProps> = ({ 
  preferences,
  onChange,
  showAdvanced = true,
  isAdvancedOpen = false,
  onToggleAdvanced,
 }) => {
  const skillRanges = [
    {
      id: 'strict',
      name: 'Strict',
      description: '±50 rating',
      waitTime: 'Longer',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: '±150 rating',
      waitTime: 'Medium',
    },
    {
      id: 'wide',
      name: 'Wide',
      description: '±300 rating',
      waitTime: 'Shorter',
    },
  ];

  const handleChange = (key, value): any => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-4" />
      <div />
        <label className="block text-sm font-medium text-gray-700 mb-2" />
          Skill Range
        </label>
        <div className="grid grid-cols-3 gap-2" />
          {skillRanges.map(range => (
            <motion.button
              key={range.id}
              onClick={() => handleChange('skillRange', range.id)}
              className={`p-3 rounded-lg border text-center transition-all ${
                preferences.skillRange === range.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-sm">{range.name}
              <div className="text-xs text-gray-500">{range.description}
              <div className="text-xs text-blue-600 mt-1">{range.waitTime}
            </motion.button>
          ))}
        </div>

      {showAdvanced && (
        <div />
          <div className="flex items-center justify-between mb-2" />
            <div className="flex items-center space-x-2" />
              <Sliders className="w-4 h-4 text-gray-500" / />
              <span className="text-sm font-medium text-gray-700" />
                Advanced Options
              </span>
            <button
              onClick={onToggleAdvanced}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
             />
              <span className="text-sm">Advanced</span>
              {isAdvancedOpen ? (
                <ChevronUp className="w-4 h-4" / />
              ) : (
                <ChevronDown className="w-4 h-4" / />
              )}
          </div>

          <AnimatePresence />
            {isAdvancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
               />
                <div className="grid grid-cols-2 gap-4 pt-2" />
                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-2" />
                      Game Mode
                    </label>
                    <select
                      value={preferences.gameMode}
                      onChange={e => handleChange('gameMode', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ranked">Ranked</option>
                      <option value="casual">Casual</option>
                      <option value="tournament">Tournament</option>
                  </div>

                  <div />
                    <label className="block text-sm font-medium text-gray-700 mb-2" />
                      Region
                    </label>
                    <select
                      value={preferences.region}
                      onChange={e => handleChange('region', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="auto">Auto (Best Ping)</option>
                      <option value="na-east">NA East</option>
                      <option value="na-west">NA West</option>
                      <option value="eu-west">EU West</option>
                      <option value="eu-east">EU East</option>
                      <option value="asia">Asia Pacific</option>
                      <option value="oceania">Oceania</option>
                  </div>

                {/* Note: KONIVRER is always best of 1, so this dropdown is not needed */}
                <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200" />
                  <div className="flex items-center space-x-2" />
                    <Trophy className="w-4 h-4 text-blue-500" / />
                    <span className="text-sm font-medium text-gray-700" />
                      Match Format: Best of 1
                    </span>
                  <p className="text-xs text-gray-500 mt-1 ml-6" />
                    KONIVRER matches are always played as best of 1
                  </p>

                <div className="mt-4 space-y-3" />
                  <div className="flex items-center justify-between" />
                    <div className="flex items-center space-x-2" />
                      <Laptop className="w-4 h-4 text-gray-500" / />
                      <span className="text-sm text-gray-700" />
                        Cross-Platform Play
                      </span>
                    <label className="relative inline-flex items-center cursor-pointer" />
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.crossPlay}
                        onChange={() = />
                          handleChange('crossPlay', !preferences.crossPlay)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>

                  <div className="flex items-center justify-between" />
                    <div className="flex items-center space-x-2" />
                      <Headphones className="w-4 h-4 text-gray-500" / />
                      <span className="text-sm text-gray-700">Voice Chat</span>
                    <label className="relative inline-flex items-center cursor-pointer" />
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.voiceChat}
                        onChange={() = />
                          handleChange('voiceChat', !preferences.voiceChat)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>

                  <div className="flex items-center justify-between" />
                    <div className="flex items-center space-x-2" />
                      <Trophy className="w-4 h-4 text-gray-500" / />
                      <span className="text-sm text-gray-700">Show Rank</span>
                    <label className="relative inline-flex items-center cursor-pointer" />
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.showRank}
                        onChange={() = />
                          handleChange('showRank', !preferences.showRank)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      )}
    </div>
  );
};

export default MatchmakingPreferences;