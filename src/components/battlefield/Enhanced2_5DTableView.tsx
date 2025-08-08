import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FirstPersonGameCard, EnvironmentalElement3D } from './FirstPersonBattlefield';
import { HybridMapTheme } from './HybridBattlefieldMap';
import './Enhanced2_5DTableView.css';

interface Enhanced2_5DTableViewProps {
  playerCards: FirstPersonGameCard[];
  opponentCards: FirstPersonGameCard[];
  environmentalElements: EnvironmentalElement3D[];
  theme: HybridMapTheme;
  selectedCard: FirstPersonGameCard | null;
  onCardSelect: (card: FirstPersonGameCard) => void;
  onElementInteraction: (element: EnvironmentalElement3D) => void;
  atmosphericLighting: 'warm' | 'cool' | 'dramatic' | 'mysterious';
}

// Enhanced camera system for ideal table perspective
interface TableCamera {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  perspective: number;
  perspectiveOrigin: string;
}

export const Enhanced2_5DTableView: React.FC<Enhanced2_5DTableViewProps> = ({
  playerCards,
  opponentCards,
  environmentalElements,
  theme,
  selectedCard,
  onCardSelect,
  onElementInteraction,
  atmosphericLighting
}) => {
  const tableViewRef = useRef<HTMLDivElement>(null);
  
  // Enhanced camera position for sitting at table perspective
  const [camera, setCamera] = useState<TableCamera>({
    position: { x: 0, y: -100, z: 400 }, // Positioned as if sitting at table
    rotation: { x: -25, y: 0, z: 0 }, // Looking down at table at comfortable angle
    perspective: 1200,
    perspectiveOrigin: '50% 75%' // Perspective point closer to player
  });

  // Adjust camera based on theme for optimal viewing
  useEffect(() => {
    const themeCamera: Record<HybridMapTheme, Partial<TableCamera>> = {
      'mysterious-cabin': { 
        position: { x: 0, y: -80, z: 380 },
        rotation: { x: -22, y: 0, z: 0 },
        perspective: 1100,
        perspectiveOrigin: '50% 78%'
      },
      'ancient-study': { 
        position: { x: 0, y: -120, z: 420 },
        rotation: { x: -28, y: 0, z: 0 },
        perspective: 1300,
        perspectiveOrigin: '50% 72%'
      },
      'ritual-chamber': { 
        position: { x: 0, y: -90, z: 400 },
        rotation: { x: -24, y: 0, z: 0 },
        perspective: 1000,
        perspectiveOrigin: '50% 76%'
      },
      'traders-den': { 
        position: { x: 0, y: -100, z: 400 },
        rotation: { x: -25, y: 0, z: 0 },
        perspective: 1200,
        perspectiveOrigin: '50% 75%'
      }
    };

    setCamera(prev => ({ ...prev, ...themeCamera[theme] }));
  }, [theme]);

  // Calculate 3D transform for card positioning
  const getCardTransform = (card: FirstPersonGameCard, index: number, isOpponent: boolean) => {
    const basePos = card.position3D;
    if (!basePos) return '';

    // Enhanced positioning for table perspective
    const tableOffset = isOpponent ? -250 : 180; // Opponent across table, player near
    const cardSpacing = 85;
    const handArc = Math.PI / 6; // Gentle arc for hand
    
    let x = basePos.x;
    let y = basePos.y + tableOffset;
    let z = basePos.z;
    
    if (card.zone === 'hand') {
      // Create natural hand arc
      const arcIndex = index - Math.floor(playerCards.length / 2);
      const arcAngle = (arcIndex / (playerCards.length - 1)) * handArc;
      
      x = arcIndex * cardSpacing;
      y = isOpponent ? -250 : 180;
      z = isOpponent ? 20 : -30;
      
      // Add natural tilt and rotation
      const rotationY = arcAngle * 15; // Fan effect
      const rotationX = isOpponent ? -15 : 12; // Tilt toward/away from player
      const rotationZ = arcIndex * 2; // Slight twist
      
      return `
        translate3d(${x}px, ${y}px, ${z}px)
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
        rotateZ(${rotationZ}deg)
        scale(${isOpponent ? 0.85 : 1})
      `;
    }
    
    // Battlefield cards lay flat on table
    return `
      translate3d(${x}px, ${y}px, ${z}px)
      rotateX(${isOpponent ? -85 : -5}deg)
      rotateY(${basePos.rotationY}deg)
      rotateZ(${basePos.rotationZ}deg)
      scale(${basePos.scale})
    `;
  };

  // Get environmental element 3D transform
  const getEnvironmentalTransform = (element: EnvironmentalElement3D) => {
    const pos = element.position3D;
    return `
      translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)
      scale(${pos.scale})
    `;
  };

  return (
    <div 
      ref={tableViewRef}
      className={`enhanced-2_5d-table-view ${theme} lighting-${atmosphericLighting}`}
      style={{
        perspective: `${camera.perspective}px`,
        perspectiveOrigin: camera.perspectiveOrigin,
        transform: `
          translate3d(${camera.position.x}px, ${camera.position.y}px, ${camera.position.z}px)
          rotateX(${camera.rotation.x}deg)
          rotateY(${camera.rotation.y}deg)
          rotateZ(${camera.rotation.z}deg)
        `
      }}
    >
      {/* 3D Table Surface */}
      <div className="table-surface-3d">
        <div className="table-wood-grain" />
        <div className="table-lighting-overlay" />
        
        {/* Table zones with depth */}
        <div className="battlefield-zones">
          <div className="opponent-zone" />
          <div className="center-zone" />
          <div className="player-zone" />
        </div>
      </div>

      {/* 3D Atmospheric Background */}
      <div className="atmospheric-background-3d">
        <div className={`atmosphere-gradient ${theme}`} />
        <div className="depth-fog" />
      </div>

      {/* Environmental Elements in 3D Space */}
      <AnimatePresence>
        {environmentalElements.map((element) => (
          <motion.div
            key={element.id}
            className={`environmental-3d ${element.type} ${element.isActivated ? 'activated' : ''}`}
            style={{ 
              transform: getEnvironmentalTransform(element),
              transformStyle: 'preserve-3d'
            }}
            onClick={() => onElementInteraction(element)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: element.position3D.scale }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: element.position3D.scale * 1.1 }}
          >
            <div className="element-3d-sprite">
              {element.sprite}
            </div>
            {element.isInteractive && (
              <div className="interaction-tooltip">
                {element.name}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Opponent Cards (far side of table) */}
      <div className="opponent-cards-3d">
        <AnimatePresence>
          {opponentCards.map((card, index) => (
            <motion.div
              key={card.gameId}
              className={`card-3d opponent-card ${card.zone}`}
              style={{
                transform: getCardTransform(card, index, true),
                transformStyle: 'preserve-3d'
              }}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-face card-back">?</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Player Cards (near side of table) */}
      <div className="player-cards-3d">
        <AnimatePresence>
          {playerCards.map((card, index) => (
            <motion.div
              key={card.gameId}
              className={`card-3d player-card ${card.zone} ${selectedCard?.gameId === card.gameId ? 'selected' : ''}`}
              style={{
                transform: getCardTransform(card, index, false),
                transformStyle: 'preserve-3d'
              }}
              onClick={() => onCardSelect(card)}
              initial={{ y: 50, opacity: 0, rotateY: -90 }}
              animate={{ y: 0, opacity: 1, rotateY: 0 }}
              exit={{ y: 50, opacity: 0, rotateY: 90 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                z: -40, 
                rotateX: 8,
                transition: { duration: 0.2 }
              }}
            >
              <div className="card-face card-front">
                {card.image ? (
                  <img src={card.image} alt={card.name} />
                ) : (
                  <div className="card-fallback">
                    <div className="card-name">{card.name}</div>
                    <div className="card-type">{card.type}</div>
                    <div className="card-cost">{card.cost}</div>
                  </div>
                )}
              </div>
              <div className="card-face card-back">🎴</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Table Edge Highlight (for depth perception) */}
      <div className="table-edge-highlight" />
      
      {/* Subtle crosshair for center reference */}
      <div className="table-center-marker">⊕</div>
    </div>
  );
};

export default Enhanced2_5DTableView;