import { motion } from 'framer-motion';
import { Shield, Sword, Zap, Star, Clock, Sparkles, AlertCircle } from 'lucide-react';

/**
 * Renders a single card in the game with animations and status indicators
 * Enhanced to be more like MTG Arena
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
  zone,
}) => {
  // Determine if card is a valid target in target mode
  const isValidTarget = targetMode && card.isValidTarget;

  // Determine card status indicators
  const isTapped = card.tapped;
  const isAttacking = card.attacking;
  const isBlocking = card.blocking;
  const hasCounters = card.counters && card.counters > 0;
  const hasDamage = card.damage && card.damage > 0;
  const hasSummoningSickness = card.summoningSickness;
  const hasAbility = card.abilities && card.abilities.length > 0;
  const isLegendary = card.rarity === 'legendary';

  // Card appearance based on type
  const getCardBackground = () => {
    if (faceDown) return 'bg-gradient-to-br from-blue-900 to-blue-800';

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
    if (faceDown) return '';
    
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

  // Get hover animation based on card rarity
  const getHoverAnimation = () => {
    if (!isInteractive) return {};
    
    const baseHover = { scale: 1.1, zIndex: 50 };
    
    if (!card.rarity || faceDown) return baseHover;
    
    switch (card.rarity.toLowerCase()) {
      case 'mythic':
      case 'legendary':
        return { 
          ...baseHover,
          boxShadow: '0 0 15px rgba(255, 165, 0, 0.7)'
        };
      case 'rare':
        return { 
          ...baseHover,
          boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)'
        };
      case 'uncommon':
        return { 
          ...baseHover,
          boxShadow: '0 0 10px rgba(173, 216, 230, 0.5)'
        };
      default:
        return baseHover;
    }
  };

  return (
    <motion.div
      whileHover={getHoverAnimation()}
      animate={{
        y: isSelected ? -20 : 0,
        rotate: isTapped ? 90 : 0,
        scale: isTargeted ? 1.1 : 1,
        boxShadow: isSelected 
          ? '0 0 15px rgba(59, 130, 246, 0.8)' 
          : isTargeted 
            ? '0 0 15px rgba(245, 158, 11, 0.8)'
            : isValidTarget
              ? '0 0 15px rgba(16, 185, 129, 0.8)'
              : 'none',
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onHoverStart={() => onHover(card)}
      onHoverEnd={() => onHover(null)}
      className={`w-20 h-28 rounded-lg shadow-lg border-2 ${getCardBackground()} ${getRarityStyle()} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isTargeted ? 'ring-2 ring-yellow-500' : ''} ${
        isValidTarget ? 'ring-2 ring-green-500' : ''
      } ${isInteractive ? 'cursor-pointer' : 'cursor-default'} overflow-hidden game-card`}
    >
      {/* Card Content */}
      {!faceDown ? (
        <div className="w-full h-full p-1 flex flex-col relative">
          {/* Card Name with Legendary Crown if applicable */}
          <div className="text-white text-xs font-bold truncate mb-1 flex items-center">
            {isLegendary && (
              <Crown className="w-3 h-3 text-yellow-400 mr-0.5 inline-block" />
            )}
            {card.name}
          </div>

          {/* Card Image/Placeholder with gradient overlay */}
          <div className="flex-grow bg-black/40 rounded mb-1 relative overflow-hidden">
            {/* Simulated card art with gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getCardFrameStyle()}`}></div>
            
            {/* Card type icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              {card.type === 'Familiar' && <Shield className="w-8 h-8 text-white" />}
              {card.type === 'Spell' && <Sparkles className="w-8 h-8 text-white" />}
              {card.type === 'Azoth' && <Zap className="w-8 h-8 text-white" />}
            </div>
          </div>

          {/* Card Type and Stats */}
          <div className="flex justify-between items-center">
            <div className="text-white text-[8px]">{card.type}</div>

            {card.type === 'Familiar' && (
              <div className="text-white text-xs font-bold">
                {card.power}/{card.toughness}
              </div>
            )}
          </div>
          
          {/* Ability indicator */}
          {hasAbility && (
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-3 h-3">
              <div className="w-full h-full bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-900">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-lg">K</span>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute top-0 right-0 flex flex-col items-end p-0.5 space-y-0.5">
        {isAttacking && (
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-0.5 shadow-lg">
            <Sword className="w-3 h-3 text-white" />
          </div>
        )}

        {isBlocking && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-0.5 shadow-lg">
            <Shield className="w-3 h-3 text-white" />
          </div>
        )}

        {hasCounters && (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
            {card.counters}
          </div>
        )}
      </div>

      {/* Damage Indicator */}
      {hasDamage && (
        <div className="absolute bottom-0 right-0 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center m-0.5 shadow-lg">
          {card.damage}
        </div>
      )}

      {/* Summoning Sickness Indicator */}
      {hasSummoningSickness && (
        <div className="absolute bottom-0 left-0 m-0.5">
          <Clock className="w-4 h-4 text-gray-300 drop-shadow-lg" />
        </div>
      )}

      {/* Azoth Cost Indicator (for cards in hand) */}
      {!faceDown && card.azothCost && zone === 'hand' && (
        <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-br-lg px-1 py-0.5 flex items-center shadow-lg">
          <Zap className="w-3 h-3 mr-0.5" />
          {card.azothCost}
        </div>
      )}
      
      {/* Foil overlay effect for premium cards */}
      {!faceDown && card.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 mix-blend-overlay pointer-events-none rounded-lg"></div>
      )}
    </motion.div>
  );
};

export default GameCard;
