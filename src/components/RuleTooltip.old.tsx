import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Book, ExternalLink } from 'lucide-react';

interface RuleTooltipProps {
  ruleId
  children
  position = 'top';
  showIcon = true;
  customContent = null;
}

const RuleTooltip: React.FC<RuleTooltipProps> = ({ 
  ruleId,
  children,
  position = 'top',
  showIcon = true,
  customContent = null,
 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Rule definitions - these would be loaded from the rules data
  const ruleDefinitions = {
    void: {
      title: 'VOID',
      description:
        'This keyword ability allows the card to bypass certain defenses and effects.',
      category: 'Keyword Ability',
    },
    submerged: {
      title: 'SUBMERGED',
      description:
        'This keyword ability relates to water-based mechanics and flow effects.',
      category: 'Keyword Ability',
    },
    brilliance: {
      title: 'BRILLIANCE',
      description:
        'This keyword ability represents speed, clarity, and light-based effects.',
      category: 'Keyword Ability',
    },
    elements: {
      title: 'Elements',
      description:
        'Cards have elemental affinities that determine deck building restrictions and interactions.',
      category: 'Core Mechanic',
    },
    'deck-size': {
      title: 'Deck Size',
      description: 'Decks must contain between 40-60 cards in most formats.',
      category: 'Deck Building',
    },
    'flag-cards': {
      title: 'Flag Cards',
      description:
        "Special cards that determine your deck's elemental identity and restrictions.",
      category: 'Card Type',
    },
  };

  const rule = ruleDefinitions[ruleId];
  const content = customContent || rule;

  if (!content) return children;
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="flex items-center gap-1 cursor-help"></div>
        {children}
        {showIcon && (
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors" />
        )}

      <AnimatePresence />
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]}`}
           />
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-xs"></div>
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
                  position === 'top'
                    ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b'
                    : position === 'bottom'
                      ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t'
                      : position === 'left'
                        ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r'
                        : 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
                }`}></div>
              {/* Content */}
              <div className="relative"></div>
                <div className="flex items-center gap-2 mb-2"></div>
                  <Book className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-white text-sm"></h4>
                    {content.title}
                  {content.category && (
                    <span className="text-xs px-2 py-0 whitespace-nowrap bg-blue-600/20 text-blue-300 rounded"></span>
                      {content.category}
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed"></p>
                  {content.description}
                {content.example && (
                  <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-400"></div>
                    <strong>Example:</strong> {content.example}
                )}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700"></div>
                  <button
                    onClick={() => window.open('/rules', '_blank')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Full Rules
                  </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default RuleTooltip;