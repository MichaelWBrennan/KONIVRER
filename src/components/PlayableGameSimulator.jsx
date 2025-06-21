import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize,
  Users,
  Clock,
  Target,
  Shield,
  Zap,
  Heart,
  Eye,
  EyeOff,
  SkipForward,
  MessageSquare,
  FileText,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

// Import game engine
import GameEngine from '../engine/GameEngine';
import AIPlayer from '../engine/AIPlayer';
import NetworkManager from '../engine/NetworkManager';

// Import sample card data
import cardsData from '../data/cards.json';

const PlayableGameSimulator = ({ mode = 'ai', onlineOptions = {} }) => {
  // Game engine and related objects
  const gameEngineRef = useRef(null);
  const aiPlayerRef = useRef(null);
  const networkManagerRef = useRef(null);

  // Game state
  const [gameState, setGameState] = useState(null);
  const [gamePhase, setGamePhase] = useState('setup'); // setup, playing, paused, ended
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedAzoth, setSelectedAzoth] = useState([]);
  const [targetMode, setTargetMode] = useState(false);
  const [targets, setTargets] = useState([]);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [gameLogFilter, setGameLogFilter] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('normal');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [playerName, setPlayerName] = useState('Player 1');
  const [opponentName, setOpponentName] = useState('AI Opponent');
  const [gameOptions, setGameOptions] = useState({
    deckSize: 40,
    startingLife: 4,
    startingHand: 7,
  });

  // Initialize game engine
  useEffect(() => {
    gameEngineRef.current = new GameEngine();

    // Set up event listeners
    gameEngineRef.current.on('gameStateUpdate', handleGameStateUpdate);
    gameEngineRef.current.on('gameInitialized', handleGameInitialized);
    gameEngineRef.current.on('gameStarted', handleGameStarted);
    gameEngineRef.current.on('gameOver', handleGameOver);

    // If AI mode, initialize AI player
    if (mode === 'ai') {
      aiPlayerRef.current = new AIPlayer({ difficulty: aiDifficulty });
      aiPlayerRef.current.setGameEngine(gameEngineRef.current);
    }

    // If online mode, initialize network manager
    if (mode === 'online') {
      networkManagerRef.current = new NetworkManager();

      // Set up network event listeners
      networkManagerRef.current.on('playerConnected', handlePlayerConnected);
      networkManagerRef.current.on('gameCreated', handleGameCreated);
      networkManagerRef.current.on('gameJoined', handleGameJoined);
      networkManagerRef.current.on(
        'gameStateUpdate',
        handleNetworkGameStateUpdate,
      );
      networkManagerRef.current.on('playerAction', handlePlayerAction);
      networkManagerRef.current.on('chatMessage', handleChatMessage);
      networkManagerRef.current.on('error', handleNetworkError);
      networkManagerRef.current.on('disconnected', handleDisconnected);
      networkManagerRef.current.on('reconnected', handleReconnected);
    }

    return () => {
      // Clean up
      if (mode === 'online' && networkManagerRef.current) {
        networkManagerRef.current.disconnect();
      }
    };
  }, [mode]);

  // Update AI difficulty when it changes
  useEffect(() => {
    if (mode === 'ai' && aiPlayerRef.current) {
      aiPlayerRef.current.setDifficulty(aiDifficulty);
    }
  }, [aiDifficulty, mode]);

  // Handle game state updates
  const handleGameStateUpdate = newGameState => {
    setGameState(newGameState);
  };

  // Handle game initialized event
  const handleGameInitialized = initialGameState => {
    setGameState(initialGameState);
    setGamePhase('setup');
  };

  // Handle game started event
  const handleGameStarted = startedGameState => {
    setGameState(startedGameState);
    setGamePhase('playing');
  };

  // Handle game over event
  const handleGameOver = ({ winner }) => {
    setGamePhase('ended');

    // Show winner message
    const winnerName = winner === 0 ? playerName : opponentName;
    addChatMessage('system', `Game Over! ${winnerName} has won the game.`);
  };

  // Network event handlers
  const handlePlayerConnected = data => {
    console.log('Connected as player:', data.playerId);
    setIsConnecting(false);
  };

  const handleGameCreated = data => {
    console.log('Game created:', data.gameId);
    addChatMessage('system', `Game created with ID: ${data.gameId}`);
  };

  const handleGameJoined = data => {
    console.log('Game joined:', data.gameId);
    addChatMessage('system', `Joined game with ID: ${data.gameId}`);

    // Update opponent name if provided
    if (data.opponentName) {
      setOpponentName(data.opponentName);
    }
  };

  const handleNetworkGameStateUpdate = newGameState => {
    setGameState(newGameState);

    // Update game phase based on state
    if (newGameState.phase === 'setup') {
      setGamePhase('setup');
    } else if (newGameState.winner !== null) {
      setGamePhase('ended');
    } else {
      setGamePhase('playing');
    }
  };

  const handlePlayerAction = data => {
    // This is handled by the game state update
    console.log('Player action:', data);
  };

  const handleChatMessage = data => {
    addChatMessage(data.playerName, data.message);
  };

  const handleNetworkError = data => {
    setErrorMessage(data.message);
    console.error('Network error:', data.message);
  };

  const handleDisconnected = data => {
    addChatMessage('system', `Disconnected from server: ${data.reason}`);
    setErrorMessage('Disconnected from server. Attempting to reconnect...');
  };

  const handleReconnected = () => {
    addChatMessage('system', 'Reconnected to server');
    setErrorMessage(null);
  };

  // Add a chat message
  const addChatMessage = (sender, message) => {
    setChatMessages(prev => [
      ...prev,
      {
        sender,
        message,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Send a chat message
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    if (mode === 'online' && networkManagerRef.current) {
      networkManagerRef.current.sendChatMessage(chatInput);
    }

    // In AI mode, just add the message locally
    addChatMessage(playerName, chatInput);

    // Add AI response in AI mode
    if (mode === 'ai') {
      setTimeout(() => {
        const aiResponses = [
          "I'm thinking about my next move...",
          'Interesting play!',
          "You won't defeat me that easily.",
          'I see your strategy.',
          "Hmm, that's a challenge.",
        ];
        const randomResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addChatMessage(opponentName, randomResponse);
      }, 1000);
    }

    setChatInput('');
  };

  // Start a new game
  const startNewGame = () => {
    // Generate sample decks
    const playerDeck = generateSampleDeck(gameOptions.deckSize);
    const opponentDeck = generateSampleDeck(gameOptions.deckSize);

    // Initialize game
    gameEngineRef.current.initializeGame({
      players: [
        { name: playerName, deck: playerDeck },
        { name: opponentName, deck: opponentDeck },
      ],
      isOnline: mode === 'online',
      isAI: mode === 'ai',
    });

    // Start game
    gameEngineRef.current.startGame();

    // Reset UI state
    setSelectedCard(null);
    setSelectedAzoth([]);
    setTargetMode(false);
    setTargets([]);
    setChatMessages([]);
    setErrorMessage(null);

    // Add initial message
    addChatMessage('system', 'Game started! Good luck!');
  };

  // Connect to online server
  const connectToServer = () => {
    if (!networkManagerRef.current) return;

    setIsConnecting(true);
    setErrorMessage(null);

    const { serverUrl } = onlineOptions;

    networkManagerRef.current
      .connect(serverUrl, playerName)
      .then(() => {
        addChatMessage('system', 'Connected to server');
      })
      .catch(error => {
        setErrorMessage(`Failed to connect: ${error.message}`);
        setIsConnecting(false);
      });
  };

  // Create an online game
  const createOnlineGame = () => {
    if (
      !networkManagerRef.current ||
      !networkManagerRef.current.isConnected()
    ) {
      setErrorMessage('Not connected to server');
      return;
    }

    networkManagerRef.current.createGame({
      deckSize: gameOptions.deckSize,
      startingLife: gameOptions.startingLife,
      startingHand: gameOptions.startingHand,
    });
  };

  // Join an online game
  const joinOnlineGame = gameId => {
    if (
      !networkManagerRef.current ||
      !networkManagerRef.current.isConnected()
    ) {
      setErrorMessage('Not connected to server');
      return;
    }

    networkManagerRef.current.joinGame(gameId);
  };

  // Process a player action
  const processAction = (actionType, actionData) => {
    try {
      if (mode === 'online' && networkManagerRef.current) {
        // Send action to server
        networkManagerRef.current.sendGameAction(actionType, actionData);
      } else {
        // Process locally
        gameEngineRef.current.processAction(0, actionType, actionData);
      }

      // Reset UI state after action
      if (actionType !== 'passPriority') {
        setSelectedCard(null);
        setSelectedAzoth([]);
        setTargetMode(false);
        setTargets([]);
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Action error:', error);
    }
  };

  // Handle card click
  const handleCardClick = (card, zone) => {
    // If in target mode, add as target
    if (targetMode) {
      setTargets(prev => [
        ...prev,
        {
          type: zone === 'field' ? 'creature' : zone,
          cardId: card.id,
          playerId: card.controller || 0, // Default to player 0 if not specified
        },
      ]);
      return;
    }

    // If card is in hand, select it
    if (zone === 'hand') {
      setSelectedCard(card);
      return;
    }

    // If card is in Azoth row and not tapped, toggle selection
    if (zone === 'azoth' && !card.tapped) {
      if (selectedAzoth.some(a => a.id === card.id)) {
        setSelectedAzoth(prev => prev.filter(a => a.id !== card.id));
      } else {
        setSelectedAzoth(prev => [...prev, card]);
      }
      return;
    }

    // If card is on field, select for ability or attack
    if (zone === 'field') {
      setSelectedCard(card);
      return;
    }
  };

  // Place a card as Azoth
  const placeAsAzoth = () => {
    if (!selectedCard) return;

    processAction('placeAzoth', {
      cardId: selectedCard.id,
    });
  };

  // Summon a Familiar
  const summonFamiliar = () => {
    if (!selectedCard || selectedCard.type !== 'Familiar') return;
    if (selectedAzoth.length < selectedCard.cost) {
      setErrorMessage(
        `Not enough Azoth selected. Need ${selectedCard.cost}, selected ${selectedAzoth.length}`,
      );
      return;
    }

    processAction('summonFamiliar', {
      cardId: selectedCard.id,
      azothPaid: selectedAzoth.map(a => a.id),
    });
  };

  // Cast a Spell
  const castSpell = () => {
    if (!selectedCard || selectedCard.type !== 'Spell') return;
    if (selectedAzoth.length < selectedCard.cost) {
      setErrorMessage(
        `Not enough Azoth selected. Need ${selectedCard.cost}, selected ${selectedAzoth.length}`,
      );
      return;
    }

    // If spell requires targets, enter target mode
    if (selectedCard.requiresTarget && targets.length === 0) {
      setTargetMode(true);
      return;
    }

    processAction('castSpell', {
      cardId: selectedCard.id,
      azothPaid: selectedAzoth.map(a => a.id),
      targets,
    });
  };

  // Declare attack
  const declareAttack = () => {
    if (!selectedCard) {
      setErrorMessage('No creature selected for attack');
      return;
    }

    processAction('declareAttack', {
      attackers: [selectedCard.id],
    });
  };

  // Declare block
  const declareBlock = () => {
    if (!selectedCard || !gameState) {
      setErrorMessage('No creature selected for blocking');
      return;
    }

    // Find an attacking creature to block
    const attackingPlayer = gameState.players[1 - gameState.activePlayer];
    const attackers = attackingPlayer.field.filter(card => card.attacking);

    if (attackers.length === 0) {
      setErrorMessage('No attackers to block');
      return;
    }

    // For simplicity, just block the first attacker
    processAction('declareBlock', {
      blockers: [
        {
          blocker: selectedCard.id,
          attacker: attackers[0].id,
        },
      ],
    });
  };

  // Activate ability
  const activateAbility = abilityIndex => {
    if (
      !selectedCard ||
      !selectedCard.abilities ||
      !selectedCard.abilities[abilityIndex]
    ) {
      setErrorMessage('No valid ability selected');
      return;
    }

    const ability = selectedCard.abilities[abilityIndex];

    // If ability requires targets, enter target mode
    if (ability.requiresTarget && targets.length === 0) {
      setTargetMode(true);
      return;
    }

    processAction('activateAbility', {
      cardId: selectedCard.id,
      abilityIndex,
      targets,
    });
  };

  // Pass priority
  const passPriority = () => {
    processAction('passPriority', {});
  };

  // End phase
  const endPhase = () => {
    processAction('endPhase', {});
  };

  // End turn
  const endTurn = () => {
    processAction('endTurn', {});
  };

  // Cancel target mode
  const cancelTargetMode = () => {
    setTargetMode(false);
    setTargets([]);
  };

  // Confirm targets
  const confirmTargets = () => {
    if (targets.length === 0) {
      setErrorMessage('No targets selected');
      return;
    }

    setTargetMode(false);

    // Continue with the action that required targets
    if (selectedCard.type === 'Spell') {
      castSpell();
    } else if (selectedCard.abilities) {
      // Find the ability that requires targets
      const abilityIndex = selectedCard.abilities.findIndex(
        a => a.requiresTarget,
      );
      if (abilityIndex !== -1) {
        activateAbility(abilityIndex);
      }
    }
  };

  // Generate a sample deck
  const generateSampleDeck = (size = 40) => {
    const deck = [];

    // Use cards from cardsData
    const availableCards = cardsData.slice(0, 20); // Use first 20 cards

    for (let i = 0; i < size; i++) {
      const randomCard =
        availableCards[Math.floor(Math.random() * availableCards.length)];
      deck.push({
        ...randomCard,
        id: `${randomCard.id}_${i}`, // Make ID unique
      });
    }

    return deck;
  };

  // Card component
  const GameCard = ({
    card,
    zone,
    onClick,
    className = '',
    showCount = false,
    isSelected = false,
  }) => {
    const isCardBack = !card.name || zone === 'deck';

    return (
      <motion.div
        className={`relative cursor-pointer ${className} ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
        onClick={() => onClick && onClick(card, zone)}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={
            isCardBack
              ? 'https://images.talishar.net/public/cardsquares/english/CardBack.webp'
              : card.image ||
                'https://images.talishar.net/public/cardsquares/english/CardBack.webp'
          }
          alt={card.name || 'Card Back'}
          className="w-full h-full object-cover rounded border border-gray-600"
          onMouseEnter={() => !isCardBack && setShowCardDetail(card)}
          onMouseLeave={() => setShowCardDetail(null)}
        />
        {showCount && card.count && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {card.count}
          </div>
        )}
        {card.counters && card.counters > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {card.counters}
          </div>
        )}
        {card.tapped && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">TAPPED</span>
          </div>
        )}
        {card.attacking && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 rounded-br">
            ATK
          </div>
        )}
        {card.blocking && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
            BLK
          </div>
        )}
        {targetMode && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border border-blue-500 rounded">
            <div className="absolute top-1 right-1">
              <Target className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Player area component
  const PlayerArea = ({ player, isOpponent = false }) => {
    if (!gameState || !player) return null;

    const playerData = gameState.players[isOpponent ? 1 : 0];

    return (
      <div
        className={`flex ${isOpponent ? 'flex-col' : 'flex-col-reverse'} gap-2`}
      >
        {/* Player name and life */}
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
          <span className="font-bold text-white">{playerData.name}</span>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-white font-bold">
              {playerData.lifeCards.length}
            </span>
          </div>
        </div>

        {/* Azoth Row */}
        <div className="flex gap-1 min-h-16">
          {playerData.azothRow.map((card, index) => (
            <div key={card.id} className="w-12 h-16">
              <GameCard
                card={card}
                zone="azoth"
                onClick={!isOpponent ? handleCardClick : undefined}
                isSelected={selectedAzoth.some(a => a.id === card.id)}
              />
            </div>
          ))}
        </div>

        {/* Field */}
        <div className="flex gap-1 min-h-16">
          {playerData.field.map((card, index) => (
            <div key={card.id} className="w-12 h-16">
              <GameCard
                card={card}
                zone="field"
                onClick={!isOpponent ? handleCardClick : undefined}
                isSelected={selectedCard && selectedCard.id === card.id}
              />
            </div>
          ))}
        </div>

        {/* Hand (only for current player) */}
        {!isOpponent && (
          <div className="flex gap-1">
            {playerData.hand.map((card, index) => (
              <div key={card.id} className="w-12 h-16">
                <GameCard
                  card={card}
                  zone="hand"
                  onClick={handleCardClick}
                  isSelected={selectedCard && selectedCard.id === card.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Deck and Life Cards */}
        <div className="flex gap-1">
          <div className="w-12 h-16">
            <GameCard
              card={{ count: playerData.deck.length }}
              zone="deck"
              showCount={true}
            />
          </div>
          <div className="w-12 h-16">
            <GameCard
              card={{ count: playerData.lifeCards.length, name: 'Life Cards' }}
              zone="life"
              showCount={true}
            />
          </div>
          {playerData.graveyard.length > 0 && (
            <div className="w-12 h-16">
              <GameCard
                card={{
                  ...playerData.graveyard[playerData.graveyard.length - 1],
                  count: playerData.graveyard.length,
                }}
                zone="graveyard"
                showCount={true}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Game setup UI
  const renderGameSetup = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
    >
      <h2 className="text-2xl font-bold mb-4">Game Setup</h2>

      {mode === 'ai' ? (
        <>
          <p className="text-gray-300 mb-6">
            Play against an AI opponent with adjustable difficulty.
          </p>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full max-w-xs"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">AI Difficulty</label>
            <select
              value={aiDifficulty}
              onChange={e => setAiDifficulty(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full max-w-xs"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={startNewGame}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Play size={20} />
            <span>Start Game</span>
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-300 mb-6">
            Play against other players online.
          </p>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded w-full max-w-xs"
            />
          </div>

          {!networkManagerRef.current?.isConnected() ? (
            <button
              onClick={connectToServer}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto disabled:bg-gray-600"
            >
              <Users size={20} />
              <span>
                {isConnecting ? 'Connecting...' : 'Connect to Server'}
              </span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={createOnlineGame}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Create Game</span>
                </button>

                <button
                  onClick={() => joinOnlineGame(prompt('Enter Game ID:'))}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Users size={20} />
                  <span>Join Game</span>
                </button>
              </div>

              <p className="text-green-400">Connected to server</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  // Game playing UI
  const renderGamePlaying = () => (
    <div className="flex flex-col h-full">
      {/* Top UI Bar */}
      <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setFullscreen(!fullscreen)}
          >
            <Maximize className="w-4 h-4" />
            Fullscreen
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            Sound
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-300">
            {gameState && `Turn ${gameState.turn} - ${gameState.phase}`}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>0:30</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex">
        {/* Game Board */}
        <div className="flex-1 p-4 relative">
          {/* Opponent Area */}
          <div className="mb-8">
            <PlayerArea player={gameState?.players[1]} isOpponent={true} />
          </div>

          {/* Center Area - Combat/Stack */}
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gray-800 rounded-lg p-4 min-w-64">
              <div className="text-center">
                <div className="text-lg font-bold mb-2">
                  {gameState &&
                    `${gameState.players[gameState.currentPlayer].name}'s Turn`}
                </div>
                <div className="text-sm text-gray-400">
                  {gameState && `Phase: ${gameState.phase}`}
                </div>
              </div>

              {/* Selected card */}
              {selectedCard && (
                <div className="mt-4">
                  <div className="w-24 h-32 mx-auto">
                    <GameCard card={selectedCard} />
                  </div>
                  <div className="mt-2 text-center text-sm">
                    {selectedCard.name}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 space-y-2">
                {gameState && gameState.activePlayer === 0 && (
                  <>
                    {selectedCard && selectedCard.type === 'Familiar' && (
                      <button
                        onClick={summonFamiliar}
                        className="w-full px-3 py-2 bg-green-600 rounded hover:bg-green-700"
                      >
                        Summon Familiar
                      </button>
                    )}

                    {selectedCard && selectedCard.type === 'Spell' && (
                      <button
                        onClick={castSpell}
                        className="w-full px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Cast Spell
                      </button>
                    )}

                    {selectedCard && selectedCard.zone === 'hand' && (
                      <button
                        onClick={placeAsAzoth}
                        className="w-full px-3 py-2 bg-purple-600 rounded hover:bg-purple-700"
                      >
                        Place as Azoth
                      </button>
                    )}

                    {gameState.phase === 'combat' &&
                      selectedCard &&
                      selectedCard.zone === 'field' && (
                        <button
                          onClick={declareAttack}
                          className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700"
                        >
                          Declare Attack
                        </button>
                      )}

                    {gameState.phase === 'combat-blocks' &&
                      selectedCard &&
                      selectedCard.zone === 'field' && (
                        <button
                          onClick={declareBlock}
                          className="w-full px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Declare Block
                        </button>
                      )}

                    <button
                      onClick={passPriority}
                      className="w-full px-3 py-2 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      Pass Priority
                    </button>

                    <button
                      onClick={endPhase}
                      className="w-full px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                      End Phase
                    </button>

                    {gameState.currentPlayer === 0 && (
                      <button
                        onClick={endTurn}
                        className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700"
                      >
                        End Turn
                      </button>
                    )}
                  </>
                )}

                {gameState && gameState.activePlayer !== 0 && (
                  <div className="text-center text-yellow-400 py-2">
                    Waiting for opponent...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Player Area */}
          <div>
            <PlayerArea player={gameState?.players[0]} isOpponent={false} />
          </div>

          {/* Target mode overlay */}
          {targetMode && (
            <div className="absolute inset-0 bg-blue-900 bg-opacity-30 flex items-center justify-center">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold mb-2">Select Targets</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Click on cards to target them
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={confirmTargets}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    Confirm ({targets.length})
                  </button>
                  <button
                    onClick={cancelTargetMode}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Game Log */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2 mb-2">
                <button
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'All' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('All')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'Chat' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('Chat')}
                >
                  Chat
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm ${gameLogFilter === 'Log' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => setGameLogFilter('Log')}
                >
                  Log
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {gameState &&
                gameLogFilter !== 'Chat' &&
                gameState.gameLog.map((entry, index) => (
                  <div key={`log-${index}`} className="text-sm">
                    <span
                      className={`
                    ${entry.type === 'game' ? 'text-yellow-400' : ''}
                    ${entry.type === 'phase' ? 'text-blue-400' : ''}
                    ${entry.type === 'action' ? 'text-green-400' : ''}
                    ${entry.type === 'damage' ? 'text-red-400' : ''}
                  `}
                    >
                      {entry.text}
                    </span>
                  </div>
                ))}

              {gameLogFilter !== 'Log' &&
                chatMessages.map((msg, index) => (
                  <div key={`chat-${index}`} className="text-sm">
                    <span
                      className={`font-bold ${msg.sender === 'system' ? 'text-yellow-400' : 'text-blue-400'}`}
                    >
                      {msg.sender}:
                    </span>{' '}
                    <span className="text-gray-300">{msg.message}</span>
                  </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                />
                <button
                  onClick={sendChatMessage}
                  className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Detail Popup */}
      <AnimatePresence>
        {showCardDetail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs z-50"
          >
            <h3 className="font-bold text-lg mb-1">{showCardDetail.name}</h3>
            <div className="text-sm text-gray-300 mb-2">
              {showCardDetail.type}{' '}
              {showCardDetail.cost && `- Cost: ${showCardDetail.cost}`}
            </div>
            {showCardDetail.power !== undefined && (
              <div className="text-sm mb-2">
                <span className="text-red-400">
                  Power: {showCardDetail.power}
                </span>
                {showCardDetail.toughness !== undefined && (
                  <span className="text-blue-400 ml-2">
                    Toughness: {showCardDetail.toughness}
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-gray-300">{showCardDetail.text}</p>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Game Settings</h2>
                <button onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Sound</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setSoundEnabled(true)}
                      className={`px-4 py-2 rounded-l ${soundEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      On
                    </button>
                    <button
                      onClick={() => setSoundEnabled(false)}
                      className={`px-4 py-2 rounded-r ${!soundEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Off
                    </button>
                  </div>
                </div>

                {mode === 'ai' && (
                  <div>
                    <label className="block text-gray-300 mb-2">
                      AI Difficulty
                    </label>
                    <select
                      value={aiDifficulty}
                      onChange={e => setAiDifficulty(e.target.value)}
                      className="bg-gray-700 text-white px-4 py-2 rounded w-full"
                    >
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setGamePhase('setup');
                    }}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    Quit Game
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          >
            <AlertTriangle className="w-5 h-5" />
            <div className="flex-1">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)}>
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Game ended UI
  const renderGameEnded = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
    >
      <h2 className="text-2xl font-bold mb-4">Game Over</h2>

      {gameState && gameState.winner !== null && (
        <p className="text-2xl text-yellow-400 mb-6">
          {gameState.players[gameState.winner].name} Wins!
        </p>
      )}

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setGamePhase('setup')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw size={20} />
          <span>New Game</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {gamePhase === 'setup' && renderGameSetup()}
      {gamePhase === 'playing' && renderGamePlaying()}
      {gamePhase === 'ended' && renderGameEnded()}
    </div>
  );
};

export default PlayableGameSimulator;
