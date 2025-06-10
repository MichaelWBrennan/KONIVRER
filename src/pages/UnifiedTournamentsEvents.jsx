import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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
  Sword,
  Shield,
  Zap,
  Crown,
  Target,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Gamepad2,
  Award,
  PieChart,
  Activity,
  Layers,
  Percent,
  Hash,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Leaf,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
  Globe,
  Video,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const UnifiedTournamentsEvents = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState('events'); // 'events', 'matches', 'analytics'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    format: '',
    status: '',
    dateRange: '',
    location: '',
    category: '',
    prizeMin: '',
    prizeMax: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Mock events data (combining tournaments and events under "Events")
  const [events, setEvents] = useState([
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
      description:
        'The premier tournament of the year featuring the best players from around the world.',
      rounds: 9,
      category: 'Championship',
      isOnline: false,
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
      description:
        'Regional championship determining the East Coast representative.',
      rounds: 8,
      category: 'Regional',
      isOnline: false,
    },
    {
      id: 3,
      name: 'KONIVRER Community Meetup',
      format: 'Casual',
      date: '2024-06-25',
      time: '6:00 PM',
      location: 'Downtown Gaming Lounge',
      prizePool: 'Promo Cards',
      participants: 45,
      maxParticipants: 60,
      status: 'Registration Open',
      organizer: 'Community Leaders',
      description:
        'Monthly community gathering for casual play and deck sharing.',
      category: 'Community',
      isOnline: false,
    },
    {
      id: 4,
      name: 'Draft Night Weekly',
      format: 'Draft',
      date: '2024-06-18',
      time: '7:00 PM',
      location: 'Online',
      prizePool: 'Store Credit',
      participants: 24,
      maxParticipants: 32,
      status: 'Registration Open',
      organizer: 'Weekly Events',
      description: 'Weekly draft event with rotating sets.',
      category: 'Weekly',
      isOnline: true,
    },
    {
      id: 5,
      name: 'Store Championship Series',
      format: 'Standard',
      date: '2024-07-01',
      time: '2:00 PM',
      location: 'Local Game Stores',
      prizePool: '$5,000',
      participants: 128,
      maxParticipants: 128,
      status: 'Registration Open',
      organizer: 'Store Network',
      description: 'Monthly store championship with qualifier spots.',
      category: 'Store Championship',
      isOnline: false,
    },
  ]);

  // Mock matches data (grouped by event)
  const [matches, setMatches] = useState([
    {
      id: 1,
      eventId: 1,
      eventName: 'KONIVRER World Championship 2024',
      round: 'Round 1',
      player1: { name: 'Alex Chen', deck: 'Aggro Red', rating: 1850 },
      player2: { name: 'Sarah Johnson', deck: 'Control Blue', rating: 1820 },
      result: '2-1',
      winner: 'Alex Chen',
      date: '2024-07-15',
      time: '10:30 AM',
      status: 'completed',
      duration: '45 minutes',
    },
    {
      id: 2,
      eventId: 1,
      eventName: 'KONIVRER World Championship 2024',
      round: 'Round 1',
      player1: { name: 'Mike Rodriguez', deck: 'Midrange Green', rating: 1780 },
      player2: { name: 'Emma Wilson', deck: 'Combo Artifacts', rating: 1900 },
      result: '1-2',
      winner: 'Emma Wilson',
      date: '2024-07-15',
      time: '10:30 AM',
      status: 'completed',
      duration: '52 minutes',
    },
    {
      id: 3,
      eventId: 2,
      eventName: 'Regional Championship - East Coast',
      round: 'Round 2',
      player1: { name: 'David Kim', deck: 'Control White', rating: 1920 },
      player2: { name: 'Lisa Park', deck: 'Aggro Black', rating: 1850 },
      result: '2-0',
      winner: 'David Kim',
      date: '2024-06-20',
      time: '11:15 AM',
      status: 'completed',
      duration: '38 minutes',
    },
  ]);

  // Navigation tabs (simplified - matches only accessible from within events)
  const navigationTabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Filter and search logic
  const getFilteredItems = () => {
    let items =
      currentView === 'events'
        ? events
        : currentView === 'matches'
          ? getEventMatches()
          : [];

    // Apply search filter
    if (searchQuery) {
      items = items.filter(
        item =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.format?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.organizer?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply filters
    if (filters.format) {
      items = items.filter(item => item.format === filters.format);
    }
    if (filters.status) {
      items = items.filter(item => item.status === filters.status);
    }
    if (filters.category && currentView === 'events') {
      items = items.filter(item => item.category === filters.category);
    }
    if (filters.location && currentView !== 'matches') {
      items = items.filter(item =>
        item.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    return items;
  };

  // Get matches for selected event
  const getEventMatches = () => {
    if (!selectedEvent) return [];
    return matches.filter(match => match.eventId === selectedEvent.id);
  };

  const filteredItems = getFilteredItems();

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentView, selectedEvent]);

  // Render event card (unified for all event types)
  const renderEventCard = event => (
    <motion.div
      key={event.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-color rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-accent-primary/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              event.category === 'Championship'
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                : event.category === 'Regional'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                  : event.category === 'Store Championship'
                    ? 'bg-gradient-to-br from-green-500 to-teal-500'
                    : event.category === 'Community'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}
          >
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">{event.name}</h3>
            <p className="text-secondary text-sm">{event.organizer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.isOnline && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Online
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              event.status === 'Registration Open'
                ? 'bg-green-100 text-green-800'
                : event.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : event.status === 'Completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <p className="text-secondary mb-4 line-clamp-2">{event.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-accent-primary" />
          <span>
            {event.date} at {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {event.isOnline ? (
            <Globe size={16} className="text-accent-primary" />
          ) : (
            <MapPin size={16} className="text-accent-primary" />
          )}
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-accent-primary" />
          <span>
            {event.participants}/{event.maxParticipants} participants
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Award size={16} className="text-accent-primary" />
          <span>{event.prizePool}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-tertiary rounded text-xs font-medium">
            {event.format}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              event.category === 'Championship'
                ? 'bg-yellow-100 text-yellow-800'
                : event.category === 'Regional'
                  ? 'bg-blue-100 text-blue-800'
                  : event.category === 'Store Championship'
                    ? 'bg-green-100 text-green-800'
                    : event.category === 'Community'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
          >
            {event.category}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedEvent(event);
              setCurrentView('matches');
            }}
            className="btn btn-sm btn-ghost"
          >
            <Gamepad2 size={16} />
            View Matches
          </button>
          <button
            onClick={() => setSelectedEvent(event)}
            className="btn btn-sm btn-ghost"
          >
            <Eye size={16} />
            Details
          </button>
          <button className="btn btn-sm btn-primary">Register</button>
        </div>
      </div>
    </motion.div>
  );

  // Render match card
  const renderMatchCard = match => (
    <motion.div
      key={match.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-color rounded-xl p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{match.eventName}</h3>
          <p className="text-secondary text-sm">
            {match.round} • {match.date} at {match.time}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            match.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : match.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {match.status === 'completed'
            ? 'Completed'
            : match.status === 'in-progress'
              ? 'In Progress'
              : 'Scheduled'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-tertiary rounded-lg">
          <h4 className="font-semibold text-primary">{match.player1.name}</h4>
          <p className="text-sm text-secondary">{match.player1.deck}</p>
          <p className="text-xs text-muted">Rating: {match.player1.rating}</p>
        </div>
        <div className="text-center p-4 bg-tertiary rounded-lg">
          <h4 className="font-semibold text-primary">{match.player2.name}</h4>
          <p className="text-sm text-secondary">{match.player2.deck}</p>
          <p className="text-xs text-muted">Rating: {match.player2.rating}</p>
        </div>
      </div>

      {match.status === 'completed' && (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-accent-primary mb-1">
            {match.result}
          </div>
          <p className="text-sm text-secondary">
            Winner:{' '}
            <span className="font-semibold text-primary">{match.winner}</span>
          </p>
          <p className="text-xs text-muted">Duration: {match.duration}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setSelectedMatch(match)}
          className="btn btn-sm btn-ghost"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>
    </motion.div>
  );

  // Render analytics view
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-color rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Total Events</h3>
              <p className="text-2xl font-bold text-accent-primary">
                {events.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-color rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Total Participants</h3>
              <p className="text-2xl font-bold text-accent-primary">
                {events.reduce((sum, event) => sum + event.participants, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-color rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Total Matches</h3>
              <p className="text-2xl font-bold text-accent-primary">
                {matches.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-color rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Active Events</h3>
              <p className="text-2xl font-bold text-accent-primary">
                {
                  events.filter(
                    event =>
                      event.status === 'Registration Open' ||
                      event.status === 'In Progress',
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-color rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            Events by Category
          </h3>
          <div className="space-y-3">
            {[
              'Championship',
              'Regional',
              'Store Championship',
              'Community',
              'Weekly',
            ].map(category => {
              const count = events.filter(
                event => event.category === category,
              ).length;
              const percentage =
                events.length > 0
                  ? ((count / events.length) * 100).toFixed(1)
                  : 0;
              return (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-secondary">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-tertiary rounded-full h-2">
                      <div
                        className="bg-accent-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-color rounded-xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Event Trends</h3>
          <div className="h-48 bg-tertiary rounded-lg flex items-center justify-center">
            <p className="text-muted">
              Event analytics charts would be displayed here
            </p>
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
          {currentView === 'matches' && selectedEvent ? (
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setCurrentView('events');
                  setSelectedEvent(null);
                }}
                className="btn btn-ghost"
              >
                <ArrowLeft size={20} />
                Back to Events
              </button>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  {selectedEvent.name} - Matches
                </h1>
                <p className="text-secondary">
                  View all matches for this event
                </p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-primary mb-2">Events</h1>
              <p className="text-secondary">
                Discover competitive tournaments, community events, and track
                analytics
              </p>
            </>
          )}
        </div>

        {/* Navigation Tabs */}
        {currentView !== 'matches' && (
          <div className="flex flex-wrap gap-2 mb-6 border-b border-color">
            {navigationTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
                    currentView === tab.id
                      ? 'bg-accent-primary text-white border-b-2 border-accent-primary'
                      : 'text-secondary hover:text-primary hover:bg-tertiary'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Search and Filters */}
        {currentView !== 'analytics' && (
          <div className="bg-card border border-color rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={`Search ${currentView === 'matches' ? 'matches' : 'events'}...`}
                  className="input pl-10 w-full"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  className="input min-w-32"
                  value={filters.format}
                  onChange={e =>
                    setFilters({ ...filters, format: e.target.value })
                  }
                >
                  <option value="">All Formats</option>
                  <option value="Standard">Standard</option>
                  <option value="Draft">Draft</option>
                  <option value="Casual">Casual</option>
                </select>

                {currentView === 'events' && (
                  <select
                    className="input min-w-32"
                    value={filters.category}
                    onChange={e =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="Championship">Championship</option>
                    <option value="Regional">Regional</option>
                    <option value="Store Championship">
                      Store Championship
                    </option>
                    <option value="Community">Community</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                )}

                <select
                  className="input min-w-32"
                  value={filters.status}
                  onChange={e =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="Registration Open">Registration Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="btn btn-ghost"
                >
                  <Filter size={16} />
                  {showAdvancedFilters ? 'Hide' : 'More'} Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-color"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Location"
                      className="input"
                      value={filters.location}
                      onChange={e =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      placeholder="Date From"
                      className="input"
                      value={filters.dateFrom}
                      onChange={e =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                    />
                    <input
                      type="date"
                      placeholder="Date To"
                      className="input"
                      value={filters.dateTo}
                      onChange={e =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Prize Pool"
                      className="input"
                      value={filters.prizeMin}
                      onChange={e =>
                        setFilters({ ...filters, prizeMin: e.target.value })
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentView === 'analytics' ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderAnalytics()}
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-secondary">
                  {currentView === 'matches' && selectedEvent ? (
                    <>
                      Showing {paginatedItems.length} of {filteredItems.length}{' '}
                      matches for {selectedEvent.name}
                    </>
                  ) : (
                    <>
                      Showing {paginatedItems.length} of {filteredItems.length}{' '}
                      {currentView}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary">Sort by:</span>
                  <select
                    className="input input-sm"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    {currentView === 'events' && (
                      <>
                        <option value="participants">Participants</option>
                        <option value="prizePool">Prize Pool</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AnimatePresence>
                  {paginatedItems.map(item => {
                    if (currentView === 'events') return renderEventCard(item);
                    if (currentView === 'matches') return renderMatchCard(item);
                    return null;
                  })}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {paginatedItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                    {currentView === 'events' ? (
                      <Calendar size={32} className="text-muted" />
                    ) : (
                      <Gamepad2 size={32} className="text-muted" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    No {currentView} found
                  </h3>
                  <p className="text-secondary">
                    {currentView === 'matches' && selectedEvent
                      ? `No matches found for ${selectedEvent.name}`
                      : `Try adjusting your search or filters to find ${currentView}`}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`btn btn-sm ${
                            currentPage === page ? 'btn-primary' : 'btn-ghost'
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn btn-ghost btn-sm"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modals would go here */}
      {/* Event Detail Modal */}
      {/* Match Detail Modal */}
    </div>
  );
};

export default UnifiedTournamentsEvents;
