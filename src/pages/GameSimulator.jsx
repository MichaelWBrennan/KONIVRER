import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import TalisharStyleGameSimulator from '../components/TalisharStyleGameSimulator';

const GameSimulator = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-purple-500" />
              <h1 className="text-4xl font-bold">Game Simulator</h1>
            </div>
            <p className="text-secondary text-lg">
              Tournament-quality gameplay experience powered by Talishar
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg overflow-hidden"
        >
          <TalisharStyleGameSimulator />
        </motion.div>
      </div>
    </div>
  );
};

export default GameSimulator;