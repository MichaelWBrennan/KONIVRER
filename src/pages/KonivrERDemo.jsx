/**
 * KONIVRER Demo Page
 * 
 * Demonstrates the fully implemented KONIVRER game with:
 * - Complete game board layout
 * - Enhanced card display
 * - Core mechanics implementation
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import KonivrERGameBoard from '../components/game/KonivrERGameBoard';
import KonivrERGameEngine from '../engine/KonivrERGameEngine';
import konivrERCards from '../data/konivrer-cards.json';
import { 
  Play, 
  Users, 
  Settings, 
  Info,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const KonivrERDemo = () => {
  const [gameEngine, setGameEngine] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Create sample decks with only ABISS
  const createSampleDeck = () => {
    const deck = [];
    
    // Create a simple flag card for demo purposes
    const demoFlag = {
      id: 'demo_flag',
      name: 'Demo Flag',
      type: 'Flag',
      elements: { fire: 0 },
      abilities: [
        {
          name: 'Demo Power',
          description: 'Your Familiars get +1/+1',
          type: 'passive'
        }
      ],
      flavorText: 'A demonstration of KONIVRER power.',
      rarity: 'rare',
      setNumber: 'DEMO',
      artUrl: '/assets/cards/fire_flag.jpg'
    };
    
    deck.push(demoFlag);
    
    // Add multiple copies of ABISS to make a playable deck
    const abissCard = konivrERCards[0]; // ABISS is the only card
    for (let i = 0; i < 39; i++) {
      deck.push({
        ...abissCard,
        id: `${abissCard.id}_${i}` // Ensure unique IDs
      });
    }

    return deck;
  };

  const startGame = async () => {
    setLoading(true);
    
    try {
      // Create game engine
      const engine = new KonivrERGameEngine({
        performanceMode: 'high',
        animationLevel: 'full',
        enableSoundEffects: true
      });

      // Create sample players with decks
      const player1Deck = createSampleDeck();
      const player2Deck = createSampleDeck();

      const players = [
        {
          name: 'Player 1',
          deck: player1Deck,
          isHuman: true
        },
        {
          name: 'AI Opponent',
          deck: player2Deck,
          isHuman: false
        }
      ];

      // Initialize game
      engine.initializeGame(players);
      
      setGameEngine(engine);
      setGameStarted(true);
      
    } catch (error) {
      console.error('Failed to start game:', error);
    } finally {
      setLoading(false);
    }
  };

  const returnToMenu = () => {
    setGameStarted(false);
    setGameEngine(null);
  };

  if (gameStarted && gameEngine) {
    return (
      <KonivrERGameBoard
        gameEngine={gameEngine}
        playerData={{ id: 'player1', name: 'Player 1' }}
        opponentData={{ id: 'player2', name: 'AI Opponent' }}
        isSpectator={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated background elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                KONIVRER
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-2">
              Enhanced Trading Card Game
            </p>
            
            <p className="text-gray-400">
              Experience the complete KONIVRER implementation with all game zones and mechanics
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Complete Game Board</h3>
              <p className="text-gray-400 text-sm">
                All KONIVRER zones implemented: Flag, Life Cards, Field, Combat Row, Azoth Row, and more
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Enhanced Cards</h3>
              <p className="text-gray-400 text-sm">
                Full card display with elements, abilities, flavor text, and all KONIVRER-specific parts
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Core Mechanics</h3>
              <p className="text-gray-400 text-sm">
                Elemental system, Life Cards, Inherent card methods, and complete turn structure
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={startGame}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105"
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Starting Game...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Demo Game
                </>
              )}
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
            >
              <Info className="w-5 h-5" />
              Game Info
            </button>
          </motion.div>

          {/* Game Info Panel */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">KONIVRER Implementation Features</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Game Zones</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Flag Zone - Deck identity and bonuses</li>
                    <li>• Life Cards - Unique damage system</li>
                    <li>• Field - Where Familiars and Spells are played</li>
                    <li>• Combat Row - Designated combat area</li>
                    <li>• Azoth Row - Elemental resource management</li>
                    <li>• Removed from Play - Void keyword effects</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">Card Playing Methods</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Summon - Play as Familiar with +1 counters</li>
                    <li>• Tribute - Reduce cost by sacrificing Familiars</li>
                    <li>• Azoth - Place as resource for future turns</li>
                    <li>• Spell - One-time effect, returns to deck</li>
                    <li>• Burst - Free play when drawn from Life Cards</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Elemental System</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Fire (△) - Aggressive, direct damage</li>
                    <li>• Water (▽) - Flow, healing, flexibility</li>
                    <li>• Earth (⊡) - Stability, defense</li>
                    <li>• Air (△) - Speed, evasion</li>
                    <li>• Aether (○) - Transformation, power</li>
                    <li>• Nether (□) - Void, removal</li>
                    <li>• Generic (⊗) - Universal, adaptable</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">Turn Structure</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Start Phase - Draw and generate Azoth</li>
                    <li>• Main Phase - Play cards and abilities</li>
                    <li>• Combat Phase - Declare attackers</li>
                    <li>• Defense Phase - Declare blockers</li>
                    <li>• Resolution Phase - Resolve damage</li>
                    <li>• Post-Combat - Additional card plays</li>
                    <li>• Refresh Phase - Refresh Azoth, end turn</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KonivrERDemo;