import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, ChevronLeft, X } from 'lucide-react';

const MatchmakingTips = ({ onClose }) => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    {
      title: "Optimize Your Queue Time",
      content: "Choose 'Balanced' skill range during peak hours for faster matches. During off-peak hours, consider using 'Wide' skill range to find opponents more quickly.",
      icon: "⏱️"
    },
    {
      title: "Improve Your Rank",
      content: "Winning against higher-ranked players gives you more rating points. Focus on consistent performance rather than individual matches for steady progression.",
      icon: "📈"
    },
    {
      title: "Prepare Multiple Decks",
      content: "Having decks for different formats allows you to participate in a wider variety of matches and tournaments. This also helps you adapt to changing metas.",
      icon: "🃏"
    },
    {
      title: "Use Voice Chat",
      content: "Enabling voice chat can enhance your gaming experience and help build community connections. Remember to follow community guidelines during conversations.",
      icon: "🎙️"
    },
    {
      title: "Check Your Connection",
      content: "For the best experience, use a wired connection when possible. If you're experiencing lag, try selecting a region closer to your location.",
      icon: "🌐"
    }
  ];
  
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };
  
  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="bg-yellow-100 rounded-full p-2 text-yellow-700">
          <Lightbulb className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{tips[currentTip].icon}</span>
                <h3 className="font-medium text-gray-900">{tips[currentTip].title}</h3>
              </div>
              <p className="text-sm text-gray-600">{tips[currentTip].content}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 border-opacity-50">
            <div className="text-xs text-gray-500">
              Tip {currentTip + 1} of {tips.length}
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={prevTip}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={nextTip}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchmakingTips;