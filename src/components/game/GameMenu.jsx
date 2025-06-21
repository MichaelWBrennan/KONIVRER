import { motion } from 'framer-motion';
import { X, Home, Settings, Volume2, VolumeX, Flag, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Game menu with options like settings, concede, etc.
 */
const GameMenu = ({ onClose, onAction }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Game Menu</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-white">Sound Effects</span>
            </div>
            <div className={`w-10 h-6 rounded-full flex items-center ${soundEnabled ? 'bg-blue-600 justify-end' : 'bg-gray-600 justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
            </div>
          </button>
          
          {/* Settings */}
          <button className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg">
            <Settings className="w-5 h-5 text-purple-400" />
            <span className="text-white">Game Settings</span>
          </button>
          
          {/* Help */}
          <button className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg">
            <HelpCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">Game Rules</span>
          </button>
          
          {/* Concede */}
          <button 
            onClick={() => {
              onAction('concede');
              onClose();
            }}
            className="w-full flex items-center space-x-3 p-3 bg-red-900 hover:bg-red-800 rounded-lg"
          >
            <Flag className="w-5 h-5 text-red-300" />
            <span className="text-white">Concede Game</span>
          </button>
          
          {/* Return to Home */}
          <Link 
            to="/"
            className="w-full flex items-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            <Home className="w-5 h-5 text-blue-400" />
            <span className="text-white">Exit to Main Menu</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameMenu;