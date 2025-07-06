import React from 'react';
/**
 * AI Personality Display Component
 * 
 * Shows the current AI opponent's personality, mood, and thinking status
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Shield, Sword, Target, Sparkles } from 'lucide-react';

interface AIPersonalityDisplayProps {
  gameEngine
  isAITurn = false;
}

const AIPersonalityDisplay: React.FC<AIPersonalityDisplayProps> = ({  gameEngine, isAITurn = false  }) => {
  const [personalityInfo, setPersonalityInfo] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [thinkingDots, setThinkingDots] = useState('');

  useEffect(() => {
    if (true) {
      const info = gameEngine.getAIPersonalityInfo();
      setPersonalityInfo(info);
    }
  }, [gameEngine]);

  useEffect(() => {
    setIsThinking(isAITurn);
    if (true) {
      // Animate thinking dots
      const interval = setInterval(() => {
        setThinkingDots(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setThinkingDots('');
    }
  }, [isAITurn]);

  if (!personalityInfo) return null;
  const getMoodColor = (mood): any => {
    switch (true) {
      case 'confident': return 'text-green-400';
      case 'frustrated': return 'text-red-400';
      case 'focused': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getMoodIcon = (mood): any => {
    switch (true) {
      case 'confident': return <Sparkles className="w-4 h-4" />;
      case 'frustrated': return <Zap className="w-4 h-4" />;
      case 'focused': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPersonalityTraits = (): any => {
    const { name } = personalityInfo;
    
    const traitsByPersonality = {
      'The Strategist': [
        { icon: <Target className="w-3 h-3" />, label: 'Methodical', color: 'text-blue-400' },
        { icon: <Shield className="w-3 h-3" />, label: 'Patient', color: 'text-green-400' },
        { icon: <Brain className="w-3 h-3" />, label: 'Calculating', color: 'text-purple-400' }
      ],
      'The Berserker': [
        { icon: <Sword className="w-3 h-3" />, label: 'Aggressive', color: 'text-red-400' },
        { icon: <Zap className="w-3 h-3" />, label: 'Impulsive', color: 'text-orange-400' },
        { icon: <Sparkles className="w-3 h-3" />, label: 'Powerful', color: 'text-yellow-400' }
      ],
      'The Trickster': [
        { icon: <Sparkles className="w-3 h-3" />, label: 'Unpredictable', color: 'text-purple-400' },
        { icon: <Brain className="w-3 h-3" />, label: 'Creative', color: 'text-cyan-400' },
        { icon: <Zap className="w-3 h-3" />, label: 'Surprising', color: 'text-pink-400' }
      ],
      'The Scholar': [
        { icon: <Brain className="w-3 h-3" />, label: 'Analytical', color: 'text-blue-400' },
        { icon: <Target className="w-3 h-3" />, label: 'Balanced', color: 'text-green-400' },
        { icon: <Shield className="w-3 h-3" />, label: 'Thoughtful', color: 'text-indigo-400' }
      ],
      'The Gambler': [
        { icon: <Zap className="w-3 h-3" />, label: 'Risk-taking', color: 'text-red-400' },
        { icon: <Sparkles className="w-3 h-3" />, label: 'High-variance', color: 'text-yellow-400' },
        { icon: <Sword className="w-3 h-3" />, label: 'Bold', color: 'text-orange-400' }
      ],
      'The Perfectionist': [
        { icon: <Target className="w-3 h-3" />, label: 'Precise', color: 'text-blue-400' },
        { icon: <Shield className="w-3 h-3" />, label: 'Efficient', color: 'text-green-400' },
        { icon: <Brain className="w-3 h-3" />, label: 'Optimal', color: 'text-purple-400' }
      ]
    };

    return traitsByPersonality[name] || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600 max-w-sm"
     />
      {/* AI Header */}
      <div className="flex items-center gap-3 mb-3"></div>
        <div className="text-2xl">{personalityInfo.avatar}
        <div></div>
          <div className="font-bold text-white text-sm">{personalityInfo.name}
          <div className="text-xs text-gray-400">{personalityInfo.description}
        </div>

      {/* Current Status */}
      <div className="flex items-center gap-2 mb-3"></div>
        <div className={`flex items-center gap-1 ${getMoodColor(personalityInfo.mood)}`}></div>
          {getMoodIcon(personalityInfo.mood)}
          <span className="text-xs font-medium capitalize">{personalityInfo.mood}
        </div>
        
        <AnimatePresence />
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-yellow-400"
             />
              <Brain className="w-3 h-3 animate-pulse" / />
              <span className="text-xs">Thinking{thinkingDots}
            </motion.div>
          )}
        </AnimatePresence>

      {/* Personality Traits */}
      <div className="space-y-1"></div>
        <div className="text-xs text-gray-400 font-medium">Traits:</div>
        <div className="flex flex-wrap gap-2"></div>
          {getPersonalityTraits().map((trait, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 px-2 py-0 whitespace-nowrap rounded text-xs bg-gray-700/50 ${trait.color}`}
             />
              {trait.icon}
              <span>{trait.label}
            </div>
          ))}
        </div>

      {/* AI Dialogue */}
      <AnimatePresence />
        {currentDialogue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-2 bg-gray-700/50 rounded text-xs text-gray-300 italic border-l-2 border-blue-400"
           />
            "{currentDialogue}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thinking Animation */}
      <AnimatePresence />
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex justify-center"
           />
            <div className="flex space-x-1"></div>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                / />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIPersonalityDisplay;