
import Phaser from 'phaser';

export class UnifiedMainMenuScene extends Phaser.Scene {
  constructor(private isPremium: boolean = false) {
    super({ key: 'UnifiedMainMenuScene' });
  }

  preload() {
    this.loadCommonAssets();
    if (this.isPremium) {
      this.loadPremiumAssets();
    }
  }

  create() {
    this.setupBackground();
    this.displayTitle();
    this.setupMenu();
    if (this.isPremium) {
      this.addPremiumFeatures();
    }
  }

  private loadCommonAssets() {
    // Load assets common to both regular and premium menu
    this.load.image('menu-bg', '/assets/menu-bg.png');
    this.load.image('menu-button', '/assets/menu-button.png');
  }

  private loadPremiumAssets() {
    // Load assets exclusive to premium menu
    this.load.image('premium-bg', '/assets/premium-bg.png');
    this.load.image('premium-button', '/assets/premium-button.png');
    this.load.audio('premium-music', '/assets/premium-music.mp3');
  }

  private setupBackground() {
    const bgKey = this.isPremium ? 'premium-bg' : 'menu-bg';
    this.add.image(400, 300, bgKey).setDisplaySize(800, 600);
  }

  private displayTitle() {
    const titleStyle = {
      fontSize: this.isPremium ? '64px' : '48px',
      color: this.isPremium ? '#d4af37' : '#fff',
    };
    this.add.text(400, 100, 'KONIVRER', titleStyle).setOrigin(0.5);
  }

  private setupMenu() {
    const buttonKey = this.isPremium ? 'premium-button' : 'menu-button';
    const playButton = this.add.image(400, 400, buttonKey).setInteractive();
    playButton.on('pointerdown', this.startGame, this);
  }

  private addPremiumFeatures() {
    const premiumSound = this.sound.add('premium-music');
    premiumSound.play();
  }

  private startGame() {
    this.scene.start(this.isPremium ? 'PremiumCardBattleScene' : 'CardBattleScene');
  }
}
