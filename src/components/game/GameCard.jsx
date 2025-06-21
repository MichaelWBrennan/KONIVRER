import { motion } from 'framer-motion';
import { Shield, Sword, Zap } from 'lucide-react';

/**
 * Renders a single card in the game with animations and status indicators
 */
const GameCard = ({
  card,
  faceDown = false,
  isSelected = false,
  isTargeted = false,
  isInteractive = true,
  onClick,
  onHover,
  targetMode = false,
  zone
}) => {
  // Determine if card is a valid target in target mode
  const isValidTarget = targetMode && card.isValidTarget;
  
  // Determine card status indicators
  const isTapped = card.tapped;
  const isAttacking = card.attacking;
  const isBlocking = card.blocking;
  const hasCounters = card.counters && card.counters > 0;
  const hasDamage = card.damage && card.damage > 0;
  
  // Card appearance based on type
  const getCardBackground = () => {
    if (faceDown) return 'bg-blue-900';
    
    switch (card.type) {
      case 'Familiar':
        return 'bg-green-900 border-green-700';
      case 'Spell':
        return 'bg-purple-900 border-purple-700';
      case 'Azoth':
        return 'bg-yellow-900 border-yellow-700';
      default:
        return 'bg-gray-900 border-gray-700';
    }
  };

  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.1, zIndex: 50 } : {}}
      animate={{
        y: isSelected ? -20 : 0,
        rotate: isTapped ? 90 : 0,
        scale: isTargeted ? 1.1 : 1,
        borderColor: isTargeted ? '#f59e0b' : isValidTarget ? '#10b981' : undefined
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onHoverStart={() => onHover(card)}
      onHoverEnd={() => onHover(null)}
      className={`w-20 h-28 rounded-lg shadow-lg border-2 ${getCardBackground()} ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      } ${isTargeted ? 'ring-4 ring-yellow-500' : ''} ${
        isValidTarget ? 'ring-2 ring-green-500' : ''
      } ${isInteractive ? 'cursor-pointer' : 'cursor-default'} overflow-hidden`}
    >
      {/* Card Content */}
      {!faceDown ? (
        <div className="w-full h-full p-1 flex flex-col">
          {/* Card Name */}
          <div className="text-white text-xs font-bold truncate mb-1">
            {card.name}
          </div>
          
          {/* Card Image/Placeholder */}
          <div className="flex-grow bg-black/30 rounded mb-1"></div>
          
          {/* Card Type and Stats */}
          <div className="flex justify-between items-center">
            <div className="text-white text-[8px]">
              {card.type}
            </div>
            
            {card.type === 'Familiar' && (
              <div className="text-white text-xs font-bold">
                {card.power}/{card.toughness}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
        </div>
      )}
      
      {/* Status Indicators */}
      <div className="absolute top-0 right-0 flex flex-col items-end p-0.5 space-y-0.5">
        {isAttacking && (
          <div className="bg-red-600 rounded-full p-0.5">
            <Sword className="w-3 h-3 text-white" />
          </div>
        )}
        
        {isBlocking && (
          <div className="bg-blue-600 rounded-full p-0.5">
            <Shield className="w-3 h-3 text-white" />
          </div>
        )}
        
        {hasCounters && (
          <div className="bg-purple-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {card.counters}
          </div>
        )}
      </div>
      
      {/* Damage Indicator */}
      {hasDamage && (
        <div className="absolute bottom-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center m-0.5">
          {card.damage}
        </div>
      )}
      
      {/* Azoth Cost Indicator (for cards in hand) */}
      {!faceDown && card.azothCost && zone === 'hand' && (
        <div className="absolute top-0 left-0 bg-yellow-600 text-white text-xs font-bold rounded-br-lg px-1 py-0.5 flex items-center">
          <Zap className="w-3 h-3 mr-0.5" />
          {card.azothCost}
        </div>
      )}
    </motion.div>
  );
};

export default GameCard;