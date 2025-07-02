/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Zap,
  RefreshCw,
  X,
  Check,
  Clock,
  Mic,
  Bell,
  Settings,
  ChevronRight,
  Calendar,
  Users,
} from 'lucide-react';

import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import ConfidenceBandedTier from '../components/matchmaking/ConfidenceBandedTier';
import PlayerFormIndicator from '../components/matchmaking/PlayerFormIndicator';
import DeckArchetypeDisplay from '../components/matchmaking/DeckArchetypeDisplay';

/**
 * Mobile-optimized Matchmaking Component
 * Provides a streamlined interface for mobile users
 */
const MobileMatchmaking = () => {
  const { rankingEngine } = usePhysicalMatchmaking();

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [quickMatch, setQuickMatch] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [availableMatches, setAvailableMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [voiceCommandActive, setVoiceCommandActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [pendingResults, setPendingResults] = useState([]);

  // Check for network status
  useEffect(() => {
    const handleNetworkChange = () => {
      setOfflineMode(!navigator.onLine);
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Initial check
    setOfflineMode(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  // Load available matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from your API
        const matchesData = await rankingEngine.getAvailableMatches();
        setAvailableMatches(matchesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    if (!offlineMode) {
      fetchMatches();
    } else {
      // Load cached data in offline mode
      const cachedMatches = localStorage.getItem('cachedMatches');
      if (cachedMatches) {
        setAvailableMatches(JSON.parse(cachedMatches));
      }
      setLoading(false);
    }
  }, [rankingEngine, offlineMode]);

  // Simulate finding a quick match
  const findQuickMatch = () => {
    setSearching(true);
    setQuickMatch(true);

    // Simulate API call delay
    setTimeout(() => {
      if (availableMatches.length > 0) {
        // Select the best match based on availability and proximity
        setCurrentMatch({
          player1: {
            name: 'You',
            tier: 'gold',
            confidenceBand: 'established',
            rating: 1500,
          },
          player2: availableMatches[0],
          quality: 0.85,
          estimatedWaitTime: '< 1 min',
        });
      } else {
        // No matches available
        addNotification('No matches available right now. Try again later.');
      }

      setSearching(false);
    }, 1500);
  };

  // Handle voice commands
  const toggleVoiceCommand = () => {
    if (!voiceCommandActive) {
      setVoiceCommandActive(true);

      // Simulate voice recognition
      setTimeout(() => {
        addNotification('Voice command recognized: "Find match"');
        findQuickMatch();
        setVoiceCommandActive(false);
      }, 2000);
    } else {
      setVoiceCommandActive(false);
    }
  };

  // Add a notification
  const addNotification = message => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // Report match result in offline mode
  const reportOfflineResult = result => {
    const newResult = {
      id: Date.now(),
      opponent: currentMatch.player2.name,
      result,
      timestamp: new Date().toISOString(),
    };

    setPendingResults(prev => [newResult, ...prev]);
    localStorage.setItem(
      'pendingResults',
      JSON.stringify([newResult, ...pendingResults]),
    );

    addNotification(`Result recorded offline. Will sync when online.`);
    setCurrentMatch(null);
  };

  // Sync pending results when back online
  useEffect(() => {
    const syncPendingResults = async () => {
      if (!offlineMode && pendingResults.length > 0) {
        try {
          // In a real app, this would call your API
          await Promise.all(
            pendingResults.map(result =>
              rankingEngine.reportMatchResult(result.id, result.result),
            ),
          );

          addNotification(`Synced ${pendingResults.length} offline results`);
          setPendingResults([]);
          localStorage.removeItem('pendingResults');
        } catch (error) {
          console.error('Error syncing results:', error);
          addNotification('Failed to sync some results. Will try again later.');
        }
      }
    };

    syncPendingResults();
  }, [offlineMode, pendingResults, rankingEngine]);

  // Cancel current match
  const cancelMatch = () => {
    setCurrentMatch(null);
    setQuickMatch(false);
  };

  // Accept current match
  const acceptMatch = () => {
    addNotification('Match accepted! Opponent has been notified.');

    // In offline mode, we'll just record the result locally
    if (offlineMode) {
      setTimeout(() => {
        addNotification('Ready to record match result');
      }, 1000);
    } else {
      // In online mode, we'd notify the opponent
      setTimeout(() => {
        addNotification('Opponent has accepted the match!');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          {offlineMode ? (
            <span className="text-xs font-medium text-red-600 flex items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
              Offline Mode
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
              Online
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {pendingResults.length > 0 && (
            <div className="relative">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {pendingResults.length}
              </span>
            </div>
          )}

          <div className="relative">
            <Bell className="w-5 h-5 text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>

          <Settings className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border-b border-blue-100"
          >
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-blue-800">
                {notifications[0].message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-blue-600 text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm"
              onClick={findQuickMatch}
              disabled={searching}
            >
              {searching ? (
                <RefreshCw className="w-6 h-6 mb-2 animate-spin" />
              ) : (
                <Zap className="w-6 h-6 mb-2" />
              )}
              <span className="font-medium">Quick Match</span>
            </button>

            <button
              className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200"
              onClick={toggleVoiceCommand}
            >
              <Mic
                className={`w-6 h-6 mb-2 ${voiceCommandActive ? 'text-red-500' : 'text-gray-500'}`}
              />
              <span className="font-medium">Voice Command</span>
            </button>

            <button className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200">
              <Calendar className="w-6 h-6 mb-2 text-gray-500" />
              <span className="font-medium">Tournaments</span>
            </button>

            <button className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200">
              <Users className="w-6 h-6 mb-2 text-gray-500" />
              <span className="font-medium">Nearby Players</span>
            </button>
          </div>
        </div>

        {/* Current Match */}
        <AnimatePresence>
          {currentMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
                  <h3 className="font-bold">Match Found!</h3>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{currentMatch.estimatedWaitTime}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {currentMatch.player2.avatar ? (
                          <img
                            src={currentMatch.player2.avatar}
                            alt={currentMatch.player2.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-gray-500">
                            {currentMatch.player2.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold">
                          {currentMatch.player2.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rating: {currentMatch.player2.rating}
                        </div>
                      </div>
                    </div>

                    <ConfidenceBandedTier
                      tier={currentMatch.player2.tier || 'bronze'}
                      confidenceBand={
                        currentMatch.player2.confidenceBand || 'uncertain'
                      }
                      size="sm"
                      showProgress={false}
                      showDetails={false}
                    />
                  </div>

                  {currentMatch.player2.deckArchetype && (
                    <div className="mb-4">
                      <DeckArchetypeDisplay
                        archetype={currentMatch.player2.deckArchetype}
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-700">
                      Match Quality:{' '}
                      <span className="font-medium">
                        {Math.round(currentMatch.quality * 100)}%
                      </span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${currentMatch.quality * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className="flex-1 bg-gray-100 text-gray-800 rounded-md py-2 flex items-center justify-center"
                      onClick={cancelMatch}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </button>

                    <button
                      className="flex-1 bg-green-600 text-white rounded-md py-2 flex items-center justify-center"
                      onClick={acceptMatch}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Matches */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Available Matches</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading matches...</p>
            </div>
          ) : availableMatches.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No matches available right now.</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
                onClick={findQuickMatch}
              >
                Find a Match
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {availableMatches.map(match => (
                <div
                  key={match.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {match.avatar ? (
                        <img
                          src={match.avatar}
                          alt={match.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-gray-500">
                          {match.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{match.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ConfidenceBandedTier
                          tier={match.tier || 'bronze'}
                          confidenceBand={match.confidenceBand || 'uncertain'}
                          size="sm"
                          showProgress={false}
                          showDetails={false}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="p-2 text-blue-600"
                    onClick={() => {
                      setCurrentMatch({
                        player1: {
                          name: 'You',
                          tier: 'gold',
                          confidenceBand: 'established',
                          rating: 1500,
                        },
                        player2: match,
                        quality: 0.75 + Math.random() * 0.2,
                        estimatedWaitTime: '< 1 min',
                      });
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offline Results */}
        {offlineMode && pendingResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-yellow-50">
              <h3 className="font-bold text-yellow-800">Pending Results</h3>
              <p className="text-xs text-yellow-700">
                These will sync when you're back online
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {pendingResults.map(result => (
                <div key={result.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{result.opponent}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={`font-medium ${result.result === 'win' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {result.result === 'win' ? 'Win' : 'Loss'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Command Feedback */}
        {voiceCommandActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Listening...</h3>
                <p className="text-gray-600 mb-4">
                  Speak a command like "Find match" or "View tournaments"
                </p>

                <div className="flex justify-center space-x-1">
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></span>
                </div>

                <button
                  className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                  onClick={() => setVoiceCommandActive(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMatchmaking;
