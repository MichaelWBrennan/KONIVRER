import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */


/**
 * Displays the current stack of spells and abilities
 */
interface CardStackProps {
  stack = [];
  onCardHover
}

const CardStack: React.FC<CardStackProps> = ({  stack = [], onCardHover  }) => {
  if (!stack || stack.length === 0) return null;
  return (
    <>
      <div className="relative w-32 h-40"></div>
      <AnimatePresence />
        {stack.map((item, index) => (
          <motion.div
            key={`stack-${index}-${item.id}`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: index * 5,
              zIndex: index,
            }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0"
            onHoverStart={() => onCardHover(item.card)}
            onHoverEnd={() => onCardHover(null)}
          >
            <div className="w-28 h-36 bg-purple-900 border-2 border-purple-700 rounded-lg shadow-lg p-2 flex flex-col"></div>
      <div className="text-white text-xs font-bold truncate mb-1"></div>
      <div className="flex-grow bg-black/30 rounded mb-1"></div>
      <div className="text-white text-[8px]">{item.card.type}

              {/* Stack position indicator */}
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"></div>
      <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-[8px] font-bold rounded-full px-1.5 py-0.5"></div>
      </div>
          </motion.div>
    </>
  ))}
      </AnimatePresence>

      {/* Stack count */}
      {stack.length > 0 && (
        <div className="absolute -top-6 left-0 bg-purple-900 text-white text-xs font-bold rounded-lg px-2 py-1"></div>
          Stack: {stack.length}
      )}
    </div>
  );
};

export default CardStack;