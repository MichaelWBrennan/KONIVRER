import Phaser from 'phaser';

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

    // Play Button
    const playButton = this.add.rectangle(width / 2, height / 2, 200, 60, 0x2a2a2a);
    playButton.setStrokeStyle(2, 0xd4af37);
    playButton.setInteractive({ useHandCursor: true });

    const playText = this.add.text(width / 2, height / 2, 'PLAY', {
      fontSize: '24px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    playText.setOrigin(0.5);

    // Practice Button
    const practiceButton = this.add.rectangle(width / 2, height / 2 + 80, 200, 60, 0x2a2a2a);
    practiceButton.setStrokeStyle(2, 0x888888);
    practiceButton.setInteractive({ useHandCursor: true });

    const practiceText = this.add.text(width / 2, height / 2 + 80, 'PRACTICE', {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif'
    });
    practiceText.setOrigin(0.5);

    // Button interactions
    playButton.on('pointerdown', () => {
      this.scene.start('GameScene', { mode: 'multiplayer' });
    });

    practiceButton.on('pointerdown', () => {
      this.scene.start('GameScene', { mode: 'practice' });
    });

    // Hover effects
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x3a3a3a);
    });
    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x2a2a2a);
    });

    practiceButton.on('pointerover', () => {
      practiceButton.setFillStyle(0x3a3a3a);
    });
    practiceButton.on('pointerout', () => {
      practiceButton.setFillStyle(0x2a2a2a);
    });
  }
}