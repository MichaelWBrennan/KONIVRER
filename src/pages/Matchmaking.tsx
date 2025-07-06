/**
 * Matchmaking Page
 * 
 * Advanced matchmaking system for KONIVRER tournaments and casual play.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Clock,
  Trophy,
  Zap,
  Settings,
  Play,
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Star,
  Shield,
  Timer,
  MapPin,
  Globe,
  Plus,
  Edit,
  Trash2,
  Filter,
  Shuffle,
  Target,
  Activity,
} from 'lucide-react';

// Types
interface Player {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  status: 'online' | 'offline' | 'in-game';
  location?: string;
  preferredFormats: string[];
  avatar?: string;
}

interface MatchmakingPreferences {
  format: string;
  skillRange: number;
  maxWaitTime: number;
  allowCrossRegion: boolean;
  preferredTime: string;
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  format: string;
  estimatedDuration: number;
  quality: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
}

/**
 * Matchmaking Page Component
 */
const Matchmaking: React.FC = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [preferences, setPreferences] = useState<MatchmakingPreferences>({
    format: 'standard',
    skillRange: 200,
    maxWaitTime: 300,
    allowCrossRegion: false,
    preferredTime: 'any',
  });
  const [searchTime, setSearchTime] = useState<number>(0);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);

  // Search timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  // Load initial data
  useEffect(() => {
    loadOnlinePlayers();
    loadRecentMatches();
  }, []);

  const loadOnlinePlayers = async (): Promise<void> => {
    // Simulate API call
    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'DragonMaster',
        rating: 1850,
        wins: 127,
        losses: 43,
        status: 'online',
        location: 'US-West',
        preferredFormats: ['standard', 'draft'],
      },
      {
        id: '2',
        name: 'ElementalWizard',
        rating: 1720,
        wins: 89,
        losses: 67,
        status: 'online',
        location: 'EU-Central',
        preferredFormats: ['standard', 'legacy'],
      },
      {
        id: '3',
        name: 'ShadowRogue',
        rating: 1950,
        wins: 203,
        losses: 78,
        status: 'in-game',
        location: 'US-East',
        preferredFormats: ['competitive', 'standard'],
      },
    ];
    setOnlinePlayers(mockPlayers);
  };

  const loadRecentMatches = async (): Promise<void> => {
    // Simulate API call
    const mockMatches: Match[] = [
      {
        id: '1',
        player1: { id: '1', name: 'You', rating: 1650, wins: 45, losses: 23, status: 'online', preferredFormats: [] },
        player2: { id: '2', name: 'FireElemental', rating: 1680, wins: 52, losses: 31, status: 'offline', preferredFormats: [] },
        format: 'standard',
        estimatedDuration: 45,
        quality: 92,
        status: 'completed',
      },
    ];
    setRecentMatches(mockMatches);
  };

  const startMatchmaking = (): void => {
    setIsSearching(true);
    setSearchTime(0);
    
    // Simulate finding a match
    setTimeout(() => {
      const mockMatch: Match = {
        id: Date.now().toString(),
        player1: { id: 'you', name: 'You', rating: 1650, wins: 45, losses: 23, status: 'online', preferredFormats: [] },
        player2: onlinePlayers[Math.floor(Math.random() * onlinePlayers.length)],
        format: preferences.format,
        estimatedDuration: 45,
        quality: Math.floor(Math.random() * 20) + 80,
        status: 'pending',
      };
      setCurrentMatch(mockMatch);
      setIsSearching(false);
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  };

  const cancelMatchmaking = (): void => {
    setIsSearching(false);
    setCurrentMatch(null);
    setSearchTime(0);
  };

  const acceptMatch = (): void => {
    if (currentMatch) {
      setCurrentMatch({ ...currentMatch, status: 'accepted' });
      // Redirect to game or show game interface
    }
  };

  const declineMatch = (): void => {
    setCurrentMatch(null);
    // Optionally restart search
  };

  const updatePreference = (key: keyof MatchmakingPreferences, value: any): void => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Player['status']): string => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'in-game': return 'text-yellow-600';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Player['status']) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'in-game': return <Play className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Matchmaking</h1>
          <p className="text-xl text-gray-600">Find your perfect opponent</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Matchmaking Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Matchmaking Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={preferences.format}
                    onChange={(e) => updatePreference('format', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="draft">Draft</option>
                    <option value="legacy">Legacy</option>
                    <option value="competitive">Competitive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Range: ±{preferences.skillRange}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={preferences.skillRange}
                    onChange={(e) => updatePreference('skillRange', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Wait Time: {Math.floor(preferences.maxWaitTime / 60)}m
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="600"
                    step="60"
                    value={preferences.maxWaitTime}
                    onChange={(e) => updatePreference('maxWaitTime', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="crossRegion"
                    checked={preferences.allowCrossRegion}
                    onChange={(e) => updatePreference('allowCrossRegion', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="crossRegion" className="ml-2 block text-sm text-gray-900">
                    Allow cross-region matches
                  </label>
                </div>
              </div>
            </div>

            {/* Matchmaking Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                {!isSearching && !currentMatch && (
                  <div>
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Play</h3>
                    <p className="text-gray-600 mb-6">Click the button below to start matchmaking</p>
                    <button
                      onClick={startMatchmaking}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Search className="w-5 h-5" />
                      <span>Find Match</span>
                    </button>
                  </div>
                )}

                {isSearching && (
                  <div>
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Searching for Opponent</h3>
                    <p className="text-gray-600 mb-2">Search time: {formatTime(searchTime)}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Looking for players with rating {1650 - preferences.skillRange} - {1650 + preferences.skillRange}
                    </p>
                    <button
                      onClick={cancelMatchmaking}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mx-auto"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel Search</span>
                    </button>
                  </div>
                )}

                {currentMatch && currentMatch.status === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-green-200 rounded-lg p-6 bg-green-50"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Match Found!</h3>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="font-medium">You</p>
                          <p className="text-sm text-gray-500">Rating: 1650</p>
                        </div>
                        <div className="text-center">
                          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">VS</p>
                          <p className="text-xs text-gray-500">Quality: {currentMatch.quality}%</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <p className="font-medium">{currentMatch.player2.name}</p>
                          <p className="text-sm text-gray-500">Rating: {currentMatch.player2.rating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={acceptMatch}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={declineMatch}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Players */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Online Players</h3>
                <p className="text-sm text-gray-500">{onlinePlayers.filter(p => p.status === 'online').length} online</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {onlinePlayers.map((player) => (
                  <div key={player.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                        <p className="text-sm text-gray-500">Rating: {player.rating}</p>
                      </div>
                      <div className={`flex items-center space-x-1 ${getStatusColor(player.status)}`}>
                        {getStatusIcon(player.status)}
                        <span className="text-xs capitalize">{player.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Matches</h3>
              </div>
              <div className="p-4">
                {recentMatches.length > 0 ? (
                  <div className="space-y-3">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{match.player2.name}</span>
                          <span className="text-xs text-gray-500">{match.format}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Quality: {match.quality}%</span>
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent matches</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;