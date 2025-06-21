import React, { useState, useEffect, useRef } from 'react';
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
  Target,
  Shield,
  Swords,
  Crown,
  Timer,
  MapPin,
  Globe,
  Plus,
  Edit,
  Trash2,
  QrCode,
  Share2,
  Download,
  Upload
} from 'lucide-react';

const MatchmakingSystem = () => {
  const [activeTab, setActiveTab] = useState('quickMatch');
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  useEffect(() => {
    // Load player stats and preferences
    loadPlayerData();
    
    // Setup online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
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
        winRate: rankingData.wins / (rankingData.wins + rankingData.losses) || 0
      });

      // Load saved preferences
      const savedPrefs = JSON.parse(localStorage.getItem('konivrer_matchmaking_prefs') || '{}');
      setPreferences(prev => ({ ...prev, ...savedPrefs }));
      
      // Load available decks
      const decks = JSON.parse(localStorage.getItem('konivrer_saved_decks') || '[]');
      if (decks.length > 0 && !selectedDeck) {
        setSelectedDeck(decks[0]);
      }
    } catch (error) {
      console.error('Failed to load player data:', error);
    }
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
    const formatModifier = selectedFormat === 'draft' ? 2 : 1;
    const skillRangeModifier = preferences.skillRange === 'strict' ? 1.5 : 1;
    
    return baseTime + ratingModifier + formatModifier + skillRangeModifier;
  };

  const generateOpponent = () => {
    const skillVariance = preferences.skillRange === 'strict' ? 50 : 
                         preferences.skillRange === 'balanced' ? 150 : 300;
    
    const opponentRating = playerStats.rating + (Math.random() - 0.5) * skillVariance;
    
    const opponents = [
      { name: 'DragonMaster', avatar: '🐉', specialty: 'Aggro' },
      { name: 'MysticSage', avatar: '🔮', specialty: 'Control' },
      { name: 'ShadowBlade', avatar: '⚔️', specialty: 'Combo' },
      { name: 'ElementalForce', avatar: '🌟', specialty: 'Midrange' },
      { name: 'VoidWalker', avatar: '👻', specialty: 'Tempo' },
      { name: 'CrystalGuard', avatar: '💎', specialty: 'Defense' }
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
    alert(`Match accepted! Starting game against ${currentMatch.opponent.name}`);
    setMatchFound(false);
    setCurrentMatch(null);
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

  const formats = [
    { id: 'standard', name: 'Standard', description: 'Current rotation cards only', icon: <Shield className="w-4 h-4" /> },
    { id: 'extended', name: 'Extended', description: 'Last 2 years of cards', icon: <Swords className="w-4 h-4" /> },
    { id: 'legacy', name: 'Legacy', description: 'All cards allowed', icon: <Crown className="w-4 h-4" /> },
    { id: 'draft', name: 'Draft', description: 'Pick cards during match', icon: <Target className="w-4 h-4" /> }
  ];

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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Play vs AI
          </button>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {playerStats.tier[0].toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Matchmaking Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Game Format</h2>
              <div className="grid grid-cols-2 gap-4">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      {format.icon}
                      <span className="font-medium text-gray-900">{format.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">{format.description}</p>
                  </button>
                ))}
              </div>
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
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Change Deck
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No deck selected</div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose Deck
                  </button>
                </div>
              )}
            </div>

            {/* Matchmaking Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Range
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {skillRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setPreferences(prev => ({ ...prev, skillRange: range.id }))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          preferences.skillRange === range.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{range.name}</div>
                        <div className="text-xs text-gray-500">{range.description}</div>
                        <div className="text-xs text-blue-600 mt-1">{range.waitTime}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      <option value="auto">Auto</option>
                      <option value="na-east">NA East</option>
                      <option value="na-west">NA West</option>
                      <option value="eu-west">EU West</option>
                      <option value="asia">Asia Pacific</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {!isSearching && !matchFound ? (
                <button
                  onClick={startMatchmaking}
                  disabled={!selectedDeck}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Find Match</span>
                </button>
              ) : isSearching ? (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-lg font-medium text-gray-900">Searching for match...</span>
                  </div>
                  <div className="text-gray-600 mb-4">
                    Search time: {formatSearchTime(searchTime)} • Position in queue: #{getQueuePosition()}
                  </div>
                  <button
                    onClick={cancelMatchmaking}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel Search
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Queue Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Players online:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In queue:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. wait time:</span>
                  <span className="font-medium">2:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active matches:</span>
                  <span className="font-medium">1,203</span>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h3>
              <div className="space-y-3">
                {[
                  { opponent: 'DragonMaster', result: 'win', rating: '+15' },
                  { opponent: 'ShadowBlade', result: 'loss', rating: '-12' },
                  { opponent: 'MysticSage', result: 'win', rating: '+18' }
                ].map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium">{match.opponent}</span>
                    </div>
                    <span className={`font-medium ${
                      match.result === 'win' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {match.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Join Tournament</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Create Lobby</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span>Practice vs AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Found Modal */}
      {matchFound && currentMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Found!</h2>
              <p className="text-gray-600">Opponent found in {formatSearchTime(searchTime)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold">You</div>
                  <div className="text-sm text-gray-600">{playerStats?.tier} {playerStats?.division}</div>
                  <div className="text-sm text-gray-500">{playerStats?.rating} MMR</div>
                </div>
                <div className="text-2xl">⚔️</div>
                <div className="text-center">
                  <div className="text-lg font-bold">{currentMatch.opponent.name}</div>
                  <div className="text-sm text-gray-600">{currentMatch.opponent.tier}</div>
                  <div className="text-sm text-gray-500">{currentMatch.opponent.rating} MMR</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 font-medium">{selectedFormat}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mode:</span>
                  <span className="ml-2 font-medium">{preferences.gameMode}</span>
                </div>
                <div>
                  <span className="text-gray-600">Region:</span>
                  <span className="ml-2 font-medium">{currentMatch.opponent.region}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ping:</span>
                  <span className="ml-2 font-medium">{currentMatch.opponent.ping}ms</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={declineMatch}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptMatch}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Accept Match
              </button>
            </div>

            <div className="text-center mt-4">
              <div className="text-sm text-gray-500">
                Auto-accept in <Timer className="w-4 h-4 inline" /> 30s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakingSystem;