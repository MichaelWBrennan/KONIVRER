import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PlayerZone from './PlayerZone';
import GameControls from './GameControls';
import CardStack from './CardStack';
import GameLog from './GameLog';
import PhaseIndicator from './PhaseIndicator';
import GameMenu from './GameMenu';
import { Settings, Menu, MessageSquare } from 'lucide-react';

/**
 * Main game board component that renders the entire game interface
 * and connects to the game engine
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

  // If game state is not loaded yet, show loading
  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-white text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-lg md:text-xl font-bold">Loading Game...</h2>
          <p className="text-gray-400 text-sm mt-2">
            Optimized for all devices
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 touch-manipulation"
    >
      {/* Game Header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-bold">KONIVRER</h1>
        </div>

        <PhaseIndicator
          currentPhase={gameState.phase}
          activePlayer={gameState.activePlayer}
          playerName={playerData?.name}
          opponentName={opponentData?.name}
        />

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLog(!showLog)}
            className={`p-2 rounded-full ${showLog ? 'bg-purple-700/50' : 'hover:bg-white/10'}`}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10">
            <Settings className="w-5 h-5 text-white" />
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

      {/* Card Preview - Responsive for all devices */}
      {hoveredCard && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-48 md:w-64 h-72 md:h-96 pointer-events-none z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full rounded-lg overflow-hidden shadow-xl"
          >
            {/* Card preview with responsive text */}
            <div className="w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center p-2 md:p-4">
                <h3 className="text-white text-base md:text-lg font-bold">
                  {hoveredCard.name}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm">
                  {hoveredCard.type}
                </p>
                <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm">
                  {hoveredCard.text}
                </p>
                {hoveredCard.type === 'Familiar' && (
                  <p className="text-white mt-1 md:mt-2">
                    {hoveredCard.power}/{hoveredCard.toughness}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

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

      {/* Target Mode Overlay - Responsive for all devices */}
      {targetMode && (
        <div className="absolute inset-0 bg-blue-900/30 pointer-events-none flex items-center justify-center z-40">
          <div className="bg-black/80 text-white px-4 md:px-6 py-3 rounded-lg text-base md:text-xl font-bold pointer-events-auto max-w-[90%] md:max-w-md">
            <p className="text-center">
              Select targets ({targets.length}/{gameEngine.getRequiredTargets()}
              )
            </p>
            <div className="flex justify-center mt-3 md:mt-4 space-x-3 md:space-x-4">
              <button
                onClick={() => handleAction('confirmTargets')}
                disabled={targets.length < gameEngine.getRequiredTargets()}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
                  targets.length >= gameEngine.getRequiredTargets()
                    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => handleAction('cancelTargets')}
                className="px-3 md:px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
