/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerZone from './PlayerZone';
import GameControls from './GameControls';
import CardStack from './CardStack';
import GameLog from './GameLog';
import PhaseIndicator from './PhaseIndicator';
import GameMenu from './GameMenu';
import CardPreview from './CardPreview';
import DynamicResolutionChain from './DynamicResolutionChain';
import {
  Settings,
  Menu,
  MessageSquare,
  Maximize2,
  Volume2,
  VolumeX,
  Eye,
  Sparkles,
} from 'lucide-react';

/**
 * Main game board component that renders the entire game interface
 * and connects to the game engine
 * Enhanced to be more like MTG Arena
 */
const GameBoard = ({
  gameEngine,
  playerData,
  opponentData,
  isSpectator = false,
}) => {
  const [gameState, setGameState] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [targetMode, setTargetMode] = useState(false);
  const [targets, setTargets] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [previewPosition, setPreviewPosition] = useState('right');
  const boardRef = useRef(null);

  // Connect to game engine and set up event listeners
  useEffect(() => {
    if (!gameEngine) return;

    // Initialize game state
    setGameState(gameEngine.getState());

    // Set up event listeners
    const handleStateUpdate = newState => {
      setGameState(newState);
    };

    const handleTargetRequest = data => {
      setTargetMode(true);
      // Reset targets when a new target request comes in
      setTargets([]);
    };

    const handleAnimation = animation => {
      setAnimations(prev => [...prev, animation]);
    };

    // Register event listeners
    gameEngine.on('stateUpdate', handleStateUpdate);
    gameEngine.on('targetRequest', handleTargetRequest);
    gameEngine.on('animation', handleAnimation);

    // Clean up event listeners
    return () => {
      gameEngine.off('stateUpdate', handleStateUpdate);
      gameEngine.off('targetRequest', handleTargetRequest);
      gameEngine.off('animation', handleAnimation);
    };
  }, [gameEngine]);

  // Process animations
  useEffect(() => {
    if (animations.length === 0) return;

    const currentAnimation = animations[0];

    // Play the animation
    const animationTimer = setTimeout(() => {
      // Remove the animation from the queue when it's done
      setAnimations(prev => prev.slice(1));
    }, currentAnimation.duration || 1000);

    return () => clearTimeout(animationTimer);
  }, [animations]);

  // Handle card selection
  const handleCardSelect = (card, zone) => {
    if (targetMode) {
      // In target mode, add the card to targets if it's a valid target
      if (gameEngine.isValidTarget(card)) {
        setTargets(prev => [...prev, { card, zone }]);
      }
    } else {
      // Normal selection
      setSelectedCard(card === selectedCard ? null : card);
    }
  };

  // Handle card hover
  const handleCardHover = card => {
    setHoveredCard(card);
  };

  // Handle action button click
  const handleAction = (action, params = {}) => {
    if (!gameEngine) return;

    switch (action) {
      case 'playCard':
        if (selectedCard) {
          gameEngine.playCard(selectedCard, params);
          setSelectedCard(null);
        }
        break;
      case 'attack':
        if (selectedCard) {
          gameEngine.declareAttacker(selectedCard);
          setSelectedCard(null);
        }
        break;
      case 'block':
        if (selectedCard && params.attacker) {
          gameEngine.declareBlocker(selectedCard, params.attacker);
          setSelectedCard(null);
        }
        break;
      case 'activateAbility':
        if (selectedCard && params.abilityIndex !== undefined) {
          gameEngine.activateAbility(selectedCard, params.abilityIndex);
          setSelectedCard(null);
        }
        break;
      case 'confirmTargets':
        if (targetMode && targets.length > 0) {
          gameEngine.confirmTargets(targets.map(t => t.card));
          setTargetMode(false);
          setTargets([]);
        }
        break;
      case 'cancelTargets':
        if (targetMode) {
          gameEngine.cancelTargets();
          setTargetMode(false);
          setTargets([]);
        }
        break;
      case 'nextPhase':
        gameEngine.nextPhase();
        break;
      case 'passPriority':
        gameEngine.passPriority();
        break;
      case 'respondToDRC':
        gameEngine.respondToDRC(
          gameState.players.findIndex(p => p.id === playerData.id),
          actionData.cardId,
          actionData.azothPaid || [],
          actionData.targets || []
        );
        break;
      case 'passDRC':
        gameEngine.passDRC(
          gameState.players.findIndex(p => p.id === playerData.id)
        );
        break;
      case 'concede':
        gameEngine.concede();
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
    // Here you would also mute/unmute actual game sounds
  };

  // Toggle visual effects
  const toggleEffects = () => {
    setShowEffects(!showEffects);
    // Apply or remove effects class from the game board
    if (boardRef.current) {
      if (showEffects) {
        boardRef.current.classList.add('reduce-effects');
      } else {
        boardRef.current.classList.remove('reduce-effects');
      }
    }
  };

  // Detect screen size and set preview position
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPreviewPosition('center');
      } else {
        setPreviewPosition('right');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If game state is not loaded yet, show MTG Arena-style loading screen
  if (!gameState) {
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
                ease: 'easeInOut',
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
                y: [null, '-10%', null],
                rotate: [null, Math.random() * 10 - 5, null],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
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
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 blur-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Orbiting elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
                animate={{
                  x: Math.cos(i * ((Math.PI * 2) / 3)) * 60,
                  y: Math.sin(i * ((Math.PI * 2) / 3)) * 60,
                  rotate: [0, 360],
                }}
                transition={{
                  x: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 2,
                  },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 2,
                  },
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
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
              Initializing state-of-the-art game engine...
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Loading game assets</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5 }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>Optimizing for your device</span>
                <span>82%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 2.2 }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>Connecting to network</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 3 }}
                />
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
            Optimized for all devices • MTG Arena-quality experience
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className={`relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950/30 to-gray-900 touch-manipulation ${
        showEffects ? '' : 'reduce-effects'
      }`}
    >
      {/* Dynamic background elements - MTG Arena style */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/assets/card-pattern.png')] opacity-5 mix-blend-overlay"></div>

        {/* Dynamic light effects */}
        {showEffects && (
          <>
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-30"
              initial={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15), transparent 70%)',
              }}
              animate={{
                background: [
                  'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15), transparent 70%)',
                  'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15), transparent 70%)',
                  'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.15), transparent 70%)',
                  'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.15), transparent 70%)',
                  'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15), transparent 70%)',
                ],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}
      </div>

      {/* Game Header - Enhanced MTG Arena style */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md z-10 flex items-center justify-between px-4 shadow-lg border-b border-blue-900/50">
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setShowMenu(true)}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-all hover:scale-105 shadow-md"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-blue-400" />
          </motion.button>

          <div className="flex items-center">
            <motion.h1
              className="text-white font-bold text-lg hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                KONIVRER
              </span>
            </motion.h1>
            <motion.h1
              className="text-white font-bold text-lg md:hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                KON
              </span>
            </motion.h1>

            <div className="ml-2 px-2 py-0.5 bg-blue-900/30 rounded-md border border-blue-800/50 hidden md:block">
              <span className="text-xs text-blue-300 font-medium">PREMIUM</span>
            </div>
          </div>
        </div>

        <PhaseIndicator
          currentPhase={gameState.phase}
          activePlayer={gameState.activePlayer}
          playerName={playerData?.name}
          opponentName={opponentData?.name}
        />

        <div className="flex items-center space-x-2">
          {/* Game Log Button */}
          <motion.button
            onClick={() => setShowLog(!showLog)}
            className={`p-2 rounded-full transition-all hover:scale-105 shadow-md ${
              showLog
                ? 'bg-purple-700/80'
                : 'bg-gray-800/80 hover:bg-gray-700/80'
            }`}
            aria-label="Game Log"
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </motion.button>

          {/* Sound Toggle Button */}
          <motion.button
            onClick={toggleSound}
            className={`p-2 rounded-full transition-all hover:scale-105 shadow-md bg-gray-800/80 hover:bg-gray-700/80 ${
              isMuted ? 'border border-red-500/50' : ''
            }`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-blue-400" />
            )}
          </motion.button>

          {/* Visual Effects Toggle Button */}
          <motion.button
            onClick={toggleEffects}
            className={`p-2 rounded-full transition-all hover:scale-105 shadow-md ${
              showEffects
                ? 'bg-gray-800/80 hover:bg-gray-700/80'
                : 'bg-gray-700/80 border border-red-500/50'
            }`}
            aria-label={showEffects ? 'Disable Effects' : 'Enable Effects'}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.button>

          {/* Fullscreen Toggle Button */}
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-all hover:scale-105 shadow-md"
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="w-5 h-5 text-blue-400" />
          </motion.button>
        </div>
      </div>

      {/* Opponent Zone */}
      <PlayerZone
        player={opponentData}
        gameState={gameState.players[1]}
        isOpponent={true}
        onCardSelect={handleCardSelect}
        onCardHover={handleCardHover}
        selectedCard={selectedCard}
        targetMode={targetMode}
        targets={targets}
      />

      {/* Battlefield */}
      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1/4 flex justify-center items-center">
        <div className="w-full max-w-5xl flex justify-between items-center px-4">
          {/* Stack */}
          <CardStack stack={gameState.stack} onCardHover={handleCardHover} />

          {/* Current Animation */}
          {animations.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-black/70 text-white px-6 py-0 whitespace-nowrap rounded-lg text-xl font-bold"
              >
                {animations[0].text}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Player Zone */}
      <PlayerZone
        player={playerData}
        gameState={gameState.players[0]}
        isOpponent={false}
        onCardSelect={handleCardSelect}
        onCardHover={handleCardHover}
        selectedCard={selectedCard}
        targetMode={targetMode}
        targets={targets}
      />

      {/* Game Controls */}
      <GameControls
        gameState={gameState}
        selectedCard={selectedCard}
        targetMode={targetMode}
        targets={targets}
        onAction={handleAction}
        isSpectator={isSpectator}
      />

      {/* Card Preview - MTG Arena style with enhanced visuals */}
      <AnimatePresence>
        {hoveredCard && (
          <CardPreview card={hoveredCard} position={previewPosition} />
        )}
      </AnimatePresence>
      
      {/* Dynamic Resolution Chain */}
      <DynamicResolutionChain
        gameState={gameState}
        onRespond={(cardId) => handleAction('respondToDRC', { cardId })}
        onPass={() => handleAction('passDRC', {})}
        playerId={gameState.players.findIndex(p => p.id === playerData.id)}
        playerHand={gameState.players.find(p => p.id === playerData.id)?.hand || []}
      />

      {/* Game Log */}
      {showLog && (
        <GameLog
          logs={gameState.logs || []}
          onClose={() => setShowLog(false)}
        />
      )}

      {/* Game Menu */}
      {showMenu && (
        <GameMenu onClose={() => setShowMenu(false)} onAction={handleAction} />
      )}

      {/* Target Mode Overlay - MTG Arena style */}
      <AnimatePresence>
        {targetMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-radial from-blue-900/40 to-blue-900/10 pointer-events-none flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md text-white px-5 md:px-7 py-0 whitespace-nowrap rounded-xl shadow-2xl border border-blue-500/30 pointer-events-auto max-w-[90%] md:max-w-md"
            >
              <div className="text-center mb-3">
                <h3 className="text-lg md:text-xl font-bold text-blue-300">
                  Select Targets
                </h3>
                <div className="flex items-center justify-center mt-1 space-x-1">
                  {[...Array(gameEngine.getRequiredTargets())].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < targets.length
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  {targets.length}/{gameEngine.getRequiredTargets()} targets
                  selected
                </p>
              </div>

              {/* Selected targets list */}
              {targets.length > 0 && (
                <div className="bg-black/30 rounded-lg p-2 mb-3 max-h-24 overflow-y-auto">
                  {targets.map((target, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-200 flex justify-between items-center"
                    >
                      <span>{target.card.name}</span>
                      <button
                        onClick={() =>
                          setTargets(prev => prev.filter((_, i) => i !== index))
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('confirmTargets')}
                  disabled={targets.length < gameEngine.getRequiredTargets()}
                  className={`px-4 md:px-5 py-0 whitespace-nowrap rounded-lg text-sm md:text-base font-medium transition-colors ${
                    targets.length >= gameEngine.getRequiredTargets()
                      ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-md'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('cancelTargets')}
                  className="px-4 md:px-5 py-0 whitespace-nowrap rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-sm md:text-base font-medium shadow-md transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;
