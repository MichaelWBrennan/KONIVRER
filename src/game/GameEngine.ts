import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { PerformanceManager } from './utils/PerformanceManager';
import { CardArtLoader } from './utils/CardArtLoader';
import { DeckManager } from './utils/DeckManager';
import { UnifiedMainMenuScene } from './scenes/UnifiedMainMenuScene';
import { UnifiedCardBattleScene } from './scenes/UnifiedCardBattleScene';
import { UnifiedDeckBuilderScene } from './scenes/UnifiedDeckBuilderScene';

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
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;

    console.log(`[GameEngine] Initializing with container size: ${containerWidth}x${containerHeight}`);

    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const performanceManager = PerformanceManager.getInstance();
    const isLowPerformance = performanceManager.isLowPerformanceDevice();

    this.preloadCardArt();
    this.initializeDeckManager();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: containerWidth,
      height: containerHeight,
      parent: container,
      backgroundColor: '#1a1a1a',
      scene: [
        new UnifiedMainMenuScene(isLowPerformance),
        new UnifiedCardBattleScene('basic'),
        new UnifiedCardBattleScene('premium'),
        GameScene,
        new UnifiedDeckBuilderScene(),
        new UnifiedCardBattleScene('enhanced')
      ],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      render: {
        pixelArt: false,
        antialias: !isLowPerformance,
        roundPixels: isLowPerformance,
        powerPreference: isLowPerformance ? 'low-power' : 'high-performance'
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: containerWidth,
        height: containerHeight,
        min: { width: 320, height: 480 },
        max: { width: 1920, height: 1080 }
      },
      dom: { createContainer: true },
      input: { touch: true, mouse: true, smoothFactor: 0.2 },
      transparent: false,
      clearBeforeRender: true,
      disableContextMenu: true,
      canvasStyle: 'display: block; width: 100%; height: 100%;'
    };

    try {
      this.game = new Phaser.Game(config);
      window.addEventListener('resize', this.handleResize.bind(this));
      const menuScene = isLowPerformance ? 'UnifiedMainMenuScene' : 'UnifiedMainMenuScene';
      this.game.scene.start(menuScene);
    } catch (error) {
      console.error('[GameEngine] Error initializing game:', error);
    }
  }

  private handleResize(): void {
    if (this.game && this.container) {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.game.scale.resize(width, height);
    }
  }

  public destroy(): void {
    if (this.game) {
      window.removeEventListener('resize', this.handleResize.bind(this));
      this.game.destroy(true);
      this.game = null;
      CardArtLoader.getInstance().clearCache();
    }
  }

  public getGame(): Phaser.Game | null {
    return this.game;
  }

  private preloadCardArt(): void {
    import('../data/cards').then(({ KONIVRER_CARDS }) => {
      const initialCards = KONIVRER_CARDS.slice(0, 20);
      CardArtLoader.getInstance().preloadCards(initialCards).then(() => {
        setTimeout(() => {
          const remainingCards = KONIVRER_CARDS.slice(20);
          CardArtLoader.getInstance().preloadCards(remainingCards);
        }, 5000);
      }).catch(error => {
        console.error('[GameEngine] Error preloading card images:', error);
      });
    });
  }

  private initializeDeckManager(): void {
    const deckManager = DeckManager.getInstance();
    const existingDecks = deckManager.getLocalDecks();
    if (existingDecks.length === 0) {
      const sampleDecks = deckManager.generateSampleDecks();
      sampleDecks.forEach(deck => {
        deckManager.saveDeck(deck);
      });
    }
  }
}

export const gameEngine = new GameEngine();