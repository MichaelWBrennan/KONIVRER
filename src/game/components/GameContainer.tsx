import React, { useEffect, useRef } from 'react';
import { gameEngine } from '../GameEngine';
import '../styles/mobile.css';

interface GameContainerProps {
  onClose?: () => void;
  setShowGame?: (show: boolean) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onClose, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInitializedRef = useRef<boolean>(false);
  const [isLandscape, setIsLandscape] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showOrientationPrompt, setShowOrientationPrompt] = React.useState(false);
  const [currentScene, setCurrentScene] = React.useState<string | undefined>(undefined);
  const [showAccessibilityButton, setShowAccessibilityButton] = React.useState(true);

  // Check if device is mobile and set orientation state
  useEffect(() => {
    const checkMobileAndOrientation = () => {
      // Check if device is mobile
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
      
      // Check orientation
      const isLandscapeOrientation = window.matchMedia("(orientation: landscape)").matches;
      setIsLandscape(isLandscapeOrientation);
      
      // Show orientation prompt only on mobile in portrait mode
      setShowOrientationPrompt(mobileCheck && !isLandscapeOrientation);
      
      // Update accessibility button visibility
      // Hide when in landscape mode on mobile or when in main menu
      const inMainMenu = window.KONIVRER_CURRENT_SCENE === 'MainMenuScene';
      setShowAccessibilityButton(!inMainMenu && !(mobileCheck && isLandscapeOrientation));
    };
    
    checkMobileAndOrientation();
    
    // Add event listener for orientation changes
    window.addEventListener('resize', checkMobileAndOrientation);
    window.addEventListener('orientationchange', checkMobileAndOrientation);
    
    // Set up an interval to check the current scene
    const sceneCheckInterval = setInterval(() => {
      const currentScene = window.KONIVRER_CURRENT_SCENE;
      setCurrentScene(currentScene);
      
      // Update accessibility button visibility based on current scene
      const inMainMenu = currentScene === 'MainMenuScene';
      setShowAccessibilityButton(!inMainMenu && !(isMobile && isLandscape));
    }, 500);
    
    return () => {
      window.removeEventListener('resize', checkMobileAndOrientation);
      window.removeEventListener('orientationchange', checkMobileAndOrientation);
      clearInterval(sceneCheckInterval);
    };
  }, [isMobile, isLandscape]);

  useEffect(() => {
    // Only initialize game if not on mobile or if on mobile and in landscape mode
    if (!isMobile || (isMobile && isLandscape)) {
      // Small delay to ensure DOM is fully rendered
      const initTimer = setTimeout(() => {
        if (gameRef.current && !gameInitializedRef.current) {
          // Make setShowGame available globally for the game
          if (setShowGame) {
            window.setShowGame = setShowGame;
          }
          
          // Initialize the game engine
          try {
            console.log('[GameContainer] Initializing game engine...');
            gameEngine.init(gameRef.current);
            gameInitializedRef.current = true;
            console.log('[GameContainer] Game engine initialized successfully');
          } catch (error) {
            console.error('[GameContainer] Error initializing game engine:', error);
          }
        }
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(initTimer);
      };
    } else if (gameInitializedRef.current) {
      // Destroy game if orientation changes to portrait on mobile
      try {
        console.log('[GameContainer] Destroying game engine due to orientation change...');
        gameEngine.destroy();
        gameInitializedRef.current = false;
      } catch (error) {
        console.error('[GameContainer] Error destroying game engine:', error);
      }
    }
  }, [setShowGame, isMobile, isLandscape]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        console.log('[GameContainer] Destroying game engine on unmount...');
        gameEngine.destroy();
        gameInitializedRef.current = false;
        // Clean up global reference
        if (window.setShowGame) {
          delete window.setShowGame;
        }
        if (window.KONIVRER_ACCESSIBILITY_CLICKED) {
          delete window.KONIVRER_ACCESSIBILITY_CLICKED;
        }
        if (window.KONIVRER_CURRENT_SCENE) {
          delete window.KONIVRER_CURRENT_SCENE;
        }
      } catch (error) {
        console.error('[GameContainer] Error destroying game engine:', error);
      }
    };
  }, []);
  
  // Set up accessibility click handler
  useEffect(() => {
    // Define the accessibility click handler
    window.KONIVRER_ACCESSIBILITY_CLICKED = () => {
      console.log('[GameContainer] Accessibility button clicked in game menu');
      // This function will be called when the accessibility button in the game menu is clicked
      // We can use this to sync state between the game menu and the floating button
    };
    
    return () => {
      if (window.KONIVRER_ACCESSIBILITY_CLICKED) {
        delete window.KONIVRER_ACCESSIBILITY_CLICKED;
      }
    };
  }, []);

  return (
    <div className="mobile-game-container" style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: '#1a1a1a'
    }}>
      {/* Floating Accessibility button - only shown when not in main menu or when in portrait mode on mobile */}
      {showAccessibilityButton && (
        <button
          onClick={() => {
            alert('Accessibility options coming soon!');
            // Call the same function that the in-game button would call
            if (window.KONIVRER_ACCESSIBILITY_CLICKED) {
              window.KONIVRER_ACCESSIBILITY_CLICKED();
            }
          }}
          className="touch-button"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 1001,
            fontSize: '14px',
            padding: '8px 16px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Accessibility Options"
        >
          <span role="img" aria-label="Accessibility" style={{ marginRight: '5px' }}>♿</span>
          Accessibility
        </button>
      )}
      
      {/* Orientation prompt for mobile devices */}
      {showOrientationPrompt && (
        <div className="orientation-prompt" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Please Rotate Your Device</h2>
          <div className="orientation-icon">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16L16 12L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="orientation-text">
            KONIVRER is best experienced in landscape mode. 
            Please rotate your device for the optimal gaming experience.
          </p>
        </div>
      )}
      
      {/* Game container - only initialize when in landscape on mobile */}
      <div
        ref={gameRef}
        className="game-ui"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          visibility: (isMobile && !isLandscape) ? 'hidden' : 'visible'
        }}
      />
    </div>
  );
};