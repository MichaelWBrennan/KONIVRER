/**
 * KONIVRER Enhanced Game Board
 * 
 * Implements the complete KONIVRER game board layout with all zones:
 * - Flag Zone
 * - Life Cards Zone  
 * - Field Zone
 * - Combat Row
 * - Azoth Row
 * - Removed from Play Zone
 * - Hand Zone
 * - Deck Zone
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KonivrERCard from './KonivrERCard';
import KonivrERGameControls from './KonivrERGameControls';
import KonivrERPhaseIndicator from './KonivrERPhaseIndicator';
import KonivrERGameLog from './KonivrERGameLog';
import { 
  Shield, 
  Sword, 
  Heart, 
  Flame, 
  Droplets, 
  Mountain, 
  Wind,
  Sparkles,
  Square,
  Circle,
  X
} from 'lucide-react';

const KonivrERGameBoard = ({ 
  gameEngine, 
  playerData, 
  opponentData, 
  isSpectator = false 
}) => {
  const [gameState, setGameState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [targetMode, setTargetMode] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const boardRef = useRef(null);

  // Element symbols mapping
  const elementSymbols = {
    fire: { icon: Flame, symbol: '△', color: 'text-red-400' },
    water: { icon: Droplets, symbol: '▽', color: 'text-blue-400' },
    earth: { icon: Mountain, symbol: '⊡', color: 'text-green-400' },
    air: { icon: Wind, symbol: '△', color: 'text-gray-300' },
    aether: { icon: Sparkles, symbol: '○', color: 'text-purple-400' },
    nether: { icon: Square, symbol: '□', color: 'text-gray-800' },
    generic: { icon: Circle, symbol: '⊗', color: 'text-gray-400' }
  };

  // Connect to game engine
  useEffect(() => {
    if (!gameEngine) return;

    setGameState(gameEngine.getState());

    const handleStateUpdate = (newState) => {
      setGameState(newState);
    };

    const handleTargetRequest = () => {
      setTargetMode(true);
    };

    gameEngine.on('stateUpdate', handleStateUpdate);
    gameEngine.on('targetRequest', handleTargetRequest);

    return () => {
      gameEngine.off('stateUpdate', handleStateUpdate);
      gameEngine.off('targetRequest', handleTargetRequest);
    };
  }, [gameEngine]);

  // Handle card drag and drop
  const handleDragStart = (card, sourceZone) => {
    setDraggedCard({ card, sourceZone });
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDropZone(null);
  };

  const handleDrop = (targetZone, position) => {
    if (!draggedCard) return;

    const { card, sourceZone } = draggedCard;
    
    // Validate the move based on KONIVRER rules
    if (isValidMove(card, sourceZone, targetZone)) {
      gameEngine.moveCard(card.id, sourceZone, targetZone, position);
    }

    handleDragEnd();
  };

  const isValidMove = (card, sourceZone, targetZone) => {
    // Implement KONIVRER-specific move validation
    if (sourceZone === 'hand') {
      // Cards from hand can be played to field, azoth row, or as spells
      return ['field', 'azothRow', 'spell'].includes(targetZone);
    }
    
    if (sourceZone === 'field' && targetZone === 'combatRow') {
      // Familiars can move to combat row for attacking
      return card.type === 'Familiar';
    }

    return false;
  };

  const handleCardAction = (action, card, params = {}) => {
    if (!gameEngine) return;

    switch (action) {
      case 'summon':
        gameEngine.playCard(card.id, 'summon', params.azothSpent);
        break;
      case 'tribute':
        gameEngine.playCard(card.id, 'tribute', params.azothSpent, params.tributedFamiliars);
        break;
      case 'azoth':
        gameEngine.playCard(card.id, 'azoth');
        break;
      case 'spell':
        gameEngine.playCard(card.id, 'spell', params.azothSpent, params.abilityIndex);
        break;
      case 'burst':
        gameEngine.playCard(card.id, 'burst', params.putInHand);
        break;
      case 'attack':
        gameEngine.declareAttacker(card.id);
        break;
      case 'block':
        gameEngine.declareBlocker(card.id, params.attackerId);
        break;
      default:
        console.warn(`Unknown card action: ${action}`);
    }
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
        <div className="text-white text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-bold mb-2">Loading KONIVRER Game</h2>
          <p className="text-gray-400">Initializing game state...</p>
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.activePlayer];
  const opponent = gameState.players[gameState.activePlayer === 'player1' ? 'player2' : 'player1'];
  const isPlayerTurn = gameState.activePlayer === 'player1'; // Assuming player1 is the human player

  return (
    <div 
      ref={boardRef}
      className="h-screen w-full bg-gradient-to-br from-gray-950 via-blue-950/30 to-gray-900 overflow-hidden relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/assets/konivrer-pattern.png')] bg-repeat opacity-20" />
      </div>

      {/* Main Game Layout */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Opponent Area */}
        <div className="h-1/3 p-4 border-b border-blue-500/20">
          <div className="h-full grid grid-cols-12 gap-2">
            
            {/* Opponent Flag Zone */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Flag</div>
                {opponent.flag && (
                  <KonivrERCard
                    card={opponent.flag}
                    size="small"
                    zone="flag"
                    isInteractive={false}
                  />
                )}
              </div>
              
              {/* Opponent Life Cards */}
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Life Cards</div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">{opponent.lifeCards?.length || 0}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: opponent.lifeCards?.length || 0 }).map((_, i) => (
                    <div key={i} className="w-3 h-4 bg-red-900 rounded-sm border border-red-700" />
                  ))}
                </div>
              </div>
            </div>

            {/* Opponent Combat Row */}
            <div className="col-span-8 bg-red-900/20 rounded-lg border border-red-500/30 p-2">
              <div className="text-xs text-red-400 mb-2">Opponent Combat Row</div>
              <div className="flex gap-2 h-full">
                {opponent.combatRow?.map((card, index) => (
                  <KonivrERCard
                    key={card.id}
                    card={card}
                    zone="combatRow"
                    isInteractive={isPlayerTurn}
                    onClick={() => handleCardAction('block', card)}
                  />
                ))}
                {(!opponent.combatRow || opponent.combatRow.length === 0) && (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    No attacking creatures
                  </div>
                )}
              </div>
            </div>

            {/* Opponent Deck & Removed */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Deck</div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-10 bg-blue-900 rounded border border-blue-700" />
                  <span className="text-sm text-white">{opponent.deck?.length || 0}</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Removed</div>
                <div className="text-sm text-white">{opponent.removedFromPlay?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Opponent Field */}
          <div className="mt-2 bg-gray-800/30 rounded-lg border border-gray-600/30 p-2 h-20">
            <div className="text-xs text-gray-400 mb-1">Opponent Field</div>
            <div className="flex gap-2 overflow-x-auto h-full">
              {opponent.field?.map((card, index) => (
                <KonivrERCard
                  key={card.id}
                  card={card}
                  zone="field"
                  isInteractive={false}
                  size="small"
                />
              ))}
              {(!opponent.field || opponent.field.length === 0) && (
                <div className="flex items-center justify-center text-gray-500 text-sm w-full">
                  No cards on field
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section - Phase Indicator & Game Info */}
        <div className="h-16 flex items-center justify-between px-4 bg-gray-900/50 border-y border-blue-500/20">
          <div className="flex items-center gap-4">
            <KonivrERPhaseIndicator 
              currentPhase={gameState.phase}
              isPlayerTurn={isPlayerTurn}
            />
            <div className="text-white">
              <span className="text-sm">Turn {gameState.currentTurn}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLog(!showLog)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
            >
              {showLog ? 'Hide Log' : 'Show Log'}
            </button>
          </div>
        </div>

        {/* Player Area */}
        <div className="flex-1 p-4">
          <div className="h-full grid grid-cols-12 gap-2">
            
            {/* Player Flag Zone */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Flag</div>
                {currentPlayer.flag && (
                  <KonivrERCard
                    card={currentPlayer.flag}
                    size="small"
                    zone="flag"
                    isInteractive={false}
                  />
                )}
              </div>
              
              {/* Player Life Cards */}
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Life Cards</div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">{currentPlayer.lifeCards?.length || 0}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: currentPlayer.lifeCards?.length || 0 }).map((_, i) => (
                    <div key={i} className="w-3 h-4 bg-red-900 rounded-sm border border-red-700" />
                  ))}
                </div>
              </div>
            </div>

            {/* Player Combat Row */}
            <div className="col-span-8 bg-green-900/20 rounded-lg border border-green-500/30 p-2">
              <div className="text-xs text-green-400 mb-2">Your Combat Row</div>
              <div className="flex gap-2 h-full">
                {currentPlayer.combatRow?.map((card, index) => (
                  <KonivrERCard
                    key={card.id}
                    card={card}
                    zone="combatRow"
                    isInteractive={isPlayerTurn}
                    onClick={() => handleCardAction('attack', card)}
                  />
                ))}
                {(!currentPlayer.combatRow || currentPlayer.combatRow.length === 0) && (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    No attacking creatures
                  </div>
                )}
              </div>
            </div>

            {/* Player Deck & Removed */}
            <div className="col-span-2 flex flex-col gap-2">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Deck</div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-10 bg-blue-900 rounded border border-blue-700 cursor-pointer hover:bg-blue-800"
                       onClick={() => gameEngine.drawCard()} />
                  <span className="text-sm text-white">{currentPlayer.deck?.length || 0}</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/50 h-1/2">
                <div className="text-xs text-gray-400 mb-1">Removed</div>
                <div className="text-sm text-white">{currentPlayer.removedFromPlay?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Player Field */}
          <div className="mt-2 bg-gray-800/30 rounded-lg border border-gray-600/30 p-2 h-20">
            <div className="text-xs text-gray-400 mb-1">Your Field</div>
            <div 
              className="flex gap-2 overflow-x-auto h-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('field')}
            >
              {currentPlayer.field?.map((card, index) => (
                <KonivrERCard
                  key={card.id}
                  card={card}
                  zone="field"
                  isInteractive={isPlayerTurn}
                  size="small"
                  onDragStart={() => handleDragStart(card, 'field')}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
              {(!currentPlayer.field || currentPlayer.field.length === 0) && (
                <div className="flex items-center justify-center text-gray-500 text-sm w-full">
                  Drop cards here to play them
                </div>
              )}
            </div>
          </div>

          {/* Player Azoth Row */}
          <div className="mt-2 bg-yellow-900/20 rounded-lg border border-yellow-500/30 p-2 h-16">
            <div className="text-xs text-yellow-400 mb-1">Azoth Row</div>
            <div 
              className="flex gap-2 overflow-x-auto h-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('azothRow')}
            >
              {currentPlayer.azothRow?.map((card, index) => (
                <KonivrERCard
                  key={card.id}
                  card={card}
                  zone="azothRow"
                  isInteractive={isPlayerTurn}
                  size="tiny"
                  onClick={() => gameEngine.restAzoth(card.id)}
                />
              ))}
              {(!currentPlayer.azothRow || currentPlayer.azothRow.length === 0) && (
                <div className="flex items-center justify-center text-gray-500 text-sm w-full">
                  Drop cards here for Azoth
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="h-32 bg-gray-900/50 border-t border-blue-500/20 p-4">
          <div className="text-xs text-gray-400 mb-2">Your Hand</div>
          <div className="flex gap-2 overflow-x-auto h-full">
            {currentPlayer.hand?.map((card, index) => (
              <KonivrERCard
                key={card.id}
                card={card}
                zone="hand"
                isInteractive={isPlayerTurn}
                isSelected={selectedCard?.id === card.id}
                onDragStart={() => handleDragStart(card, 'hand')}
                onClick={() => setSelectedCard(card)}
                onHover={setHoveredCard}
              />
            ))}
            {(!currentPlayer.hand || currentPlayer.hand.length === 0) && (
              <div className="flex items-center justify-center text-gray-500 text-sm w-full">
                No cards in hand
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <KonivrERGameControls
        gameState={gameState}
        selectedCard={selectedCard}
        onAction={handleCardAction}
        onPhaseAction={(action) => gameEngine[action]()}
        isPlayerTurn={isPlayerTurn}
      />

      {/* Game Log */}
      <AnimatePresence>
        {showLog && (
          <KonivrERGameLog
            gameLog={gameState.gameLog}
            onClose={() => setShowLog(false)}
          />
        )}
      </AnimatePresence>

      {/* Card Preview */}
      <AnimatePresence>
        {hoveredCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <KonivrERCard
              card={hoveredCard}
              size="large"
              isInteractive={false}
              showDetails={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KonivrERGameBoard;