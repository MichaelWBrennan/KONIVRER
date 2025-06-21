import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerZone from './PlayerZone';
import GameControls from './GameControls';
import CardStack from './CardStack';
import GameLog from './GameLog';
import PhaseIndicator from './PhaseIndicator';
import GameMenu from './GameMenu';
import CardPreview from './CardPreview';
import { Settings, Menu, MessageSquare, Maximize2, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

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

  // If game state is not loaded yet, show loading
  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
        <div className="text-white text-center px-4 max-w-md">
          <div className="relative mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 md:h-20 md:w-20 border-t-2 border-b-2 border-blue-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Loading KONIVRER Online Sim
          </h2>
          
          <div className="mt-4 bg-black/30 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-gray-300 text-sm">Preparing your game experience...</p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </div>
          
          <p className="text-gray-400 text-xs mt-4">
            Optimized for all devices • MTG Arena-like experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className={`relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-800 touch-manipulation ${
        showEffects ? '' : 'reduce-effects'
      }`}
    >
      {/* Game Header - MTG Arena style */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-black/70 backdrop-blur-md z-10 flex items-center justify-between px-4 shadow-md border-b border-gray-800/50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg hidden md:block">KONIVRER</h1>
          <h1 className="text-white font-bold text-lg md:hidden">KON</h1>
        </div>

        <PhaseIndicator
          currentPhase={gameState.phase}
          activePlayer={gameState.activePlayer}
          playerName={playerData?.name}
          opponentName={opponentData?.name}
        />

        <div className="flex items-center space-x-2">
          {/* Game Log Button */}
          <button
            onClick={() => setShowLog(!showLog)}
            className={`p-2 rounded-full transition-colors ${
              showLog ? 'bg-purple-700/50' : 'hover:bg-white/10'
            }`}
            aria-label="Game Log"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
          
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
          
          {/* Visual Effects Toggle Button */}
          <button
            onClick={toggleEffects}
            className={`p-2 rounded-full transition-colors ${
              showEffects ? 'hover:bg-white/10' : 'bg-gray-700/50'
            }`}
            aria-label={showEffects ? "Disable Effects" : "Enable Effects"}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </button>
          
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Maximize2 className="w-5 h-5 text-white" />
          </button>
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
                className="bg-black/70 text-white px-6 py-3 rounded-lg text-xl font-bold"
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
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md text-white px-5 md:px-7 py-4 rounded-xl shadow-2xl border border-blue-500/30 pointer-events-auto max-w-[90%] md:max-w-md"
            >
              <div className="text-center mb-3">
                <h3 className="text-lg md:text-xl font-bold text-blue-300">Select Targets</h3>
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
                  {targets.length}/{gameEngine.getRequiredTargets()} targets selected
                </p>
              </div>
              
              {/* Selected targets list */}
              {targets.length > 0 && (
                <div className="bg-black/30 rounded-lg p-2 mb-3 max-h-24 overflow-y-auto">
                  {targets.map((target, index) => (
                    <div key={index} className="text-sm text-gray-200 flex justify-between items-center">
                      <span>{target.card.name}</span>
                      <button 
                        onClick={() => setTargets(prev => prev.filter((_, i) => i !== index))}
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
                  className={`px-4 md:px-5 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
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
                  className="px-4 md:px-5 py-2 rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-sm md:text-base font-medium shadow-md transition-colors"
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
