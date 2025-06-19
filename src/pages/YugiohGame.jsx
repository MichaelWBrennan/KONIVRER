import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Users, 
  Settings, 
  Download, 
  Upload,
  Gamepad2,
  Trophy,
  Clock,
  Zap,
  Shield,
  Star,
  Target
} from 'lucide-react';

import YugiohGameEngine from '../components/YugiohGameEngine';
import DuelingNexusDeckImporter from '../components/DuelingNexusDeckImporter';

const YugiohGame = () => {
  const [gameMode, setGameMode] = useState('menu'); // menu, setup, playing, spectating
  const [showDeckImporter, setShowDeckImporter] = useState(false);
  const [playerDecks, setPlayerDecks] = useState({
    1: null,
    2: null
  });
  const [gameSettings, setGameSettings] = useState({
    lifePoints: 8000,
    timeLimit: 0, // 0 = no limit, in minutes
    format: 'tcg', // tcg, ocg, rush
    banlist: 'current',
    allowSpectators: true
  });

  // Game modes configuration
  const gameModes = [
    {
      id: 'classic',
      name: 'Classic Duel',
      description: 'Traditional Yu-Gi-Oh! duel with 8000 LP',
      icon: Gamepad2,
      color: 'from-blue-500 to-cyan-500',
      settings: { lifePoints: 8000, format: 'tcg' }
    },
    {
      id: 'speed',
      name: 'Speed Duel',
      description: 'Faster format with 4000 LP and smaller decks',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      settings: { lifePoints: 4000, format: 'speed' }
    },
    {
      id: 'rush',
      name: 'Rush Duel',
      description: 'New format with unique rules and mechanics',
      icon: Target,
      color: 'from-red-500 to-pink-500',
      settings: { lifePoints: 8000, format: 'rush' }
    },
    {
      id: 'tournament',
      name: 'Tournament Match',
      description: 'Best of 3 with side deck and time limits',
      icon: Trophy,
      color: 'from-purple-500 to-indigo-500',
      settings: { lifePoints: 8000, format: 'tcg', timeLimit: 40 }
    }
  ];

  // Handle deck import
  const handleDeckImported = (deck, playerId = 1) => {
    setPlayerDecks(prev => ({
      ...prev,
      [playerId]: deck
    }));
    setShowDeckImporter(false);
  };

  // Start game with selected settings
  const startGame = (mode) => {
    const selectedMode = gameModes.find(m => m.id === mode);
    if (selectedMode) {
      setGameSettings(prev => ({
        ...prev,
        ...selectedMode.settings
      }));
    }
    setGameMode('playing');
  };

  // Check if ready to start
  const canStartGame = () => {
    return playerDecks[1] && playerDecks[2];
  };

  if (gameMode === 'playing') {
    return <YugiohGameEngine initialDecks={playerDecks} settings={gameSettings} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Yu-Gi-Oh! Duel Arena</h1>
            <p className="text-xl text-gray-300">
              Compatible with Dueling Nexus deck creator
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {gameMode === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Game Mode Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Duel Format</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gameModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-6 rounded-xl cursor-pointer
                        bg-gradient-to-br ${mode.color}
                        hover:shadow-xl transition-all duration-300
                      `}
                      onClick={() => {
                        setGameSettings(prev => ({ ...prev, ...mode.settings }));
                        setGameMode('setup');
                      }}
                    >
                      <div className="text-center">
                        <Icon className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                        <p className="text-sm opacity-90">{mode.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeckImporter(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Import Deck</span>
                </button>
                <button
                  onClick={() => setGameMode('setup')}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Custom Setup</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="text-lg font-semibold mb-2">Dueling Nexus Compatible</h4>
                <p className="text-gray-300">
                  Import decks directly from Dueling Nexus deck creator
                </p>
              </div>
              <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h4 className="text-lg font-semibold mb-2">Real-Time Gameplay</h4>
                <p className="text-gray-300">
                  Smooth, responsive dueling with automatic rule enforcement
                </p>
              </div>
              <div className="text-center p-6 bg-gray-800/50 rounded-xl">
                <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h4 className="text-lg font-semibold mb-2">Multiple Formats</h4>
                <p className="text-gray-300">
                  Support for TCG, OCG, Speed Duel, and Rush Duel formats
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {gameMode === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Game Setup</h2>
              <p className="text-gray-300">Configure your duel settings and import decks</p>
            </div>

            {/* Player Setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Player 1 */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Player 1
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Player Name</label>
                    <input
                      type="text"
                      defaultValue="Player 1"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Deck</label>
                    {playerDecks[1] ? (
                      <div className="p-3 bg-green-900/30 border border-green-600 rounded-lg">
                        <div className="font-medium">{playerDecks[1].name}</div>
                        <div className="text-sm text-gray-300">
                          {playerDecks[1].mainDeck.length} main, {playerDecks[1].extraDeck.length} extra
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                        No deck selected
                      </div>
                    )}
                    <button
                      onClick={() => setShowDeckImporter(true)}
                      className="mt-2 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Import Deck</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Player 2 */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Player 2
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Player Name</label>
                    <input
                      type="text"
                      defaultValue="Player 2"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Deck</label>
                    {playerDecks[2] ? (
                      <div className="p-3 bg-green-900/30 border border-green-600 rounded-lg">
                        <div className="font-medium">{playerDecks[2].name}</div>
                        <div className="text-sm text-gray-300">
                          {playerDecks[2].mainDeck.length} main, {playerDecks[2].extraDeck.length} extra
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                        No deck selected
                      </div>
                    )}
                    <button
                      onClick={() => {
                        // For now, copy Player 1's deck for testing
                        if (playerDecks[1]) {
                          setPlayerDecks(prev => ({ ...prev, 2: prev[1] }));
                        } else {
                          setShowDeckImporter(true);
                        }
                      }}
                      className="mt-2 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{playerDecks[1] ? 'Use Same Deck' : 'Import Deck'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Settings */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Game Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Life Points</label>
                  <select
                    value={gameSettings.lifePoints}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, lifePoints: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={4000}>4000 (Speed Duel)</option>
                    <option value={8000}>8000 (Classic)</option>
                    <option value={16000}>16000 (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Format</label>
                  <select
                    value={gameSettings.format}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tcg">TCG</option>
                    <option value="ocg">OCG</option>
                    <option value="speed">Speed Duel</option>
                    <option value="rush">Rush Duel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Limit</label>
                  <select
                    value={gameSettings.timeLimit}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>No Limit</option>
                    <option value={20}>20 Minutes</option>
                    <option value={40}>40 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Banlist</label>
                  <select
                    value={gameSettings.banlist}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, banlist: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="current">Current</option>
                    <option value="previous">Previous</option>
                    <option value="none">No Banlist</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setGameMode('menu')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
              <button
                onClick={() => startGame('custom')}
                disabled={!canStartGame()}
                className={`
                  px-8 py-3 rounded-lg transition-colors font-semibold
                  ${canStartGame() 
                    ? 'bg-green-600 hover:bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {canStartGame() ? 'Start Duel!' : 'Import Decks to Continue'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Deck Importer Modal */}
      <AnimatePresence>
        {showDeckImporter && (
          <DuelingNexusDeckImporter
            onDeckImported={handleDeckImported}
            onClose={() => setShowDeckImporter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default YugiohGame;