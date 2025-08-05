import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KONIVRER_CARDS } from '../data/cards';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Flag';
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[];
  keywords: string[];
  strength?: number;
  artist?: string;
}

const SimpleCardImagesPage: React.FC = () => {
  // Load all cards directly
  const allCards = KONIVRER_CARDS || [];

  // Responsive design state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Dynamic styling based on device
  const getContainerStyle = () => {
    if (isMobile) {
      return {
        padding: '10px',
        maxWidth: '100%',
        margin: '0',
      };
    } else if (isTablet) {
      return {
        padding: '15px',
        maxWidth: '100%',
        margin: '0 auto',
      };
    } else {
      return {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      };
    }
  };

  const getGridStyle = () => {
    if (isMobile) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
      };
    } else if (isTablet) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '18px',
      };
    } else {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      };
    }
  };

  const getCardStyle = () => {
    return {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '12px',
      padding: '12px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative' as const,
      aspectRatio: '2.5/3.5', // Traditional card aspect ratio
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    };
  };

  const getCardImageStyle = () => {
    return {
      width: '100%',
      height: '60%',
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      fontSize: isMobile ? '24px' : '32px',
      backgroundImage: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
    };
  };

  const getElementIcon = (elements: string[]) => {
    const elementIcons = {
      fire: '🜂',
      water: '🜄',
      earth: '🜃',
      air: '🜁',
      nether: '□',
      aether: '○',
      generic: '✡',
    };
    
    return elements.map(element => elementIcons[element.toLowerCase() as keyof typeof elementIcons] || '✡').join('');
  };

  return (
    <div style={getContainerStyle()}>
      {/* Simple header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '20px' : '30px',
        }}
      >
        <h1 style={{ 
          color: '#d4af37', 
          fontSize: isMobile ? '24px' : '32px',
          marginBottom: '10px' 
        }}>
          Card Gallery
        </h1>
        <p style={{ 
          color: '#ccc', 
          fontSize: isMobile ? '14px' : '16px' 
        }}>
          {allCards.length} cards available • Use the search button below to find specific cards
        </p>
      </motion.div>

      {/* Card Images Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={getGridStyle()}
      >
        {allCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)' }}
            style={getCardStyle()}
            data-card-id={card.id}
            data-card-name={card.name}
            data-card-type={card.type}
            data-card-elements={card.elements.join(',')}
          >
            {/* Card Image Area */}
            <div style={getCardImageStyle()}>
              <div style={{ 
                textAlign: 'center',
                color: '#d4af37',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{ fontSize: isMobile ? '20px' : '24px' }}>
                  {getElementIcon(card.elements)}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '10px' : '12px',
                  opacity: 0.7,
                  fontWeight: 'bold'
                }}>
                  {card.type}
                </div>
              </div>
            </div>

            {/* Card Info */}
            <div style={{ 
              height: '40%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{
                  color: '#d4af37',
                  fontSize: isMobile ? '12px' : '14px',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {card.name}
                </h3>
                <div style={{ 
                  fontSize: isMobile ? '10px' : '11px',
                  color: '#ccc',
                  marginBottom: '4px'
                }}>
                  Cost: {card.cost} | {card.rarity}
                </div>
              </div>
              
              {card.strength && (
                <div style={{
                  fontSize: isMobile ? '10px' : '11px',
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '2px 4px',
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  borderRadius: '4px',
                  marginTop: 'auto'
                }}>
                  Strength: {card.strength}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          textAlign: 'center',
          marginTop: isMobile ? '20px' : '30px',
          padding: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}
      >
        <p style={{ 
          color: '#888', 
          fontSize: isMobile ? '12px' : '14px',
          margin: 0
        }}>
          💡 Tip: Use the search button (🔍) in the bottom navigation to find specific cards by name, type, cost, or elements.
        </p>
      </motion.div>
    </div>
  );
};

export default SimpleCardImagesPage;