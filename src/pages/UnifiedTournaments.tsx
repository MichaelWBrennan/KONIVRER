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
    switch (true) {
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center" />
        <div className="text-center" />
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} / />
          <p>Loading tournament data...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white" />
      <div className="container mx-auto px-4 py-6" />
        {/* Organizer Actions */}
        <div className="flex justify-end mb-4" />
          {hasOrganizerAccess() && (
            <div className="flex space-x-2" />
              <Link
                to="/tournament-create"
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-lg transition-colors text-xs"
               />
                <Plus size={12} / />
                <span>Create Event</span>
              <Link
                to="/tournament-manager"
                className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg transition-colors text-xs"
               />
                <Settings size={12} / />
                <span>Manage</span>
            </div>
          )}
        </div>
        
        {/* Unified Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-3 mb-6" />
          <div className="flex flex-col md:flex-row items-center gap-2" />
            <div className="relative w-full" />
              <div className="flex items-center" />
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={14}
                / />
                <input
                  type="text"
                  placeholder="Search events or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>
            <div className="flex gap-2 flex-shrink-0" />
              <select
                value={filters.status}
                onChange={e = />
                  setFilters({ ...filters, status: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
              >
                <option value="">All Status</option>
                <option value="Registration Open">Registration Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="participants">Sort by Participants</option>
                <option value="prizePool">Sort by Prize Pool</option>
            </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" />
          {/* Events */}
          <div className="xl:col-span-2 space-y-6" />
            {/* All Events */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <div className="space-y-4" />
                {[...filteredTournaments, ...filteredEvents].map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                   />
                    <div className="flex items-start justify-between mb-3" />
                      <div className="flex-1" />
                        <p className="text-gray-400 text-sm mb-2" />
                          {tournament.organizer}
                        <div className="flex items-center space-x-4 text-sm text-gray-300" />
                          <span className="flex items-center" />
                            <Calendar size={14} className="mr-1" / />
                            {tournament.date} at {tournament.time}
                          <span className="flex items-center" />
                            <MapPin size={14} className="mr-1" / />
                            {tournament.location}
                          <span className="flex items-center" />
                            <Users size={14} className="mr-1" / />
                            {tournament.participants}/
                            {tournament.maxParticipants}
                        </div>
                      <div className="text-right" />
                        <span
                          className={`px-3 py-0 whitespace-nowrap rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}
                         />
                          {tournament.status}
                        <div className="text-lg font-bold text-green-400 mt-1" />
                          {tournament.prizePool}
                      </div>
                    <div className="flex items-center justify-between" />
                      <div className="flex items-center space-x-4 text-sm" />
                        <span>Entry: {tournament.entryFee}
                        {tournament.currentRound && (
                          <span />
                            Round {tournament.currentRound}/{tournament.rounds}
                        )}
                      </div>
                      <div className="flex space-x-2" />
                        {tournament.streamUrl && (
                          <a
                            href={tournament.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"
                           />
                            <span>Watch</span>
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
                            <UserPlus size={14} / />
                            <span />
                              {tournament.isRegistered ? 'Registered' : 
                               tournament.participants >= tournament.maxParticipants ? 'Full' : 'Register'}
                          </button>
                        )}
                        <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors" />
                          <Eye size={14} / />
                          <span>View Details</span>
                      </div>
                  </div>
                ))}
              </div>
            {/* Featured Live Tournament */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <LiveTournamentBracket
                tournamentId="world-championship-2024"
                isLive={true}
              / />
            </div>
            {/* Community Events */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" />
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-gray-700 rounded-lg p-4" />
                    <div className="flex items-start justify-between mb-2" />
                      <span
                        className={`px-2 py-0 whitespace-nowrap rounded text-xs ${getStatusColor(event.status)}`}
                       />
                        {event.status}
                    </div>
                    <div className="space-y-1 text-sm text-gray-400 mb-3" />
                      <div className="flex items-center" />
                        <Calendar size={12} className="mr-1" / />
                        {event.date} at {event.time}
                      <div className="flex items-center" />
                        <MapPin size={12} className="mr-1" / />
                        {event.location}
                      <div className="flex items-center" />
                        <Users size={12} className="mr-1" / />
                        {event.participants}/{event.maxParticipants} players
                      </div>
                    <div className="flex items-center justify-between" />
                      <div className="flex items-center space-x-2 text-xs" />
                        <span>{event.entryFee}
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
                    </div>
                ))}
              </div>
            {/* Live Matches */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <div className="space-y-3" />
                {matches
                  .filter(m => m.status === 'In Progress')
                  .map(match => (
                    <div key={match.id} className="bg-gray-700 rounded-lg p-4" />
                      <div className="flex items-center justify-between mb-2" />
                        <div className="text-sm text-gray-400" />
                          {match.tournament} • Round {match.round} • Table{' '}
                          {match.table}
                        <div className="flex items-center space-x-2" />
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-400 text-sm">LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4" />
                        <div className="text-center" />
                          <div className="font-semibold" />
                            {match.player1.name}
                          <div className="text-sm text-gray-400" />
                            {match.player1.deck}
                          <div className="text-sm text-green-400" />
                            {match.player1.wins}-{match.player1.losses}
                        </div>
                        <div className="text-center" />
                          <div className="font-semibold" />
                            {match.player2.name}
                          <div className="text-sm text-gray-400" />
                            {match.player2.deck}
                          <div className="text-sm text-green-400" />
                            {match.player2.wins}-{match.player2.losses}
                        </div>
                      {match.streamUrl && (
                        <div className="mt-3 text-center" />
                          <a
                            href={match.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"
                           />
                            <span>Watch Stream</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
          </div>
          {/* Right Column - Leaderboards & Analytics */}
          <div className="space-y-6" />
            {/* Leaderboards */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <div className="space-y-3" />
                {leaderboards.slice(0, 10).map((player, index) => (
                  <div
                    key={player.rank}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                   />
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 font-bold text-sm" />
                      {player.rank}
                    <div className="flex-1" />
                      <div className="font-semibold">{player.player}
                      <div className="text-xs text-gray-400" />
                        {player.wins}W-{player.losses}L • {player.winRate}% WR
                      </div>
                    <div className="text-right" />
                      <div className="font-bold text-yellow-400" />
                        {player.points}
                      <div className="text-xs text-gray-400" />
                        {player.favoriteArchetype}
                    </div>
                ))}
              </div>
              <div className="mt-4 text-center" />
                <Link
                  to="/leaderboards"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                 />
                  View Full Leaderboards →
                </Link>
            </div>
            {/* Meta Analytics */}
            <div className="bg-gray-800 rounded-lg p-6" />
              <div className="space-y-4" />
                <div />
                  <div className="space-y-2" />
                    {analytics.metaBreakdown?.map(archetype => (
                      <div
                        key={archetype.archetype}
                        className="flex items-center justify-between"
                       />
                        <span className="text-sm">{archetype.archetype}
                        <div className="flex items-center space-x-2" />
                          <div className="w-16 bg-gray-700 rounded-full h-2" />
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${archetype.percentage}%` }}
                             />
                          </div>
                          <span className="text-xs text-gray-400 w-8" />
                            {archetype.percentage}%
                          </span>
                      </div>
                    ))}
                  </div>
              </div>
              <div className="mt-4 text-center" />
                <Link
                  to="/meta-analysis"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                 />
                  View Detailed Analytics →
                </Link>
            </div>
        </div>
    </div>
  );
};
export default UnifiedTournaments;