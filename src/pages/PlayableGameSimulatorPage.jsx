import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Bot, ChevronRight } from 'lucide-react';
import PlayableGameSimulator from '../components/PlayableGameSimulator';

const PlayableGameSimulatorPage = () => {
  const [gameMode, setGameMode] = useState(null); // null, 'ai', 'online'

  // Online game options
  const onlineOptions = {
    serverUrl: 'wss://konivrer-game-server.example.com', // Replace with actual server URL
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-purple-500" />
              <h1 className="text-4xl font-bold">KONIVRER Game Simulator</h1>
            </div>
            <p className="text-secondary text-lg">
              Experience the full KONIVRER card game with our interactive
              simulator
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {gameMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg overflow-hidden"
          >
            <PlayableGameSimulator
              mode={gameMode}
              onlineOptions={gameMode === 'online' ? onlineOptions : undefined}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Choose Game Mode
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* AI Mode */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 cursor-pointer"
                onClick={() => setGameMode('ai')}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Single Player
                    </h3>
                    <p className="text-white/80">Play against AI</p>
                  </div>
                </div>
                <p className="text-white/70 mb-4">
                  Challenge our advanced AI opponent with adjustable difficulty
                  levels. Perfect for learning the game or practicing
                  strategies.
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="w-6 h-6 text-white/60" />
                </div>
              </motion.div>

              {/* Online Mode */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-600 to-green-600 rounded-xl p-6 cursor-pointer"
                onClick={() => setGameMode('online')}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Multiplayer
                    </h3>
                    <p className="text-white/80">Play online with others</p>
                  </div>
                </div>
                <p className="text-white/70 mb-4">
                  Connect with players around the world for competitive matches.
                  Create or join games and climb the leaderboards.
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="w-6 h-6 text-white/60" />
                </div>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-secondary">
                Note: This is a fully functional game simulator with complete
                rules implementation. Your progress and collection will be saved
                to your account.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlayableGameSimulatorPage;
