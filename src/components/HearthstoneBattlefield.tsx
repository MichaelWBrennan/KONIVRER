import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from '../game/GameEngine';
import { MysticalArena, ArenaConfig } from '../game/3d/MysticalArena';
import AdvancedMTGArenaGame from './AdvancedMTGArenaGame';

interface HearthstoneBattlefieldProps {
  onThemeChange?: (theme: string) => void;
  onQualityChange?: (quality: string) => void;
  enablePerformanceMonitoring?: boolean;
  className?: string;
}

interface BattlefieldTheme {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  unlocked: boolean;
  seasonal?: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  frameTime: number;
  drawCalls: number;
}

const HearthstoneBattlefield: React.FC<HearthstoneBattlefieldProps> = ({
  onThemeChange,
  onQualityChange,
  enablePerformanceMonitoring = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const arenaRef = useRef<MysticalArena | null>(null);
  const performanceMonitorRef = useRef<number>(0);

  const [currentTheme, setCurrentTheme] = useState<string>('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    frameTime: 16.67,
    drawCalls: 0,
  });

  const [battlefieldState, setBattlefieldState] = useState({
    timeOfDay: 'day' as 'dawn' | 'day' | 'dusk' | 'night',
    weather: 'clear' as 'clear' | 'rain' | 'storm' | 'fog' | 'snow',
    season: 'summer' as 'spring' | 'summer' | 'autumn' | 'winter',
    playerMood: 'calm' as 'calm' | 'excited' | 'tense' | 'victorious',
  });

  const [availableThemes] = useState<BattlefieldTheme[]>([
    {
      id: 'hearthstone',
      name: 'Hearthstone Tavern',
      description: 'Cozy tavern with flickering torches and warm firelight',
      previewImage: '/images/battlefields/hearthstone-preview.jpg',
      unlocked: true,
    },
    {
      id: 'forest',
      name: 'Mystical Forest',
      description: 'Ancient woodland with waterfalls and dappled sunlight',
      previewImage: '/images/battlefields/forest-preview.jpg',
      unlocked: true,
    },
    {
      id: 'desert',
      name: 'Ancient Desert',
      description: 'Golden sands with ancient ruins and heat shimmer',
      previewImage: '/images/battlefields/desert-preview.jpg',
      unlocked: true,
    },
    {
      id: 'volcano',
      name: 'Volcanic Crater',
      description: 'Molten lava flows with glowing crystals',
      previewImage: '/images/battlefields/volcano-preview.jpg',
      unlocked: true,
    },
    {
      id: 'innistrad',
      name: 'Innistrad Manor',
      description: 'Gothic manor with creeping shadows',
      previewImage: '/images/battlefields/innistrad-preview.jpg',
      unlocked: false,
      seasonal: false,
    },
    {
      id: 'ravnica',
      name: 'Ravnica Plaza',
      description: 'Urban landscape with guild architecture',
      previewImage: '/images/battlefields/ravnica-preview.jpg',
      unlocked: false,
      seasonal: false,
    },
  ]);

  // Initialize 3D battlefield
  useEffect(() => {
    const initializeBattlefield = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

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
        }

        // Start performance monitoring
        if (enablePerformanceMonitoring) {
          startPerformanceMonitoring();
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize battlefield:', err);
        setError('Failed to initialize 3D battlefield. Falling back to 2D mode.');
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
  }, [currentTheme, quality, enablePerformanceMonitoring]);

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
        const fps = Math.round(frames * 1000 / (currentTime - lastFpsUpdate));
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

        // Dynamic quality adjustment for performance
        if (fps < 30 && quality !== 'low') {
          console.warn('Low FPS detected, suggesting quality reduction');
          handleQualityAutoAdjust('down');
        } else if (fps > 55 && quality !== 'ultra' && memoryUsage < 100) {
          console.log('High FPS with low memory usage, quality could be increased');
        }
      }

      performanceMonitorRef.current = requestAnimationFrame(monitor);
    };

    monitor();
  }, [quality]);

  // Auto-adjust quality based on performance
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
      handleQualityChange(newQuality);
    }
  }, [quality]);

  // Handle theme change
  const handleThemeChange = useCallback(async (newTheme: string) => {
    if (!gameEngineRef.current || newTheme === currentTheme) return;

    setIsLoading(true);
    try {
      await gameEngineRef.current.changeArenaTheme(newTheme);
      setCurrentTheme(newTheme);
      onThemeChange?.(newTheme);
    } catch (error) {
      console.error('Failed to change theme:', error);
      setError('Failed to change battlefield theme');
    }
    setIsLoading(false);
  }, [currentTheme, onThemeChange]);

  // Handle quality change
  const handleQualityChange = useCallback(async (newQuality: typeof quality) => {
    if (!gameEngineRef.current || newQuality === quality) return;

    setIsLoading(true);
    try {
      await gameEngineRef.current.updateArenaQuality(newQuality);
      setQuality(newQuality);
      onQualityChange?.(newQuality);
    } catch (error) {
      console.error('Failed to change quality:', error);
      setError('Failed to change battlefield quality');
    }
    setIsLoading(false);
  }, [quality, onQualityChange]);

  // Handle battlefield state changes
  const handleStateChange = useCallback((key: string, value: string) => {
    const newState = { ...battlefieldState, [key]: value };
    setBattlefieldState(newState);

    // Update battlefield in the 3D engine
    if (arenaRef.current) {
      arenaRef.current.updateBattlefieldState(newState as any);
    }
  }, [battlefieldState]);

  // Get performance color based on FPS
  const getPerformanceColor = (fps: number): string => {
    if (fps >= 55) return '#28a745'; // Green
    if (fps >= 30) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  return (
    <div className={`hearthstone-battlefield ${className}`}>
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
              <div className="loading-text">Loading Battlefield...</div>
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
      </div>

      {/* MTG Arena Game Overlay */}
      <div className="game-overlay">
        <AdvancedMTGArenaGame />
      </div>

      {/* Battlefield Controls */}
      <div className="battlefield-controls">
        {/* Theme Selector */}
        <div className="control-section">
          <h4>Battlefield Theme</h4>
          <div className="theme-grid">
            {availableThemes.map(theme => (
              <motion.button
                key={theme.id}
                className={`theme-option ${theme.id === currentTheme ? 'active' : ''} ${!theme.unlocked ? 'locked' : ''}`}
                onClick={() => theme.unlocked && handleThemeChange(theme.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!theme.unlocked}
              >
                <div className="theme-preview">
                  <img 
                    src={theme.previewImage} 
                    alt={theme.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/battlefields/default-preview.jpg';
                    }}
                  />
                  {!theme.unlocked && <div className="lock-overlay">🔒</div>}
                </div>
                <div className="theme-info">
                  <strong>{theme.name}</strong>
                  <p>{theme.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quality Settings */}
        <div className="control-section">
          <h4>Graphics Quality</h4>
          <div className="quality-buttons">
            {(['low', 'medium', 'high', 'ultra'] as const).map(q => (
              <button
                key={q}
                className={`quality-btn ${q === quality ? 'active' : ''}`}
                onClick={() => handleQualityChange(q)}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Environmental Controls */}
        <div className="control-section">
          <h4>Environment</h4>
          <div className="env-controls">
            <div className="env-control">
              <label>Time of Day:</label>
              <select 
                value={battlefieldState.timeOfDay}
                onChange={(e) => handleStateChange('timeOfDay', e.target.value)}
              >
                <option value="dawn">Dawn</option>
                <option value="day">Day</option>
                <option value="dusk">Dusk</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div className="env-control">
              <label>Weather:</label>
              <select 
                value={battlefieldState.weather}
                onChange={(e) => handleStateChange('weather', e.target.value)}
              >
                <option value="clear">Clear</option>
                <option value="rain">Rain</option>
                <option value="storm">Storm</option>
                <option value="fog">Fog</option>
                <option value="snow">Snow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Performance Monitor */}
        {enablePerformanceMonitoring && (
          <div className="control-section">
            <h4>Performance</h4>
            <div className="performance-metrics">
              <div className="metric">
                <span>FPS:</span>
                <span style={{ color: getPerformanceColor(performanceMetrics.fps) }}>
                  {performanceMetrics.fps}
                </span>
              </div>
              <div className="metric">
                <span>Memory:</span>
                <span>{performanceMetrics.memoryUsage}MB</span>
              </div>
              <div className="metric">
                <span>Frame Time:</span>
                <span>{performanceMetrics.frameTime.toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HearthstoneBattlefield;