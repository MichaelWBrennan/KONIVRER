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
    this.container = container;
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      parent: container,
      backgroundColor: '#1a1a1a',
      scene: [
        PremiumMainMenuScene, 
        MainMenuScene, 
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 800,
          height: 600
        },
        max: {
          width: 1600,
          height: 1200
        }
      },
      dom: {
        createContainer: true
      },
      input: {
        touch: true,
        mouse: true,
        smoothFactor: 0.2
      }
    };

    this.game = new Phaser.Game(config);
    
    // Start with premium main menu
    this.game.scene.start('PremiumMainMenuScene');
  }

  public destroy(): void {
    if (this.game) {
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