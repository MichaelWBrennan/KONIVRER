import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';

/**
 * Renders a zone of cards with different layout options
 * Enhanced to be more like MTG Arena
 */
const CardZone = ({
  cards = [],
  zone,
  layout = 'grid', // 'grid', 'fan', 'row', 'stack'
  faceDown = false,
  onCardSelect,
  onCardHover,
  selectedCard,
  targetMode,
  targets = [],
  isInteractive = true,
  maxCards = 10,
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Update container width on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setContainerWidth(containerRef.current.offsetWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Check if a card is selected
  const isCardSelected = card => {
    return selectedCard && selectedCard.id === card.id;
  };

  // Check if a card is targeted
  const isCardTargeted = card => {
    return targets.some(target => target.card.id === card.id);
  };

  // Calculate card positions based on layout
  const getCardStyles = index => {
    const totalCards = Math.min(cards.length, maxCards);
    const isMobile = window.innerWidth < 768;
    
    // Adjust spacing for mobile
    const mobileScaleFactor = isMobile ? 0.8 : 1;

    switch (layout) {
      case 'fan':
        // Fan layout (for hand) - MTG Arena style
        const fanAngle = Math.min(4, 25 / totalCards);
        const fanSpread = Math.min(18, 180 / totalCards) * mobileScaleFactor;
        const baseRotation = -((totalCards - 1) * fanAngle) / 2;
        const baseTranslation = -((totalCards - 1) * fanSpread) / 2;
        
        // MTG Arena style: cards rise up when hovered
        const hoverLift = isHovering ? -10 : 0;

        return {
          transform: `translateX(${baseTranslation + index * fanSpread}px) translateY(${hoverLift}px) rotate(${baseRotation + index * fanAngle}deg)`,
          zIndex: index,
          transition: 'transform 0.2s ease-out',
        };

      case 'grid':
        // Grid layout (for battlefield) - MTG Arena style
        const cardsPerRow = isMobile ? 4 : 5;
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        const gridGap = isMobile ? 6 : 8;
        const cardWidth = 80 * mobileScaleFactor;
        const cardHeight = 112 * mobileScaleFactor;

        return {
          transform: `translate(${col * (cardWidth + gridGap)}px, ${row * (cardHeight + gridGap)}px)`,
          position: 'absolute',
          zIndex: index,
        };

      case 'row':
        // Row layout (for azoth/mana row) - MTG Arena style
        const rowSpacing = isMobile ? 6 : 8;
        const cardSize = 80 * mobileScaleFactor;

        return {
          transform: `translateX(${index * (cardSize + rowSpacing)}px)`,
          zIndex: index,
        };

      case 'stack':
        // Stack layout (for deck, discard) - MTG Arena style with 3D effect
        return {
          transform: `translateX(${index * 1.5}px) translateY(${index * 1.5}px) translateZ(${index * 0.5}px)`,
          zIndex: index,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        };

      default:
        return {};
    }
  };

  // Get zone-specific styling
  const getZoneStyle = () => {
    switch (zone) {
      case 'hand':
        return 'bg-black/10 backdrop-blur-sm rounded-xl p-2';
      case 'field':
        return 'bg-black/5 rounded-xl p-2';
      case 'azothRow':
        return 'bg-yellow-900/20 backdrop-blur-sm rounded-xl p-2';
      default:
        return '';
    }
  };

  // Get animation for card entering the zone
  const getEnterAnimation = () => {
    switch (zone) {
      case 'hand':
        return {
          initial: { scale: 0.8, opacity: 0, y: 50 },
          animate: { scale: 1, opacity: 1, y: 0 },
          exit: { scale: 0.8, opacity: 0, y: 50 },
          transition: { duration: 0.3 }
        };
      case 'field':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.3 }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 }
        };
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${getZoneStyle()} ${
        layout === 'grid'
          ? 'w-[440px] h-[240px] md:w-[440px] md:h-[240px]'
          : layout === 'fan'
            ? 'w-[300px] h-[140px] md:w-[500px] md:h-[140px]'
            : layout === 'row'
              ? 'w-[300px] h-[120px] md:w-[440px] md:h-[120px]'
              : 'w-[100px] h-[140px]'
      }`}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {cards.slice(0, maxCards).map((card, index) => (
          <motion.div 
            key={card.id} 
            className="absolute"
            style={getCardStyles(index)}
            {...getEnterAnimation()}
          >
            <GameCard
              card={card}
              faceDown={faceDown}
              isSelected={isCardSelected(card)}
              isTargeted={isCardTargeted(card)}
              isInteractive={isInteractive}
              onClick={() => isInteractive && onCardSelect(card, zone)}
              onHover={() => onCardHover(card)}
              targetMode={targetMode}
              zone={zone}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show count if there are more cards than maxCards - MTG Arena style */}
      {cards.length > maxCards && (
        <motion.div 
          className="absolute top-0 right-0 bg-gradient-to-br from-black/80 to-gray-800/80 text-white text-xs font-bold rounded-full px-2 py-1 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          +{cards.length - maxCards}
        </motion.div>
      )}
      
      {/* Zone label - MTG Arena style */}
      {cards.length > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-0.5 rounded-tr-md rounded-bl-md opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
        >
          {zone === 'hand' && 'Hand'}
          {zone === 'field' && 'Battlefield'}
          {zone === 'azothRow' && 'Azoth'}
          {zone === 'graveyard' && 'Graveyard'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CardZone;
