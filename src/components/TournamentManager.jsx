import React, { useState } from 'react';
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
} from 'lucide-react';

const TournamentManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matchmakingSettings, setMatchmakingSettings] = useState({
    enabled: true,
    algorithm: 'bayesian',
    skillVariance: 0.3,
    deckDiversityWeight: 0.4,
    historicalWeight: 0.6,
    uncertaintyFactor: 0.2,
    minSkillDifference: 100,
    maxSkillDifference: 500,
    preferredMatchupBalance: 0.7,
    learningRate: 0.1,
    confidenceThreshold: 0.8,
  });

  const tournaments = [
    {
      id: 1,
      name: 'KONIVRER Championship Series #1',
      date: '2025-06-15',
      time: '10:00 AM',
      location: 'Central Gaming Hub',
      status: 'upcoming',
      players: 32,
      maxPlayers: 64,
      prizePool: '$2,500',
      rounds: 6,
      organizer: 'Tournament Central',
    },
    {
      id: 2,
      name: 'Weekly Blitz Tournament',
      date: '2025-06-12',
      time: '7:00 PM',
      location: 'Local Game Store',
      status: 'ongoing',
      players: 16,
      maxPlayers: 16,
      prizePool: '$200',
      rounds: 4,
      currentRound: 2,
      organizer: 'GameMaster Pro',
    },
    {
      id: 3,
      name: 'Draft Masters Cup',
      date: '2025-06-08',
      time: '2:00 PM',
      location: 'Elite Gaming Center',
      status: 'completed',
      players: 24,
      maxPlayers: 24,
      prizePool: '$800',
      rounds: 5,
      winner: 'ProPlayer123',
      organizer: 'Elite Events',
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-secondary border border-color rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary">Active Tournaments</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-color rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary">Total Players</p>
              <p className="text-2xl font-bold text-primary">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-color rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary">Prize Pool</p>
              <p className="text-2xl font-bold text-primary">$45,200</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-color rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary">Avg Attendance</p>
              <p className="text-2xl font-bold text-primary">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament List */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">
            Tournament Overview
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <Plus size={16} />
            Create Tournament
          </button>
        </div>

        <div className="space-y-4">
          {tournaments.map(tournament => (
            <div
              key={tournament.id}
              className="border border-color rounded-xl p-4 hover:bg-tertiary transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-primary">
                      {tournament.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        tournament.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : tournament.status === 'ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {tournament.date} at {tournament.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {tournament.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      {tournament.players}/{tournament.maxPlayers} players
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={14} />
                      {tournament.prizePool}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tournament.status === 'ongoing' && (
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                      <Play size={16} />
                    </button>
                  )}
                  <button className="p-2 text-secondary hover:bg-tertiary rounded-lg transition-colors">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreateTournament = () => (
    <div className="bg-secondary border border-color rounded-xl p-6">
      <h3 className="text-xl font-bold text-primary mb-6">
        Create New Tournament
      </h3>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="Enter tournament name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Time
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Max Players
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="64"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Entry Fee
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="$25"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Location
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            placeholder="Enter venue address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            placeholder="Tournament description and rules"
          />
        </div>

        {/* Bayesian Matchmaking Settings */}
        <div className="bg-primary border border-color rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">
                Bayesian Matchmaking Settings
              </h4>
              <p className="text-sm text-secondary">
                Configure AI-powered tournament matchmaking
              </p>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary border border-color rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <Zap className="text-accent-primary" size={18} />
              <div>
                <h5 className="font-medium text-primary">
                  Enable Smart Matchmaking
                </h5>
                <p className="text-xs text-secondary">
                  Use AI to create balanced matches
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setMatchmakingSettings(prev => ({
                  ...prev,
                  enabled: !prev.enabled,
                }))
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                matchmakingSettings.enabled
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {matchmakingSettings.enabled ? (
                <ToggleRight size={16} />
              ) : (
                <ToggleLeft size={16} />
              )}
              {matchmakingSettings.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {matchmakingSettings.enabled && (
            <div className="space-y-4">
              {/* Algorithm Selection */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Matchmaking Algorithm
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      matchmakingSettings.algorithm === 'bayesian'
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-color hover:border-accent-primary/50'
                    }`}
                    onClick={() =>
                      setMatchmakingSettings(prev => ({
                        ...prev,
                        algorithm: 'bayesian',
                      }))
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="text-accent-primary" size={16} />
                      <span className="font-medium text-primary text-sm">
                        Bayesian TrueSkill
                      </span>
                    </div>
                    <p className="text-xs text-secondary">
                      Advanced probabilistic skill modeling
                    </p>
                  </div>

                  <div
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      matchmakingSettings.algorithm === 'elo'
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-color hover:border-accent-primary/50'
                    }`}
                    onClick={() =>
                      setMatchmakingSettings(prev => ({
                        ...prev,
                        algorithm: 'elo',
                      }))
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="text-blue-500" size={16} />
                      <span className="font-medium text-primary text-sm">
                        Enhanced ELO
                      </span>
                    </div>
                    <p className="text-xs text-secondary">
                      Traditional rating with meta analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Skill Variance: {matchmakingSettings.skillVariance}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={matchmakingSettings.skillVariance}
                    onChange={e =>
                      setMatchmakingSettings(prev => ({
                        ...prev,
                        skillVariance: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-secondary mt-1">
                    Higher values allow more skill uncertainty
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Deck Diversity Weight:{' '}
                    {matchmakingSettings.deckDiversityWeight}
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={matchmakingSettings.deckDiversityWeight}
                    onChange={e =>
                      setMatchmakingSettings(prev => ({
                        ...prev,
                        deckDiversityWeight: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-secondary mt-1">
                    Promotes diverse archetype matchups
                  </p>
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors">
                  <Sliders size={16} />
                  Advanced Parameters
                  <span className="ml-auto group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>

                <div className="mt-4 space-y-4 pl-6 border-l-2 border-accent-primary/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-primary mb-1">
                        Learning Rate: {matchmakingSettings.learningRate}
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.5"
                        step="0.01"
                        value={matchmakingSettings.learningRate}
                        onChange={e =>
                          setMatchmakingSettings(prev => ({
                            ...prev,
                            learningRate: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-tertiary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-primary mb-1">
                        Confidence Threshold:{' '}
                        {matchmakingSettings.confidenceThreshold}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.05"
                        value={matchmakingSettings.confidenceThreshold}
                        onChange={e =>
                          setMatchmakingSettings(prev => ({
                            ...prev,
                            confidenceThreshold: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-tertiary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Create Tournament
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-color text-secondary rounded-xl hover:bg-tertiary transition-all duration-200"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-6">
          Tournament Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              156
            </div>
            <div className="text-sm text-secondary">Total Tournaments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              4,892
            </div>
            <div className="text-sm text-secondary">Total Participants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-primary mb-2">
              $127,500
            </div>
            <div className="text-sm text-secondary">Total Prize Pool</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMatchmakingSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              Bayesian Matchmaking System
            </h3>
            <p className="text-secondary">
              Advanced AI-powered tournament matchmaking with skill-based
              pairing
            </p>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-primary border border-color rounded-xl">
          <div className="flex items-center gap-3">
            <Zap className="text-accent-primary" size={20} />
            <div>
              <h4 className="font-semibold text-primary">
                Enable Smart Matchmaking
              </h4>
              <p className="text-sm text-secondary">
                Use AI to create balanced, competitive matches
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setMatchmakingSettings(prev => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              matchmakingSettings.enabled
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {matchmakingSettings.enabled ? (
              <ToggleRight size={20} />
            ) : (
              <ToggleLeft size={20} />
            )}
            {matchmakingSettings.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Target className="text-accent-primary" size={20} />
          Matchmaking Algorithm
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              matchmakingSettings.algorithm === 'bayesian'
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-color hover:border-accent-primary/50'
            }`}
            onClick={() =>
              setMatchmakingSettings(prev => ({
                ...prev,
                algorithm: 'bayesian',
              }))
            }
          >
            <div className="flex items-center gap-3 mb-2">
              <Brain className="text-accent-primary" size={20} />
              <h5 className="font-semibold text-primary">Bayesian TrueSkill</h5>
            </div>
            <p className="text-sm text-secondary">
              Advanced probabilistic model that accounts for skill uncertainty
              and learning over time
            </p>
          </div>

          <div
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              matchmakingSettings.algorithm === 'elo'
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-color hover:border-accent-primary/50'
            }`}
            onClick={() =>
              setMatchmakingSettings(prev => ({ ...prev, algorithm: 'elo' }))
            }
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-500" size={20} />
              <h5 className="font-semibold text-primary">Enhanced ELO</h5>
            </div>
            <p className="text-sm text-secondary">
              Traditional rating system enhanced with deck archetype analysis
              and meta considerations
            </p>
          </div>
        </div>
      </div>

      {/* Skill Matching Parameters */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Activity className="text-accent-primary" size={20} />
          Skill Matching Parameters
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Skill Variance Tolerance
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={matchmakingSettings.skillVariance}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    skillVariance: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.skillVariance * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Higher values allow more skill difference between matched players
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Historical Weight
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={matchmakingSettings.historicalWeight}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    historicalWeight: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.historicalWeight * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              How much past performance influences current matchmaking
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Uncertainty Factor
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={matchmakingSettings.uncertaintyFactor}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    uncertaintyFactor: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.uncertaintyFactor * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Accounts for rating uncertainty in new or inactive players
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Learning Rate
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={matchmakingSettings.learningRate}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    learningRate: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.learningRate * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              How quickly the system adapts to new performance data
            </p>
          </div>
        </div>
      </div>

      {/* Deck Diversity & Meta Balance */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Shuffle className="text-accent-primary" size={20} />
          Deck Diversity & Meta Balance
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Deck Diversity Weight
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={matchmakingSettings.deckDiversityWeight}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    deckDiversityWeight: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.deckDiversityWeight * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Prioritizes diverse deck archetype matchups over pure skill
              matching
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Matchup Balance Preference
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={matchmakingSettings.preferredMatchupBalance}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    preferredMatchupBalance: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.preferredMatchupBalance * 100).toFixed(0)}
                %
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Aims for balanced win rates between different deck archetypes
            </p>
          </div>
        </div>

        {/* Deck Archetype Analysis */}
        <div className="mt-6 p-4 bg-primary border border-color rounded-xl">
          <h5 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            Current Meta Analysis
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-accent-primary">32%</div>
              <div className="text-secondary">Aggro</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">28%</div>
              <div className="text-secondary">Control</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">25%</div>
              <div className="text-secondary">Midrange</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">15%</div>
              <div className="text-secondary">Combo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Sliders className="text-accent-primary" size={20} />
          Advanced Configuration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Minimum Skill Difference
            </label>
            <input
              type="number"
              min="50"
              max="300"
              value={matchmakingSettings.minSkillDifference}
              onChange={e =>
                setMatchmakingSettings(prev => ({
                  ...prev,
                  minSkillDifference: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
            <p className="text-xs text-secondary mt-1">
              Minimum rating difference to consider players as different skill
              levels
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Maximum Skill Difference
            </label>
            <input
              type="number"
              min="300"
              max="1000"
              value={matchmakingSettings.maxSkillDifference}
              onChange={e =>
                setMatchmakingSettings(prev => ({
                  ...prev,
                  maxSkillDifference: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            />
            <p className="text-xs text-secondary mt-1">
              Maximum allowed rating difference for matchmaking
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Confidence Threshold
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={matchmakingSettings.confidenceThreshold}
                onChange={e =>
                  setMatchmakingSettings(prev => ({
                    ...prev,
                    confidenceThreshold: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-secondary w-12">
                {(matchmakingSettings.confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Minimum confidence level required for skill predictions
            </p>
          </div>
        </div>
      </div>

      {/* System Status & Performance */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Activity className="text-accent-primary" size={20} />
          System Performance
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-primary border border-color rounded-xl">
            <div className="text-2xl font-bold text-green-500 mb-2">94.7%</div>
            <div className="text-sm text-secondary">Match Quality Score</div>
            <div className="text-xs text-secondary mt-1">
              Based on post-game feedback
            </div>
          </div>

          <div className="text-center p-4 bg-primary border border-color rounded-xl">
            <div className="text-2xl font-bold text-blue-500 mb-2">1.2s</div>
            <div className="text-sm text-secondary">Avg. Processing Time</div>
            <div className="text-xs text-secondary mt-1">
              Per matchmaking request
            </div>
          </div>

          <div className="text-center p-4 bg-primary border border-color rounded-xl">
            <div className="text-2xl font-bold text-purple-500 mb-2">87.3%</div>
            <div className="text-sm text-secondary">Prediction Accuracy</div>
            <div className="text-xs text-secondary mt-1">
              Match outcome predictions
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="text-blue-500 mt-1" size={16} />
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">
                Bayesian Learning Status
              </h5>
              <p className="text-sm text-blue-700">
                The system has processed 2,847 matches and is continuously
                learning from player performance patterns. Current model
                confidence: 92.4%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200">
          Save Settings
        </button>
        <button className="px-6 py-3 border border-color text-secondary rounded-xl hover:bg-tertiary transition-all duration-200">
          Reset to Defaults
        </button>
        <button className="px-6 py-3 border border-color text-secondary rounded-xl hover:bg-tertiary transition-all duration-200">
          Export Configuration
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Tournament Manager
              </h1>
              <p className="text-secondary">
                Organize and manage KONIVRER tournaments
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-secondary border border-color rounded-xl p-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'create', label: 'Create Tournament', icon: Plus },
            { id: 'analytics', label: 'Analytics', icon: Target },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'create' && renderCreateTournament()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderMatchmakingSettings()}
      </div>
    </div>
  );
};

export default TournamentManager;
