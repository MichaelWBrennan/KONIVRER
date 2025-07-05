/**
 * Enhanced Game Page with AI Testing Integration
 * 
 * Supports both PvP and AI testing modes with full consciousness integration
 */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Import game components
import EnhancedGameBoard from '../components/game/EnhancedGameBoard';
import GameEngine from '../engine/GameEngine';
import AIPlayer from '../engine/AIPlayer';
import CuttingEdgeAI from '../engine/CuttingEdgeAI';
import NeuralAI from '../engine/NeuralAI';
// Import contexts
import { useDeck } from '../contexts/DeckContext';
import { useBattlePass } from '../contexts/BattlePassContext';
/**
 * Enhanced Game page that supports AI testing mode
 */
const EnhancedGamePage = () => {
  const { gameId, mode } = useParams();
  const navigate = useNavigate();
  const animationSystemRef = useRef(null);
  const rulesEngineRef = useRef(null);
  const aiPlayerRef = useRef(null);
  const { activeDeck, loadDecks } = useDeck();
  const battlePass = useBattlePass();
  // Game state
  const [gameEngine, setGameEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [aiTestingEnabled, setAITestingEnabled] = useState(mode === 'ai-testing');
  const [aiStatus, setAIStatus] = useState(null);
  const [gameMode, setGameMode] = useState(mode || 'pvp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Player data
  const [playerData, setPlayerData] = useState({
    name: 'Player',
    avatarUrl: null,
  });
  const [opponentData, setOpponentData] = useState({
    name: gameMode === 'ai-testing' ? 'Cutting-Edge AI' : 'Opponent',
    avatarUrl: null,
  });
  // Initialize game engine and AI systems
  useEffect(() => {
    initializeGame();
  }, [mode, gameId]);
  // Update AI status periodically when in AI mode
  useEffect(() => {
    if (gameMode.includes('ai') && aiPlayerRef.current) {
      const interval = setInterval(() => {
        updateAIStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameMode, aiPlayerRef.current]);
  const initializeGame = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load decks if not already loaded
      if (!activeDeck) {
        await loadDecks();
      }
      // Initialize game engine
      const engine = new GameEngine({
        mode: gameMode,
        gameId: gameId,
      });
      // Initialize AI player if in AI mode
      if (gameMode.includes('ai')) {
        await initializeAIPlayer(engine);
      }
      // Set up game state
      const initialGameState = engine.initializeGame({
        player1: {
          ...playerData,
          deck: activeDeck || getDefaultDeck(),
        },
        player2: {
          ...opponentData,
          deck: gameMode.includes('ai') ? getAIDeck() : getDefaultDeck(),
          isAI: gameMode.includes('ai'),
        }
      });
      setGameEngine(engine);
      setGameState(initialGameState);
      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize game:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  const initializeAIPlayer = async (engine) => {
    try {
      let aiPlayer;
      if (gameMode === 'ai-testing') {
        // Use cutting-edge AI with maximum performance
        aiPlayer = new CuttingEdgeAI({
          gameEngine: engine,
          consciousnessLevel: 1.0,
          selfAwareness: 1.0,
          enableLifeCardMortality: true,
          enableQuantumDecisions: true,
          enableTheoryOfMind: true,
          enableMetaLearning: true,
          enableEmotionalIntelligence: true,
          performanceMetrics: {
            decisionAccuracy: 1.0,
            adaptationSpeed: 1.0,
            creativityScore: 1.0,
            playerSatisfaction: 1.0,
            strategicDepth: 1.0
          }
        });
      } else {
        // Use standard AI player
        aiPlayer = new AIPlayer({
          gameEngine: engine,
          difficulty: 'normal'
        });
      }
      await aiPlayer.initialize();
      aiPlayerRef.current = aiPlayer;
      // Set initial AI status
      updateAIStatus();
    } catch (err) {
      console.error('Failed to initialize AI player:', err);
      throw err;
    }
  };
  const updateAIStatus = () => {
    if (aiPlayerRef.current && aiPlayerRef.current.getStatus) {
      const status = aiPlayerRef.current.getStatus();
      setAIStatus(status);
    }
  };
  const handleAITestingToggle = (enabled) => {
    setAITestingEnabled(enabled);
    if (enabled && aiPlayerRef.current) {
      // Enable advanced AI features
      aiPlayerRef.current.enableTestingMode();
    } else if (aiPlayerRef.current) {
      // Disable advanced AI features
      aiPlayerRef.current.disableTestingMode();
    }
    updateAIStatus();
  };
  const getDefaultDeck = () => {
    // Return a default deck structure
    return {
      id: 'default',
      name: 'Default Deck',
      cards: [], // Would be populated with actual cards
      flagCard: null,
      ancientHero: null,
    };
  };
  const getAIDeck = () => {
    // Return an AI-optimized deck
    return {
      id: 'ai-deck',
      name: 'AI Strategic Deck',
      cards: [], // Would be populated with AI-optimized cards
      flagCard: null,
      ancientHero: null,
    };
  };
  // Handle loading state
  if (loading) {
    return (
      <div className="enhanced-game-loading">
        <motion.div
          className="loading-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Mode: {gameMode === 'ai-testing' ? 'AI Consciousness Testing' : gameMode.toUpperCase()}</p>
            {gameMode.includes('ai') && (
              <div className="ai-loading-status">
                <div className="ai-loading-step">🧠 Loading AI Consciousness System...</div>
                <div className="ai-loading-step">💀 Initializing Life Card Mortality Awareness...</div>
                <div className="ai-loading-step">⚛️ Calibrating Quantum Decision Engine...</div>
                <div className="ai-loading-step">👁️ Activating Theory of Mind Analysis...</div>
                <div className="ai-loading-step">💯 Setting Performance Metrics to Maximum...</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
  // Handle error state
  if (error) {
    return (
      <div className="enhanced-game-error">
        <motion.div
          className="error-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="return-home-button"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="enhanced-game-page">
      <EnhancedGameBoard
        gameMode={gameMode}
        aiTestingEnabled={aiTestingEnabled}
        onAITestingToggle={handleAITestingToggle}
        aiStatus={aiStatus}
      />
      <style jsx>{`
        .enhanced-game-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        .enhanced-game-loading,
        .enhanced-game-error {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .loading-container,
        .error-container {
          text-align: center;
          max-width: 600px;
          padding: 40px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          border: 2px solid rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
        }
        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(0, 212, 255, 0.3);
          border-top: 4px solid #00d4ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-content h2 {
          color: #00d4ff;
          margin-bottom: 10px;
          font-size: 24px;
        }
        .loading-content p {
          color: #e0e0e0;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .ai-loading-status {
          margin-top: 20px;
          text-align: left;
        }
        .ai-loading-step {
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 8px;
          padding: 10px 15px;
          margin-bottom: 8px;
          color: #8a2be2;
          font-size: 14px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .error-container h2 {
          color: #ff4444;
          margin-bottom: 15px;
        }
        .error-container p {
          color: #e0e0e0;
          margin-bottom: 20px;
        }
        .return-home-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .return-home-button:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};
export default EnhancedGamePage;