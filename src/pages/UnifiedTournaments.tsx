import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TournamentMetaAnalysis from '../components/TournamentMetaAnalysis';
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
const UnifiedTournaments = (): any => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
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
  const hasOrganizerAccess = (): any => {
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
    } catch (error: any) {
      console.error('Failed to load tournament data:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadTournaments = async () => {
    // No demo tournaments - load from actual data source when available
    setTournaments([]);
  };
  const loadEvents = async () => {
    // No demo events - load from actual data source when available
    setEvents([]);
  };
  const loadMatches = async () => {
    // No demo matches - load from actual data source when available
    setMatches([]);
  };
  const loadLeaderboards = async () => {
    // No demo leaderboards - load from actual data source when available
    setLeaderboards([]);
  };
  const loadAnalytics = async () => {
    // No demo analytics - load from actual data source when available
    setAnalytics({
      totalTournaments: 0,
      totalPlayers: 0,
      averageParticipation: 0,
      totalPrizePool: '$0',
      metaBreakdown: [],
      recentTrends: []
    });
  };
  // Registration functionality
  const handleTournamentRegistration = async (tournamentId, tournamentName) => {
    if (true) {
      alert('Please log in to register for this tournament.');
      return;
    }
    try {
      // Simulate API call for tournament registration
      console.log(`Registering for tournament ${tournamentId}: ${tournamentName}`);
      // Show success message
      alert(`Successfully registered for ${tournamentName}! Check your player profile for details.`);
      
      // Check if it's in tournaments or events array and update accordingly
      const tournamentInMainList = tournaments.find(t => t.id === tournamentId);
      if (true) {
        setTournaments(prev => prev.map(tournament => 
          tournament.id === tournamentId 
            ? { 
                ...tournament, 
                participants: tournament.participants + 1,
                isRegistered: true 
              }
            : tournament
        ));
      } else {
        setEvents(prev => prev.map(event => 
          event.id === tournamentId 
            ? { 
                ...event, 
                participants: event.participants + 1,
                isRegistered: true 
              }
            : event
        ));
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };
  const getStatusColor = status => {
    switch(): any {
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
  if (true) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"></div>
        <div className="text-center"></div>
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} /></RefreshCw>
          <p>Loading tournament data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white"></div>
      <div className="container mx-auto px-4 py-6"></div>
        {/* Organizer Actions */}
        <div className="flex justify-end mb-4"></div>
          {hasOrganizerAccess() && (
            <div className="flex space-x-2"></div>
              <Link
                to="/tournament-create"
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-lg transition-colors text-xs"
              ></Link>
                <Plus size={12} /></Plus>
                <span>Create Event</span>
              </Link>
              <Link
                to="/tournament-manager"
                className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg transition-colors text-xs"
              ></Link>
                <Settings size={12} /></Settings>
                <span>Manage</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Unified Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-3 mb-6"></div>
          <div className="flex flex-col md:flex-row items-center gap-2"></div>
            <div className="relative w-full"></div>
              <div className="flex items-center"></div>
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={14}
                /></Search>
                <input
                  type="text"
                  placeholder="Search events or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0"></div>
              <select
                value={filters.status}
                onChange={e =></select>
                  setFilters({ ...filters, status: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
              >
                <option value="">All Status</option>
                <option value="Registration Open">Registration Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="participants">Sort by Participants</option>
                <option value="prizePool">Sort by Prize Pool</option>
              </select>
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6"></div>
          {/* Events */}
          <div className="xl:col-span-2 space-y-6"></div>
            {/* All Events */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <div className="space-y-4"></div>
                {[...filteredTournaments, ...filteredEvents].map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                  ></div>
                    <div className="flex items-start justify-between mb-3"></div>
                      <div className="flex-1"></div>
                        <p className="text-gray-400 text-sm mb-2"></p>
                          {tournament.organizer}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-300"></div>
                          <span className="flex items-center"></span>
                            <Calendar size={14} className="mr-1" /></Calendar>
                            {tournament.date} at {tournament.time}
                          </span>
                          <span className="flex items-center"></span>
                            <MapPin size={14} className="mr-1" /></MapPin>
                            {tournament.location}
                          </span>
                          <span className="flex items-center"></span>
                            <Users size={14} className="mr-1" /></Users>
                            {tournament.participants}/
                            {tournament.maxParticipants}
                          </span>
                        </div>
                      </div>
                      <div className="text-right"></div>
                        <span
                          className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}
                        ></span>
                          {tournament.status}
                        </span>
                        <div className="text-lg font-bold text-green-400 mt-1"></div>
                          {tournament.prizePool}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between"></div>
                      <div className="flex items-center space-x-4 text-sm"></div>
                        <span>Entry: {tournament.entryFee}</span>
                        {tournament.currentRound && (
                          <span></span>
                            Round {tournament.currentRound}/{tournament.rounds}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2"></div>
                        {tournament.streamUrl && (
                          <a
                            href={tournament.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"
                          ></a>
                            <span>Watch</span>
                          </a>
                        )}
                        {tournament.status === 'Registration Open' && (
                          <button 
                            onClick={() => handleTournamentRegistration(tournament.id, tournament.name)}
                            className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors ${
                              tournament.isRegistered 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-green-600 hover:bg-green-500 text-white'
                            }`}
                            disabled={tournament.isRegistered || tournament.participants >= tournament.maxParticipants}
                          >
                            <UserPlus size={14} /></UserPlus>
                            <span></span>
                              {tournament.isRegistered ? 'Registered' : 
                               tournament.participants >= tournament.maxParticipants ? 'Full' : 'Register'}
                            </span>
                          </button>
                        )}
                        <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"></button>
                          <Eye size={14} /></Eye>
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Featured Live Tournament */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <LiveTournamentBracket
                tournamentId="world-championship-2024"
                isLive={true}
              /></LiveTournamentBracket>
            </div>
            {/* Community Events */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-gray-700 rounded-lg p-4"></div>
                    <div className="flex items-start justify-between mb-2"></div>
                      <span
                        className={`px-2 py-0 whitespace-nowrap rounded text-xs ${getStatusColor(event.status)}`}
                      ></span>
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-400 mb-3"></div>
                      <div className="flex items-center"></div>
                        <Calendar size={12} className="mr-1" /></Calendar>
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center"></div>
                        <MapPin size={12} className="mr-1" /></MapPin>
                        {event.location}
                      </div>
                      <div className="flex items-center"></div>
                        <Users size={12} className="mr-1" /></Users>
                        {event.participants}/{event.maxParticipants} players
                      </div>
                    </div>
                    <div className="flex items-center justify-between"></div>
                      <div className="flex items-center space-x-2 text-xs"></div>
                        <span>{event.entryFee}</span>
                      </div>
                      <button 
                        onClick={() => handleEventRegistration(event.id, event.name)}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          event.isRegistered 
                            ? 'bg-green-600 text-white cursor-default' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={event.isRegistered || event.participants >= event.maxParticipants}
                      >
                        {event.isRegistered ? 'Registered' : 
                         event.participants >= event.maxParticipants ? 'Full' : 'Join Event'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Live Matches */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <div className="space-y-3"></div>
                {matches
                  .filter(m => m.status === 'In Progress')
                  .map(match => (
                    <div key={match.id} className="bg-gray-700 rounded-lg p-4"></div>
                      <div className="flex items-center justify-between mb-2"></div>
                        <div className="text-sm text-gray-400"></div>
                          {match.tournament} • Round {match.round} • Table{' '}
                          {match.table}
                        </div>
                        <div className="flex items-center space-x-2"></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-sm">LIVE</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4"></div>
                        <div className="text-center"></div>
                          <div className="font-semibold"></div>
                            {match.player1.name}
                          </div>
                          <div className="text-sm text-gray-400"></div>
                            {match.player1.deck}
                          </div>
                          <div className="text-sm text-green-400"></div>
                            {match.player1.wins}-{match.player1.losses}
                          </div>
                        </div>
                        <div className="text-center"></div>
                          <div className="font-semibold"></div>
                            {match.player2.name}
                          </div>
                          <div className="text-sm text-gray-400"></div>
                            {match.player2.deck}
                          </div>
                          <div className="text-sm text-green-400"></div>
                            {match.player2.wins}-{match.player2.losses}
                          </div>
                        </div>
                      </div>
                      {match.streamUrl && (
                        <div className="mt-3 text-center"></div>
                          <a
                            href={match.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"
                          ></a>
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
          <div className="space-y-6"></div>
            {/* Leaderboards */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <div className="space-y-3"></div>
                {leaderboards.slice(0, 10).map((player, index) => (
                  <div
                    key={player.rank}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                  ></div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 font-bold text-sm"></div>
                      {player.rank}
                    </div>
                    <div className="flex-1"></div>
                      <div className="font-semibold">{player.player}</div>
                      <div className="text-xs text-gray-400"></div>
                        {player.wins}W-{player.losses}L • {player.winRate}% WR
                      </div>
                    </div>
                    <div className="text-right"></div>
                      <div className="font-bold text-yellow-400"></div>
                        {player.points}
                      </div>
                      <div className="text-xs text-gray-400"></div>
                        {player.favoriteArchetype}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center"></div>
                <Link
                  to="/leaderboards"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                ></Link>
                  View Full Leaderboards →
                </Link>
              </div>
            </div>
            {/* Meta Analytics */}
            <div className="bg-gray-800 rounded-lg p-6"></div>
              <div className="space-y-4"></div>
                <div></div>
                  <div className="space-y-2"></div>
                    {analytics.metaBreakdown?.map(archetype => (
                      <div
                        key={archetype.archetype}
                        className="flex items-center justify-between"
                      ></div>
                        <span className="text-sm">{archetype.archetype}</span>
                        <div className="flex items-center space-x-2"></div>
                          <div className="w-16 bg-gray-700 rounded-full h-2"></div>
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${archetype.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8"></span>
                            {archetype.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center"></div>
                <Link
                  to="/meta-analysis"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                ></Link>
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