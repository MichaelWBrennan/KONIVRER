import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import { Card3D } from '../3d/Card3D';
import { CardPhysicsSystem } from '../3d/CardPhysics';
import { MysticalArena } from '../3d/MysticalArena';
import { KONIVRER_CARDS, Card } from '../../data/cards';
import { DynamicSizing } from '../../utils/userAgentSizing';

interface Card3DGameUIProps {
  onClose: () => void;
  dynamicSizing: DynamicSizing;
}

interface GameState {
  playerHand: Card[];
  playerBoard: Card[];
  opponentBoard: Card[];
  playerHealth: number;
  opponentHealth: number;
  playerMana: number;
  maxMana: number;
  turn: 'player' | 'opponent';
  selectedCard: Card | null;
}

const Card3DGameUI: React.FC<Card3DGameUIProps> = ({ onClose, dynamicSizing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const physicsRef = useRef<CardPhysicsSystem | null>(null);
  const card3DsRef = useRef<Map<string, Card3D>>(new Map());

  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    playerBoard: [],
    opponentBoard: [],
    playerHealth: 30,
    opponentHealth: 30,
    playerMana: 3,
    maxMana: 3,
    turn: 'player',
    selectedCard: null,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    initializeBabylon();
    initializeGame();

    return () => {
      cleanup();
    };
  }, []);

  const initializeBabylon = async () => {
    if (!canvasRef.current) return;

    try {
      setLoadingProgress(10);

      // Create Babylon.js engine with user agent aware settings
      const engineOptions = {
        antialias: dynamicSizing.scaleFactor >= 1.0, // Enable antialiasing for high-scale devices
        alpha: false,
        powerPreference: 'high-performance',
        stencil: true,
        preserveDrawingBuffer: true,
      };
      
      const engine = new BABYLON.Engine(canvasRef.current, true, engineOptions);
      engineRef.current = engine;

      // Add resize handling that responds to dynamic sizing changes
      const handleResize = () => {
        if (engineRef.current) {
          engineRef.current.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      setLoadingProgress(20);

      // Create scene
      const scene = new BABYLON.Scene(engine);
      sceneRef.current = scene;

      // Enable physics
      scene.enablePhysics(
        new BABYLON.Vector3(0, -9.81, 0),
        new BABYLON.CannonJSPlugin(),
      );

      setLoadingProgress(30);

      // Create camera
      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        20,
        BABYLON.Vector3.Zero(),
        scene,
      );
      camera.attachControls(canvasRef.current, true);
      camera.setTarget(BABYLON.Vector3.Zero());

      // Constrain camera movement for better gameplay
      camera.lowerBetaLimit = Math.PI / 6;
      camera.upperBetaLimit = Math.PI / 2;
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 30;

      setLoadingProgress(50);

      // Initialize arena with user agent aware configuration
      const isMobile = dynamicSizing.width < 768;
      const isLowEnd = dynamicSizing.scaleFactor < 0.9;
      
      const arena = new MysticalArena(scene, {
        theme: 'hearthstone',
        quality: isLowEnd ? 'low' : isMobile ? 'medium' : 'high',
        enableParticles: !isLowEnd,
        enableLighting: true,
        enablePostProcessing: !isMobile && !isLowEnd,
        isMobile: isMobile,
        enableInteractiveElements: true,
        enableIdleAnimations: !isLowEnd,
        // Pass scale factor for performance optimizations
        renderingTechniques: {
          enableMode7Background: dynamicSizing.scaleFactor >= 1.0,
          enableIsometricView: true,
          enable2_5DSprites: !isLowEnd,
          enableParallaxLayers: dynamicSizing.scaleFactor >= 1.0,
        },
      });
      arenaRef.current = arena;

      await arena.initialize();
      setLoadingProgress(70);

      // Initialize physics system with user agent aware settings
      const physics = new CardPhysicsSystem(scene, {
        tableHeight: 0,
        enableCardCollisions: !isLowEnd, // Disable on low-end devices for performance
        dragSmoothing: isMobile ? 0.1 : 0.2, // Faster response on mobile
      });
      physicsRef.current = physics;

      // Create table surface
      physics.createTableSurface();

      setLoadingProgress(90);

      // Start render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      setLoadingProgress(100);
      setIsInitialized(true);

      console.log('[Card3DGameUI] Babylon.js initialized successfully');
    } catch (error) {
      console.error('[Card3DGameUI] Failed to initialize Babylon.js:', error);
    }
  };

  const initializeGame = () => {
    // Initialize game with random cards
    const shuffled = [...KONIVRER_CARDS].sort(() => Math.random() - 0.5);
    const playerStartingHand = shuffled.slice(0, 5);
    const opponentStartingBoard = shuffled.slice(5, 8);

    setGameState(prev => ({
      ...prev,
      playerHand: playerStartingHand,
      opponentBoard: opponentStartingBoard,
    }));
  };

  const create3DCards = async () => {
    if (!sceneRef.current || !physicsRef.current) return;

    const scene = sceneRef.current;
    const physics = physicsRef.current;

    // Clear existing 3D cards
    card3DsRef.current.forEach(card3D => card3D.dispose());
    card3DsRef.current.clear();

    // Create 3D cards for player hand
    gameState.playerHand.forEach((card, index) => {
      const card3D = new Card3D({
        scene,
        card,
        position: new BABYLON.Vector3(
          (index - 2) * 3, // Spread cards across hand
          1,
          6,
        ),
        scale: 0.8,
        quality: 'medium',
      });

      physics.enableCardPhysics(card3D);
      physics.addCardToZone(card3D, 'playerHand');
      card3DsRef.current.set(card.id, card3D);
    });

    // Create 3D cards for opponent board
    gameState.opponentBoard.forEach((card, index) => {
      const card3D = new Card3D({
        scene,
        card,
        position: new BABYLON.Vector3((index - 1) * 3, 1, -3),
        scale: 0.8,
        quality: 'medium',
      });

      physics.enableCardPhysics(card3D);
      physics.addCardToZone(card3D, 'opponentBoard');
      card3DsRef.current.set(card.id + '_opponent', card3D);
    });

    // Create 3D cards for player board
    gameState.playerBoard.forEach((card, index) => {
      const card3D = new Card3D({
        scene,
        card,
        position: new BABYLON.Vector3((index - 1) * 3, 1, 2),
        scale: 0.8,
        quality: 'medium',
      });

      physics.enableCardPhysics(card3D);
      physics.addCardToZone(card3D, 'playerBoard');
      card3DsRef.current.set(card.id + '_player', card3D);
    });

    console.log('[Card3DGameUI] Created 3D cards for current game state');
  };

  // Update 3D cards when game state changes
  useEffect(() => {
    if (isInitialized) {
      create3DCards();
    }
  }, [
    gameState.playerHand,
    gameState.playerBoard,
    gameState.opponentBoard,
    isInitialized,
  ]);

  const playCard = (card: Card) => {
    if (gameState.turn !== 'player' || gameState.playerMana < card.cost) return;

    console.log(`[Card3DGameUI] Playing card: ${card.name}`);

    // Find and animate the 3D card
    const card3D = card3DsRef.current.get(card.id);
    if (card3D) {
      card3D.playCard();

      // Move card to player board in physics system
      if (physicsRef.current) {
        physicsRef.current.addCardToZone(card3D, 'playerBoard');
      }
    }

    setGameState(prev => ({
      ...prev,
      playerHand: prev.playerHand.filter(c => c.id !== card.id),
      playerBoard: [...prev.playerBoard, card],
      playerMana: prev.playerMana - card.cost,
      selectedCard: null,
    }));
  };

  const endTurn = () => {
    setGameState(prev => ({
      ...prev,
      turn: prev.turn === 'player' ? 'opponent' : 'player',
      playerMana:
        prev.turn === 'opponent'
          ? Math.min(prev.maxMana + 1, 10)
          : prev.playerMana,
      maxMana:
        prev.turn === 'opponent'
          ? Math.min(prev.maxMana + 1, 10)
          : prev.maxMana,
    }));

    // Simple AI turn
    if (gameState.turn === 'player') {
      setTimeout(() => {
        const shuffled = [...KONIVRER_CARDS].sort(() => Math.random() - 0.5);
        const newOpponentCard = shuffled[0];

        setGameState(prev => ({
          ...prev,
          opponentBoard: [...prev.opponentBoard, newOpponentCard],
          turn: 'player',
        }));
      }, 1500);
    }
  };

  const toggleZoneVisibility = () => {
    if (physicsRef.current) {
      const currentVisibility = physicsRef.current.getZoneNames().length > 0;
      physicsRef.current.setZoneVisibility(!currentVisibility);
    }
  };

  const cleanup = () => {
    // Dispose all 3D cards
    card3DsRef.current.forEach(card3D => card3D.dispose());
    card3DsRef.current.clear();

    // Dispose physics system
    if (physicsRef.current) {
      physicsRef.current.dispose();
    }

    // Dispose arena
    if (arenaRef.current) {
      arenaRef.current.dispose();
    }

    // Dispose scene and engine
    if (sceneRef.current) {
      sceneRef.current.dispose();
    }

    if (engineRef.current) {
      engineRef.current.dispose();
    }

    // Remove event listeners
    window.removeEventListener('resize', () => {});
  };

  const getLoadingMessage = () => {
    if (loadingProgress < 30) return 'Initializing 3D Engine...';
    if (loadingProgress < 50) return 'Creating Scene...';
    if (loadingProgress < 70) return 'Loading Arena...';
    if (loadingProgress < 90) return 'Setting up Physics...';
    return 'Almost Ready...';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 1000,
      }}
    >
      {/* Loading Screen */}
      {!isInitialized && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              border: '3px solid #1a1a2e',
              borderTop: '3px solid #d4af37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px',
            }}
          />
          <div
            style={{
              color: '#d4af37',
              fontSize: '1.2rem',
              marginBottom: '10px',
            }}
          >
            Loading 3D KONIVRER
          </div>
          <div
            style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}
          >
            {getLoadingMessage()}
          </div>
          <div
            style={{
              width: '300px',
              height: '4px',
              background: '#1a1a2e',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #d4af37, #f4e158)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      {/* Game Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
          zIndex: 1001,
        }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#d4af37', fontSize: '24px' }}>
            ⭐ KONIVRER 3D ⭐
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>❤️ {gameState.opponentHealth}</div>
            <div>
              Turn:{' '}
              {gameState.turn === 'player' ? 'Your Turn' : 'Opponent Turn'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            💧 {gameState.playerMana}/{gameState.maxMana}
          </div>
          <div>❤️ {gameState.playerHealth}</div>
          <button
            onClick={endTurn}
            disabled={gameState.turn !== 'player'}
            style={{
              padding: '8px 16px',
              background: gameState.turn === 'player' ? '#d4af37' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              color: gameState.turn === 'player' ? '#000' : '#fff',
              cursor: gameState.turn === 'player' ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            End Turn
          </button>
          <button
            onClick={toggleZoneVisibility}
            style={{
              padding: '8px 16px',
              background: 'rgba(100, 100, 100, 0.8)',
              border: '1px solid #666',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Toggle Zones
          </button>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(220, 38, 38, 0.8)',
              border: '2px solid #dc2626',
              borderRadius: '50%',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* 3D Canvas with user agent aware styling */}
      <canvas
        ref={canvasRef}
        style={{
          width: dynamicSizing.cssWidth,
          height: dynamicSizing.cssHeight,
          display: 'block',
          outline: 'none',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // Apply safe area insets for devices with notches
          marginTop: `${dynamicSizing.safeAreaInsets.top}px`,
          marginBottom: `${dynamicSizing.safeAreaInsets.bottom}px`,
          marginLeft: `${dynamicSizing.safeAreaInsets.left}px`,
          marginRight: `${dynamicSizing.safeAreaInsets.right}px`,
        }}
      />

      {/* Game Instructions Overlay */}
      {isInitialized && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            maxWidth: '300px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          <div
            style={{
              color: '#d4af37',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            🎮 3D Card Controls
          </div>
          <div style={{ marginBottom: '4px' }}>
            • Hover over cards to see glow effect
          </div>
          <div style={{ marginBottom: '4px' }}>
            • Click and drag cards to move them
          </div>
          <div style={{ marginBottom: '4px' }}>
            • Drop cards in different zones to play
          </div>
          <div style={{ marginBottom: '4px' }}>
            • Use mouse to rotate camera view
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
            Cards have realistic physics and will respond to gravity and
            collisions
          </div>
        </div>
      )}

      {/* Selected Card Info */}
      {gameState.selectedCard && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #d4af37',
            maxWidth: '250px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#d4af37' }}>
            {gameState.selectedCard.name}
          </h3>
          <div style={{ fontSize: '12px', marginBottom: '8px' }}>
            {gameState.selectedCard.type} • {gameState.selectedCard.rarity}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            {gameState.selectedCard.description}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Cost: {gameState.selectedCard.cost} mana
            {gameState.selectedCard.strength &&
              ` • Strength: ${gameState.selectedCard.strength}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card3DGameUI;
