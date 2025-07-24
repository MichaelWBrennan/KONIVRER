
import Phaser from 'phaser';
import { KONIVRER_CARDS, Card } from '../../data/cards';

interface GameCard extends Card {
  gameId: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  isPlayable: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  glowEffect?: Phaser.GameObjects.Image;
  particles?: Phaser.GameObjects.Particles.ParticleEmitter;
}

interface Player {
  health: number;
  mana: number;
  maxMana: number;
  hand: GameCard[];
  deck: GameCard[];
  battlefield: GameCard[];
  avatar?: Phaser.GameObjects.Image;
}

export class UnifiedCardBattleScene extends Phaser.Scene {
  private player1!: Player;
  private player2!: Player;
  private currentPlayer: 1 | 2 = 1;
  private turnNumber: number = 1;
  private selectedCard: GameCard | null = null;
  private gamePhase: 'setup' | 'playing' | 'ended' = 'setup';
  private sceneType: 'basic' | 'enhanced' | 'premium';

  constructor(type: 'basic' | 'enhanced' | 'premium') {
    super({ key: 'UnifiedCardBattleScene' });
    this.sceneType = type;
  }

  preload() {
    KONIVRER_CARDS.forEach(card => {
      const imagePath = `/assets/cards/${card.name.toUpperCase()}.png`;
      this.load.image(card.id, imagePath);
    });

    if (this.sceneType === 'premium') {
      // Load additional assets for premium.
      this.load.image('particle-fire', 'data:image/png;base64,...');
      this.load.image('particle-water', 'data:image/png;base64,...');
    }
  }

  create() {
    this.setUpSceneType();
    this.createGameEntities();
    this.initializePlayers();
    this.startGame();
  }

  private setUpSceneType() {
    const { width, height } = this.cameras.main;

    // Unified background taking care of the scene type
    switch (this.sceneType) {
      case 'premium':
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0f14);
        this.createParticleEffects();
        break;
      case 'enhanced':
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
        break;
      default:
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);
        break;
    }
  }

  private createGameEntities() {
    // Logic to create UI elements and other game entities.
  }

  private initializePlayers() {
    const initializePlayerDeck = (): GameCard[] => 
      KONIVRER_CARDS.map((card, index) => ({
        ...card,
        gameId: `${card.id}_${index}`,
        x: 0,
        y: 0,
        isPlayable: false,
        isHovered: false
    }));

    this.player1 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: initializePlayerDeck(),
      battlefield: []
    };

    this.player2 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: initializePlayerDeck(),
      battlefield: []
    };

    this.drawCards(this.player1, 5);
    this.drawCards(this.player2, 5);
  }

  private drawCards(player: Player, count: number) {
    for (let i = 0; i < count && player.deck.length > 0; i++) {
      const card = player.deck.pop()!;
      player.hand.push(card);
    }
    this.updateHandDisplay();
  }

  private startGame() {
    this.gamePhase = 'playing';
    this.updateDisplay();
  }

  private updateDisplay() {
    // Logic for updating the display based on players' current state.
  }

  private createParticleEffects() {
    if (this.sceneType === 'premium') {
      this.add.particles(400, 300, 'particle-fire', {
        speed: { min: 10, max: 30 },
        scale: { start: 0.1, end: 0 },
        alpha: { start: 0.3, end: 0 },
        lifespan: 3000,
        frequency: 200,
        emitZoneType: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, 800, 600)
      }).setDepth(-1);
    }
  }

  private updateHandDisplay() {
    // Method to update hand display visually
  }
}
