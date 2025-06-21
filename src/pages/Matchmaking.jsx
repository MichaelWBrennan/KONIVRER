import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Clock,
  Trophy,
  Zap,
  Settings,
  Play,
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Star,
  Shield,
  Timer,
  MapPin,
  Globe,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Share2,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart,
  Calendar,
  User,
  UserPlus,
  MessageCircle,
  Bell,
  Headphones,
  Video,
  Mic,
  MicOff,
  Gamepad,
  Award,
  Sparkles,
  Flame,
  Bolt,
  Hourglass,
  Shuffle,
  Repeat,
  Layers,
  Sliders,
  Compass,
  Crosshair,
  Gauge,
  Laptop,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Components
import MatchmakingQueue from '../components/matchmaking/MatchmakingQueue';
import PlayerCard from '../components/matchmaking/PlayerCard';
import MatchFoundModal from '../components/matchmaking/MatchFoundModal';
import RankProgressBar from '../components/matchmaking/RankProgressBar';
import RecentMatches from '../components/matchmaking/RecentMatches';
import LeaderboardPreview from '../components/matchmaking/LeaderboardPreview';
import MatchmakingStats from '../components/matchmaking/MatchmakingStats';
import DeckSelector from '../components/matchmaking/DeckSelector';
import RegionSelector from '../components/matchmaking/RegionSelector';
// Note: FormatSelector removed as KONIVRER only has one format
import MatchmakingPreferences from '../components/matchmaking/MatchmakingPreferences';
import TournamentBrowser from '../components/matchmaking/TournamentBrowser';
import FriendsList from '../components/matchmaking/FriendsList';
import MatchHistory from '../components/matchmaking/MatchHistory';
import MatchmakingTips from '../components/matchmaking/MatchmakingTips';
import MatchmakingNews from '../components/matchmaking/MatchmakingNews';
import MatchmakingChallenges from '../components/matchmaking/MatchmakingChallenges';
import MatchmakingRewards from '../components/matchmaking/MatchmakingRewards';
import PhysicalMatchmakingButton from '../components/matchmaking/PhysicalMatchmakingButton';

