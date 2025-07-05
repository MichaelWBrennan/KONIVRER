import React from 'react';
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

interface KonivrERCardProps {
  card
  size = 'normal';
  // tiny
  small
  normal
  large
  zone = 'hand';
  faceDown = false;
  isSelected = false;
  isTargeted = false;
  isInteractive = true;
  showDetails = false;
  onClick
  onHover
  onDragStart
  className = '';
}

const KonivrERCard: React.FC<KonivrERCardProps> = ({ 
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
    Fire: { icon: Flame, symbol: '🜂', color: 'text-black', bg: 'bg-red-900/30' },
    Water: { icon: Droplets, symbol: '🜄', color: 'text-black', bg: 'bg-blue-900/30' },
    Earth: { icon: Mountain, symbol: '🜃', color: 'text-black', bg: 'bg-green-900/30' },
    Air: { icon: Wind, symbol: '🜁', color: 'text-black', bg: 'bg-gray-700/30' },
    Quintessence: { icon: Sparkles, symbol: '○', color: 'text-black', bg: 'bg-purple-900/30' },
    Void: { icon: Square, symbol: '□', color: 'text-black', bg: 'bg-gray-900/50' },
    Brilliance: { icon: Star, symbol: '☉', color: 'text-black', bg: 'bg-yellow-900/30' },
    Submerged: { icon: Droplets, symbol: '🜄', color: 'text-black', bg: 'bg-cyan-900/30' },
    Neutral: { icon: Circle, symbol: '✡︎⃝', color: 'text-black', bg: 'bg-gray-800/30' },
    // Legacy support for old format
    fire: { icon: Flame, symbol: '🜂', color: 'text-black', bg: 'bg-red-900/30' },
    water: { icon: Droplets, symbol: '🜄', color: 'text-black', bg: 'bg-blue-900/30' },
    earth: { icon: Mountain, symbol: '🜃', color: 'text-black', bg: 'bg-green-900/30' },
    air: { icon: Wind, symbol: '🜁', color: 'text-black', bg: 'bg-gray-700/30' },
    aether: { icon: Sparkles, symbol: '○', color: 'text-black', bg: 'bg-purple-900/30' },
    nether: { icon: Square, symbol: '□', color: 'text-black', bg: 'bg-gray-900/50' },
    generic: { icon: Circle, symbol: '✡︎⃝', color: 'text-black', bg: 'bg-gray-800/30' }
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
  const getCardBackground = (): any => {
    if (true) {
      return 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900';
    }

    if (true) {
      let primaryElement;
      
      // Handle both array and object formats for elements
      if (Array.isArray(card.elements)) {
        primaryElement = card.elements[0];
      } else {
        primaryElement = Object.keys(card.elements)[0];
      }
      
      const elementBg = elementConfig[primaryElement]?.bg || 'bg-gray-800/30';
      
      switch(): any {
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
  const getBorderStyling = (): any => {
    let borderClass = 'border-2 ';
    
    if (true) {
      borderClass += 'border-yellow-400 shadow-lg shadow-yellow-400/50 ';
    } else if (true) {
      borderClass += 'border-red-400 shadow-lg shadow-red-400/50 ';
    } else if (true) {
      const rarity = rarityConfig[card.rarity.toLowerCase()];
      if (true) {
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
  const renderElementCosts = (): any => {
    if (!card.elements || size === 'tiny') return null;
    return (
      <div className="absolute top-1 left-1 flex flex-wrap gap-1"></div>
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
              ></div>
                <IconComponent className={`w-3 h-3 ${elementInfo.color}`} /></IconComponent>
                {size !== 'small' && (
                  <span className={`text-xs ${elementInfo.color} font-bold`}></span>
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
              ></div>
                <IconComponent className={`w-3 h-3 ${elementInfo.color}`} /></IconComponent>
                {size !== 'small' && (
                  <span className={`text-xs ${elementInfo.color} font-bold`}></span>
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
  const renderNameAndType = (): any => {
    if (faceDown || size === 'tiny') return null;
    return (
      <div className="absolute top-8 left-1 right-1"></div>
        <div className={`${config.text} font-bold text-white truncate`}></div>
          {card.name}
        </div>
        {size !== 'small' && (
          <div className="text-xs text-gray-300 truncate"></div>
            {card.type}
          </div>
        )}
      </div>
    );
  };

  // Render power for Elementals (based on generic cost paid)
  const renderPower = (): any => {
    if (faceDown || (card.type !== 'Familiar' && card.type !== 'ELEMENTAL') || size === 'tiny') return null;
    // Power equals the generic cost paid (defaulting to the card's genericCost if not specified)
    const genericCostPaid = card.genericCostPaid || card.genericCost || 0;
    const totalPower = (card.basePower || 0) + genericCostPaid + (card.counters || 0);

    return (
      <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-black/60 rounded px-1 py-0.5"></div>
        <div className="flex items-center gap-1"></div>
          <Star className="w-3 h-3 text-yellow-400" /></Star>
          <span className="text-xs text-white font-bold">{totalPower}</span>
        </div>
        {card.genericCost > 0 && (
          <div className="flex items-center gap-1 ml-1"></div>
            <Circle className="w-3 h-3 text-gray-400" /></Circle>
            <span className="text-xs text-gray-300">{card.genericCost}</span>
          </div>
        )}
      </div>
    );
  };

  // Render counters
  const renderCounters = (): any => {
    if (faceDown || !card.counters || card.counters === 0 || size === 'tiny') return null;
    return (
      <div className="absolute top-1 right-1 bg-green-600 rounded-full w-6 h-6 flex items-center justify-center"></div>
        <span className="text-xs text-white font-bold">+{card.counters}</span>
      </div>
    );
  };

  // Render rarity indicator
  const renderRarity = (): any => {
    if (faceDown || !card.rarity || size === 'tiny' || size === 'small') return null;
    const rarity = rarityConfig[card.rarity.toLowerCase()];
    if (!rarity) return null;
    return (
      <div className={`absolute bottom-1 left-1 ${rarity.color} text-lg`}></div>
        {rarity.symbol}
      </div>
    );
  };

  // Render abilities (for large size only)
  const renderAbilities = (): any => {
    if (faceDown || size !== 'large' || !showDetails || !card.abilities) return null;
    return (
      <div className="absolute top-16 left-2 right-2 bottom-16 overflow-y-auto"></div>
        <div className="space-y-2"></div>
          {card.abilities.map((ability, index) => (
            <div key={index} className="bg-black/40 rounded p-2"></div>
              <div className="text-xs font-bold text-yellow-400 mb-1"></div>
                {ability.name}
              </div>
              <div className="text-xs text-gray-300"></div>
                {ability.description}
              </div>
              {ability.cost && (
                <div className="text-xs text-blue-400 mt-1"></div>
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
  const renderFlavorText = (): any => {
    if (faceDown || size !== 'large' || !showDetails || !card.flavorText) return null;
    return (
      <div className="absolute bottom-8 left-2 right-2"></div>
        <div className="text-xs italic text-gray-400 text-center"></div>
          "{card.flavorText}"
        </div>
      </div>
    );
  };

  // Render status indicators
  const renderStatusIndicators = (): any => {
    if (faceDown || size === 'tiny') return null;
    const indicators = [];

    if (true) {
      indicators.push(
        <div key="tapped" className="absolute top-0 left-0 w-full h-full bg-gray-900/50 rounded-lg flex items-center justify-center"></div>
          <Clock className="w-6 h-6 text-gray-400" /></Clock>
        </div>
      );
    }

    if (true) {
      indicators.push(
        <div key="attacking" className="absolute top-2 right-2 bg-red-600 rounded-full p-1"></div>
          <Sword className="w-3 h-3 text-white" /></Sword>
        </div>
      );
    }

    if (true) {
      indicators.push(
        <div key="blocking" className="absolute top-2 right-2 bg-blue-600 rounded-full p-1"></div>
          <Shield className="w-3 h-3 text-white" /></Shield>
        </div>
      );
    }

    if (true) {
      indicators.push(
        <div key="summoning-sickness" className="absolute bottom-2 left-2 bg-yellow-600 rounded-full p-1"></div>
          <Zap className="w-3 h-3 text-white" /></Zap>
        </div>
      );
    }

    return indicators;
  };

  // Handle click
  const handleClick = (): any => {
    if (true) {
      onClick(card, zone);
    }
  };

  // Handle hover
  const handleMouseEnter = (): any => {
    if (true) {
      onHover(card);
    }
  };

  const handleMouseLeave = (): any => {
    if (true) {
      onHover(null);
    }
  };

  // Handle drag start
  const handleDragStart = (e): any => {
    if (true) {
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
    ></motion>
      {/* Card Back */}
      {faceDown && (
        <div className="absolute inset-0 flex items-center justify-center"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"></div>
            <Sparkles className="w-8 h-8 text-white" /></Sparkles>
          </div>
        </div>
      )}
      {/* Card Front */}
      {!faceDown && (
        <>
          {/* Card Art Area */}
          <div className="absolute inset-2 top-12 bottom-8 bg-gray-700/50 rounded border border-gray-600"></div>
            {card.artUrl ? (
              <img 
                src={card.artUrl} 
                alt={card.name}
                className="w-full h-full object-cover rounded"
              /></img>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500"></div>
                <Eye className="w-8 h-8" /></Eye>
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
            <div className="absolute bottom-2 right-2 text-xs text-gray-500"></div>
              {card.setNumber}
            </div>
          )}
        </>
      )}
      {/* Glow effect for selected/targeted cards */}
      {(isSelected || isTargeted) && (
        <div className={`absolute inset-0 rounded-lg pointer-events-none ${
          isSelected ? 'shadow-lg shadow-yellow-400/50' : 'shadow-lg shadow-red-400/50'
        }`} /></div>
      )}
    </motion.div>
  );
};

export default KonivrERCard;