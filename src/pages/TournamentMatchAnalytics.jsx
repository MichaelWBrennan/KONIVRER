import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

const TournamentMatchAnalytics = () => {
  const [currentView, setCurrentView] = useState('tournaments'); // 'tournaments', 'matches', 'analytics'
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    format: '',
    status: '',
    dateRange: '',
  });

  // Mock tournament data with detailed match and deck information
  const tournaments = [
    {
      id: 1,
      name: 'KONIVRER World Championship 2024',
      format: 'Standard',
      date: '2024-07-15',
      time: '10:00 AM',
      location: 'Los Angeles Convention Center',
      prizePool: '$50,000',
      participants: 512,
      status: 'Completed',
      organizer: 'KONIVRER Official',
      description:
        'The premier tournament of the year featuring the best players from around the world.',
      rounds: 9,
      matches: [
        {
          id: 1,
          round: 'Finals',
          player1: {
            name: 'DragonMaster',
            hero: 'Vynnset, Iron Maiden',
            rating: 1850,
            deck: {
              name: 'Aggro Warrior',
              archetype: 'Aggro',
              colors: ['🔥', '⚔️'],
              cards: [
                {
                  name: 'Lightning Strike',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: "Warrior's Blade",
                  cost: 2,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['⚔️'],
                  type: 'Equipment',
                },
                {
                  name: 'Fire Elemental',
                  cost: 3,
                  count: 4,
                  rarity: 'rare',
                  elements: ['🔥'],
                  type: 'Creature',
                },
                {
                  name: 'Berserker Rage',
                  cost: 2,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Iron Will',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Flame Sword',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['🔥', '⚔️'],
                  type: 'Equipment',
                },
                {
                  name: 'Battle Fury',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Steel Guardian',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['⚔️'],
                  type: 'Creature',
                },
                {
                  name: 'Volcanic Eruption',
                  cost: 6,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: "Warrior's Honor",
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Blazing Strike',
                  cost: 1,
                  count: 3,
                  rarity: 'common',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Shield Wall',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
              ],
              winRate: 78.5,
              gamesPlayed: 23,
              metaShare: 12.3,
            },
          },
          player2: {
            name: 'ElementalForce',
            hero: 'Briar, Warden of Thorns',
            rating: 1720,
            deck: {
              name: 'Midrange Elemental',
              archetype: 'Midrange',
              colors: ['🌿', '💧'],
              cards: [
                {
                  name: "Nature's Growth",
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['🌿'],
                  type: 'Spell',
                },
                {
                  name: 'Water Elemental',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['💧'],
                  type: 'Creature',
                },
                {
                  name: 'Thorn Barrier',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🌿'],
                  type: 'Spell',
                },
                {
                  name: 'Healing Spring',
                  cost: 2,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['💧'],
                  type: 'Spell',
                },
                {
                  name: 'Ancient Tree',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['🌿'],
                  type: 'Creature',
                },
                {
                  name: 'Tsunami',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['💧'],
                  type: 'Spell',
                },
                {
                  name: 'Forest Guardian',
                  cost: 6,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🌿'],
                  type: 'Creature',
                },
                {
                  name: 'Elemental Harmony',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['🌿', '💧'],
                  type: 'Spell',
                },
                {
                  name: 'Vine Whip',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🌿'],
                  type: 'Spell',
                },
                {
                  name: 'Aqua Shield',
                  cost: 2,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['💧'],
                  type: 'Spell',
                },
                {
                  name: "Gaia's Blessing",
                  cost: 7,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['🌿', '💧'],
                  type: 'Spell',
                },
                {
                  name: 'Elemental Bond',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['🌿', '💧'],
                  type: 'Spell',
                },
              ],
              winRate: 65.2,
              gamesPlayed: 31,
              metaShare: 8.7,
            },
          },
          result: {
            winner: 'player1',
            score: '3-1',
            games: [
              {
                game: 1,
                winner: 'player1',
                duration: '12:34',
                p1Life: 20,
                p2Life: 0,
              },
              {
                game: 2,
                winner: 'player2',
                duration: '18:45',
                p1Life: 0,
                p2Life: 8,
              },
              {
                game: 3,
                winner: 'player1',
                duration: '15:22',
                p1Life: 5,
                p2Life: 0,
              },
              {
                game: 4,
                winner: 'player1',
                duration: '11:18',
                p1Life: 12,
                p2Life: 0,
              },
            ],
          },
          duration: '58:39',
          featured: true,
          hasVideo: true,
          hasReplay: true,
        },
        {
          id: 2,
          round: 'Semi Finals',
          player1: {
            name: 'ShadowWeaver',
            hero: 'Iyslander, Stormbind',
            rating: 1680,
            deck: {
              name: 'Control Wizard',
              archetype: 'Control',
              colors: ['⚡', '🌙'],
              cards: [
                {
                  name: 'Lightning Bolt',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Shadow Bind',
                  cost: 2,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['🌙'],
                  type: 'Spell',
                },
                {
                  name: 'Storm Cloud',
                  cost: 3,
                  count: 3,
                  rarity: 'rare',
                  elements: ['⚡'],
                  type: 'Creature',
                },
                {
                  name: 'Dark Ritual',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🌙'],
                  type: 'Spell',
                },
                {
                  name: 'Thunder Strike',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Void Walker',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🌙'],
                  type: 'Creature',
                },
                {
                  name: 'Chain Lightning',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Shadow Portal',
                  cost: 6,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🌙'],
                  type: 'Spell',
                },
                {
                  name: 'Storm Lord',
                  cost: 7,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['⚡', '🌙'],
                  type: 'Creature',
                },
                {
                  name: 'Electric Surge',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Darkness Falls',
                  cost: 4,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['🌙'],
                  type: 'Spell',
                },
                {
                  name: 'Mystic Shield',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚡', '🌙'],
                  type: 'Spell',
                },
              ],
              winRate: 72.1,
              gamesPlayed: 28,
              metaShare: 15.6,
            },
          },
          player2: {
            name: 'LightBringer',
            hero: 'Prism, Sculptor of Arc Light',
            rating: 1790,
            deck: {
              name: 'Combo Light',
              archetype: 'Combo',
              colors: ['☀️', '✨'],
              cards: [
                {
                  name: 'Divine Light',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['☀️'],
                  type: 'Spell',
                },
                {
                  name: 'Starfall',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['✨'],
                  type: 'Spell',
                },
                {
                  name: 'Solar Flare',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['☀️'],
                  type: 'Spell',
                },
                {
                  name: 'Celestial Being',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['✨'],
                  type: 'Creature',
                },
                {
                  name: 'Radiant Burst',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['☀️'],
                  type: 'Spell',
                },
                {
                  name: 'Cosmic Energy',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['✨'],
                  type: 'Spell',
                },
                {
                  name: 'Angel of Light',
                  cost: 6,
                  count: 2,
                  rarity: 'rare',
                  elements: ['☀️', '✨'],
                  type: 'Creature',
                },
                {
                  name: 'Prism Shield',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['☀️'],
                  type: 'Spell',
                },
                {
                  name: 'Stellar Convergence',
                  cost: 8,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['☀️', '✨'],
                  type: 'Spell',
                },
                {
                  name: 'Light Beam',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['☀️'],
                  type: 'Spell',
                },
                {
                  name: 'Stardust',
                  cost: 2,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['✨'],
                  type: 'Spell',
                },
                {
                  name: 'Blessing of Light',
                  cost: 3,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['☀️', '✨'],
                  type: 'Spell',
                },
              ],
              winRate: 69.8,
              gamesPlayed: 26,
              metaShare: 11.2,
            },
          },
          result: {
            winner: 'player2',
            score: '3-2',
            games: [
              {
                game: 1,
                winner: 'player1',
                duration: '22:15',
                p1Life: 3,
                p2Life: 0,
              },
              {
                game: 2,
                winner: 'player2',
                duration: '19:33',
                p1Life: 0,
                p2Life: 15,
              },
              {
                game: 3,
                winner: 'player1',
                duration: '16:42',
                p1Life: 7,
                p2Life: 0,
              },
              {
                game: 4,
                winner: 'player2',
                duration: '25:18',
                p1Life: 0,
                p2Life: 2,
              },
              {
                game: 5,
                winner: 'player2',
                duration: '14:27',
                p1Life: 0,
                p2Life: 11,
              },
            ],
          },
          duration: '98:15',
          featured: true,
          hasVideo: true,
          hasReplay: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Summer Regional Championship',
      format: 'Limited',
      date: '2024-06-20',
      time: '2:00 PM',
      location: 'Chicago Gaming Center',
      prizePool: '$15,000',
      participants: 128,
      status: 'Live',
      organizer: 'Midwest Gaming League',
      description:
        'Regional championship featuring sealed deck format with latest expansion.',
      rounds: 7,
      matches: [
        {
          id: 3,
          round: 'Round 6',
          player1: {
            name: 'StormCaller',
            hero: 'Kano, Dracai of Aether',
            rating: 1920,
            deck: {
              name: 'Spell Burn',
              archetype: 'Burn',
              colors: ['🔥', '⚡'],
              cards: [
                {
                  name: 'Fireball',
                  cost: 3,
                  count: 4,
                  rarity: 'common',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Lightning Strike',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Burn',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Shock',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Flame Burst',
                  cost: 2,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Thunder Bolt',
                  cost: 2,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Inferno',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Lightning Storm',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Meteor',
                  cost: 6,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🔥'],
                  type: 'Spell',
                },
                {
                  name: 'Chain Lightning',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Apocalypse',
                  cost: 8,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['🔥', '⚡'],
                  type: 'Spell',
                },
                {
                  name: 'Elemental Fury',
                  cost: 3,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['🔥', '⚡'],
                  type: 'Spell',
                },
              ],
              winRate: 81.3,
              gamesPlayed: 16,
              metaShare: 9.4,
            },
          },
          player2: {
            name: 'EarthShaker',
            hero: 'Rhinar, Reckless Rampage',
            rating: 1650,
            deck: {
              name: 'Aggro Brute',
              archetype: 'Aggro',
              colors: ['🏔️', '⚔️'],
              cards: [
                {
                  name: 'Rock Throw',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🏔️'],
                  type: 'Spell',
                },
                {
                  name: 'Brute Force',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Stone Fist',
                  cost: 1,
                  count: 4,
                  rarity: 'common',
                  elements: ['🏔️'],
                  type: 'Equipment',
                },
                {
                  name: 'Rampage',
                  cost: 3,
                  count: 4,
                  rarity: 'uncommon',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Earthquake',
                  cost: 4,
                  count: 3,
                  rarity: 'rare',
                  elements: ['🏔️'],
                  type: 'Spell',
                },
                {
                  name: 'Berserker',
                  cost: 3,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['⚔️'],
                  type: 'Creature',
                },
                {
                  name: 'Mountain Giant',
                  cost: 5,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🏔️'],
                  type: 'Creature',
                },
                {
                  name: 'Savage Strike',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Landslide',
                  cost: 6,
                  count: 2,
                  rarity: 'rare',
                  elements: ['🏔️'],
                  type: 'Spell',
                },
                {
                  name: 'Brutal Assault',
                  cost: 4,
                  count: 3,
                  rarity: 'uncommon',
                  elements: ['⚔️'],
                  type: 'Spell',
                },
                {
                  name: "Titan's Wrath",
                  cost: 7,
                  count: 1,
                  rarity: 'legendary',
                  elements: ['🏔️', '⚔️'],
                  type: 'Spell',
                },
                {
                  name: 'Stone Armor',
                  cost: 2,
                  count: 4,
                  rarity: 'common',
                  elements: ['🏔️'],
                  type: 'Equipment',
                },
              ],
              winRate: 58.7,
              gamesPlayed: 23,
              metaShare: 7.8,
            },
          },
          result: {
            winner: 'player1',
            score: '2-1',
            games: [
              {
                game: 1,
                winner: 'player2',
                duration: '8:22',
                p1Life: 0,
                p2Life: 4,
              },
              {
                game: 2,
                winner: 'player1',
                duration: '14:17',
                p1Life: 18,
                p2Life: 0,
              },
              {
                game: 3,
                winner: 'player1',
                duration: '11:45',
                p1Life: 9,
                p2Life: 0,
              },
            ],
          },
          duration: '34:24',
          featured: false,
          hasVideo: false,
          hasReplay: true,
        },
      ],
    },
  ];

  // Filter tournaments
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat =
      !filters.format || tournament.format === filters.format;
    const matchesStatus =
      !filters.status || tournament.status === filters.status;

    return matchesSearch && matchesFormat && matchesStatus;
  });

  // Get element icon
  const getElementIcon = element => {
    const icons = {
      '🔥': <Flame className="text-red-400" size={16} />,
      '💧': <Droplets className="text-blue-400" size={16} />,
      '🌿': <Leaf className="text-green-400" size={16} />,
      '⚡': <Zap className="text-yellow-400" size={16} />,
      '🏔️': <Mountain className="text-gray-400" size={16} />,
      '☀️': <Sun className="text-yellow-300" size={16} />,
      '🌙': <Moon className="text-purple-400" size={16} />,
      '✨': <Sparkles className="text-pink-400" size={16} />,
      '⚔️': <Sword className="text-orange-400" size={16} />,
    };
    return icons[element] || <span className="text-lg">{element}</span>;
  };

  // Calculate deck analytics
  const calculateDeckAnalytics = deck => {
    const totalCards = deck.cards.reduce(
      (total, card) => total + card.count,
      0,
    );
    const totalCost = deck.cards.reduce(
      (total, card) => total + card.cost * card.count,
      0,
    );
    const averageCost =
      totalCards > 0 ? (totalCost / totalCards).toFixed(1) : 0;

    // Mana curve
    const manaCurve = deck.cards.reduce((curve, card) => {
      const cost = Math.min(card.cost, 7);
      const key = cost === 7 ? '7+' : cost.toString();
      curve[key] = (curve[key] || 0) + card.count;
      return curve;
    }, {});

    // Element distribution
    const elementDistribution = deck.cards.reduce((dist, card) => {
      card.elements.forEach(element => {
        dist[element] = (dist[element] || 0) + card.count;
      });
      return dist;
    }, {});

    // Rarity distribution
    const rarityDistribution = deck.cards.reduce((dist, card) => {
      dist[card.rarity] = (dist[card.rarity] || 0) + card.count;
      return dist;
    }, {});

    // Type distribution
    const typeDistribution = deck.cards.reduce((dist, card) => {
      dist[card.type] = (dist[card.type] || 0) + card.count;
      return dist;
    }, {});

    return {
      totalCards,
      averageCost,
      manaCurve,
      elementDistribution,
      rarityDistribution,
      typeDistribution,
    };
  };

  // Tournament List Component
  const TournamentList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Tournament Analytics</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filters.format}
            onChange={e => setFilters({ ...filters, format: e.target.value })}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Formats</option>
            <option value="Standard">Standard</option>
            <option value="Limited">Limited</option>
            <option value="Draft">Draft</option>
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map(tournament => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedTournament(tournament);
              setCurrentView('matches');
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {tournament.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{tournament.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{tournament.location}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  {tournament.prizePool}
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    tournament.status === 'Live'
                      ? 'bg-red-600 text-white'
                      : tournament.status === 'Completed'
                        ? 'bg-gray-600 text-white'
                        : 'bg-green-600 text-white'
                  }`}
                >
                  {tournament.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-300 text-sm">Format</div>
                <div className="text-white font-bold">{tournament.format}</div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-300 text-sm">Players</div>
                <div className="text-white font-bold">
                  {tournament.participants}
                </div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-300 text-sm">Matches</div>
                <div className="text-white font-bold">
                  {tournament.matches.length}
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm">{tournament.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Match List Component
  const MatchList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('tournaments')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Tournaments</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {selectedTournament?.name}
            </h1>
            <p className="text-gray-400">Tournament Matches & Analytics</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {selectedTournament?.participants}
            </div>
            <div className="text-gray-400 text-sm">Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {selectedTournament?.prizePool}
            </div>
            <div className="text-gray-400 text-sm">Prize Pool</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {selectedTournament?.matches.length}
            </div>
            <div className="text-gray-400 text-sm">Featured Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {selectedTournament?.format}
            </div>
            <div className="text-gray-400 text-sm">Format</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedTournament?.matches.map(match => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedMatch(match);
              setCurrentView('analytics');
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-white">
                  {match.round}
                </div>
                {match.featured && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                    <Star size={12} />
                    <span>Featured</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{match.duration}</div>
                <div className="text-xs text-gray-500">
                  {match.result.games.length} games
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Player 1 */}
              <div
                className={`p-4 rounded-lg ${match.result.winner === 'player1' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700'}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-white">
                    {match.player1.name}
                  </span>
                  {match.result.winner === 'player1' && (
                    <Trophy className="text-yellow-400" size={14} />
                  )}
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  {match.player1.hero}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {match.player1.deck.name}
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  {match.player1.deck.colors.map((color, index) => (
                    <span key={index} className="text-sm">
                      {getElementIcon(color)}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">
                    {match.player1.deck.archetype}
                  </span>
                </div>
                <div className="text-xs text-blue-400">
                  Rating: {match.player1.rating}
                </div>
              </div>

              {/* VS and Score */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-gray-400 text-sm mb-2">VS</div>
                <div className="text-2xl font-bold text-white mb-2">
                  {match.result.score}
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300">
                  View Analytics →
                </button>
              </div>

              {/* Player 2 */}
              <div
                className={`p-4 rounded-lg ${match.result.winner === 'player2' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700'}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-white">
                    {match.player2.name}
                  </span>
                  {match.result.winner === 'player2' && (
                    <Trophy className="text-yellow-400" size={14} />
                  )}
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  {match.player2.hero}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {match.player2.deck.name}
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  {match.player2.deck.colors.map((color, index) => (
                    <span key={index} className="text-sm">
                      {getElementIcon(color)}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">
                    {match.player2.deck.archetype}
                  </span>
                </div>
                <div className="text-xs text-blue-400">
                  Rating: {match.player2.rating}
                </div>
              </div>
            </div>

            {/* Game Results */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {match.result.games.map((game, index) => (
                <div key={index} className="bg-gray-700 rounded p-2 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400">Game {game.game}</span>
                    <span className="text-gray-400">{game.duration}</span>
                  </div>
                  <div
                    className={`font-medium ${game.winner === 'player1' ? 'text-green-400' : 'text-blue-400'}`}
                  >
                    {game.winner === 'player1'
                      ? match.player1.name
                      : match.player2.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {game.p1Life} - {game.p2Life}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Deck Analytics Component
  const DeckAnalytics = () => {
    const player1Analytics = calculateDeckAnalytics(selectedMatch.player1.deck);
    const player2Analytics = calculateDeckAnalytics(selectedMatch.player2.deck);

    const getRarityColor = rarity => {
      switch (rarity) {
        case 'common':
          return 'bg-gray-600';
        case 'uncommon':
          return 'bg-green-600';
        case 'rare':
          return 'bg-blue-600';
        case 'legendary':
          return 'bg-purple-600';
        default:
          return 'bg-gray-600';
      }
    };

    const AnalyticsCard = ({ title, player, analytics, deck }) => (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">{player.name}</h3>
            <p className="text-gray-400">
              {deck.name} - {deck.archetype}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Win Rate</div>
            <div className="text-2xl font-bold text-green-400">
              {deck.winRate}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-gray-300 text-sm">Total Cards</div>
            <div className="text-xl font-bold text-white">
              {analytics.totalCards}
            </div>
          </div>
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-gray-300 text-sm">Avg. Cost</div>
            <div className="text-xl font-bold text-white">
              {analytics.averageCost}
            </div>
          </div>
        </div>

        {/* Mana Curve */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <BarChart3 size={16} className="mr-2" />
            Mana Curve
          </h4>
          <div className="space-y-2">
            {['0', '1', '2', '3', '4', '5', '6', '7+'].map(cost => {
              const count = analytics.manaCurve[cost] || 0;
              const percentage =
                analytics.totalCards > 0
                  ? (count / analytics.totalCards) * 100
                  : 0;
              return (
                <div key={cost} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-gray-400">{cost}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-right text-white">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Element Distribution */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Layers size={16} className="mr-2" />
            Element Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(analytics.elementDistribution).map(
              ([element, count]) => {
                const percentage =
                  analytics.totalCards > 0
                    ? (count / analytics.totalCards) * 100
                    : 0;
                return (
                  <div key={element} className="flex items-center gap-3">
                    <div className="w-8">{getElementIcon(element)}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm text-right text-white">
                      {count}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <PieChart size={16} className="mr-2" />
            Card Types
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(analytics.typeDistribution).map(([type, count]) => (
              <div key={type} className="bg-gray-700 rounded p-2 text-center">
                <div className="text-white font-bold">{count}</div>
                <div className="text-gray-400 text-xs">{type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Meta Performance */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <TrendingUp size={16} className="mr-2" />
            Meta Performance
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">
                {deck.winRate}%
              </div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">
                {deck.gamesPlayed}
              </div>
              <div className="text-xs text-gray-400">Games</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {deck.metaShare}%
              </div>
              <div className="text-xs text-gray-400">Meta Share</div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('matches')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft size={20} />
              <span>Back to Matches</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Deck Analytics</h1>
              <p className="text-gray-400">
                {selectedMatch?.round} - {selectedTournament?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Match Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Match Summary</h3>
            <div className="text-2xl font-bold text-white">
              {selectedMatch?.result.score}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {selectedMatch?.duration}
              </div>
              <div className="text-gray-400 text-sm">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {selectedMatch?.result.games.length}
              </div>
              <div className="text-gray-400 text-sm">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {selectedMatch?.result.winner === 'player1'
                  ? selectedMatch?.player1.name
                  : selectedMatch?.player2.name}
              </div>
              <div className="text-gray-400 text-sm">Winner</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">
                {selectedMatch?.round}
              </div>
              <div className="text-gray-400 text-sm">Round</div>
            </div>
          </div>
        </div>

        {/* Deck Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Player 1"
            player={selectedMatch?.player1}
            analytics={player1Analytics}
            deck={selectedMatch?.player1.deck}
          />
          <AnalyticsCard
            title="Player 2"
            player={selectedMatch?.player2}
            analytics={player2Analytics}
            deck={selectedMatch?.player2.deck}
          />
        </div>

        {/* Matchup Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Activity size={20} className="mr-2" />
            Matchup Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Archetype Matchup</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {selectedMatch?.player1.deck.archetype} vs{' '}
                  {selectedMatch?.player2.deck.archetype}
                </div>
                <div className="text-sm text-gray-400">
                  {selectedMatch?.player1.deck.archetype === 'Aggro' &&
                  selectedMatch?.player2.deck.archetype === 'Control'
                    ? 'Favors Aggro'
                    : selectedMatch?.player1.deck.archetype === 'Control' &&
                        selectedMatch?.player2.deck.archetype === 'Aggro'
                      ? 'Favors Control'
                      : 'Balanced Matchup'}
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">
                Average Game Length
              </h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round(
                    selectedMatch?.result.games.reduce((total, game) => {
                      const [minutes, seconds] = game.duration
                        .split(':')
                        .map(Number);
                      return total + minutes + seconds / 60;
                    }, 0) / selectedMatch?.result.games.length,
                  )}{' '}
                  min
                </div>
                <div className="text-sm text-gray-400">Per Game</div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Deck Efficiency</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {(
                    (player1Analytics.averageCost +
                      player2Analytics.averageCost) /
                    2
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Avg Mana Cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'tournaments' && (
            <TournamentList key="tournaments" />
          )}
          {currentView === 'matches' && <MatchList key="matches" />}
          {currentView === 'analytics' && <DeckAnalytics key="analytics" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentMatchAnalytics;
