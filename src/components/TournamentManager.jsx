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
} from 'lucide-react';

const TournamentManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTournament, setSelectedTournament] = useState(null);

  const tournaments = [
    {
      id: 1,
      name: 'KONIVRER Championship Series #1',
      format: 'Classic Constructed',
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
      format: 'Blitz',
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
      format: 'Booster Draft',
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
      {/* Quick Stats */}
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
              Format
            </label>
            <select className="w-full px-4 py-3 bg-primary border border-color rounded-xl focus:ring-2 focus:ring-accent-primary focus:border-transparent">
              <option>Classic Constructed</option>
              <option>Blitz</option>
              <option>Booster Draft</option>
              <option>Sealed Deck</option>
              <option>Legacy</option>
            </select>
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

        <div className="bg-primary border border-color rounded-xl p-4">
          <h4 className="font-semibold text-primary mb-4">Format Popularity</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary">Classic Constructed</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2 rounded-full"
                    style={{ width: '68%' }}
                  ></div>
                </div>
                <span className="text-sm text-secondary">68%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Blitz</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: '45%' }}
                  ></div>
                </div>
                <span className="text-sm text-secondary">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">Booster Draft</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-tertiary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: '32%' }}
                  ></div>
                </div>
                <span className="text-sm text-secondary">32%</span>
              </div>
            </div>
          </div>
        </div>
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
        {activeTab === 'settings' && (
          <div className="bg-secondary border border-color rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Tournament Settings
            </h3>
            <p className="text-secondary">
              Tournament configuration options coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentManager;
