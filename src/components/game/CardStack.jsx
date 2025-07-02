/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { motion, AnimatePresence } from 'framer-motion';

/**
 * Displays the current stack of spells and abilities
 */
const CardStack = ({ stack = [], onCardHover }) => {
  if (!stack || stack.length === 0) return null;

  return (
    <div className="relative w-32 h-40">
      <AnimatePresence>
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
            <div className="w-28 h-36 bg-purple-900 border-2 border-purple-700 rounded-lg shadow-lg p-2 flex flex-col">
              <div className="text-white text-xs font-bold truncate mb-1">
                {item.card.name}
              </div>

              <div className="flex-grow bg-black/30 rounded mb-1"></div>

              <div className="text-white text-[8px]">{item.card.type}</div>

              {/* Stack position indicator */}
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {index + 1}
              </div>

              {/* Owner indicator */}
              <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-[8px] font-bold rounded-full px-1.5 py-0.5">
                {item.controller === 0 ? 'You' : 'Opp'}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Stack count */}
      {stack.length > 0 && (
        <div className="absolute -top-6 left-0 bg-purple-900 text-white text-xs font-bold rounded-lg px-2 py-1">
          Stack: {stack.length}
        </div>
      )}
    </div>
  );
};

export default CardStack;
