import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  User,
  Trophy,
  Star,
  Award,
  Eye,
  Download,
  BarChart3,
  Sword,
  Shield,
  Crown,
  Target,
  Zap,
  Heart,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Gamepad2,
  Layers,
  Hash,
  Percent,
} from 'lucide-react';

const Decklists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    hero: '',
    format: '',
    archetype: '',
    tournament: '',
    placement: '',
    dateFrom: '',
    dateTo: '',
    colors: [],
    cardCount: '',
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [decksPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock decklists data
  const [decklists, setDecklists] = useState([
    {
      id: 1,
      name: 'Aggro Vynnset Control',
      hero: 'Vynnset, Iron Maiden',
      archetype: 'Aggro',
      format: 'Classic Constructed',
      player: 'DragonMaster',
      tournament: {
        name: 'KONIVRER World Championship 2024',
        placement: '1st',
        date: '2024-06-09',
        participants: 512,
      },
      cardCount: 80,
      colors: ['Red', 'Generic'],
      mainDeck: 60,
      equipment: 11,
      sideBoard: 9,
      winRate: 87.5,
      popularity: 12.3,
      metaShare: 8.7,
      trend: 'up',
      featured: true,
      verified: true,
      description:
        'Aggressive warrior build focusing on early pressure and equipment synergy.',
      keyCards: [
        { name: 'Vynnset, Iron Maiden', type: 'Hero', rarity: 'Legendary' },
        { name: 'Steelblade Supremacy', type: 'Action', rarity: 'Majestic' },
        { name: 'Ironsong Determination', type: 'Action', rarity: 'Rare' },
        { name: "Warrior's Valor", type: 'Action', rarity: 'Common' },
      ],
      stats: {
        avgGameLength: '14:32',
        gamesPlayed: 24,
        wins: 21,
        losses: 3,
      },
      tags: ['Meta', 'Tournament Winner', 'Aggressive'],
      lastUpdated: '2024-06-09',
      author: {
        name: 'DragonMaster',
        rating: 2150,
        achievements: ['World Champion', 'Regional Winner'],
      },
    },
    {
      id: 2,
      name: 'Control Iyslander Freeze',
      hero: 'Iyslander, Stormbind',
      archetype: 'Control',
      format: 'Classic Constructed',
      player: 'IceMage',
      tournament: {
        name: 'Regional Qualifier - Summer Series',
        placement: '2nd',
        date: '2024-06-08',
        participants: 256,
      },
      cardCount: 80,
      colors: ['Blue', 'Generic'],
      mainDeck: 60,
      equipment: 11,
      sideBoard: 9,
      winRate: 73.2,
      popularity: 8.9,
      metaShare: 6.4,
      trend: 'stable',
      featured: false,
      verified: true,
      description:
        'Control-oriented wizard deck with powerful late-game threats and board control.',
      keyCards: [
        { name: 'Iyslander, Stormbind', type: 'Hero', rarity: 'Legendary' },
        { name: 'Frost Hex', type: 'Action', rarity: 'Majestic' },
        { name: "Winter's Bite", type: 'Action', rarity: 'Rare' },
        { name: 'Ice Eternal', type: 'Action', rarity: 'Common' },
      ],
      stats: {
        avgGameLength: '22:45',
        gamesPlayed: 18,
        wins: 13,
        losses: 5,
      },
      tags: ['Control', 'Late Game', 'Defensive'],
      lastUpdated: '2024-06-08',
      author: {
        name: 'IceMage',
        rating: 1980,
        achievements: ['Regional Finalist', 'Local Champion'],
      },
    },
    {
      id: 3,
      name: 'Combo Prism Light',
      hero: 'Prism, Sculptor of Arc Light',
      archetype: 'Combo',
      format: 'Classic Constructed',
      player: 'LightWeaver',
      tournament: {
        name: 'Friday Night KONIVRER Championship',
        placement: '1st',
        date: '2024-06-07',
        participants: 64,
      },
      cardCount: 80,
      colors: ['Yellow', 'Generic'],
      mainDeck: 60,
      equipment: 11,
      sideBoard: 9,
      winRate: 81.3,
      popularity: 5.7,
      metaShare: 4.2,
      trend: 'up',
      featured: true,
      verified: true,
      description:
        'Explosive combo deck that can win games quickly with the right setup.',
      keyCards: [
        {
          name: 'Prism, Sculptor of Arc Light',
          type: 'Hero',
          rarity: 'Legendary',
        },
        { name: 'Herald of Erudition', type: 'Ally', rarity: 'Majestic' },
        { name: 'Luminaris', type: 'Action', rarity: 'Rare' },
        { name: 'Spectral Shield', type: 'Equipment', rarity: 'Common' },
      ],
      stats: {
        avgGameLength: '16:18',
        gamesPlayed: 16,
        wins: 13,
        losses: 3,
      },
      tags: ['Combo', 'Fast', 'High Risk'],
      lastUpdated: '2024-06-07',
      author: {
        name: 'LightWeaver',
        rating: 1850,
        achievements: ['Local Champion', 'Combo Master'],
      },
    },
    {
      id: 4,
      name: 'Midrange Briar Elemental',
      hero: 'Briar, Warden of Thorns',
      archetype: 'Midrange',
      format: 'Classic Constructed',
      player: 'NatureGuard',
      tournament: {
        name: 'Legacy Masters Tournament',
        placement: '3rd',
        date: '2024-06-06',
        participants: 128,
      },
      cardCount: 80,
      colors: ['Green', 'Generic'],
      mainDeck: 60,
      equipment: 11,
      sideBoard: 9,
      winRate: 68.9,
      popularity: 11.2,
      metaShare: 7.8,
      trend: 'down',
      featured: false,
      verified: true,
      description:
        'Balanced midrange strategy with strong elemental synergies and board presence.',
      keyCards: [
        { name: 'Briar, Warden of Thorns', type: 'Hero', rarity: 'Legendary' },
        { name: 'Bramble Blast', type: 'Action', rarity: 'Majestic' },
        { name: 'Earth Elemental', type: 'Ally', rarity: 'Rare' },
        { name: 'Thorn of the Rose', type: 'Equipment', rarity: 'Common' },
      ],
      stats: {
        avgGameLength: '19:24',
        gamesPlayed: 22,
        wins: 15,
        losses: 7,
      },
      tags: ['Midrange', 'Elemental', 'Balanced'],
      lastUpdated: '2024-06-06',
      author: {
        name: 'NatureGuard',
        rating: 1920,
        achievements: ['Top 8 Specialist', 'Elemental Expert'],
      },
    },
    {
      id: 5,
      name: 'Burn Kano Wizard',
      hero: 'Kano, Dracai of Aether',
      archetype: 'Burn',
      format: 'Classic Constructed',
      player: 'SpellSlinger',
      tournament: {
        name: 'Online Championship Series',
        placement: '5th',
        date: '2024-06-05',
        participants: 512,
      },
      cardCount: 80,
      colors: ['Red', 'Blue', 'Generic'],
      mainDeck: 60,
      equipment: 11,
      sideBoard: 9,
      winRate: 75.6,
      popularity: 9.4,
      metaShare: 6.1,
      trend: 'stable',
      featured: false,
      verified: true,
      description:
        'High-damage spell-based deck that aims to burn opponents quickly.',
      keyCards: [
        { name: 'Kano, Dracai of Aether', type: 'Hero', rarity: 'Legendary' },
        { name: 'Blazing Aether', type: 'Action', rarity: 'Majestic' },
        { name: 'Aether Flare', type: 'Action', rarity: 'Rare' },
        { name: 'Spell Fray Tiara', type: 'Equipment', rarity: 'Common' },
      ],
      stats: {
        avgGameLength: '12:56',
        gamesPlayed: 20,
        wins: 15,
        losses: 5,
      },
      tags: ['Burn', 'Spell Heavy', 'Fast'],
      lastUpdated: '2024-06-05',
      author: {
        name: 'SpellSlinger',
        rating: 2020,
        achievements: ['Spell Master', 'Online Champion'],
      },
    },
  ]);

  // Available options for filters
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

  const formats = [
    'Classic Constructed',
    'Blitz',
    'Draft',
    'Sealed',
    'Legacy',
    'Limited',
  ];
  const archetypes = [
    'Aggro',
    'Control',
    'Midrange',
    'Combo',
    'Burn',
    'Tempo',
    'Ramp',
  ];
  const placements = ['1st', '2nd', '3rd', '4th', 'Top 8', 'Top 16', 'Top 32'];
  const colors = ['Red', 'Blue', 'Yellow', 'Green', 'Generic'];

  // Filter decklists
  const filteredDecklists = decklists.filter(deck => {
    const matchesSearch =
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.hero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.archetype.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHero = !filters.hero || deck.hero === filters.hero;
    const matchesFormat = !filters.format || deck.format === filters.format;
    const matchesArchetype =
      !filters.archetype || deck.archetype === filters.archetype;
    const matchesPlacement =
      !filters.placement || deck.tournament.placement === filters.placement;

    const matchesDateFrom =
      !filters.dateFrom ||
      new Date(deck.tournament.date) >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo ||
      new Date(deck.tournament.date) <= new Date(filters.dateTo);

    const matchesColors =
      filters.colors.length === 0 ||
      filters.colors.every(color => deck.colors.includes(color));

    const matchesCardCount =
      !filters.cardCount || deck.cardCount.toString() === filters.cardCount;

    return (
      matchesSearch &&
      matchesHero &&
      matchesFormat &&
      matchesArchetype &&
      matchesPlacement &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesColors &&
      matchesCardCount
    );
  });

  // Sort decklists
  const sortedDecklists = [...filteredDecklists].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.tournament.date) - new Date(b.tournament.date);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'winRate':
        comparison = a.winRate - b.winRate;
        break;
      case 'popularity':
        comparison = a.popularity - b.popularity;
        break;
      case 'placement':
        const placementOrder = {
          '1st': 1,
          '2nd': 2,
          '3rd': 3,
          '4th': 4,
          'Top 8': 8,
          'Top 16': 16,
          'Top 32': 32,
        };
        comparison =
          (placementOrder[a.tournament.placement] || 99) -
          (placementOrder[b.tournament.placement] || 99);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedDecklists.length / decksPerPage);
  const startIndex = (currentPage - 1) * decksPerPage;
  const paginatedDecklists = sortedDecklists.slice(
    startIndex,
    startIndex + decksPerPage,
  );

  const resetFilters = () => {
    setFilters({
      hero: '',
      format: '',
      archetype: '',
      tournament: '',
      placement: '',
      dateFrom: '',
      dateTo: '',
      colors: [],
      cardCount: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getHeroIcon = heroName => {
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

  const getArchetypeColor = archetype => {
    const colors = {
      Aggro: 'text-red-400 bg-red-500/20',
      Control: 'text-blue-400 bg-blue-500/20',
      Midrange: 'text-green-400 bg-green-500/20',
      Combo: 'text-purple-400 bg-purple-500/20',
      Burn: 'text-orange-400 bg-orange-500/20',
      Tempo: 'text-cyan-400 bg-cyan-500/20',
      Ramp: 'text-yellow-400 bg-yellow-500/20',
    };
    return colors[archetype] || 'text-gray-400 bg-gray-500/20';
  };

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-400" size={14} />;
      case 'down':
        return <TrendingDown className="text-red-400" size={14} />;
      default:
        return <Activity className="text-gray-400" size={14} />;
    }
  };

  const getPlacementColor = placement => {
    if (placement === '1st') return 'text-yellow-400';
    if (placement === '2nd') return 'text-gray-300';
    if (placement === '3rd') return 'text-orange-400';
    return 'text-gray-400';
  };

  const DeckCard = ({ deck }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {deck.featured && <Star className="text-yellow-400" size={16} />}
            {deck.verified && <Award className="text-blue-400" size={16} />}
            <h3 className="font-bold text-lg text-white">{deck.name}</h3>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              {getHeroIcon(deck.hero)}
              <span>{deck.hero}</span>
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getArchetypeColor(deck.archetype)}`}
            >
              {deck.archetype}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold ${getPlacementColor(deck.tournament.placement)}`}
          >
            {deck.tournament.placement}
          </div>
          <div className="text-xs text-gray-400">
            {deck.tournament.participants} players
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {deck.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-xs">Win Rate</div>
          <div
            className={`font-bold ${
              deck.winRate >= 75
                ? 'text-green-400'
                : deck.winRate >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
            }`}
          >
            {deck.winRate}%
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-xs">Popularity</div>
          <div className="text-white font-bold">{deck.popularity}%</div>
        </div>
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-xs">Cards</div>
          <div className="text-white font-bold">{deck.cardCount}</div>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="bg-gray-700 rounded p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">{deck.tournament.name}</span>
          <span className="text-gray-400 text-sm">{deck.tournament.date}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">by {deck.player}</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">{deck.format}</span>
            {getTrendIcon(deck.trend)}
          </div>
        </div>
      </div>

      {/* Key Cards */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-300 mb-2">Key Cards:</div>
        <div className="grid grid-cols-2 gap-2">
          {deck.keyCards.slice(0, 4).map((card, index) => (
            <div key={index} className="bg-gray-700 rounded p-2 text-xs">
              <div className="text-white font-medium">{card.name}</div>
              <div className="text-gray-400">{card.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {deck.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="btn btn-sm btn-primary">
            <Eye size={12} />
            View
          </button>
          <button className="btn btn-sm btn-success">
            <Copy size={12} />
            Copy
          </button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{deck.stats.gamesPlayed} games</span>
          <span>•</span>
          <span>{deck.stats.avgGameLength}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tournament Decklists</h1>
          <p className="text-gray-400">
            Explore winning decklists from competitive tournaments worldwide
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
                  placeholder="Search decks, heroes, players, tournaments..."
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
                  {/* Hero */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero
                    </label>
                    <select
                      value={filters.hero}
                      onChange={e =>
                        setFilters({ ...filters, hero: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Heroes</option>
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

                  {/* Archetype */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Archetype
                    </label>
                    <select
                      value={filters.archetype}
                      onChange={e =>
                        setFilters({ ...filters, archetype: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Archetypes</option>
                      {archetypes.map(archetype => (
                        <option key={archetype} value={archetype}>
                          {archetype}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Placement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Placement
                    </label>
                    <select
                      value={filters.placement}
                      onChange={e =>
                        setFilters({ ...filters, placement: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Placements</option>
                      {placements.map(placement => (
                        <option key={placement} value={placement}>
                          {placement}
                        </option>
                      ))}
                    </select>
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
            {Math.min(startIndex + decksPerPage, sortedDecklists.length)} of{' '}
            {sortedDecklists.length} decklists
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
                <option value="winRate">Win Rate</option>
                <option value="popularity">Popularity</option>
                <option value="placement">Placement</option>
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

        {/* Decklists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatePresence>
            {paginatedDecklists.map((deck, index) => (
              <DeckCard key={deck.id} deck={deck} />
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
        {sortedDecklists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No decklists found</div>
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

export default Decklists;
