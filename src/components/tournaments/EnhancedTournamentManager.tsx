/**
 * Enhanced Tournament Manager Component
 * 
 * Advanced tournament management with enhanced features and real-time updates.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  Shuffle,
  Award,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Layers,
  Filter,
  Bell,
  MessageSquare,
  Clipboard,
  Calendar,
  MapPin,
  Trophy,
  Target,
  TrendingUp,
  Settings,
  Play,
  Pause,
  Square,
  BarChart3,
  Activity,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Upload,
} from 'lucide-react';

// Types
interface Player {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  deck?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'in-game';
  location?: string;
  preferences?: {
    timeSlots: string[];
    formats: string[];
  };
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  winner?: Player;
  status: 'pending' | 'in-progress' | 'completed' | 'disputed';
  round: number;
  startTime?: Date;
  endTime?: Date;
  quality: number; // 0-100 match quality score
  venue?: string;
  notes?: string;
}

interface Tournament {
  id: string;
  name: string;
  description: string;
  format: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss';
  status: 'draft' | 'registration' | 'in-progress' | 'completed' | 'cancelled';
  maxPlayers: number;
  currentPlayers: number;
  startDate: Date;
  endDate?: Date;
  location?: string;
  prizePool?: number;
  entryFee?: number;
  players: Player[];
  matches: Match[];
  rounds: number;
  currentRound: number;
  settings: TournamentSettings;
  metadata: {
    created: Date;
    createdBy: string;
    lastModified: Date;
    version: number;
  };
}

interface TournamentSettings {
  allowLateRegistration: boolean;
  autoAdvanceRounds: boolean;
  matchTimeLimit: number; // minutes
  breakDuration: number; // minutes between rounds
  tiebreakers: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  streaming: {
    enabled: boolean;
    platform?: string;
    url?: string;
  };
}

interface MatchQuality {
  overall: number;
  skillBalance: number;
  deckDiversity: number;
  historicalPerformance: number;
  geographicProximity: number;
}

/**
 * Enhanced Tournament Manager Component
 */
const EnhancedTournamentManager: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
  }>>([]);

  // Real-time updates simulation
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Load tournaments on mount
  useEffect(() => {
    loadTournaments();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadTournaments = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'KONIVRER World Championship 2024',
          description: 'The ultimate tournament for the world\'s best players',
          format: 'single-elimination',
          status: 'in-progress',
          maxPlayers: 128,
          currentPlayers: 64,
          startDate: new Date('2024-07-15'),
          endDate: new Date('2024-07-17'),
          location: 'Convention Center, Las Vegas',
          prizePool: 50000,
          entryFee: 100,
          players: [],
          matches: [],
          rounds: 7,
          currentRound: 3,
          settings: {
            allowLateRegistration: false,
            autoAdvanceRounds: true,
            matchTimeLimit: 60,
            breakDuration: 15,
            tiebreakers: ['head-to-head', 'buchholz', 'sonneborn-berger'],
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            streaming: {
              enabled: true,
              platform: 'Twitch',
              url: 'https://twitch.tv/konivrer',
            },
          },
          metadata: {
            created: new Date('2024-06-01'),
            createdBy: 'admin',
            lastModified: new Date(),
            version: 1,
          },
        },
        {
          id: '2',
          name: 'Weekly Swiss Tournament',
          description: 'Regular weekly tournament for all skill levels',
          format: 'swiss',
          status: 'registration',
          maxPlayers: 32,
          currentPlayers: 18,
          startDate: new Date('2024-07-20'),
          location: 'Local Game Store',
          prizePool: 500,
          entryFee: 15,
          players: [],
          matches: [],
          rounds: 5,
          currentRound: 0,
          settings: {
            allowLateRegistration: true,
            autoAdvanceRounds: false,
            matchTimeLimit: 45,
            breakDuration: 10,
            tiebreakers: ['match-points', 'opponent-match-win-percentage'],
            notifications: {
              email: true,
              sms: false,
              push: true,
            },
            streaming: {
              enabled: false,
            },
          },
          metadata: {
            created: new Date('2024-07-01'),
            createdBy: 'store-manager',
            lastModified: new Date(),
            version: 2,
          },
        },
      ];
      
      setTournaments(mockTournaments);
      if (!selectedTournament && mockTournaments.length > 0) {
        setSelectedTournament(mockTournaments[0]);
      }
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      addNotification('error', 'Failed to load tournaments');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = useCallback(async (): Promise<void> => {
    try {
      // Simulate real-time updates
      setLastUpdate(new Date());
      
      // Update tournament data
      setTournaments(prev => prev.map(tournament => ({
        ...tournament,
        metadata: {
          ...tournament.metadata,
          lastModified: new Date(),
        },
      })));
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, []);

  const addNotification = (type: 'info' | 'warning' | 'error' | 'success', message: string): void => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const calculateMatchQuality = (player1: Player, player2: Player): MatchQuality => {
    // Simulate match quality calculation
    const ratingDiff = Math.abs(player1.rating - player2.rating);
    const skillBalance = Math.max(0, 100 - (ratingDiff / 10));
    
    return {
      overall: Math.floor(Math.random() * 30) + 70, // 70-100
      skillBalance,
      deckDiversity: Math.floor(Math.random() * 40) + 60,
      historicalPerformance: Math.floor(Math.random() * 30) + 70,
      geographicProximity: Math.floor(Math.random() * 50) + 50,
    };
  };

  const startTournament = (tournamentId: string): void => {
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId 
        ? { ...t, status: 'in-progress' as const }
        : t
    ));
    addNotification('success', 'Tournament started successfully');
  };

  const pauseTournament = (tournamentId: string): void => {
    addNotification('info', 'Tournament paused');
  };

  const advanceRound = (tournamentId: string): void => {
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId 
        ? { ...t, currentRound: t.currentRound + 1 }
        : t
    ));
    addNotification('success', 'Advanced to next round');
  };

  const getStatusColor = (status: Tournament['status']): string => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'registration': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'matches', label: 'Matches', icon: Shuffle },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enhanced Tournament Manager</h1>
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Auto Refresh</span>
              </button>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="fixed top-20 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg bg-white border-l-4 ${
                  notification.type === 'success' ? 'border-green-500' :
                  notification.type === 'warning' ? 'border-yellow-500' :
                  notification.type === 'error' ? 'border-red-500' :
                  'border-blue-500'
                }`}
              >
                {getNotificationIcon(notification.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.timestamp.toLocaleTimeString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tournament List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Tournaments</h3>
                <div className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {tournaments.map((tournament) => (
                  <button
                    key={tournament.id}
                    onClick={() => setSelectedTournament(tournament)}
                    className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                      selectedTournament?.id === tournament.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{tournament.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                        {tournament.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {tournament.currentPlayers}/{tournament.maxPlayers}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {tournament.startDate.toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTournament ? (
              <div className="space-y-6">
                {/* Tournament Header */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTournament.name}</h2>
                      <p className="text-gray-600">{selectedTournament.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedTournament.status === 'registration' && (
                        <button
                          onClick={() => startTournament(selectedTournament.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </button>
                      )}
                      {selectedTournament.status === 'in-progress' && (
                        <>
                          <button
                            onClick={() => pauseTournament(selectedTournament.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </button>
                          <button
                            onClick={() => advanceRound(selectedTournament.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                            <span>Next Round</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tournament Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedTournament.currentPlayers}</div>
                      <div className="text-sm text-gray-500">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedTournament.currentRound}</div>
                      <div className="text-sm text-gray-500">Current Round</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">${selectedTournament.prizePool?.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedTournament.format.toUpperCase()}</div>
                      <div className="text-sm text-gray-500">Format</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
                  <div className="border-b">
                    <nav className="flex space-x-8 px-6">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tournament Overview</h3>
                            <p className="text-gray-600">Detailed tournament information and statistics</p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'matches' && (
                        <motion.div
                          key="matches"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="text-center py-12">
                            <Shuffle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Match Management</h3>
                            <p className="text-gray-600">View and manage tournament matches</p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'players' && (
                        <motion.div
                          key="players"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Player Management</h3>
                            <p className="text-gray-600">Manage tournament participants</p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'settings' && (
                        <motion.div
                          key="settings"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="text-center py-12">
                            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tournament Settings</h3>
                            <p className="text-gray-600">Configure tournament parameters</p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'analytics' && (
                        <motion.div
                          key="analytics"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="text-center py-12">
                            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tournament Analytics</h3>
                            <p className="text-gray-600">Detailed performance analytics and insights</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tournament Selected</h3>
                <p className="text-gray-600">Select a tournament from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTournamentManager;