import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  BarChart3,
  Sword,
  Shield,
  Star,
  Award,
  Zap,
  Crown,
  Gamepad2,
} from 'lucide-react';

const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    hero1: '',
    hero2: '',
    format: '',
    dateFrom: '',
    dateTo: '',
    topEight: false,
    tournament: '',
    round: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(25);

  // Mock match data - in a real app, this would come from an API
  const [matches, setMatches] = useState([
    {
      id: 1,
      player1: {
        name: 'DragonMaster',
        hero: 'Vynnset, Iron Maiden',
        deck: 'Aggro Warrior',
        rating: 1850,
      },
      player2: {
        name: 'ElementalForce',
        hero: 'Briar, Warden of Thorns',
        deck: 'Midrange Elemental',
        rating: 1720,
      },
      result: {
        winner: 'player1',
        score: '2-1',
        games: [
          { game: 1, winner: 'player1', duration: '12:34' },
          { game: 2, winner: 'player2', duration: '18:45' },
          { game: 3, winner: 'player1', duration: '15:22' },
        ],
      },
      tournament: {
        name: 'KONIVRER World Championship 2024',
        format: 'Classic Constructed',
        round: 'Quarter Finals',
        date: '2024-06-09',
        location: 'Los Angeles Convention Center',
      },
      duration: '46:41',
      featured: true,
      hasVideo: true,
      hasReplay: true,
    },
    {
      id: 2,
      player1: {
        name: 'ShadowWeaver',
        hero: 'Iyslander, Stormbind',
        deck: 'Control Wizard',
        rating: 1680,
      },
      player2: {
        name: 'LightBringer',
        hero: 'Prism, Sculptor of Arc Light',
        deck: 'Combo Light',
        rating: 1790,
      },
      result: {
        winner: 'player2',
        score: '2-0',
        games: [
          { game: 1, winner: 'player2', duration: '22:15' },
          { game: 2, winner: 'player2', duration: '19:33' },
        ],
      },
      tournament: {
        name: 'Regional Qualifier - Summer Series',
        format: 'Classic Constructed',
        round: 'Round 8',
        date: '2024-06-08',
        location: 'San Francisco Convention Center',
      },
      duration: '41:48',
      featured: false,
      hasVideo: false,
      hasReplay: true,
    },
    {
      id: 3,
      player1: {
        name: 'StormCaller',
        hero: 'Kano, Dracai of Aether',
        deck: 'Spell Burn',
        rating: 1920,
      },
      player2: {
        name: 'EarthShaker',
        hero: 'Rhinar, Reckless Rampage',
        deck: 'Aggro Brute',
        rating: 1650,
      },
      result: {
        winner: 'player1',
        score: '2-1',
        games: [
          { game: 1, winner: 'player2', duration: '8:22' },
          { game: 2, winner: 'player1', duration: '14:17' },
          { game: 3, winner: 'player1', duration: '11:45' },
        ],
      },
      tournament: {
        name: 'Friday Night KONIVRER Championship',
        format: 'Classic Constructed',
        round: 'Finals',
        date: '2024-06-07',
        location: 'GameHub Arena, Los Angeles',
      },
      duration: '34:24',
      featured: true,
      hasVideo: true,
      hasReplay: true,
    },
    {
      id: 4,
      player1: {
        name: 'ElementalMage',
        hero: 'Vynnset, Iron Maiden',
        deck: 'Midrange Warrior',
        rating: 1750,
      },
      player2: {
        name: 'SteelGuardian',
        hero: 'Dorinthea Ironsong',
        deck: 'Weapon Master',
        rating: 1820,
      },
      result: {
        winner: 'player2',
        score: '2-1',
        games: [
          { game: 1, winner: 'player1', duration: '16:33' },
          { game: 2, winner: 'player2', duration: '13:28' },
          { game: 3, winner: 'player2', duration: '20:15' },
        ],
      },
      tournament: {
        name: 'Legacy Legends Tournament',
        format: 'Classic Constructed',
        round: 'Semi Finals',
        date: '2024-06-06',
        location: 'Premium Gaming Lounge, New York',
      },
      duration: '50:16',
      featured: false,
      hasVideo: false,
      hasReplay: true,
    },
    {
      id: 5,
      player1: {
        name: 'MysticSage',
        hero: 'Vynnset, Iron Maiden',
        deck: 'Control Warrior',
        rating: 1880,
      },
      player2: {
        name: 'BladeDancer',
        hero: 'Katsu, the Wanderer',
        deck: 'Combo Ninja',
        rating: 1710,
      },
      result: {
        winner: 'player1',
        score: '2-0',
        games: [
          { game: 1, winner: 'player1', duration: '25:42' },
          { game: 2, winner: 'player1', duration: '18:36' },
        ],
      },
      tournament: {
        name: 'Online Championship Series',
        format: 'Classic Constructed',
        round: 'Round 12',
        date: '2024-06-05',
        location: 'Online - Global',
      },
      duration: '44:18',
      featured: false,
      hasVideo: true,
      hasReplay: true,
    },
  ]);

  // Available heroes for autocomplete
  const heroes = [
    'Vynnset, Iron Maiden',
    'Briar, Warden of Thorns',
    'Iyslander, Stormbind',
    'Prism, Sculptor of Arc Light',
    'Kano, Dracai of Aether',
    'Rhinar, Reckless Rampage',
    'Dorinthea Ironsong',
    'Katsu, the Wanderer',
    'Chane, Bound by Shadow',
    'Lexi, Livewire',
    'Oldhim, Grandfather of Eternity',
    'Fai, Rising Rebellion',
  ];

  // Available formats
  const formats = [
    'Classic Constructed',
    'Blitz',
    'Draft',
    'Sealed',
    'Limited',
    'Legacy',
    'Standard',
  ];

  // Filter matches based on search and filters
  const filteredMatches = matches.filter(match => {
    const matchesSearch =
      match.player1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player1.hero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player2.hero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHero1 =
      !filters.hero1 ||
      match.player1.hero.toLowerCase().includes(filters.hero1.toLowerCase()) ||
      match.player2.hero.toLowerCase().includes(filters.hero1.toLowerCase());

    const matchesHero2 =
      !filters.hero2 ||
      match.player1.hero.toLowerCase().includes(filters.hero2.toLowerCase()) ||
      match.player2.hero.toLowerCase().includes(filters.hero2.toLowerCase());

    const matchesFormat =
      !filters.format || match.tournament.format === filters.format;

    const matchesDateFrom =
      !filters.dateFrom ||
      new Date(match.tournament.date) >= new Date(filters.dateFrom);

    const matchesDateTo =
      !filters.dateTo ||
      new Date(match.tournament.date) <= new Date(filters.dateTo);

    const matchesTopEight =
      !filters.topEight ||
      ['Quarter Finals', 'Semi Finals', 'Finals'].includes(
        match.tournament.round,
      );

    return (
      matchesSearch &&
      matchesHero1 &&
      matchesHero2 &&
      matchesFormat &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesTopEight
    );
  });

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.tournament.date) - new Date(b.tournament.date);
        break;
      case 'tournament':
        comparison = a.tournament.name.localeCompare(b.tournament.name);
        break;
      case 'format':
        comparison = a.tournament.format.localeCompare(b.tournament.format);
        break;
      case 'duration':
        const aDuration = a.duration
          .split(':')
          .reduce((acc, time) => 60 * acc + +time, 0);
        const bDuration = b.duration
          .split(':')
          .reduce((acc, time) => 60 * acc + +time, 0);
        comparison = aDuration - bDuration;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMatches.length / matchesPerPage);
  const startIndex = (currentPage - 1) * matchesPerPage;
  const paginatedMatches = sortedMatches.slice(
    startIndex,
    startIndex + matchesPerPage,
  );

  const resetFilters = () => {
    setFilters({
      hero1: '',
      hero2: '',
      format: '',
      dateFrom: '',
      dateTo: '',
      topEight: false,
      tournament: '',
      round: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getHeroIcon = heroName => {
    // Simple mapping of heroes to icons
    const heroIcons = {
      'Vynnset, Iron Maiden': <Sword className="text-red-400" size={16} />,
      'Briar, Warden of Thorns': (
        <Shield className="text-green-400" size={16} />
      ),
      'Iyslander, Stormbind': <Zap className="text-blue-400" size={16} />,
      'Prism, Sculptor of Arc Light': (
        <Star className="text-yellow-400" size={16} />
      ),
      'Kano, Dracai of Aether': <Crown className="text-purple-400" size={16} />,
      'Rhinar, Reckless Rampage': (
        <Trophy className="text-orange-400" size={16} />
      ),
    };
    return (
      heroIcons[heroName] || <Gamepad2 className="text-gray-400" size={16} />
    );
  };

  const MatchCard = ({ match }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
    >
      {/* Match Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {match.featured && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
              <Star size={12} />
              <span>Featured</span>
            </div>
          )}
          {match.hasVideo && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
              <Eye size={12} />
              <span>Video</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{match.tournament.date}</div>
          <div className="text-xs text-gray-500">{match.duration}</div>
        </div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Player 1 */}
        <div
          className={`p-4 rounded-lg ${match.result.winner === 'player1' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700'}`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {getHeroIcon(match.player1.hero)}
            <span className="font-medium text-white">{match.player1.name}</span>
            {match.result.winner === 'player1' && (
              <Trophy className="text-yellow-400" size={14} />
            )}
          </div>
          <div className="text-sm text-gray-300 mb-1">{match.player1.hero}</div>
          <div className="text-xs text-gray-400">{match.player1.deck}</div>
          <div className="text-xs text-blue-400 mt-1">
            Rating: {match.player1.rating}
          </div>
        </div>

        {/* VS and Score */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-400 text-sm mb-2">VS</div>
          <div className="text-2xl font-bold text-white mb-2">
            {match.result.score}
          </div>
          <div className="text-xs text-gray-400">
            {match.result.games.length} game
            {match.result.games.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Player 2 */}
        <div
          className={`p-4 rounded-lg ${match.result.winner === 'player2' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700'}`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {getHeroIcon(match.player2.hero)}
            <span className="font-medium text-white">{match.player2.name}</span>
            {match.result.winner === 'player2' && (
              <Trophy className="text-yellow-400" size={14} />
            )}
          </div>
          <div className="text-sm text-gray-300 mb-1">{match.player2.hero}</div>
          <div className="text-xs text-gray-400">{match.player2.deck}</div>
          <div className="text-xs text-blue-400 mt-1">
            Rating: {match.player2.rating}
          </div>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Trophy size={14} />
            <span>{match.tournament.name}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Target size={14} />
            <span>{match.tournament.round}</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Award size={14} />
            <span>{match.tournament.format}</span>
          </span>
          <span className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{match.tournament.location}</span>
          </span>
        </div>
      </div>

      {/* Game Details */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-300">Game Results:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {match.result.games.map((game, index) => (
            <div key={index} className="bg-gray-700 rounded p-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Game {game.game}</span>
                <span className="text-gray-400">{game.duration}</span>
              </div>
              <div
                className={`font-medium ${game.winner === 'player1' ? 'text-green-400' : 'text-blue-400'}`}
              >
                Winner:{' '}
                {game.winner === 'player1'
                  ? match.player1.name
                  : match.player2.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4">
        {match.hasReplay && (
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
            View Replay
          </button>
        )}
        {match.hasVideo && (
          <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
            Watch Video
          </button>
        )}
        <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
          <BarChart3 size={14} className="inline mr-1" />
          Analysis
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Match Database</h1>
          <p className="text-gray-400">
            Search and analyze competitive matches from tournaments worldwide
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
                  placeholder="Search players, heroes, tournaments..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-6 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
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
                  {/* Hero Matchup */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero 1
                    </label>
                    <select
                      value={filters.hero1}
                      onChange={e =>
                        setFilters({ ...filters, hero1: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Hero</option>
                      {heroes.map(hero => (
                        <option key={hero} value={hero}>
                          {hero}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      VS Hero 2
                    </label>
                    <select
                      value={filters.hero2}
                      onChange={e =>
                        setFilters({ ...filters, hero2: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Hero</option>
                      {heroes.map(hero => (
                        <option key={hero} value={hero}>
                          {hero}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  {/* Top 8 Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Options
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.topEight}
                        onChange={e =>
                          setFilters({ ...filters, topEight: e.target.checked })
                        }
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Top 8 Only</span>
                    </label>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                {/* Filter Actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
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
            {Math.min(startIndex + matchesPerPage, sortedMatches.length)} of{' '}
            {sortedMatches.length} matches
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
                <option value="tournament">Tournament</option>
                <option value="format">Format</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              {sortOrder === 'asc' ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6 mb-8">
          <AnimatePresence>
            {paginatedMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
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
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
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
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No matches found</div>
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

export default Matches;
