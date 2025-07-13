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
      // Get screen dimensions
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      
      // Check if device is mobile (excluding tablets)
      const userAgent = navigator.userAgent;
      
      // Detect if it's a tablet or large device
      const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent) || 
                       (Math.min(screenWidth, screenHeight) >= 600); // Common tablet minimum width
      
      // Detect if it's a phone
      const isPhone = /iPhone|Android.*Mobile|Mobile/i.test(userAgent) && !isTablet;
      
      // Set mobile state (only true for phones, not tablets)
      setIsMobile(isPhone);
      
      // Check orientation
      const isLandscapeOrientation = window.matchMedia("(orientation: landscape)").matches;
      setIsLandscape(isLandscapeOrientation);
      
      // Calculate aspect ratio
      const aspectRatio = screenWidth / screenHeight;
      
      // Determine if the device needs rotation
      // Only show prompt for phones in portrait mode with limited vertical space
      const needsRotation = isPhone && 
                           !isLandscapeOrientation && 
                           aspectRatio < 0.7 && // Portrait aspect ratio
                           screenHeight < 900;  // Not a foldable in expanded mode or tall device
      
      setShowOrientationPrompt(needsRotation);
      
      // Update accessibility button visibility
      // Hide when in landscape mode on mobile or when in main menu
      const inMainMenu = window.KONIVRER_CURRENT_SCENE === 'MainMenuScene';
      setShowAccessibilityButton(!inMainMenu && !(isPhone && isLandscapeOrientation));
      
      // Log for debugging
      console.log(`[GameContainer] Device detection: 
        isPhone: ${isPhone}, 
        isTablet: ${isTablet}, 
        isLandscape: ${isLandscapeOrientation}, 
        screenSize: ${screenWidth}x${screenHeight}, 
        aspectRatio: ${aspectRatio.toFixed(2)}, 
        needsRotation: ${needsRotation}`);
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
    // Always initialize the game, but show/hide it based on orientation
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
          
          // If orientation prompt is showing, hide the game canvas but keep it initialized
          if (showOrientationPrompt && gameRef.current) {
            const canvas = gameRef.current.querySelector('canvas');
            if (canvas) {
              canvas.style.visibility = showOrientationPrompt ? 'hidden' : 'visible';
            }
          }
        } catch (error) {
          console.error('[GameContainer] Error initializing game engine:', error);
        }
      } else if (gameInitializedRef.current && gameRef.current) {
        // If game is already initialized, just update canvas visibility
        const canvas = gameRef.current.querySelector('canvas');
        if (canvas) {
          canvas.style.visibility = showOrientationPrompt ? 'hidden' : 'visible';
        }
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(initTimer);
    };
  }, [setShowGame, showOrientationPrompt]);

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
      position: 'fixed', // Changed from absolute to fixed
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: '#1a1a1a',
      zIndex: 1000 // Ensure high z-index
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
      
      {/* Game container - always initialize but control visibility */}
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
          zIndex: 5, // Ensure it's above other elements but below the orientation prompt
          visibility: showOrientationPrompt ? 'hidden' : 'visible' // Control visibility based on orientation prompt
        }}
      />
    </div>
  );
};