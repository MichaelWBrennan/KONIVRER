import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Eye,
  Award,
  Clock,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Zap,
  Trophy,
  Target,
  Shield,
  Crown,
  Sparkles,
  BarChart3,
  Globe,
  Video,
  Gamepad2,
  Medal,
  Gem,
  Diamond,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Pentagon,
  Heart,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EnhancedTournaments = () => {
  const { user, isAuthenticated, registerForTournament, unregisterFromTournament } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [prizeRange, setPrizeRange] = useState([0, 10000]);

  // Enhanced mock tournament data
  useEffect(() => {
    const mockTournaments = [
      {
        id: 1,
        name: 'Friday Night KONIVRER Championship',
        description: 'Weekly competitive tournament featuring the latest Standard format with exciting prizes and professional coverage.',
        date: '2024-06-07',
        time: '19:00',
        location: 'GameHub Arena, Los Angeles',
        format: 'Standard',
        type: 'Competitive',
        status: 'upcoming',
        participants: 24,
        maxParticipants: 32,
        entryFee: '$15',
        prizePool: '$480',
        judge: 'Sarah Chen (Level 3)',
        organizer: 'GameHub Events',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
        tags: ['Weekly', 'Standard', 'Competitive'],
        difficulty: 'Intermediate',
        estimatedDuration: '4-5 hours',
        rounds: 5,
        structure: 'Swiss + Top 8',
        streaming: true,
        prizes: [
          { place: '1st', prize: '$200 + Trophy' },
          { place: '2nd', prize: '$120' },
          { place: '3rd-4th', prize: '$60 each' },
          { place: '5th-8th', prize: '$10 each' },
        ],
        requirements: ['Standard legal deck', 'Tournament registration'],
        features: ['Live streaming', 'Professional judging', 'Prize support'],
        rating: 4.8,
        reviews: 156,
        lastUpdated: '2024-06-05T10:30:00Z',
      },
      {
        id: 2,
        name: 'Regional Qualifier - Summer Series',
        description: 'High-stakes regional qualifier for the Summer Championship. Top 8 players qualify for the national tournament.',
        date: '2024-06-15',
        time: '10:00',
        location: 'Convention Center, San Francisco',
        format: 'Standard',
        type: 'Qualifier',
        status: 'upcoming',
        participants: 89,
        maxParticipants: 128,
        entryFee: '$35',
        prizePool: '$4,480',
        judge: 'Michael Torres (Level 5)',
        organizer: 'KONIVRER Official',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        tags: ['Qualifier', 'Regional', 'High Stakes'],
        difficulty: 'Advanced',
        estimatedDuration: '8-10 hours',
        rounds: 9,
        structure: 'Swiss + Top 8 Elimination',
        streaming: true,
        prizes: [
          { place: '1st', prize: '$1,500 + Qualification' },
          { place: '2nd', prize: '$800 + Qualification' },
          { place: '3rd-4th', prize: '$400 + Qualification each' },
          { place: '5th-8th', prize: '$200 + Qualification each' },
          { place: '9th-16th', prize: '$100 each' },
        ],
        requirements: ['Standard legal deck', 'DCI number', 'Photo ID'],
        features: ['Professional coverage', 'Top 8 qualification', 'Premium prizes'],
        rating: 4.9,
        reviews: 342,
        lastUpdated: '2024-06-04T15:45:00Z',
      },
      {
        id: 3,
        name: 'Draft Masters Weekly',
        description: 'Casual draft tournament perfect for players of all skill levels. Learn and improve your drafting skills.',
        date: '2024-06-08',
        time: '14:00',
        location: 'Local Game Store, Seattle',
        format: 'Draft',
        type: 'Casual',
        status: 'upcoming',
        participants: 12,
        maxParticipants: 16,
        entryFee: '$20',
        prizePool: '$320',
        judge: 'Alex Kim (Level 2)',
        organizer: 'Seattle Gaming Community',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        tags: ['Draft', 'Casual', 'Learning'],
        difficulty: 'Beginner',
        estimatedDuration: '3-4 hours',
        rounds: 4,
        structure: 'Swiss',
        streaming: false,
        prizes: [
          { place: '1st', prize: '$120' },
          { place: '2nd', prize: '$80' },
          { place: '3rd-4th', prize: '$40 each' },
          { place: '5th-8th', prize: '$10 each' },
        ],
        requirements: ['None - all skill levels welcome'],
        features: ['Beginner friendly', 'Draft coaching', 'Casual atmosphere'],
        rating: 4.6,
        reviews: 89,
        lastUpdated: '2024-06-03T09:15:00Z',
      },
      {
        id: 4,
        name: 'Legacy Legends Tournament',
        description: 'Premium legacy format tournament featuring vintage cards and classic strategies.',
        date: '2024-06-22',
        time: '11:00',
        location: 'Premium Gaming Lounge, New York',
        format: 'Legacy',
        type: 'Premium',
        status: 'upcoming',
        participants: 45,
        maxParticipants: 64,
        entryFee: '$50',
        prizePool: '$3,200',
        judge: 'Jennifer Walsh (Level 4)',
        organizer: 'Legacy Masters',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
        tags: ['Legacy', 'Premium', 'Vintage'],
        difficulty: 'Expert',
        estimatedDuration: '6-8 hours',
        rounds: 7,
        structure: 'Swiss + Top 8',
        streaming: true,
        prizes: [
          { place: '1st', prize: '$1,200 + Vintage Card' },
          { place: '2nd', prize: '$600' },
          { place: '3rd-4th', prize: '$300 each' },
          { place: '5th-8th', prize: '$150 each' },
        ],
        requirements: ['Legacy legal deck', 'Advanced play experience'],
        features: ['Vintage prizes', 'Expert commentary', 'Premium venue'],
        rating: 4.7,
        reviews: 203,
        lastUpdated: '2024-06-02T14:20:00Z',
      },
      {
        id: 5,
        name: 'Online Championship Series',
        description: 'Digital tournament series with global participation and innovative online features.',
        date: '2024-06-10',
        time: '16:00',
        location: 'Online - Global',
        format: 'Standard',
        type: 'Online',
        status: 'live',
        participants: 256,
        maxParticipants: 512,
        entryFee: '$10',
        prizePool: '$5,120',
        judge: 'AI Judge System + Human Oversight',
        organizer: 'KONIVRER Digital',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        tags: ['Online', 'Global', 'Digital'],
        difficulty: 'All Levels',
        estimatedDuration: '5-6 hours',
        rounds: 8,
        structure: 'Swiss + Top 16',
        streaming: true,
        prizes: [
          { place: '1st', prize: '$1,500 + Digital Trophy' },
          { place: '2nd', prize: '$800' },
          { place: '3rd-4th', prize: '$400 each' },
          { place: '5th-8th', prize: '$200 each' },
          { place: '9th-16th', prize: '$100 each' },
        ],
        requirements: ['Stable internet connection', 'KONIVRER Digital account'],
        features: ['Global participation', 'AI assistance', 'Digital rewards'],
        rating: 4.5,
        reviews: 1247,
        lastUpdated: '2024-06-07T12:00:00Z',
      },
      {
        id: 6,
        name: 'Charity Cup - Community Heroes',
        description: 'Special charity tournament supporting local gaming communities. All proceeds go to youth gaming programs.',
        date: '2024-05-30',
        time: '13:00',
        location: 'Community Center, Austin',
        format: 'Standard',
        type: 'Charity',
        status: 'completed',
        participants: 64,
        maxParticipants: 64,
        entryFee: '$25',
        prizePool: '$1,600',
        judge: 'Community Volunteers',
        organizer: 'Austin Gaming Alliance',
        winner: 'DragonMaster2024',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        tags: ['Charity', 'Community', 'Youth Support'],
        difficulty: 'All Levels',
        estimatedDuration: '6 hours',
        rounds: 6,
        structure: 'Swiss + Top 8',
        streaming: true,
        prizes: [
          { place: '1st', prize: 'Trophy + Recognition' },
          { place: '2nd', prize: 'Medal + Recognition' },
          { place: '3rd-8th', prize: 'Certificate + Recognition' },
        ],
        requirements: ['Community spirit', 'Charitable donation'],
        features: ['Charity focus', 'Community building', 'Youth mentorship'],
        rating: 4.9,
        reviews: 178,
        lastUpdated: '2024-05-31T18:30:00Z',
      },
    ];

    setTournaments(mockTournaments);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Clock className="text-blue-400" size={16} />;
      case 'live': return <Zap className="text-green-400" size={16} />;
      case 'completed': return <CheckCircle className="text-gray-400" size={16} />;
      default: return <Circle className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Competitive': return <Trophy className="text-yellow-400" size={16} />;
      case 'Qualifier': return <Target className="text-red-400" size={16} />;
      case 'Casual': return <Heart className="text-pink-400" size={16} />;
      case 'Premium': return <Crown className="text-purple-400" size={16} />;
      case 'Online': return <Globe className="text-cyan-400" size={16} />;
      case 'Charity': return <Heart className="text-green-400" size={16} />;
      default: return <Circle className="text-gray-400" size={16} />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || tournament.status === filter;
    
    const matchesFormat = selectedFormats.length === 0 || selectedFormats.includes(tournament.format);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tournament.type);
    
    return matchesSearch && matchesFilter && matchesFormat && matchesType;
  });

  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'participants':
        return b.participants - a.participants;
      case 'prize':
        return parseInt(b.prizePool.replace(/[^0-9]/g, '')) - parseInt(a.prizePool.replace(/[^0-9]/g, ''));
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const renderTournamentCard = (tournament, index) => (
    <motion.div
      key={tournament.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="card relative overflow-hidden group"
    >
      {/* Tournament Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={tournament.image}
          alt={tournament.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(tournament.status)}`}>
            {getStatusIcon(tournament.status)}
            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white border border-white/20 flex items-center gap-1">
            {getTypeIcon(tournament.type)}
            {tournament.type}
          </span>
        </div>

        {/* Live Indicator */}
        {tournament.status === 'live' && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full text-white text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        )}

        {/* Streaming Indicator */}
        {tournament.streaming && (
          <div className="absolute bottom-3 right-3">
            <Video size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Tournament Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg line-clamp-2 flex-1 mr-2">
            {tournament.name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="text-yellow-400" size={14} />
            <span>{tournament.rating}</span>
          </div>
        </div>

        <p className="text-sm text-secondary mb-4 line-clamp-2">
          {tournament.description}
        </p>

        {/* Tournament Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-accent-primary" />
            <span>
              {new Date(tournament.date).toLocaleDateString()} at {tournament.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-accent-primary" />
            <span className="line-clamp-1">{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-accent-primary" />
            <span>
              {tournament.participants}/{tournament.maxParticipants} players
            </span>
            <div className="flex-1 bg-tertiary rounded-full h-2 ml-2">
              <div 
                className="bg-accent-primary h-2 rounded-full transition-all"
                style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield size={14} className="text-accent-primary" />
            <span>{tournament.judge}</span>
          </div>
        </div>

        {/* Format and Difficulty */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs font-medium">
            {tournament.format}
          </span>
          <span className={`px-2 py-1 bg-gray-500/20 rounded text-xs font-medium ${getDifficultyColor(tournament.difficulty)}`}>
            {tournament.difficulty}
          </span>
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
            {tournament.estimatedDuration}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tournament.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-tertiary text-secondary rounded text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Prize and Entry */}
        <div className="flex items-center justify-between pt-4 border-t border-color">
          <div className="text-sm">
            <span className="text-muted">Entry: </span>
            <span className="font-medium">{tournament.entryFee}</span>
            <span className="text-muted"> • Prize: </span>
            <span className="font-medium text-accent-primary">
              {tournament.prizePool}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/tournaments/${tournament.id}`}
            className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1"
          >
            <Eye size={14} />
            View Details
          </Link>
          
          {tournament.status === 'upcoming' && isAuthenticated && (
            user?.registeredTournaments?.includes(tournament.id) ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => unregisterFromTournament(tournament.id)}
                className="btn btn-secondary btn-sm"
              >
                Unregister
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => registerForTournament(tournament.id)}
                className="btn btn-primary btn-sm"
              >
                Register
              </motion.button>
            )
          )}
          
          {tournament.status === 'upcoming' && !isAuthenticated && (
            <button 
              onClick={() => alert('Please login to register for tournaments')}
              className="btn btn-primary btn-sm"
            >
              Register
            </button>
          )}

          {tournament.status === 'live' && (
            <Link
              to={`/tournaments/${tournament.id}/live`}
              className="btn btn-primary btn-sm flex items-center gap-1"
            >
              <Play size={14} />
              Watch Live
            </Link>
          )}

          {tournament.status === 'completed' && (
            <Link
              to={`/tournaments/${tournament.id}/results`}
              className="btn btn-secondary btn-sm flex items-center gap-1"
            >
              <Award size={14} />
              Results
            </Link>
          )}
        </div>

        {/* Winner Badge for Completed Tournaments */}
        {tournament.winner && (
          <div className="mt-3 p-3 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-yellow-100 font-medium">
                Winner: {tournament.winner}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2">
                Tournaments
              </h1>
              <p className="text-secondary">
                Compete in exciting KONIVRER tournaments and climb the ranks
              </p>
            </div>
            <Link
              to="/tournaments/create"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              Create Tournament
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{tournaments.filter(t => t.status === 'upcoming').length}</div>
              <div className="text-sm text-secondary">Upcoming</div>
            </div>
            <div className="card text-center">
              <Zap size={24} className="text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{tournaments.filter(t => t.status === 'live').length}</div>
              <div className="text-sm text-secondary">Live Now</div>
            </div>
            <div className="card text-center">
              <Users size={24} className="text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {tournaments.reduce((sum, t) => sum + t.participants, 0)}
              </div>
              <div className="text-sm text-secondary">Total Players</div>
            </div>
            <div className="card text-center">
              <Gem size={24} className="text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                ${tournaments.reduce((sum, t) => sum + parseInt(t.prizePool.replace(/[^0-9]/g, '')), 0).toLocaleString()}
              </div>
              <div className="text-sm text-secondary">Total Prizes</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input min-w-32"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input min-w-32"
            >
              <option value="date">Sort by Date</option>
              <option value="participants">Sort by Players</option>
              <option value="prize">Sort by Prize</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-1 border border-color rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent-primary text-white' : 'text-secondary hover:text-primary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent-primary text-white' : 'text-secondary hover:text-primary'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-color pt-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Format Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <div className="space-y-2">
                      {['Standard', 'Draft', 'Legacy', 'Modern'].map(format => (
                        <label key={format} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFormats.includes(format)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFormats([...selectedFormats, format]);
                              } else {
                                setSelectedFormats(selectedFormats.filter(f => f !== format));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <div className="space-y-2">
                      {['Competitive', 'Casual', 'Qualifier', 'Premium', 'Online', 'Charity'].map(type => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTypes([...selectedTypes, type]);
                              } else {
                                setSelectedTypes(selectedTypes.filter(t => t !== type));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Features</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">Live Streaming</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">Online Play</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">Beginner Friendly</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tournament Grid/List */}
        <AnimatePresence mode="wait">
          {sortedTournaments.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            >
              {sortedTournaments.map((tournament, index) => 
                renderTournamentCard(tournament, index)
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Trophy size={64} className="text-muted mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No tournaments found</h3>
              <p className="text-secondary mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms or filters'
                  : 'No tournaments match your current filters'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setSelectedFormats([]);
                  setSelectedTypes([]);
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedTournaments;