import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Heart,
  MessageSquare,
  Volume2,
  VolumeX,
  AlertTriangle,
  Users,
  Gamepad2,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import GameBoard from '../components/game/GameBoard';
import GameEngine from '../engine/GameEngine';
import AIPlayer from '../engine/AIPlayer';
import NetworkManager from '../engine/NetworkManager';

// Import sample card data
import cardsData from '../data/cards.json';

/**
 * Game page that initializes the game engine and renders the game board
 * Incorporates functionality from both GamePage and PlayableGameSimulator
 */
const GamePage = () => {
  const { gameId, mode } = useParams();
  const navigate = useNavigate();

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

  // Player data
  const [playerData, setPlayerData] = useState({
    name: 'Player',
    avatarUrl: null,
    deck: [],
    hand: [],
    field: [],
    azothRow: [],
    lifeCards: [],
    graveyard: [],
  });

  // Opponent data
  const [opponentData, setOpponentData] = useState({
    name: mode === 'ai' ? 'AI Opponent' : 'Opponent',
    avatarUrl: null,
    deck: [],
    hand: [],
    field: [],
    azothRow: [],
    lifeCards: [],
    graveyard: [],
  });

  const [isSpectator, setIsSpectator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Game options
  const [gameOptions, setGameOptions] = useState({
    deckSize: 40,
    startingLife: 4,
    startingHand: 7,
  });

  // Initialize game engine
  useEffect(() => {
    // Create game engine
    gameEngineRef.current = new GameEngine();

    // Set up event listeners
    gameEngineRef.current.on('gameStateUpdate', handleGameStateUpdate);
    gameEngineRef.current.on('gameInitialized', handleGameInitialized);
    gameEngineRef.current.on('gameStarted', handleGameStarted);
    gameEngineRef.current.on('gameOver', handleGameOver);

    // Initialize based on game mode
    switch (mode) {
      case 'ai':
        // AI game mode
        aiPlayerRef.current = new AIPlayer({ difficulty: aiDifficulty });
        aiPlayerRef.current.setGameEngine(gameEngineRef.current);

        // Set opponent data
        setOpponentData(prev => ({
          ...prev,
          name: 'AI Opponent',
        }));
        break;

      case 'online':
        // Online multiplayer mode
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

        // If gameId is provided, connect to existing game
        if (gameId) {
          connectToGame(gameId);
        }
        break;

      case 'spectate':
        // Spectator mode
        if (!gameId) {
          setError('Game ID is required for spectator mode');
          setLoading(false);
          return;
        }

        networkManagerRef.current = new NetworkManager();

        // Set up network event listeners
        networkManagerRef.current.on(
          'gameStateUpdate',
          handleNetworkGameStateUpdate,
        );
        networkManagerRef.current.on('chatMessage', handleChatMessage);
        networkManagerRef.current.on('error', handleNetworkError);

        // Connect as spectator
        connectAsSpectator(gameId);

        // Set spectator mode
        setIsSpectator(true);
        break;

      default:
        setError(`Unknown game mode: ${mode}`);
        setLoading(false);
        return;
    }

    // Cleanup function
    return () => {
      // Clean up event listeners
      if (gameEngineRef.current) {
        gameEngineRef.current.removeAllListeners();
      }

      // Clean up network connection
      if (networkManagerRef.current) {
        networkManagerRef.current.disconnect();
      }
    };
  }, [mode, gameId]);

  // Update AI difficulty when it changes
  useEffect(() => {
    if (mode === 'ai' && aiPlayerRef.current) {
      aiPlayerRef.current.setDifficulty(aiDifficulty);
    }
  }, [aiDifficulty, mode]);

  // Handle game state update
  const handleGameStateUpdate = newGameState => {
    setGameState(newGameState);

    // Update player and opponent data
    if (newGameState && newGameState.players) {
      const playerIndex = isSpectator ? 0 : 0; // Player is always index 0 unless spectating
      const opponentIndex = isSpectator ? 1 : 1; // Opponent is always index 1 unless spectating

      setPlayerData(prev => ({
        ...prev,
        deck: newGameState.players[playerIndex].deck || [],
        hand: newGameState.players[playerIndex].hand || [],
        field: newGameState.players[playerIndex].field || [],
        azothRow: newGameState.players[playerIndex].azothRow || [],
        lifeCards: newGameState.players[playerIndex].lifeCards || [],
        graveyard: newGameState.players[playerIndex].graveyard || [],
      }));

      setOpponentData(prev => ({
        ...prev,
        deck: newGameState.players[opponentIndex].deck || [],
        hand: newGameState.players[opponentIndex].hand || [],
        field: newGameState.players[opponentIndex].field || [],
        azothRow: newGameState.players[opponentIndex].azothRow || [],
        lifeCards: newGameState.players[opponentIndex].lifeCards || [],
        graveyard: newGameState.players[opponentIndex].graveyard || [],
      }));
    }
  };

  // Handle game initialized event
  const handleGameInitialized = initialGameState => {
    setGameState(initialGameState);
    setGamePhase('setup');
    setLoading(false);
  };

  // Handle game started event
  const handleGameStarted = startedGameState => {
    setGameState(startedGameState);
    setGamePhase('playing');
    setLoading(false);
  };

  // Handle game over event
  const handleGameOver = result => {
    setGamePhase('ended');

    // Navigate to results page after a delay
    setTimeout(() => {
      navigate(`/game-results/${result.winner === 0 ? 'win' : 'loss'}`, {
        state: { gameData: result },
      });
    }, 3000);
  };

  // Network event handlers
  const handlePlayerConnected = playerInfo => {
    setChatMessages(prev => [
      ...prev,
      { type: 'system', text: `${playerInfo.name} has connected.` },
    ]);

    // Update opponent data if this is the second player
    if (playerInfo.id !== networkManagerRef.current.getPlayerId()) {
      setOpponentData(prev => ({
        ...prev,
        name: playerInfo.name,
        avatarUrl: playerInfo.avatarUrl,
      }));
    }
  };

  const handleGameCreated = gameInfo => {
    setChatMessages(prev => [
      ...prev,
      { type: 'system', text: `Game created with ID: ${gameInfo.gameId}` },
    ]);

    // Update URL with game ID without reloading
    window.history.pushState({}, '', `/game/online/${gameInfo.gameId}`);
  };

  const handleGameJoined = gameInfo => {
    setChatMessages(prev => [
      ...prev,
      { type: 'system', text: `Joined game with ID: ${gameInfo.gameId}` },
    ]);

    // Update player data
    const players = gameInfo.players || [];
    if (players.length >= 2) {
      const playerIndex = players.findIndex(
        p => p.id === networkManagerRef.current.getPlayerId(),
      );
      const opponentIndex = playerIndex === 0 ? 1 : 0;

      setPlayerData(prev => ({
        ...prev,
        name: players[playerIndex].name,
        avatarUrl: players[playerIndex].avatarUrl,
      }));

      setOpponentData(prev => ({
        ...prev,
        name: players[opponentIndex].name,
        avatarUrl: players[opponentIndex].avatarUrl,
      }));
    }
  };

  const handleNetworkGameStateUpdate = newGameState => {
    handleGameStateUpdate(newGameState);
  };

  const handlePlayerAction = action => {
    // Handle opponent actions
    if (action.playerId !== networkManagerRef.current.getPlayerId()) {
      // Add to game log
      setChatMessages(prev => [
        ...prev,
        {
          type: 'action',
          text: `${opponentData.name} ${getActionDescription(action)}`,
        },
      ]);
    }
  };

  const handleChatMessage = message => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleNetworkError = error => {
    setErrorMessage(error.message || 'Network error occurred');
    setIsConnecting(false);
  };

  const handleDisconnected = () => {
    setChatMessages(prev => [
      ...prev,
      {
        type: 'system',
        text: 'Disconnected from server. Attempting to reconnect...',
      },
    ]);
  };

  const handleReconnected = () => {
    setChatMessages(prev => [
      ...prev,
      { type: 'system', text: 'Reconnected to server.' },
    ]);
  };

  // Helper function to get action description
  const getActionDescription = action => {
    switch (action.type) {
      case 'placeAzoth':
        return `placed ${action.card.name} as Azoth`;
      case 'summonFamiliar':
        return `summoned ${action.card.name}`;
      case 'castSpell':
        return `cast ${action.card.name}`;
      case 'declareAttack':
        return `declared ${action.attackers.length} attackers`;
      case 'declareBlock':
        return `declared ${action.blockers.length} blockers`;
      case 'activateAbility':
        return `activated an ability of ${action.card.name}`;
      case 'passPriority':
        return `passed priority`;
      default:
        return `performed an action: ${action.type}`;
    }
  };

  // Connect to an existing game
  const connectToGame = async gameId => {
    if (!networkManagerRef.current) return;

    setIsConnecting(true);
    setErrorMessage(null);

    try {
      await networkManagerRef.current.connect(gameId);
      setIsConnecting(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect to game');
      setIsConnecting(false);
    }
  };

  // Connect as spectator
  const connectAsSpectator = async gameId => {
    if (!networkManagerRef.current) return;

    setIsConnecting(true);
    setErrorMessage(null);

    try {
      await networkManagerRef.current.connectAsSpectator(gameId);

      // Get player info
      const players = networkManagerRef.current.getPlayerInfo();
      if (players && players.length >= 2) {
        setPlayerData(prev => ({
          ...prev,
          name: players[0].name,
          avatarUrl: players[0].avatarUrl,
        }));

        setOpponentData(prev => ({
          ...prev,
          name: players[1].name,
          avatarUrl: players[1].avatarUrl,
        }));
      }

      setIsConnecting(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to connect as spectator');
      setIsConnecting(false);
    }
  };

  // Start a new game
  const startGame = () => {
    if (!gameEngineRef.current) return;

    // Generate player deck
    const playerDeck = generateDeck(gameOptions.deckSize);

    // Generate opponent deck
    const opponentDeck =
      mode === 'ai'
        ? generateAIDeck(gameOptions.deckSize, aiDifficulty)
        : playerDeck; // In online mode, opponent will provide their own deck

    // Initialize game
    gameEngineRef.current.initializeGame({
      players: [
        { name: playerData.name, deck: playerDeck },
        { name: opponentData.name, deck: opponentDeck },
      ],
      isOnline: mode === 'online',
      isAI: mode === 'ai',
    });

    // Start game
    gameEngineRef.current.startGame();
  };

  // Generate a random deck
  const generateDeck = size => {
    // In a real implementation, this would use the player's saved deck
    // For now, generate a random deck from the available cards
    const deck = [];
    const availableCards = [...cardsData];

    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const card = availableCards[randomIndex];
      deck.push({
        id: `${card.id}-${i}`,
        ...card,
      });
    }

    return deck;
  };

  // Generate an AI deck
  const generateAIDeck = (size, difficulty) => {
    // In a real implementation, this would generate a deck based on AI difficulty
    // For now, just generate a random deck
    return generateDeck(size);
  };

  // Render game setup screen
  const renderGameSetup = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Game Setup</h2>

          {/* Player Name */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              value={playerData.name}
              onChange={e =>
                setPlayerData(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>

          {/* Game Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Game Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Deck Size</label>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setGameOptions(prev => ({
                        ...prev,
                        deckSize: Math.max(20, prev.deckSize - 5),
                      }))
                    }
                    className="bg-gray-700 text-white p-2 rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="bg-gray-600 text-white px-4 py-2">
                    {gameOptions.deckSize}
                  </span>
                  <button
                    onClick={() =>
                      setGameOptions(prev => ({
                        ...prev,
                        deckSize: Math.min(60, prev.deckSize + 5),
                      }))
                    }
                    className="bg-gray-700 text-white p-2 rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  Starting Life
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setGameOptions(prev => ({
                        ...prev,
                        startingLife: Math.max(1, prev.startingLife - 1),
                      }))
                    }
                    className="bg-gray-700 text-white p-2 rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="bg-gray-600 text-white px-4 py-2">
                    {gameOptions.startingLife}
                  </span>
                  <button
                    onClick={() =>
                      setGameOptions(prev => ({
                        ...prev,
                        startingLife: Math.min(10, prev.startingLife + 1),
                      }))
                    }
                    className="bg-gray-700 text-white p-2 rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Difficulty (AI mode only) */}
          {mode === 'ai' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">AI Difficulty</h3>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'normal', 'hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setAiDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      aiDifficulty === difficulty
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Online Game Options (Online mode only) */}
          {mode === 'online' && !gameId && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Online Game</h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => createGame()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Create New Game
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Game ID"
                    value={gameId || ''}
                    onChange={e => {
                      // Update URL with game ID without reloading
                      window.history.pushState(
                        {},
                        '',
                        `/game/online/${e.target.value}`,
                      );
                    }}
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                  <button
                    onClick={() => connectToGame(gameId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Join Game
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Game Button */}
          <div className="mt-8">
            <button
              onClick={startGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Connecting...
                </>
              ) : (
                <>
                  Start Game
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  // Render game playing screen
  const renderGamePlaying = () => {
    return (
      <div className="h-full w-full overflow-hidden">
        <GameBoard
          gameEngine={gameEngineRef.current}
          gameState={gameState}
          playerData={playerData}
          opponentData={opponentData}
          isSpectator={isSpectator}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          selectedAzoth={selectedAzoth}
          setSelectedAzoth={setSelectedAzoth}
          targetMode={targetMode}
          setTargetMode={setTargetMode}
          targets={targets}
          setTargets={setTargets}
          showCardDetail={showCardDetail}
          setShowCardDetail={setShowCardDetail}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onSendChat={message => {
            if (networkManagerRef.current) {
              networkManagerRef.current.sendChatMessage(message);
            }
          }}
        />
      </div>
    );
  };

  // Render game ended screen
  const renderGameEnded = () => {
    const winner =
      gameState?.winner === 0 ? playerData.name : opponentData.name;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Game Over</h2>
          <p className="text-xl mb-6">
            {gameState?.winner === 0 ? 'You won!' : 'You lost!'}
          </p>
          <p className="text-gray-400 mb-8">{winner} is victorious!</p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Return to Home
            </button>
            <button
              onClick={() => {
                setGamePhase('setup');
                setGameState(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Create a new online game
  const createGame = async () => {
    if (!networkManagerRef.current) return;

    setIsConnecting(true);
    setErrorMessage(null);

    try {
      await networkManagerRef.current.createGame({
        playerName: playerData.name,
        gameOptions,
      });
      setIsConnecting(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create game');
      setIsConnecting(false);
    }
  };

  // Show loading screen
  if (loading && gamePhase !== 'setup') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Loading Game...</h2>
          <p className="text-gray-400 mt-2">Preparing your battle</p>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error && gamePhase !== 'setup') {
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
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {gamePhase === 'setup' && renderGameSetup()}
      {gamePhase === 'playing' && renderGamePlaying()}
      {gamePhase === 'ended' && renderGameEnded()}
    </div>
  );
};

export default GamePage;
