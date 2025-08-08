import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KONIVRER_CARDS, Card } from '../../data/cards';
import { audioManager } from '../../game/GameEngine';
import { HybridMapTheme } from './HybridBattlefieldMap';
import './FirstPersonBattlefield.css';

// Enhanced card interface for first-person 2.5D system
interface FirstPersonGameCard extends Card {
  gameId: string;
  zone: 'hand' | 'battlefield' | 'graveyard' | 'library' | 'exile' | 'stack';
  owner: 'player' | 'opponent';
  power?: number;
  toughness?: number;
  manaCost: number;
  cardTypes: string[];
  isTapped?: boolean;
  isSelected?: boolean;
  canPlay?: boolean;
  // 2.5D positioning with depth layers (Godot-inspired)
  position3D?: { 
    x: number; 
    y: number; 
    z: number; // depth layer for sorting
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scale: number;
  };
  mysteryValue?: number;
  environmentalBonus?: string;
}

// Environmental elements positioned in 3D space
interface EnvironmentalElement3D {
  id: string;
  name: string;
  type: 'book' | 'candle' | 'scale' | 'totem' | 'artifact' | 'scroll';
  position3D: { x: number; y: number; z: number; scale: number };
  sprite: string; // 2D sprite path
  isInteractive: boolean;
  loreText?: string;
  gameEffect?: 'reveal-card' | 'add-mana' | 'draw-card' | 'scry' | 'none';
  isActivated?: boolean;
  parallaxLayer: number; // Layer for parallax scrolling (0 = background, 10 = foreground)
}

// Camera system for first-person perspective (Godot-inspired)
interface Camera3D {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  fov: number; // field of view
  nearPlane: number;
  farPlane: number;
  perspective: number; // CSS perspective value
}

interface FirstPersonBattlefieldProps {
  theme: HybridMapTheme;
  onThemeChange?: (theme: HybridMapTheme) => void;
  onEnvironmentalInteraction?: (element: any) => void; // Match the existing interface
  onCardAction?: (card: any, targetZone: string) => void; // Match the existing handleCardPlay signature
  className?: string;
}

