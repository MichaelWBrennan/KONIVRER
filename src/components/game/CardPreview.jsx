/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  Sword,
  Info,
  X,
  Sparkles,
  Eye,
  Maximize2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Enhanced Card Preview Component
 *
 * A premium MTG Arena-style card preview with:
 * - Dynamic 3D perspective effects
 * - Animated foil/premium card treatments
 * - Responsive design for all devices
 * - Interactive card examination features
 * - High-quality visual effects
 */
const CardPreview = ({ card, position = 'right' }) => {
  const [expanded, setExpanded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(false);

  // Handle 3D card rotation effect
  useEffect(() => {
    const handleMouseMove = e => {
      if (!expanded) return;

      // Get mouse position relative to window
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate rotation based on mouse position
      // Max rotation of 10 degrees
      const rotateY = (clientX / windowWidth - 0.5) * 20;
      const rotateX = (clientY / windowHeight - 0.5) * -20;

      setRotation({ x: rotateX, y: rotateY });
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [expanded]);

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setShowDetails(false); // Reset details when expanding
    }
  };

  // Toggle card details
  const toggleDetails = e => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  if (!card) return null;

  // Card appearance based on type
  const getCardBackground = () => {
    switch (card.type) {
      case 'Familiar':
        return 'bg-gradient-to-br from-green-800 to-green-900 border-green-600';
      case 'Spell':
        return 'bg-gradient-to-br from-purple-800 to-purple-900 border-purple-600';
      case 'Azoth':
        return 'bg-gradient-to-br from-yellow-700 to-yellow-800 border-yellow-600';
      default:
        return 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600';
    }
  };

  // Get card rarity styling
  const getRarityStyle = () => {
    if (!card.rarity) return '';

    switch (card.rarity.toLowerCase()) {
      case 'common':
        return 'border-gray-400';
      case 'uncommon':
        return 'border-blue-400';
      case 'rare':
        return 'border-yellow-400';
      case 'mythic':
      case 'legendary':
        return 'border-orange-500';
      default:
        return 'border-gray-400';
    }
  };

  // Get card frame styling based on card color
  const getCardFrameStyle = () => {
    switch (card.color) {
      case 'white':
        return 'from-yellow-100/20 to-yellow-200/10';
      case 'blue':
        return 'from-blue-100/20 to-blue-200/10';
      case 'black':
        return 'from-gray-700/20 to-gray-800/10';
      case 'red':
        return 'from-red-100/20 to-red-200/10';
      case 'green':
        return 'from-green-100/20 to-green-200/10';
      case 'gold':
      case 'multicolor':
        return 'from-yellow-500/20 to-yellow-600/10';
      case 'colorless':
      default:
        return 'from-gray-400/20 to-gray-500/10';
    }
  };

  // Position the preview based on the position prop
  const getPositionStyle = () => {
    switch (position) {
      case 'left':
        return 'left-4';
      case 'right':
        return 'right-4';
      case 'center':
        return 'left-1/2 transform -translate-x-1/2';
      default:
        return 'right-4';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: expanded ? 1.5 : 1,
          y: expanded ? -50 : 0,
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`absolute ${expanded ? 'fixed inset-0 flex items-center justify-center z-[100] pointer-events-auto' : `${getPositionStyle()} top-1/2 transform -translate-y-1/2 z-50 ${expanded ? 'pointer-events-auto' : 'pointer-events-none'}`}`}
        onClick={expanded ? toggleExpanded : undefined}
        style={{
          perspective: 1000,
        }}
      >
        {/* Backdrop for expanded view */}
        {expanded && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleExpanded}
          />
        )}

        {/* Card container with 3D effect */}
        <motion.div
          className={`relative ${expanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: expanded
              ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
              : 'none',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Card frame */}
          <motion.div
            className={`w-48 md:w-64 ${expanded ? 'w-72 md:w-80' : ''} aspect-[2.5/3.5] rounded-xl shadow-2xl border-2 ${getCardBackground()} ${getRarityStyle()} overflow-hidden`}
            whileHover={!expanded ? { scale: 1.05, y: -5 } : {}}
            onClick={!expanded ? toggleExpanded : undefined}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-black/70 to-black/50 p-2 md:p-3">
              <h3 className="text-white text-sm md:text-base font-bold">
                {card.name}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <div className="text-gray-300 text-xs">{card.type}</div>
                {card.azothCost && (
                  <div className="flex items-center bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full px-1.5 py-0.5 shadow-sm">
                    <Zap className="w-3 h-3 text-white mr-0.5" />
                    <span className="text-white text-xs font-bold">
                      {card.azothCost}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Art */}
            <div className="h-24 md:h-32 bg-black/40 relative overflow-hidden">
              {/* Simulated card art with gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${getCardFrameStyle()}`}
              ></div>

              {/* Dynamic lighting effect */}
              {expanded && (
                <div
                  className="absolute inset-0 bg-gradient-radial opacity-60 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${
                      (mousePosition.x / window.innerWidth) * 100
                    }% ${(mousePosition.y / window.innerHeight) * 100}%, 
                      rgba(255,255,255,0.15) 0%, 
                      rgba(255,255,255,0) 60%)`,
                  }}
                />
              )}

              {/* Card type icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                {card.type === 'Familiar' && (
                  <Shield className="w-16 h-16 text-white" />
                )}
                {card.type === 'Spell' && (
                  <Zap className="w-16 h-16 text-white" />
                )}
                {card.type === 'Azoth' && (
                  <Zap className="w-16 h-16 text-white" />
                )}
              </div>
            </div>

            {/* Card Text */}
            <div className="p-2 md:p-3 bg-gradient-to-b from-black/80 to-black/70">
              {/* Card abilities */}
              {card.abilities && card.abilities.length > 0 && (
                <div className="mb-2">
                  {card.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className="text-gray-200 text-xs mb-1 leading-relaxed"
                    >
                      {ability.description || 'Ability description'}
                    </div>
                  ))}
                </div>
              )}

              {/* Card description/flavor text */}
              {card.description && (
                <div className="text-gray-400 text-xs italic mt-1 border-t border-gray-700/50 pt-1">
                  {card.description}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="bg-gradient-to-r from-black/70 to-black/50 p-2 md:p-3 flex justify-between items-center">
              {card.type === 'Familiar' && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-red-700 to-red-600 rounded-full px-1.5 py-0.5 shadow-sm">
                    <Sword className="w-3 h-3 text-white mr-0.5" />
                    <span className="text-white text-xs font-bold">
                      {card.power}
                    </span>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-blue-700 to-blue-600 rounded-full px-1.5 py-0.5 shadow-sm">
                    <Shield className="w-3 h-3 text-white mr-0.5" />
                    <span className="text-white text-xs font-bold">
                      {card.toughness}
                    </span>
                  </div>
                </div>
              )}

              {/* Card set/rarity indicator */}
              <div className="text-gray-400 text-xs flex items-center">
                <span className="mr-1">{card.set || 'KON'}</span>
                <div
                  className={`w-3 h-3 rounded-full ${
                    card.rarity === 'common'
                      ? 'bg-gray-400'
                      : card.rarity === 'uncommon'
                        ? 'bg-blue-400'
                        : card.rarity === 'rare'
                          ? 'bg-yellow-400'
                          : 'bg-orange-500'
                  }`}
                ></div>
              </div>
            </div>

            {/* Premium/Foil overlay effect */}
            {card.isPremium && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 mix-blend-overlay pointer-events-none"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(225deg, rgba(138, 43, 226, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(315deg, rgba(138, 43, 226, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(45deg, rgba(138, 43, 226, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Sparkle effects for premium cards */}
            {card.isPremium && expanded && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      repeatDelay: Math.random() * 5,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Card action buttons */}
          {expanded ? (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDetails}
              >
                <Info className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpanded}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-1.5 shadow-lg pointer-events-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleExpanded}
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </motion.div>
          )}

          {/* Card details panel */}
          {expanded && showDetails && (
            <motion.div
              className="absolute -right-64 top-0 w-60 bg-gray-900/95 backdrop-blur-md rounded-lg p-4 shadow-xl border border-blue-900/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h4 className="text-blue-400 font-bold mb-2">Card Details</h4>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{card.type}</span>
                </div>

                <div>
                  <span className="text-gray-400">Rarity:</span>
                  <span className="text-white ml-2">
                    {card.rarity || 'Common'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Set:</span>
                  <span className="text-white ml-2">{card.set || 'KON'}</span>
                </div>

                {card.artist && (
                  <div>
                    <span className="text-gray-400">Artist:</span>
                    <span className="text-white ml-2">{card.artist}</span>
                  </div>
                )}

                {card.type === 'Familiar' && (
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Power:</span>
                      <span className="text-red-400 font-bold">
                        {card.power}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Toughness:</span>
                      <span className="text-blue-400 font-bold">
                        {card.toughness}
                      </span>
                    </div>
                  </div>
                )}

                {card.azothCost && (
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Azoth Cost:</span>
                      <span className="text-yellow-400 font-bold">
                        {card.azothCost}
                      </span>
                    </div>
                  </div>
                )}

                {card.isPremium && (
                  <div className="mt-3 flex items-center justify-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-2 rounded-md">
                    <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-purple-300 font-medium">
                      Premium Card
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardPreview;
