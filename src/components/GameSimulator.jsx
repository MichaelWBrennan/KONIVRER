import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Plus,
  Minus,
  Eye,
  Zap,
  Shield,
  Heart,
  Target,
  Settings,
  Save,
  Load,
  Users,
  Bot,
} from 'lucide-react';
import CardViewer from './CardViewer';
import cardsData from '../data/cards.json';

const GameSimulator = () => {
  // Game state
  const [gameState, setGameState] = useState({
    phase: 'setup', // 'setup', 'playing', 'paused', 'ended'
    turn: 1,
    currentPlayer: 1,
    players: {
      1: {
        name: 'Player 1',
        life: 4000, // KONIVRER uses 4000 life points
        azoth: 0,
        maxAzoth: 0,
        hand: [], // Cards not yet played
        deck: [], // Your draw pile for the duration of the game
        field: [], // Where Familiars and Spells are played
        combatRow: [], // Designated area for Familiar battles
        azothRow: [], // Where Azoth cards are placed as resources
        lifeCards: [], // Top 4 cards face down, revealed as damage is taken
        flag: null, // Flag card showing deck elements and bonus damage
        removedFromPlay: [], // Zone for cards affected by Void keyword
        graveyard: [],
      },
      2: {
        name: 'Player 2',
        life: 4000,
        azoth: 0,
        maxAzoth: 0,
        hand: [],
        deck: [],
        field: [],
        combatRow: [],
        azothRow: [],
        lifeCards: [],
        flag: null,
        removedFromPlay: [],
        graveyard: [],
      },
    },
    selectedCard: null,
    targetMode: false,
    gameLog: [],
  });

  const [availableDecks, setAvailableDecks] = useState([]);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp', 'ai', 'tutorial'
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Initialize available decks
  useEffect(() => {
    // Create sample decks from available cards
    const sampleDecks = [
      {
        id: 'elemental-deck',
        name: 'Elemental Forces',
        cards: cardsData.slice(0, 8).map(card => ({
          ...card,
          quantity: Math.floor(Math.random() * 3) + 1,
        })),
      },
      {
        id: 'void-deck',
        name: 'Void Walker',
        cards: cardsData
          .filter(
            card =>
              card.keywords.includes('Void') || card.elements.includes('▢'),
          )
          .map(card => ({ ...card, quantity: 2 })),
      },
      {
        id: 'balanced-deck',
        name: 'Balanced Strategy',
        cards: cardsData.slice(2, 10).map(card => ({ ...card, quantity: 2 })),
      },
    ];
    setAvailableDecks(sampleDecks);
  }, []);

  // Game actions
  const startGame = () => {
    if (!gameState.players[1].deck || !gameState.players[2].deck) {
      alert('Both players need to select a deck first!');
      return;
    }

    const newGameState = { ...gameState };

    // Initialize decks and shuffle
    Object.keys(newGameState.players).forEach(playerId => {
      const player = newGameState.players[playerId];
      const deckCards = [];

      player.deck.cards.forEach(card => {
        for (let i = 0; i < card.quantity; i++) {
          deckCards.push({ ...card, id: `${card.id}_${i}` });
        }
      });

      // Shuffle deck
      const shuffledDeck = deckCards.sort(() => Math.random() - 0.5);

      // Set up Life Cards (top 4 cards face down)
      player.lifeCards = shuffledDeck.splice(0, 4);

      // Remaining cards become the deck
      player.deck = shuffledDeck;

      // Draw opening hand (5 cards in KONIVRER)
      player.hand = player.deck.splice(0, 5);

      // Reset all zones
      player.field = [];
      player.combatRow = [];
      player.azothRow = [];
      player.removedFromPlay = [];
      player.graveyard = [];
      player.flag = null;
      player.life = 4000;
      player.azoth = 0;
      player.maxAzoth = 0;
    });

    newGameState.phase = 'playing';
    newGameState.turn = 1;
    newGameState.currentPlayer = 1;
    newGameState.gameLog = [
      'Game started!',
      'Both players drew their opening hands.',
    ];

    setGameState(newGameState);
  };

  const endTurn = () => {
    const newGameState = { ...gameState };
    const currentPlayer = newGameState.players[newGameState.currentPlayer];
    const nextPlayerId = newGameState.currentPlayer === 1 ? 2 : 1;

    // Draw a card for the next player
    const nextPlayer = newGameState.players[nextPlayerId];
    if (nextPlayer.library.length > 0) {
      nextPlayer.hand.push(nextPlayer.library.shift());
    }

    // Increase max azoth for next player (up to 10)
    if (nextPlayer.maxAzoth < 10) {
      nextPlayer.maxAzoth++;
    }

    // Restore azoth to max
    nextPlayer.azoth = nextPlayer.maxAzoth;

    // Untap all cards on battlefield
    nextPlayer.battlefield.forEach(card => {
      card.tapped = false;
    });

    newGameState.currentPlayer = nextPlayerId;
    if (nextPlayerId === 1) {
      newGameState.turn++;
    }

    newGameState.gameLog.unshift(
      `Turn ${newGameState.turn}: ${nextPlayer.name}'s turn`,
    );

    setGameState(newGameState);
  };

  const playCard = (card, playerId) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Check if player can afford the card
    const cardCost =
      typeof card.cost === 'string'
        ? parseInt(card.cost.split('/')[0])
        : card.cost;
    if (player.azoth < cardCost) {
      alert('Not enough Azoth to play this card!');
      return;
    }

    // Remove card from hand
    player.hand = player.hand.filter(c => c.id !== card.id);

    // Pay cost
    player.azoth -= cardCost;

    // Add to battlefield or resolve effect
    if (card.type.includes('CREATURE') || card.type.includes('AMILIAR')) {
      player.battlefield.push({ ...card, tapped: false, summoned: true });
      newGameState.gameLog.unshift(`${player.name} summoned ${card.name}`);
    } else {
      // Spell effect - add to graveyard
      player.graveyard.push(card);
      newGameState.gameLog.unshift(`${player.name} cast ${card.name}`);

      // Apply spell effects (simplified)
      if (card.text.includes('damage')) {
        const damage = parseInt(card.text.match(/(\d+) damage/)?.[1] || 0);
        if (damage > 0) {
          // For demo, damage goes to opponent
          const opponentId = playerId === 1 ? 2 : 1;
          newGameState.players[opponentId].life -= damage;
          newGameState.gameLog.unshift(`${card.name} deals ${damage} damage`);
        }
      }

      if (card.text.includes('life')) {
        const healing = parseInt(card.text.match(/(\d+) life/)?.[1] || 0);
        if (healing > 0) {
          player.life += healing;
          newGameState.gameLog.unshift(`${player.name} gains ${healing} life`);
        }
      }
    }

    setGameState(newGameState);
  };

  const attackWithCreature = (creature, attackerId) => {
    const newGameState = { ...gameState };
    const attacker = newGameState.players[attackerId];
    const defenderId = attackerId === 1 ? 2 : 1;
    const defender = newGameState.players[defenderId];

    if (creature.tapped || creature.summoned) {
      alert('This creature cannot attack (tapped or summoning sick)');
      return;
    }

    // Tap the creature
    creature.tapped = true;

    // Deal damage to defender (simplified - no blocking)
    const damage = creature.power || 0;
    defender.life -= damage;

    newGameState.gameLog.unshift(
      `${creature.name} attacks for ${damage} damage`,
    );

    // Check for game end
    if (defender.life <= 0) {
      newGameState.phase = 'ended';
      newGameState.gameLog.unshift(`${attacker.name} wins!`);
    }

    setGameState(newGameState);
  };

  const selectDeck = (deck, playerId) => {
    const newGameState = { ...gameState };
    newGameState.players[playerId].deck = deck;
    setGameState(newGameState);
  };

  const resetGame = () => {
    setGameState({
      phase: 'setup',
      turn: 1,
      currentPlayer: 1,
      players: {
        1: {
          name: 'Player 1',
          life: 20,
          azoth: 0,
          maxAzoth: 0,
          hand: [],
          library: [],
          graveyard: [],
          battlefield: [],
          deck: null,
        },
        2: {
          name: 'Player 2',
          life: 20,
          azoth: 0,
          maxAzoth: 0,
          hand: [],
          library: [],
          graveyard: [],
          battlefield: [],
          deck: null,
        },
      },
      selectedCard: null,
      targetMode: false,
      gameLog: [],
    });
  };

  const PlayerZone = ({ player, playerId, isCurrentPlayer }) => (
    <div
      className={`bg-gray-800 rounded-lg p-4 border-2 ${isCurrentPlayer ? 'border-blue-500' : 'border-gray-600'}`}
    >
      {/* Player Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-bold text-white">{player.name}</h3>
          {isCurrentPlayer && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
              Current Turn
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Heart className="text-red-400" size={16} />
            <span className="text-white">{player.life}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="text-blue-400" size={16} />
            <span className="text-white">
              {player.azoth}/{player.maxAzoth}
            </span>
          </div>
          <div className="text-gray-400">
            Hand: {player.hand.length} | Deck: {player.deck.length} | Life
            Cards: {player.lifeCards.length}
          </div>
        </div>
      </div>

      {/* KONIVRER Field Layout */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Field Setup/Zones
        </h4>
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-600">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Top Row */}
            <div className="bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">FLAG</div>
              {player.flag ? (
                <div className="text-xs text-white">{player.flag.name}</div>
              ) : (
                <div className="text-xs text-gray-500">No Flag</div>
              )}
            </div>

            <div className="col-span-2 bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">Combat Row</div>
              <div className="min-h-12 flex flex-wrap gap-1">
                {player.combatRow.length === 0 ? (
                  <div className="text-xs text-gray-500">
                    Designated area for Familiar battles
                  </div>
                ) : (
                  player.combatRow.map((card, index) => (
                    <div
                      key={index}
                      className="bg-blue-600 rounded px-2 py-1 text-xs text-white"
                    >
                      {card.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">DECK</div>
              <div className="text-xs text-white">
                {player.deck.length} cards
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Middle Row */}
            <div className="bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">LIFE</div>
              <div className="text-xs text-white">
                {player.lifeCards.length} cards
              </div>
              <div className="text-xs text-gray-500">Face down</div>
            </div>

            <div className="col-span-2 bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">Field</div>
              <div className="min-h-16 flex flex-wrap gap-1">
                {player.field.length === 0 ? (
                  <div className="text-xs text-gray-500">
                    Where Familiars and Spells are played
                  </div>
                ) : (
                  player.field.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-600 rounded px-2 py-1 text-xs text-white cursor-pointer hover:bg-green-500"
                      onClick={() => setShowCardDetail(card)}
                    >
                      {card.name}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-700 rounded p-2 border border-gray-500">
              <div className="text-xs text-gray-400 mb-1">
                REMOVED FROM PLAY
              </div>
              <div className="text-xs text-white">
                {player.removedFromPlay.length} cards
              </div>
              <div className="text-xs text-gray-500">Void affected</div>
            </div>
          </div>

          <div className="bg-gray-700 rounded p-2 border border-gray-500">
            <div className="text-xs text-gray-400 mb-1">Azoth Row</div>
            <div className="min-h-8 flex flex-wrap gap-1">
              {player.azothRow.length === 0 ? (
                <div className="text-xs text-gray-500">
                  Where Azoth cards are placed as resources
                </div>
              ) : (
                player.azothRow.map((card, index) => (
                  <div
                    key={index}
                    className="bg-purple-600 rounded px-2 py-1 text-xs text-white"
                  >
                    {card.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hand (only show for current player or in setup) */}
      {(isCurrentPlayer || gameState.phase === 'setup') && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Hand</h4>
          <div className="flex flex-wrap gap-2">
            {player.hand.map((card, index) => (
              <motion.div
                key={`${card.id}_${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-600 rounded p-2 cursor-pointer hover:bg-gray-500 transition-colors min-w-32"
                onClick={() => {
                  if (gameState.phase === 'playing' && isCurrentPlayer) {
                    playCard(card, playerId);
                  } else {
                    setShowCardDetail(card);
                  }
                }}
              >
                <div className="text-sm font-medium text-white">
                  {card.name}
                </div>
                <div className="text-xs text-gray-300">Cost: {card.cost}</div>
                <div className="flex items-center gap-1 mt-1">
                  {card.elements.map((element, i) => (
                    <span key={i} className="text-xs">
                      {element}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const GameControls = () => (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Game Controls</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Turn {gameState.turn}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-400">
            Phase: {gameState.phase}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {gameState.phase === 'setup' && (
          <button
            onClick={startGame}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Play size={16} />
            <span>Start Game</span>
          </button>
        )}

        {gameState.phase === 'playing' && (
          <button
            onClick={endTurn}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={16} />
            <span>End Turn</span>
          </button>
        )}

        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset Game</span>
        </button>

        <button
          onClick={() =>
            setGameState({
              ...gameState,
              phase: gameState.phase === 'paused' ? 'playing' : 'paused',
            })
          }
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          disabled={gameState.phase === 'setup'}
        >
          {gameState.phase === 'paused' ? (
            <Play size={16} />
          ) : (
            <Pause size={16} />
          )}
          <span>{gameState.phase === 'paused' ? 'Resume' : 'Pause'}</span>
        </button>
      </div>
    </div>
  );

  const DeckSelection = () => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Deck Selection</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(playerId => (
          <div key={playerId}>
            <h4 className="text-md font-medium text-gray-300 mb-2">
              Player {playerId} - {gameState.players[playerId].name}
            </h4>
            <div className="space-y-2">
              {availableDecks.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => selectDeck(deck, playerId)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    gameState.players[playerId].deck?.id === deck.id
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{deck.name}</div>
                  <div className="text-sm text-gray-400">
                    {deck.cards.reduce(
                      (total, card) => total + card.quantity,
                      0,
                    )}{' '}
                    cards
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GameLog = () => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Game Log</h3>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {gameState.gameLog.map((entry, index) => (
          <div
            key={index}
            className="text-sm text-gray-300 p-2 bg-gray-700 rounded"
          >
            {entry}
          </div>
        ))}
        {gameState.gameLog.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No game events yet
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          KONIVRER Game Simulator
        </h2>
        <p className="text-gray-400">
          Experience the full KONIVRER gameplay with deck testing and AI
          opponents
        </p>
      </div>

      {/* Game Controls */}
      <GameControls />

      {/* Deck Selection (Setup Phase) */}
      {gameState.phase === 'setup' && <DeckSelection />}

      {/* Game Board */}
      {gameState.phase !== 'setup' && (
        <div className="space-y-4">
          {/* Player 2 (Opponent) */}
          <PlayerZone
            player={gameState.players[2]}
            playerId={2}
            isCurrentPlayer={gameState.currentPlayer === 2}
          />

          {/* Player 1 (You) */}
          <PlayerZone
            player={gameState.players[1]}
            playerId={1}
            isCurrentPlayer={gameState.currentPlayer === 1}
          />
        </div>
      )}

      {/* Game Log */}
      <GameLog />

      {/* Game End Screen */}
      {gameState.phase === 'ended' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-gray-300 mb-6">
              {gameState.players[1].life <= 0
                ? 'Player 2 Wins!'
                : 'Player 1 Wins!'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => setGameState({ ...gameState, phase: 'setup' })}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Change Decks
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Card Detail Modal */}
      {showCardDetail && (
        <CardViewer
          card={showCardDetail}
          onClose={() => setShowCardDetail(null)}
          onAddToDeck={() => {}}
        />
      )}
    </div>
  );
};

export default GameSimulator;
