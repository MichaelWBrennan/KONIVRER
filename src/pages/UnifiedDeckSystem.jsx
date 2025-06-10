import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  Plus,
  Minus,
  Shuffle,
  Bot,
  Lightbulb,
  Sparkles,
  Grid,
  List,
  SlidersHorizontal,
  Palette,
  Beaker,
  FlaskConical,
  TestTube,
  Microscope,
  Wand2,
  Brain,
  Cpu,
  Upload,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
} from 'lucide-react';

// Import components
import CardViewer from '../components/CardViewer';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import AdvancedCardFilters from '../components/AdvancedCardFilters';
import DeckValidator from '../components/DeckValidator';
import { useData } from '../contexts/DataContext';
import cardsData from '../data/cards.json';

const UnifiedDeckSystem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addDeck, updateDeck, decks } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Main view states
  const [currentView, setCurrentView] = useState('browse'); // 'browse', 'builder', 'advanced-builder', 'analytics', 'mydecks'
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Deck browser states
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

  // Deck builder states
  const [builderDeck, setBuilderDeck] = useState({
    name: 'Untitled Deck',
    cards: [],
    description: '',
    hero: '',
    format: 'standard',
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardFilters, setCardFilters] = useState({
    type: [],
    class: [],
    elements: [],
    keywords: [],
    talents: [],
    cost: { min: '', max: '' },
    power: { min: '', max: '' },
    rarity: [],
    set: [],
  });
  const [showCardFilters, setShowCardFilters] = useState(false);
  const [builderViewMode, setBuilderViewMode] = useState('split'); // 'split', 'cards', 'deck', 'validate'
  const [selectedFormat, setSelectedFormat] = useState('standard');

  // Advanced builder states
  const [deckStats, setDeckStats] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showSideboard, setShowSideboard] = useState(false);
  const [deckValidation, setDeckValidation] = useState({});
  const [metaAnalysis, setMetaAnalysis] = useState({});
  const [playtest, setPlaytest] = useState({
    hands: [],
    currentHand: [],
    mulligans: 0,
    turn: 1,
  });
  const [isPlaytesting, setIsPlaytesting] = useState(false);

  // Check URL parameters on component mount
  useEffect(() => {
    const view = searchParams.get('view');
    const deckId = searchParams.get('deckId');

    if (view === 'mydecks' && user) {
      setCurrentView('mydecks');
    } else if (view === 'builder') {
      setCurrentView('builder');
      if (deckId) {
        const foundDeck = decks.find(d => d.id === deckId);
        if (foundDeck) {
          setBuilderDeck(foundDeck);
          if (foundDeck.format) {
            setSelectedFormat(foundDeck.format);
          }
        }
      }
    } else if (view === 'advanced-builder') {
      setCurrentView('advanced-builder');
      if (deckId) {
        const foundDeck = decks.find(d => d.id === deckId);
        if (foundDeck) {
          setBuilderDeck(foundDeck);
        }
      }
    } else if (view === 'analytics') {
      setCurrentView('analytics');
    }
  }, [searchParams, user, decks]);

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
      winRate: 65.0,
      gamesPlayed: 20,
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
        elementDistribution: { Lightning: 48.3, Air: 34.5, Neutral: 17.2 },
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
        elementDistribution: { Fire: 75.0, Neutral: 25.0 },
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
      },
    },
  ];

  // Filter cards for deck builder
  const filteredCards = cardsData.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.flavor &&
        card.flavor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      cardFilters.type.length === 0 || cardFilters.type.includes(card.type);
    const matchesClass =
      cardFilters.class.length === 0 || cardFilters.class.includes(card.class);
    const matchesElements =
      cardFilters.elements.length === 0 ||
      cardFilters.elements.some(element => card.elements.includes(element));
    const matchesKeywords =
      cardFilters.keywords.length === 0 ||
      cardFilters.keywords.some(keyword => card.keywords.includes(keyword));
    const matchesTalents =
      cardFilters.talents.length === 0 ||
      cardFilters.talents.some(
        talent => card.talents && card.talents.includes(talent),
      );
    const matchesRarity =
      cardFilters.rarity.length === 0 ||
      cardFilters.rarity.includes(card.rarity);
    const matchesSet =
      cardFilters.set.length === 0 || cardFilters.set.includes(card.set);
    const matchesCost =
      (!cardFilters.cost.min || card.cost >= parseInt(cardFilters.cost.min)) &&
      (!cardFilters.cost.max || card.cost <= parseInt(cardFilters.cost.max));
    const matchesPower =
      (!cardFilters.power.min ||
        card.power >= parseInt(cardFilters.power.min)) &&
      (!cardFilters.power.max || card.power <= parseInt(cardFilters.power.max));

    return (
      matchesSearch &&
      matchesType &&
      matchesClass &&
      matchesElements &&
      matchesKeywords &&
      matchesTalents &&
      matchesRarity &&
      matchesSet &&
      matchesCost &&
      matchesPower
    );
  });

  // Navigation functions
  const navigateToView = (view, params = {}) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('view', view);
    Object.entries(params).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });
    setSearchParams(newSearchParams);
    setCurrentView(view);
  };

  const handleCreateNewDeck = () => {
    setBuilderDeck({
      name: 'Untitled Deck',
      cards: [],
      description: '',
      hero: '',
      format: 'standard',
    });
    navigateToView('builder');
  };

  const handleEditDeck = deck => {
    setBuilderDeck(deck);
    navigateToView('builder', { deckId: deck.id });
  };

  const handleAdvancedBuilder = (deck = null) => {
    if (deck) {
      setBuilderDeck(deck);
      navigateToView('advanced-builder', { deckId: deck.id });
    } else {
      setBuilderDeck({
        name: 'Untitled Deck',
        cards: [],
        description: '',
        hero: '',
        format: 'standard',
      });
      navigateToView('advanced-builder');
    }
  };

  const handleSaveDeck = () => {
    if (builderDeck.id) {
      updateDeck(builderDeck);
    } else {
      const newDeck = { ...builderDeck, id: Date.now().toString() };
      addDeck(newDeck);
      setBuilderDeck(newDeck);
    }
  };

  const addCardToDeck = card => {
    const existingCard = builderDeck.cards.find(c => c.name === card.name);
    if (existingCard) {
      if (existingCard.count < 4) {
        setBuilderDeck(prev => ({
          ...prev,
          cards: prev.cards.map(c =>
            c.name === card.name ? { ...c, count: c.count + 1 } : c,
          ),
        }));
      }
    } else {
      setBuilderDeck(prev => ({
        ...prev,
        cards: [...prev.cards, { ...card, count: 1 }],
      }));
    }
  };

  const removeCardFromDeck = cardName => {
    setBuilderDeck(prev => ({
      ...prev,
      cards: prev.cards
        .map(c =>
          c.name === cardName
            ? c.count > 1
              ? { ...c, count: c.count - 1 }
              : null
            : c,
        )
        .filter(Boolean),
    }));
  };

  // Render functions for different views
  const renderDeckBrowser = () => (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Deck Lists</h1>
          <p className="text-secondary">
            Discover, analyze, and build competitive decks
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreateNewDeck}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Deck
          </button>
          <button
            onClick={() => handleAdvancedBuilder()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Settings size={16} />
            Advanced Builder
          </button>
          <button
            onClick={() => navigateToView('mydecks')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <BookOpen size={16} />
            My Decks
          </button>
          <button
            onClick={() => navigateToView('analytics')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-card border border-color rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search decks by name, author, or cards..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="btn btn-ghost flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
            {showAdvancedFilters ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-color"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  className="input"
                  value={filters.hero}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, hero: e.target.value }))
                  }
                >
                  <option value="">All Heroes</option>
                  <option value="Zephyr">Zephyr</option>
                  <option value="Ignis">Ignis</option>
                  <option value="Gaia">Gaia</option>
                </select>
                <select
                  className="input"
                  value={filters.format}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, format: e.target.value }))
                  }
                >
                  <option value="">All Formats</option>
                  <option value="Standard">Standard</option>
                  <option value="Limited">Limited</option>
                  <option value="Legacy">Legacy</option>
                </select>
                <select
                  className="input"
                  value={filters.archetype}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, archetype: e.target.value }))
                  }
                >
                  <option value="">All Archetypes</option>
                  <option value="Aggro">Aggro</option>
                  <option value="Control">Control</option>
                  <option value="Midrange">Midrange</option>
                </select>
                <select
                  className="input"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="winRate">Sort by Win Rate</option>
                  <option value="views">Sort by Views</option>
                  <option value="saves">Sort by Saves</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deck grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDecklists.map(deck => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-color rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-accent-primary/50"
          >
            {deck.featured && (
              <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-2">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Star size={14} />
                  Featured Deck
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {deck.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <span>{deck.hero}</span>
                    <span>•</span>
                    <span>{deck.archetype}</span>
                    <span>•</span>
                    <span>{deck.format}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {deck.placement <= 3 && (
                    <Trophy className="text-yellow-500" size={16} />
                  )}
                  <span className="text-sm font-medium">#{deck.placement}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-secondary">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {deck.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(deck.date).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {deck.winRate}%
                  </div>
                  <div className="text-muted">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {deck.gamesPlayed}
                  </div>
                  <div className="text-muted">Games</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {deck.metaShare}%
                  </div>
                  <div className="text-muted">Meta Share</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {deck.colors.map(color => (
                  <span
                    key={color}
                    className="px-2 py-1 bg-tertiary text-xs rounded-md text-secondary"
                  >
                    {color}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {deck.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={14} />
                    {deck.saves}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDeck(deck)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleEditDeck(deck)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button className="btn btn-sm btn-ghost">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMyDecks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Decks</h1>
          <p className="text-secondary">Manage your personal deck collection</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateNewDeck}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Deck
          </button>
          <button
            onClick={() => navigateToView('browse')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Browse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockUserDecks.map(deck => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-color rounded-lg p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {deck.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span>{deck.hero}</span>
                  <span>•</span>
                  <span>{deck.archetype}</span>
                  <span>•</span>
                  <span>{deck.format}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {deck.isPublic ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                    Public
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                    Private
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-secondary mb-4">
              Last modified: {new Date(deck.lastModified).toLocaleDateString()}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {deck.winRate}%
                </div>
                <div className="text-muted">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {deck.gamesPlayed}
                </div>
                <div className="text-muted">Games</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {deck.cardCount}
                </div>
                <div className="text-muted">Cards</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {deck.colors.map(color => (
                  <span
                    key={color}
                    className="px-2 py-1 bg-tertiary text-xs rounded-md text-secondary"
                  >
                    {color}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditDeck(deck)}
                  className="btn btn-sm btn-primary"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleAdvancedBuilder(deck)}
                  className="btn btn-sm btn-secondary"
                >
                  <Settings size={14} />
                </button>
                <button className="btn btn-sm btn-ghost text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDeckBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Deck Builder</h1>
          <p className="text-secondary">Build and customize your deck</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDeck}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            Save Deck
          </button>
          <button
            onClick={() => navigateToView('browse')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Browse
          </button>
        </div>
      </div>

      {/* Deck info */}
      <div className="bg-card border border-color rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Deck Name"
            className="input"
            value={builderDeck.name}
            onChange={e =>
              setBuilderDeck(prev => ({ ...prev, name: e.target.value }))
            }
          />
          <select
            className="input"
            value={builderDeck.hero}
            onChange={e =>
              setBuilderDeck(prev => ({ ...prev, hero: e.target.value }))
            }
          >
            <option value="">Select Hero</option>
            <option value="Zephyr">Zephyr</option>
            <option value="Ignis">Ignis</option>
            <option value="Gaia">Gaia</option>
          </select>
          <select
            className="input"
            value={builderDeck.format}
            onChange={e =>
              setBuilderDeck(prev => ({ ...prev, format: e.target.value }))
            }
          >
            <option value="standard">Standard</option>
            <option value="limited">Limited</option>
            <option value="legacy">Legacy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card search and list */}
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">
              Card Database
            </h3>
            <button
              onClick={() => setShowCardFilters(!showCardFilters)}
              className="btn btn-sm btn-ghost"
            >
              <Filter size={16} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search cards..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCards.slice(0, 50).map(card => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 bg-tertiary rounded-lg hover:bg-hover transition-colors cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div>
                  <div className="font-medium text-primary">{card.name}</div>
                  <div className="text-sm text-secondary">
                    {card.type} • Cost: {card.cost}
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    addCardToDeck(card);
                  }}
                  className="btn btn-sm btn-primary"
                >
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Current deck */}
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">
              Current Deck (
              {builderDeck.cards.reduce((sum, card) => sum + card.count, 0)}{' '}
              cards)
            </h3>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {builderDeck.cards.map(card => (
              <div
                key={card.name}
                className="flex items-center justify-between p-3 bg-tertiary rounded-lg"
              >
                <div>
                  <div className="font-medium text-primary">{card.name}</div>
                  <div className="text-sm text-secondary">
                    {card.type} • Cost: {card.cost}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeCardFromDeck(card.name)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">
                    {card.count}
                  </span>
                  <button
                    onClick={() => addCardToDeck(card)}
                    className="btn btn-sm btn-ghost"
                    disabled={card.count >= 4}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Advanced Deck Builder
          </h1>
          <p className="text-secondary">
            Professional deck building with AI assistance and analytics
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDeck}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            Save Deck
          </button>
          <button
            onClick={() => navigateToView('browse')}
            className="btn btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Browse
          </button>
        </div>
      </div>

      {/* Advanced builder interface would go here */}
      <div className="bg-card border border-color rounded-lg p-6">
        <div className="text-center py-12">
          <Bot size={48} className="mx-auto mb-4 text-accent-primary" />
          <h3 className="text-xl font-semibold text-primary mb-2">
            Advanced Builder
          </h3>
          <p className="text-secondary mb-6">
            AI-powered deck building with meta analysis, optimization
            suggestions, and playtesting tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-tertiary rounded-lg">
              <Brain size={24} className="mx-auto mb-2 text-accent-primary" />
              <div className="font-medium text-primary">AI Suggestions</div>
              <div className="text-sm text-secondary">
                Smart card recommendations
              </div>
            </div>
            <div className="p-4 bg-tertiary rounded-lg">
              <BarChart3
                size={24}
                className="mx-auto mb-2 text-accent-primary"
              />
              <div className="font-medium text-primary">Meta Analysis</div>
              <div className="text-sm text-secondary">Competitive insights</div>
            </div>
            <div className="p-4 bg-tertiary rounded-lg">
              <TestTube
                size={24}
                className="mx-auto mb-2 text-accent-primary"
              />
              <div className="font-medium text-primary">Playtesting</div>
              <div className="text-sm text-secondary">
                Virtual testing environment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Deck Analytics
          </h1>
          <p className="text-secondary">
            Meta insights and performance statistics
          </p>
        </div>
        <button
          onClick={() => navigateToView('browse')}
          className="btn btn-ghost flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Browse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-primary">68.5%</div>
              <div className="text-sm text-secondary">Avg Win Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-secondary">Total Games</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-primary">23</div>
              <div className="text-sm text-secondary">Tournament Wins</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-color rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-purple-500" size={24} />
            <div>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-secondary">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-color rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Meta Breakdown
        </h3>
        <div className="space-y-4">
          {[
            { archetype: 'Control Lightning', share: 12.3, trend: 'up' },
            { archetype: 'Aggro Fire', share: 8.7, trend: 'down' },
            { archetype: 'Midrange Earth', share: 5.2, trend: 'up' },
            { archetype: 'Combo Water', share: 3.8, trend: 'stable' },
          ].map(meta => (
            <div
              key={meta.archetype}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="font-medium text-primary">{meta.archetype}</div>
                {meta.trend === 'up' && (
                  <TrendingUp className="text-green-500" size={16} />
                )}
                {meta.trend === 'down' && (
                  <TrendingDown className="text-red-500" size={16} />
                )}
                {meta.trend === 'stable' && (
                  <Activity className="text-gray-500" size={16} />
                )}
              </div>
              <div className="text-secondary">{meta.share}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="container py-6">
      {currentView === 'browse' && renderDeckBrowser()}
      {currentView === 'mydecks' && renderMyDecks()}
      {currentView === 'builder' && renderDeckBuilder()}
      {currentView === 'advanced-builder' && renderAdvancedBuilder()}
      {currentView === 'analytics' && renderAnalytics()}

      {/* Deck detail modal */}
      <AnimatePresence>
        {selectedDeck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDeck(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-color rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">
                      {selectedDeck.name}
                    </h2>
                    <div className="text-secondary">
                      by {selectedDeck.author} • {selectedDeck.tournament}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDeck(null)}
                    className="btn btn-ghost"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Deck List
                    </h3>
                    <div className="space-y-2">
                      {selectedDeck.cards.map(card => (
                        <div
                          key={card.name}
                          className="flex items-center justify-between p-2 bg-tertiary rounded"
                        >
                          <span className="text-primary">{card.name}</span>
                          <span className="text-secondary">×{card.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Analytics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-secondary mb-2">
                          Mana Curve
                        </div>
                        <div className="flex items-end gap-1 h-20">
                          {selectedDeck.analytics.manaCurve.map(
                            (count, cost) => (
                              <div
                                key={cost}
                                className="bg-accent-primary rounded-t flex-1 min-h-[4px]"
                                style={{
                                  height: `${(count / Math.max(...selectedDeck.analytics.manaCurve)) * 100}%`,
                                }}
                                title={`Cost ${cost}: ${count} cards`}
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-secondary mb-2">
                          Element Distribution
                        </div>
                        <div className="space-y-2">
                          {Object.entries(
                            selectedDeck.analytics.elementDistribution,
                          ).map(([element, percentage]) => (
                            <div
                              key={element}
                              className="flex items-center justify-between"
                            >
                              <span className="text-primary">{element}</span>
                              <span className="text-secondary">
                                {percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-color rounded-lg max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <CardViewer
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedDeckSystem;
