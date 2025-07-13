import Phaser from 'phaser';

interface Card {
  id: string;
  name: string;
  cost: number;
  attack: number;
  health: number;
  type: string;
}

export class CardBattleScene extends Phaser.Scene {
  private gameMode: string = 'practice';
  private playerHand: Card[] = [];
  private playerHealth: number = 30;
  private opponentHealth: number = 30;
  private playerMana: number = 1;
  private maxMana: number = 1;
  private turn: number = 1;
  private isPlayerTurn: boolean = true;

  constructor() {
    super({ key: 'CardBattleScene' });
  }

  init(data: { mode: string }): void {
    this.gameMode = data.mode || 'practice';
    this.initializeGame();
  }

  private initializeGame(): void {
    // Initialize sample cards
    this.playerHand = [
      { id: '1', name: 'Fire Sprite', cost: 1, attack: 2, health: 1, type: 'Familiar' },
      { id: '2', name: 'Water Guardian', cost: 2, attack: 1, health: 3, type: 'Familiar' },
      { id: '3', name: 'Lightning Bolt', cost: 1, attack: 3, health: 0, type: 'Spell' },
      { id: '4', name: 'Earth Golem', cost: 3, attack: 3, health: 4, type: 'Familiar' },
      { id: '5', name: 'Healing Potion', cost: 2, attack: 0, health: 0, type: 'Spell' }
    ];
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0f14);

    // Game UI
    this.createGameUI();
    this.createPlayerHand();
    this.createBattlefield();
  }

  private createGameUI(): void {
    const { width, height } = this.cameras.main;

    // Back button
    const backButton = this.add.rectangle(60, 30, 100, 40, 0x2a2a2a);
    backButton.setStrokeStyle(2, 0x888888);
    backButton.setInteractive({ useHandCursor: true });

    const backText = this.add.text(60, 30, 'BACK', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif'
    });
    backText.setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.scene.start('GameScene', { mode: this.gameMode });
    });

    // Player health
    this.add.text(50, height - 100, `Health: ${this.playerHealth}`, {
      fontSize: '18px',
      color: '#ff6b6b',
      fontFamily: 'Arial, sans-serif'
    });

    // Player mana
    this.add.text(50, height - 70, `Mana: ${this.playerMana}/${this.maxMana}`, {
      fontSize: '18px',
      color: '#4ecdc4',
      fontFamily: 'Arial, sans-serif'
    });

    // Opponent health
    this.add.text(50, 50, `Opponent Health: ${this.opponentHealth}`, {
      fontSize: '18px',
      color: '#ff6b6b',
      fontFamily: 'Arial, sans-serif'
    });

    // Turn indicator
    this.add.text(width / 2, 30, `Turn ${this.turn} - ${this.isPlayerTurn ? 'Your Turn' : 'Opponent Turn'}`, {
      fontSize: '20px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5);

    // End turn button
    const endTurnButton = this.add.rectangle(width - 100, height - 50, 120, 40, 0x2a2a2a);
    endTurnButton.setStrokeStyle(2, 0xd4af37);
    endTurnButton.setInteractive({ useHandCursor: true });

    const endTurnText = this.add.text(width - 100, height - 50, 'END TURN', {
      fontSize: '16px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    endTurnText.setOrigin(0.5);

    endTurnButton.on('pointerdown', () => {
      this.endTurn();
    });
  }

  private createPlayerHand(): void {
    const { width, height } = this.cameras.main;
    const cardWidth = 120;
    const cardHeight = 160;
    const startX = width / 2 - (this.playerHand.length * cardWidth) / 2;

    this.playerHand.forEach((card, index) => {
      const cardX = startX + index * (cardWidth + 10);
      const cardY = height - cardHeight / 2 - 20;

      // Card background
      const cardBg = this.add.rectangle(cardX, cardY, cardWidth, cardHeight, 0x2a2a2a);
      cardBg.setStrokeStyle(2, card.cost <= this.playerMana ? 0xd4af37 : 0x666666);
      cardBg.setInteractive({ useHandCursor: true });

      // Card name
      this.add.text(cardX, cardY - 60, card.name, {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        wordWrap: { width: cardWidth - 10 }
      }).setOrigin(0.5);

      // Card cost
      this.add.circle(cardX - 45, cardY - 65, 15, 0x4ecdc4);
      this.add.text(cardX - 45, cardY - 65, card.cost.toString(), {
        fontSize: '14px',
        color: '#000000',
        fontFamily: 'Arial, sans-serif'
      }).setOrigin(0.5);

      // Card stats (if creature)
      if (card.type === 'Familiar') {
        this.add.text(cardX, cardY + 40, `${card.attack}/${card.health}`, {
          fontSize: '16px',
          color: '#ffeb3b',
          fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
      }

      // Card type
      this.add.text(cardX, cardY + 20, card.type, {
        fontSize: '10px',
        color: '#cccccc',
        fontFamily: 'Arial, sans-serif'
      }).setOrigin(0.5);

      // Card interaction
      if (card.cost <= this.playerMana) {
        cardBg.on('pointerdown', () => {
          this.playCard(card, index);
        });

        cardBg.on('pointerover', () => {
          cardBg.setFillStyle(0x3a3a3a);
        });

        cardBg.on('pointerout', () => {
          cardBg.setFillStyle(0x2a2a2a);
        });
      }
    });
  }

  private createBattlefield(): void {
    const { width, height } = this.cameras.main;
    
    // Battlefield area
    const battlefieldY = height / 2;
    this.add.rectangle(width / 2, battlefieldY, width - 100, 200, 0x1a1a1a, 0.5);
    this.add.text(width / 2, battlefieldY, 'BATTLEFIELD\n(Cards played here will battle)', {
      fontSize: '16px',
      color: '#666666',
      fontFamily: 'Arial, sans-serif',
      align: 'center'
    }).setOrigin(0.5);
  }

  private playCard(card: Card, handIndex: number): void {
    if (card.cost > this.playerMana) return;

    // Deduct mana
    this.playerMana -= card.cost;

    // Remove card from hand
    this.playerHand.splice(handIndex, 1);

    // Apply card effect
    if (card.type === 'Spell') {
      if (card.name === 'Lightning Bolt') {
        this.opponentHealth -= card.attack;
      } else if (card.name === 'Healing Potion') {
        this.playerHealth += 5;
      }
    }

    // Refresh the scene
    this.scene.restart({ mode: this.gameMode });
  }

  private endTurn(): void {
    this.isPlayerTurn = !this.isPlayerTurn;
    
    if (this.isPlayerTurn) {
      this.turn++;
      this.maxMana = Math.min(10, this.turn);
      this.playerMana = this.maxMana;
      
      // Draw a card (simplified)
      if (this.playerHand.length < 7) {
        const newCard: Card = {
          id: Date.now().toString(),
          name: 'Mystery Card',
          cost: Math.floor(Math.random() * 5) + 1,
          attack: Math.floor(Math.random() * 4) + 1,
          health: Math.floor(Math.random() * 4) + 1,
          type: 'Familiar'
        };
        this.playerHand.push(newCard);
      }
    }

    // Refresh the scene
    this.scene.restart({ mode: this.gameMode });
  }
}