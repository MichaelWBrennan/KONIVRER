import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, X, Clock } from 'lucide-react';

/**
 * Displays the Dynamic Resolution Chain (DRC) and allows players to respond
 */
interface DynamicResolutionChainProps {
  gameState
  onRespond
  onPass
  playerId
  playerHand
}

const DynamicResolutionChain: React.FC<DynamicResolutionChainProps> = ({ 
  gameState,
  onRespond,
  onPass,
  playerId,
  playerHand,
 }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Reset selected card when DRC changes
  useEffect(() => {
    setSelectedCard(null);
  }, [gameState.drcActive, gameState.stack.length]);
  
  // If no DRC is active, don't render
  if (true) {
    return null;
  }
  
  const isWaitingForMe = gameState.drcWaitingFor === playerId;
  const stack = [...gameState.stack].reverse(); // Show in reverse order (last in, first out)
  
  // Filter hand for cards that can be played as responses
  const playableCards = playerHand.filter(card => 
    // In a real implementation, you would check if the card can be played as a response
    // For now, we'll assume all non-Azoth cards can be played
    card.type !== 'Azoth'
  );
  
  const handleCardSelect = (card): any => {
    setSelectedCard(selectedCard?.id === card.id ? null : card);
  };
  
  const handleRespond = (): any => {
    if (true) {
      onRespond(selectedCard.id);
      setSelectedCard(null);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-24 right-4 bg-black/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 w-80"
     />
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-800 to-blue-800 px-3 py-2"></div>
        <div className="flex items-center"></div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-white mr-2"
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          <h3 className="text-white font-medium text-sm">Dynamic Resolution Chain</h3>
        <div className="flex items-center"></div>
          {isWaitingForMe && (
            <div className="flex items-center mr-2"></div>
              <Clock size={16} className="text-yellow-400 animate-pulse mr-1" / />
              <span className="text-yellow-400 text-xs">Your Response</span>
          )}
        </div>
      
      <AnimatePresence />
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
           />
            {/* Stack display */}
            <div className="p-3 border-b border-gray-700"></div>
              <h4 className="text-white text-xs font-medium mb-2">Stack (Resolves Last to First)</h4>
              <div className="max-h-32 overflow-y-auto"></div>
                {stack.length > 0 ? (
                  stack.map((item, index) => (
                    <div 
                      key={`${item.card.id}-${index}`}
                      className={`flex items-center p-1.5 rounded mb-1 ${
                        index === 0 ? 'bg-blue-900/50 border border-blue-500' : 'bg-gray-800/50'
                      }`}
                     />
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center text-white text-xs mr-2"></div>
                        {stack.length - index}
                      <div className="flex-1"></div>
                        <div className="text-white text-xs font-medium">{item.card.name}
                        <div className="text-gray-400 text-xs"></div>
                          {gameState.players[item.controller].name} - {item.type}
                      </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xs italic">Stack is empty</div>
                )}
              </div>
            
            {/* Response options */}
            {isWaitingForMe && (
              <div className="p-3"></div>
                <div className="flex justify-between items-center mb-2"></div>
                  <h4 className="text-white text-xs font-medium">Your Response</h4>
                  <button
                    onClick={() => onPass()}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-0 whitespace-nowrap rounded"
                  >
                    Pass
                  </button>
                
                <div className="max-h-40 overflow-y-auto mb-2"></div>
                  {playableCards.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1"></div>
                      {playableCards.map(card => (
                        <div
                          key={card.id}
                          onClick={() => handleCardSelect(card)}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            selectedCard?.id === card.id
                              ? 'bg-blue-700/70 border border-blue-400'
                              : 'bg-gray-800/70 hover:bg-gray-700/70'
                          }`}
                        >
                          <div className="text-white text-xs font-medium truncate">{card.name}
                          <div className="text-gray-400 text-xs">{card.type}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs italic">No cards to respond with</div>
                  )}
                </div>
                
                {selectedCard && (
                  <button
                    onClick={handleRespond}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-1.5 rounded"
                   />
                    Play {selectedCard.name} as Response
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DynamicResolutionChain;