/**
 * Premium Main Menu Scene - MTG Arena Quality
 * Features:
 * - Cinematic background with particles
 * - Smooth animations and transitions
 * - Mobile-responsive design
 * - Professional UI components
 * - Touch-friendly controls
 */

import Phaser from 'phaser';

export class PremiumMainMenuScene extends Phaser.Scene {
  private isMobile: boolean = false;
  private backgroundParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private logoContainer!: Phaser.GameObjects.Container;
  private menuContainer!: Phaser.GameObjects.Container;
  private backgroundMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PremiumMainMenuScene' });
  }

  preload() {
    this.detectMobile();
    this.createPremiumAssets();
    this.loadAudioAssets();
  }

  create() {
    this.createCinematicBackground();
    this.createParticleEffects();
    this.createLogo();
    this.createMainMenu();
    this.createSettingsPanel();
    this.startBackgroundMusic();
    this.animateEntrance();
  }

  private detectMobile() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   window.innerWidth < 768;
  }

  private createPremiumAssets() {
    // Premium gradient background
    const bgCanvas = this.add.graphics();
    bgCanvas.fillGradientStyle(0x0a0a0a, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    bgCanvas.fillRect(0, 0, 800, 600);
    bgCanvas.generateTexture('premium-menu-bg', 800, 600);
    bgCanvas.destroy();

    // Premium button with glow effect
    const buttonCanvas = this.add.graphics();
    
    // Outer glow
    buttonCanvas.fillStyle(0x3498db, 0.3);
    buttonCanvas.fillRoundedRect(-5, -5, this.isMobile ? 210 : 210, this.isMobile ? 70 : 70, 20);
    
    // Main button
    buttonCanvas.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 1);
    buttonCanvas.fillRoundedRect(0, 0, this.isMobile ? 200 : 200, this.isMobile ? 60 : 60, 15);
    
    // Inner highlight
    buttonCanvas.fillGradientStyle(0x3498db, 0x2980b9, 0x3498db, 0x2980b9, 0.3);
    buttonCanvas.fillRoundedRect(5, 5, this.isMobile ? 190 : 190, this.isMobile ? 20 : 20, 10);
    
    // Border
    buttonCanvas.lineStyle(2, 0x3498db, 0.8);
    buttonCanvas.strokeRoundedRect(0, 0, this.isMobile ? 200 : 200, this.isMobile ? 60 : 60, 15);
    
    buttonCanvas.generateTexture('premium-menu-button', this.isMobile ? 210 : 210, this.isMobile ? 70 : 70);
    buttonCanvas.destroy();

    // Secondary button
    const secondaryCanvas = this.add.graphics();
    secondaryCanvas.fillGradientStyle(0x95a5a6, 0x7f8c8d, 0x95a5a6, 0x7f8c8d, 1);
    secondaryCanvas.fillRoundedRect(0, 0, this.isMobile ? 180 : 180, this.isMobile ? 50 : 50, 12);
    secondaryCanvas.lineStyle(2, 0xbdc3c7, 0.8);
    secondaryCanvas.strokeRoundedRect(0, 0, this.isMobile ? 180 : 180, this.isMobile ? 50 : 50, 12);
    secondaryCanvas.generateTexture('secondary-menu-button', this.isMobile ? 180 : 180, this.isMobile ? 50 : 50);
    secondaryCanvas.destroy();

    // Logo background
    const logoCanvas = this.add.graphics();
    logoCanvas.fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.8);
    logoCanvas.fillEllipse(0, 0, this.isMobile ? 300 : 400, this.isMobile ? 100 : 120);
    logoCanvas.lineStyle(3, 0xf1c40f, 1);
    logoCanvas.strokeEllipse(0, 0, this.isMobile ? 300 : 400, this.isMobile ? 100 : 120);
    logoCanvas.generateTexture('logo-bg', this.isMobile ? 300 : 400, this.isMobile ? 100 : 120);
    logoCanvas.destroy();

    // Particle textures
    this.createParticleTextures();
  }

  private createParticleTextures() {
    // Fire particle
    const fireCanvas = this.add.graphics();
    fireCanvas.fillGradientStyle(0xff6b6b, 0xfeca57, 0xff6b6b, 0xfeca57, 1);
    fireCanvas.fillCircle(0, 0, 3);
    fireCanvas.generateTexture('fire-particle', 6, 6);
    fireCanvas.destroy();

    // Magic particle
    const magicCanvas = this.add.graphics();
    magicCanvas.fillGradientStyle(0x9b59b6, 0x3498db, 0x9b59b6, 0x3498db, 1);
    magicCanvas.fillCircle(0, 0, 2);
    magicCanvas.generateTexture('magic-particle', 4, 4);
    magicCanvas.destroy();

    // Star particle
    const starCanvas = this.add.graphics();
    starCanvas.fillStyle(0xf1c40f, 1);
    starCanvas.fillStar(0, 0, 4, 2, 4, 0);
    starCanvas.generateTexture('star-particle', 8, 8);
    starCanvas.destroy();
  }

  private loadAudioAssets() {
    // Create simple audio data URLs for background music and effects
    // In a real implementation, you would load actual audio files
    
    // Create a simple tone for button clicks
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Store audio context for later use
    this.registry.set('audioContext', audioContext);
  }

  private createCinematicBackground() {
    // Multi-layered background for depth
    const bg1 = this.add.image(400, 300, 'premium-menu-bg');
    bg1.setDisplaySize(800, 600);

    // Animated overlay layers
    const overlay1 = this.add.rectangle(400, 300, 800, 600, 0x1a1a2e, 0.3);
    const overlay2 = this.add.rectangle(400, 300, 800, 600, 0x2c3e50, 0.1);

    // Animate overlays for breathing effect
    this.tweens.add({
      targets: overlay1,
      alpha: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: overlay2,
      alpha: 0.05,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Animated geometric shapes for visual interest
    this.createBackgroundShapes();
  }

  private createBackgroundShapes() {
    // Floating geometric shapes
    for (let i = 0; i < 5; i++) {
      const shape = this.add.graphics();
      shape.lineStyle(1, 0x3498db, 0.3);
      shape.strokeRect(0, 0, 50, 50);
      shape.setPosition(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600)
      );
      shape.setRotation(Phaser.Math.Between(0, 360));

      // Animate shapes
      this.tweens.add({
        targets: shape,
        x: shape.x + Phaser.Math.Between(-100, 100),
        y: shape.y + Phaser.Math.Between(-100, 100),
        rotation: shape.rotation + Math.PI * 2,
        duration: Phaser.Math.Between(10000, 20000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }

    // Floating circles
    for (let i = 0; i < 8; i++) {
      const circle = this.add.graphics();
      circle.lineStyle(1, 0x9b59b6, 0.2);
      circle.strokeCircle(0, 0, Phaser.Math.Between(20, 60));
      circle.setPosition(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600)
      );

      this.tweens.add({
        targets: circle,
        scaleX: circle.scaleX + 0.5,
        scaleY: circle.scaleY + 0.5,
        alpha: 0,
        duration: Phaser.Math.Between(5000, 10000),
        repeat: -1,
        ease: 'Power2'
      });
    }
  }

  private createParticleEffects() {
    // Ambient magical particles
    this.backgroundParticles = this.add.particles(400, 300, 'magic-particle', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 4000,
      frequency: 300,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, 800, 600) 
      }
    });
    this.backgroundParticles.setDepth(-1);

    // Floating stars
    const starParticles = this.add.particles(400, 50, 'star-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 6000,
      frequency: 500,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, 800, 100) 
      },
      gravityY: 20
    });
    starParticles.setDepth(-1);
  }

  private createLogo() {
    this.logoContainer = this.add.container(400, this.isMobile ? 120 : 150);
    
    // Logo background with glow
    const logoBg = this.add.image(0, 0, 'logo-bg');
    logoBg.setAlpha(0.8);
    
    // Main title with premium styling
    const title = this.add.text(0, 0, 'KONIVRER', {
      fontSize: this.isMobile ? '48px' : '64px',
      fontFamily: 'Arial Black',
      color: '#2c3e50',
      stroke: '#f1c40f',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(0, this.isMobile ? 35 : 45, 'Mystical Trading Card Game', {
      fontSize: this.isMobile ? '16px' : '20px',
      fontFamily: 'Arial',
      color: '#ecf0f1',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.logoContainer.add([logoBg, title, subtitle]);
    
    // Logo animation
    this.tweens.add({
      targets: this.logoContainer,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Glow effect animation
    this.tweens.add({
      targets: logoBg,
      alpha: 0.6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createMainMenu() {
    this.menuContainer = this.add.container(400, this.isMobile ? 350 : 380);
    
    const menuItems = [
      { text: 'PREMIUM BATTLE', scene: 'PremiumCardBattleScene', primary: true },
      { text: 'DECK BUILDER', scene: this.isMobile ? 'MobileDeckBuilderScene' : 'DeckBuilderScene', primary: true },
      { text: 'PRACTICE MODE', scene: 'CardBattleScene', primary: false },
      { text: 'SETTINGS', action: 'settings', primary: false }
    ];

    menuItems.forEach((item, index) => {
      const y = (index - 1.5) * (this.isMobile ? 70 : 80);
      
      const button = this.add.image(0, y, item.primary ? 'premium-menu-button' : 'secondary-menu-button');
      button.setInteractive({ cursor: 'pointer' });
      
      const text = this.add.text(0, y, item.text, {
        fontSize: this.isMobile ? '16px' : '18px',
        fontFamily: 'Arial Black',
        color: item.primary ? '#ecf0f1' : '#bdc3c7'
      }).setOrigin(0.5);

      // Button interactions
      this.setupButtonInteractions(button, text, item);
      
      this.menuContainer.add([button, text]);
    });

    // Close button
    const closeButton = this.add.image(750, 50, 'secondary-menu-button');
    closeButton.setDisplaySize(this.isMobile ? 80 : 100, this.isMobile ? 40 : 50);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(750, 50, 'CLOSE', {
      fontSize: this.isMobile ? '14px' : '16px',
      fontFamily: 'Arial Black',
      color: '#e74c3c'
    }).setOrigin(0.5);

    this.setupButtonInteractions(closeButton, closeText, { action: 'close' });
    
    this.add.existing(closeButton);
    this.add.existing(closeText);
  }

  private setupButtonInteractions(button: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text, item: any) {
    // Hover effects
    button.on('pointerover', () => {
      this.createHoverEffect(button, text);
      this.playHoverSound();
    });

    button.on('pointerout', () => {
      this.removeHoverEffect(button, text);
    });

    // Click effects
    button.on('pointerdown', () => {
      this.createClickEffect(button);
      this.playClickSound();
      
      if (item.scene) {
        this.transitionToScene(item.scene);
      } else if (item.action === 'settings') {
        this.showSettings();
      } else if (item.action === 'close') {
        this.closeGame();
      }
    });

    // Mobile touch feedback
    if (this.isMobile) {
      button.on('pointerdown', () => {
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      });
    }
  }

  private createHoverEffect(button: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text) {
    // Scale animation
    this.tweens.add({
      targets: [button, text],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 200,
      ease: 'Back.easeOut'
    });

    // Glow effect
    button.setTint(0xaaaaff);
    
    // Particle burst
    const particles = this.add.particles(button.x + 400, button.y + (this.isMobile ? 350 : 380), 'fire-particle', {
      speed: { min: 30, max: 60 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 500,
      quantity: 5
    });

    this.time.delayedCall(1000, () => particles.destroy());
  }

  private removeHoverEffect(button: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text) {
    this.tweens.add({
      targets: [button, text],
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    button.clearTint();
  }

  private createClickEffect(button: Phaser.GameObjects.Image) {
    // Press animation
    this.tweens.add({
      targets: button,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });

    // Screen flash
    const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0.1);
    flash.setDepth(100);
    
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });

    // Ripple effect
    const ripple = this.add.graphics();
    ripple.lineStyle(3, 0x3498db, 1);
    ripple.strokeCircle(button.x + 400, button.y + (this.isMobile ? 350 : 380), 10);
    ripple.setDepth(50);

    this.tweens.add({
      targets: ripple,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => ripple.destroy()
    });
  }

  private transitionToScene(sceneName: string) {
    // Fade out effect
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    // Stop background music
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
    
    this.time.delayedCall(500, () => {
      this.scene.start(sceneName);
    });
  }

  private createSettingsPanel() {
    // Settings panel (hidden by default)
    const settingsPanel = this.add.container(400, 300);
    settingsPanel.setVisible(false);
    settingsPanel.setDepth(200);
    settingsPanel.setName('settingsPanel');

    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x2c3e50, 0.95);
    panelBg.fillRoundedRect(-200, -150, 400, 300, 20);
    panelBg.lineStyle(3, 0x3498db, 1);
    panelBg.strokeRoundedRect(-200, -150, 400, 300, 20);

    const title = this.add.text(0, -100, 'SETTINGS', {
      fontSize: this.isMobile ? '20px' : '24px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    // Volume controls
    const volumeText = this.add.text(0, -50, 'Master Volume', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Graphics quality toggle
    const qualityText = this.add.text(0, 0, 'Graphics Quality: HIGH', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Close settings button
    const closeSettings = this.add.image(0, 80, 'secondary-menu-button');
    closeSettings.setDisplaySize(150, 40);
    closeSettings.setInteractive({ cursor: 'pointer' });
    
    const closeSettingsText = this.add.text(0, 80, 'CLOSE', {
      fontSize: this.isMobile ? '14px' : '16px',
      fontFamily: 'Arial Black',
      color: '#e74c3c'
    }).setOrigin(0.5);

    closeSettings.on('pointerdown', () => {
      this.hideSettings();
    });

    settingsPanel.add([panelBg, title, volumeText, qualityText, closeSettings, closeSettingsText]);
    this.add.existing(settingsPanel);
  }

  private showSettings() {
    const settingsPanel = this.children.getByName('settingsPanel') as Phaser.GameObjects.Container;
    settingsPanel.setVisible(true);
    settingsPanel.setScale(0);
    
    this.tweens.add({
      targets: settingsPanel,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  private hideSettings() {
    const settingsPanel = this.children.getByName('settingsPanel') as Phaser.GameObjects.Container;
    
    this.tweens.add({
      targets: settingsPanel,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        settingsPanel.setVisible(false);
      }
    });
  }

  private startBackgroundMusic() {
    // In a real implementation, you would load and play actual music files
    // For now, we'll create a simple ambient tone
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (error) {
      console.log('Audio context not available');
    }
  }

  private playHoverSound() {
    // Simple hover sound effect
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      // Silently fail if audio is not available
    }
  }

  private playClickSound() {
    // Simple click sound effect
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      // Silently fail if audio is not available
    }
  }

  private animateEntrance() {
    // Fade in from black
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    
    // Animate logo entrance
    this.logoContainer.setY(this.logoContainer.y - 100);
    this.logoContainer.setAlpha(0);
    
    this.tweens.add({
      targets: this.logoContainer,
      y: this.isMobile ? 120 : 150,
      alpha: 1,
      duration: 1000,
      ease: 'Back.easeOut',
      delay: 500
    });

    // Animate menu entrance
    this.menuContainer.setY(this.menuContainer.y + 100);
    this.menuContainer.setAlpha(0);
    
    this.tweens.add({
      targets: this.menuContainer,
      y: this.isMobile ? 350 : 380,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut',
      delay: 1000
    });
  }

  private closeGame() {
    // Fade out effect
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.time.delayedCall(500, () => {
      if (window.setShowGame) {
        window.setShowGame(false);
      }
    });
  }
}

// Extend window interface
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
  }
}