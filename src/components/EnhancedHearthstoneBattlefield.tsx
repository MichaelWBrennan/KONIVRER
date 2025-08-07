import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from '../game/GameEngine';
import { MysticalArena, ArenaConfig } from '../game/3d/MysticalArena';
import { EnhancedBattlefieldSystem } from './battlefield/EnhancedBattlefieldSystem';
import './battlefield/HearthstoneBattlefield.css';

interface Card {
  id: string;
  name: string;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
  cardType: 'minion' | 'spell' | 'weapon';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
  isPlayable?: boolean;
  canAttack?: boolean;
  hasShield?: boolean;
  isTaunted?: boolean;
}

interface TurnPhase {
  name: string;
  description: string;
  canPlayCards: boolean;
  canAttack: boolean;
  timeRemaining?: number;
}

interface EnhancedBattlefieldProps {
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
  enablePerformanceMonitoring?: boolean;
  className?: string;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  frameTime: number;
  drawCalls: number;
}

const SAMPLE_CARDS: Card[] = [
  {
    id: '1',
    name: 'Fire Elemental',
    cost: 4,
    attack: 4,
    health: 3,
    description: 'Battlecry: Deal 3 damage to any target.',
    cardType: 'minion',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '2',
    name: 'Lightning Bolt',
    cost: 1,
    description: 'Deal 3 damage to any target.',
    cardType: 'spell',
    rarity: 'common',
    isPlayable: true,
  },
  {
    id: '3',
    name: 'Ancient Guardian',
    cost: 6,
    attack: 5,
    health: 8,
    description: 'Taunt. When played, restore 5 Health to your hero.',
    cardType: 'minion',
    rarity: 'rare',
    isTaunted: true,
    isPlayable: false,
  },
];

const TURN_PHASES: TurnPhase[] = [
  {
    name: 'Start Turn',
    description: 'Turn begins, draw a card',
    canPlayCards: false,
    canAttack: false,
  },
  {
    name: 'Main Phase',
    description: 'Play cards and make attacks',
    canPlayCards: true,
    canAttack: true,
  },
  {
    name: 'End Turn',
    description: 'End your turn',
    canPlayCards: false,
    canAttack: false,
  },
];