const FirstPersonBattlefield: React.FC<FirstPersonBattlefieldProps> = ({
  theme = 'mysterious-cabin',
  onThemeChange,
  onEnvironmentalInteraction,
  onCardAction,
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<Camera3D>({
    position: { x: 0, y: -200, z: 300 }, // First-person position
    rotation: { x: -10, y: 0, z: 0 }, // Looking down slightly at table
    fov: 75,
    nearPlane: 1,
    farPlane: 1000,
    perspective: 1000
  });
  
  const [playerCards, setPlayerCards] = useState<FirstPersonGameCard[]>([]);
  const [opponentCards, setOpponentCards] = useState<FirstPersonGameCard[]>([]);
  const [environmentalElements, setEnvironmentalElements] = useState<EnvironmentalElement3D[]>([]);
  const [selectedCard, setSelectedCard] = useState<FirstPersonGameCard | null>(null);
  const [atmosphericLighting, setAtmosphericLighting] = useState<'warm' | 'cool' | 'dramatic' | 'mysterious'>('warm');

  // Initialize environmental elements with 3D positioning (Godot node-tree inspired)
  useEffect(() => {
    const elements = getTheme3DElements(theme);
    setEnvironmentalElements(elements);
    updateCameraForTheme(theme);
  }, [theme]);

  // Initialize cards in first-person view
  useEffect(() => {
    const initializeCards = () => {
      const playerHand = KONIVRER_CARDS.slice(0, 7).map((card, index) => ({
        ...card,
        gameId: `player-${card.id}-${index}`,
        zone: 'hand' as const,
        owner: 'player' as const,
        manaCost: card.cost,
        cardTypes: card.type === 'Familiar' ? ['Creature'] : ['Enchantment'],
        power: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
        toughness: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
        isTapped: false,
        isSelected: false,
        canPlay: true,
        // Position cards in arc in front of player (first-person hand)
        position3D: {
          x: (index - 3) * 80, // Spread horizontally
          y: 50, // Close to player
          z: -10, // Slightly below eye level
          rotationX: 15, // Tilt towards player
          rotationY: (index - 3) * 3, // Slight fan effect
          rotationZ: 0,
          scale: 1
        },
        mysteryValue: Math.floor(Math.random() * 10) + 1
      }));

      const opponentHandCards = KONIVRER_CARDS.slice(7, 14).map((card, index) => ({
        ...card,
        gameId: `opponent-${card.id}-${index}`,
        zone: 'hand' as const,
        owner: 'opponent' as const,
        manaCost: card.cost,
        cardTypes: card.type === 'Familiar' ? ['Creature'] : ['Enchantment'],
        power: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
        toughness: card.type === 'Familiar' ? Math.floor(Math.random() * 5) + 1 : undefined,
        isTapped: false,
        isSelected: false,
        canPlay: false,
        // Position opponent cards on far side of table
        position3D: {
          x: (index - 3) * 60,
          y: -300, // Far side of table
          z: 50, // Elevated above table
          rotationX: -15, // Facing towards player
          rotationY: 180 + (index - 3) * -2, // Facing player with slight spread
          rotationZ: 0,
          scale: 0.8 // Smaller due to distance
        },
        mysteryValue: Math.floor(Math.random() * 10) + 1
      }));

      setPlayerCards(playerHand);
      setOpponentCards(opponentHandCards);
    };

    initializeCards();
  }, []);

  const getTheme3DElements = (currentTheme: HybridMapTheme): EnvironmentalElement3D[] => {
    const themeElements: Record<HybridMapTheme, EnvironmentalElement3D[]> = {
      'mysterious-cabin': [
        {
          id: 'cabin-tome',
          name: 'Ancient Tome',
          type: 'book',
          position3D: { x: -200, y: -100, z: 30, scale: 1.2 },
          sprite: '📚',
          isInteractive: true,
          loreText: 'Ancient knowledge flows through these pages...',
          gameEffect: 'scry',
          parallaxLayer: 3
        },
        {
          id: 'cabin-candle',
          name: 'Flickering Candle',
          type: 'candle',
          position3D: { x: 180, y: -50, z: 25, scale: 1.0 },
          sprite: '🕯️',
          isInteractive: true,
          loreText: 'The flame reveals hidden truths...',
          gameEffect: 'reveal-card',
          parallaxLayer: 4
        },
        {
          id: 'cabin-scale',
          name: 'Merchant\'s Scale',
          type: 'scale',
          position3D: { x: -150, y: 80, z: 20, scale: 0.9 },
          sprite: '⚖️',
          isInteractive: true,
          loreText: 'Balance guides all transactions...',
          gameEffect: 'add-mana',
          parallaxLayer: 2
        }
      ],
      'ancient-study': [
        {
          id: 'study-crystal',
          name: 'Scrying Crystal',
          type: 'artifact',
          position3D: { x: 0, y: -80, z: 40, scale: 1.5 },
          sprite: '🔮',
          isInteractive: true,
          loreText: 'Peer into the mysteries of fate...',
          gameEffect: 'scry',
          parallaxLayer: 5
        },
        {
          id: 'study-totem',
          name: 'Wisdom Totem',
          type: 'totem',
          position3D: { x: 120, y: -120, z: 35, scale: 1.1 },
          sprite: '🗿',
          isInteractive: true,
          loreText: 'Ancient wisdom guides your path...',
          gameEffect: 'draw-card',
          parallaxLayer: 3
        }
      ],
      'ritual-chamber': [
        {
          id: 'chamber-brazier',
          name: 'Sacred Brazier',
          type: 'candle',
          position3D: { x: -100, y: -200, z: 60, scale: 1.3 },
          sprite: '🔥',
          isInteractive: true,
          loreText: 'Sacred flames empower your magic...',
          gameEffect: 'add-mana',
          parallaxLayer: 6
        },
        {
          id: 'chamber-dagger',
          name: 'Ritual Dagger',
          type: 'artifact',
          position3D: { x: 50, y: -50, z: 15, scale: 0.8 },
          sprite: '🗡️',
          isInteractive: true,
          loreText: 'Cut through deception and illusion...',
          gameEffect: 'reveal-card',
          parallaxLayer: 1
        }
      ],
      'traders-den': [
        {
          id: 'den-gold-scale',
          name: 'Golden Scale',
          type: 'scale',
          position3D: { x: -80, y: -60, z: 25, scale: 1.1 },
          sprite: '⚖️',
          isInteractive: true,
          loreText: 'Every deal has its price...',
          gameEffect: 'draw-card',
          parallaxLayer: 4
        },
        {
          id: 'den-compass',
          name: 'Trader\'s Compass',
          type: 'artifact',
          position3D: { x: 100, y: -100, z: 20, scale: 0.9 },
          sprite: '🧭',
          isInteractive: true,
          loreText: 'Navigate to profitable ventures...',
          gameEffect: 'add-mana',
          parallaxLayer: 2
        }
      ]
    };
    
    return themeElements[currentTheme] || [];
  };

  const updateCameraForTheme = (currentTheme: HybridMapTheme) => {
    const themeCamera: Record<HybridMapTheme, Partial<Camera3D>> = {
      'mysterious-cabin': { 
        position: { x: 0, y: -180, z: 280 }, 
        rotation: { x: -8, y: 0, z: 0 },
        perspective: 900
      },
      'ancient-study': { 
        position: { x: 20, y: -200, z: 320 }, 
        rotation: { x: -12, y: 2, z: 0 },
        perspective: 1200
      },
      'ritual-chamber': { 
        position: { x: -10, y: -220, z: 300 }, 
        rotation: { x: -15, y: -1, z: 0 },
        perspective: 800
      },
      'traders-den': { 
        position: { x: 0, y: -190, z: 290 }, 
        rotation: { x: -10, y: 0, z: 0 },
        perspective: 1000
      }
    };

    setCamera(prev => ({ ...prev, ...themeCamera[currentTheme] }));
    setAtmosphericLighting(
      currentTheme === 'mysterious-cabin' ? 'warm' :
      currentTheme === 'ancient-study' ? 'cool' :
      currentTheme === 'ritual-chamber' ? 'dramatic' : 'mysterious'
    );
  };

  const handleCardClick = useCallback((card: FirstPersonGameCard) => {
    if (card.owner !== 'player') return;
    
    setSelectedCard(prev => prev?.gameId === card.gameId ? null : card);
    
    // Call the parent's card action handler with the expected signature
    if (onCardAction) {
      // Convert FirstPersonGameCard to the expected format
      const convertedCard = {
        ...card,
        zone: card.zone as 'hand' | 'battlefield' | 'graveyard' | 'library' | 'exile',
        gridPosition: undefined // Remove if not compatible
      };
      onCardAction(convertedCard, 'battlefield'); // default target zone
    }
    
    audioManager.playCardHover();
  }, [onCardAction]);

  const handleEnvironmentalClick = useCallback((element: EnvironmentalElement3D) => {
    if (!element.isInteractive || element.isActivated) return;

    setEnvironmentalElements(prev => 
      prev.map(el => 
        el.id === element.id ? { ...el, isActivated: true } : el
      )
    );

    // Convert to the expected format for the parent handler
    const convertedElement = {
      ...element,
      position: { x: element.position3D.x, y: element.position3D.y }, // Convert to 2D position
      type: element.type as 'book' | 'candle' | 'scale' | 'totem' | 'artifact' | 'scroll'
    };

    onEnvironmentalInteraction?.(convertedElement);
    audioManager.playCardPlay();
  }, [onEnvironmentalInteraction]);

  // Calculate CSS transform for 3D positioning (Godot-inspired transform matrices)
  const calculateCardTransform = (card: FirstPersonGameCard) => {
    if (!card.position3D) return '';
    
    const { x, y, z, rotationX, rotationY, rotationZ, scale } = card.position3D;
    
    return `
      translate3d(${x}px, ${y}px, ${z}px)
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
      rotateZ(${rotationZ}deg)
      scale(${scale})
    `;
  };

  const calculateElementTransform = (element: EnvironmentalElement3D) => {
    const { x, y, z, scale } = element.position3D;
    return `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
  };

  // Get card front image path
  const getCardImagePath = (card: FirstPersonGameCard) => {
    const imageName = card.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `/public/assets/cards/${imageName}.png`;
  };

  return (
    <div 
      className={`first-person-battlefield ${className} ${theme} lighting-${atmosphericLighting}`}
      ref={canvasRef}
      style={{
        perspective: `${camera.perspective}px`,
        perspectiveOrigin: 'center center'
      }}
    >
      {/* 3D Scene Container (Godot-inspired scene tree) */}
      <motion.div 
        className="scene-root"
        style={{
          transform: `
            translate3d(${camera.position.x}px, ${camera.position.y}px, ${camera.position.z}px)
            rotateX(${camera.rotation.x}deg)
            rotateY(${camera.rotation.y}deg)
            rotateZ(${camera.rotation.z}deg)
          `,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        
        {/* Background Layer - Parallax */}
        <div className="background-layer" style={{ 
          transform: 'translateZ(-500px) scale(2)',
          transformStyle: 'preserve-3d'
        }}>
          <div className={`atmosphere-gradient ${theme}`} />
        </div>

        {/* Environmental Elements Layer */}
        <div className="environmental-layer" style={{ transformStyle: 'preserve-3d' }}>
          {environmentalElements.map((element) => (
            <motion.div
              key={element.id}
              className={`environmental-element-3d ${element.type} ${element.isActivated ? 'activated' : ''}`}
              style={{
                transform: calculateElementTransform(element),
                transformStyle: 'preserve-3d',
                zIndex: element.parallaxLayer
              }}
              onClick={() => handleEnvironmentalClick(element)}
              whileHover={{ 
                scale: element.position3D.scale * 1.1,
                rotateY: 5 
              }}
              whileTap={{ scale: element.position3D.scale * 0.95 }}
              animate={{
                rotateY: element.isActivated ? [0, 360] : [0, 2, 0],
              }}
              transition={{
                rotateY: element.isActivated ? { duration: 0.8 } : { duration: 3, repeat: Infinity }
              }}
            >
              <div className="element-sprite" style={{ fontSize: '3rem' }}>
                {element.sprite}
              </div>
              {element.isInteractive && !element.isActivated && (
                <div className="interaction-hint">Click</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Table Surface */}
        <div 
          className="battlefield-table" 
          style={{
            transform: 'rotateX(90deg) translateZ(-10px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Opponent Cards Layer */}
        <div className="opponent-cards-layer" style={{ transformStyle: 'preserve-3d' }}>
          {opponentCards.map((card) => (
            <motion.div
              key={card.gameId}
              className="card-3d opponent-card"
              style={{
                transform: calculateCardTransform(card),
                transformStyle: 'preserve-3d'
              }}
              animate={{
                rotateY: [180, 182, 180], // Subtle back-and-forth
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="card-back">?</div>
            </motion.div>
          ))}
        </div>

        {/* Player Cards Layer */}
        <div className="player-cards-layer" style={{ transformStyle: 'preserve-3d' }}>
          {playerCards.map((card) => (
            <motion.div
              key={card.gameId}
              className={`card-3d player-card ${selectedCard?.gameId === card.gameId ? 'selected' : ''}`}
              style={{
                transform: calculateCardTransform(card),
                transformStyle: 'preserve-3d'
              }}
              onClick={() => handleCardClick(card)}
              whileHover={{ 
                y: -20,
                rotateX: card.position3D!.rotationX + 10,
                scale: card.position3D!.scale * 1.05
              }}
              whileTap={{ scale: card.position3D!.scale * 0.95 }}
              animate={selectedCard?.gameId === card.gameId ? {
                y: [-10, 0, -10],
                rotateZ: [-2, 2, -2]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="card-front">
                <img 
                  src={getCardImagePath(card)}
                  alt={card.name}
                  onError={(e) => {
                    // Fallback to styled card
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="card-fallback">
                  <div className="card-name">{card.name}</div>
                  <div className="card-cost">{card.cost}</div>
                  <div className="card-type">{card.type}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* UI Layer */}
        <div className="ui-layer" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {/* First-person perspective indicator */}
          <div className="crosshair" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
          }}>
            ⊕
          </div>
          
          {/* Theme indicator */}
          <div className="theme-indicator" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            textTransform: 'capitalize',
            pointerEvents: 'none'
          }}>
            {theme.replace('-', ' ')} • First Person View
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default FirstPersonBattlefield;