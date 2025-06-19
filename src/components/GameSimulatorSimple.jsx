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

            {/* KONIVRER Game Field Layout */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-center">
                KONIVRER Game Field
              </h3>

              {/* Player 2 Area (Top) */}
              <div className="mb-4 p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                <div className="text-center mb-2">
                  <h4 className="font-bold">Player 2</h4>
                  <div className="text-sm">Life: 4000 | Hand: 5 | Azoth: 3</div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {/* Player 2 zones */}
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>FLAG</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded col-span-4">
                    <div>Combat Row</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>DECK</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>REMOVED</div>
                    <div>FROM PLAY</div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>LIFE</div>
                  </div>
                  <div className="bg-gray-800 border-2 border-dashed border-gray-400 p-4 text-center text-sm rounded col-span-4">
                    <div className="font-bold">Field</div>
                    <div className="text-xs mt-1">
                      Where Familiars and Spells are played
                    </div>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                <div className="mt-2">
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-1 text-center text-xs rounded">
                    <div>
                      Azoth Row - Where Azoth cards are placed as resources
                    </div>
                  </div>
                </div>
              </div>

              {/* Player 1 Area (Bottom) */}
              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="mb-2">
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-1 text-center text-xs rounded">
                    <div>
                      Azoth Row - Where Azoth cards are placed as resources
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>LIFE</div>
                  </div>
                  <div className="bg-gray-800 border-2 border-dashed border-gray-400 p-4 text-center text-sm rounded col-span-4">
                    <div className="font-bold">Field</div>
                    <div className="text-xs mt-1">
                      Where Familiars and Spells are played
                    </div>
                  </div>
                  <div className="col-span-2"></div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>FLAG</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded col-span-4">
                    <div>Combat Row</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>DECK</div>
                  </div>
                  <div className="bg-gray-700 border-2 border-dashed border-gray-500 p-2 text-center text-xs rounded">
                    <div>REMOVED</div>
                    <div>FROM PLAY</div>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <h4 className="font-bold">Player 1</h4>
                  <div className="text-sm">Life: 4000 | Hand: 5 | Azoth: 3</div>
                </div>
              </div>
            </div>

            {/* Game Zone Explanations */}
            <div className="mb-6 bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-bold mb-2">Game Zones:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Field:</strong> Where Familiars and Spells are played
                </div>
                <div>
                  <strong>Combat Row:</strong> Designated area for Familiar
                  battles
                </div>
                <div>
                  <strong>Azoth Row:</strong> Where Azoth cards are placed as
                  resources
                </div>
                <div>
                  <strong>Deck:</strong> Your draw pile for the duration of the
                  game
                </div>
                <div>
                  <strong>Life:</strong> 4 cards face down, revealed as damage
                  is taken
                </div>
                <div>
                  <strong>Flag:</strong> Shows elements your deck abides by and
                  bonus damage
                </div>
                <div>
                  <strong>Removed from Play:</strong> Cards affected by the Void
                  keyword
                </div>
                <div>
                  <strong>Player's Hand:</strong> Cards not yet played
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
