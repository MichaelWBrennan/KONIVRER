import React, { useEffect, useRef, useState } from 'react';
import { gameEngine } from '../game/GameEngine';

/**
 * GameZonez Demo Component
 * Demonstrates the pseudo-3D environment system with interactive controls
 */
export const GameZonezDemo: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeZones, setActiveZones] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDemo = async () => {
      if (canvasContainerRef.current && !isInitialized) {
        setIsLoading(true);
        try {
          console.log('[GameZonezDemo] Initializing demo...');
          await gameEngine.init(canvasContainerRef.current);
          setIsInitialized(true);

          // Get initial active zones after a short delay to allow initialization
          setTimeout(() => {
            const arena = gameEngine.isArenaInitialized();
            if (arena) {
              const mysticalArena = (gameEngine as any).mysticalArena;
              if (mysticalArena) {
                const gameZonez = mysticalArena.getGameZonez();
                if (gameZonez) {
                  const zones = gameZonez.getActiveZones();
                  setActiveZones(zones.map((zone: any) => zone.id));
                }
              }
            }
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.error('[GameZonezDemo] Failed to initialize:', error);
          setIsLoading(false);
        }
      }
    };

    initializeDemo();

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        gameEngine.destroy();
        setIsInitialized(false);
      }
    };
  }, [isInitialized]);

  const toggleZone = (zoneId: string) => {
    try {
      const mysticalArena = (gameEngine as any).mysticalArena;
      if (mysticalArena) {
        const gameZonez = mysticalArena.getGameZonez();
        if (gameZonez) {
          const isActive = activeZones.includes(zoneId);
          gameZonez.setZoneActive(zoneId, !isActive);
          
          if (isActive) {
            setActiveZones(prev => prev.filter(id => id !== zoneId));
          } else {
            setActiveZones(prev => [...prev, zoneId]);
          }
        }
      }
    } catch (error) {
      console.error('[GameZonezDemo] Error toggling zone:', error);
    }
  };

  const changeArenaTheme = (theme: string) => {
    try {
      gameEngine.changeArenaTheme(theme as any);
      console.log(`[GameZonezDemo] Changed theme to: ${theme}`);
    } catch (error) {
      console.error('[GameZonezDemo] Error changing theme:', error);
    }
  };

  const demoZones = [
    { id: 'mode7_background', name: 'Mode7 Background', technique: 'Mode7' },
    { id: 'isometric_battlefield', name: 'Isometric Field', technique: 'Isometric' },
    { id: 'sprite_characters', name: '2.5D Sprites', technique: '2.5D' },
    { id: 'ui_overlay', name: '2D UI Overlay', technique: '2D' },
    { id: '3d_effects', name: '3D Effects', technique: '3D' },
  ];

  const availableThemes = [
    'hearthstone', 'mystical', 'forest', 'desert', 'volcano', 'ancient', 'ethereal', 'cosmic'
  ];

  return (
    <div className="gamezonez-demo">
      <div className="demo-header">
        <h2>GameZonez Pseudo-3D Environment Demo</h2>
        <p>Experience the combination of 2.5D, Isometric, Mode7, and 2D assets in a unified environment</p>
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading GameZonez System...</span>
          </div>
        )}
      </div>

      <div className="demo-container">
        <div className="canvas-wrapper">
          <div 
            ref={canvasContainerRef} 
            className="canvas-container"
            style={{
              width: '100%',
              height: '600px',
              border: '2px solid #4a5568',
              borderRadius: '8px',
              background: '#1a202c',
              position: 'relative',
            }}
          />
        </div>

        <div className="controls-panel">
          <div className="control-group">
            <h3>Rendering Zones</h3>
            <div className="zone-controls">
              {demoZones.map(zone => (
                <div key={zone.id} className="zone-control">
                  <label className="zone-toggle">
                    <input
                      type="checkbox"
                      checked={activeZones.includes(zone.id)}
                      onChange={() => toggleZone(zone.id)}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    <div className="zone-info">
                      <span className="zone-name">{zone.name}</span>
                      <span className="zone-technique">{zone.technique}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Arena Themes</h3>
            <div className="theme-controls">
              {availableThemes.map(theme => (
                <button
                  key={theme}
                  className="theme-button"
                  onClick={() => changeArenaTheme(theme)}
                  disabled={isLoading}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Features</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🎮</span>
                <span>Mode7-style backgrounds with scrolling effects</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📐</span>
                <span>Isometric perspective for strategy elements</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <span>2.5D sprites integrated with 3D space</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>2D UI overlays and HUD elements</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Full 3D objects and particle effects</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌊</span>
                <span>Parallax scrolling for depth perception</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gamezonez-demo {
          padding: 20px;
          background: #f7fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .demo-header h2 {
          color: #2d3748;
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .demo-header p {
          color: #718096;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          color: #4299e1;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .demo-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .demo-container {
            grid-template-columns: 1fr;
          }
        }

        .canvas-wrapper {
          background: #1a202c;
          border-radius: 8px;
          padding: 10px;
        }

        .controls-panel {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .control-group {
          margin-bottom: 30px;
        }

        .control-group h3 {
          color: #2d3748;
          font-size: 1.2rem;
          margin-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 5px;
        }

        .zone-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .zone-control {
          background: #f7fafc;
          border-radius: 6px;
          padding: 10px;
        }

        .zone-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .zone-toggle input {
          margin: 0;
        }

        .zone-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .zone-name {
          font-weight: 500;
          color: #2d3748;
        }

        .zone-technique {
          font-size: 0.8rem;
          color: #718096;
        }

        .theme-controls {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
        }

        .theme-button {
          padding: 8px 12px;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .theme-button:hover {
          background: #3182ce;
        }

        .theme-button:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: #f7fafc;
          border-radius: 4px;
        }

        .feature-icon {
          font-size: 1.2rem;
        }

        .feature-item span:last-child {
          color: #4a5568;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};