import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as BABYLON from 'babylonjs';
import { GameEngine } from '../game/GameEngine';
import { MysticalArena, ArenaConfig } from '../game/3d/MysticalArena';
import { PlayerZoneSystem, GameCard, PlayerZone } from '../game/systems/PlayerZoneSystem';
import { TurnBasedSystem, GamePhase, PlayerAction } from '../game/systems/TurnBasedSystem';

interface EnhancedBattlefieldProps {
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
  onGameAction?: (action: PlayerAction) => void;
  enablePerformanceMonitoring?: boolean;
  className?: string;
}

interface TouchGesture {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isValid: boolean;
}

const EnhancedHearthstoneBattlefield: React.FC<EnhancedBattlefieldProps> = ({
  onThemeChange,
  onQualityChange,
  onGameAction,
  enablePerformanceMonitoring = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const zoneSystemRef = useRef<PlayerZoneSystem | null>(null);
  const turnSystemRef = useRef<TurnBasedSystem | null>(null);
  const performanceMonitorRef = useRef<number>(0);

  // Visual state
  const [currentTheme, setCurrentTheme] = useState<string>('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game state
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('untap');
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>('player');
  const [hasPriority, setHasPriority] = useState(true);
  const [turnNumber, setTurnNumber] = useState(1);
  const [remainingTime, setRemainingTime] = useState(300);
  
  // UI state
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [hoveredZone, setHoveredZone] = useState<PlayerZone | null>(null);
  const [actionPrompt, setActionPrompt] = useState<string>('');
  const [showControls, setShowControls] = useState(false);
  
  // Touch/mobile state
  const [touchGesture, setTouchGesture] = useState<TouchGesture | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    frameTime: 16.67,
    drawCalls: 0,
  });

  // Initialize 3D battlefield with enhanced systems
  useEffect(() => {
    const initializeBattlefield = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Initialize Babylon.js engine
        const engine = new BABYLON.Engine(canvasRef.current, true, {
          preserveDrawingBuffer: true,
          stencil: true,
        });

        // Create scene
        const scene = new BABYLON.Scene(engine);
        scene.useRightHandedSystem = true;

        // Create camera with enhanced controls
        const camera = new BABYLON.UniversalCamera(
          'battlefield-camera',
          new BABYLON.Vector3(0, 12, 15),
          scene
        );
        camera.setTarget(BABYLON.Vector3.Zero());
        
        // Enhanced camera controls for mobile
        if (isMobile) {
          // Touch controls
          camera.attachControls(canvasRef.current);
          camera.inputs.addTouch();
        } else {
          // Mouse controls
          camera.attachControls(canvasRef.current);
        }

        // Lighting setup
        const hemisphericLight = new BABYLON.HemisphericLight(
          'ambient-light',
          new BABYLON.Vector3(0, 1, 0),
          scene
        );
        hemisphericLight.intensity = 0.6;

        const directionalLight = new BABYLON.DirectionalLight(
          'main-light',
          new BABYLON.Vector3(-1, -1, -1),
          scene
        );
        directionalLight.intensity = 0.8;

        // Initialize game systems
        gameEngineRef.current = new GameEngine();
        await gameEngineRef.current.init(canvasRef.current);

        // Initialize enhanced arena
        const arenaConfig: ArenaConfig = {
          theme: currentTheme as any,
          quality,
          enableParticles: quality !== 'low' && !isMobile,
          enableLighting: true,
          enablePostProcessing: quality === 'ultra' && !isMobile,
          isMobile,
          enableInteractiveElements: true,
          enableIdleAnimations: !isMobile,
        };

        const arena = new MysticalArena(scene, arenaConfig);
        await arena.initialize();
        arenaRef.current = arena;

        // Initialize player zone system
        const zoneSystem = new PlayerZoneSystem(scene, camera);
        zoneSystem.setEventHandlers({
          onCardDragStart: handleCardDragStart,
          onCardDragEnd: handleCardDragEnd,
          onCardHover: handleCardHover,
          onZoneHover: handleZoneHover,
        });
        zoneSystemRef.current = zoneSystem;

        // Initialize turn-based system
        const turnSystem = new TurnBasedSystem(scene);
        turnSystem.setEventHandlers({
          onPhaseChange: handlePhaseChange,
          onPriorityChange: handlePriorityChange,
          onTurnChange: handleTurnChange,
          onTimeWarning: handleTimeWarning,
        });
        turnSystemRef.current = turnSystem;

        // Start render loop
        engine.runRenderLoop(() => {
          scene.render();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
          engine.resize();
          setIsMobile(window.innerWidth <= 768);
        });

        // Start performance monitoring
        if (enablePerformanceMonitoring) {
          startPerformanceMonitoring();
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize enhanced battlefield:', err);
        setError('Failed to initialize 3D battlefield. Please try refreshing.');
        setIsLoading(false);
      }
    };

    initializeBattlefield();

    return () => {
      if (performanceMonitorRef.current) {
        cancelAnimationFrame(performanceMonitorRef.current);
      }
      zoneSystemRef.current?.dispose();
      turnSystemRef.current?.dispose();
      arenaRef.current?.dispose();
      gameEngineRef.current?.destroy();
    };
  }, [currentTheme, quality, isMobile, enablePerformanceMonitoring]);

  // Performance monitoring
  const startPerformanceMonitoring = useCallback(() => {
    let lastTime = performance.now();
    let frames = 0;
    let lastFpsUpdate = lastTime;

    const monitor = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      frames++;

      if (currentTime - lastFpsUpdate >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastFpsUpdate));
        frames = 0;
        lastFpsUpdate = currentTime;

        const memoryUsage = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          frameTime: deltaTime,
        }));

        // Auto-adjust quality for performance
        if (fps < 25 && quality !== 'low') {
          console.warn('Low FPS detected, suggesting quality reduction');
          handleQualityAutoAdjust('down');
        }
      }

      performanceMonitorRef.current = requestAnimationFrame(monitor);
    };

    monitor();
  }, [quality]);

  // Event handlers for game systems
  const handleCardDragStart = useCallback((card: GameCard) => {
    setSelectedCard(card);
    console.log('Card drag started:', card.name);
  }, []);

  const handleCardDragEnd = useCallback((card: GameCard, targetZone: PlayerZone | null) => {
    setSelectedCard(null);
    if (targetZone) {
      console.log(`Card ${card.name} dropped in ${targetZone.name}`);
      // Handle card movement logic
      zoneSystemRef.current?.moveCard(card.id, targetZone.id);
    }
  }, []);

  const handleCardHover = useCallback((card: GameCard | null) => {
    // Show card details on hover
    if (card) {
      console.log('Hovering over card:', card.name);
    }
  }, []);

  const handleZoneHover = useCallback((zone: PlayerZone | null) => {
    setHoveredZone(zone);
  }, []);

  const handlePhaseChange = useCallback((from: GamePhase, to: GamePhase) => {
    setCurrentPhase(to);
    console.log(`Phase change: ${from} -> ${to}`);
  }, []);

  const handlePriorityChange = useCallback((player: 'player' | 'opponent') => {
    setHasPriority(player === 'player');
    console.log(`Priority: ${player}`);
  }, []);

  const handleTurnChange = useCallback((player: 'player' | 'opponent', turn: number) => {
    setCurrentPlayer(player);
    setTurnNumber(turn);
    console.log(`Turn ${turn}: ${player}`);
  }, []);

  const handleTimeWarning = useCallback((remainingTime: number) => {
    setRemainingTime(remainingTime);
    setActionPrompt(`Hurry! ${remainingTime} seconds remaining`);
    setTimeout(() => setActionPrompt(''), 3000);
  }, []);

  // Theme and quality management
  const handleThemeChange = useCallback(async (newTheme: string) => {
    if (!arenaRef.current || newTheme === currentTheme) return;

    setIsLoading(true);
    try {
      await arenaRef.current.changeTheme(newTheme as any);
      setCurrentTheme(newTheme);
      onThemeChange?.(newTheme);
    } catch (error) {
      console.error('Failed to change theme:', error);
      setError('Failed to change battlefield theme');
    }
    setIsLoading(false);
  }, [currentTheme, onThemeChange]);

  const handleQualityAutoAdjust = useCallback((direction: 'up' | 'down') => {
    const qualities: (typeof quality)[] = ['low', 'medium', 'high', 'ultra'];
    const currentIndex = qualities.indexOf(quality);
    
    let newIndex = currentIndex;
    if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'up' && currentIndex < qualities.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      const newQuality = qualities[newIndex];
      setQuality(newQuality);
      onQualityChange?.(newQuality);
    }
  }, [quality, onQualityChange]);

  // Touch handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchGesture({
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: Date.now(),
        isValid: true,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchGesture) {
      const touch = e.touches[0];
      setTouchGesture(prev => prev ? {
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
      } : null);
    }
  }, [touchGesture]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchGesture) {
      const duration = Date.now() - touchGesture.startTime;
      const deltaX = touchGesture.currentX - touchGesture.startX;
      const deltaY = touchGesture.currentY - touchGesture.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Tap gesture
      if (duration < 300 && distance < 10) {
        handleTap(touchGesture.startX, touchGesture.startY);
      }
      // Swipe gesture
      else if (distance > 50) {
        handleSwipe(deltaX, deltaY);
      }

      setTouchGesture(null);
    }
  }, [touchGesture]);

  const handleTap = useCallback((x: number, y: number) => {
    // Convert screen coordinates to world coordinates and handle tap
    console.log('Tap at:', x, y);
  }, []);

  const handleSwipe = useCallback((deltaX: number, deltaY: number) => {
    // Handle swipe gestures for mobile navigation
    const direction = Math.abs(deltaX) > Math.abs(deltaY) 
      ? (deltaX > 0 ? 'right' : 'left')
      : (deltaY > 0 ? 'down' : 'up');
    
    console.log('Swipe:', direction);
    
    if (direction === 'up') {
      setShowControls(!showControls);
    }
  }, [showControls]);

  // Game actions
  const handleGameAction = useCallback((action: PlayerAction) => {
    switch (action) {
      case 'pass_priority':
        turnSystemRef.current?.passPriority();
        break;
      case 'end_turn':
        turnSystemRef.current?.endTurn();
        break;
      case 'play_card':
        if (selectedCard && hasPriority) {
          console.log('Playing card:', selectedCard.name);
          // Handle card play logic
        }
        break;
      default:
        console.log('Game action:', action);
    }
    
    onGameAction?.(action);
  }, [selectedCard, hasPriority, onGameAction]);

  const getPhaseDisplayName = (phase: GamePhase): string => {
    const names: Record<GamePhase, string> = {
      untap: 'Untap',
      upkeep: 'Upkeep', 
      draw: 'Draw',
      main1: 'Main Phase',
      combat_begin: 'Combat',
      combat_attackers: 'Attackers',
      combat_blockers: 'Blockers',
      combat_damage: 'Damage',
      combat_end: 'End Combat',
      main2: 'Main Phase 2',
      end: 'End Step',
      cleanup: 'Cleanup',
    };
    return names[phase] || phase;
  };

  const getPerformanceColor = (fps: number): string => {
    if (fps >= 50) return '#28a745';
    if (fps >= 30) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className={`enhanced-battlefield ${className}`}>
      {/* Mobile-first responsive layout */}
      <div className="battlefield-container">
        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          className="battlefield-canvas"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="battlefield-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading Enhanced Battlefield...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Overlay */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="battlefield-error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="error-content">
                <h3>Battlefield Error</h3>
                <p>{error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game UI Overlay */}
        <div className="game-ui-overlay">
          {/* Top Bar - Turn and Phase Info */}
          <div className="top-game-bar">
            <div className="turn-info">
              <span className="turn-number">Turn {turnNumber}</span>
              <span className={`current-player ${currentPlayer}`}>
                {currentPlayer === 'player' ? 'Your Turn' : "Opponent's Turn"}
              </span>
            </div>
            
            <div className="phase-info">
              <span className="phase-name">{getPhaseDisplayName(currentPhase)}</span>
              <div className={`priority-indicator ${hasPriority ? 'active' : ''}`}>
                {hasPriority ? '●' : '○'}
              </div>
            </div>
            
            <div className="timer-info">
              <div className={`timer-bar ${remainingTime <= 60 ? 'warning' : remainingTime <= 30 ? 'critical' : ''}`}>
                <div 
                  className="timer-fill"
                  style={{ width: `${(remainingTime / 300) * 100}%` }}
                />
              </div>
              <span className="timer-text">{Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {hasPriority && (
              <>
                <motion.button
                  className="action-btn priority-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGameAction('pass_priority')}
                >
                  Pass
                </motion.button>
                
                {(currentPhase === 'main1' || currentPhase === 'main2') && (
                  <motion.button
                    className="action-btn end-turn-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGameAction('end_turn')}
                  >
                    End Turn
                  </motion.button>
                )}
              </>
            )}
          </div>

          {/* Action Prompt */}
          <AnimatePresence>
            {actionPrompt && (
              <motion.div
                className="action-prompt"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {actionPrompt}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zone Hover Info */}
          <AnimatePresence>
            {hoveredZone && (
              <motion.div
                className="zone-info"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <h4>{hoveredZone.name}</h4>
                <p>{hoveredZone.currentCards.length}/{hoveredZone.maxCards} cards</p>
                {hoveredZone.allowDrop && <small>Drop cards here</small>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Controls */}
        {isMobile && (
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="mobile-controls"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
              >
                <div className="control-section">
                  <h4>Theme</h4>
                  <select
                    value={currentTheme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                  >
                    <option value="hearthstone">Tavern</option>
                    <option value="forest">Forest</option>
                    <option value="desert">Desert</option>
                    <option value="volcano">Volcano</option>
                  </select>
                </div>
                
                <div className="control-section">
                  <h4>Quality</h4>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as typeof quality)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                
                <button
                  className="close-controls"
                  onClick={() => setShowControls(false)}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Performance Monitor */}
        {enablePerformanceMonitoring && (
          <div className="performance-monitor">
            <div className="perf-metric">
              <span>FPS:</span>
              <span style={{ color: getPerformanceColor(performanceMetrics.fps) }}>
                {performanceMetrics.fps}
              </span>
            </div>
            <div className="perf-metric">
              <span>Memory:</span>
              <span>{performanceMetrics.memoryUsage}MB</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .enhanced-battlefield {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
          overflow: hidden;
          font-family: 'OpenDyslexic', Arial, sans-serif;
        }

        .battlefield-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .battlefield-canvas {
          width: 100%;
          height: 100%;
          display: block;
          touch-action: none;
        }

        .battlefield-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          color: #d4af37;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #333;
          border-top: 3px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loading-text {
          font-size: 1.2rem;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .battlefield-error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(220, 53, 69, 0.95);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          z-index: 100;
        }

        .error-content h3 {
          margin-bottom: 10px;
          color: white;
        }

        .error-content p {
          margin-bottom: 15px;
          color: #ffebee;
        }

        .error-content button {
          background: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .game-ui-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 10;
        }

        .top-game-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
          pointer-events: auto;
        }

        .turn-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .turn-number {
          font-size: 1.4rem;
          font-weight: bold;
          color: #d4af37;
        }

        .current-player {
          font-size: 0.9rem;
          color: #888;
        }

        .current-player.player {
          color: #4caf50;
        }

        .current-player.opponent {
          color: #f44336;
        }

        .phase-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .phase-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          text-align: center;
        }

        .priority-indicator {
          font-size: 1.5rem;
          color: #666;
          margin-top: 5px;
        }

        .priority-indicator.active {
          color: #d4af37;
          text-shadow: 0 0 10px #d4af37;
        }

        .timer-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .timer-bar {
          width: 100px;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .timer-fill {
          height: 100%;
          background: #4caf50;
          transition: width 1s linear, background-color 0.3s;
        }

        .timer-bar.warning .timer-fill {
          background: #ff9800;
        }

        .timer-bar.critical .timer-fill {
          background: #f44336;
        }

        .timer-text {
          font-size: 0.9rem;
          color: #fff;
          font-weight: bold;
        }

        .action-buttons {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          pointer-events: auto;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .priority-btn {
          background: #2196f3;
          color: white;
        }

        .priority-btn:hover {
          background: #1976d2;
        }

        .end-turn-btn {
          background: #ff5722;
          color: white;
        }

        .end-turn-btn:hover {
          background: #d84315;
        }

        .action-prompt {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.9);
          padding: 15px 25px;
          border-radius: 8px;
          color: #d4af37;
          font-size: 1.1rem;
          font-weight: bold;
          text-align: center;
          pointer-events: auto;
        }

        .zone-info {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          padding: 15px;
          border-radius: 8px;
          color: white;
          text-align: center;
          pointer-events: auto;
        }

        .zone-info h4 {
          margin: 0 0 5px 0;
          color: #d4af37;
        }

        .zone-info p {
          margin: 0 0 5px 0;
          font-size: 0.9rem;
        }

        .zone-info small {
          color: #888;
        }

        .mobile-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.95);
          padding: 20px;
          display: flex;
          gap: 20px;
          justify-content: space-around;
          pointer-events: auto;
        }

        .control-section {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .control-section h4 {
          color: #d4af37;
          margin: 0;
          font-size: 0.9rem;
        }

        .control-section select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #555;
          background: #2a2a2a;
          color: white;
          font-size: 0.9rem;
        }

        .close-controls {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-end;
        }

        .performance-monitor {
          position: absolute;
          top: 70px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          padding: 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #ccc;
        }

        .perf-metric {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 3px;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .top-game-bar {
            padding: 8px 10px;
            font-size: 0.9rem;
          }

          .turn-number {
            font-size: 1.2rem;
          }

          .phase-name {
            font-size: 1rem;
          }

          .action-buttons {
            bottom: 10px;
            right: 10px;
            flex-direction: column;
          }

          .action-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .timer-bar {
            width: 80px;
          }

          .performance-monitor {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .top-game-bar {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
            text-align: center;
          }

          .timer-info {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedHearthstoneBattlefield;