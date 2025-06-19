import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GameSimulatorSimple = () => {
  const [gameState, setGameState] = useState({
    phase: 'setup', // 'setup', 'playing', 'paused'
    turn: 1,
    currentPlayer: 1,
  });

  const startGame = () => {
    setGameState({
      ...gameState,
      phase: 'playing',
    });
  };

  const resetGame = () => {
    setGameState({
      phase: 'setup',
      turn: 1,
      currentPlayer: 1,
    });
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">KONIVRER Game Simulator</h1>
          <p className="text-gray-300">
            Experience the mystical world of KONIVRER with our interactive game
            simulator
          </p>
        </motion.div>

        {gameState.phase === 'setup' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Game Setup</h2>
            <p className="text-gray-300 mb-6">
              Welcome to the KONIVRER Game Simulator! This is a simplified
              version to test the integration.
            </p>
            <button
              onClick={startGame}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Play size={20} />
              <span>Start Game</span>
            </button>
          </motion.div>
        )}

        {gameState.phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game in Progress</h2>
              <div className="text-lg">
                Turn {gameState.turn} - Player {gameState.currentPlayer}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                <h3 className="text-lg font-bold mb-2">Player 1</h3>
                <div className="text-sm text-gray-300">
                  <div>Life Points: 4000</div>
                  <div>Cards in Hand: 5</div>
                  <div>Azoth: 3</div>
                </div>
              </div>

              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                <h3 className="text-lg font-bold mb-2">Player 2</h3>
                <div className="text-sm text-gray-300">
                  <div>Life Points: 4000</div>
                  <div>Cards in Hand: 5</div>
                  <div>Azoth: 3</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() =>
                  setGameState({
                    ...gameState,
                    turn: gameState.turn + 1,
                    currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
                  })
                }
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span>End Turn</span>
              </button>

              <button
                onClick={resetGame}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span>Reset Game</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameSimulatorSimple;
