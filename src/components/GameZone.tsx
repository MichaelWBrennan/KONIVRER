import React from 'react';
import * as gz from './gameZone.css.ts';
import { GameZone as GameZoneType, Card as CardType, DragState, KonivrverZoneType } from '../types/game';
import { DeviceInfo, getMTGArenaLayoutConfig } from '../utils/deviceDetection';
import { Card } from './Card';

interface GameZoneProps {
  zone: GameZoneType;
  device: DeviceInfo;
  dragState: DragState;
  onCardSelect: (card: CardType) => void;
  onCardDoubleClick: (card: CardType) => void;
  onCardRightClick: (card: CardType) => void;
  onDragStart: (card: CardType, position: { x: number; y: number }) => void;
  onDragEnd: (card: CardType, position: { x: number; y: number }) => void;
  onZoneDrop: (zoneId: string) => void;
  screenSize: { width: number; height: number };
}

// Type guard to check if a string is a valid KonivrverZoneType
const isKonivrverZoneType: any : any = (zoneId: string): zoneId is KonivrverZoneType => {
  const validZoneTypes: KonivrverZoneType[] : any = [
    'field', 'combatRow', 'azothRow', 'hand', 'deck', 'lifeCards', 'flag', 'removedFromPlay', 'stack'
  ];
  return validZoneTypes.includes(zoneId as KonivrverZoneType);
};

export const GameZone: React.FC<GameZoneProps> : any = ({
  zone,
  device,
  dragState,
  onCardSelect,
  onCardDoubleClick,
  onCardRightClick,
  onDragStart,
  onDragEnd,
  onZoneDrop,
  screenSize
}) => {
  const config: any : any = getMTGArenaLayoutConfig(device);
  const zoneConfig: any : any = config.zones[zone.id as keyof typeof config.zones];

  if (!zoneConfig) return null;

  // Calculate absolute position and size
  const zoneStyle: React.CSSProperties : any = {
    position: 'absolute',
    left: `${(zoneConfig.position.x / 100) * screenSize.width}px`,
    top: `${(zoneConfig.position.y / 100) * screenSize.height}px`,
    width: `${(zoneConfig.size.width / 100) * screenSize.width}px`,
    height: `${(zoneConfig.size.height / 100) * screenSize.height}px`,
    border: (isKonivrverZoneType(zone.id) && dragState.validDropZones.includes(zone.id))
      ? '3px dashed #00BFFF' 
      : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: device.isMobile ? '8px' : '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'visible',
    zIndex: 1
  };

  const handleDrop: any : any = (e: React.DragEvent) => {
    e.preventDefault();
    onZoneDrop(zone.id);
  };

  const handleDragOver: any : any = (e: React.DragEvent) => {
    if (isKonivrverZoneType(zone.id) && dragState.validDropZones.includes(zone.id)) {
      e.preventDefault();
    }
  };

  const renderCards: any : any = () => {
    if (zone.cards.length === 0) return null;

    switch (zone.layout) {
      case 'stack':
        return zone.cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              position: 'absolute',
              left: `${index * 2}px`,
              top: `${index * 2}px`,
              zIndex: index
            }}
          >
            <Card
              card={card}
              device={device}
              dragState={dragState}
              onCardSelect={onCardSelect}
              onCardDoubleClick={onCardDoubleClick}
              onCardRightClick={onCardRightClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isInHand={zone.id.includes('hand')}
            />
          </div>
        ));

      case 'fan': {
        // Hand layout - cards fan out
        const cardSpacing: any : any = zoneConfig.cardSpacing || 8;
        const overlap: any : any = zoneConfig.overlap || 0.8;
        
        return zone.cards.map((card, index) => {
          const totalWidth: any : any = zone.cards.length * cardSpacing * overlap;
          const startX: any : any = (parseFloat(zoneStyle.width as string) - totalWidth) / 2;
          
          return (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                left: `${startX + (index * cardSpacing * overlap)}px`,
                top: device.isMobile ? '5px' : '10px',
                zIndex: index,
                transform: device.isMobile ? `rotate(${(index - zone.cards.length/2) * 3}deg)` : 'none'
              }}
            >
              <Card
                card={card}
                device={device}
                dragState={dragState}
                onCardSelect={onCardSelect}
                onCardDoubleClick={onCardDoubleClick}
                onCardRightClick={onCardRightClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isInHand={true}
              />
            </div>
          );
        });
      }

      case 'grid': {
        // Battlefield layout - cards in grid
        const maxRows: any : any = zoneConfig.maxRows || 3;
        const spacing: any : any = zoneConfig.cardSpacing || 12;
        
        return zone.cards.map((card, index) => {
          const cardsPerRow: any : any = Math.ceil(zone.cards.length / maxRows);
          const row: any : any = Math.floor(index / cardsPerRow);
          const col: any : any = index % cardsPerRow;
          
          return (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                left: `${col * spacing}px`,
                top: `${row * spacing}px`,
                zIndex: index
              }}
            >
              <Card
                card={card}
                device={device}
                dragState={dragState}
                onCardSelect={onCardSelect}
                onCardDoubleClick={onCardDoubleClick}
                onCardRightClick={onCardRightClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            </div>
          );
        });
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={zoneStyle}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`game-zone ${zone.id} ${device.platform}`}
    >
      {/* Zone label */}
      <div className={gz.zoneLabel} style={{ fontSize: device.isMobile ? '10px' : '12px' }}>
        {zone.name}
      </div>
      
      {/* Cards in zone */}
      {renderCards()}
      
      {/* Card count indicator for non-visible zones */}
      {zone.cards.length > 0 && (zone.id === 'library' || zone.id === 'graveyard') && (
        <div className={gz.countBadge} style={{ fontSize: device.isMobile ? '8px' : '10px' }}>
          {zone.cards.length}
        </div>
      )}
    </div>
  );
};