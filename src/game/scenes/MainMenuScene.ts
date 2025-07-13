import Phaser from 'phaser';

// Extend window interface for game integration
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
  }
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  preload(): void {
    // Create simple colored rectangles as placeholders for card graphics
    this.load.image('card-back', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // Title
    const title = this.add.text(width / 2, height / 4, 'KONIVRER', {
      fontSize: '64px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 4 + 80, 'Mystical Trading Card Game', {
      fontSize: '24px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif'
    });
    subtitle.setOrigin(0.5);

    // Enhanced Battle Button
    const battleButton = this.add.rectangle(width / 2, height / 2 - 40, 200, 60, 0x2a2a2a);
    battleButton.setStrokeStyle(2, 0xd4af37);
    battleButton.setInteractive({ useHandCursor: true });

    const battleText = this.add.text(width / 2, height / 2 - 40, 'BATTLE', {
      fontSize: '24px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    battleText.setOrigin(0.5);

    // Deck Builder Button
    const deckBuilderButton = this.add.rectangle(width / 2, height / 2 + 40, 200, 60, 0x2a2a2a);
    deckBuilderButton.setStrokeStyle(2, 0x4ecdc4);
    deckBuilderButton.setInteractive({ useHandCursor: true });

    const deckBuilderText = this.add.text(width / 2, height / 2 + 40, 'DECK BUILDER', {
      fontSize: '20px',
      color: '#4ecdc4',
      fontFamily: 'Arial, sans-serif'
    });
    deckBuilderText.setOrigin(0.5);

    // Practice Button
    const practiceButton = this.add.rectangle(width / 2, height / 2 + 120, 200, 60, 0x2a2a2a);
    practiceButton.setStrokeStyle(2, 0x888888);
    practiceButton.setInteractive({ useHandCursor: true });

    const practiceText = this.add.text(width / 2, height / 2 + 120, 'PRACTICE', {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif'
    });
    practiceText.setOrigin(0.5);

    // Button interactions
    battleButton.on('pointerdown', () => {
      this.scene.start('EnhancedCardBattleScene');
    });

    deckBuilderButton.on('pointerdown', () => {
      this.scene.start('DeckBuilderScene');
    });

    practiceButton.on('pointerdown', () => {
      this.scene.start('CardBattleScene');
    });

    // Close Game Button
    const closeButton = this.add.rectangle(width - 50, 50, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(width - 50, 50, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    closeButton.on('pointerdown', () => {
      if (window.setShowGame) {
        window.setShowGame(false);
      }
    });

    // Hover effects
    battleButton.on('pointerover', () => {
      battleButton.setFillStyle(0x3a3a3a);
    });
    battleButton.on('pointerout', () => {
      battleButton.setFillStyle(0x2a2a2a);
    });

    deckBuilderButton.on('pointerover', () => {
      deckBuilderButton.setFillStyle(0x3a3a3a);
    });
    deckBuilderButton.on('pointerout', () => {
      deckBuilderButton.setFillStyle(0x2a2a2a);
    });

    practiceButton.on('pointerover', () => {
      practiceButton.setFillStyle(0x3a3a3a);
    });
    practiceButton.on('pointerout', () => {
      practiceButton.setFillStyle(0x2a2a2a);
    });
  }
}