/**
 * KONIVRER Enhanced Card Component
 * 
 * Displays cards with all KONIVRER-specific parts:
 * - Elements (Fire, Water, Earth, Air, Aether, Nether, Generic)
 * - Name and Type
 * - Abilities and Keywords
 * - Flavor Text
 * - Set/Rarity indicators
 * - Strength/Health for Familiars
 * - Azoth costs and counters
 */

import { motion } from 'framer-motion';
import { 
  Flame, 
  Droplets, 
  Mountain, 
  Wind, 
  Sparkles, 
  Square, 
  Circle,
  Shield,
  Sword,
  Star,
  Zap,
  Crown,
  Eye,
  Clock
} from 'lucide-react';

const KonivrERCard = ({
  card,
  size = 'normal', // tiny, small, normal, large
  zone = 'hand',
  faceDown = false,
  isSelected = false,
  isTargeted = false,
  isInteractive = true,
  showDetails = false,
  onClick,
  onHover,
  onDragStart,
  className = ''
}) => {
  // Element symbols and colors - using alchemical symbols for classic elements
  const elementConfig = {
    Fire: { icon: Flame, symbol: '🜂', color: 'text-red-400', bg: 'bg-red-900/30' },
    Water: { icon: Droplets, symbol: '🜄', color: 'text-blue-400', bg: 'bg-blue-900/30' },
    Earth: { icon: Mountain, symbol: '🜃', color: 'text-green-400', bg: 'bg-green-900/30' },
    Air: { icon: Wind, symbol: '🜁', color: 'text-gray-300', bg: 'bg-gray-700/30' },
    Quintessence: { icon: Sparkles, symbol: '○', color: 'text-purple-400', bg: 'bg-purple-900/30' },
    Void: { icon: Square, symbol: '□', color: 'text-gray-800', bg: 'bg-gray-900/50' },
    Brilliance: { icon: Star, symbol: '☉', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
    Submerged: { icon: Droplets, symbol: '🜄', color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
    Neutral: { icon: Circle, symbol: '⊗', color: 'text-gray-400', bg: 'bg-gray-800/30' },
    // Legacy support for old format
    fire: { icon: Flame, symbol: '🜂', color: 'text-red-400', bg: 'bg-red-900/30' },
    water: { icon: Droplets, symbol: '🜄', color: 'text-blue-400', bg: 'bg-blue-900/30' },
    earth: { icon: Mountain, symbol: '🜃', color: 'text-green-400', bg: 'bg-green-900/30' },
    air: { icon: Wind, symbol: '🜁', color: 'text-gray-300', bg: 'bg-gray-700/30' },
    aether: { icon: Sparkles, symbol: '○', color: 'text-purple-400', bg: 'bg-purple-900/30' },
    nether: { icon: Square, symbol: '□', color: 'text-gray-800', bg: 'bg-gray-900/50' },
    generic: { icon: Circle, symbol: '⊗', color: 'text-gray-400', bg: 'bg-gray-800/30' }
  };

  // Rarity symbols
  const rarityConfig = {
    Common: { symbol: '🜠', color: 'text-gray-400' },
    Uncommon: { symbol: '☽', color: 'text-blue-400' },
    Rare: { symbol: '☉', color: 'text-yellow-400' },
    Special: { symbol: '⚡', color: 'text-purple-400' },
    // Legacy support
    common: { symbol: '🜠', color: 'text-gray-400' },
    uncommon: { symbol: '☽', color: 'text-blue-400' },
    rare: { symbol: '☉', color: 'text-yellow-400' }
  };

  // Size configurations
  const sizeConfig = {
    tiny: { width: 'w-12', height: 'h-16', text: 'text-xs' },
    small: { width: 'w-16', height: 'h-22', text: 'text-xs' },
    normal: { width: 'w-24', height: 'h-32', text: 'text-sm' },
    large: { width: 'w-64', height: 'h-80', text: 'text-base' }
  };

  const config = sizeConfig[size];

  // Get card background based on type and elements
  const getCardBackground = () => {
    if (faceDown) {
      return 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900';
    }

    if (card.elements) {
      let primaryElement;
      
      // Handle both array and object formats for elements
      if (Array.isArray(card.elements)) {
        primaryElement = card.elements[0];
      } else {
        primaryElement = Object.keys(card.elements)[0];
      }
      
      const elementBg = elementConfig[primaryElement]?.bg || 'bg-gray-800/30';
      
      switch (card.type) {
        case 'Familiar':
        case 'ELEMENTAL':
          return `bg-gradient-to-br from-gray-800 to-gray-900 ${elementBg}`;
        case 'Spell':
          return `bg-gradient-to-br from-purple-800 to-purple-900 ${elementBg}`;
        case 'Artifact':
          return `bg-gradient-to-br from-yellow-800 to-yellow-900 ${elementBg}`;
        case 'Flag':
          return `bg-gradient-to-br from-orange-800 to-orange-900 ${elementBg}`;
        default:
          return `bg-gradient-to-br from-gray-800 to-gray-900 ${elementBg}`;
      }
    }

    return 'bg-gradient-to-br from-gray-800 to-gray-900';
  };

  // Get border styling
  const getBorderStyling = () => {
    let borderClass = 'border-2 ';
    
    if (isSelected) {
      borderClass += 'border-yellow-400 shadow-lg shadow-yellow-400/50 ';
    } else if (isTargeted) {
      borderClass += 'border-red-400 shadow-lg shadow-red-400/50 ';
    } else if (card.rarity) {
      const rarity = rarityConfig[card.rarity.toLowerCase()];
      if (rarity) {
        borderClass += `border-${rarity.color.split('-')[1]}-400 `;
      } else {
        borderClass += 'border-gray-600 ';
      }
    } else {
      borderClass += 'border-gray-600 ';
    }

    return borderClass;
  };

  // Render element costs
  const renderElementCosts = () => {
    if (!card.elements || size === 'tiny') return null;

    return (
      <div className="absolute top-1 left-1 flex flex-wrap gap-1">
        {Array.isArray(card.elements) ? (
          // Handle array format (new cards from main database)
          card.elements.map((element, index) => {
            const elementInfo = elementConfig[element];
            if (!elementInfo) return null;

            const IconComponent = elementInfo.icon;
            
            return (
              <div 
                key={`${element}-${index}`}
                className={`flex items-center gap-1 px-1 py-0.5 rounded ${elementInfo.bg} border border-gray-600`}
              >
                <IconComponent className={`w-3 h-3 ${elementInfo.color}`} />
                {size !== 'small' && (
                  <span className={`text-xs ${elementInfo.color} font-bold`}>
                    {elementInfo.symbol}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          // Handle object format (legacy cards)
          Object.entries(card.elements).map(([element, cost]) => {
            if (cost === 0) return null;
            
            const elementInfo = elementConfig[element];
            if (!elementInfo) return null;

            const IconComponent = elementInfo.icon;
            
            return (
              <div 
                key={element}
                className={`flex items-center gap-1 px-1 py-0.5 rounded ${elementInfo.bg} border border-gray-600`}
              >
                <IconComponent className={`w-3 h-3 ${elementInfo.color}`} />
                {size !== 'small' && (
                  <span className={`text-xs ${elementInfo.color} font-bold`}>
                    {cost}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  // Render card name and type
  const renderNameAndType = () => {
    if (faceDown || size === 'tiny') return null;

    return (
      <div className="absolute top-8 left-1 right-1">
        <div className={`${config.text} font-bold text-white truncate`}>
          {card.name}
        </div>
        {size !== 'small' && (
          <div className="text-xs text-gray-300 truncate">
            {card.type}
          </div>
        )}
      </div>
    );
  };

  // Render power for Elementals (based on generic cost paid)
  const renderPower = () => {
    if (faceDown || (card.type !== 'Familiar' && card.type !== 'ELEMENTAL') || size === 'tiny') return null;

    // Power equals the generic cost paid (defaulting to the card's genericCost if not specified)
    const genericCostPaid = card.genericCostPaid || card.genericCost || 0;
    const totalPower = (card.basePower || 0) + genericCostPaid + (card.counters || 0);

    return (
      <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/60 rounded px-1 py-0.5">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-white font-bold">{totalPower}</span>
        </div>
        {card.genericCost > 0 && (
          <div className="flex items-center gap-1 ml-1">
            <Circle className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-300">{card.genericCost}</span>
          </div>
        )}
      </div>
    );
  };

  // Render counters
  const renderCounters = () => {
    if (faceDown || !card.counters || card.counters === 0 || size === 'tiny') return null;

    return (
      <div className="absolute top-1 right-1 bg-green-600 rounded-full w-6 h-6 flex items-center justify-center">
        <span className="text-xs text-white font-bold">+{card.counters}</span>
      </div>
    );
  };

  // Render rarity indicator
  const renderRarity = () => {
    if (faceDown || !card.rarity || size === 'tiny' || size === 'small') return null;

    const rarity = rarityConfig[card.rarity.toLowerCase()];
    if (!rarity) return null;

    return (
      <div className={`absolute bottom-1 left-1 ${rarity.color} text-lg`}>
        {rarity.symbol}
      </div>
    );
  };

  // Render abilities (for large size only)
  const renderAbilities = () => {
    if (faceDown || size !== 'large' || !showDetails || !card.abilities) return null;

    return (
      <div className="absolute top-16 left-2 right-2 bottom-16 overflow-y-auto">
        <div className="space-y-2">
          {card.abilities.map((ability, index) => (
            <div key={index} className="bg-black/40 rounded p-2">
              <div className="text-xs font-bold text-yellow-400 mb-1">
                {ability.name}
              </div>
              <div className="text-xs text-gray-300">
                {ability.description}
              </div>
              {ability.cost && (
                <div className="text-xs text-blue-400 mt-1">
                  Cost: {ability.cost}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render flavor text (for large size only)
  const renderFlavorText = () => {
    if (faceDown || size !== 'large' || !showDetails || !card.flavorText) return null;

    return (
      <div className="absolute bottom-8 left-2 right-2">
        <div className="text-xs italic text-gray-400 text-center">
          "{card.flavorText}"
        </div>
      </div>
    );
  };

  // Render status indicators
  const renderStatusIndicators = () => {
    if (faceDown || size === 'tiny') return null;

    const indicators = [];

    if (card.tapped) {
      indicators.push(
        <div key="tapped" className="absolute top-0 left-0 w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
      );
    }

    if (card.attacking) {
      indicators.push(
        <div key="attacking" className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
          <Sword className="w-3 h-3 text-white" />
        </div>
      );
    }

    if (card.blocking) {
      indicators.push(
        <div key="blocking" className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
          <Shield className="w-3 h-3 text-white" />
        </div>
      );
    }

    if (card.summoningSickness) {
      indicators.push(
        <div key="summoning-sickness" className="absolute bottom-2 left-2 bg-yellow-600 rounded-full p-1">
          <Zap className="w-3 h-3 text-white" />
        </div>
      );
    }

    return indicators;
  };

  // Handle click
  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(card, zone);
    }
  };

  // Handle hover
  const handleMouseEnter = () => {
    if (onHover && !faceDown) {
      onHover(card);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    if (isInteractive && onDragStart) {
      onDragStart(card, zone);
    }
  };

  return (
    <motion.div
      className={`
        ${config.width} ${config.height}
        ${getCardBackground()}
        ${getBorderStyling()}
        rounded-lg relative overflow-hidden cursor-pointer
        transition-all duration-200
        ${isInteractive ? 'hover:scale-105 hover:shadow-lg' : ''}
        ${className}
      `}
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      draggable={isInteractive}
      onDragStart={handleDragStart}
      layout
    >
      {/* Card Back */}
      {faceDown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
      )}

      {/* Card Front */}
      {!faceDown && (
        <>
          {/* Card Art Area */}
          <div className="absolute inset-2 top-12 bottom-8 bg-gray-700/50 rounded border border-gray-600">
            {card.artUrl ? (
              <img 
                src={card.artUrl} 
                alt={card.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Eye className="w-8 h-8" />
              </div>
            )}
          </div>

          {renderElementCosts()}
          {renderNameAndType()}
          {renderPower()}
          {renderCounters()}
          {renderRarity()}
          {renderAbilities()}
          {renderFlavorText()}
          {renderStatusIndicators()}

          {/* Set Number (for large cards) */}
          {size === 'large' && showDetails && card.setNumber && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {card.setNumber}
            </div>
          )}
        </>
      )}

      {/* Glow effect for selected/targeted cards */}
      {(isSelected || isTargeted) && (
        <div className={`absolute inset-0 rounded-lg pointer-events-none ${
          isSelected ? 'shadow-lg shadow-yellow-400/50' : 'shadow-lg shadow-red-400/50'
        }`} />
      )}
    </motion.div>
  );
};

export default KonivrERCard;