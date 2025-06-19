import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Users,
  Zap,
  Shield,
  Sword,
  Heart,
  Star,
  Target,
  Eye,
  EyeOff,
  Shuffle,
  Plus,
  Minus,
} from 'lucide-react';
import { yugiohCards, getCardById, sampleDecks } from '../data/yugiohCards';

// Yu-Gi-Oh! Game Engine Component
const YugiohGameEngine = () => {
  // Game State
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup, duel, end
    turn: 1,
    currentPlayer: 1,
    turnPhase: 'draw', // draw, standby, main1, battle, main2, end
    winner: null,
    gameMode: 'classic', // classic, speed, rush
  });

  // Player States
  const [players, setPlayers] = useState({
    1: {
      id: 1,
      name: 'Player 1',
      lifePoints: 8000,
      deck: [],
      hand: [],
      field: {
        monsters: Array(5).fill(null),
        spells: Array(5).fill(null),
        fieldSpell: null,
        extraDeck: [],
        graveyard: [],
        banished: [],
      },
      deckCount: 40,
      extraDeckCount: 15,
    },
    2: {
      id: 2,
      name: 'Player 2',
      lifePoints: 8000,
      deck: [],
      hand: [],
      field: {
        monsters: Array(5).fill(null),
        spells: Array(5).fill(null),
        fieldSpell: null,
        extraDeck: [],
        graveyard: [],
        banished: [],
      },
      deckCount: 40,
      extraDeckCount: 15,
    },
  });

  // Game Settings
  const [settings, setSettings] = useState({
    autoPhase: false,
    confirmActions: true,
    showOpponentHand: false,
    animationSpeed: 'normal',
    soundEnabled: true,
  });

  // UI State
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetMode, setTargetMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Load sample deck for testing
    const sampleDeck = generateSampleDeck();

    setPlayers(prev => ({
      1: {
        ...prev[1],
        deck: [...sampleDeck],
        deckCount: sampleDeck.length,
      },
      2: {
        ...prev[2],
        deck: [...sampleDeck],
        deckCount: sampleDeck.length,
      },
    }));

    // Start game
    startDuel();
  };

  const generateSampleDeck = () => {
    // Use the Blue-Eyes sample deck from the database
    const sampleDeck = sampleDecks.blueEyes;
    const deck = [];

    // Convert sample deck format to game format
    sampleDeck.mainDeck.forEach(({ cardId, count }) => {
      const card = getCardById(cardId);
      if (card) {
        for (let i = 0; i < count; i++) {
          deck.push({
            ...card,
            uniqueId: `${cardId}_${i}_${Date.now()}_${Math.random()}`,
          });
        }
      }
    });

    // Fill remaining slots with basic cards to reach 40 cards
    const basicCards = [89631139, 46986414, 20721928]; // Blue-Eyes, Dark Magician, Sparkman
    while (deck.length < 40) {
      const cardId = basicCards[deck.length % basicCards.length];
      const card = getCardById(cardId);
      if (card) {
        deck.push({
          ...card,
          uniqueId: `filler_${cardId}_${deck.length}_${Date.now()}_${Math.random()}`,
        });
      }
    }

    return shuffleDeck(deck);
  };

  const shuffleDeck = deck => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startDuel = () => {
    // Draw opening hands
    drawOpeningHands();
    setGameState(prev => ({ ...prev, phase: 'duel' }));
  };

  const drawOpeningHands = () => {
    setPlayers(prev => {
      const newPlayers = { ...prev };

      // Player 1 draws 5 cards
      const player1Hand = newPlayers[1].deck.splice(0, 5);
      newPlayers[1].hand = player1Hand;
      newPlayers[1].deckCount = newPlayers[1].deck.length;

      // Player 2 draws 5 cards
      const player2Hand = newPlayers[2].deck.splice(0, 5);
      newPlayers[2].hand = player2Hand;
      newPlayers[2].deckCount = newPlayers[2].deck.length;

      return newPlayers;
    });
  };

  const drawCard = playerId => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      const player = newPlayers[playerId];

      if (player.deck.length > 0) {
        const drawnCard = player.deck.shift();
        player.hand.push(drawnCard);
        player.deckCount = player.deck.length;
      }

      return newPlayers;
    });
  };

  const nextPhase = () => {
    const phases = ['draw', 'standby', 'main1', 'battle', 'main2', 'end'];
    const currentPhaseIndex = phases.indexOf(gameState.turnPhase);

    if (currentPhaseIndex < phases.length - 1) {
      setGameState(prev => ({
        ...prev,
        turnPhase: phases[currentPhaseIndex + 1],
      }));
    } else {
      // End turn
      endTurn();
    }
  };

  const endTurn = () => {
    const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    const nextTurn = nextPlayer === 1 ? gameState.turn + 1 : gameState.turn;

    // Draw card for next player
    drawCard(nextPlayer);

    setGameState(prev => ({
      ...prev,
      currentPlayer: nextPlayer,
      turn: nextTurn,
      turnPhase: 'draw',
    }));
  };

  const playCard = (card, playerId, position = null) => {
    if (card.type === 'Monster') {
      summonMonster(card, playerId, position);
    } else if (card.type === 'Spell') {
      activateSpell(card, playerId);
    } else if (card.type === 'Trap') {
      setTrap(card, playerId, position);
    }
  };

  const summonMonster = (card, playerId, position) => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      const player = newPlayers[playerId];

      // Remove from hand
      player.hand = player.hand.filter(c => c.uniqueId !== card.uniqueId);

      // Add to field
      if (position !== null && player.field.monsters[position] === null) {
        player.field.monsters[position] = {
          ...card,
          position: 'attack', // attack or defense
          faceUp: true,
        };
      }

      return newPlayers;
    });
  };

  const activateSpell = (card, playerId) => {
    // Implement spell activation logic
    setPlayers(prev => {
      const newPlayers = { ...prev };
      const player = newPlayers[playerId];

      // Remove from hand
      player.hand = player.hand.filter(c => c.uniqueId !== card.uniqueId);

      // Add to graveyard after activation
      player.field.graveyard.push(card);

      return newPlayers;
    });
  };

  const setTrap = (card, playerId, position) => {
    setPlayers(prev => {
      const newPlayers = { ...prev };
      const player = newPlayers[playerId];

      // Remove from hand
      player.hand = player.hand.filter(c => c.uniqueId !== card.uniqueId);

      // Set face-down in spell/trap zone
      if (position !== null && player.field.spells[position] === null) {
        player.field.spells[position] = {
          ...card,
          faceUp: false,
        };
      }

      return newPlayers;
    });
  };

  const CardComponent = ({
    card,
    zone,
    position,
    playerId,
    faceDown = false,
  }) => {
    const isCurrentPlayer = playerId === gameState.currentPlayer;
    const canInteract = isCurrentPlayer && gameState.phase === 'duel';

    return (
      <motion.div
        className={`
          relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 cursor-pointer
          ${faceDown ? 'bg-blue-900 border-blue-700' : 'bg-gray-800 border-gray-600'}
          ${selectedCard?.uniqueId === card?.uniqueId ? 'ring-2 ring-yellow-400' : ''}
          ${canInteract ? 'hover:border-blue-400 hover:shadow-lg' : ''}
          transition-all duration-200
        `}
        whileHover={canInteract ? { scale: 1.05 } : {}}
        whileTap={canInteract ? { scale: 0.95 } : {}}
        onClick={() => canInteract && setSelectedCard(card)}
      >
        {card && !faceDown && (
          <div className="absolute inset-0 p-1 text-xs text-white">
            <div className="font-bold truncate">{card.name}</div>
            {card.type === 'Monster' && (
              <div className="absolute bottom-1 left-1 text-xs">
                <div>
                  {card.attack}/{card.defense}
                </div>
              </div>
            )}
          </div>
        )}
        {card && faceDown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded border border-blue-400"></div>
          </div>
        )}
        {!card && (
          <div className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-lg"></div>
        )}
      </motion.div>
    );
  };

  const HandCard = ({ card, playerId }) => {
    const isCurrentPlayer = playerId === gameState.currentPlayer;
    const canPlay =
      isCurrentPlayer &&
      gameState.phase === 'duel' &&
      (gameState.turnPhase === 'main1' || gameState.turnPhase === 'main2');

    return (
      <motion.div
        className={`
          relative w-12 h-18 md:w-16 md:h-24 rounded-lg border-2 cursor-pointer
          bg-gray-800 border-gray-600
          ${selectedCard?.uniqueId === card.uniqueId ? 'ring-2 ring-yellow-400' : ''}
          ${canPlay ? 'hover:border-green-400 hover:shadow-lg' : ''}
          transition-all duration-200
        `}
        whileHover={canPlay ? { scale: 1.1, y: -10 } : {}}
        whileTap={canPlay ? { scale: 0.95 } : {}}
        onClick={() => canPlay && setSelectedCard(card)}
      >
        <div className="absolute inset-0 p-1 text-xs text-white">
          <div className="font-bold truncate">{card.name}</div>
          {card.type === 'Monster' && (
            <div className="absolute bottom-1 left-1 text-xs">
              <div>★{card.level}</div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Game Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Yu-Gi-Oh! Duel</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span>Turn {gameState.turn}</span>
              <span>•</span>
              <span className="capitalize">{gameState.turnPhase} Phase</span>
              <span>•</span>
              <span>Player {gameState.currentPlayer}'s Turn</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={nextPhase}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Next Phase
            </button>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Opponent Field (Player 2) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{players[2].name}</h3>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-xl font-bold">
                  {players[2].lifePoints}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Deck: {players[2].deckCount} | Hand: {players[2].hand.length}
            </div>
          </div>

          {/* Opponent Hand (Hidden) */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {players[2].hand.map((_, index) => (
                <div
                  key={index}
                  className="w-12 h-18 md:w-16 md:h-24 bg-blue-900 border-2 border-blue-700 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Opponent Field */}
          <div className="space-y-2">
            {/* Spell/Trap Zone */}
            <div className="flex justify-center space-x-2">
              {players[2].field.spells.map((card, index) => (
                <CardComponent
                  key={index}
                  card={card}
                  zone="spell"
                  position={index}
                  playerId={2}
                  faceDown={card && !card.faceUp}
                />
              ))}
            </div>

            {/* Monster Zone */}
            <div className="flex justify-center space-x-2">
              {players[2].field.monsters.map((card, index) => (
                <CardComponent
                  key={index}
                  card={card}
                  zone="monster"
                  position={index}
                  playerId={2}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Field Center */}
        <div className="flex justify-center items-center py-8 border-y border-gray-700">
          <div className="text-center">
            <div className="text-6xl mb-2">⚔️</div>
            <div className="text-lg font-semibold">Battle Zone</div>
          </div>
        </div>

        {/* Player Field (Player 1) */}
        <div className="mt-8">
          {/* Player Field */}
          <div className="space-y-2 mb-4">
            {/* Monster Zone */}
            <div className="flex justify-center space-x-2">
              {players[1].field.monsters.map((card, index) => (
                <CardComponent
                  key={index}
                  card={card}
                  zone="monster"
                  position={index}
                  playerId={1}
                />
              ))}
            </div>

            {/* Spell/Trap Zone */}
            <div className="flex justify-center space-x-2">
              {players[1].field.spells.map((card, index) => (
                <CardComponent
                  key={index}
                  card={card}
                  zone="spell"
                  position={index}
                  playerId={1}
                  faceDown={card && !card.faceUp}
                />
              ))}
            </div>
          </div>

          {/* Player Hand */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {players[1].hand.map((card, index) => (
                <HandCard key={card.uniqueId} card={card} playerId={1} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Deck: {players[1].deckCount} | Hand: {players[1].hand.length}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-xl font-bold">
                  {players[1].lifePoints}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{players[1].name}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">{selectedCard.name}</h3>
              <div className="space-y-2 mb-4">
                <div>
                  <strong>Type:</strong> {selectedCard.type}
                </div>
                {selectedCard.attribute && (
                  <div>
                    <strong>Attribute:</strong> {selectedCard.attribute}
                  </div>
                )}
                {selectedCard.level && (
                  <div>
                    <strong>Level:</strong> {selectedCard.level}
                  </div>
                )}
                {selectedCard.attack !== undefined && (
                  <div>
                    <strong>ATK/DEF:</strong> {selectedCard.attack}/
                    {selectedCard.defense}
                  </div>
                )}
                <div>
                  <strong>Description:</strong> {selectedCard.description}
                </div>
              </div>

              <div className="flex space-x-2">
                {gameState.currentPlayer === 1 &&
                  gameState.phase === 'duel' && (
                    <>
                      {selectedCard.type === 'Monster' && (
                        <button
                          onClick={() => {
                            // Find empty monster zone
                            const emptySlot =
                              players[1].field.monsters.findIndex(
                                slot => slot === null,
                              );
                            if (emptySlot !== -1) {
                              playCard(selectedCard, 1, emptySlot);
                              setSelectedCard(null);
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                        >
                          Summon
                        </button>
                      )}
                      {selectedCard.type === 'Spell' && (
                        <button
                          onClick={() => {
                            playCard(selectedCard, 1);
                            setSelectedCard(null);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      {selectedCard.type === 'Trap' && (
                        <button
                          onClick={() => {
                            // Find empty spell/trap zone
                            const emptySlot = players[1].field.spells.findIndex(
                              slot => slot === null,
                            );
                            if (emptySlot !== -1) {
                              playCard(selectedCard, 1, emptySlot);
                              setSelectedCard(null);
                            }
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                        >
                          Set
                        </button>
                      )}
                    </>
                  )}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Game Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Phase</span>
                  <button
                    onClick={() =>
                      setSettings(prev => ({
                        ...prev,
                        autoPhase: !prev.autoPhase,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoPhase ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoPhase ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Confirm Actions</span>
                  <button
                    onClick={() =>
                      setSettings(prev => ({
                        ...prev,
                        confirmActions: !prev.confirmActions,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.confirmActions ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.confirmActions
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Show Opponent Hand</span>
                  <button
                    onClick={() =>
                      setSettings(prev => ({
                        ...prev,
                        showOpponentHand: !prev.showOpponentHand,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.showOpponentHand ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.showOpponentHand
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YugiohGameEngine;
