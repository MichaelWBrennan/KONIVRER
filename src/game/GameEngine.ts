import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { CardBattleScene } from './scenes/CardBattleScene';
import { EnhancedCardBattleScene } from './scenes/EnhancedCardBattleScene';
import { DeckBuilderScene } from './scenes/DeckBuilderScene';

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
      scene: [MainMenuScene, GameScene, CardBattleScene, EnhancedCardBattleScene, DeckBuilderScene],
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
      }
    };

    this.game = new Phaser.Game(config);
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