const EnhancedHearthstoneBattlefield: React.FC<EnhancedBattlefieldProps> = ({
  onThemeChange,
  onQualityChange,
  enablePerformanceMonitoring = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const battlefieldSystemRef = useRef<EnhancedBattlefieldSystem | null>(null);
  const performanceMonitorRef = useRef<number>(0);

  // Game State
  const [playerHand, setPlayerHand] = useState<Card[]>(SAMPLE_CARDS);
  const [playerBattlefield, setPlayerBattlefield] = useState<Card[]>([]);
  const [opponentBattlefield, setOpponentBattlefield] = useState<Card[]>([]);
  const [playerMana, setPlayerMana] = useState({ current: 4, max: 4 });
  const [opponentMana, setOpponentMana] = useState({ current: 3, max: 3 });
  const [playerHealth, setPlayerHealth] = useState(30);
  const [opponentHealth, setOpponentHealth] = useState(30);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
  const [currentPhase, setCurrentPhase] = useState<TurnPhase>(TURN_PHASES[1]);
  const [turnTimer, setTurnTimer] = useState(75);

  // UI State
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    frameTime: 16.67,
    drawCalls: 0,
  });

  // Interactive Elements State
  const [clickableProps, setClickableProps] = useState([
    { id: 'torch1', name: 'Flickering Torch', active: true, x: 10, y: 20 },
    { id: 'torch2', name: 'Flickering Torch', active: true, x: 90, y: 20 },
    { id: 'waterwheel', name: 'Water Wheel', active: true, x: 50, y: 80 },
    { id: 'crystal', name: 'Mystical Crystal', active: false, x: 25, y: 60 },
  ]);

  // Initialize 3D battlefield
  useEffect(() => {
    const initializeBattlefield = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);

        // Initialize game engine
        const engine = new GameEngine();
        gameEngineRef.current = engine;

        await engine.init(canvasRef.current);

        // Create arena configuration
        const arenaConfig: ArenaConfig = {
          theme: currentTheme as any,
          quality,
          enableParticles: quality !== 'low',
          enableLighting: true,
          enablePostProcessing: quality === 'ultra',
          isMobile: window.innerWidth < 768,
          enableInteractiveElements: true,
          enableIdleAnimations: true,
        };

        // Initialize mystical arena
        if (engine.getScene()) {
          const arena = new MysticalArena(engine.getScene()!, arenaConfig);
          arenaRef.current = arena;
          await arena.initialize();
          
          // Initialize Enhanced Battlefield System
          const battlefieldSystem = new EnhancedBattlefieldSystem(engine.getScene()!);
          battlefieldSystemRef.current = battlefieldSystem;
          
          // Listen for battlefield actions
          document.addEventListener('battlefieldAction', handleBattlefieldAction);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize battlefield:', err);
        setIsLoading(false);
      }
    };

    initializeBattlefield();

    return () => {
      if (performanceMonitorRef.current) {
        cancelAnimationFrame(performanceMonitorRef.current);
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, [currentTheme, quality]);

  // Turn timer countdown
  useEffect(() => {
    if (currentTurn === 'player' && currentPhase.name === 'Main Phase') {
      const timer = setInterval(() => {
        setTurnTimer(prev => {
          if (prev <= 1) {
            handleEndTurn();
            return 75;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentTurn, currentPhase]);

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

      // Update FPS every second
      if (currentTime - lastFpsUpdate >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastFpsUpdate));
        frames = 0;
        lastFpsUpdate = currentTime;

        // Get memory usage (approximate)
        const memoryUsage = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          frameTime: deltaTime,
        }));
      }

      performanceMonitorRef.current = requestAnimationFrame(monitor);
    };

    monitor();
  }, []);

  useEffect(() => {
    if (enablePerformanceMonitoring) {
      startPerformanceMonitoring();
    }
  }, [enablePerformanceMonitoring, startPerformanceMonitoring]);

  // Card drag and drop handlers
  const handleCardDrop = (cardId: string, dropZone: string) => {
    const card = playerHand.find(c => c.id === cardId);
    if (!card || !card.isPlayable) return;

    if (dropZone === 'battlefield' && playerMana.current >= card.cost) {
      // Play the card
      setPlayerHand(prev => prev.filter(c => c.id !== cardId));
      setPlayerBattlefield(prev => [...prev, card]);
      setPlayerMana(prev => ({ ...prev, current: prev.current - card.cost }));
      
      // Play card sound
      import('../game/GameEngine').then(({ audioManager }) => {
        audioManager.playCardPlay();
      });
    }
  };

  const handleEndTurn = () => {
    setCurrentTurn(prev => prev === 'player' ? 'opponent' : 'player');
    setTurnTimer(75);
    
    if (currentTurn === 'player') {
      // Start opponent turn
      setOpponentMana(prev => ({ 
        current: Math.min(prev.max + 1, 10), 
        max: Math.min(prev.max + 1, 10) 
      }));
    } else {
      // Start player turn
      setPlayerMana(prev => ({ 
        current: Math.min(prev.max + 1, 10), 
        max: Math.min(prev.max + 1, 10) 
      }));
      // Draw a card (simplified)
      if (playerHand.length < 10) {
        const newCard: Card = {
          id: `card_${Date.now()}`,
          name: 'New Card',
          cost: Math.floor(Math.random() * 6) + 1,
          cardType: 'spell',
          rarity: 'common',
          description: 'A mysterious new card.',
          isPlayable: true,
        };
        setPlayerHand(prev => [...prev, newCard]);
      }
    }
  };

  const handlePropClick = (propId: string) => {
    setClickableProps(prev => prev.map(prop => 
      prop.id === propId 
        ? { ...prop, active: !prop.active }
        : prop
    ));

    // Play interaction sound
    import('../game/GameEngine').then(({ audioManager }) => {
      audioManager.playCardHover();
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (fps: number): string => {
    if (fps >= 55) return '#28a745'; // Green
    if (fps >= 30) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  return (
    <div className={`enhanced-hearthstone-battlefield ${className}`}>
      {/* 3D Battlefield Canvas */}
      <div className="battlefield-3d-container">
        <div ref={canvasRef} className="battlefield-canvas" />
        
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
              <div className="loading-text">Preparing the battlefield...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Props Overlay */}
        <div className="interactive-props">
          {clickableProps.map((prop) => (
            <motion.div
              key={prop.id}
              className={`interactive-prop ${prop.active ? 'active' : ''}`}
              style={{
                left: `${prop.x}%`,
                top: `${prop.y}%`,
              }}
              onClick={() => handlePropClick(prop.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: prop.active ? 1 : 0.6,
                scale: prop.active ? [1, 1.05, 1] : 1,
              }}
              transition={{
                scale: prop.active ? { repeat: Infinity, duration: 2 } : {},
              }}
            >
              <div className="prop-tooltip">{prop.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game UI Overlay */}
      <div className="game-ui-overlay">
        {/* Opponent Zone */}
        <div className="opponent-zone">
          <div className="opponent-info">
            <div className="hero-portrait opponent-hero">
              <div className="health-indicator">{opponentHealth}</div>
              <div className="mana-indicator">{opponentMana.current}/{opponentMana.max}</div>
            </div>
            <div className="opponent-hand">
              {Array(5).fill(null).map((_, index) => (
                <div key={index} className="card-back opponent-card" />
              ))}
            </div>
          </div>
          <div 
            className="battlefield opponent-battlefield"
            onDragOver={(e) => e.preventDefault()}
          >
            {opponentBattlefield.map((card, index) => (
              <motion.div
                key={card.id}
                className="battlefield-card opponent-card"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="card-content">
                  <div className="card-name">{card.name}</div>
                  {card.attack !== undefined && card.health !== undefined && (
                    <div className="card-stats">
                      <span className="attack">{card.attack}</span>
                      <span className="health">{card.health}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Central Play Area */}
        <div className="central-play-area">
          <div className="turn-indicator">
            <div className={`turn-phase ${currentTurn === 'player' ? 'active' : ''}`}>
              <span className="phase-name">{currentPhase.name}</span>
              {currentTurn === 'player' && (
                <div className="turn-timer">
                  <div className="timer-bar" style={{ width: `${(turnTimer / 75) * 100}%` }} />
                  <span className="time-text">{formatTime(turnTimer)}</span>
                </div>
              )}
            </div>
            <motion.button
              className="end-turn-btn"
              onClick={handleEndTurn}
              disabled={currentTurn !== 'player'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End Turn
            </motion.button>
          </div>
        </div>

        {/* Player Zone */}
        <div className="player-zone">
          <div 
            className="battlefield player-battlefield"
            onDragOver={(e) => {
              e.preventDefault();
              setHoveredZone('battlefield');
            }}
            onDragLeave={() => setHoveredZone(null)}
            onDrop={(e) => {
              e.preventDefault();
              const cardId = e.dataTransfer.getData('text/plain');
              handleCardDrop(cardId, 'battlefield');
              setHoveredZone(null);
            }}
          >
            {playerBattlefield.map((card, index) => (
              <motion.div
                key={card.id}
                className="battlefield-card player-card"
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              >
                <div className="card-content">
                  <div className="card-cost">{card.cost}</div>
                  <div className="card-name">{card.name}</div>
                  {card.attack !== undefined && card.health !== undefined && (
                    <div className="card-stats">
                      <span className="attack">{card.attack}</span>
                      <span className="health">{card.health}</span>
                    </div>
                  )}
                  {card.isTaunted && <div className="taunt-indicator">🛡️</div>}
                </div>
              </motion.div>
            ))}
            {hoveredZone === 'battlefield' && (
              <div className="drop-zone-indicator">Drop card here to play</div>
            )}
          </div>
          <div className="player-info">
            <div className="player-hand">
              {playerHand.map((card, index) => (
                <motion.div
                  key={card.id}
                  className={`hand-card ${card.isPlayable && playerMana.current >= card.cost ? 'playable' : ''} ${selectedCard === card.id ? 'selected' : ''}`}
                  data-card-id={card.id}
                  initial={{ scale: 0, rotateX: 90 }}
                  animate={{ scale: 1, rotateX: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  draggable={card.isPlayable && playerMana.current >= card.cost}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', card.id);
                  }}
                  onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  <div className="card-content">
                    <div className="card-cost">{card.cost}</div>
                    <div className="card-name">{card.name}</div>
                    <div className="card-description">{card.description}</div>
                    {card.attack !== undefined && card.health !== undefined && (
                      <div className="card-stats">
                        <span className="attack">{card.attack}</span>
                        <span className="health">{card.health}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="hero-portrait player-hero">
              <div className="health-indicator">{playerHealth}</div>
              <div className="mana-indicator">{playerMana.current}/{playerMana.max}</div>
            </div>
          </div>
        </div>

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

      {/* Theme Controls (minimized during game) */}
      <motion.div
        className="battlefield-controls collapsed"
        initial={{ x: -300 }}
        animate={{ x: -250 }}
        whileHover={{ x: 0 }}
      >
        <h4>⚙️</h4>
        <div className="control-content">
          <div className="control-section">
            <h5>Theme</h5>
            <select
              value={currentTheme}
              onChange={(e) => {
                setCurrentTheme(e.target.value);
                onThemeChange?.(e.target.value);
              }}
            >
              <option value="hearthstone">Tavern</option>
              <option value="forest">Forest</option>
              <option value="desert">Desert</option>
              <option value="volcano">Volcano</option>
            </select>
          </div>
          <div className="control-section">
            <h5>Quality</h5>
            <select
              value={quality}
              onChange={(e) => {
                setQuality(e.target.value as any);
                onQualityChange?.(e.target.value);
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedHearthstoneBattlefield;