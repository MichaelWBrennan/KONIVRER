/**
 * Tournament Manager Component
 * 
 * Comprehensive tournament management system with advanced features.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Trophy,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  MapPin,
  Star,
  Award,
  Target,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Brain,
  Zap,
  TrendingUp,
  Shuffle,
  Activity,
  Sliders,
  Info,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  Eye,
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
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  winner?: Player;
  status: 'pending' | 'in-progress' | 'completed';
  round: number;
  startTime?: Date;
  endTime?: Date;
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
}

interface MatchmakingSettings {
  enabled: boolean;
  algorithm: 'bayesian' | 'elo' | 'random' | 'skill-based';
  skillVariance: number;
  deckDiversityWeight: number;
  historicalWeight: number;
  geographicWeight: number;
  timePreferenceWeight: number;
  adaptivePairing: boolean;
  antiCollusion: boolean;
  balanceExperience: boolean;
}

interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  totalPlayers: number;
  averageRating: number;
  completionRate: number;
  popularFormats: Array<{ format: string; count: number }>;
}

/**
 * Tournament Manager Component
 */
const TournamentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [matchmakingSettings, setMatchmakingSettings] = useState<MatchmakingSettings>({
    enabled: true,
    algorithm: 'bayesian',
    skillVariance: 0.3,
    deckDiversityWeight: 0.4,
    historicalWeight: 0.6,
    geographicWeight: 0.2,
    timePreferenceWeight: 0.3,
    adaptivePairing: true,
    antiCollusion: true,
    balanceExperience: true,
  });

  const [stats, setStats] = useState<TournamentStats>({
    totalTournaments: 0,
    activeTournaments: 0,
    totalPlayers: 0,
    averageRating: 0,
    completionRate: 0,
    popularFormats: [],
  });

  // Load tournaments on mount
  useEffect(() => {
    loadTournaments();
    loadStats();
  }, []);

  const loadTournaments = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'KONIVRER Championship 2024',
          description: 'Annual championship tournament with the best players worldwide',
          format: 'single-elimination',
          status: 'registration',
          maxPlayers: 64,
          currentPlayers: 42,
          startDate: new Date('2024-08-15'),
          location: 'Online',
          prizePool: 10000,
          entryFee: 50,
          players: [],
          matches: [],
          rounds: 6,
          currentRound: 0,
        },
        {
          id: '2',
          name: 'Weekly Swiss Tournament',
          description: 'Regular weekly tournament for all skill levels',
          format: 'swiss',
          status: 'in-progress',
          maxPlayers: 32,
          currentPlayers: 28,
          startDate: new Date('2024-07-06'),
          location: 'Local Game Store',
          prizePool: 500,
          entryFee: 10,
          players: [],
          matches: [],
          rounds: 5,
          currentRound: 3,
        },
      ];
      
      setTournaments(mockTournaments);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        totalTournaments: 156,
        activeTournaments: 8,
        totalPlayers: 2847,
        averageRating: 1650,
        completionRate: 94.2,
        popularFormats: [
          { format: 'Swiss', count: 45 },
          { format: 'Single Elimination', count: 38 },
          { format: 'Double Elimination', count: 22 },
          { format: 'Round Robin', count: 15 },
        ],
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const createTournament = (): void => {
    // Implementation for creating new tournament
    console.log('Creating new tournament...');
  };

  const editTournament = (tournament: Tournament): void => {
    setSelectedTournament(tournament);
    setActiveTab('edit');
  };

  const deleteTournament = (tournamentId: string): void => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      setTournaments(prev => prev.filter(t => t.id !== tournamentId));
    }
  };

  const startTournament = (tournamentId: string): void => {
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId 
        ? { ...t, status: 'in-progress' as const }
        : t
    ));
  };

  const updateMatchmakingSetting = (key: keyof MatchmakingSettings, value: any): void => {
    setMatchmakingSettings(prev => ({ ...prev, [key]: value }));
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tournament.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'matchmaking', label: 'Matchmaking', icon: Shuffle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tournament Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={createTournament}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Tournament</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Trophy className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Activity className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeTournaments}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Players</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPlayers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tournaments */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Recent Tournaments</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {tournaments.slice(0, 5).map((tournament) => (
                      <div key={tournament.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Trophy className="w-6 h-6 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                            <p className="text-sm text-gray-500">
                              {tournament.currentPlayers}/{tournament.maxPlayers} players
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                            {tournament.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <button
                            onClick={() => editTournament(tournament)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tournaments' && (
            <motion.div
              key="tournaments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tournaments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="registration">Registration</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>More Filters</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tournaments List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Tournaments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tournament
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Players
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTournaments.map((tournament) => (
                        <tr key={tournament.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                              <div className="text-sm text-gray-500">{tournament.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tournament.format.replace('-', ' ').toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tournament.currentPlayers}/{tournament.maxPlayers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                              {tournament.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tournament.startDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editTournament(tournament)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTournament(tournament.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {tournament.status === 'registration' && (
                                <button
                                  onClick={() => startTournament(tournament.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'matchmaking' && (
            <motion.div
              key="matchmaking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Matchmaking Settings</h3>
                  <p className="text-sm text-gray-500">Configure advanced matchmaking algorithms</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Algorithm Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matchmaking Algorithm
                    </label>
                    <select
                      value={matchmakingSettings.algorithm}
                      onChange={(e) => updateMatchmakingSetting('algorithm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bayesian">Bayesian Skill Rating</option>
                      <option value="elo">ELO Rating System</option>
                      <option value="skill-based">Skill-Based Matching</option>
                      <option value="random">Random Pairing</option>
                    </select>
                  </div>

                  {/* Settings Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Adaptive Pairing</label>
                        <p className="text-xs text-gray-500">Adjust pairings based on performance</p>
                      </div>
                      <button
                        onClick={() => updateMatchmakingSetting('adaptivePairing', !matchmakingSettings.adaptivePairing)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          matchmakingSettings.adaptivePairing ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            matchmakingSettings.adaptivePairing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Anti-Collusion</label>
                        <p className="text-xs text-gray-500">Prevent suspicious match patterns</p>
                      </div>
                      <button
                        onClick={() => updateMatchmakingSetting('antiCollusion', !matchmakingSettings.antiCollusion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          matchmakingSettings.antiCollusion ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            matchmakingSettings.antiCollusion ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Weight Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Variance Weight: {matchmakingSettings.skillVariance}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={matchmakingSettings.skillVariance}
                        onChange={(e) => updateMatchmakingSetting('skillVariance', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deck Diversity Weight: {matchmakingSettings.deckDiversityWeight}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={matchmakingSettings.deckDiversityWeight}
                        onChange={(e) => updateMatchmakingSetting('deckDiversityWeight', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Historical Weight: {matchmakingSettings.historicalWeight}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={matchmakingSettings.historicalWeight}
                        onChange={(e) => updateMatchmakingSetting('historicalWeight', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tournament Analytics</h3>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-500">Detailed tournament statistics and insights</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tournament Settings</h3>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Settings panel coming soon...</p>
                  <p className="text-sm text-gray-500">Configure tournament defaults and preferences</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentManager;