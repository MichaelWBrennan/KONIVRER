import React from 'react';
import { motion } from 'framer-motion';
import { Users, Smartphone, Tablet, Laptop } from 'lucide-react';

const PhysicalMatchmakingButton = ({ onClick }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2 className="text-lg font-semibold mb-2">Physical Card Game?</h2>
      <p className="text-sm text-purple-200 mb-4">
        Use our physical matchmaking system for in-person tournaments and casual play.
      </p>
      <motion.button
        onClick={onClick}
        className="w-full bg-white text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Users className="w-5 h-5" />
        <span>Open Physical Matchmaking</span>
      </motion.button>
      
      <div className="mt-3 pt-3 border-t border-purple-500 border-opacity-30">
        <div className="flex justify-around">
          <div className="text-center">
            <Smartphone className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Mobile</p>
          </div>
          <div className="text-center">
            <Tablet className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Tablet</p>
          </div>
          <div className="text-center">
            <Laptop className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-purple-200">Desktop</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhysicalMatchmakingButton;