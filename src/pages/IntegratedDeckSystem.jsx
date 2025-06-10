import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  PlusCircle,
  Save,
  BookOpen,
  ArrowLeft,
  Settings,
  Bookmark,
  Share2,
  Edit3,
  Trash2,
  Import,
  FileText,
  BarChart2,
  PieChart,
  LineChart,
} from 'lucide-react';

const IntegratedDeckSystem = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState('browse'); // 'browse', 'analytics', 'mydecks'
  const [selectedDeck, setSelectedDeck] = useState(null);
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

  // Check URL parameters on component mount
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'mydecks' && user) {
      setCurrentView('mydecks');
    }
  }, [searchParams, user]);

  // Mock data for decklists with enhanced analytics
  const mockDecklists = [
    {
      id: 1,
      name: 'Elemental Storm Control',
      hero: 'Zephyr',
      archetype: 'Control',
      format: 'Standard',
      author: 'ProPlayer123',
      authorRating: 2450,
      tournament: 'World Championship 2024',
      placement: 1,
      date: '2024-07-15',
      views: 15420,
      saves: 892,
      winRate: 68.5,
      gamesPlayed: 127,
      metaShare: 12.3,
      colors: ['Lightning', 'Water', 'Air'],
      cardCount: 60,
      featured: true,
      cards: [
        {
          name: 'Lightning Bolt',
          cost: 3,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Storm Elemental',
          cost: 5,
          count: 3,
          type: 'Creature',
          rarity: 'Rare',
        },
        {
          name: "Zephyr's Blessing",
          cost: 2,
          count: 2,
          type: 'Spell',
          rarity: 'Legendary',
        },
        {
          name: 'Water Shield',
          cost: 1,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Air Current',
          cost: 4,
          count: 3,
          type: 'Spell',
          rarity: 'Uncommon',
        },
        {
          name: 'Tempest Lord',
          cost: 7,
          count: 2,
          type: 'Creature',
          rarity: 'Legendary',
        },
        {
          name: 'Chain Lightning',
          cost: 2,
          count: 4,
          type: 'Spell',
          rarity: 'Uncommon',
        },
        {
          name: 'Elemental Fusion',
          cost: 6,
          count: 2,
          type: 'Spell',
          rarity: 'Rare',
        },
      ],
      analytics: {
        manaCurve: [0, 8, 12, 15, 10, 8, 5, 2],
        elementDistribution: { Lightning: 35, Water: 25, Air: 40 },
        rarityDistribution: {
          Common: 40,
          Uncommon: 35,
          Rare: 20,
          Legendary: 5,
        },
        typeDistribution: { Spells: 70, Creatures: 25, Equipment: 5 },
        matchups: [
          { archetype: 'Aggro Fire', winRate: 75, games: 20 },
          { archetype: 'Midrange Earth', winRate: 62, games: 16 },
          { archetype: 'Control Water', winRate: 45, games: 22 },
        ],
        tournamentHistory: [
          {
            name: 'World Championship 2024',
            date: '2024-07-15',
            placement: 1,
            participants: 256,
            format: 'Standard',
            winRate: 85.7,
            rounds: 9,
            wins: 6,
            losses: 3,
          },
          {
            name: 'Regional Qualifier',
            date: '2024-06-20',
            placement: 3,
            participants: 128,
            format: 'Standard',
            winRate: 75.0,
            rounds: 7,
            wins: 5,
            losses: 2,
          },
          {
            name: 'Local Tournament',
            date: '2024-05-15',
            placement: 1,
            participants: 64,
            format: 'Standard',
            winRate: 100.0,
            rounds: 6,
            wins: 6,
            losses: 0,
          },
        ],
        recentMatches: [
          {
            opponent: 'FireMaster',
            opponentDeck: 'Blazing Aggro Rush',
            result: 'Win',
            date: '2024-07-15',
            tournament: 'World Championship 2024',
            round: 'Finals',
            duration: '12:34',
          },
          {
            opponent: 'WaterWizard',
            opponentDeck: 'Deep Sea Control',
            result: 'Win',
            date: '2024-07-15',
            tournament: 'World Championship 2024',
            round: 'Semi-Finals',
            duration: '18:45',
          },
          {
            opponent: 'EarthShaker',
            opponentDeck: 'Mountain Fortress',
            result: 'Loss',
            date: '2024-07-14',
            tournament: 'World Championship 2024',
            round: 'Quarter-Finals',
            duration: '15:22',
          },
          {
            opponent: 'StormCaller',
            opponentDeck: 'Lightning Rush',
            result: 'Win',
            date: '2024-07-14',
            tournament: 'World Championship 2024',
            round: 'Round 6',
            duration: '9:18',
          },
          {
            opponent: 'NatureLover',
            opponentDeck: 'Forest Harmony',
            result: 'Win',
            date: '2024-07-13',
            tournament: 'World Championship 2024',
            round: 'Round 5',
            duration: '14:56',
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Blazing Aggro Rush',
      hero: 'Ignis',
      archetype: 'Aggro',
      format: 'Standard',
      author: 'FireMaster',
      authorRating: 2280,
      tournament: 'Summer Regional',
      placement: 3,
      date: '2024-06-20',
      views: 8930,
      saves: 445,
      winRate: 72.1,
      gamesPlayed: 89,
      metaShare: 8.7,
      colors: ['Fire', 'Earth'],
      cardCount: 60,
      featured: false,
      cards: [
        {
          name: 'Flame Burst',
          cost: 1,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Fire Imp',
          cost: 2,
          count: 4,
          type: 'Creature',
          rarity: 'Common',
        },
        {
          name: 'Molten Hammer',
          cost: 3,
          count: 3,
          type: 'Equipment',
          rarity: 'Uncommon',
        },
        { name: 'Lava Flow', cost: 4, count: 2, type: 'Spell', rarity: 'Rare' },
        {
          name: 'Ember Spirit',
          cost: 1,
          count: 4,
          type: 'Creature',
          rarity: 'Common',
        },
        {
          name: 'Inferno Blast',
          cost: 5,
          count: 2,
          type: 'Spell',
          rarity: 'Rare',
        },
        {
          name: 'Rock Golem',
          cost: 3,
          count: 3,
          type: 'Creature',
          rarity: 'Uncommon',
        },
        {
          name: 'Volcanic Eruption',
          cost: 6,
          count: 1,
          type: 'Spell',
          rarity: 'Legendary',
        },
      ],
      analytics: {
        manaCurve: [0, 12, 16, 14, 10, 6, 2, 0],
        elementDistribution: { Fire: 70, Earth: 30 },
        rarityDistribution: {
          Common: 50,
          Uncommon: 30,
          Rare: 15,
          Legendary: 5,
        },
        typeDistribution: { Spells: 45, Creatures: 45, Equipment: 10 },
        matchups: [
          { archetype: 'Control Lightning', winRate: 80, games: 15 },
          { archetype: 'Midrange Water', winRate: 68, games: 19 },
          { archetype: 'Aggro Fire', winRate: 52, games: 25 },
        ],
      },
    },
    {
      id: 3,
      name: "Nature's Harmony",
      hero: 'Gaia',
      archetype: 'Midrange',
      format: 'Limited',
      author: 'EarthWarden',
      authorRating: 2150,
      tournament: 'Local Championship',
      placement: 2,
      date: '2024-05-10',
      views: 5670,
      saves: 234,
      winRate: 64.3,
      gamesPlayed: 56,
      metaShare: 5.2,
      colors: ['Earth', 'Nature'],
      cardCount: 40,
      featured: false,
      cards: [
        {
          name: 'Forest Guardian',
          cost: 4,
          count: 3,
          type: 'Creature',
          rarity: 'Rare',
        },
        {
          name: "Nature's Growth",
          cost: 2,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Stone Wall',
          cost: 3,
          count: 3,
          type: 'Spell',
          rarity: 'Uncommon',
        },
        {
          name: 'Tree of Life',
          cost: 5,
          count: 2,
          type: 'Creature',
          rarity: 'Legendary',
        },
        {
          name: 'Healing Herbs',
          cost: 1,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Earth Spike',
          cost: 2,
          count: 3,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Druid Staff',
          cost: 3,
          count: 2,
          type: 'Equipment',
          rarity: 'Uncommon',
        },
        {
          name: "Gaia's Wrath",
          cost: 7,
          count: 1,
          type: 'Spell',
          rarity: 'Legendary',
        },
      ],
      analytics: {
        manaCurve: [0, 4, 10, 8, 6, 4, 0, 2],
        elementDistribution: { Earth: 45, Nature: 55 },
        rarityDistribution: {
          Common: 45,
          Uncommon: 30,
          Rare: 20,
          Legendary: 5,
        },
        typeDistribution: { Spells: 60, Creatures: 30, Equipment: 10 },
        matchups: [
          { archetype: 'Aggro Fire', winRate: 70, games: 12 },
          { archetype: 'Control Lightning', winRate: 55, games: 18 },
          { archetype: 'Midrange Water', winRate: 48, games: 14 },
        ],
      },
    },
  ];

  // Mock user's personal decks
  const mockUserDecks = [
    {
      id: 'user1',
      name: 'My Lightning Deck',
      hero: 'Zephyr',
      archetype: 'Control',
      format: 'Standard',
      lastModified: '2024-06-08',
      cardCount: 58,
      isPublic: false,
      colors: ['Lightning', 'Air'],
      winRate: 0, // No games played yet
      gamesPlayed: 0,
      metaShare: 0,
      placement: 'N/A',
      cards: [
        {
          name: 'Lightning Bolt',
          cost: 3,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Storm Elemental',
          cost: 5,
          count: 3,
          type: 'Creature',
          rarity: 'Rare',
        },
        {
          name: 'Air Current',
          cost: 2,
          count: 4,
          type: 'Spell',
          rarity: 'Uncommon',
        },
        {
          name: 'Thunder Strike',
          cost: 1,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Wind Walker',
          cost: 4,
          count: 3,
          type: 'Creature',
          rarity: 'Uncommon',
        },
        {
          name: 'Lightning Lord',
          cost: 7,
          count: 2,
          type: 'Creature',
          rarity: 'Legendary',
        },
      ],
      analytics: {
        manaCurve: [2, 8, 12, 10, 8, 6, 4, 3, 2, 2, 1],
        elementDistribution: {
          Lightning: 48.3,
          Air: 34.5,
          Neutral: 17.2,
        },
        rarityDistribution: {
          Common: 41.4,
          Uncommon: 31.0,
          Rare: 20.7,
          Legendary: 6.9,
        },
        matchups: [
          { archetype: 'Fire Aggro', winRate: 65, games: 8 },
          { archetype: 'Water Control', winRate: 45, games: 6 },
          { archetype: 'Earth Midrange', winRate: 70, games: 4 },
        ],
        tournamentHistory: [
          {
            name: 'Local Tournament #1',
            date: '2024-06-01',
            placement: 3,
            participants: 16,
            winRate: 75,
            rounds: 5,
            wins: 3,
            losses: 1,
          },
        ],
        recentMatches: [
          {
            opponent: 'FireMaster',
            opponentDeck: 'Blazing Aggro Rush',
            result: 'Win',
            date: '2024-06-01',
            tournament: 'Local Tournament #1',
            round: 'Round 5',
            duration: '12:34',
          },
          {
            opponent: 'WaterWizard',
            opponentDeck: 'Deep Sea Control',
            result: 'Win',
            date: '2024-06-01',
            tournament: 'Local Tournament #1',
            round: 'Round 4',
            duration: '18:45',
          },
          {
            opponent: 'EarthShaker',
            opponentDeck: 'Mountain Fortress',
            result: 'Loss',
            date: '2024-06-01',
            tournament: 'Local Tournament #1',
            round: 'Round 3',
            duration: '15:22',
          },
          {
            opponent: 'StormCaller',
            opponentDeck: 'Lightning Rush',
            result: 'Win',
            date: '2024-06-01',
            tournament: 'Local Tournament #1',
            round: 'Round 2',
            duration: '9:18',
          },
        ],
      },
    },
    {
      id: 'user2',
      name: 'Experimental Fire Build',
      hero: 'Ignis',
      archetype: 'Aggro',
      format: 'Standard',
      lastModified: '2024-06-05',
      cardCount: 60,
      isPublic: true,
      colors: ['Fire'],
      winRate: 58.3,
      gamesPlayed: 12,
      metaShare: 3.2,
      placement: 8,
      cards: [
        {
          name: 'Flame Burst',
          cost: 1,
          count: 4,
          type: 'Spell',
          rarity: 'Common',
        },
        {
          name: 'Fire Imp',
          cost: 2,
          count: 4,
          type: 'Creature',
          rarity: 'Common',
        },
        {
          name: 'Molten Hammer',
          cost: 3,
          count: 3,
          type: 'Equipment',
          rarity: 'Uncommon',
        },
        { name: 'Lava Flow', cost: 4, count: 2, type: 'Spell', rarity: 'Rare' },
        {
          name: 'Ember Spirit',
          cost: 1,
          count: 4,
          type: 'Creature',
          rarity: 'Common',
        },
        {
          name: 'Inferno Blast',
          cost: 5,
          count: 2,
          type: 'Spell',
          rarity: 'Rare',
        },
        {
          name: 'Volcanic Eruption',
          cost: 6,
          count: 1,
          type: 'Spell',
          rarity: 'Legendary',
        },
      ],
      analytics: {
        manaCurve: [0, 12, 14, 12, 10, 6, 4, 2, 0, 0, 0],
        elementDistribution: {
          Fire: 75.0,
          Neutral: 25.0,
        },
        rarityDistribution: {
          Common: 50.0,
          Uncommon: 33.3,
          Rare: 13.3,
          Legendary: 3.3,
        },
        matchups: [
          { archetype: 'Lightning Control', winRate: 72, games: 5 },
          { archetype: 'Water Control', winRate: 40, games: 3 },
          { archetype: 'Earth Midrange', winRate: 60, games: 4 },
        ],
        tournamentHistory: [
          {
            name: 'Local FNM',
            date: '2024-06-05',
            placement: 8,
            participants: 32,
            format: 'Standard',
            winRate: 58.3,
            rounds: 5,
            wins: 3,
            losses: 2,
          },
          {
            name: 'Weekly Tournament',
            date: '2024-05-28',
            placement: 4,
            participants: 16,
            format: 'Standard',
            winRate: 66.7,
            rounds: 4,
            wins: 2,
            losses: 1,
          },
        ],
        recentMatches: [
          {
            opponent: 'LocalPlayer1',
            opponentDeck: 'Water Control',
            result: 'Win',
            date: '2024-06-05',
            tournament: 'Local FNM',
            round: 'Round 5',
            duration: '8:45',
          },
          {
            opponent: 'LocalPlayer2',
            opponentDeck: 'Earth Midrange',
            result: 'Loss',
            date: '2024-06-05',
            tournament: 'Local FNM',
            round: 'Round 4',
            duration: '12:30',
          },
          {
            opponent: 'LocalPlayer3',
            opponentDeck: 'Lightning Aggro',
            result: 'Win',
            date: '2024-06-05',
            tournament: 'Local FNM',
            round: 'Round 3',
            duration: '6:22',
          },
        ],
      },
    },
  ];

  const filteredDecks = mockDecklists.filter(deck => {
    const matchesSearch =
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.archetype.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.hero || deck.hero === filters.hero) &&
      (!filters.format || deck.format === filters.format) &&
      (!filters.archetype || deck.archetype === filters.archetype) &&
      (!filters.tournament || deck.tournament.includes(filters.tournament)) &&
      (filters.colors.length === 0 ||
        filters.colors.every(color => deck.colors.includes(color)));

    return matchesSearch && matchesFilters;
  });

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'winRate':
        aValue = a.winRate;
        bValue = b.winRate;
        break;
      case 'views':
        aValue = a.views;
        bValue = b.views;
        break;
      case 'saves':
        aValue = a.saves;
        bValue = b.saves;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedDecks.length / decksPerPage);
  const startIndex = (currentPage - 1) * decksPerPage;
  const paginatedDecks = sortedDecks.slice(
    startIndex,
    startIndex + decksPerPage,
  );

  const handleDeckClick = deck => {
    setSelectedDeck(deck);
    setCurrentView('analytics');
  };

  const handleSaveDeck = deckId => {
    // Implementation for saving deck to user's collection
    console.log('Saving deck:', deckId);
  };

  const AnalyticsCard = ({ title, children, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const renderBrowseView = () => (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deck Hub</h1>
          <p className="text-gray-400">
            Discover, analyze, and build the perfect deck
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/deckbuilder"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Deck
          </Link>
          <Link
            to="/deckbuilder-advanced"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Advanced Builder
          </Link>
          {user && (
            <button
              onClick={() => setCurrentView('mydecks')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              My Decks ({mockUserDecks.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search decks, authors, archetypes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.format}
              onChange={e => setFilters({ ...filters, format: e.target.value })}
              className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Formats</option>
              <option value="Standard">Standard</option>
              <option value="Limited">Limited</option>
              <option value="Draft">Draft</option>
            </select>
            <select
              value={filters.archetype}
              onChange={e =>
                setFilters({ ...filters, archetype: e.target.value })
              }
              className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Archetypes</option>
              <option value="Aggro">Aggro</option>
              <option value="Control">Control</option>
              <option value="Midrange">Midrange</option>
              <option value="Combo">Combo</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showAdvancedFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
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
              className="border-t border-gray-700 pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero
                  </label>
                  <select
                    value={filters.hero}
                    onChange={e =>
                      setFilters({ ...filters, hero: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Heroes</option>
                    <option value="Zephyr">Zephyr</option>
                    <option value="Ignis">Ignis</option>
                    <option value="Gaia">Gaia</option>
                    <option value="Aqua">Aqua</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament
                  </label>
                  <input
                    type="text"
                    placeholder="Tournament name..."
                    value={filters.tournament}
                    onChange={e =>
                      setFilters({ ...filters, tournament: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date">Date</option>
                      <option value="winRate">Win Rate</option>
                      <option value="views">Views</option>
                      <option value="saves">Saves</option>
                    </select>
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }
                      className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition-colors"
                    >
                      {sortOrder === 'asc' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedDecks.map(deck => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden cursor-pointer group"
            onClick={() => handleDeckClick(deck)}
          >
            {deck.featured && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <Star className="w-4 h-4" />
                  Featured Deck
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {deck.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <User className="w-4 h-4" />
                    <span>{deck.author}</span>
                    <span className="text-yellow-400">
                      ({deck.authorRating})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{deck.winRate}%</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {deck.gamesPlayed} games
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-400 text-sm">Hero</span>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{deck.hero}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Archetype</span>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">
                      {deck.archetype}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Format</span>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">
                      {deck.format}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Tournament</span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-medium">
                      #{deck.placement}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{deck.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark className="w-4 h-4" />
                  <span>{deck.saves}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(deck.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {deck.colors.map(color => (
                    <div
                      key={color}
                      className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                        color === 'Fire'
                          ? 'bg-red-500'
                          : color === 'Water'
                            ? 'bg-blue-500'
                            : color === 'Earth'
                              ? 'bg-green-500'
                              : color === 'Air'
                                ? 'bg-gray-300'
                                : color === 'Lightning'
                                  ? 'bg-yellow-500'
                                  : color === 'Nature'
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-500'
                      }`}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  {user && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSaveDeck(deck.id);
                      }}
                      className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors"
                      title="Save to My Decks"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // Copy deck to clipboard or share
                    }}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
                    title="Share Deck"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalyticsView = () => {
    if (!selectedDeck) return null;

    const { analytics } = selectedDeck;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('browse')}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {selectedDeck.name}
            </h1>
            <p className="text-gray-400">
              Detailed deck analytics and performance metrics
            </p>
          </div>
        </div>

        {/* Deck Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {selectedDeck.winRate}%
              </div>
              <div className="text-gray-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {selectedDeck.gamesPlayed}
              </div>
              <div className="text-gray-400">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {selectedDeck.metaShare}%
              </div>
              <div className="text-gray-400">Meta Share</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                #{selectedDeck.placement}
              </div>
              <div className="text-gray-400">Tournament Finish</div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mana Curve */}
          <AnalyticsCard title="Mana Curve" icon={BarChart2}>
            <div className="space-y-2">
              {analytics.manaCurve.map((count, cost) => (
                <div key={cost} className="flex items-center gap-3">
                  <span className="w-4 text-gray-400">{cost}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / Math.max(...analytics.manaCurve)) * 100}%`,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>

          {/* Element Distribution */}
          <AnalyticsCard title="Element Distribution" icon={PieChart}>
            <div className="space-y-3">
              {Object.entries(analytics.elementDistribution).map(
                ([element, percentage]) => (
                  <div
                    key={element}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          element === 'Fire'
                            ? 'bg-red-500'
                            : element === 'Water'
                              ? 'bg-blue-500'
                              : element === 'Earth'
                                ? 'bg-green-500'
                                : element === 'Air'
                                  ? 'bg-gray-300'
                                  : element === 'Lightning'
                                    ? 'bg-yellow-500'
                                    : element === 'Nature'
                                      ? 'bg-emerald-500'
                                      : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-white">{element}</span>
                    </div>
                    <span className="text-gray-400">{percentage}%</span>
                  </div>
                ),
              )}
            </div>
          </AnalyticsCard>

          {/* Rarity Distribution */}
          <AnalyticsCard title="Rarity Breakdown" icon={Star}>
            <div className="space-y-3">
              {Object.entries(analytics.rarityDistribution).map(
                ([rarity, percentage]) => (
                  <div
                    key={rarity}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          rarity === 'Common'
                            ? 'bg-gray-400'
                            : rarity === 'Uncommon'
                              ? 'bg-green-400'
                              : rarity === 'Rare'
                                ? 'bg-blue-400'
                                : 'bg-yellow-400'
                        }`}
                      />
                      <span className="text-white">{rarity}</span>
                    </div>
                    <span className="text-gray-400">{percentage}%</span>
                  </div>
                ),
              )}
            </div>
          </AnalyticsCard>

          {/* Matchup Analysis */}
          <AnalyticsCard title="Matchup Analysis" icon={Target}>
            <div className="space-y-3">
              {analytics.matchups.map((matchup, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">
                      {matchup.archetype}
                    </div>
                    <div className="text-xs text-gray-400">
                      {matchup.games} games
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      matchup.winRate >= 60
                        ? 'text-green-400'
                        : matchup.winRate >= 40
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {matchup.winRate}%
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>

        {/* Tournament History */}
        <AnalyticsCard title="Tournament History" icon={Trophy}>
          <div className="space-y-4">
            {analytics.tournamentHistory?.map((tournament, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold">
                      {tournament.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tournament.placement === 1
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : tournament.placement <= 3
                            ? 'bg-orange-500/20 text-orange-400'
                            : tournament.placement <= 8
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      #{tournament.placement}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <div className="text-white">
                        {new Date(tournament.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Participants:</span>
                      <div className="text-white">
                        {tournament.participants}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Record:</span>
                      <div className="text-white">
                        {tournament.wins}-{tournament.losses}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Win Rate:</span>
                      <div
                        className={`font-medium ${
                          tournament.winRate >= 70
                            ? 'text-green-400'
                            : tournament.winRate >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {tournament.winRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Recent Matches */}
        <AnalyticsCard title="Recent Matches" icon={Gamepad2}>
          <div className="space-y-3">
            {analytics.recentMatches?.map((match, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      match.result === 'Win' ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        vs {match.opponent}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({match.opponentDeck})
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {match.tournament} • {match.round} •{' '}
                      {new Date(match.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      match.result === 'Win' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {match.result}
                  </div>
                  <div className="text-xs text-gray-400">{match.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Card List */}
        <AnalyticsCard title="Deck Composition" icon={Layers}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDeck.cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-blue-400">
                    {card.count}x
                  </span>
                  <div>
                    <div className="text-white font-medium">{card.name}</div>
                    <div className="text-xs text-gray-400">
                      {card.type} • {card.rarity}
                    </div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">{card.cost}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/deckbuilder"
            state={{ importDeck: selectedDeck }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit in Builder
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(selectedDeck));
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Deck
          </button>
          {user && (
            <button
              onClick={() => handleSaveDeck(selectedDeck.id)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save to My Decks
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMyDecksView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('browse')}
          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">My Decks</h1>
          <p className="text-gray-400">Manage your personal deck collection</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Link
            to="/deckbuilder"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create New
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Import className="w-4 h-4" />
            Import Deck
          </button>
        </div>
      </div>

      {/* User Decks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockUserDecks.map(deck => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{deck.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Crown className="w-4 h-4" />
                  <span>{deck.hero}</span>
                  <span>•</span>
                  <span>{deck.archetype}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-400 text-sm">Cards</span>
                <div className="text-white font-medium">
                  {deck.cardCount}/60
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Format</span>
                <div className="text-white font-medium">{deck.format}</div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Win Rate</span>
                <div
                  className={`font-medium ${deck.gamesPlayed > 0 ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {deck.gamesPlayed > 0 ? `${deck.winRate}%` : 'No games'}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Status</span>
                <div
                  className={`font-medium ${deck.isPublic ? 'text-green-400' : 'text-yellow-400'}`}
                >
                  {deck.isPublic ? 'Public' : 'Private'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              {deck.colors.map(color => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 border-gray-600 ${
                    color === 'Fire'
                      ? 'bg-red-500'
                      : color === 'Water'
                        ? 'bg-blue-500'
                        : color === 'Earth'
                          ? 'bg-green-500'
                          : color === 'Air'
                            ? 'bg-gray-300'
                            : color === 'Lightning'
                              ? 'bg-yellow-500'
                              : color === 'Nature'
                                ? 'bg-emerald-500'
                                : 'bg-gray-500'
                  }`}
                  title={color}
                />
              ))}
            </div>

            <div className="text-xs text-gray-400 mb-4">
              Last modified: {new Date(deck.lastModified).toLocaleDateString()}
            </div>

            <div className="flex gap-2">
              <Link
                to="/deckbuilder"
                state={{ editDeck: deck }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={() => {
                  setSelectedDeck(deck);
                  setCurrentView('analytics');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {mockUserDecks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No decks yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start building your first deck or save one from the community
          </p>
          <Link
            to="/deckbuilder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create Your First Deck
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderBrowseView()}
            </motion.div>
          )}
          {currentView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderAnalyticsView()}
            </motion.div>
          )}
          {currentView === 'mydecks' && (
            <motion.div
              key="mydecks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderMyDecksView()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntegratedDeckSystem;