const Matchmaking = () => {
  const { user, isAuthenticated } = useAuth();
  const { decks, selectedDeck, setSelectedDeck } = useDeck();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // State
  const [activeTab, setActiveTab] = useState('play');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [preferences, setPreferences] = useState({
    skillRange: 'balanced',
    gameMode: 'ranked',
    region: 'auto',
    crossPlay: true,
    voiceChat: true,
    showRank: true
  });
  // KONIVRER only has one format
  const selectedFormat = 'konivrer';
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recentMatches, setRecentMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showPhysicalMatchmaking, setShowPhysicalMatchmaking] = useState(false);
  
  const searchTimerRef = useRef(null);

  useEffect(() => {
    // Load player stats and preferences
    loadPlayerData();
    
    // Setup online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load mock data
    loadMockData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (searchTimerRef.current) {
        clearInterval(searchTimerRef.current);
      }
    };
  }, []);

  const loadPlayerData = async () => {
    try {
      // Load from ranking engine
      const rankingData = JSON.parse(localStorage.getItem('konivrer_ranking_data') || '{}');
      setPlayerStats({
        rating: rankingData.rating || 1500,
        uncertainty: rankingData.uncertainty || 350,
        conservativeRating: rankingData.conservativeRating || 1150,
        tier: rankingData.tier || 'bronze',
        division: rankingData.division || 'III',
        wins: rankingData.wins || 0,
        losses: rankingData.losses || 0,
        draws: rankingData.draws || 0,
        winRate: rankingData.wins / (rankingData.wins + rankingData.losses) || 0,
        streak: rankingData.streak || 0,
        bestRank: rankingData.bestRank || 'bronze I',
        seasonHighest: rankingData.seasonHighest || 1650,
        rankProgress: rankingData.rankProgress || 75,
        matchesPlayed: rankingData.matchesPlayed || 0,
        seasonRewards: rankingData.seasonRewards || [],
        rankIcon: rankingData.rankIcon || '🥉',
        rankColor: rankingData.rankColor || 'from-amber-600 to-amber-800'
      });

      // Load saved preferences
      const savedPrefs = JSON.parse(localStorage.getItem('konivrer_matchmaking_prefs') || '{}');
      setPreferences(prev => ({ ...prev, ...savedPrefs }));
    } catch (error) {
      console.error('Failed to load player data:', error);
    }
  };

  const loadMockData = () => {
    // Mock recent matches
    setRecentMatches([
      {
        id: 'match_1',
        opponent: {
          name: 'DragonMaster',
          avatar: '🐉',
          rating: 1550,
          tier: 'Silver',
          hero: 'Vynnset, Iron Maiden'
        },
        result: 'win',
        score: '2-1',
        format: 'konivrer',
        date: new Date(Date.now() - 3600000),
        ratingChange: +15
      },
      {
        id: 'match_2',
        opponent: {
          name: 'ElementalForce',
          avatar: '🌟',
          rating: 1620,
          tier: 'Silver',
          hero: 'Briar, Warden of Thorns'
        },
        result: 'loss',
        score: '1-2',
        format: 'konivrer',
        date: new Date(Date.now() - 7200000),
        ratingChange: -12
      },
      {
        id: 'match_3',
        opponent: {
          name: 'ShadowBlade',
          avatar: '⚔️',
          rating: 1480,
          tier: 'Bronze',
          hero: 'Katsu, the Wanderer'
        },
        result: 'win',
        score: '2-0',
        format: 'konivrer',
        date: new Date(Date.now() - 86400000),
        ratingChange: +18
      }
    ]);

    // Mock leaderboard
    setLeaderboard([
      { id: 'player_1', name: 'VoidWalker', rating: 2150, tier: 'Mythic', wins: 152, losses: 43 },
      { id: 'player_2', name: 'CrystalGuard', rating: 2080, tier: 'Mythic', wins: 134, losses: 51 },
      { id: 'player_3', name: 'DragonMaster', rating: 1980, tier: 'Diamond', wins: 112, losses: 48 },
      { id: 'player_4', name: 'ElementalForce', rating: 1920, tier: 'Diamond', wins: 98, losses: 42 },
      { id: 'player_5', name: 'ShadowBlade', rating: 1870, tier: 'Diamond', wins: 87, losses: 39 }
    ]);

    // Mock tournaments
    setTournaments([
      {
        id: 'tournament_1',
        name: 'KONIVRER World Championship Qualifier',
        format: 'konivrer',
        startDate: new Date(Date.now() + 86400000 * 3),
        entryFee: 1000,
        prizePool: 50000,
        participants: 128,
        status: 'registration'
      },
      {
        id: 'tournament_2',
        name: 'Weekly KONIVRER Challenge',
        format: 'konivrer',
        startDate: new Date(Date.now() + 86400000),
        entryFee: 500,
        prizePool: 10000,
        participants: 64,
        status: 'registration'
      },
      {
        id: 'tournament_3',
        name: 'KONIVRER Masters',
        format: 'konivrer',
        startDate: new Date(Date.now() + 86400000 * 7),
        entryFee: 2000,
        prizePool: 25000,
        participants: 32,
        status: 'announced'
      }
    ]);

    // Mock friends
    setFriends([
      { id: 'friend_1', name: 'CrystalGuard', status: 'online', activity: 'In Match', lastSeen: new Date() },
      { id: 'friend_2', name: 'VoidWalker', status: 'online', activity: 'In Queue', lastSeen: new Date() },
      { id: 'friend_3', name: 'ElementalForce', status: 'offline', activity: null, lastSeen: new Date(Date.now() - 3600000) },
      { id: 'friend_4', name: 'ShadowBlade', status: 'away', activity: 'Deck Building', lastSeen: new Date() }
    ]);
  };

  const startMatchmaking = async () => {
    if (!selectedDeck) {
      alert('Please select a deck before searching for a match');
      return;
    }

    if (!isOnline) {
      alert('You need an internet connection to find online matches');
      return;
    }

    setIsSearching(true);
    setSearchTime(0);
    setMatchFound(false);

    // Start search timer
    searchTimerRef.current = setInterval(() => {
      setSearchTime(prev => prev + 1);
    }, 1000);

    // Simulate matchmaking process
    try {
      await simulateMatchmaking();
    } catch (error) {
      console.error('Matchmaking failed:', error);
      cancelMatchmaking();
    }
  };

  const simulateMatchmaking = async () => {
    // Simulate finding a match based on preferences and rating
    const searchDuration = getEstimatedSearchTime();
    
    setTimeout(() => {
      if (isSearching) {
        const opponent = generateOpponent();
        setCurrentMatch({
          id: `match_${Date.now()}`,
          opponent,
          format: selectedFormat,
          gameMode: preferences.gameMode,
          estimatedDuration: '15-20 minutes',
          mapPool: getMapPool(),
          timestamp: new Date()
        });
        setMatchFound(true);
        setIsSearching(false);
        clearInterval(searchTimerRef.current);
      }
    }, Math.min(searchDuration * 1000, 30000)); // Max 30 seconds for demo
  };

  const getEstimatedSearchTime = () => {
    const baseTime = 5; // 5 seconds base
    const ratingModifier = Math.abs(playerStats?.rating - 1500) / 100; // Higher rating = longer search
    const formatModifier = 1; // KONIVRER only has one format
    const skillRangeModifier = preferences.skillRange === 'strict' ? 1.5 : 1;
    
    return baseTime + ratingModifier + formatModifier + skillRangeModifier;
  };

  const generateOpponent = () => {
    const skillVariance = preferences.skillRange === 'strict' ? 50 : 
                         preferences.skillRange === 'balanced' ? 150 : 300;
    
    const opponentRating = playerStats.rating + (Math.random() - 0.5) * skillVariance;
    
    const opponents = [
      { name: 'DragonMaster', avatar: '🐉', specialty: 'Aggro', hero: 'Vynnset, Iron Maiden' },
      { name: 'MysticSage', avatar: '🔮', specialty: 'Control', hero: 'Oldhim, Grandfather of Eternity' },
      { name: 'ShadowBlade', avatar: '⚔️', specialty: 'Combo', hero: 'Katsu, the Wanderer' },
      { name: 'ElementalForce', avatar: '🌟', specialty: 'Midrange', hero: 'Briar, Warden of Thorns' },
      { name: 'VoidWalker', avatar: '👻', specialty: 'Tempo', hero: 'Chane, Bound by Shadow' },
      { name: 'CrystalGuard', avatar: '💎', specialty: 'Defense', hero: 'Prism, Sculptor of Arc Light' }
    ];
    
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    return {
      ...opponent,
      rating: Math.round(opponentRating),
      uncertainty: 200 + Math.random() * 200,
      tier: getRankFromRating(opponentRating),
      winRate: 0.4 + Math.random() * 0.4,
      region: getRandomRegion(),
      ping: Math.round(20 + Math.random() * 80)
    };
  };

  const getRankFromRating = (rating) => {
    if (rating >= 2000) return 'Mythic';
    if (rating >= 1800) return 'Diamond';
    if (rating >= 1600) return 'Platinum';
    if (rating >= 1400) return 'Gold';
    if (rating >= 1200) return 'Silver';
    return 'Bronze';
  };

  const getRandomRegion = () => {
    const regions = ['NA-East', 'NA-West', 'EU-West', 'EU-East', 'Asia-Pacific'];
    return regions[Math.floor(Math.random() * regions.length)];
  };

  const getMapPool = () => {
    const maps = [
      'Ancient Battlefield', 'Mystic Gardens', 'Volcanic Crater',
      'Frozen Wastes', 'Crystal Caverns', 'Shadow Realm'
    ];
    return maps.slice(0, 3).map(map => ({ name: map, votes: 0 }));
  };

  const cancelMatchmaking = () => {
    setIsSearching(false);
    setMatchFound(false);
    setCurrentMatch(null);
    setSearchTime(0);
    if (searchTimerRef.current) {
      clearInterval(searchTimerRef.current);
    }
  };

  const acceptMatch = () => {
    // Transition to game
    console.log('Match accepted:', currentMatch);
    // Here you would typically navigate to the game screen
    setMatchFound(false);
    setCurrentMatch(null);
    
    // Navigate to game
    navigate(`/game/online/${currentMatch.id}`);
  };

  const declineMatch = () => {
    setMatchFound(false);
    setCurrentMatch(null);
    // Optionally restart search
  };

  const formatSearchTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQueuePosition = () => {
    return Math.floor(Math.random() * 50) + 1; // Simulated queue position
  };

  // KONIVRER only has one format, so no format selection needed

  const skillRanges = [
    { id: 'strict', name: 'Strict', description: '±50 rating', waitTime: 'Longer' },
    { id: 'balanced', name: 'Balanced', description: '±150 rating', waitTime: 'Medium' },
    { id: 'wide', name: 'Wide', description: '±300 rating', waitTime: 'Shorter' }
  ];

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offline Mode</h2>
          <p className="text-gray-600 mb-6">
            Matchmaking requires an internet connection. You can still play against AI opponents or practice with your decks.
          </p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => navigate('/game/ai')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Play vs AI
            </button>
            <button 
              onClick={() => setShowPhysicalMatchmaking(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Physical Matchmaking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Matchmaking</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Online</span>
              </div>
            </div>
            
            {playerStats && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {playerStats.tier.toUpperCase()} {playerStats.division}
                  </div>
                  <div className="text-xs text-gray-500">
                    {playerStats.rating} MMR ({playerStats.wins}W-{playerStats.losses}L)
                  </div>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${playerStats.rankColor} rounded-full flex items-center justify-center text-white font-bold`}>
                  {playerStats.rankIcon}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('play')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'play' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Play</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tournaments' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Tournaments</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'stats' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4" />
                <span>Stats</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'history' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>History</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'friends' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Friends</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'settings' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'play' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Matchmaking Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format note - KONIVRER only has one format */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">KONIVRER Format</h2>
              </div>
              <p className="text-sm text-gray-600">KONIVRER uses a single standardized format for all matches.</p>
            </div>

            {/* Deck Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Deck</h2>
              {selectedDeck ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
                      {selectedDeck.name?.[0] || 'D'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedDeck.name || 'My Deck'}</div>
                      <div className="text-sm text-gray-500">
                        {selectedDeck.cards?.length || 60} cards • {selectedDeck.archetype || 'Custom'}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => navigate('/deck-builder')}
                  >
                    Change Deck
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No deck selected</div>
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => navigate('/deck-builder')}
                  >
                    Choose Deck
                  </button>
                </div>
              )}
            </div>

            {/* Matchmaking Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                <button 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Advanced</span>
                  {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Range
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {skillRanges.map((range) => (
                      <motion.button
                        key={range.id}
                        onClick={() => setPreferences(prev => ({ ...prev, skillRange: range.id }))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          preferences.skillRange === range.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium text-sm">{range.name}</div>
                        <div className="text-xs text-gray-500">{range.description}</div>
                        <div className="text-xs text-blue-600 mt-1">{range.waitTime}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {showPreferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Game Mode
                          </label>
                          <select
                            value={preferences.gameMode}
                            onChange={(e) => setPreferences(prev => ({ ...prev, gameMode: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="ranked">Ranked</option>
                            <option value="casual">Casual</option>
                            <option value="tournament">Tournament</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Region
                          </label>
                          <select
                            value={preferences.region}
                            onChange={(e) => setPreferences(prev => ({ ...prev, region: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="auto">Auto (Best Ping)</option>
                            <option value="na-east">NA East</option>
                            <option value="na-west">NA West</option>
                            <option value="eu-west">EU West</option>
                            <option value="eu-east">EU East</option>
                            <option value="asia">Asia Pacific</option>
                            <option value="oceania">Oceania</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Laptop className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Cross-Platform Play</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={preferences.crossPlay}
                              onChange={() => setPreferences(prev => ({ ...prev, crossPlay: !prev.crossPlay }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Headphones className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Voice Chat</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={preferences.voiceChat}
                              onChange={() => setPreferences(prev => ({ ...prev, voiceChat: !prev.voiceChat }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Show Rank</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={preferences.showRank}
                              onChange={() => setPreferences(prev => ({ ...prev, showRank: !prev.showRank }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Start Matchmaking Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isSearching ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Searching for Match</h3>
                      <p className="text-sm text-gray-500">
                        {formatSearchTime(searchTime)} • Queue Position: {getQueuePosition()}
                      </p>
                    </div>
                    <button
                      onClick={cancelMatchmaking}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: "5%" }}
                      animate={{ width: ["5%", "95%"] }}
                      transition={{ 
                        duration: getEstimatedSearchTime(),
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    ></motion.div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{selectedFormat}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>{preferences.gameMode}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{preferences.region}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={startMatchmaking}
                  disabled={!selectedDeck}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-6 h-6" />
                  <span>Find Match</span>
                </motion.button>
              )}
            </div>

            {/* Recent Matches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Matches</h2>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              {recentMatches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent matches.</p>
                  <p className="text-sm">Start playing to see your match history!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMatches.map(match => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {match.result === 'win' ? 'W' : 'L'}
                          </div>
                          <div>
                            <div className="font-medium">vs {match.opponent.name}</div>
                            <div className="text-sm text-gray-500">
                              {match.opponent.hero} • {match.score}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${match.ratingChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {match.ratingChange > 0 ? '+' : ''}{match.ratingChange} MMR
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Stats */}
            {playerStats && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${playerStats.rankColor} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                    {playerStats.rankIcon}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {playerStats.tier.toUpperCase()} {playerStats.division}
                    </div>
                    <div className="text-sm text-gray-500">
                      {playerStats.rating} MMR
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Rank Progress</span>
                      <span className="font-medium">{playerStats.rankProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${playerStats.rankProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{playerStats.wins}</div>
                      <div className="text-xs text-gray-500">Wins</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{playerStats.losses}</div>
                      <div className="text-xs text-gray-500">Losses</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">
                        {((playerStats.wins / (playerStats.wins + playerStats.losses)) * 100 || 0).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>Current Streak</span>
                      </div>
                      <span className="font-medium">{playerStats.streak > 0 ? `+${playerStats.streak}` : playerStats.streak}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Best Rank</span>
                      </div>
                      <span className="font-medium">{playerStats.bestRank}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>Season Highest</span>
                      </div>
                      <span className="font-medium">{playerStats.seasonHighest} MMR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
                <button 
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <span>View Full</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700">
                        {index + 1}
                      </div>
                      <div className="font-medium">{player.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{player.rating}</div>
                      <div className="text-xs text-gray-500">{player.tier}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament section moved to dedicated Tournaments tab */}

            {/* Friends Online */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Friends</h2>
                <button 
                  onClick={() => setShowFriends(!showFriends)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {friends.filter(f => f.status === 'online').slice(0, 3).map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-medium text-gray-700">
                          {friend.name[0]}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-xs text-gray-500">{friend.activity}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Find Friends
                </button>
              </div>
            </div>

            {/* Physical Matchmaking Button */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Physical Card Game?</h2>
              <p className="text-sm text-purple-200 mb-4">
                Use our physical matchmaking system for in-person tournaments and casual play.
              </p>
              <motion.button
                onClick={() => setShowPhysicalMatchmaking(true)}
                className="w-full bg-white text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open Physical Matchmaking
              </motion.button>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Tournaments</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Join official KONIVRER tournaments to compete for prizes, glory, and qualification points.
                  Register for upcoming events or browse past tournament results.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{tournaments.length}</div>
                    <div className="text-sm text-blue-700">Upcoming Tournaments</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">$75,000</div>
                    <div className="text-sm text-green-700">Total Prize Pool</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
                    <div className="text-sm text-purple-700">Your Registrations</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tournaments</h3>
                
                <div className="space-y-4">
                  {tournaments.map(tournament => (
                    <motion.div 
                      key={tournament.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 text-lg">{tournament.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-blue-500" />
                              <span>KONIVRER Format</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Registration Open</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-xs text-gray-500">Entry Fee</div>
                          <div className="font-medium text-gray-900 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 mr-0.5" />
                            {tournament.entryFee}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-xs text-gray-500">Prize Pool</div>
                          <div className="font-medium text-gray-900 flex items-center justify-center">
                            <DollarSign className="w-3 h-3 mr-0.5" />
                            {tournament.prizePool.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-xs text-gray-500">Players</div>
                          <div className="font-medium text-gray-900 flex items-center justify-center">
                            <Users className="w-3 h-3 mr-0.5" />
                            {tournament.participants}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          KONIVRER Format • Best of 1 • Single Elimination
                        </div>
                        <motion.button 
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Register Now
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match Found Modal */}
      <AnimatePresence>
        {matchFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white text-center">
                <h3 className="text-xl font-bold">Match Found!</h3>
                <p className="text-blue-100">Accept or decline within 30 seconds</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">You</div>
                    <div className="font-medium">{user?.displayName || 'Player'}</div>
                    <div className="text-sm text-gray-500">{playerStats?.tier} {playerStats?.division}</div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Opponent</div>
                    <div className="font-medium">{currentMatch?.opponent.name}</div>
                    <div className="text-sm text-gray-500">{currentMatch?.opponent.tier}</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">Format</div>
                    <div className="font-medium">{currentMatch?.format}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">Game Mode</div>
                    <div className="font-medium">{currentMatch?.gameMode}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">Estimated Duration</div>
                    <div className="font-medium">{currentMatch?.estimatedDuration}</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    onClick={declineMatch}
                    className="flex-1 bg-red-100 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Decline
                  </motion.button>
                  <motion.button
                    onClick={acceptMatch}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Physical Matchmaking Modal */}
      <AnimatePresence>
        {showPhysicalMatchmaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                <h3 className="text-xl font-bold">Physical Matchmaking</h3>
                <button 
                  onClick={() => setShowPhysicalMatchmaking(false)}
                  className="text-white hover:text-purple-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => navigate('/matchmaking')}
                      className="flex-1 bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users className="w-5 h-5" />
                      <span>Integrated Version</span>
                    </motion.button>
                    <motion.button
                      onClick={() => navigate('/standalone-matchmaking')}
                      className="flex-1 bg-indigo-100 text-indigo-700 py-3 px-4 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span>Standalone PWA</span>
                    </motion.button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">What's the difference?</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Integrated Version:</strong> Full integration with your KONIVRER account, synchronized with online rankings.</p>
                      <p><strong>Standalone PWA:</strong> Independent operation, no account required, perfect for local tournaments and offline use.</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Install as PWA</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>Both versions can be installed as Progressive Web Apps on your device for easy access.</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-center">
                          <Smartphone className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">iOS/Android</p>
                        </div>
                        <div className="text-center">
                          <Tablet className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Tablets</p>
                        </div>
                        <div className="text-center">
                          <Laptop className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">Computers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Features</h4>
                      <ul className="space-y-1 text-sm text-green-800">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Player management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Quick match creation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Tournament organization</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Match tracking</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Offline functionality</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-2">Use Cases</h4>
                      <ul className="space-y-1 text-sm text-amber-800">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Local game store tournaments</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Casual play groups</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Large tournaments</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Home tournaments</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Data sharing between devices</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matchmaking;