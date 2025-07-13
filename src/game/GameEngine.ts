import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { CardBattleScene } from './scenes/CardBattleScene';
import { EnhancedCardBattleScene } from './scenes/EnhancedCardBattleScene';
import { DeckBuilderScene } from './scenes/DeckBuilderScene';
import { PremiumCardBattleScene } from './scenes/PremiumCardBattleScene';
import { MobileDeckBuilderScene } from './scenes/MobileDeckBuilderScene';
import { PremiumMainMenuScene } from './scenes/PremiumMainMenuScene';

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
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: containerWidth,
      height: containerHeight,
      parent: container,
      backgroundColor: '#1a1a1a',
      scene: [
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
      render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false,
        transparent: false, // Ensure opaque background
        clearBeforeRender: true // Clear canvas before each render
      },
      disableContextMenu: true,
      canvasStyle: 'display: block; width: 100%; height: 100%;' // Ensure canvas takes full container size
    };

    try {
      console.log('[GameEngine] Creating new Phaser game instance');
      this.game = new Phaser.Game(config);
      
      // Add resize handler
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Start with main menu scene
      console.log('[GameEngine] Starting MainMenuScene');
      this.game.scene.start('MainMenuScene');
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
    }
  }

  public getGame(): Phaser.Game | null {
    return this.game;
  }
}

// Singleton instance
export const gameEngine = new GameEngine();