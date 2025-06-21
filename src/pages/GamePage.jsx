import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GameBoard from '../components/game/GameBoard';
import GameEngine from '../engine/GameEngine';
import AIPlayer from '../engine/AIPlayer';
import NetworkManager from '../engine/NetworkManager';
import CardAnimationSystem from '../animations/CardAnimations';
import RulesEngine from '../rules/RulesEngine';

/**
 * Game page that initializes the game engine and renders the game board
 */
const GamePage = () => {
  const { gameId, mode } = useParams();
  const navigate = useNavigate();
  const animationSystemRef = useRef(null);
  const rulesEngineRef = useRef(null);

  const [gameEngine, setGameEngine] = useState(null);
  const [playerData, setPlayerData] = useState({
    name: 'Player',
    avatarUrl: null,
  });
  const [opponentData, setOpponentData] = useState({
    name: 'Opponent',
    avatarUrl: null,
  });
  const [isSpectator, setIsSpectator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing');
  const [error, setError] = useState(null);
  const [graphicsQuality, setGraphicsQuality] = useState('auto'); // 'ultra', 'high', 'medium', 'low', 'auto'

  // Initialize game engine based on mode
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);
        setLoadingProgress(0);
        setLoadingStage('Initializing Game Engine');

        // Determine graphics quality based on device capabilities
        const determineGraphicsQuality = () => {
          // Use global performance mode if available
          if (window.KONIVRER_PERFORMANCE_MODE) {
            switch(window.KONIVRER_PERFORMANCE_MODE) {
              case 'high': return 'ultra';
              case 'medium': return 'high';
              case 'low': return 'medium';
              default: return 'high';
            }
          }
          
          // Otherwise detect based on device capabilities
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const memory = navigator.deviceMemory || 4;
          const cores = navigator.hardwareConcurrency || 4;
          
          if (isMobile) {
            if (memory <= 2 || cores <= 2) return 'low';
            if (memory <= 4 || cores <= 4) return 'medium';
            return 'high';
          } else {
            if (memory <= 4 || cores <= 2) return 'medium';
            if (memory <= 8 || cores <= 4) return 'high';
            return 'ultra';
          }
        };

        // Set graphics quality if set to auto
        if (graphicsQuality === 'auto') {
          const detectedQuality = determineGraphicsQuality();
          setGraphicsQuality(detectedQuality);
          console.log(`Auto-detected graphics quality: ${detectedQuality}`);
        }

        // Create game engine with appropriate options
        setLoadingProgress(10);
        setLoadingStage('Creating Game Engine');
        const engineOptions = {
          performanceMode: graphicsQuality === 'ultra' ? 'high' : 
                          graphicsQuality === 'low' ? 'low' : 'medium',
          animationLevel: graphicsQuality === 'low' ? 'minimal' : 
                         graphicsQuality === 'medium' ? 'reduced' : 'full',
          enableBattlefield3D: graphicsQuality !== 'low',
          enableParticleEffects: graphicsQuality !== 'low'
        };
        const engine = new GameEngine(engineOptions);
        
        // Initialize animation system
        setLoadingProgress(20);
        setLoadingStage('Initializing Animation System');
        animationSystemRef.current = new CardAnimationSystem({
          qualityLevel: graphicsQuality === 'ultra' ? 'ULTRA' : 
                       graphicsQuality === 'high' ? 'HIGH' : 
                       graphicsQuality === 'medium' ? 'MEDIUM' : 'LOW'
        });
        
        // Initialize rules engine
        setLoadingProgress(30);
        setLoadingStage('Initializing Rules Engine');
        rulesEngineRef.current = new RulesEngine(engine);
        
        // Connect animation system to game engine
        engine.setAnimationSystem(animationSystemRef.current);
        
        // Connect rules engine to game engine
        engine.setRulesEngine(rulesEngineRef.current);

        setLoadingProgress(40);
        
        // Initialize based on game mode
        switch (mode) {
          case 'ai':
            // AI game mode
            setLoadingStage('Initializing AI Opponent');
            const aiPlayer = new AIPlayer(engine, 1);
            engine.setAIOpponent(aiPlayer);

            setLoadingProgress(50);
            setLoadingStage('Loading Player Deck');
            
            // Load player deck
            const playerDeck =
              JSON.parse(localStorage.getItem('playerDeck')) || [];
            if (playerDeck.length === 0) {
              throw new Error(
                'No player deck found. Please create a deck first.',
              );
            }

            setLoadingProgress(60);
            setLoadingStage('Loading AI Deck');
            
            // Load AI deck
            const aiDeck = await fetchAIDeck();

            setLoadingProgress(70);
            setLoadingStage('Initializing Game State');
            
            // Initialize game with decks
            await engine.initializeGame({
              players: [
                { name: playerData.name, deck: playerDeck },
                { name: 'AI Opponent', deck: aiDeck }
              ],
              isAI: true,
              gameMode: 'standard',
              settings: {
                enableBattlefield3D: graphicsQuality !== 'low',
                enableParticleEffects: graphicsQuality !== 'low',
                animationLevel: engineOptions.animationLevel
              }
            });

            // Set opponent data
            setOpponentData({
              name: 'AI Opponent',
              avatarUrl: null,
            });
            break;

          case 'online':
            // Online multiplayer mode
            if (!gameId) {
              throw new Error('Game ID is required for online mode');
            }

            setLoadingProgress(50);
            setLoadingStage('Connecting to Server');
            
            // Create network manager
            const networkManager = new NetworkManager(engine);

            setLoadingProgress(60);
            setLoadingStage('Joining Game');
            
            // Connect to game
            await networkManager.connect(gameId);

            setLoadingProgress(70);
            setLoadingStage('Loading Game Data');
            
            // Set opponent data from network
            const opponentInfo = networkManager.getOpponentInfo();
            setOpponentData({
              name: opponentInfo.name,
              avatarUrl: opponentInfo.avatarUrl,
            });
            break;

          case 'spectate':
            // Spectator mode
            if (!gameId) {
              throw new Error('Game ID is required for spectator mode');
            }

            setLoadingProgress(50);
            setLoadingStage('Connecting to Server');
            
            // Create network manager
            const spectatorNetwork = new NetworkManager(engine);

            setLoadingProgress(60);
            setLoadingStage('Joining as Spectator');
            
            // Connect as spectator
            await spectatorNetwork.connectAsSpectator(gameId);

            setLoadingProgress(70);
            setLoadingStage('Loading Game Data');
            
            // Set player data
            const players = spectatorNetwork.getPlayerInfo();
            setPlayerData({
              name: players[0].name,
              avatarUrl: players[0].avatarUrl,
            });
            setOpponentData({
              name: players[1].name,
              avatarUrl: players[1].avatarUrl,
            });

            // Set spectator mode
            setIsSpectator(true);
            break;

          default:
            throw new Error(`Unknown game mode: ${mode}`);
        }

        setLoadingProgress(80);
        setLoadingStage('Setting Up Event Handlers');
        
        // Set up game end handler
        engine.on('gameEnd', result => {
          // Stop all animations
          if (animationSystemRef.current) {
            animationSystemRef.current.stopAllAnimations();
          }
          
          // Navigate to results page after game ends
          navigate(`/game-results/${result.winner === 0 ? 'win' : 'loss'}`, {
            state: { gameData: result },
          });
        });
        
        // Set up animation handlers
        engine.on('cardPlayed', (card, player, targetZone) => {
          if (animationSystemRef.current) {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
              if (targetZone === 'field') {
                animationSystemRef.current.playCardPlayAnimation(cardElement, {
                  cardData: card,
                  startPosition: { x: 0, y: 0 }, // Will be calculated by the animation system
                  endPosition: { x: 0, y: 0 }    // Will be calculated by the animation system
                });
              } else if (targetZone === 'azothRow') {
                animationSystemRef.current.playCardPlayAnimation(cardElement, {
                  cardData: card,
                  startPosition: { x: 0, y: 0 },
                  endPosition: { x: 0, y: 0 }
                });
              }
            }
          }
        });
        
        engine.on('cardDrawn', (card, player) => {
          if (animationSystemRef.current) {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
              animationSystemRef.current.playCardDrawAnimation(cardElement, {
                cardData: card
              });
            }
          }
        });
        
        engine.on('attackDeclared', (attackers, player) => {
          if (animationSystemRef.current) {
            attackers.forEach(attacker => {
              const cardElement = document.querySelector(`[data-card-id="${attacker.id}"]`);
              if (cardElement) {
                animationSystemRef.current.playCardTapAnimation(cardElement, true, {
                  cardData: attacker
                });
              }
            });
          }
        });
        
        engine.on('cardDestroyed', (card, player) => {
          if (animationSystemRef.current) {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
              animationSystemRef.current.playCardDestroyAnimation(cardElement, {
                cardData: card,
                targetZone: 'graveyard'
              });
            }
          }
        });
        
        engine.on('abilityActivated', (card, player, abilityIndex, targets) => {
          if (animationSystemRef.current) {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
              const targetElements = targets.map(target => {
                const targetElement = document.querySelector(`[data-card-id="${target.id}"]`);
                return { element: targetElement, card: target };
              }).filter(t => t.element);
              
              animationSystemRef.current.playCardAbilityAnimation(cardElement, {
                cardData: card,
                abilityIndex,
                targets: targetElements
              });
            }
          }
        });

        setLoadingProgress(90);
        setLoadingStage('Finalizing Setup');
        
        // Set game engine
        setGameEngine(engine);
        
        setLoadingProgress(100);
        setLoadingStage('Ready');
        
        // Short delay to show 100% completion
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      if (gameEngine) {
        gameEngine.cleanup();
      }
      
      // Clean up animation system
      if (animationSystemRef.current) {
        animationSystemRef.current.stopAllAnimations();
      }
    };
  }, [gameId, mode, navigate, graphicsQuality, playerData.name]);

  // Fetch AI deck
  const fetchAIDeck = async () => {
    // In a real implementation, this would fetch from an API
    // For now, return a sample deck
    return [
      // Sample deck data would go here
      // This would be replaced with actual card data
      {
        id: 'ai-1',
        name: 'AI Card 1',
        type: 'Familiar',
        power: 2,
        toughness: 2,
      },
      { id: 'ai-2', name: 'AI Card 2', type: 'Spell', text: 'Deal 2 damage' },
      // ... more cards
    ];
  };

  // Show loading screen with progress
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                background: `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)`,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Floating cards in background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-44 md:w-40 md:h-56 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl"
              style={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: Math.random() * 20 - 10,
              }}
              animate={{
                y: [null, "-10%", null],
                rotate: [null, Math.random() * 10 - 5, null],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-white text-center px-4 max-w-md">
          {/* Premium logo animation */}
          <motion.div 
            className="relative mx-auto mb-8 w-32 h-32"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 blur-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <motion.div
                  className="text-white text-3xl font-bold"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  K
                </motion.div>
              </div>
            </div>
            
            {/* Orbiting elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg"
                style={{ 
                  top: "50%", 
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px"
                }}
                animate={{
                  x: Math.cos(i * (Math.PI * 2 / 3)) * 60,
                  y: Math.sin(i * (Math.PI * 2 / 3)) * 60,
                  rotate: [0, 360]
                }}
                transition={{
                  x: { duration: 6, repeat: Infinity, ease: "linear", delay: i * 2 },
                  y: { duration: 6, repeat: Infinity, ease: "linear", delay: i * 2 },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
              >
                <div className="w-4 h-4 rounded-full bg-white/80"></div>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              KONIVRER Premium Simulator
            </span>
          </motion.h2>

          <motion.div 
            className="mt-6 bg-black/40 backdrop-blur-md rounded-xl p-5 border border-blue-500/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <p className="text-gray-300 text-sm md:text-base mb-4">
              {loadingStage}...
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Loading progress</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Graphics Quality</span>
                <span className="capitalize">{graphicsQuality}</span>
              </div>
              <div className="flex space-x-2 mt-1">
                {['low', 'medium', 'high', 'ultra'].map(quality => (
                  <button
                    key={quality}
                    onClick={() => setGraphicsQuality(quality)}
                    className={`text-xs px-2 py-1 rounded ${
                      graphicsQuality === quality 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p 
            className="text-gray-400 text-xs mt-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            State-of-the-art 3D animations • Automated rules • Cross-device compatible
          </motion.p>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-center max-w-md p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <GameBoard
        gameEngine={gameEngine}
        playerData={playerData}
        opponentData={opponentData}
        isSpectator={isSpectator}
      />
    </div>
  );
};

export default GamePage;
