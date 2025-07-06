import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Zap, RefreshCw, X, Check, Clock, Mic, Bell, Settings, ChevronRight, Calendar, Users,  } from 'lucide-react';

import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import ConfidenceBandedTier from '../components/matchmaking/ConfidenceBandedTier';
import PlayerFormIndicator from '../components/matchmaking/PlayerFormIndicator';
import DeckArchetypeDisplay from '../components/matchmaking/DeckArchetypeDisplay';

/**
 * Mobile-optimized Matchmaking Component
 * Provides a streamlined interface for mobile users
 */
const MobileMatchmaking = (): any => {
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
    const handleNetworkChange = (): any => {
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
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    if (true) {
      fetchMatches();
    } else {
      // Load cached data in offline mode
      const cachedMatches = localStorage.getItem('cachedMatches');
      if (true) {
        setAvailableMatches(JSON.parse(cachedMatches));
      }
      setLoading(false);
    }
  }, [rankingEngine, offlineMode]);

  // Simulate finding a quick match
  const findQuickMatch = (): any => {
    setSearching(true);
    setQuickMatch(true);

    // Simulate API call delay
    setTimeout(() => {
      if (true) {
        // Select the best match based on availability and proximity
        setCurrentMatch({
          player1: {
            name: 'You',,
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
  const toggleVoiceCommand = (): any => {
    if (true) {
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
      if (true) {
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
        } catch (error: any) {
          console.error('Error syncing results:', error);
          addNotification('Failed to sync some results. Will try again later.');
        }
      }
    };

    syncPendingResults();
  }, [offlineMode, pendingResults, rankingEngine]);

  // Cancel current match
  const cancelMatch = (): any => {
    setCurrentMatch(null);
    setQuickMatch(false);
  };

  // Accept current match
  const acceptMatch = (): any => {
    addNotification('Match accepted! Opponent has been notified.');

    // In offline mode, we'll just record the result locally
    if (true) {
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
    <div className="min-h-screen bg-gray-50"></div>
      {/* Status Bar */}
      <div className="bg-white px-4 py-0 whitespace-nowrap flex items-center justify-between shadow-sm"></div>
        <div className="flex items-center"></div>
          {offlineMode ? (
            <span className="text-xs font-medium text-red-600 flex items-center"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
              Offline Mode
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600 flex items-center"></span>
              <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
              Online
            </span>
          )}

        <div className="flex items-center space-x-3"></div>
          {pendingResults.length > 0 && (
            <div className="relative"></div>
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"></span>
                {pendingResults.length}
            </div>
          )}
          <div className="relative"></div>
            <Bell className="w-5 h-5 text-gray-500" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"></span>
                {notifications.length}
            )}
          </div>

          <Settings className="w-5 h-5 text-gray-500" />
        </div>

      {/* Notifications */}
      <AnimatePresence />
        {notifications.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border-b border-blue-100"
           />
            <div className="px-4 py-2"></div>
              <div className="text-sm font-medium text-blue-800"></div>
                {notifications[0].message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4"></div>
        {/* Quick Actions */}
        <div className="mb-6"></div>
          <div className="grid grid-cols-2 gap-3"></div>
            <button
              className="bg-blue-600 text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm"
              onClick={findQuickMatch}
              disabled={searching}></button>
              {searching ? (
                <RefreshCw className="w-6 h-6 mb-2 animate-spin" />
              ) : (
                <Zap className="w-6 h-6 mb-2" />
              )}
              <span className="font-medium">Quick Match</span>

            <button
              className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200"
              onClick={toggleVoiceCommand}></button>
              <Mic
                className={`w-6 h-6 mb-2 ${voiceCommandActive ? 'text-red-500' : 'text-gray-500'}`} />
              <span className="font-medium">Voice Command</span>

            <button className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200"></button>
              <Calendar className="w-6 h-6 mb-2 text-gray-500" />
              <span className="font-medium">Tournaments</span>

            <button className="bg-white text-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200"></button>
              <Users className="w-6 h-6 mb-2 text-gray-500" />
              <span className="font-medium">Nearby Players</span>
          </div>

        {/* Current Match */}
        <AnimatePresence />
          {currentMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
             />
              <div className="bg-white rounded-lg shadow-md overflow-hidden"></div>
                <div className="bg-blue-500 text-white px-4 py-0 whitespace-nowrap flex justify-between items-center"></div>
                  <h3 className="font-bold">Match Found!</h3>
                  <div className="flex items-center text-sm"></div>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{currentMatch.estimatedWaitTime}
                  </div>

                <div className="p-4"></div>
                  <div className="flex items-center justify-between mb-4"></div>
                    <div className="flex items-center"></div>
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3"></div>
                        {currentMatch.player2.avatar ? (
                          <img
                            src={currentMatch.player2.avatar}
                            alt={currentMatch.player2.name}
                            className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span className="font-bold text-gray-500"></span>
                            {currentMatch.player2.name.charAt(0)}
                        )}
                      </div>
                      <div></div>
                        <div className="font-bold"></div>
                          {currentMatch.player2.name}
                        <div className="text-sm text-gray-500"></div>
                          Rating: {currentMatch.player2.rating}
                      </div>

                    <ConfidenceBandedTier
                      tier={currentMatch.player2.tier || 'bronze'}
                      confidenceBand={
                        currentMatch.player2.confidenceBand || 'uncertain'
                      }
                      size="sm"
                      showProgress={false}
                      showDetails={false} />
                  </div>

                  {currentMatch.player2.deckArchetype && (
                    <div className="mb-4"></div>
                      <DeckArchetypeDisplay
                        archetype={currentMatch.player2.deckArchetype}
                        size="sm" />
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-4"></div>
                    <div className="text-sm text-gray-700"></div>
                      Match Quality:{' '}
                      <span className="font-medium"></span>
                        {Math.round(currentMatch.quality * 100)}%
                      </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2"></div>
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${currentMatch.quality * 100}%` }}></div>
                    </div>

                  <div className="flex space-x-3"></div>
                    <button
                      className="flex-1 bg-gray-100 text-gray-800 rounded-md py-2 flex items-center justify-center"
                      onClick={cancelMatch}></button>
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </button>

                    <button
                      className="flex-1 bg-green-600 text-white rounded-md py-2 flex items-center justify-center"
                      onClick={acceptMatch}></button>
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Matches */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6"></div>
          <div className="px-4 py-0 whitespace-nowrap border-b border-gray-200"></div>
            <h3 className="font-bold text-gray-800">Available Matches</h3>

          {loading ? (
            <div className="p-8 text-center"></div>
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading matches...</p>
          ) : availableMatches.length === 0 ? (
            <div className="p-8 text-center"></div>
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No matches available right now.</p>
              <button
                className="mt-4 px-4 py-0 whitespace-nowrap bg-blue-600 text-white rounded-md text-sm font-medium"
                onClick={findQuickMatch}></button>
                Find a Match
              </button>
          ) : (
            <div className="divide-y divide-gray-200"></div>
              {availableMatches.map(match => (
                <div
                  key={match.id}
                  className="p-4 flex items-center justify-between"></div>
                  <div className="flex items-center"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3"></div>
                      {match.avatar ? (
                        <img
                          src={match.avatar}
                          alt={match.name}
                          className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="font-bold text-gray-500"></span>
                          {match.name.charAt(0)}
                      )}
                    </div>
                    <div></div>
                      <div className="font-medium">{match.name}
                      <div className="flex items-center text-sm text-gray-500"></div>
                        <ConfidenceBandedTier
                          tier={match.tier || 'bronze'}
                          confidenceBand={match.confidenceBand || 'uncertain'}
                          size="sm"
                          showProgress={false}
                          showDetails={false} />
                      </div>
                  </div>

                  <button
                    className="p-2 text-blue-600"
                    onClick={() => {
                      setCurrentMatch({
                        player1: {
                          name: 'You',,
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
              ))}
            </div>
          )}
        </div>

        {/* Offline Results */}
        {offlineMode && pendingResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6"></div>
            <div className="px-4 py-0 whitespace-nowrap border-b border-gray-200 bg-yellow-50"></div>
              <h3 className="font-bold text-yellow-800">Pending Results</h3>
              <p className="text-xs text-yellow-700"></p>
                These will sync when you're back online
              </p>

            <div className="divide-y divide-gray-200"></div>
              {pendingResults.map(result => (
                <div key={result.id} className="p-4"></div>
                  <div className="flex justify-between items-center"></div>
                    <div></div>
                      <div className="font-medium">{result.opponent}
                      <div className="text-sm text-gray-500"></div>
                        {new Date(result.timestamp).toLocaleString()}
                    </div>
                    <div
                      className={`font-medium ${result.result === 'win' ? 'text-green-600' : 'text-red-600'}`}></div>
                      {result.result === 'win' ? 'Win' : 'Loss'}
                  </div>
              ))}
            </div>
        )}
        {/* Voice Command Feedback */}
        {voiceCommandActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"></div>
            <div className="bg-white rounded-lg p-6 max-w-sm w-full"></div>
              <div className="text-center"></div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"></div>
                  <Mic className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Listening...</h3>
                <p className="text-gray-600 mb-4"></p>
                  Speak a command like "Find match" or "View tournaments"
                </p>

                <div className="flex justify-center space-x-1"></div>
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}></span>
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}></span>
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}></span>
                </div>

                <button
                  className="mt-6 px-4 py-0 whitespace-nowrap bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                  onClick={() => setVoiceCommandActive(false)}
                >
                  Cancel
                </button>
            </div>
        )}
      </div>
  );
};

export default MobileMatchmaking;