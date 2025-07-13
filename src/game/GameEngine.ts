import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { CardBattleScene } from './scenes/CardBattleScene';
import { EnhancedCardBattleScene } from './scenes/EnhancedCardBattleScene';
import { DeckBuilderScene } from './scenes/DeckBuilderScene';
import { PremiumCardBattleScene } from './scenes/PremiumCardBattleScene';
import { MobileDeckBuilderScene } from './scenes/MobileDeckBuilderScene';
import { PremiumMainMenuScene } from './scenes/PremiumMainMenuScene';
import { PerformanceManager } from './utils/PerformanceManager';
import { CardArtLoader } from './utils/CardArtLoader';
import { DeckManager } from './utils/DeckManager';

export class GameEngine {
  private game: Phaser.Game | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    // Game engine initialization
  }

  public init(container: HTMLElement): void {
    if (this.game) {
      console.log('[GameEngine] Game already initialized, destroying previous instance');
      this.destroy();
    }
    
    this.container = container;
    
    // Get container dimensions for responsive sizing
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;
    
    console.log(`[GameEngine] Initializing with container size: ${containerWidth}x${containerHeight}`);
    
    // Clear any existing canvas elements to prevent duplicates
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      console.log('[GameEngine] Removing existing canvas element');
      existingCanvas.remove();
    }
    
    // Get performance settings
    const performanceManager = PerformanceManager.getInstance();
    const isLowPerformance = performanceManager.isLowPerformanceDevice();
    console.log(`[GameEngine] Performance settings: ${JSON.stringify(performanceManager.getSettings())}`);
    
    // Preload card art in background
    this.preloadCardArt();
    
    // Initialize deck manager
    this.initializeDeckManager();
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: containerWidth,
      height: containerHeight,
      parent: container,
      backgroundColor: '#1a1a1a',
      scene: [
        // Use PremiumMainMenuScene as default for high-performance devices
        isLowPerformance ? MainMenuScene : PremiumMainMenuScene,
        MainMenuScene,
        PremiumMainMenuScene, 
        GameScene, 
        CardBattleScene, 
        EnhancedCardBattleScene, 
        DeckBuilderScene,
        PremiumCardBattleScene,
        MobileDeckBuilderScene
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      // Optimize rendering based on performance settings
      render: {
        pixelArt: false,
        antialias: !isLowPerformance,
        roundPixels: isLowPerformance,
        powerPreference: isLowPerformance ? 'low-power' : 'high-performance'
      },
      scale: {
        mode: Phaser.Scale.RESIZE, // Use RESIZE mode for better responsiveness
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: containerWidth,
        height: containerHeight,
        min: {
          width: 320,
          height: 480
        },
        max: {
          width: 1920,
          height: 1080
        }
      },
      dom: {
        createContainer: true
      },
      input: {
        touch: true,
        mouse: true,
        smoothFactor: 0.2
      },
      transparent: false, // Ensure opaque background
      clearBeforeRender: true, // Clear canvas before each render
      disableContextMenu: true,
      canvasStyle: 'display: block; width: 100%; height: 100%;' // Ensure canvas takes full container size
    };

    try {
      console.log('[GameEngine] Creating new Phaser game instance');
      this.game = new Phaser.Game(config);
      
      // Add resize handler
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Start with the appropriate menu scene based on performance
      const performanceManager = PerformanceManager.getInstance();
      const isLowPerformance = performanceManager.isLowPerformanceDevice();
      
      const menuScene = isLowPerformance ? 'MainMenuScene' : 'PremiumMainMenuScene';
      console.log(`[GameEngine] Starting ${menuScene}`);
      this.game.scene.start(menuScene);
    } catch (error) {
      console.error('[GameEngine] Error initializing game:', error);
    }
  }

  private handleResize(): void {
    if (this.game && this.container) {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      
      console.log(`[GameEngine] Resizing game to: ${width}x${height}`);
      this.game.scale.resize(width, height);
    }
  }

  public destroy(): void {
    if (this.game) {
      // Remove resize listener
      window.removeEventListener('resize', this.handleResize.bind(this));
      
      // Destroy the game instance
      console.log('[GameEngine] Destroying game instance');
      this.game.destroy(true);
      this.game = null;
      
      // Clear card art cache to free memory
      CardArtLoader.getInstance().clearCache();
    }
  }

  public getGame(): Phaser.Game | null {
    return this.game;
  }
  
  /**
   * Preload card art in the background
   */
  private preloadCardArt(): void {
    // Import cards data
    import('../data/cards').then(({ KONIVRER_CARDS }) => {
      // Preload first 20 cards for faster initial loading
      const initialCards = KONIVRER_CARDS.slice(0, 20);
      console.log(`[GameEngine] Preloading ${initialCards.length} card images...`);
      
      CardArtLoader.getInstance().preloadCards(initialCards)
        .then(() => {
          console.log('[GameEngine] Initial card preloading complete');
          
          // Continue loading the rest in the background
          setTimeout(() => {
            const remainingCards = KONIVRER_CARDS.slice(20);
            console.log(`[GameEngine] Preloading ${remainingCards.length} remaining card images in background...`);
            CardArtLoader.getInstance().preloadCards(remainingCards);
          }, 5000);
        })
        .catch(error => {
          console.error('[GameEngine] Error preloading card images:', error);
        });
    });
  }
  
  /**
   * Initialize deck manager with sample decks
   */
  private initializeDeckManager(): void {
    // Get deck manager instance
    const deckManager = DeckManager.getInstance();
    
    // Check if there are any existing decks
    const existingDecks = deckManager.getLocalDecks();
    
    // If no decks exist, create sample decks
    if (existingDecks.length === 0) {
      console.log('[GameEngine] No existing decks found, creating sample decks...');
      const sampleDecks = deckManager.generateSampleDecks();
      
      // Save sample decks to local storage
      sampleDecks.forEach(deck => {
        deckManager.saveDeck(deck);
      });
      
      console.log(`[GameEngine] Created ${sampleDecks.length} sample decks`);
    } else {
      console.log(`[GameEngine] Found ${existingDecks.length} existing decks`);
    }
  }
}

// Singleton instance
export const gameEngine = new GameEngine();