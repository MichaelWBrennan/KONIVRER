import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private gameMode: string = 'practice';

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { mode: string }): void {
    this.gameMode = data.mode || 'practice';
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f1419);

    // Game mode indicator
    const modeText = this.add.text(20, 20, `Mode: ${this.gameMode.toUpperCase()}`, {
      fontSize: '18px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });

    // Back button
    const backButton = this.add.rectangle(width - 100, 40, 80, 40, 0x2a2a2a);
    backButton.setStrokeStyle(2, 0x888888);
    backButton.setInteractive({ useHandCursor: true });

    const backText = this.add.text(width - 100, 40, 'BACK', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif'
    });
    backText.setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });

    // Start Battle button
    const battleButton = this.add.rectangle(width / 2, height / 2, 250, 80, 0x2a2a2a);
    battleButton.setStrokeStyle(3, 0xd4af37);
    battleButton.setInteractive({ useHandCursor: true });

    const battleText = this.add.text(width / 2, height / 2, 'START BATTLE', {
      fontSize: '24px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    battleText.setOrigin(0.5);

    battleButton.on('pointerdown', () => {
      this.scene.start('CardBattleScene', { mode: this.gameMode });
    });

    // Hover effect
    battleButton.on('pointerover', () => {
      battleButton.setFillStyle(0x3a3a3a);
    });
    battleButton.on('pointerout', () => {
      battleButton.setFillStyle(0x2a2a2a);
    });

    // Game instructions
    const instructions = this.add.text(width / 2, height / 2 + 120, 
      'Choose your deck and prepare for battle!\nUse strategy and mystical powers to defeat your opponent.', {
      fontSize: '16px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif',
      align: 'center'
    });
    instructions.setOrigin(0.5);
  }
}