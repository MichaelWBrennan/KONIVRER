import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Star,
  Filter,
  Search,
  Eye,
  Download,
  BarChart3,
  Award,
  Target,
  Crown,
  Zap,
  Globe,
  Video,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    format: '',
    location: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    prizeMin: '',
    prizeMax: '',
    type: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'KONIVRER World Championship 2024',
      description:
        'The premier tournament of the year featuring the best players from around the world competing for the ultimate title.',
      date: '2024-07-15',
      endDate: '2024-07-17',
      time: '10:00 AM',
      location: 'Los Angeles Convention Center, CA',
      country: 'United States',
      format: 'Classic Constructed',
      type: 'Championship',
      status: 'upcoming',
      participants: 512,
      maxParticipants: 512,
      prizePool: 50000,
      entryFee: 75,
      organizer: 'KONIVRER Official',
      judge: 'Level 5 Certified',
      rounds: 15,
      structure: 'Swiss + Top 8 Elimination',
      streaming: true,
      featured: true,
      image:
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
      website: 'https://konivrer.com/worlds2024',
      registration: {
        open: true,
        deadline: '2024-07-10',
        waitlist: false,
      },
      schedule: [
        { day: 'Day 1', date: '2024-07-15', rounds: '1-9', format: 'Swiss' },
        { day: 'Day 2', date: '2024-07-16', rounds: '10-15', format: 'Swiss' },
        {
          day: 'Day 3',
          date: '2024-07-17',
          rounds: 'Top 8',
          format: 'Elimination',
        },
      ],
      prizes: [
        { place: '1st', prize: '$15,000 + Trophy + Title' },
        { place: '2nd', prize: '$8,000' },
        { place: '3rd-4th', prize: '$4,000 each' },
        { place: '5th-8th', prize: '$2,000 each' },
        { place: '9th-16th', prize: '$1,000 each' },
      ],
    },
    {
      id: 2,
      name: 'Regional Qualifier - Summer Series',
      description:
        'High-stakes regional qualifier for the Summer Championship. Top 8 players qualify for the national tournament.',
      date: '2024-06-15',
      endDate: '2024-06-16',
      time: '10:00 AM',
      location: 'San Francisco Convention Center, CA',
      country: 'United States',
      format: 'Classic Constructed',
      type: 'Qualifier',
      status: 'upcoming',
      participants: 128,
      maxParticipants: 256,
      prizePool: 4480,
      entryFee: 35,
      organizer: 'KONIVRER Official',
      judge: 'Level 4 Certified',
      rounds: 9,
      structure: 'Swiss + Top 8 Elimination',
      streaming: true,
      featured: true,
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
      website: 'https://konivrer.com/summer-qualifier',
      registration: {
        open: true,
        deadline: '2024-06-13',
        waitlist: false,
      },
      schedule: [
        { day: 'Day 1', date: '2024-06-15', rounds: '1-7', format: 'Swiss' },
        {
          day: 'Day 2',
          date: '2024-06-16',
          rounds: '8-9 + Top 8',
          format: 'Swiss + Elimination',
        },
      ],
      prizes: [
        { place: '1st', prize: '$1,500 + Qualification' },
        { place: '2nd', prize: '$800 + Qualification' },
        { place: '3rd-4th', prize: '$400 + Qualification each' },
        { place: '5th-8th', prize: '$200 + Qualification each' },
      ],
    },
    {
      id: 3,
      name: 'Friday Night KONIVRER Championship',
      description:
        'Weekly competitive tournament featuring the latest Standard format with exciting prizes and professional coverage.',
      date: '2024-06-14',
      endDate: '2024-06-14',
      time: '7:00 PM',
      location: 'GameHub Arena, Los Angeles, CA',
      country: 'United States',
      format: 'Classic Constructed',
      type: 'Weekly',
      status: 'live',
      participants: 32,
      maxParticipants: 32,
      prizePool: 480,
      entryFee: 15,
      organizer: 'GameHub Events',
      judge: 'Level 3 Certified',
      rounds: 5,
      structure: 'Swiss + Top 8',
      streaming: true,
      featured: false,
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      website: 'https://gamehub.com/friday-night',
      registration: {
        open: false,
        deadline: '2024-06-14',
        waitlist: false,
      },
      currentRound: 3,
      schedule: [
        {
          day: 'Tonight',
          date: '2024-06-14',
          rounds: '1-5 + Top 8',
          format: 'Swiss + Elimination',
        },
      ],
      prizes: [
        { place: '1st', prize: '$200 + Trophy' },
        { place: '2nd', prize: '$120' },
        { place: '3rd-4th', prize: '$60 each' },
        { place: '5th-8th', prize: '$10 each' },
      ],
    },
    {
      id: 4,
      name: 'Legacy Legends Tournament',
      description:
        'Premium legacy format tournament featuring vintage cards and classic strategies.',
      date: '2024-06-22',
      endDate: '2024-06-22',
      time: '11:00 AM',
      location: 'Premium Gaming Lounge, New York, NY',
      country: 'United States',
      format: 'Legacy',
      type: 'Premium',
      status: 'upcoming',
      participants: 64,
      maxParticipants: 64,
      prizePool: 3200,
      entryFee: 50,
      organizer: 'Legacy Masters',
      judge: 'Level 4 Certified',
      rounds: 7,
      structure: 'Swiss + Top 8',
      streaming: true,
      featured: false,
      image:
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
      website: 'https://legacymasters.com/legends',
      registration: {
        open: true,
        deadline: '2024-06-20',
        waitlist: false,
      },
      schedule: [
        {
          day: 'Saturday',
          date: '2024-06-22',
          rounds: '1-7 + Top 8',
          format: 'Swiss + Elimination',
        },
      ],
      prizes: [
        { place: '1st', prize: '$1,200 + Vintage Card' },
        { place: '2nd', prize: '$600' },
        { place: '3rd-4th', prize: '$300 each' },
        { place: '5th-8th', prize: '$150 each' },
      ],
    },
    {
      id: 5,
      name: 'Online Championship Series',
      description:
        'Digital tournament series with global participation and innovative online features.',
      date: '2024-06-10',
      endDate: '2024-06-10',
      time: '4:00 PM',
      location: 'Online - Global',
      country: 'Global',
      format: 'Classic Constructed',
      type: 'Online',
      status: 'completed',
      participants: 512,
      maxParticipants: 512,
      prizePool: 5120,
      entryFee: 10,
      organizer: 'KONIVRER Digital',
      judge: 'AI Judge System + Human Oversight',
      rounds: 9,
      structure: 'Swiss + Top 16',
      streaming: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      website: 'https://konivrer.com/online-series',
      registration: {
        open: false,
        deadline: '2024-06-09',
        waitlist: false,
      },
      winner: 'DigitalMaster',
      schedule: [
        {
          day: 'Monday',
          date: '2024-06-10',
          rounds: '1-9 + Top 16',
          format: 'Swiss + Elimination',
        },
      ],
      prizes: [
        { place: '1st', prize: '$1,500 + Digital Trophy' },
        { place: '2nd', prize: '$800' },
        { place: '3rd-4th', prize: '$400 each' },
        { place: '5th-8th', prize: '$200 each' },
        { place: '9th-16th', prize: '$100 each' },
      ],
    },
  ]);

  // Available formats and types
  const formats = [
    'Classic Constructed',
    'Blitz',
    'Draft',
    'Sealed',
    'Legacy',
    'Standard',
  ];
  const types = [
    'Championship',
    'Qualifier',
    'Weekly',
    'Premium',
    'Online',
    'Casual',
  ];
  const statuses = ['upcoming', 'live', 'completed', 'cancelled'];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat = !filters.format || event.format === filters.format;
    const matchesLocation =
      !filters.location ||
      event.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesStatus = !filters.status || event.status === filters.status;
    const matchesType = !filters.type || event.type === filters.type;

    const matchesDateFrom =
      !filters.dateFrom || new Date(event.date) >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || new Date(event.date) <= new Date(filters.dateTo);

    const matchesPrizeMin =
      !filters.prizeMin || event.prizePool >= parseInt(filters.prizeMin);
    const matchesPrizeMax =
      !filters.prizeMax || event.prizePool <= parseInt(filters.prizeMax);

    return (
      matchesSearch &&
      matchesFormat &&
      matchesLocation &&
      matchesStatus &&
      matchesType &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesPrizeMin &&
      matchesPrizeMax
    );
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'prize':
        comparison = a.prizePool - b.prizePool;
        break;
      case 'participants':
        comparison = a.participants - b.participants;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = sortedEvents.slice(
    startIndex,
    startIndex + eventsPerPage,
  );

  const getStatusIcon = status => {
    switch (status) {
      case 'upcoming':
        return <Clock className="text-blue-400" size={16} />;
      case 'live':
        return <Play className="text-green-400" size={16} />;
      case 'completed':
        return <CheckCircle className="text-gray-400" size={16} />;
      case 'cancelled':
        return <AlertCircle className="text-red-400" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'Championship':
        return <Crown className="text-yellow-400" size={16} />;
      case 'Qualifier':
        return <Target className="text-red-400" size={16} />;
      case 'Weekly':
        return <Calendar className="text-blue-400" size={16} />;
      case 'Premium':
        return <Star className="text-purple-400" size={16} />;
      case 'Online':
        return <Globe className="text-cyan-400" size={16} />;
      case 'Casual':
        return <Users className="text-green-400" size={16} />;
      default:
        return <Trophy className="text-gray-400" size={16} />;
    }
  };

  const formatPrize = amount => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    }
    return `$${amount}`;
  };

  const resetFilters = () => {
    setFilters({
      format: '',
      location: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      prizeMin: '',
      prizeMax: '',
      type: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(event.status)}`}
          >
            {getStatusIcon(event.status)}
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white border border-white/20 flex items-center gap-1">
            {getTypeIcon(event.type)}
            {event.type}
          </span>
        </div>

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500 rounded-full text-black text-xs font-medium">
              <Star size={12} />
              FEATURED
            </div>
          </div>
        )}

        {/* Live Indicator */}
        {event.status === 'live' && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full text-white text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg line-clamp-2 flex-1 mr-2 text-white">
            {event.name}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {formatPrize(event.prizePool)}
            </div>
            <div className="text-xs text-gray-400">Prize Pool</div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Calendar size={14} />
            <span>{event.date}</span>
            {event.endDate !== event.date && <span>- {event.endDate}</span>}
            <span className="text-gray-500">at {event.time}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <MapPin size={14} />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Users size={14} />
            <span>
              {event.participants}/{event.maxParticipants} players
            </span>
            <span className="text-gray-500">•</span>
            <span>{event.format}</span>
          </div>
        </div>

        {/* Current Round (for live events) */}
        {event.status === 'live' && event.currentRound && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded">
            <div className="text-green-400 font-medium text-sm">
              Currently in Round {event.currentRound} of {event.rounds}
            </div>
          </div>
        )}

        {/* Winner (for completed events) */}
        {event.status === 'completed' && event.winner && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-400" size={16} />
              <span className="text-yellow-400 font-medium">
                Winner: {event.winner}
              </span>
            </div>
          </div>
        )}

        {/* Registration Status */}
        {event.status === 'upcoming' && (
          <div className="mb-4">
            {event.registration.open ? (
              <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded">
                <div className="text-blue-400 font-medium text-sm">
                  Registration Open
                </div>
                <div className="text-xs text-gray-400">
                  Deadline: {event.registration.deadline}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded">
                <div className="text-red-400 font-medium text-sm">
                  Registration Closed
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {event.streaming && (
              <div className="flex items-center space-x-1 text-xs text-red-400">
                <Video size={12} />
                <span>Stream</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Award size={12} />
              <span>{event.rounds} rounds</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="btn btn-sm btn-primary">
              <Eye size={14} />
              View
            </button>
            {event.website && (
              <button className="btn btn-sm btn-secondary">
                <ExternalLink size={14} />
                Website
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tournament Events</h1>
          <p className="text-gray-400">
            Discover and participate in competitive KONIVRER tournaments
            worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          {/* Main Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search events, locations, organizers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Filter size={20} />
              <span>Filters</span>
              {showAdvancedFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-700 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Format
                    </label>
                    <select
                      value={filters.format}
                      onChange={e =>
                        setFilters({ ...filters, format: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Formats</option>
                      {formats.map(format => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={e =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={e =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, State, Country"
                      value={filters.location}
                      onChange={e =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Date Range and Prize Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date From
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={e =>
                          setFilters({ ...filters, dateFrom: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date To
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={e =>
                          setFilters({ ...filters, dateTo: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Min Prize ($)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.prizeMin}
                        onChange={e =>
                          setFilters({ ...filters, prizeMin: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Prize ($)
                      </label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={filters.prizeMax}
                        onChange={e =>
                          setFilters({ ...filters, prizeMax: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-end space-x-2">
                  <button onClick={resetFilters} className="btn btn-secondary">
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort and Results Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-gray-400 mb-4 md:mb-0">
            Showing {startIndex + 1}-
            {Math.min(startIndex + eventsPerPage, sortedEvents.length)} of{' '}
            {sortedEvents.length} events
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="prize">Prize Pool</option>
                <option value="participants">Participants</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-sm btn-secondary"
            >
              {sortOrder === 'asc' ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {paginatedEvents.map((event, index) => (
              <EventCard key={event.id} event={event} />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn ${
                    currentPage === page ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No events found</div>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
