import React, { useState, useEffect } from 'react';
import { detectDevice, DeviceInfo } from '../utils/deviceDetection';
import { useKonivrverGameState } from '../hooks/useKonivrverGameState';
import type { Card, GameZone, KonivrverZoneType } from '../types/game';

interface KonivrverZoneProps {
  zone: GameZone;
  zoneType: KonivrverZoneType;
  onCardClick: (card: Card) => void;
  onCardDrag: (card: Card, zoneType: KonivrverZoneType) => void;
  onZoneDrop: (zoneType: KonivrverZoneType) => void;
  isDragTarget: boolean;
}

const KonivrverZone: React.FC<KonivrverZoneProps> : any : any = ({
  zone,
  zoneType,
  onCardClick,
  onCardDrag,
  onZoneDrop,
  isDragTarget
}) => {
  const handleDragOver : any : any = (e: React.DragEvent) => {
    if (isDragTarget) {
      e.preventDefault();
    }
  };

  const handleDrop : any : any = (e: React.DragEvent) => {
    if (isDragTarget) {
      e.preventDefault();
      onZoneDrop(zoneType);
    }
  };

  const zoneStyle: React.CSSProperties : any : any = {
    position: 'absolute',
    left: zone.position?.x || 0,
    top: zone.position?.y || 0,
    width: zone.position?.width || 100,
    height: zone.position?.height || 100,
    border: isDragTarget ? '3px solid #00ff00' : '2px solid #666',
    borderRadius: '8px',
    backgroundColor: isDragTarget ? 'rgba(0, 255, 0, 0.1)' : 'rgba(139, 69, 19, 0.2)',
    padding: '4px',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  };

  const cardStyle: React.CSSProperties : any : any = {
    width: '60px',
    height: '84px',
    backgroundColor: '#f4f4f4',
    border: '1px solid #333',
    borderRadius: '4px',
    margin: '2px',
    padding: '2px',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div
      style={zoneStyle}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      title={zone.name}
    >
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '0',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 6px',
        borderRadius: '4px'
      }}>
        {zone.name} ({zone.cards.length})
      </div>
      
      {zone.cards.map((card, index) => (
        <div
          key={`${card.id}-${index}`}
          style={cardStyle}
          draggable
          onClick={() => onCardClick(card)}
          onDragStart={() => onCardDrag(card, zoneType)}
          title={card.name}
        >
          <div style={{ fontSize: '8px', fontWeight: 'bold', textAlign: 'center' }}>
            {card.name}
          </div>
          <div style={{ fontSize: '7px', textAlign: 'center' }}>
            {card.lesserType}
          </div>
          <div style={{ fontSize: '7px', textAlign: 'center' }}>
            {card.elements.join('/')}
          </div>
          <div style={{ fontSize: '7px', textAlign: 'center' }}>
            ⚡{card.azothCost}
          </div>
          {card.power && card.toughness && (
            <div style={{ fontSize: '7px', textAlign: 'center', fontWeight: 'bold' }}>
              {card.power}/{card.toughness}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const KonivrverSimulator: React.FC : any : any = () => {
  const [device, setDevice] : any : any = useState<DeviceInfo | null>(null);
  const [selectedCard, setSelectedCard] : any : any = useState<Card | null>(null);
  
  const {
    gameState,
    dragState,
    getCurrentPlayerLife,
    startDrag,
    handleZoneDrop,
    nextPhase,
    drawCard,
    playCard
  } = useKonivrverGameState();

  useEffect(() => {
    const deviceInfo : any : any = detectDevice();
    setDevice(deviceInfo);
  }, []);

  if (!device) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f0f',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading KONIVRER Simulator...
      </div>
    );
  }

  const currentPlayer : any : any = gameState.players[gameState.currentPlayer];

  const handleCardClick : any : any = (card: Card) => {
    setSelectedCard(card);
    
    // If card is in hand and it's main phase, try to play it
    if (gameState.phase === 'main') {
      const isInHand : any : any = currentPlayer.zones.hand.cards.some(c => c.id === card.id);
      if (isInHand) {
        playCard(card);
        setSelectedCard(null);
      }
    }
  };

  const handleCardDrag : any : any = (card: Card, zoneType: KonivrverZoneType) => {
    startDrag(card, zoneType);
  };

  const handleZoneDropProxy : any : any = (zoneType: KonivrverZoneType) => {
    handleZoneDrop(zoneType);
  };

  // Render phase indicator
  const renderPhaseIndicator : any : any = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 100, 200, 0.9)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      cursor: 'pointer',
      zIndex: 100
    }} onClick={nextPhase}>
      Turn {gameState.turn} - {gameState.phase}
    </div>
  );

  // Render player info
  const renderPlayerInfo : any : any = () => (
    <div style={{
      position: 'absolute',
      top: '60px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 100
    }}>
      <div><strong>{currentPlayer.name}</strong></div>
      <div>Life Cards: {getCurrentPlayerLife()}</div>
      <div style={{ marginTop: '8px' }}>
        <strong>Azoth Pool:</strong>
        {Object.entries(currentPlayer.azothPool).map(([element, amount]) => (
          amount > 0 && (
            <div key={element} style={{ fontSize: '12px' }}>
              {element}: {amount}
            </div>
          )
        ))}
      </div>
    </div>
  );

  // Render control buttons
  const renderControls : any : any = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '8px',
      zIndex: 100
    }}>
      <button
        style={{
          backgroundColor: 'rgba(0, 150, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={drawCard}
      >
        Draw Card
      </button>
      <button
        style={{
          backgroundColor: 'rgba(150, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => window.location.reload()}
      >
        Reset Game
      </button>
    </div>
  );

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #2c1810 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Georgia, serif',
      userSelect: 'none'
    }}>
      {/* Game board background */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        backgroundColor: 'rgba(139, 69, 19, 0.3)',
        borderRadius: '20px',
        border: '4px solid #8B4513'
      }} />

      {/* UI Overlays */}
      {renderPhaseIndicator()}
      {renderPlayerInfo()}
      {renderControls()}

      {/* Game Zones */}
      {Object.entries(currentPlayer.zones).map(([zoneType, zone]) => (
        <KonivrverZone
          key={zoneType}
          zone={zone}
          zoneType={zoneType as KonivrverZoneType}
          onCardClick={handleCardClick}
          onCardDrag={handleCardDrag}
          onZoneDrop={handleZoneDropProxy}
          isDragTarget={dragState.validDropZones.includes(zoneType as KonivrverZoneType)}
        />
      ))}

      {/* Selected Card Details */}
      {selectedCard && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          zIndex: 1000,
          border: '2px solid #666'
        }}>
          <h3>{selectedCard.name}</h3>
          <p><strong>Type:</strong> {selectedCard.lesserType}</p>
          <p><strong>Elements:</strong> {selectedCard.elements.join(', ')}</p>
          <p><strong>Azoth Cost:</strong> {selectedCard.azothCost}</p>
          {selectedCard.power && selectedCard.toughness && (
            <p><strong>Power/Toughness:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
          )}
          <p><strong>Rules Text:</strong> {selectedCard.rulesText}</p>
          {selectedCard.abilities && selectedCard.abilities.length > 0 && (
            <p><strong>Abilities:</strong> {selectedCard.abilities.join(', ')}</p>
          )}
          <button
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedCard(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 100
      }}>
        Click cards in hand during Main phase to play them • Drag cards between zones • Click phase indicator to advance
      </div>
    </div>
  );
};