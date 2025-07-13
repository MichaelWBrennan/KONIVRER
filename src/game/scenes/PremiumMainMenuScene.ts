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
    // Set current scene in window object
    window.KONIVRER_CURRENT_SCENE = 'PremiumMainMenuScene';
    
    this.createCinematicBackground();
    this.createParticleEffects();
    this.createLogo();
    this.createMainMenu();
    this.createSettingsPanel();
    this.createPlayMenu();
    this.startBackgroundMusic();
    this.animateEntrance();
    
    // Show the play menu by default when the game loads
    this.time.delayedCall(500, () => {
      this.showPlayMenu();
    });
  }

  private detectMobile() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   window.innerWidth < 768;
  }

  private createPremiumAssets() {
    // MTG Arena-style dark blue gradient background
    const bgCanvas = this.add.graphics();
    bgCanvas.fillGradientStyle(0x061428, 0x0a2446, 0x0c2d5c, 0x0a1f3d, 1);
    bgCanvas.fillRect(0, 0, 800, 600);
    bgCanvas.generateTexture('premium-menu-bg', 800, 600);
    bgCanvas.destroy();

    // MTG Arena-style premium button with gold accents
    const buttonCanvas = this.add.graphics();
    
    // Outer glow (golden like MTG Arena)
    buttonCanvas.fillStyle(0xd4af37, 0.3);
    buttonCanvas.fillRoundedRect(-5, -5, this.isMobile ? 210 : 210, this.isMobile ? 70 : 70, 8);
    
    // Main button - dark with subtle gradient
    buttonCanvas.fillGradientStyle(0x1a1a1a, 0x2a2a2a, 0x1a1a1a, 0x2a2a2a, 1);
    buttonCanvas.fillRoundedRect(0, 0, this.isMobile ? 200 : 200, this.isMobile ? 60 : 60, 6);
    
    // Inner highlight - subtle gold top highlight
    buttonCanvas.fillGradientStyle(0xd4af37, 0xaa8c2c, 0xd4af37, 0xaa8c2c, 0.2);
    buttonCanvas.fillRoundedRect(5, 5, this.isMobile ? 190 : 190, this.isMobile ? 15 : 15, 4);
    
    // Gold border like MTG Arena
    buttonCanvas.lineStyle(1, 0xd4af37, 0.9);
    buttonCanvas.strokeRoundedRect(0, 0, this.isMobile ? 200 : 200, this.isMobile ? 60 : 60, 6);
    
    buttonCanvas.generateTexture('premium-menu-button', this.isMobile ? 210 : 210, this.isMobile ? 70 : 70);
    buttonCanvas.destroy();

    // Secondary button - more subdued style like MTG Arena's secondary options
    const secondaryCanvas = this.add.graphics();
    secondaryCanvas.fillGradientStyle(0x1a1a1a, 0x2a2a2a, 0x1a1a1a, 0x2a2a2a, 1);
    secondaryCanvas.fillRoundedRect(0, 0, this.isMobile ? 180 : 180, this.isMobile ? 50 : 50, 6);
    secondaryCanvas.lineStyle(1, 0x888888, 0.7);
    secondaryCanvas.strokeRoundedRect(0, 0, this.isMobile ? 180 : 180, this.isMobile ? 50 : 50, 6);
    secondaryCanvas.generateTexture('secondary-menu-button', this.isMobile ? 180 : 180, this.isMobile ? 50 : 50);
    secondaryCanvas.destroy();

    // Logo background - MTG Arena style with magical glow
    const logoCanvas = this.add.graphics();
    
    // Outer glow
    logoCanvas.fillStyle(0xd4af37, 0.2);
    logoCanvas.fillEllipse(0, 0, this.isMobile ? 320 : 420, this.isMobile ? 120 : 140);
    
    // Inner background
    logoCanvas.fillGradientStyle(0x1a1a1a, 0x2a2a2a, 0x1a1a1a, 0x2a2a2a, 0.9);
    logoCanvas.fillEllipse(0, 0, this.isMobile ? 300 : 400, this.isMobile ? 100 : 120);
    
    // Gold border like MTG Arena logo frames
    logoCanvas.lineStyle(2, 0xd4af37, 0.9);
    logoCanvas.strokeEllipse(0, 0, this.isMobile ? 300 : 400, this.isMobile ? 100 : 120);
    
    // Inner accent line
    logoCanvas.lineStyle(1, 0xd4af37, 0.5);
    logoCanvas.strokeEllipse(0, 0, this.isMobile ? 290 : 390, this.isMobile ? 90 : 110);
    
    logoCanvas.generateTexture('logo-bg', this.isMobile ? 320 : 420, this.isMobile ? 120 : 140);
    logoCanvas.destroy();

    // Particle textures
    this.createParticleTextures();
  }

  private createParticleTextures() {
    // MTG Arena-style mana particle (gold/orange like mana symbols)
    const fireCanvas = this.add.graphics();
    fireCanvas.fillGradientStyle(0xd4af37, 0xe6c149, 0xd4af37, 0xe6c149, 1);
    fireCanvas.fillCircle(0, 0, 3);
    fireCanvas.lineStyle(1, 0xffd700, 0.8);
    fireCanvas.strokeCircle(0, 0, 3);
    fireCanvas.generateTexture('fire-particle', 8, 8);
    fireCanvas.destroy();

    // MTG Arena-style blue mana particle
    const magicCanvas = this.add.graphics();
    magicCanvas.fillGradientStyle(0x3498db, 0x2980b9, 0x3498db, 0x2980b9, 1);
    magicCanvas.fillCircle(0, 0, 2);
    magicCanvas.lineStyle(1, 0x67c7f5, 0.6);
    magicCanvas.strokeCircle(0, 0, 2);
    magicCanvas.generateTexture('magic-particle', 6, 6);
    magicCanvas.destroy();

    // MTG Arena-style star/spark particle (like card opening effects)
    const starCanvas = this.add.graphics();
    starCanvas.fillStyle(0xffd700, 1);
    starCanvas.fillStar(0, 0, 5, 2, 5, 0);
    starCanvas.lineStyle(1, 0xffffff, 0.8);
    starCanvas.strokeStar(0, 0, 5, 2, 5, 0);
    starCanvas.generateTexture('star-particle', 10, 10);
    starCanvas.destroy();
    
    // MTG Arena-style rune particle (for arcane effects)
    const runeCanvas = this.add.graphics();
    runeCanvas.lineStyle(1, 0xd4af37, 0.9);
    
    // Draw a simple rune-like shape
    runeCanvas.beginPath();
    runeCanvas.moveTo(-3, -3);
    runeCanvas.lineTo(3, -3);
    runeCanvas.lineTo(3, 3);
    runeCanvas.lineTo(-3, 3);
    runeCanvas.lineTo(-3, -3);
    runeCanvas.moveTo(-3, 0);
    runeCanvas.lineTo(3, 0);
    runeCanvas.moveTo(0, -3);
    runeCanvas.lineTo(0, 3);
    runeCanvas.strokePath();
    
    runeCanvas.generateTexture('rune-particle', 8, 8);
    runeCanvas.destroy();
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
    // Multi-layered background for depth - MTG Arena style
    const bg1 = this.add.image(400, 300, 'premium-menu-bg');
    bg1.setDisplaySize(800, 600);

    // Add MTG Arena-style magical rune circles in background
    for (let i = 0; i < 3; i++) {
      const size = Phaser.Math.Between(200, 400);
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);
      
      // Create outer circle
      const outerCircle = this.add.graphics();
      outerCircle.lineStyle(1, 0xd4af37, 0.15);
      outerCircle.strokeCircle(0, 0, size/2);
      
      // Create inner circle
      outerCircle.lineStyle(1, 0xd4af37, 0.1);
      outerCircle.strokeCircle(0, 0, size/2 * 0.8);
      
      // Create inner circle
      outerCircle.lineStyle(1, 0xd4af37, 0.05);
      outerCircle.strokeCircle(0, 0, size/2 * 0.6);
      
      // Add some rune-like markings
      const runeCount = Phaser.Math.Between(4, 8);
      for (let j = 0; j < runeCount; j++) {
        const angle = (j / runeCount) * Math.PI * 2;
        const runeX = Math.cos(angle) * (size/2 * 0.9);
        const runeY = Math.sin(angle) * (size/2 * 0.9);
        
        outerCircle.lineStyle(1, 0xd4af37, 0.2);
        outerCircle.fillStyle(0xd4af37, 0.05);
        outerCircle.fillCircle(runeX, runeY, 5);
        outerCircle.strokeCircle(runeX, runeY, 5);
      }
      
      outerCircle.setPosition(x, y);
      
      // Rotate the rune circle slowly - like MTG Arena's background elements
      this.tweens.add({
        targets: outerCircle,
        angle: 360,
        duration: Phaser.Math.Between(80000, 120000),
        repeat: -1,
        ease: 'Linear'
      });
    }

    // Add MTG Arena-style light rays from top
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 3; i++) {
      const ray = this.add.rectangle(
        Phaser.Math.Between(width * 0.3, width * 0.7),
        -50,
        30,
        height * 1.5,
        0xd4af37,
        0.03
      );
      ray.setOrigin(0.5, 0);
      ray.setAngle(Phaser.Math.Between(-10, 10));
      
      this.tweens.add({
        targets: ray,
        alpha: { from: 0.01, to: 0.05 },
        duration: Phaser.Math.Between(5000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Animated overlay layers - subtle blue/gold gradients like MTG Arena
    const overlay1 = this.add.rectangle(400, 300, 800, 600, 0x0c2d5c, 0.2);
    const overlay2 = this.add.rectangle(400, 300, 800, 600, 0x0a1f3d, 0.1);

    // Animate overlays for breathing effect - like MTG Arena's subtle animations
    this.tweens.add({
      targets: overlay1,
      alpha: 0.1,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: overlay2,
      alpha: 0.05,
      duration: 7000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Add MTG Arena-style floating particles
    this.createBackgroundShapes();
  }

  private createBackgroundShapes() {
    const { width, height } = this.cameras.main;
    
    // MTG Arena-style floating mana symbols
    for (let i = 0; i < 5; i++) {
      // Create a mana symbol-like shape
      const shape = this.add.graphics();
      
      // Gold outline like MTG Arena mana symbols
      shape.lineStyle(1, 0xd4af37, 0.3);
      
      // Draw a pentagon (like a mana symbol)
      const size = Phaser.Math.Between(20, 40);
      const points = [];
      
      for (let j = 0; j < 5; j++) {
        const angle = (j / 5) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        points.push({ x, y });
      }
      
      shape.beginPath();
      shape.moveTo(points[0].x, points[0].y);
      
      for (let j = 1; j < points.length; j++) {
        shape.lineTo(points[j].x, points[j].y);
      }
      
      shape.closePath();
      shape.strokePath();
      
      // Add a subtle fill
      shape.fillStyle(0xd4af37, 0.05);
      shape.fillPoints(points, true);
      
      shape.setPosition(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100)
      );
      shape.setRotation(Phaser.Math.Between(0, 360));

      // Animate shapes with MTG Arena-style floating motion
      this.tweens.add({
        targets: shape,
        x: shape.x + Phaser.Math.Between(-80, 80),
        y: shape.y + Phaser.Math.Between(-80, 80),
        rotation: shape.rotation + Math.PI * 2,
        duration: Phaser.Math.Between(15000, 25000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }

    // MTG Arena-style floating arcane circles
    for (let i = 0; i < 6; i++) {
      const circle = this.add.graphics();
      
      // Gold outline like MTG Arena magical elements
      circle.lineStyle(1, 0xd4af37, 0.15);
      const radius = Phaser.Math.Between(15, 35);
      circle.strokeCircle(0, 0, radius);
      
      // Add inner circle
      circle.lineStyle(1, 0xd4af37, 0.1);
      circle.strokeCircle(0, 0, radius * 0.7);
      
      // Add center dot
      circle.fillStyle(0xd4af37, 0.2);
      circle.fillCircle(0, 0, 2);
      
      circle.setPosition(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100)
      );

      // MTG Arena-style pulsing and fading
      this.tweens.add({
        targets: circle,
        scaleX: circle.scaleX * 1.5,
        scaleY: circle.scaleY * 1.5,
        alpha: 0,
        duration: Phaser.Math.Between(8000, 15000),
        repeat: -1,
        ease: 'Sine.easeOut'
      });
    }
    
    // MTG Arena-style floating particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        i % 3 === 0 ? 'fire-particle' : (i % 3 === 1 ? 'magic-particle' : 'rune-particle')
      );
      
      particle.setAlpha(0.3);
      particle.setScale(0.5);
      
      // MTG Arena-style floating motion
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-100, 100),
        y: particle.y + Phaser.Math.Between(-100, 100),
        alpha: { from: 0.3, to: 0 },
        duration: Phaser.Math.Between(5000, 10000),
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  private createParticleEffects() {
    const { width, height } = this.cameras.main;
    
    // MTG Arena-style ambient blue mana particles
    this.backgroundParticles = this.add.particles(400, 300, 'magic-particle', {
      speed: { min: 15, max: 30 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 6000,
      frequency: 400,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, width, height) 
      }
    });
    this.backgroundParticles.setDepth(-1);

    // MTG Arena-style gold mana particles (fewer, more special)
    const goldParticles = this.add.particles(400, 300, 'fire-particle', {
      speed: { min: 10, max: 25 },
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 8000,
      frequency: 1000,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, width, height) 
      }
    });
    goldParticles.setDepth(-1);

    // MTG Arena-style floating stars from top (like card pack opening)
    const starParticles = this.add.particles(400, 50, 'star-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 6000,
      frequency: 800,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, width, 100) 
      },
      gravityY: 15
    });
    starParticles.setDepth(-1);
    
    // MTG Arena-style rune particles (arcane symbols)
    const runeParticles = this.add.particles(400, 300, 'rune-particle', {
      speed: { min: 5, max: 15 },
      scale: { start: 0.8, end: 0.2 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 10000,
      frequency: 2000,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Rectangle(0, 0, width, height) 
      },
      rotate: { min: 0, max: 360 }
    });
    runeParticles.setDepth(-1);
  }

  private createLogo() {
    this.logoContainer = this.add.container(400, this.isMobile ? 120 : 150);
    
    // Logo background with MTG Arena-style glow
    const logoBg = this.add.image(0, 0, 'logo-bg');
    logoBg.setAlpha(0.9);
    
    // Shadow for depth - MTG Arena style
    const titleShadow = this.add.text(4, 4, 'KONIVRER', {
      fontSize: this.isMobile ? '48px' : '64px',
      fontFamily: 'Arial Black',
      color: '#000000',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    titleShadow.setAlpha(0.4);
    
    // Main title with MTG Arena gold styling
    const title = this.add.text(0, 0, 'KONIVRER', {
      fontSize: this.isMobile ? '48px' : '64px',
      fontFamily: 'Arial Black',
      color: '#d4af37', // MTG Arena gold
      stroke: '#aa8c2c', // Darker gold for stroke
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 3,
        fill: true
      }
    }).setOrigin(0.5);

    // Subtitle with MTG Arena styling
    const subtitle = this.add.text(0, this.isMobile ? 35 : 45, 'ARCANE DUELS', {
      fontSize: this.isMobile ? '16px' : '20px',
      fontFamily: 'Arial',
      color: '#ffffff', // White like MTG Arena
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Add MTG Arena-style particle emitter around the logo
    const logoEmitter = this.add.particles(0, 0, 'fire-particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 2000,
      frequency: 200,
      quantity: 1,
      emitZone: { 
        type: 'edge', 
        source: new Phaser.Geom.Ellipse(0, 0, logoBg.width * 0.8, logoBg.height * 0.8),
        quantity: 16
      }
    });

    this.logoContainer.add([logoBg, titleShadow, title, subtitle, logoEmitter]);
    
    // MTG Arena-style subtle floating animation
    this.tweens.add({
      targets: this.logoContainer,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // MTG Arena-style glow pulsing
    this.tweens.add({
      targets: logoBg,
      alpha: { from: 0.9, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // MTG Arena-style text shimmer
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.9 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createMainMenu() {
    this.menuContainer = this.add.container(400, this.isMobile ? 350 : 380);
    
    // Organize all game modes under a single "PLAY" section
    const menuItems = [
      { text: 'PLAY', action: 'showPlayMenu', primary: true, isMainButton: true },
      { text: 'DECK BUILDER', scene: 'DeckBuilderScene', primary: true },
      { text: 'TUTORIAL', scene: 'CardBattleScene', primary: false },
      { text: 'SETTINGS', action: 'settings', primary: false }
    ];

    // Create a grid layout for main menu items
    const columns = 2;
    const buttonWidth = 200;
    const buttonHeight = this.isMobile ? 60 : 70;
    const horizontalSpacing = 20;
    const verticalSpacing = this.isMobile ? 15 : 20;
    
    menuItems.forEach((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      
      const x = (column - 0.5) * (buttonWidth + horizontalSpacing);
      const y = row * (buttonHeight + verticalSpacing);
      
      // Make the PLAY button larger and more prominent (MTG Arena style)
      const isPlayButton = item.isMainButton;
      const thisButtonWidth = isPlayButton ? buttonWidth * 1.2 : buttonWidth;
      const thisButtonHeight = isPlayButton ? buttonHeight * 1.2 : buttonHeight;
      
      const button = this.add.image(x, y, item.primary ? 'premium-menu-button' : 'secondary-menu-button');
      button.setDisplaySize(thisButtonWidth, thisButtonHeight);
      button.setInteractive({ cursor: 'pointer' });
      
      // Add gold glow to the PLAY button
      if (isPlayButton) {
        const glow = this.add.graphics();
        glow.fillStyle(0xd4af37, 0.2);
        glow.fillCircle(x, y, thisButtonWidth * 0.7);
        this.menuContainer.add(glow);
        
        // Pulsing animation for the glow
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.2, to: 0.4 },
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
      
      const text = this.add.text(x, y, item.text, {
        fontSize: isPlayButton ? (this.isMobile ? '18px' : '22px') : (this.isMobile ? '14px' : '16px'),
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
    
    // Accessibility button
    const accessibilityButton = this.add.image(650, 50, 'secondary-menu-button');
    accessibilityButton.setDisplaySize(this.isMobile ? 120 : 140, this.isMobile ? 40 : 50);
    accessibilityButton.setInteractive({ cursor: 'pointer' });
    
    const accessibilityText = this.add.text(650, 50, '♿ ACCESSIBILITY', {
      fontSize: this.isMobile ? '12px' : '14px',
      fontFamily: 'Arial Black',
      color: '#3498db'
    }).setOrigin(0.5);

    this.setupButtonInteractions(accessibilityButton, accessibilityText, { action: 'accessibility' });
    
    this.add.existing(closeButton);
    this.add.existing(closeText);
    this.add.existing(accessibilityButton);
    this.add.existing(accessibilityText);
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
      } else if (item.action === 'showPlayMenu') {
        this.showPlayMenu();
      } else if (item.action === 'hidePlayMenu') {
        this.hidePlayMenu();
      } else if (item.action === 'accessibility') {
        // Show accessibility options dialog
        alert('Accessibility options coming soon!');
        
        // Signal to the GameContainer that the accessibility button was clicked
        if (window.KONIVRER_ACCESSIBILITY_CLICKED) {
          window.KONIVRER_ACCESSIBILITY_CLICKED();
        }
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
    // MTG Arena-style scale animation (subtle)
    this.tweens.add({
      targets: [button, text],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 150,
      ease: 'Sine.easeOut'
    });

    // MTG Arena-style gold glow effect
    button.setTint(0xd4af37);
    
    // Brighten text like MTG Arena
    text.setColor('#ffffff');
    
    // MTG Arena-style edge particle effect
    const particles = this.add.particles(button.x, button.y, 'fire-particle', {
      speed: { min: 20, max: 40 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 600,
      frequency: 50,
      quantity: 1,
      emitZone: { 
        type: 'edge', 
        source: new Phaser.Geom.Rectangle(-button.width/2, -button.height/2, button.width, button.height),
        quantity: 8
      }
    });
    
    // Store particles for cleanup
    button.setData('hoverParticles', particles);
  }

  private removeHoverEffect(button: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text) {
    // MTG Arena-style smooth scale back
    this.tweens.add({
      targets: [button, text],
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: 'Sine.easeOut'
    });

    // Remove gold tint
    button.clearTint();
    
    // Restore original text color
    if (button.texture.key === 'premium-menu-button') {
      text.setColor('#ecf0f1');
    } else {
      text.setColor('#bdc3c7');
    }
    
    // Destroy hover particles
    const particles = button.getData('hoverParticles');
    if (particles) {
      particles.destroy();
    }
  }

  private createClickEffect(button: Phaser.GameObjects.Image) {
    // MTG Arena-style press animation (quick and subtle)
    this.tweens.add({
      targets: button,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 80,
      yoyo: true,
      ease: 'Sine.easeOut'
    });

    // MTG Arena-style gold flash (subtle)
    const flash = this.add.rectangle(400, 300, 800, 600, 0xd4af37, 0.08);
    flash.setDepth(100);
    
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => flash.destroy()
    });

    // MTG Arena-style gold ripple effect
    const ripple = this.add.graphics();
    ripple.lineStyle(2, 0xd4af37, 0.8);
    ripple.strokeCircle(button.x, button.y, 10);
    ripple.setDepth(50);

    this.tweens.add({
      targets: ripple,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 400,
      ease: 'Sine.easeOut',
      onComplete: () => ripple.destroy()
    });
    
    // MTG Arena-style particle burst
    const particles = this.add.particles(button.x, button.y, 'fire-particle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 600,
      quantity: 15,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 20),
        quantity: 15
      }
    });
    
    this.time.delayedCall(600, () => particles.destroy());
  }

  private transitionToScene(sceneName: string) {
    // MTG Arena-style transition with gold flash
    const flash = this.add.rectangle(400, 300, 800, 600, 0xd4af37, 0);
    flash.setDepth(1000);
    
    // First flash gold (like MTG Arena card transitions)
    this.tweens.add({
      targets: flash,
      alpha: 0.3,
      duration: 200,
      onComplete: () => {
        // Then fade to black (like MTG Arena scene transitions)
        this.tweens.add({
          targets: flash,
          fillColor: 0x000000,
          alpha: 1,
          duration: 300,
          onComplete: () => {
            // Stop background music
            if (this.backgroundMusic) {
              this.backgroundMusic.stop();
            }
            
            // Start the new scene
            this.scene.start(sceneName);
          }
        });
      }
    });
    
    // MTG Arena-style particle burst during transition
    const particles = this.add.particles(400, 300, 'fire-particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 500,
      quantity: 30,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 100),
        quantity: 30
      }
    });
    
    this.time.delayedCall(300, () => particles.destroy());
  }

  private createSettingsPanel() {
    // MTG Arena-style settings panel (hidden by default)
    const settingsPanel = this.add.container(400, 300);
    settingsPanel.setVisible(false);
    settingsPanel.setDepth(200);
    settingsPanel.setName('settingsPanel');

    // MTG Arena-style dark panel with gold accents
    const panelBg = this.add.graphics();
    // Dark background like MTG Arena
    panelBg.fillStyle(0x0a1f3d, 0.95);
    panelBg.fillRoundedRect(-200, -150, 400, 300, 10);
    // Gold border like MTG Arena UI
    panelBg.lineStyle(2, 0xd4af37, 0.8);
    panelBg.strokeRoundedRect(-200, -150, 400, 300, 10);
    
    // Inner accent line (MTG Arena style)
    panelBg.lineStyle(1, 0xd4af37, 0.4);
    panelBg.strokeRoundedRect(-195, -145, 390, 290, 8);

    // MTG Arena-style title with gold text
    const title = this.add.text(0, -120, 'SETTINGS', {
      fontSize: this.isMobile ? '22px' : '26px',
      fontFamily: 'Arial Black',
      color: '#d4af37',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Divider line (MTG Arena style)
    const divider = this.add.graphics();
    divider.lineStyle(1, 0xd4af37, 0.6);
    divider.lineBetween(-180, -95, 180, -95);

    // Volume controls with MTG Arena styling
    const volumeText = this.add.text(-150, -60, 'MASTER VOLUME', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5);
    
    // Volume slider background (MTG Arena style)
    const volumeSliderBg = this.add.graphics();
    volumeSliderBg.fillStyle(0x1a1a1a, 1);
    volumeSliderBg.fillRect(20, -70, 150, 20);
    volumeSliderBg.lineStyle(1, 0x888888, 0.8);
    volumeSliderBg.strokeRect(20, -70, 150, 20);
    
    // Volume slider fill (MTG Arena style)
    const volumeSliderFill = this.add.graphics();
    volumeSliderFill.fillStyle(0xd4af37, 0.8);
    volumeSliderFill.fillRect(20, -70, 100, 20);

    // Graphics quality toggle with MTG Arena styling
    const qualityText = this.add.text(-150, -10, 'GRAPHICS QUALITY', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5);
    
    // Quality toggle button (MTG Arena style)
    const qualityToggle = this.add.graphics();
    qualityToggle.fillStyle(0x1a1a1a, 1);
    qualityToggle.fillRoundedRect(20, -20, 150, 20, 5);
    qualityToggle.lineStyle(1, 0xd4af37, 0.8);
    qualityToggle.strokeRoundedRect(20, -20, 150, 20, 5);
    
    const qualityValue = this.add.text(95, -10, 'HIGH', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#d4af37',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Sound effects toggle with MTG Arena styling
    const sfxText = this.add.text(-150, 40, 'SOUND EFFECTS', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5);
    
    // SFX toggle button (MTG Arena style)
    const sfxToggle = this.add.graphics();
    sfxToggle.fillStyle(0x1a1a1a, 1);
    sfxToggle.fillRoundedRect(20, 30, 150, 20, 5);
    sfxToggle.lineStyle(1, 0xd4af37, 0.8);
    sfxToggle.strokeRoundedRect(20, 30, 150, 20, 5);
    
    const sfxValue = this.add.text(95, 40, 'ON', {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#d4af37',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Close settings button (MTG Arena style)
    const closeSettings = this.add.image(0, 100, 'secondary-menu-button');
    closeSettings.setDisplaySize(150, 40);
    closeSettings.setInteractive({ cursor: 'pointer' });
    
    const closeSettingsText = this.add.text(0, 100, 'CLOSE', {
      fontSize: this.isMobile ? '14px' : '16px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);

    // MTG Arena-style hover effect
    closeSettings.on('pointerover', () => {
      closeSettings.setTint(0xd4af37);
      closeSettingsText.setColor('#ffffff');
    });
    
    closeSettings.on('pointerout', () => {
      closeSettings.clearTint();
      closeSettingsText.setColor('#ffffff');
    });

    closeSettings.on('pointerdown', () => {
      this.hideSettings();
      
      // MTG Arena-style click effect
      const particles = this.add.particles(closeSettings.x, closeSettings.y, 'fire-particle', {
        speed: { min: 50, max: 100 },
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 500,
        quantity: 10
      });
      
      this.time.delayedCall(500, () => particles.destroy());
    });

    settingsPanel.add([
      panelBg, 
      title, 
      divider,
      volumeText, 
      volumeSliderBg,
      volumeSliderFill,
      qualityText, 
      qualityToggle,
      qualityValue,
      sfxText,
      sfxToggle,
      sfxValue,
      closeSettings, 
      closeSettingsText
    ]);
    
    this.add.existing(settingsPanel);
  }
  
  private createPlayMenu() {
    // MTG Arena-style play menu panel (hidden by default)
    const playPanel = this.add.container(400, 300);
    playPanel.setVisible(false);
    playPanel.setDepth(200);
    playPanel.setName('playPanel');

    // MTG Arena-style dark panel with gold accents
    const panelBg = this.add.graphics();
    // Dark background like MTG Arena
    panelBg.fillStyle(0x0a1f3d, 0.95);
    panelBg.fillRoundedRect(-300, -200, 600, 400, 10);
    // Gold border like MTG Arena UI
    panelBg.lineStyle(2, 0xd4af37, 0.8);
    panelBg.strokeRoundedRect(-300, -200, 600, 400, 10);
    
    // Inner accent line (MTG Arena style)
    panelBg.lineStyle(1, 0xd4af37, 0.4);
    panelBg.strokeRoundedRect(-295, -195, 590, 390, 8);

    // MTG Arena-style title with gold text
    const title = this.add.text(0, -160, 'PLAY', {
      fontSize: this.isMobile ? '26px' : '32px',
      fontFamily: 'Arial Black',
      color: '#d4af37',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Divider line (MTG Arena style)
    const divider = this.add.graphics();
    divider.lineStyle(1, 0xd4af37, 0.6);
    divider.lineBetween(-280, -130, 280, -130);
    
    // Game mode buttons
    // Use game modes from window object if available, or fallback to default modes
    const gameModes = window.KONIVRER_GAME_MODES || [
      {
        id: 'premium',
        title: 'Premium Battle',
        description: 'Full-featured premium gameplay with enhanced graphics and effects',
        icon: '',
        difficulty: 'All Levels',
        requiresAccount: false
      },
      {
        id: 'quick',
        title: 'Quick Match',
        description: 'Fast-paced matches with standard rules',
        icon: '',
        difficulty: 'All Levels',
        requiresAccount: false
      },
      {
        id: 'practice',
        title: 'Practice Mode',
        description: 'Play against AI opponents with no penalties',
        icon: '',
        difficulty: 'Beginner Friendly',
        requiresAccount: false
      },
      {
        id: 'tournament',
        title: 'Tournament',
        description: 'Compete in structured tournaments with prizes',
        icon: '👑',
        difficulty: 'Expert',
        requiresAccount: false
      }
    ];
    
    // Map game modes to play modes with scene information
    const playModes = gameModes.map(mode => {
      // Map game mode IDs to appropriate scenes
      let scene = 'CardBattleScene';
      if (mode.id === 'premium' || mode.id === 'tournament') {
        scene = 'PremiumCardBattleScene';
      } else if (mode.id === 'quick') {
        scene = 'EnhancedCardBattleScene';
      }
      
      return {
        text: mode.title.toUpperCase(),
        scene: scene,
        description: mode.description,
        icon: mode.icon || ''
      };
    });
    
    const buttonWidth = 250;
    const buttonHeight = 60;
    const buttonSpacing = 20;
    
    // Create buttons for each play mode
    playModes.forEach((mode, index) => {
      const y = -100 + (index * (buttonHeight + buttonSpacing));
      
      // Button background
      const button = this.add.image(0, y, 'premium-menu-button');
      button.setDisplaySize(buttonWidth, buttonHeight);
      button.setInteractive({ cursor: 'pointer' });
      
      // Button text with icon if available
      const displayText = mode.icon ? `${mode.icon} ${mode.text}` : mode.text;
      const text = this.add.text(0, y, displayText, {
        fontSize: this.isMobile ? '16px' : '18px',
        fontFamily: 'Arial Black',
        color: '#ecf0f1'
      }).setOrigin(0.5);
      
      // Description text (only visible on hover)
      const description = this.add.text(0, y + 30, mode.description, {
        fontSize: this.isMobile ? '12px' : '14px',
        fontFamily: 'Arial',
        color: '#bdc3c7',
        align: 'center',
        wordWrap: { width: buttonWidth + 100 }
      }).setOrigin(0.5);
      description.setAlpha(0);
      
      // Hover effects
      button.on('pointerover', () => {
        button.setScale(1.05);
        text.setScale(1.05);
        button.setTint(0xd4af37);
        
        // Show description with fade in
        this.tweens.add({
          targets: description,
          alpha: 1,
          duration: 200
        });
        
        // Add hover particles
        const particles = this.add.particles(button.x, button.y, 'fire-particle', {
          speed: { min: 20, max: 40 },
          scale: { start: 0.2, end: 0 },
          alpha: { start: 0.5, end: 0 },
          lifespan: 600,
          frequency: 50,
          quantity: 1,
          emitZone: { 
            type: 'edge', 
            source: new Phaser.Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight),
            quantity: 8
          }
        });
        
        button.setData('hoverParticles', particles);
      });
      
      button.on('pointerout', () => {
        button.setScale(1);
        text.setScale(1);
        button.clearTint();
        
        // Hide description
        this.tweens.add({
          targets: description,
          alpha: 0,
          duration: 200
        });
        
        // Destroy hover particles
        const particles = button.getData('hoverParticles');
        if (particles) {
          particles.destroy();
        }
      });
      
      // Click effect
      button.on('pointerdown', () => {
        this.createClickEffect(button);
        this.playClickSound();
        this.hidePlayMenu();
        this.transitionToScene(mode.scene);
      });
      
      playPanel.add([button, text, description]);
    });
    
    // Close button
    const closeButton = this.add.image(0, 140, 'secondary-menu-button');
    closeButton.setDisplaySize(150, 40);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(0, 140, 'BACK', {
      fontSize: this.isMobile ? '14px' : '16px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // MTG Arena-style hover effect for close button
    closeButton.on('pointerover', () => {
      closeButton.setTint(0xd4af37);
      closeText.setColor('#ffffff');
    });
    
    closeButton.on('pointerout', () => {
      closeButton.clearTint();
      closeText.setColor('#ffffff');
    });
    
    closeButton.on('pointerdown', () => {
      this.hidePlayMenu();
      
      // MTG Arena-style click effect
      const particles = this.add.particles(closeButton.x, closeButton.y, 'fire-particle', {
        speed: { min: 50, max: 100 },
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 500,
        quantity: 10
      });
      
      this.time.delayedCall(500, () => particles.destroy());
    });
    
    playPanel.add([closeButton, closeText]);
    
    this.add.existing(playPanel);
  }

  private showSettings() {
    const settingsPanel = this.children.getByName('settingsPanel') as Phaser.GameObjects.Container;
    settingsPanel.setVisible(true);
    settingsPanel.setScale(0);
    
    // MTG Arena-style panel animation (quick slide in with slight bounce)
    this.tweens.add({
      targets: settingsPanel,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.easeOut',
      easeParams: [2.5]
    });
    
    // MTG Arena-style dim background with slight blue tint
    const dimOverlay = this.add.rectangle(400, 300, 800, 600, 0x0a1f3d, 0);
    dimOverlay.setDepth(99);
    dimOverlay.setName('dimOverlay');
    
    this.tweens.add({
      targets: dimOverlay,
      alpha: 0.8,
      duration: 250
    });
    
    // MTG Arena-style particle effect when opening settings
    const particles = this.add.particles(400, 300, 'fire-particle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 500,
      quantity: 15,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 100),
        quantity: 15
      }
    });
    
    this.time.delayedCall(500, () => particles.destroy());
  }

  private hideSettings() {
    const settingsPanel = this.children.getByName('settingsPanel') as Phaser.GameObjects.Container;
    const dimOverlay = this.children.getByName('dimOverlay') as Phaser.GameObjects.Rectangle;
    
    // MTG Arena-style quick fade out
    this.tweens.add({
      targets: settingsPanel,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      ease: 'Sine.easeIn',
      onComplete: () => {
        settingsPanel.setVisible(false);
        settingsPanel.setAlpha(1); // Reset alpha for next time
      }
    });
    
    // MTG Arena-style background fade
    if (dimOverlay) {
      this.tweens.add({
        targets: dimOverlay,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          dimOverlay.destroy();
        }
      });
    }
    
    // MTG Arena-style particle burst when closing
    const particles = this.add.particles(400, 300, 'magic-particle', {
      speed: { min: 30, max: 80 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      quantity: 10,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 50),
        quantity: 10
      }
    });
    
    this.time.delayedCall(400, () => particles.destroy());
  }
  
  private showPlayMenu() {
    const playPanel = this.children.getByName('playPanel') as Phaser.GameObjects.Container;
    playPanel.setVisible(true);
    playPanel.setScale(0);
    
    // MTG Arena-style panel animation (quick slide in with slight bounce)
    this.tweens.add({
      targets: playPanel,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.easeOut',
      easeParams: [2.5]
    });
    
    // MTG Arena-style dim background with slight blue tint
    const dimOverlay = this.add.rectangle(400, 300, 800, 600, 0x0a1f3d, 0);
    dimOverlay.setDepth(99);
    dimOverlay.setName('playDimOverlay');
    
    this.tweens.add({
      targets: dimOverlay,
      alpha: 0.8,
      duration: 250
    });
    
    // MTG Arena-style particle effect when opening play menu
    const particles = this.add.particles(400, 300, 'fire-particle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 500,
      quantity: 20,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 150),
        quantity: 20
      }
    });
    
    this.time.delayedCall(500, () => particles.destroy());
  }

  private hidePlayMenu() {
    const playPanel = this.children.getByName('playPanel') as Phaser.GameObjects.Container;
    const dimOverlay = this.children.getByName('playDimOverlay') as Phaser.GameObjects.Rectangle;
    
    // MTG Arena-style quick fade out
    this.tweens.add({
      targets: playPanel,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      ease: 'Sine.easeIn',
      onComplete: () => {
        playPanel.setVisible(false);
        playPanel.setAlpha(1); // Reset alpha for next time
      }
    });
    
    // MTG Arena-style background fade
    if (dimOverlay) {
      this.tweens.add({
        targets: dimOverlay,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          dimOverlay.destroy();
        }
      });
    }
    
    // MTG Arena-style particle burst when closing
    const particles = this.add.particles(400, 300, 'magic-particle', {
      speed: { min: 30, max: 80 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      quantity: 15,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 100),
        quantity: 15
      }
    });
    
    this.time.delayedCall(400, () => particles.destroy());
  }

  private startBackgroundMusic() {
    // In a real implementation, you would load and play actual MTG Arena-style orchestral music
    // For now, we'll create a simple ambient tone with MTG Arena-like characteristics
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Create MTG Arena-style ambient music (simple approximation)
      if (audioContext) {
        // Create oscillators for a rich sound (like MTG Arena's orchestral background)
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const osc3 = audioContext.createOscillator();
        
        // Set frequencies for a minor chord (MTG Arena often uses minor keys)
        osc1.frequency.value = 220; // A3
        osc2.frequency.value = 261.63; // C4
        osc3.frequency.value = 329.63; // E4
        
        // Set oscillator types for richer sound
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';
        
        // Create gain nodes for volume control
        const gainNode1 = audioContext.createGain();
        const gainNode2 = audioContext.createGain();
        const gainNode3 = audioContext.createGain();
        
        // Set very low volume (background music)
        gainNode1.gain.value = 0.03;
        gainNode2.gain.value = 0.02;
        gainNode3.gain.value = 0.01;
        
        // Connect oscillators to gain nodes
        osc1.connect(gainNode1);
        osc2.connect(gainNode2);
        osc3.connect(gainNode3);
        
        // Connect gain nodes to output
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);
        gainNode3.connect(audioContext.destination);
        
        // Start oscillators
        osc1.start();
        osc2.start();
        osc3.start();
        
        // Store references for cleanup
        this.backgroundMusic = {
          stop: () => {
            // Fade out gracefully
            const now = audioContext.currentTime;
            gainNode1.gain.linearRampToValueAtTime(0, now + 1);
            gainNode2.gain.linearRampToValueAtTime(0, now + 1);
            gainNode3.gain.linearRampToValueAtTime(0, now + 1);
            
            // Stop after fade out
            setTimeout(() => {
              osc1.stop();
              osc2.stop();
              osc3.stop();
            }, 1000);
          }
        };
      }
    } catch (error) {
      console.log('Audio context not available');
    }
  }

  private playHoverSound() {
    // MTG Arena-style hover sound effect (subtle magical shimmer)
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext) {
        // Create oscillators for a richer sound
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        
        // Create gain nodes
        const gainNode1 = audioContext.createGain();
        const gainNode2 = audioContext.createGain();
        
        // Connect nodes
        oscillator1.connect(gainNode1);
        oscillator2.connect(gainNode2);
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);
        
        // MTG Arena uses higher pitched sounds for hover
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(2200, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(2400, audioContext.currentTime + 0.1);
        
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(2600, audioContext.currentTime);
        
        // Very subtle volume
        gainNode1.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        gainNode2.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        
        // Start and stop
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.08);
      }
    } catch (error) {
      // Silently fail if audio is not available
    }
  }

  private playClickSound() {
    // MTG Arena-style click sound effect (magical tap with slight reverb)
    try {
      const audioContext = this.registry.get('audioContext');
      if (audioContext) {
        // Create multiple oscillators for a richer sound
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const oscillator3 = audioContext.createOscillator();
        
        // Create gain nodes
        const gainNode1 = audioContext.createGain();
        const gainNode2 = audioContext.createGain();
        const gainNode3 = audioContext.createGain();
        
        // Create a convolver for reverb effect
        const convolver = audioContext.createConvolver();
        
        // Connect nodes
        oscillator1.connect(gainNode1);
        oscillator2.connect(gainNode2);
        oscillator3.connect(gainNode3);
        
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);
        gainNode3.connect(convolver);
        convolver.connect(audioContext.destination);
        
        // MTG Arena uses distinctive click sounds
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(1800, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
        
        oscillator3.type = 'sine';
        oscillator3.frequency.setValueAtTime(2400, audioContext.currentTime);
        oscillator3.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.05);
        
        // Volume envelope
        gainNode1.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        gainNode2.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        gainNode3.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        // Start and stop
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator3.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.15);
        oscillator3.stop(audioContext.currentTime + 0.05);
      }
    } catch (error) {
      // Silently fail if audio is not available
    }
  }

  private animateEntrance() {
    // MTG Arena-style entrance with gold flash
    const flash = this.add.rectangle(400, 300, 800, 600, 0xd4af37, 0.3);
    flash.setDepth(1000);
    
    // First flash gold (like MTG Arena card transitions)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => flash.destroy()
    });
    
    // Fade in from black after gold flash
    this.cameras.main.fadeIn(800, 0, 0, 0);
    
    // MTG Arena-style logo entrance (from small to normal with slight bounce)
    this.logoContainer.setScale(0.7);
    this.logoContainer.setAlpha(0);
    
    this.tweens.add({
      targets: this.logoContainer,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 1000,
      ease: 'Back.easeOut',
      easeParams: [2],
      delay: 300
    });
    
    // Add MTG Arena-style particle burst around logo
    this.time.delayedCall(300, () => {
      const particles = this.add.particles(400, this.isMobile ? 120 : 150, 'fire-particle', {
        speed: { min: 50, max: 100 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 800,
        quantity: 20,
        emitZone: { 
          type: 'edge', 
          source: new Phaser.Geom.Circle(0, 0, 150),
          quantity: 20
        }
      });
      
      this.time.delayedCall(800, () => particles.destroy());
    });

    // MTG Arena-style menu entrance (each button appears with slight delay)
    this.menuContainer.setAlpha(0);
    
    // Get all buttons in the menu container
    const menuItems = this.menuContainer.getAll();
    
    // Animate each button separately with staggered delay
    menuItems.forEach((item, index) => {
      item.setAlpha(0);
      item.setScale(0.8);
      
      this.tweens.add({
        targets: item,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut',
        delay: 800 + (index * 100) // Staggered delay for each button
      });
    });
    
    // Make menu container visible
    this.menuContainer.setAlpha(1);
  }

  private closeGame() {
    // MTG Arena-style close with gold flash
    const flash = this.add.rectangle(400, 300, 800, 600, 0xd4af37, 0);
    flash.setDepth(1000);
    
    // First flash gold (like MTG Arena transitions)
    this.tweens.add({
      targets: flash,
      alpha: 0.3,
      duration: 200,
      onComplete: () => {
        // Then fade to black (like MTG Arena scene transitions)
        this.tweens.add({
          targets: flash,
          fillColor: 0x000000,
          alpha: 1,
          duration: 300,
          onComplete: () => {
            if (window.setShowGame) {
              window.setShowGame(false);
            }
          }
        });
      }
    });
    
    // MTG Arena-style particle burst when closing
    const particles = this.add.particles(400, 300, 'fire-particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 500,
      quantity: 30,
      emitZone: { 
        type: 'random', 
        source: new Phaser.Geom.Circle(0, 0, 100),
        quantity: 30
      }
    });
    
    this.time.delayedCall(300, () => particles.destroy());
    
    // Stop background music with fade out
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
  }
}

// Extend window interface
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
    KONIVRER_PERFORMANCE_SETTINGS?: {
      graphicsQuality: string;
      particleEffects: boolean;
      animations: boolean;
      soundEffects: boolean;
      backgroundMusic: boolean;
    };
    KONIVRER_GAME_MODES?: any[];
    KONIVRER_USER_DATA?: {
      isLoggedIn: boolean;
      showLoginModal: () => void;
    };
    KONIVRER_CURRENT_SCENE?: string;
    KONIVRER_ACCESSIBILITY_CLICKED?: () => void;
  }
}