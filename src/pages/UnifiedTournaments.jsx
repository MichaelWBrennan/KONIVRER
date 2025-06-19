import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Trophy,
  Users,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Eye,
  Download,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Settings,
  UserPlus,
  Timer,
  RefreshCw,
  DollarSign,
} from 'lucide-react';

import LiveTournamentBracket from '../components/LiveTournamentBracket';

const UnifiedTournaments = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    format: '',
    status: '',
    dateRange: '',
    location: '',
    type: '',
    prizeMin: '',
    prizeMax: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Data states
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  // Helper function for organizer access
  const hasOrganizerAccess = () => {
    return (
      isAuthenticated &&
      user?.roles?.includes('organizer') &&
      user?.organizerLevel >= 1
    );
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load all tournament-related data simultaneously
      await Promise.all([
        loadTournaments(),
        loadEvents(),
        loadMatches(),
        loadLeaderboards(),
        loadAnalytics(),
      ]);
    } catch (error) {
      console.error('Failed to load tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTournaments = async () => {
    // Mock tournament data
    const mockTournaments = [
      {
        id: 1,
        name: 'KONIVRER World Championship 2024',
        format: 'Standard',
        date: '2024-07-15',
        time: '10:00 AM',
        location: 'Los Angeles Convention Center',
        prizePool: '$50,000',
        participants: 512,
        maxParticipants: 512,
        status: 'Registration Open',
        organizer: 'KONIVRER Official',

        rounds: 9,
        type: 'tournament',
        entryFee: '$25',
        streamUrl: 'https://twitch.tv/konivrer',
        brackets: 'Swiss + Top 8',
      },
      {
        id: 2,
        name: 'Regional Championship - East Coast',
        format: 'Standard',
        date: '2024-06-20',
        time: '9:00 AM',
        location: 'New York Gaming Center',
        prizePool: '$15,000',
        participants: 256,
        maxParticipants: 256,
        status: 'In Progress',
        organizer: 'East Coast Gaming',

        rounds: 8,
        type: 'tournament',
        entryFee: '$15',
        currentRound: 5,
      },
    ];
    setTournaments(mockTournaments);
  };

  const loadEvents = async () => {
    // Mock events data
    const mockEvents = [
      {
        id: 1,
        name: 'Weekly Draft Night',
        type: 'Draft',
        date: '2024-06-22',
        time: '7:00 PM',
        location: 'Local Game Store',
        participants: 8,
        maxParticipants: 8,
        status: 'Registration Open',
        prizeSupport: 'Booster Packs',
        entryFee: '$15',
        recurring: 'Weekly',
      },
      {
        id: 2,
        name: 'Casual Commander Night',
        type: 'Casual',
        date: '2024-06-23',
        time: '6:00 PM',
        location: 'Community Center',
        participants: 12,
        maxParticipants: 16,
        status: 'Registration Open',
        prizeSupport: 'Promo Cards',
        entryFee: '$5',
        recurring: 'Bi-weekly',
      },
    ];
    setEvents(mockEvents);
  };

  const loadMatches = async () => {
    // Mock matches data
    const mockMatches = [
      {
        id: 1,
        tournament: 'KONIVRER World Championship 2024',
        round: 5,
        table: 1,
        player1: { name: 'Alex Chen', deck: 'Aggro Red', wins: 4, losses: 0 },
        player2: {
          name: 'Sarah Johnson',
          deck: 'Control Blue',
          wins: 4,
          losses: 0,
        },
        status: 'In Progress',
        startTime: '2024-06-19T14:30:00Z',
        streamUrl: 'https://twitch.tv/konivrer/table1',
      },
      {
        id: 2,
        tournament: 'Regional Championship - East Coast',
        round: 5,
        table: 2,
        player1: {
          name: 'Mike Rodriguez',
          deck: 'Midrange Green',
          wins: 3,
          losses: 1,
        },
        player2: {
          name: 'Emma Wilson',
          deck: 'Combo Artifacts',
          wins: 3,
          losses: 1,
        },
        status: 'Completed',
        winner: 'Mike Rodriguez',
        result: '2-1',
        duration: '45 minutes',
      },
    ];
    setMatches(mockMatches);
  };

  const loadLeaderboards = async () => {
    // Mock leaderboard data
    const mockLeaderboards = [
      {
        rank: 1,
        player: 'Alex Chen',
        points: 2450,
        wins: 89,
        losses: 23,
        winRate: 79.5,
        favoriteArchetype: 'Aggro',
        recentTournaments: 5,
      },
      {
        rank: 2,
        player: 'Sarah Johnson',
        points: 2380,
        wins: 76,
        losses: 19,
        winRate: 80.0,
        favoriteArchetype: 'Control',
        recentTournaments: 4,
      },
      {
        rank: 3,
        player: 'Mike Rodriguez',
        points: 2320,
        wins: 82,
        losses: 28,
        winRate: 74.5,
        favoriteArchetype: 'Midrange',
        recentTournaments: 6,
      },
    ];
    setLeaderboards(mockLeaderboards);
  };

  const loadAnalytics = async () => {
    // Mock analytics data
    const mockAnalytics = {
      totalTournaments: 156,
      totalPlayers: 12450,
      averageParticipation: 78,
      totalPrizePool: '$245,000',
      popularFormats: [
        { name: 'Standard', percentage: 65 },
        { name: 'Draft', percentage: 25 },
        { name: 'Casual', percentage: 10 },
      ],
      metaBreakdown: [
        { archetype: 'Aggro Red', percentage: 28, winRate: 52 },
        { archetype: 'Control Blue', percentage: 22, winRate: 58 },
        { archetype: 'Midrange Green', percentage: 18, winRate: 55 },
        { archetype: 'Combo Artifacts', percentage: 15, winRate: 48 },
        { archetype: 'Other', percentage: 17, winRate: 45 },
      ],
      recentTrends: [
        {
          week: 'Week 1',
          aggro: 30,
          control: 25,
          midrange: 20,
          combo: 15,
          other: 10,
        },
        {
          week: 'Week 2',
          aggro: 28,
          control: 22,
          midrange: 18,
          combo: 15,
          other: 17,
        },
        {
          week: 'Week 3',
          aggro: 26,
          control: 24,
          midrange: 19,
          combo: 16,
          other: 15,
        },
        {
          week: 'Week 4',
          aggro: 28,
          control: 22,
          midrange: 18,
          combo: 15,
          other: 17,
        },
      ],
    };
    setAnalytics(mockAnalytics);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Registration Open':
        return 'bg-green-600';
      case 'In Progress':
        return 'bg-blue-600';
      case 'Completed':
        return 'bg-gray-600';
      case 'Cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.format || tournament.format === filters.format) &&
      (!filters.status || tournament.status === filters.status) &&
      (!filters.location ||
        tournament.location
          .toLowerCase()
          .includes(filters.location.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p>Loading tournament data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Unified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tournaments & Events</h1>
              <p className="text-gray-400">
                Discover competitive tournaments, community events, and track
                match analytics
              </p>
            </div>
            {hasOrganizerAccess() && (
              <div className="flex space-x-2">
                <Link
                  to="/tournament-create"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  <span>Create Tournament</span>
                </Link>
                <Link
                  to="/tournament-manager"
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Settings size={16} />
                  <span>Manage</span>
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Tournaments</p>
                  <p className="text-2xl font-bold">
                    {tournaments.filter(t => t.status !== 'Completed').length}
                  </p>
                </div>
                <Trophy className="text-yellow-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Players</p>
                  <p className="text-2xl font-bold">
                    {analytics.totalPlayers?.toLocaleString()}
                  </p>
                </div>
                <Users className="text-blue-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Prize Pool</p>
                  <p className="text-2xl font-bold">
                    {analytics.totalPrizePool}
                  </p>
                </div>
                <DollarSign className="text-green-400" size={24} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Live Matches</p>
                  <p className="text-2xl font-bold">
                    {matches.filter(m => m.status === 'In Progress').length}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Unified Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tournaments, events, or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.format}
                  onChange={e =>
                    setFilters({ ...filters, format: e.target.value })
                  }
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="">All Formats</option>
                  <option value="Standard">Standard</option>
                  <option value="Draft">Draft</option>
                  <option value="Casual">Casual</option>
                </select>
                <select
                  value={filters.status}
                  onChange={e =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Registration Open">Registration Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="participants">Sort by Participants</option>
                  <option value="prizePool">Sort by Prize Pool</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm text-gray-400">
                {filteredTournaments.length} tournaments •{' '}
                {filteredEvents.length} events
              </div>
              <div className="text-sm text-gray-400">
                {matches.filter(m => m.status === 'In Progress').length} live
                matches
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Tournaments & Events */}
          <div className="xl:col-span-2 space-y-6">
            {/* Active Tournaments */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="mr-2" size={20} />
                Active Tournaments
              </h2>
              <div className="space-y-4">
                {filteredTournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {tournament.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {tournament.organizer}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {tournament.date} at {tournament.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {tournament.location}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {tournament.participants}/
                            {tournament.maxParticipants}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}
                        >
                          {tournament.status}
                        </span>
                        <div className="text-lg font-bold text-green-400 mt-1">
                          {tournament.prizePool}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-blue-600 px-2 py-1 rounded">
                          {tournament.format}
                        </span>
                        <span>Entry: {tournament.entryFee}</span>
                        {tournament.currentRound && (
                          <span>
                            Round {tournament.currentRound}/{tournament.rounds}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {tournament.streamUrl && (
                          <a
                            href={tournament.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm transition-colors"
                          >
                            <span>Watch</span>
                          </a>
                        )}
                        <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition-colors">
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Live Tournament */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Featured Live Tournament
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  LIVE
                </span>
              </h2>
              <LiveTournamentBracket
                tournamentId="world-championship-2024"
                isLive={true}
              />
            </div>

            {/* Community Events */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="mr-2" size={20} />
                Community Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{event.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {event.participants}/{event.maxParticipants} players
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="bg-green-600 px-2 py-1 rounded">
                          {event.type}
                        </span>
                        <span>{event.entryFee}</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Join Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Matches */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Live Matches
              </h2>
              <div className="space-y-3">
                {matches
                  .filter(m => m.status === 'In Progress')
                  .map(match => (
                    <div key={match.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">
                          {match.tournament} • Round {match.round} • Table{' '}
                          {match.table}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-sm">LIVE</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="font-semibold">
                            {match.player1.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {match.player1.deck}
                          </div>
                          <div className="text-sm text-green-400">
                            {match.player1.wins}-{match.player1.losses}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">
                            {match.player2.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {match.player2.deck}
                          </div>
                          <div className="text-sm text-green-400">
                            {match.player2.wins}-{match.player2.losses}
                          </div>
                        </div>
                      </div>
                      {match.streamUrl && (
                        <div className="mt-3 text-center">
                          <a
                            href={match.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm transition-colors"
                          >
                            <span>Watch Stream</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboards & Analytics */}
          <div className="space-y-6">
            {/* Leaderboards */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                Leaderboards
              </h2>
              <div className="space-y-3">
                {leaderboards.slice(0, 10).map((player, index) => (
                  <div
                    key={player.rank}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 font-bold text-sm">
                      {player.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{player.player}</div>
                      <div className="text-xs text-gray-400">
                        {player.wins}W-{player.losses}L • {player.winRate}% WR
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">
                        {player.points}
                      </div>
                      <div className="text-xs text-gray-400">
                        {player.favoriteArchetype}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/leaderboards"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Full Leaderboards →
                </Link>
              </div>
            </div>

            {/* Meta Analytics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="mr-2" size={20} />
                Meta Analytics
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Archetype Breakdown</h3>
                  <div className="space-y-2">
                    {analytics.metaBreakdown?.map(archetype => (
                      <div
                        key={archetype.archetype}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{archetype.archetype}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${archetype.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8">
                            {archetype.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Format Popularity</h3>
                  <div className="space-y-2">
                    {analytics.popularFormats?.map(format => (
                      <div
                        key={format.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{format.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${format.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8">
                            {format.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/meta-analysis"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Detailed Analytics →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedTournaments;
