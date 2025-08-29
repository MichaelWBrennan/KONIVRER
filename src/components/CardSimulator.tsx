import React, { useEffect, useState } from 'react';
import { detectDevice, DeviceInfo } from '../utils/deviceDetection';
import { useGameState } from '../hooks/useGameState';
import { GameZone } from './GameZone';

export const CardSimulator: React.FC   = () => {
  const [device, setDevice]  = useState<DeviceInfo | null>(null);
  const [screenSize, setScreenSize]  = useState({ width: 0, height: 0 });
  
  const {
    gameState,
    dragState,
    selectCard,
    doubleClickCard,
    rightClickCard,
    startDrag,
    endDrag,
    handleZoneDrop,
    nextTurn,
    nextPhase
  } = useGameState();

  useEffect(() => {
    // Detect device on component mount
    const deviceInfo  = detectDevice();
    setDevice(deviceInfo);
    
    // Set initial screen size
    const updateScreenSize  = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    // Log device detection for debugging
    console.log('KONIVRER Arena Card Sim - Device detected:', deviceInfo);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Re-detect device on orientation change (mobile)
  useEffect(() => {
    const handleOrientationChange  = () => {
      setTimeout(() => {
        const newDevice  = detectDevice();
        setDevice(newDevice);
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
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
        Loading KONIVRER Arena Card Simulator...
      </div>
    );
  }

  // Show rotation prompt for phones in portrait mode
  if (device.requiresRotation) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'rotate 2s infinite ease-in-out'
        }}>
          📱→📱
        </div>
        <h2 style={{
          fontSize: '24px',
          marginBottom: '16px',
          fontWeight: 'bold'
        }}>
          Rotate Your Device
        </h2>
        <p style={{
          fontSize: '16px',
          maxWidth: '300px',
          lineHeight: '1.4',
          opacity: 0.8
        }}>
          Please rotate your device to landscape mode for the best KONIVRER Arena experience.
        </p>
        <div style={{
          marginTop: '20px',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {device.isPhone ? 'PHONE' : 'MOBILE'} - {device.os.toUpperCase()}
        </div>
        <style>
          {`
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(90deg); }
              100% { transform: rotate(0deg); }
            }
          `}
        </style>
      </div>
    );
  }

  const currentPlayer  = gameState.players[gameState.currentPlayer];

  // KONIVRER Arena styling based on platform
  const getContainerStyle  = (): React.CSSProperties => ({
    width: '100vw',
    height: '100vh',
    background: device.isMobile 
      ? 'linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #2c1810 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: device.isMobile ? 'Inter, sans-serif' : 'Georgia, serif',
    userSelect: 'none',
    touchAction: 'none'
  });

  const getUIStyle  = (): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 100
  });

  const renderLifeCounter  = () => (
    <div style={{
      position: 'absolute',
      bottom: device.isMobile ? '20px' : '30px',
      left: device.isMobile ? '10px' : '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: device.isMobile ? '8px 12px' : '12px 16px',
      borderRadius: device.isMobile ? '8px' : '12px',
      fontSize: device.isMobile ? '18px' : '24px',
      fontWeight: 'bold',
      border: '2px solid #666',
      minWidth: device.isMobile ? '60px' : '80px',
      textAlign: 'center',
      pointerEvents: 'auto',
      cursor: 'pointer'
    }}>
      ❤️ {currentPlayer.life || currentPlayer.zones?.lifeCards?.cards?.length || 20}
    </div>
  );

  const renderPhaseIndicator  = () => (
    <div style={{
      position: 'absolute',
      top: device.isMobile ? '10px' : '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 100, 200, 0.9)',
      color: 'white',
      padding: device.isMobile ? '6px 12px' : '8px 16px',
      borderRadius: device.isMobile ? '6px' : '8px',
      fontSize: device.isMobile ? '12px' : '16px',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      pointerEvents: 'auto',
      cursor: 'pointer'
    }} onClick={nextPhase}>
      Turn {gameState.turn} - {gameState.phase.replace(/(\d)/, ' $1')}
    </div>
  );

  const renderControlButtons  = () => (
    <div style={{
      position: 'absolute',
      top: device.isMobile ? '10px' : '20px',
      right: device.isMobile ? '10px' : '20px',
      display: 'flex',
      gap: device.isMobile ? '8px' : '12px',
      flexDirection: device.isMobile ? 'column' : 'row'
    }}>
      <button
        style={{
          backgroundColor: 'rgba(0, 150, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: device.isMobile ? '8px 12px' : '10px 16px',
          borderRadius: device.isMobile ? '6px' : '8px',
          fontSize: device.isMobile ? '12px' : '14px',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        onClick={nextTurn}
      >
        {device.isMobile ? '→' : 'End Turn'}
      </button>
      
      <button
        style={{
          backgroundColor: 'rgba(150, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          padding: device.isMobile ? '8px 12px' : '10px 16px',
          borderRadius: device.isMobile ? '6px' : '8px',
          fontSize: device.isMobile ? '12px' : '14px',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        onClick={() => window.location.reload()}
      >
        {device.isMobile ? '⟲' : 'Reset'}
      </button>
    </div>
  );

  const renderManaPool  = () => (
    <div style={{
      position: 'absolute',
      bottom: device.isMobile ? '20px' : '30px',
      right: device.isMobile ? '10px' : '20px',
      display: 'flex',
      gap: device.isMobile ? '4px' : '6px',
      pointerEvents: 'auto'
    }}>
      {Object.entries(currentPlayer.manaPool || currentPlayer.azothPool || {}).map(([color, amount]) => (
        <div
          key={color}
          style={{
            width: device.isMobile ? '24px' : '32px',
            height: device.isMobile ? '24px' : '32px',
            borderRadius: '50%',
            backgroundColor: {
              white: '#FFFBD5',
              blue: '#AAE0FA',
              black: '#4A4A4A',
              red: '#FFB3A7',
              green: '#C1E1C1',
              colorless: '#CCCCCC'
            }[color] || '#CCCCCC',
            border: '2px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: device.isMobile ? '10px' : '12px',
            fontWeight: 'bold',
            color: color === 'white' ? '#333' : '#fff',
            cursor: 'pointer'
          }}
          title={`${color} mana: ${amount}`}
        >
          {amount}
        </div>
      ))}
    </div>
  );

  const renderDeviceIndicator  = () => (
    <div style={{
      position: 'absolute',
      bottom: device.isMobile ? '80px' : '100px',
      left: device.isMobile ? '10px' : '20px',
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
      color: 'white',
      padding: device.isMobile ? '4px 8px' : '6px 12px',
      borderRadius: device.isMobile ? '4px' : '6px',
      fontSize: device.isMobile ? '10px' : '12px',
      pointerEvents: 'none'
    }}>
      {device.platform.toUpperCase()} - {device.isTablet ? 'TABLET' : device.isPhone ? 'PHONE' : 'DESKTOP'} - {device.os.toUpperCase()}
    </div>
  );

  return (
    <div style={getContainerStyle()}>
      {/* Game board background */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        backgroundColor: 'rgba(139, 69, 19, 0.3)',
        borderRadius: device.isMobile ? '12px' : '20px',
        border: device.isMobile ? '2px solid #8B4513' : '4px solid #8B4513'
      }} />

      {/* Game zones */}
      {Object.values(currentPlayer.zones).map(zone => (
        <GameZone
          key={zone.id}
          zone={zone}
          device={device}
          dragState={dragState}
          onCardSelect={selectCard}
          onCardDoubleClick={doubleClickCard}
          onCardRightClick={rightClickCard}
          onDragStart={startDrag}
          onDragEnd={endDrag}
          onZoneDrop={handleZoneDrop}
          screenSize={screenSize}
        />
      ))}

      {/* UI Overlay */}
      <div style={getUIStyle()}>
        {renderLifeCounter()}
        {renderPhaseIndicator()}
        {renderControlButtons()}
        {renderManaPool()}
        {renderDeviceIndicator()}
      </div>

      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: device.isMobile ? '140px' : '180px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: device.isMobile ? '8px 12px' : '12px 16px',
        borderRadius: device.isMobile ? '6px' : '8px',
        fontSize: device.isMobile ? '10px' : '12px',
        textAlign: 'center',
        pointerEvents: 'none',
        maxWidth: device.isMobile ? '80%' : '60%'
      }}>
        {device.isMobile 
          ? 'Tap to select • Long press to tap/untap • Drag to move cards'
          : 'Click to select • Right-click to tap/untap • Drag to move cards • Double-click to auto-play'
        }
      </div>
    </div>
  );
};