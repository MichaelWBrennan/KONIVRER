import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../../data/cards';
import { audioManager } from '../../game/GameEngine';

// Hybrid map themes combining MTG Arena functionality with Inscryption atmosphere
export type HybridMapTheme =
  | 'mysterious-cabin'
  | 'ancient-study'
  | 'ritual-chamber'
  | 'traders-den';

// Interactive environmental elements inspired by Inscryption
interface EnvironmentalElement {
  id: string;
  name: string;
  type: 'book' | 'candle' | 'scale' | 'totem' | 'artifact' | 'scroll';
  position: { x: number; y: number };
  isInteractive: boolean;
  loreText?: string;
  gameEffect?: 'reveal-card' | 'add-mana' | 'draw-card' | 'scry' | 'none';
  isActivated?: boolean;
}

// Enhanced card interface for hybrid system
interface HybridGameCard extends Card {
  gameId: string;
  zone: 'hand' | 'battlefield' | 'graveyard' | 'library' | 'exile';
  owner: 'player' | 'opponent';
  x: number;
  y: number;
  isSelected?: boolean;
  canPlay?: boolean;
  gridPosition?: { row: number; col: number }; // Inscryption-style positioning
}

interface HybridBattlefieldMapProps {
  theme: HybridMapTheme;
  onThemeChange?: (theme: HybridMapTheme) => void;
  onEnvironmentalInteraction?: (element: EnvironmentalElement) => void;
  className?: string;
}

