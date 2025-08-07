import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';

interface BattlefieldDemoProps {
  className?: string;
}

export const BattlefieldDemo: React.FC<BattlefieldDemoProps> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [currentTheme, setCurrentTheme] = useState<
    'forest' | 'desert' | 'volcano' | 'hearthstone'
  >('hearthstone');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>(
    'high',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [memoryUsage, setMemoryUsage] = useState('0MB');
  const [battlefieldState, setBattlefieldState] = useState({
    timeOfDay: 'day',
    weather: 'clear',
    season: 'summer',
    playerMood: 'calm',
  });

  useEffect(() => {
    const initializeEngine = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        const engine = new GameEngine();
        gameEngineRef.current = engine;

        await engine.init(canvasRef.current);

        // Get initial memory usage
        if (engine.isArenaInitialized()) {
          const memStats = engine.getArenaConfig();
          console.log('Arena initialized with config:', memStats);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize battlefield demo:', error);
        setIsLoading(false);
      }
    };

    initializeEngine();

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  const handleThemeChange = async (newTheme: typeof currentTheme) => {
    if (!gameEngineRef.current || newTheme === currentTheme) return;

    setIsLoading(true);
    try {
      await gameEngineRef.current.changeArenaTheme(newTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
    setIsLoading(false);
  };

  const handleQualityChange = async (newQuality: typeof quality) => {
    if (!gameEngineRef.current || newQuality === quality) return;

    setIsLoading(true);
    try {
      await gameEngineRef.current.updateArenaQuality(newQuality);
      setQuality(newQuality);
    } catch (error) {
      console.error('Failed to change quality:', error);
    }
    setIsLoading(false);
  };

  const handleStateChange = (key: string, value: string) => {
    const newState = { ...battlefieldState, [key]: value };
    setBattlefieldState(newState);

    // Update battlefield state in the engine
    // Note: This would need to be implemented in the GameEngine
    console.log('Battlefield state updated:', newState);
  };

  const getThemeDescription = (theme: string) => {
    const descriptions = {
      hearthstone: 'Cozy tavern with pseudo-3D depth, Mode7 floors, and 2.5D character sprites',
      forest: 'Mystical woodland with parallax waterfalls, isometric tiles, and layered depth',
      desert: 'Ancient ruins with Mode7 sand dunes, billboard sprites, and multi-layer backgrounds',
      volcano: 'Molten landscape with pseudo-3D lava flows, isometric rocks, and depth layering',
    };
    return descriptions[theme as keyof typeof descriptions] || 'Unknown theme';
  };

  return (
    <div className={`battlefield-demo ${className || ''}`}>
      <div className="demo-header">
        <h2>🏰 Enhanced Pseudo-3D Battlefield System</h2>
        <p>
          Interactive battlefield combining 2.5D, isometric, Mode7, and 2D
          assets for immersive gaming experience
        </p>
        <div className="pseudo-3d-features">
          <span className="feature-badge">🎮 Mode7 Backgrounds</span>
          <span className="feature-badge">📐 Isometric Views</span>
          <span className="feature-badge">🖼️ 2.5D Sprites</span>
          <span className="feature-badge">🌌 Parallax Layers</span>
        </div>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label>🎨 Arena Theme:</label>
          <select
            value={currentTheme}
            onChange={e =>
              handleThemeChange(e.target.value as typeof currentTheme)
            }
            disabled={isLoading}
          >
            <option value="hearthstone">🍺 Hearthstone Tavern</option>
            <option value="forest">🌲 Mystical Forest</option>
            <option value="desert">🏜️ Ancient Desert</option>
            <option value="volcano">🌋 Volcanic Crater</option>
          </select>
          <span className="theme-description">
            {getThemeDescription(currentTheme)}
          </span>
        </div>

        <div className="control-group">
          <label>⚙️ Quality:</label>
          <select
            value={quality}
            onChange={e =>
              handleQualityChange(e.target.value as typeof quality)
            }
            disabled={isLoading}
          >
            <option value="low">📱 Low (Mobile Optimized)</option>
            <option value="medium">💻 Medium (Tablet)</option>
            <option value="high">🖥️ High (Desktop)</option>
            <option value="ultra">✨ Ultra (High-End)</option>
          </select>
        </div>

        <div className="control-group">
          <label>🕒 Time of Day:</label>
          <select
            value={battlefieldState.timeOfDay}
            onChange={e => handleStateChange('timeOfDay', e.target.value)}
          >
            <option value="dawn">🌅 Dawn</option>
            <option value="day">☀️ Day</option>
            <option value="dusk">🌆 Dusk</option>
            <option value="night">🌙 Night</option>
          </select>
        </div>

        <div className="control-group">
          <label>🌤️ Weather:</label>
          <select
            value={battlefieldState.weather}
            onChange={e => handleStateChange('weather', e.target.value)}
          >
            <option value="clear">☀️ Clear</option>
            <option value="rain">🌧️ Rain</option>
            <option value="storm">⛈️ Storm</option>
            <option value="fog">🌫️ Fog</option>
            <option value="snow">❄️ Snow</option>
          </select>
        </div>

        <div className="control-group">
          <label>😊 Player Mood:</label>
          <select
            value={battlefieldState.playerMood}
            onChange={e => handleStateChange('playerMood', e.target.value)}
          >
            <option value="calm">😌 Calm</option>
            <option value="excited">😃 Excited</option>
            <option value="tense">😰 Tense</option>
            <option value="victorious">🎉 Victorious</option>
          </select>
        </div>
      </div>

      <div className="battlefield-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading {currentTheme} battlefield...</p>
          </div>
        )}

        <div
          ref={canvasRef}
          className="battlefield-canvas"
          style={{
            width: '100%',
            height: '600px',
            border: '2px solid #8B4513',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        />

        <div className="battlefield-info">
          <div className="info-panel">
            <h4>🔧 System Info</h4>
            <p>
              <strong>Theme:</strong> {currentTheme}
            </p>
            <p>
              <strong>Quality:</strong> {quality}
            </p>
            <p>
              <strong>Memory Usage:</strong> {memoryUsage}
            </p>
            <p>
              <strong>Features:</strong> Interactive elements, idle animations,
              responsive design
            </p>
          </div>

          <div className="info-panel">
            <h4>🎮 Controls</h4>
            <p>
              <strong>WASD:</strong> Move around
            </p>
            <p>
              <strong>Mouse:</strong> Look around
            </p>
            <p>
              <strong>Click:</strong> Interact with objects
            </p>
            <p>
              <strong>Hover:</strong> See tooltips
            </p>
          </div>

          <div className="info-panel">
            <h4>✨ Interactive Elements</h4>
            <p>🔥 Torches - Click to light/extinguish</p>
            <p>💎 Crystals - Hover for magical effects</p>
            <p>🌊 Waterfalls - Soothing ambient sounds</p>
            <p>🏛️ Ancient runes - Mystical interactions</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .battlefield-demo {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'OpenDyslexic', Arial, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .demo-header h2 {
          color: #d4af37;
          margin-bottom: 10px;
        }

        .demo-header p {
          color: #888;
          font-style: italic;
        }

        .demo-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(26, 26, 46, 0.8);
          border-radius: 8px;
          border: 1px solid #444;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .control-group label {
          color: #d4af37;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .control-group select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #555;
          background: #2a2a4a;
          color: #fff;
          font-family: 'OpenDyslexic', Arial, sans-serif;
        }

        .control-group select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .theme-description {
          font-size: 0.8rem;
          color: #aaa;
          font-style: italic;
          margin-top: 2px;
        }

        .battlefield-container {
          position: relative;
        }

        .loading-overlay {
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
          z-index: 10;
          color: #d4af37;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top: 3px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .battlefield-canvas {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .battlefield-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .info-panel {
          background: rgba(26, 26, 46, 0.8);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #444;
        }

        .info-panel h4 {
          color: #d4af37;
          margin-bottom: 10px;
          margin-top: 0;
        }

        .info-panel p {
          color: #ccc;
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .info-panel strong {
          color: #fff;
        }

        @media (max-width: 768px) {
          .demo-controls {
            grid-template-columns: 1fr;
          }

          .battlefield-canvas {
            height: 400px !important;
          }

          .battlefield-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BattlefieldDemo;
