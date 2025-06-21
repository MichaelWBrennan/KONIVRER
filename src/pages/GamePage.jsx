import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameBoard from '../components/game/GameBoard';
import GameEngine from '../engine/GameEngine';
import AIPlayer from '../engine/AIPlayer';
import NetworkManager from '../engine/NetworkManager';

/**
 * Game page that initializes the game engine and renders the game board
 */
const GamePage = () => {
  const { gameId, mode } = useParams();
  const navigate = useNavigate();
  
  const [gameEngine, setGameEngine] = useState(null);
  const [playerData, setPlayerData] = useState({
    name: 'Player',
    avatarUrl: null
  });
  const [opponentData, setOpponentData] = useState({
    name: 'Opponent',
    avatarUrl: null
  });
  const [isSpectator, setIsSpectator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize game engine based on mode
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);
        
        // Create game engine
        const engine = new GameEngine();
        
        // Initialize based on game mode
        switch (mode) {
          case 'ai':
            // AI game mode
            const aiPlayer = new AIPlayer(engine, 1);
            engine.setAIOpponent(aiPlayer);
            
            // Load player deck
            const playerDeck = JSON.parse(localStorage.getItem('playerDeck')) || [];
            if (playerDeck.length === 0) {
              throw new Error('No player deck found. Please create a deck first.');
            }
            
            // Load AI deck
            const aiDeck = await fetchAIDeck();
            
            // Initialize game with decks
            await engine.initializeGame(playerDeck, aiDeck);
            
            // Set opponent data
            setOpponentData({
              name: 'AI Opponent',
              avatarUrl: null
            });
            break;
            
          case 'online':
            // Online multiplayer mode
            if (!gameId) {
              throw new Error('Game ID is required for online mode');
            }
            
            // Create network manager
            const networkManager = new NetworkManager(engine);
            
            // Connect to game
            await networkManager.connect(gameId);
            
            // Set opponent data from network
            const opponentInfo = networkManager.getOpponentInfo();
            setOpponentData({
              name: opponentInfo.name,
              avatarUrl: opponentInfo.avatarUrl
            });
            break;
            
          case 'spectate':
            // Spectator mode
            if (!gameId) {
              throw new Error('Game ID is required for spectator mode');
            }
            
            // Create network manager
            const spectatorNetwork = new NetworkManager(engine);
            
            // Connect as spectator
            await spectatorNetwork.connectAsSpectator(gameId);
            
            // Set player data
            const players = spectatorNetwork.getPlayerInfo();
            setPlayerData({
              name: players[0].name,
              avatarUrl: players[0].avatarUrl
            });
            setOpponentData({
              name: players[1].name,
              avatarUrl: players[1].avatarUrl
            });
            
            // Set spectator mode
            setIsSpectator(true);
            break;
            
          default:
            throw new Error(`Unknown game mode: ${mode}`);
        }
        
        // Set up game end handler
        engine.on('gameEnd', (result) => {
          // Navigate to results page after game ends
          navigate(`/game-results/${result.winner === 0 ? 'win' : 'loss'}`, {
            state: { gameData: result }
          });
        });
        
        // Set game engine
        setGameEngine(engine);
        setLoading(false);
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
    };
  }, [gameId, mode, navigate]);
  
  // Fetch AI deck
  const fetchAIDeck = async () => {
    // In a real implementation, this would fetch from an API
    // For now, return a sample deck
    return [
      // Sample deck data would go here
      // This would be replaced with actual card data
      { id: 'ai-1', name: 'AI Card 1', type: 'Familiar', power: 2, toughness: 2 },
      { id: 'ai-2', name: 'AI Card 2', type: 'Spell', text: 'Deal 2 damage' },
      // ... more cards
    ];
  };
  
  // Show loading screen
  if (loading) {
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