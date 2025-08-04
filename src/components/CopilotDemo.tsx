import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CopilotIntegration from '../components/CopilotIntegration';

const CopilotDemo: React.FC = () => {
  const [gameState, setGameState] = useState({
    turn: 1,
    phase: 'early',
    playerHealth: 20,
    opponentHealth: 20,
    boardState: 'developing'
  });

  const [currentDeck, setCurrentDeck] = useState({
    name: 'Mystical Storm Deck',
    cards: [
      { id: 1, name: 'Lightning Bolt', cost: 1, type: 'spell' },
      { id: 2, name: 'Storm Elemental', cost: 3, type: 'creature' },
      { id: 3, name: 'Mystic Shield', cost: 2, type: 'artifact' },
      { id: 4, name: 'Thunder Strike', cost: 4, type: 'spell' },
      { id: 5, name: 'Ancient Guardian', cost: 6, type: 'creature' }
    ],
    optimized: false
  });

  const [playerProfile, setPlayerProfile] = useState({
    level: 'intermediate',
    gamesPlayed: 156,
    winRate: 0.68,
    preferredStyle: 'aggressive'
  });

  const [actionHistory, setActionHistory] = useState<any[]>([]);

  // Simulate game progression
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        phase: prev.turn <= 3 ? 'early' : prev.turn <= 7 ? 'mid' : 'late'
      }));
    }, 10000); // Advance turn every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCopilotAction = (action: any) => {
    console.log('Copilot action received:', action);
    setActionHistory(prev => [...prev.slice(-4), { ...action, timestamp: new Date() }]);

    if (action.type === 'deck_optimized') {
      setCurrentDeck(prev => ({ ...prev, optimized: true }));
    }
  };

  const simulateGameAction = (action: string) => {
    switch (action) {
      case 'advance_turn':
        setGameState(prev => ({
          ...prev,
          turn: prev.turn + 1,
          phase: prev.turn + 1 <= 3 ? 'early' : prev.turn + 1 <= 7 ? 'mid' : 'late'
        }));
        break;
      case 'change_deck':
        setCurrentDeck({
          name: Math.random() > 0.5 ? 'Defensive Control' : 'Aggressive Rush',
          cards: currentDeck.cards.map(card => ({ ...card, cost: Math.floor(Math.random() * 6) + 1 })),
          optimized: false
        });
        break;
      case 'change_level':
        const levels = ['beginner', 'intermediate', 'advanced'];
        const currentIndex = levels.indexOf(playerProfile.level);
        const newLevel = levels[(currentIndex + 1) % levels.length];
        setPlayerProfile(prev => ({ ...prev, level: newLevel }));
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 OpenHands AI-Level Copilot Demo
          </h1>
          <p className="text-xl text-gray-300">
            Experience the upgraded intelligent assistant in action
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game State Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-blue-500 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              🎮 Game State
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Turn:</span>
                <span className="text-white font-bold">{gameState.turn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Phase:</span>
                <span className={`font-bold ${
                  gameState.phase === 'early' ? 'text-green-400' :
                  gameState.phase === 'mid' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {gameState.phase.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Your Health:</span>
                <span className="text-green-400 font-bold">{gameState.playerHealth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Opponent Health:</span>
                <span className="text-red-400 font-bold">{gameState.opponentHealth}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h3 className="text-white font-semibold">Test Actions:</h3>
              <button
                onClick={() => simulateGameAction('advance_turn')}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                Advance Turn
              </button>
              <button
                onClick={() => simulateGameAction('change_deck')}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              >
                Switch Deck
              </button>
              <button
                onClick={() => simulateGameAction('change_level')}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
              >
                Change Skill Level
              </button>
            </div>
          </motion.div>

          {/* Copilot Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <CopilotIntegration
              gameState={gameState}
              currentDeck={currentDeck}
              playerProfile={playerProfile}
              onAction={handleCopilotAction}
              config={{
                debugMode: true,
                adaptiveLearning: true,
                aiServicesEnabled: true
              }}
            />
          </motion.div>

          {/* Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Current Deck */}
            <div className="bg-gray-800 border border-green-500 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                🃏 Current Deck
                {currentDeck.optimized && (
                  <span className="ml-2 px-2 py-1 bg-green-600 text-xs rounded">OPTIMIZED</span>
                )}
              </h2>
              
              <h3 className="text-lg text-white font-semibold mb-2">{currentDeck.name}</h3>
              <div className="space-y-2">
                {currentDeck.cards.slice(0, 3).map(card => (
                  <div key={card.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{card.name}</span>
                    <span className="text-white">{card.cost} ⚡</span>
                  </div>
                ))}
                <div className="text-gray-400 text-xs">
                  ... and {currentDeck.cards.length - 3} more cards
                </div>
              </div>
            </div>

            {/* Player Profile */}
            <div className="bg-gray-800 border border-yellow-500 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">👤 Player Profile</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Skill Level:</span>
                  <span className="text-white font-bold capitalize">{playerProfile.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Games Played:</span>
                  <span className="text-white">{playerProfile.gamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Rate:</span>
                  <span className="text-green-400">{(playerProfile.winRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Style:</span>
                  <span className="text-white capitalize">{playerProfile.preferredStyle}</span>
                </div>
              </div>
            </div>

            {/* Action History */}
            <div className="bg-gray-800 border border-purple-500 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">📊 Action History</h2>
              
              {actionHistory.length > 0 ? (
                <div className="space-y-2">
                  {actionHistory.map((action, index) => (
                    <div key={index} className="p-2 bg-gray-700 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{action.type}</span>
                        <span className="text-gray-400 text-xs">
                          {action.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {action.suggestions && (
                        <div className="mt-1 text-gray-300 text-xs">
                          {action.suggestions.length} suggestions provided
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  No actions yet. Try the Copilot buttons!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800 border border-indigo-500 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            🚀 OpenHands AI-Level Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold text-white mb-2">Intelligent Reasoning</h3>
              <p className="text-gray-300 text-sm">
                Advanced decision-making with multi-criteria evaluation and confidence scoring
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Goal-Oriented</h3>
              <p className="text-gray-300 text-sm">
                Autonomous goal creation, prioritization, and strategic planning
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">Adaptive Learning</h3>
              <p className="text-gray-300 text-sm">
                Continuous improvement through pattern recognition and outcome tracking
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CopilotDemo;