const HybridBattlefieldMap: React.FC<HybridBattlefieldMapProps> = ({
  theme = 'mysterious-cabin',
  onThemeChange,
  onEnvironmentalInteraction,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<HybridGameCard | null>(null);
  const [environmentalElements, setEnvironmentalElements] = useState<
    EnvironmentalElement[]
  >([]);
  const [playerHand, setPlayerHand] = useState<HybridGameCard[]>([]);
  const [playerBattlefield, setPlayerBattlefield] = useState<HybridGameCard[]>(
    [],
  );
  const [opponentBattlefield, setOpponentBattlefield] = useState<
    HybridGameCard[]
  >([]);
  const [atmosphericLighting, setAtmosphericLighting] = useState<
    'candlelit' | 'torchlit' | 'moonlit'
  >('candlelit');

  // Initialize environmental elements based on theme
  useEffect(() => {
    const elements = getThemeEnvironmentalElements(theme);
    setEnvironmentalElements(elements);
  }, [theme]);

  // Initialize starting hand
  useEffect(() => {
    const initialHand = KONIVRER_CARDS.slice(0, 7).map((card, index) => ({
      ...card,
      gameId: `player-${card.id}-${index}`,
      zone: 'hand' as const,
      owner: 'player' as const,
      x: index * 60,
      y: 0,
      isSelected: false,
      canPlay: true,
      gridPosition: { row: 0, col: index },
    }));
    setPlayerHand(initialHand);
  }, []);

  const getThemeEnvironmentalElements = (
    theme: HybridMapTheme,
  ): EnvironmentalElement[] => {
    const baseElements: Record<HybridMapTheme, EnvironmentalElement[]> = {
      'mysterious-cabin': [
        {
          id: 'cabin-book-1',
          name: 'Ancient Tome',
          type: 'book',
          position: { x: 20, y: 20 },
          isInteractive: true,
          loreText:
            'A leather-bound tome filled with card battle strategies...',
          gameEffect: 'scry',
        },
        {
          id: 'cabin-candle-1',
          name: 'Flickering Candle',
          type: 'candle',
          position: { x: 80, y: 25 },
          isInteractive: true,
          loreText: 'The flame dances, revealing hidden knowledge...',
          gameEffect: 'reveal-card',
        },
        {
          id: 'cabin-scale-1',
          name: "Merchant's Scale",
          type: 'scale',
          position: { x: 15, y: 80 },
          isInteractive: true,
          loreText: 'Balance is everything in the art of card battle...',
          gameEffect: 'add-mana',
        },
      ],
      'ancient-study': [
        {
          id: 'study-scroll-1',
          name: 'Mystical Scroll',
          type: 'scroll',
          position: { x: 25, y: 15 },
          isInteractive: true,
          loreText: 'Ancient knowledge of elemental combinations...',
          gameEffect: 'draw-card',
        },
        {
          id: 'study-totem-1',
          name: 'Wisdom Totem',
          type: 'totem',
          position: { x: 75, y: 20 },
          isInteractive: true,
          loreText: 'A carved figure that seems to watch your every move...',
          gameEffect: 'scry',
        },
        {
          id: 'study-artifact-1',
          name: 'Scrying Crystal',
          type: 'artifact',
          position: { x: 50, y: 85 },
          isInteractive: true,
          loreText: 'Peer into the future of your deck...',
          gameEffect: 'scry',
        },
      ],
      'ritual-chamber': [
        {
          id: 'chamber-brazier-1',
          name: 'Ritual Brazier',
          type: 'candle',
          position: { x: 30, y: 30 },
          isInteractive: true,
          loreText: 'Sacred flames that empower your cards...',
          gameEffect: 'add-mana',
        },
        {
          id: 'chamber-totem-1',
          name: 'Stone Guardian',
          type: 'totem',
          position: { x: 70, y: 70 },
          isInteractive: true,
          loreText: 'An ancient protector of ritual knowledge...',
          gameEffect: 'reveal-card',
        },
        {
          id: 'chamber-artifact-1',
          name: 'Ritual Dagger',
          type: 'artifact',
          position: { x: 50, y: 50 },
          isInteractive: true,
          loreText: 'A ceremonial blade used to cut through deception...',
          gameEffect: 'reveal-card',
        },
      ],
      'traders-den': [
        {
          id: 'den-scale-1',
          name: 'Golden Scale',
          type: 'scale',
          position: { x: 40, y: 30 },
          isInteractive: true,
          loreText: 'Every card has its price in the right market...',
          gameEffect: 'draw-card',
        },
        {
          id: 'den-book-1',
          name: 'Ledger of Trades',
          type: 'book',
          position: { x: 20, y: 70 },
          isInteractive: true,
          loreText: 'Records of legendary card exchanges...',
          gameEffect: 'scry',
        },
        {
          id: 'den-artifact-1',
          name: "Trader's Compass",
          type: 'artifact',
          position: { x: 75, y: 60 },
          isInteractive: true,
          loreText: 'Points toward profitable card combinations...',
          gameEffect: 'add-mana',
        },
      ],
    };
    return baseElements[theme];
  };

  const handleEnvironmentalClick = useCallback(
    (element: EnvironmentalElement) => {
      if (!element.isInteractive || element.isActivated) return;

      // Play atmospheric interaction sound
      audioManager.playCardHover();

      // Activate the element
      setEnvironmentalElements(prev =>
        prev.map(el =>
          el.id === element.id ? { ...el, isActivated: true } : el,
        ),
      );

      // Apply game effect
      applyEnvironmentalEffect(element);

      // Callback to parent
      if (onEnvironmentalInteraction) {
        onEnvironmentalInteraction(element);
      }

      // Show lore text if available
      if (element.loreText) {
        console.log(`[${element.name}]: ${element.loreText}`);
      }
    },
    [onEnvironmentalInteraction],
  );

  const applyEnvironmentalEffect = (element: EnvironmentalElement) => {
    switch (element.gameEffect) {
      case 'reveal-card':
        // Reveal top card of deck (simulated)
        console.log('🔍 Revealed a card from your deck!');
        break;
      case 'add-mana':
        // Add mana (simulated)
        console.log('⚡ Gained additional mana!');
        break;
      case 'draw-card':
        // Draw a card (simulated)
        if (KONIVRER_CARDS.length > playerHand.length) {
          const newCard = KONIVRER_CARDS[playerHand.length];
          const newGameCard: HybridGameCard = {
            ...newCard,
            gameId: `drawn-${newCard.id}-${Date.now()}`,
            zone: 'hand',
            owner: 'player',
            x: playerHand.length * 60,
            y: 0,
            gridPosition: { row: 0, col: playerHand.length },
          };
          setPlayerHand(prev => [...prev, newGameCard]);
        }
        console.log('🃏 Drew a card!');
        break;
      case 'scry':
        // Scry (look at top cards)
        console.log('🔮 Looked at the top cards of your deck!');
        break;
    }
  };

  const getThemeStyles = (theme: HybridMapTheme) => {
    const styles: Record<HybridMapTheme, React.CSSProperties> = {
      'mysterious-cabin': {
        background:
          'linear-gradient(135deg, #2c1810 0%, #1a0f0a 50%, #0f0805 100%)',
        boxShadow: 'inset 0 0 100px rgba(255, 140, 0, 0.1)',
      },
      'ancient-study': {
        background:
          'linear-gradient(135deg, #1a1520 0%, #0f0a15 50%, #0a0510 100%)',
        boxShadow: 'inset 0 0 100px rgba(138, 43, 226, 0.1)',
      },
      'ritual-chamber': {
        background:
          'linear-gradient(135deg, #2c1c1c 0%, #1a1010 50%, #0f0808 100%)',
        boxShadow: 'inset 0 0 100px rgba(220, 20, 60, 0.1)',
      },
      'traders-den': {
        background:
          'linear-gradient(135deg, #1c1c0f 0%, #15150a 50%, #0a0a05 100%)',
        boxShadow: 'inset 0 0 100px rgba(255, 215, 0, 0.1)',
      },
    };
    return styles[theme];
  };

  const EnvironmentalElement: React.FC<{ element: EnvironmentalElement }> = ({
    element,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getElementIcon = (type: EnvironmentalElement['type']) => {
      const icons = {
        book: '📚',
        candle: '🕯️',
        scale: '⚖️',
        totem: '🗿',
        artifact: '🔮',
        scroll: '📜',
      };
      return icons[type];
    };

    return (
      <motion.div
        className={`environmental-element ${element.type} ${element.isActivated ? 'activated' : ''}`}
        style={{
          position: 'absolute',
          left: `${element.position.x}%`,
          top: `${element.position.y}%`,
          cursor: element.isInteractive ? 'pointer' : 'default',
          fontSize: '24px',
          zIndex: 10,
        }}
        onClick={() => handleEnvironmentalClick(element)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={element.isInteractive ? { scale: 1.2, rotate: 5 } : {}}
        whileTap={element.isInteractive ? { scale: 0.9 } : {}}
        animate={{
          opacity: element.isActivated ? 0.6 : 1,
          filter: element.isActivated ? 'grayscale(0.5)' : 'none',
        }}
      >
        {getElementIcon(element.type)}
        <AnimatePresence>
          {isHovered && element.isInteractive && (
            <motion.div
              className="element-tooltip"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 20,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {element.name}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const HybridCardComponent: React.FC<{ card: HybridGameCard }> = ({
    card,
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get the card image path based on card name
    const getCardImagePath = (cardName: string) => {
      // Convert card name to match file naming convention (uppercase, handle special characters)
      const normalizedName = cardName.toUpperCase().replace(/[^A-Z0-9]/g, '');
      return `/assets/cards/${normalizedName}.png`;
    };

    const cardImagePath = getCardImagePath(card.name);

    return (
      <motion.div
        className={`hybrid-card-3d ${card.zone} ${card.owner} ${card.isSelected ? 'selected' : ''}`}
        style={{
          perspective: '1000px',
          position: 'relative',
        }}
        onClick={() => setSelectedCard(card)}
        whileHover={{
          y: -8,
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <motion.div
          className="card-3d-inner"
          style={{
            width: '70px',
            height: '98px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: card.isSelected
              ? '0 8px 25px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
            background:
              imageLoaded && !imageError
                ? 'transparent'
                : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
            border: card.isSelected
              ? '2px solid #FFD700'
              : '1px solid rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            rotateY: card.isSelected ? 5 : 0,
            z: card.isSelected ? 20 : 0,
          }}
          whileHover={{
            rotateY: 10,
            rotateX: 5,
            z: 30,
            boxShadow:
              '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 255, 255, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Card Front */}
          <div
            className="card-front"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              backfaceVisibility: 'hidden',
              overflow: 'hidden',
            }}
          >
            {!imageError ? (
              <>
                <img
                  src={cardImagePath}
                  alt={card.name}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: imageLoaded ? 'block' : 'none',
                  }}
                />
                {/* Loading state */}
                {!imageLoaded && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                      color: '#fff',
                      fontSize: '8px',
                    }}
                  >
                    <div>Loading...</div>
                  </div>
                )}
              </>
            ) : (
              /* Fallback design when image fails to load */
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                  color: '#fff',
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    fontSize: '9px',
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    color: '#ffd700',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {card.cost}
                </div>
                {card.type === 'Familiar' && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '8px',
                      color: '#ff6b6b',
                    }}
                  >
                    {card.strength || '?'}
                  </div>
                )}
              </div>
            )}

            {/* Card info overlay for 3D effect */}
            {imageLoaded && !imageError && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background:
                    'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  color: '#fff',
                  fontSize: '8px',
                  padding: '2px 4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                  {card.cost}
                </span>
                {card.type === 'Familiar' && (
                  <span style={{ color: '#ff6b6b' }}>
                    {card.strength || '?'}
                  </span>
                )}
              </div>
            )}

            {/* Selected indicator */}
            {card.isSelected && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
                  pointerEvents: 'none',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </div>

          {/* Environmental bonus indicator */}
          {card.zone === 'battlefield' &&
            environmentalElements.some(el => el.isActivated) && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #4CAF50, #2E7D32)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  zIndex: 10,
                  border: '1px solid #fff',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 2px 8px rgba(76, 175, 80, 0.4)',
                    '0 4px 16px rgba(76, 175, 80, 0.8)',
                    '0 2px 8px rgba(76, 175, 80, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ✨
              </motion.div>
            )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className={`hybrid-battlefield-map ${theme} ${className}`}
      style={{
        width: '100%',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        ...getThemeStyles(theme),
      }}
    >
      {/* Atmospheric lighting overlay */}
      <div
        className="atmospheric-lighting"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            atmosphericLighting === 'candlelit'
              ? 'radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.1) 0%, transparent 70%)'
              : atmosphericLighting === 'torchlit'
                ? 'radial-gradient(circle at 30% 30%, rgba(255, 69, 0, 0.15) 0%, transparent 60%)'
                : 'radial-gradient(circle at 70% 20%, rgba(200, 200, 255, 0.1) 0%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Environmental elements */}
      {environmentalElements.map(element => (
        <EnvironmentalElement key={element.id} element={element} />
      ))}

      {/* Player hand area */}
      <motion.div
        className="player-hand-area"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '4px',
          zIndex: 15,
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {playerHand.map((card, index) => (
          <HybridCardComponent key={card.gameId} card={card} />
        ))}
      </motion.div>

      {/* Player battlefield */}
      <motion.div
        className="player-battlefield"
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 12,
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {playerBattlefield.map((card, index) => (
          <HybridCardComponent key={card.gameId} card={card} />
        ))}
      </motion.div>

      {/* Opponent battlefield */}
      <motion.div
        className="opponent-battlefield"
        style={{
          position: 'absolute',
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 12,
        }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {opponentBattlefield.map((card, index) => (
          <HybridCardComponent key={card.gameId} card={card} />
        ))}
      </motion.div>

      {/* Theme selector */}
      <motion.div
        className="theme-selector"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 20,
        }}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <select
          value={theme}
          onChange={e => onThemeChange?.(e.target.value as HybridMapTheme)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
          }}
        >
          <option value="mysterious-cabin">Mysterious Cabin</option>
          <option value="ancient-study">Ancient Study</option>
          <option value="ritual-chamber">Ritual Chamber</option>
          <option value="traders-den">Trader's Den</option>
        </select>
      </motion.div>

      {/* Lore display */}
      <motion.div
        className="lore-display"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          maxWidth: '200px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '11px',
          zIndex: 20,
        }}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div
          style={{ fontWeight: 'bold', marginBottom: '4px', color: '#ffd700' }}
        >
          {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div>
          Click on environmental elements to discover their secrets and gain
          strategic advantages.
        </div>
      </motion.div>
    </div>
  );
};

export default HybridBattlefieldMap;
