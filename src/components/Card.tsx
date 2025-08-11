import React, { useState, useRef } from 'react';
import { Card as CardType, DragState, TouchState } from '../types/game';
import { DeviceInfo } from '../utils/deviceDetection';

interface CardProps {
  card: CardType;
  device: DeviceInfo;
  dragState: DragState;
  onCardSelect: (card: CardType) => void;
  onCardDoubleClick: (card: CardType) => void;
  onCardRightClick: (card: CardType) => void;
  onDragStart: (card: CardType, position: { x: number; y: number }) => void;
  onDragEnd: (card: CardType, position: { x: number; y: number }) => void;
  size?: { width: number; height: number };
  isInHand?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  device,
  dragState,
  onCardSelect,
  onCardDoubleClick,
  onCardRightClick,
  onDragStart,
  onDragEnd,
  size,
  isInHand = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    isLongPress: false,
    touchStartTime: 0,
    touchPosition: { x: 0, y: 0 }
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<number | null>(null);

  // Card dimensions based on device and context
  const cardSize = size || (device.isMobile 
    ? (isInHand ? { width: 65, height: 91 } : { width: 85, height: 119 })
    : (isInHand ? { width: 100, height: 140 } : { width: 120, height: 168 })
  );

  // KONIVRER Arena color schemes
  const colorMap = {
    white: '#FFFBD5',
    blue: '#AAE0FA', 
    black: '#D3D3D3',
    red: '#FFB3A7',
    green: '#C1E1C1',
    colorless: '#CCCCCC',
    multicolor: '#F5DEB3'
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (device.isMobile) return; // Handle touch events separately on mobile
    
    e.preventDefault();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      onDragStart(card, { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (device.isMobile) return;
    
    if (dragState.isDragging && dragState.draggedCard?.id === card.id) {
      onDragEnd(card, { x: e.clientX, y: e.clientY });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.detail === 2) {
      onCardDoubleClick(card);
    } else {
      onCardSelect(card);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onCardRightClick(card);
  };

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!device.isMobile) return;
    
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchState({
      isLongPress: false,
      touchStartTime: now,
      touchPosition: { x: touch.clientX, y: touch.clientY }
    });

    // Start long press timer for mobile context menu
    longPressTimer.current = window.setTimeout(() => {
      setTouchState(prev => ({ ...prev, isLongPress: true }));
      navigator.vibrate?.(50); // Haptic feedback
      onCardRightClick(card);
    }, 500);

    // Start drag for mobile
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      onDragStart(card, {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!device.isMobile) return;
    
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }

    const now = Date.now();
    const touchDuration = now - touchState.touchStartTime;

    if (!touchState.isLongPress && touchDuration < 500) {
      // Short tap - select card
      onCardSelect(card);
    }

    if (dragState.isDragging && dragState.draggedCard?.id === card.id) {
      const touch = e.changedTouches[0];
      onDragEnd(card, { x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
    }
  };

  // Card styling based on KONIVRER Arena design patterns
  const getCardStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: `${cardSize.width}px`,
      height: `${cardSize.height}px`,
      backgroundColor: colorMap[card.color as keyof typeof colorMap] || 
                      colorMap[card.elements?.[0] as keyof typeof colorMap] || 
                      colorMap.colorless,
      border: card.isSelected ? '3px solid #00BFFF' : '2px solid #666',
      borderRadius: device.isMobile ? '8px' : '12px',
      position: 'relative',
      cursor: device.isMobile ? 'none' : 'pointer',
      transition: 'all 0.2s ease',
      transform: `
        scale(${isHovered && !device.isMobile ? 1.1 : 1}) 
        rotate(${card.isTapped ? '90deg' : '0deg'})
        ${dragState.isDragging && dragState.draggedCard?.id === card.id ? 'scale(1.05)' : ''}
      `,
      opacity: dragState.isDragging && dragState.draggedCard?.id === card.id ? 0.8 : 1,
      zIndex: dragState.isDragging && dragState.draggedCard?.id === card.id ? 1000 : 1,
      boxShadow: card.isSelected 
        ? '0 0 20px rgba(0, 191, 255, 0.5)' 
        : isHovered ? '0 4px 15px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
      userSelect: 'none',
      touchAction: 'none'
    };

    return baseStyle;
  };

  return (
    <div
      ref={cardRef}
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => !device.isMobile && setIsHovered(true)}
      onMouseLeave={() => !device.isMobile && setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`mtg-card ${device.platform}`}
      data-card-id={card.id}
    >
      {/* Card background/art */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : 'linear-gradient(135deg, #333, #555)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }} />
      
      {/* Card frame overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, transparent 30%, ${
          colorMap[card.color as keyof typeof colorMap] || 
          colorMap[card.elements?.[0] as keyof typeof colorMap] || 
          colorMap.colorless
        }CC 100%)`,
        borderRadius: 'inherit',
        pointerEvents: 'none'
      }} />
      
      {/* Card content */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: device.isMobile ? '4px' : '6px',
        fontSize: device.isMobile ? '10px' : '12px',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Mana cost */}
        <div style={{
          position: 'absolute',
          top: device.isMobile ? '2px' : '4px',
          right: device.isMobile ? '2px' : '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '50%',
          width: device.isMobile ? '16px' : '20px',
          height: device.isMobile ? '16px' : '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: device.isMobile ? '8px' : '10px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          {card.manaCost}
        </div>
        
        {/* Card name */}
        <div style={{
          fontSize: device.isMobile ? '8px' : '10px',
          fontWeight: 'bold',
          marginTop: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: device.isMobile ? '1px 2px' : '2px 4px',
          borderRadius: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none'
        }}>
          {card.name}
        </div>
        
        {/* Card type */}
        <div style={{
          fontSize: device.isMobile ? '6px' : '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: device.isMobile ? '1px 2px' : '1px 4px',
          borderRadius: '2px',
          marginTop: '1px',
          pointerEvents: 'none'
        }}>
          {card.type}
        </div>
        
        {/* Power/Toughness for creatures */}
        {(card.type?.toLowerCase().includes('creature') || card.lesserType?.toLowerCase().includes('familiar')) && (
          <div style={{
            position: 'absolute',
            bottom: device.isMobile ? '2px' : '4px',
            right: device.isMobile ? '2px' : '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: device.isMobile ? '1px 3px' : '2px 4px',
            borderRadius: '2px',
            fontSize: device.isMobile ? '8px' : '10px',
            fontWeight: 'bold',
            pointerEvents: 'none'
          }}>
            {card.power}/{card.toughness}
          </div>
        )}
        
        {/* Counters display */}
        {card.counters && Object.keys(card.counters).length > 0 && (
          <div style={{
            position: 'absolute',
            top: device.isMobile ? '2px' : '4px',
            left: device.isMobile ? '2px' : '4px',
            display: 'flex',
            gap: '2px',
            pointerEvents: 'none'
          }}>
            {Object.entries(card.counters).map(([type, count]) => (
              <div
                key={type}
                style={{
                  backgroundColor: '#FFD700',
                  color: 'black',
                  borderRadius: '50%',
                  width: device.isMobile ? '12px' : '16px',
                  height: device.isMobile ? '12px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: device.isMobile ? '6px' : '8px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                {count}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};