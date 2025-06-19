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
  Flag,
  Swords,
  RefreshCw,
} from 'lucide-react';
import CardViewer from './CardViewer';
import cardsData from '../data/cards.json';

const GameSimulator = () => {
  // Game state with new phase system
  const [gameState, setGameState] = useState({
    phase: 'setup', // 'setup', 'preGame', 'start', 'main', 'combat', 'postCombatMain', 'refresh', 'ended'
    turn: 1,
    currentPlayer: 1,
    gameStarted: false,
    players: {
      1: {
        name: 'Player 1',
        hand: [], // Cards in hand
        deck: [], // Draw pile
        field: [], // Where Familiars are played
        azothRow: [], // Where Azoth cards are placed as resources (face-up)
        lifeCards: [], // Top 4 cards face down, revealed as damage is taken
        flag: null, // Flag card placed in top left corner
        removedFromPlay: [], // Zone for cards affected by removal
        graveyard: [],
        selectedDeck: null,
      },
      2: {
        name: 'Player 2',
        hand: [],
        deck: [],
        field: [],
        azothRow: [],
        lifeCards: [],
        flag: null,
        removedFromPlay: [],
        graveyard: [],
        selectedDeck: null,
      },
    },
    selectedCard: null,
    targetMode: false,
    gameLog: [],
    currentPhaseActions: [], // Track what actions have been taken this phase
  });

  const [availableDecks, setAvailableDecks] = useState([]);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp', 'ai', 'tutorial'

  // Deck selection
  const selectDeck = (deck, playerId) => {
    const newGameState = { ...gameState };
    newGameState.players[playerId].selectedDeck = deck;
    setGameState(newGameState);
  };
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

  // Pre-Game Actions (Phase 0)
  const startPreGame = () => {
    if (
      !gameState.players[1].selectedDeck ||
      !gameState.players[2].selectedDeck
    ) {
      alert('Both players need to select a deck first!');
      return;
    }

    const newGameState = { ...gameState };

    // Initialize decks and shuffle
    Object.keys(newGameState.players).forEach(playerId => {
      const player = newGameState.players[playerId];
      const deckCards = [];

      player.selectedDeck.cards.forEach(card => {
        for (let i = 0; i < card.quantity; i++) {
          deckCards.push({
            ...card,
            id: `${card.id}_${i}`,
            rested: false,
            counters: 0,
          });
        }
      });

      // Thoroughly shuffle deck
      const shuffledDeck = deckCards.sort(() => Math.random() - 0.5);

      // Place Flag on top left corner (first card of deck becomes flag)
      player.flag = shuffledDeck.shift();

      // Place deck in top right corner
      player.deck = shuffledDeck;

      // Take top 4 cards and place face down as life cards (don't look at them)
      player.lifeCards = player.deck.splice(0, 4);

      // Reset all zones
      player.field = [];
      player.azothRow = [];
      player.removedFromPlay = [];
      player.graveyard = [];
      player.hand = [];
    });

    newGameState.phase = 'start';
    newGameState.turn = 1;
    newGameState.currentPlayer = 1;
    newGameState.gameStarted = true;
    newGameState.currentPhaseActions = [];
    newGameState.gameLog = [
      'Pre-Game Setup Complete!',
      'Flags placed, decks shuffled, life cards set.',
      'Starting Phase 1: Start Phase',
    ];

    setGameState(newGameState);
  };

  // Start Phase (Phase 1)
  const executeStartPhase = () => {
    const newGameState = { ...gameState };
    const currentPlayer = newGameState.players[newGameState.currentPlayer];

    // Draw 2 cards (only at start of game, turn 1)
    if (newGameState.turn === 1) {
      const drawnCards = currentPlayer.deck.splice(0, 2);
      currentPlayer.hand.push(...drawnCards);
      newGameState.gameLog.unshift(
        `${currentPlayer.name} draws 2 cards to start the game`,
      );
    } else {
      // Regular turns: no automatic draw in start phase
      newGameState.gameLog.unshift(`${currentPlayer.name}'s Start Phase`);
    }

    newGameState.currentPhaseActions = ['azothPlacement']; // Can optionally place 1 Azoth
    setGameState(newGameState);
  };

  // Place card as Azoth resource
  const placeAsAzoth = (card, playerId) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Remove from hand
    player.hand = player.hand.filter(c => c.id !== card.id);

    // Place face-up in Azoth Row
    const azothCard = { ...card, rested: false, isAzoth: true };
    player.azothRow.push(azothCard);

    newGameState.gameLog.unshift(
      `${player.name} places ${card.name} as Azoth resource`,
    );

    // Remove azoth placement action
    newGameState.currentPhaseActions = newGameState.currentPhaseActions.filter(
      action => action !== 'azothPlacement',
    );

    setGameState(newGameState);
  };

  // Move to Main Phase
  const moveToMainPhase = () => {
    const newGameState = { ...gameState };
    newGameState.phase = 'main';
    newGameState.currentPhaseActions = [
      'playCards',
      'summon',
      'tribute',
      'spell',
      'burst',
    ];
    newGameState.gameLog.unshift('Entering Main Phase');
    setGameState(newGameState);
  };

  // Main Phase Actions
  const summonFamiliar = (card, playerId, azothPaid = 0) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Check if player has enough unrested Azoth
    const availableAzoth = player.azothRow.filter(azoth => !azoth.rested);
    if (availableAzoth.length < azothPaid) {
      alert('Not enough unrested Azoth to pay for this summon!');
      return;
    }

    // Rest the required Azoth
    for (let i = 0; i < azothPaid; i++) {
      availableAzoth[i].rested = true;
    }

    // Remove card from hand
    player.hand = player.hand.filter(c => c.id !== card.id);

    // Summon with +1 counters equal to Azoth paid
    const summonedCard = {
      ...card,
      rested: false,
      counters: azothPaid,
      summoned: true,
    };
    player.field.push(summonedCard);

    // Draw a card after playing
    if (player.deck.length > 0) {
      player.hand.push(player.deck.shift());
    }

    newGameState.gameLog.unshift(
      `${player.name} summons ${card.name} with ${azothPaid} +1 counters`,
    );

    setGameState(newGameState);
  };

  const tributeSummon = (card, playerId, tributedFamiliars, azothPaid = 0) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Calculate tribute value
    let tributeValue = 0;
    tributedFamiliars.forEach(familiar => {
      // Combined Elements costs + counters
      const elementCost = familiar.elements ? familiar.elements.length : 0;
      tributeValue += elementCost + familiar.counters;
    });

    // Remove tributed familiars from game
    tributedFamiliars.forEach(familiar => {
      player.field = player.field.filter(f => f.id !== familiar.id);
      player.removedFromPlay.push(familiar);
    });

    // Calculate final cost after tribute reduction
    const originalCost = card.elements ? card.elements.length : 0;
    const finalCost = Math.max(0, originalCost - tributeValue);
    const actualAzothPaid = Math.max(azothPaid, finalCost);

    // Rest required Azoth
    const availableAzoth = player.azothRow.filter(azoth => !azoth.rested);
    for (let i = 0; i < actualAzothPaid; i++) {
      if (availableAzoth[i]) availableAzoth[i].rested = true;
    }

    // Remove card from hand and summon
    player.hand = player.hand.filter(c => c.id !== card.id);
    const summonedCard = {
      ...card,
      rested: false,
      counters: actualAzothPaid,
      summoned: true,
    };
    player.field.push(summonedCard);

    // Draw a card after playing
    if (player.deck.length > 0) {
      player.hand.push(player.deck.shift());
    }

    newGameState.gameLog.unshift(
      `${player.name} tribute summons ${card.name} (tributed ${tributedFamiliars.length} familiars)`,
    );

    setGameState(newGameState);
  };

  const castSpell = (card, playerId, azothPaid = 0) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Rest required Azoth
    const availableAzoth = player.azothRow.filter(azoth => !azoth.rested);
    for (let i = 0; i < azothPaid; i++) {
      if (availableAzoth[i]) availableAzoth[i].rested = true;
    }

    // Remove card from hand
    player.hand = player.hand.filter(c => c.id !== card.id);

    // Resolve spell effect (simplified - replace ✡︎⃝ with azothPaid)
    // Then put on bottom of deck
    player.deck.push(card);

    // Draw a card after playing
    if (player.deck.length > 0) {
      player.hand.push(player.deck.shift());
    }

    newGameState.gameLog.unshift(
      `${player.name} casts ${card.name} as spell (✡︎⃝ = ${azothPaid})`,
    );

    setGameState(newGameState);
  };

  const playBurst = (card, playerId) => {
    const newGameState = { ...gameState };
    const player = newGameState.players[playerId];

    // Burst: play for free when drawn from life cards
    const lifeCardsLeft = player.lifeCards.length;

    // Remove from hand (if it was added there from life cards)
    player.hand = player.hand.filter(c => c.id !== card.id);

    // ✡︎⃝ = number of life cards left (not including this card)
    const burstValue = lifeCardsLeft;

    // Keywords do not resolve for Burst
    const burstCard = {
      ...card,
      rested: false,
      counters: 0,
      burstValue: burstValue,
      keywordsDisabled: true,
    };

    // Can be played for free or put in hand
    player.field.push(burstCard);

    newGameState.gameLog.unshift(
      `${player.name} plays ${card.name} as Burst (✡︎⃝ = ${burstValue})`,
    );

    setGameState(newGameState);
  };

  // Combat Phase
  const moveToCombatPhase = () => {
    const newGameState = { ...gameState };
    newGameState.phase = 'combat';
    newGameState.currentPhaseActions = ['attack'];
    newGameState.gameLog.unshift('Entering Combat Phase');
    setGameState(newGameState);
  };

  const attackWithFamiliar = (familiar, attackerId) => {
    const newGameState = { ...gameState };
    const attacker = newGameState.players[attackerId];
    const defenderId = attackerId === 1 ? 2 : 1;
    const defender = newGameState.players[defenderId];

    // Familiar attacks individually
    // For now, simplified: damage goes to life cards
    const damage = (familiar.attack || 0) + familiar.counters;

    if (defender.lifeCards.length > 0) {
      // Reveal and remove life card
      const damagedCard = defender.lifeCards.shift();
      defender.graveyard.push(damagedCard);

      // Check if revealed card can be played as Burst
      newGameState.gameLog.unshift(
        `${familiar.name} attacks! ${defender.name} loses a life card: ${damagedCard.name}`,
      );

      // If defender has no life cards left, they lose
      if (defender.lifeCards.length === 0) {
        newGameState.phase = 'ended';
        newGameState.gameLog.unshift(
          `${attacker.name} wins! ${defender.name} has no life cards left.`,
        );
      }
    }

    setGameState(newGameState);
  };

  // Post-Combat Main Phase
  const moveToPostCombatMain = () => {
    const newGameState = { ...gameState };
    newGameState.phase = 'postCombatMain';
    newGameState.currentPhaseActions = ['playCards'];
    newGameState.gameLog.unshift('Entering Post-Combat Main Phase');
    setGameState(newGameState);
  };

  // Refresh Phase
  const moveToRefreshPhase = () => {
    const newGameState = { ...gameState };
    const currentPlayer = newGameState.players[newGameState.currentPlayer];

    // Refresh all rested Azoth sources (turn vertical)
    currentPlayer.azothRow.forEach(azoth => {
      azoth.rested = false;
    });

    newGameState.phase = 'refresh';
    newGameState.gameLog.unshift('Refresh Phase: All Azoth sources refreshed');

    setGameState(newGameState);
  };

  // End Turn and move to next player
  const endTurn = () => {
    const newGameState = { ...gameState };
    const nextPlayerId = newGameState.currentPlayer === 1 ? 2 : 1;
    const nextPlayer = newGameState.players[nextPlayerId];

    newGameState.currentPlayer = nextPlayerId;
    if (nextPlayerId === 1) {
      newGameState.turn++;
    }

    // Start next player's turn with Start Phase
    newGameState.phase = 'start';
    newGameState.currentPhaseActions = [];

    newGameState.gameLog.unshift(
      `Turn ${newGameState.turn}: ${nextPlayer.name}'s turn begins`,
    );

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
                      className="bg-green-600 rounded p-2 text-xs text-white cursor-pointer hover:bg-green-500 min-w-24"
                      onClick={() => setShowCardDetail(card)}
                    >
                      <div className="font-medium">{card.name}</div>
                      {card.counters > 0 && (
                        <div className="text-yellow-300">+{card.counters}</div>
                      )}
                      {card.attack && (
                        <div className="text-red-300">
                          ATK: {card.attack + (card.counters || 0)}
                        </div>
                      )}
                      {isCurrentPlayer && gameState.phase === 'combat' && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            attackWithFamiliar(card, playerId);
                          }}
                          className="mt-1 px-1 py-0.5 bg-red-700 rounded text-xs hover:bg-red-800"
                        >
                          Attack
                        </button>
                      )}
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
                    className={`rounded px-2 py-1 text-xs text-white transition-all ${
                      card.rested
                        ? 'bg-gray-500 transform rotate-90 opacity-60'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                    title={
                      card.rested ? 'Rested (used this turn)' : 'Available'
                    }
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
                onClick={() => setShowCardDetail(card)}
              >
                <div className="text-sm font-medium text-white">
                  {card.name}
                </div>
                <div className="text-xs text-gray-300">
                  Elements: {card.elements?.join('') || 'None'}
                </div>
                <div className="text-xs text-gray-300">
                  {card.counters > 0 && `+${card.counters} counters`}
                </div>

                {/* Card Action Buttons */}
                {isCurrentPlayer &&
                  (gameState.phase === 'main' ||
                    gameState.phase === 'postCombatMain') && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          summonFamiliar(card, playerId, 1);
                        }}
                        className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700"
                        title="Summon with 1 Azoth"
                      >
                        Summon
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          castSpell(card, playerId, 1);
                        }}
                        className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700"
                        title="Cast as Spell"
                      >
                        Spell
                      </button>
                    </div>
                  )}

                {/* Azoth Placement in Start Phase */}
                {isCurrentPlayer &&
                  gameState.phase === 'start' &&
                  gameState.currentPhaseActions.includes('azothPlacement') && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        placeAsAzoth(card, playerId);
                      }}
                      className="px-2 py-1 bg-purple-600 text-xs rounded hover:bg-purple-700 mt-2"
                      title="Place as Azoth resource"
                    >
                      Place Azoth
                    </button>
                  )}
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
          <span className="text-sm text-gray-400 capitalize">
            Phase: {gameState.phase}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-blue-400">
            {gameState.players[gameState.currentPlayer]?.name}'s Turn
          </span>
        </div>
      </div>

      {/* Phase Description */}
      <div className="mb-4 p-3 bg-gray-700 rounded">
        <div className="text-sm text-gray-300">
          {gameState.phase === 'setup' &&
            'Select decks for both players to begin the game.'}
          {gameState.phase === 'start' &&
            'Draw cards (first turn only) and optionally place 1 Azoth resource.'}
          {gameState.phase === 'main' &&
            'Play cards: Summon familiars, cast spells, or place Azoth resources.'}
          {gameState.phase === 'combat' &&
            'Attack with familiars individually. Each attack targets life cards.'}
          {gameState.phase === 'postCombatMain' &&
            'Play additional cards if resources allow.'}
          {gameState.phase === 'refresh' &&
            'All rested Azoth sources are refreshed (turned vertical).'}
          {gameState.phase === 'ended' &&
            'Game Over! One player has no life cards remaining.'}
        </div>
        {gameState.currentPhaseActions.length > 0 && (
          <div className="text-xs text-yellow-400 mt-1">
            Available actions: {gameState.currentPhaseActions.join(', ')}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Setup Phase */}
        {gameState.phase === 'setup' && (
          <button
            onClick={startPreGame}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Flag size={16} />
            <span>Start Pre-Game Setup</span>
          </button>
        )}

        {/* Start Phase */}
        {gameState.phase === 'start' && (
          <>
            <button
              onClick={executeStartPhase}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Play size={16} />
              <span>Execute Start Phase</span>
            </button>
            <button
              onClick={moveToMainPhase}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              <Target size={16} />
              <span>Move to Main Phase</span>
            </button>
          </>
        )}

        {/* Main Phase */}
        {gameState.phase === 'main' && (
          <>
            <button
              onClick={moveToCombatPhase}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <Swords size={16} />
              <span>Combat Phase</span>
            </button>
          </>
        )}

        {/* Combat Phase */}
        {gameState.phase === 'combat' && (
          <button
            onClick={moveToPostCombatMain}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            <Target size={16} />
            <span>Post-Combat Main</span>
          </button>
        )}

        {/* Post-Combat Main Phase */}
        {gameState.phase === 'postCombatMain' && (
          <button
            onClick={moveToRefreshPhase}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh Phase</span>
          </button>
        )}

        {/* Refresh Phase */}
        {gameState.phase === 'refresh' && (
          <button
            onClick={endTurn}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={16} />
            <span>End Turn</span>
          </button>
        )}

        {/* Universal Controls */}
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset Game</span>
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
                    gameState.players[playerId].selectedDeck?.id === deck.id
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
