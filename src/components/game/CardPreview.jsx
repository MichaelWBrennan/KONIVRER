import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Sword, Info, X } from 'lucide-react';

/**
 * Card preview component that shows a larger version of a card when hovered
 * Similar to MTG Arena's card preview feature
 */
const CardPreview = ({ card, position = 'right' }) => {
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
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`absolute ${getPositionStyle()} top-1/2 transform -translate-y-1/2 z-50 pointer-events-none`}
      >
        <div 
          className={`w-48 md:w-64 aspect-[2.5/3.5] rounded-xl shadow-2xl border-2 ${getCardBackground()} ${getRarityStyle()} overflow-hidden`}
        >
          {/* Card Header */}
          <div className="bg-black/50 p-2">
            <h3 className="text-white text-sm md:text-base font-bold">{card.name}</h3>
            <div className="flex justify-between items-center mt-1">
              <div className="text-gray-300 text-xs">{card.type}</div>
              {card.azothCost && (
                <div className="flex items-center bg-yellow-600/80 rounded-full px-1.5 py-0.5">
                  <Zap className="w-3 h-3 text-white mr-0.5" />
                  <span className="text-white text-xs font-bold">{card.azothCost}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Card Art */}
          <div className="h-24 md:h-32 bg-black/40 relative overflow-hidden">
            {/* Simulated card art with gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getCardFrameStyle()}`}></div>
            
            {/* Card type icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              {card.type === 'Familiar' && <Shield className="w-16 h-16 text-white" />}
              {card.type === 'Spell' && <Zap className="w-16 h-16 text-white" />}
              {card.type === 'Azoth' && <Zap className="w-16 h-16 text-white" />}
            </div>
          </div>
          
          {/* Card Text */}
          <div className="p-2 bg-black/70">
            {/* Card abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <div className="mb-2">
                {card.abilities.map((ability, index) => (
                  <div key={index} className="text-gray-200 text-xs mb-1">
                    {ability.description || "Ability description"}
                  </div>
                ))}
              </div>
            )}
            
            {/* Card description/flavor text */}
            {card.description && (
              <div className="text-gray-400 text-xs italic mt-1">
                {card.description}
              </div>
            )}
          </div>
          
          {/* Card Footer */}
          <div className="bg-black/50 p-2 flex justify-between items-center">
            {card.type === 'Familiar' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-red-600/80 rounded-full px-1.5 py-0.5">
                  <Sword className="w-3 h-3 text-white mr-0.5" />
                  <span className="text-white text-xs font-bold">{card.power}</span>
                </div>
                <div className="flex items-center bg-blue-600/80 rounded-full px-1.5 py-0.5">
                  <Shield className="w-3 h-3 text-white mr-0.5" />
                  <span className="text-white text-xs font-bold">{card.toughness}</span>
                </div>
              </div>
            )}
            
            {/* Card set/rarity indicator */}
            <div className="text-gray-400 text-xs flex items-center">
              <span className="mr-1">{card.set || "KON"}</span>
              <div className={`w-3 h-3 rounded-full bg-${
                card.rarity === 'common' ? 'gray-400' :
                card.rarity === 'uncommon' ? 'blue-400' :
                card.rarity === 'rare' ? 'yellow-400' :
                'orange-500'
              }`}></div>
            </div>
          </div>
          
          {/* Premium/Foil overlay effect */}
          {card.isPremium && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 mix-blend-overlay pointer-events-none"></div>
          )}
        </div>
        
        {/* Card info button */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-full p-1 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Info className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardPreview;