import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';

/**
 * Renders a zone of cards with different layout options
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
  maxCards = 10
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
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
  const isCardSelected = (card) => {
    return selectedCard && selectedCard.id === card.id;
  };
  
  // Check if a card is targeted
  const isCardTargeted = (card) => {
    return targets.some(target => target.card.id === card.id);
  };
  
  // Calculate card positions based on layout
  const getCardStyles = (index) => {
    const totalCards = Math.min(cards.length, maxCards);
    
    switch (layout) {
      case 'fan':
        // Fan layout (for hand)
        const fanAngle = Math.min(5, 30 / totalCards);
        const fanSpread = Math.min(20, 200 / totalCards);
        const baseRotation = -((totalCards - 1) * fanAngle) / 2;
        const baseTranslation = -((totalCards - 1) * fanSpread) / 2;
        
        return {
          transform: `translateX(${baseTranslation + index * fanSpread}px) rotate(${baseRotation + index * fanAngle}deg)`,
          zIndex: index
        };
        
      case 'grid':
        // Grid layout (for field)
        const cardsPerRow = 5;
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        const gridGap = 8;
        const cardWidth = 80;
        const cardHeight = 112;
        
        return {
          transform: `translate(${col * (cardWidth + gridGap)}px, ${row * (cardHeight + gridGap)}px)`,
          position: 'absolute',
          zIndex: index
        };
        
      case 'row':
        // Row layout (for azoth row)
        const rowSpacing = 8;
        
        return {
          transform: `translateX(${index * (80 + rowSpacing)}px)`,
          zIndex: index
        };
        
      case 'stack':
        // Stack layout (for deck, discard)
        return {
          transform: `translateX(${index * 2}px) translateY(${index * 2}px)`,
          zIndex: index
        };
        
      default:
        return {};
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${
        layout === 'grid' 
          ? 'w-[440px] h-[240px]' 
          : layout === 'fan' 
            ? 'w-[500px] h-[140px]' 
            : layout === 'row' 
              ? 'w-[440px] h-[120px]' 
              : 'w-[100px] h-[140px]'
      }`}
    >
      {cards.slice(0, maxCards).map((card, index) => (
        <div 
          key={card.id} 
          className="absolute"
          style={getCardStyles(index)}
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
        </div>
      ))}
      
      {/* Show count if there are more cards than maxCards */}
      {cards.length > maxCards && (
        <div className="absolute top-0 right-0 bg-black/70 text-white text-xs font-bold rounded-full px-2 py-1">
          +{cards.length - maxCards}
        </div>
      )}
    </div>
  );
};

export default CardZone;