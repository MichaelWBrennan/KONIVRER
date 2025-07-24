/**
 * Premium Card Battle Scene - MTG Arena Quality Graphics & Mobile Touch Support
 * Features:
 * - Professional graphics and animations
 * - Particle effects and visual feedback
 * - Full mobile touch controls
 * - Smooth transitions and tweens
 * - Advanced UI components
 */

import Phaser from 'phaser';
import { KONIVRER_CARDS, Card } from '../../data/cards';

interface GameCard extends Card {
  gameId: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  isPlayable: boolean;
  isHovered: boolean;
  isSelected: boolean;
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

export class PremiumCardBattleScene extends Phaser.Scene {
  private player1!: Player;
  private player2!: Player;
  private currentPlayer: 1 | 2 = 1;
  private turnNumber: number = 1;
  private selectedCard: GameCard | null = null;
  private gamePhase: 'setup' | 'playing' | 'ended' = 'setup';
  
  // Visual Effects
  private backgroundParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private spellEffects: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private cardGlowPool: Phaser.GameObjects.Image[] = [];
  
  // UI Elements with Premium Styling
  private healthBar1!: Phaser.GameObjects.Graphics;
  private healthBar2!: Phaser.GameObjects.Graphics;
  private manaBar1!: Phaser.GameObjects.Graphics;
  private manaBar2!: Phaser.GameObjects.Graphics;
  private turnIndicator!: Phaser.GameObjects.Container;
  private gameBoard!: Phaser.GameObjects.Image;
  
  // Mobile Touch Support
  private isMobile: boolean = false;
  private touchStartPos: { x: number; y: number } | null = null;
  private draggedCard: GameCard | null = null;
  private dropZones: Phaser.GameObjects.Zone[] = [];
  private zoomLevel: number = 1;
  private cameraController!: Phaser.Cameras.Scene2D.Camera;
  
  // Animation Tweens
  private activeTweens: Phaser.Tweens.Tween[] = [];
  
  // Premium UI Components
  private uiContainer!: Phaser.GameObjects.Container;
  private cardPreviewContainer!: Phaser.GameObjects.Container;
  private tooltipContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'PremiumCardBattleScene' });
  }

  preload() {
    // Load high-quality card images
    KONIVRER_CARDS.forEach(card => {
      const imagePath = `/assets/cards/${card.name.toUpperCase()}.png`;
      this.load.image(card.id, imagePath);
    });
    
    // Load premium UI assets
    this.createPremiumAssets();
    
    // Load particle textures
    this.load.image('particle-fire', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABYSURBVAiZY/z//z8DAwMDEwMDw38GBgYGJgYGhv8MDAwMzAwMDP8ZGBgYmBkYGP4zMDAwMDMwMPxnYGBgYGZgYPjPwMDAwMzAwPCfgYGBgZmBgeE/AwMDAwAZNQQF/7t8fAAAAABJRU5ErkJggg==');
    this.load.image('particle-water', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABYSURBVAiZY/z//z8DAwMDEwMDw38GBgYGJgYGhv8MDAwMzAwMDP8ZGBgYmBkYGP4zMDAwMDMwMPxnYGBgYGZgYPjPwMDAwMzAwPCfgYGBgZmBgeE/AwMDAwAZNQQF/7t8fAAAAABJRU5ErkJggg==');
    this.load.image('particle-lightning', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABYSURBVAiZY/z//z8DAwMDEwMDw38GBgYGJgYGhv8MDAwMzAwMDP8ZGBgYmBkYGP4zMDAwMDMwMPxnYGBgYGZgYPjPwMDAwMzAwPCfgYGBgZmBgeE/AwMDAwAZNQQF/7t8fAAAAABJRU5ErkJggg==');
  }

  create() {
    this.detectMobile();
    this.setupPremiumGraphics();
    this.createParticleEffects();
    this.setupMobileControls();
    this.createPremiumUI();
    this.initializePlayers();
    this.startGameWithAnimation();
  }

  private detectMobile() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0);
  }

  private createPremiumAssets() {
    // Create gradient backgrounds
    const gradientCanvas = this.add.graphics();
    gradientCanvas.fillGradientStyle(0x0a0a0a, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    gradientCanvas.fillRect(0, 0, 800, 600);
    gradientCanvas.generateTexture('premium-bg', 800, 600);
    gradientCanvas.destroy();

    // Create card glow effect
    const glowCanvas = this.add.graphics();
    glowCanvas.fillStyle(0xffffff, 0.3);
    glowCanvas.fillRoundedRect(-5, -5, 70, 98, 8);
    glowCanvas.generateTexture('card-glow', 60, 88);
    glowCanvas.destroy();

    // Create premium button
    const buttonCanvas = this.add.graphics();
    buttonCanvas.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 1);
    buttonCanvas.fillRoundedRect(0, 0, 120, 40, 8);
    buttonCanvas.lineStyle(2, 0x3498db, 1);
    buttonCanvas.strokeRoundedRect(0, 0, 120, 40, 8);
    buttonCanvas.generateTexture('premium-button', 120, 40);
    buttonCanvas.destroy();

    // Create health/mana bar background
    const barBgCanvas = this.add.graphics();
    barBgCanvas.fillStyle(0x2c3e50, 0.8);
    barBgCanvas.fillRoundedRect(0, 0, 200, 20, 10);
    barBgCanvas.generateTexture('bar-bg', 200, 20);
    barBgCanvas.destroy();
  }

  private setupPremiumGraphics() {
    // Premium background with depth
    this.gameBoard = this.add.image(400, 300, 'premium-bg');
    this.gameBoard.setDisplaySize(800, 600);

    // Add depth with multiple layers
    const overlay1 = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.1);
    const overlay2 = this.add.rectangle(400, 300, 800, 600, 0x1a1a2e, 0.05);

    // Create game zones with premium styling
    this.createPremiumGameZones();
  }

  private createPremiumGameZones() {
    // Enemy battlefield (top)
    const enemyBattlefield = this.add.graphics();
    enemyBattlefield.fillGradientStyle(0x8e44ad, 0x9b59b6, 0x8e44ad, 0x9b59b6, 0.3);
    enemyBattlefield.fillRoundedRect(50, 150, 700, 100, 15);
    enemyBattlefield.lineStyle(2, 0x9b59b6, 0.8);
    enemyBattlefield.strokeRoundedRect(50, 150, 700, 100, 15);

    // Player battlefield (bottom)
    const playerBattlefield = this.add.graphics();
    playerBattlefield.fillGradientStyle(0x2980b9, 0x3498db, 0x2980b9, 0x3498db, 0.3);
    playerBattlefield.fillRoundedRect(50, 350, 700, 100, 15);
    playerBattlefield.lineStyle(2, 0x3498db, 0.8);
    playerBattlefield.strokeRoundedRect(50, 350, 700, 100, 15);

    // Hand areas with glow
    const handArea = this.add.graphics();
    handArea.fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71, 0.2);
    handArea.fillRoundedRect(50, 480, 700, 100, 15);
    handArea.lineStyle(2, 0x2ecc71, 0.6);
    handArea.strokeRoundedRect(50, 480, 700, 100, 15);

    // Add zone labels with premium typography
    this.add.text(400, 200, 'ENEMY BATTLEFIELD', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 400, 'YOUR BATTLEFIELD', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  private createParticleEffects() {
    // Background ambient particles
    this.backgroundParticles = this.add.particles(400, 300, 'particle-fire', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.1, end: 0 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 3000,
      frequency: 200,
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 800, 600) }
    });
    this.backgroundParticles.setDepth(-1);
  }

  private setupMobileControls() {
    this.cameraController = this.cameras.main;
    
    if (this.isMobile) {
      // Enable pinch to zoom
      this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
        this.handleZoom(deltaY);
      });

      // Touch controls
      this.input.on('pointerdown', this.handleTouchStart, this);
      this.input.on('pointermove', this.handleTouchMove, this);
      this.input.on('pointerup', this.handleTouchEnd, this);

      // Gesture support
      this.setupGestureControls();
    }

    // Create drop zones for mobile
    this.createDropZones();
  }

  private setupGestureControls() {
    let initialDistance = 0;
    let initialZoom = 1;

    this.input.on('pointerdown', (pointer: any) => {
      if (this.input.activePointer.pointerId !== undefined) {
        const pointers = this.input.manager.pointers;
        if (pointers.length === 2) {
          const pointer1 = pointers[0];
          const pointer2 = pointers[1];
          initialDistance = Phaser.Math.Distance.Between(
            pointer1.x, pointer1.y, pointer2.x, pointer2.y
          );
          initialZoom = this.zoomLevel;
        }
      }
    });

    this.input.on('pointermove', (pointer: any) => {
      const pointers = this.input.manager.pointers;
      if (pointers.length === 2) {
        const pointer1 = pointers[0];
        const pointer2 = pointers[1];
        const currentDistance = Phaser.Math.Distance.Between(
          pointer1.x, pointer1.y, pointer2.x, pointer2.y
        );
        
        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          this.zoomLevel = Phaser.Math.Clamp(initialZoom * scale, 0.5, 2);
          this.cameraController.setZoom(this.zoomLevel);
        }
      }
    });
  }

  private createDropZones() {
    // Battlefield drop zone
    const battlefieldZone = this.add.zone(400, 400, 700, 100);
    battlefieldZone.setRectangleDropZone(700, 100);
    battlefieldZone.setName('battlefield');
    this.dropZones.push(battlefieldZone);

    // Visual feedback for drop zones
    battlefieldZone.on('dragenter', () => {
      this.showDropZoneHighlight(battlefieldZone);
    });

    battlefieldZone.on('dragleave', () => {
      this.hideDropZoneHighlight(battlefieldZone);
    });
  }

  private createPremiumUI() {
    this.uiContainer = this.add.container(0, 0);
    this.uiContainer.setDepth(100);

    this.createPremiumHealthBars();
    this.createPremiumManaBars();
    this.createPremiumTurnIndicator();
    this.createPremiumButtons();
    this.createCardPreview();
    this.createTooltipSystem();
  }

  private createPremiumHealthBars() {
    // Player 1 Health Bar
    const healthBg1 = this.add.image(150, 50, 'bar-bg');
    this.healthBar1 = this.add.graphics();
    this.updateHealthBar(this.healthBar1, 150, 50, 30, 30);

    const healthIcon1 = this.add.text(60, 50, '❤️', { fontSize: '20px' }).setOrigin(0.5);
    const healthText1 = this.add.text(250, 50, '30', {
      fontSize: '18px',
      fontFamily: 'Arial Black',
      color: '#e74c3c',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Player 2 Health Bar
    const healthBg2 = this.add.image(150, 550, 'bar-bg');
    this.healthBar2 = this.add.graphics();
    this.updateHealthBar(this.healthBar2, 150, 550, 30, 30);

    const healthIcon2 = this.add.text(60, 550, '❤️', { fontSize: '20px' }).setOrigin(0.5);
    const healthText2 = this.add.text(250, 550, '30', {
      fontSize: '18px',
      fontFamily: 'Arial Black',
      color: '#e74c3c',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.uiContainer.add([healthBg1, healthIcon1, healthText1, healthBg2, healthIcon2, healthText2]);
  }

  private createPremiumManaBars() {
    // Player 1 Mana Bar
    const manaBg1 = this.add.image(450, 50, 'bar-bg');
    this.manaBar1 = this.add.graphics();
    this.updateManaBar(this.manaBar1, 450, 50, 1, 1);

    const manaIcon1 = this.add.text(360, 50, '💎', { fontSize: '20px' }).setOrigin(0.5);
    const manaText1 = this.add.text(550, 50, '1/1', {
      fontSize: '18px',
      fontFamily: 'Arial Black',
      color: '#3498db',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Player 2 Mana Bar
    const manaBg2 = this.add.image(450, 550, 'bar-bg');
    this.manaBar2 = this.add.graphics();
    this.updateManaBar(this.manaBar2, 450, 550, 1, 1);

    const manaIcon2 = this.add.text(360, 550, '💎', { fontSize: '20px' }).setOrigin(0.5);
    const manaText2 = this.add.text(550, 550, '1/1', {
      fontSize: '18px',
      fontFamily: 'Arial Black',
      color: '#3498db',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.uiContainer.add([manaBg1, manaIcon1, manaText1, manaBg2, manaIcon2, manaText2]);
  }

  private createPremiumTurnIndicator() {
    this.turnIndicator = this.add.container(400, 25);
    
    const turnBg = this.add.graphics();
    turnBg.fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.9);
    turnBg.fillRoundedRect(-100, -15, 200, 30, 15);
    turnBg.lineStyle(2, 0xf1c40f, 1);
    turnBg.strokeRoundedRect(-100, -15, 200, 30, 15);

    const turnText = this.add.text(0, 0, 'TURN 1 - PLAYER 1', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#2c3e50'
    }).setOrigin(0.5);

    this.turnIndicator.add([turnBg, turnText]);
    this.uiContainer.add(this.turnIndicator);

    // Animate turn indicator
    this.tweens.add({
      targets: this.turnIndicator,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createPremiumButtons() {
    // End Turn Button
    const endTurnBtn = this.add.image(700, 50, 'premium-button');
    endTurnBtn.setInteractive({ cursor: 'pointer' });
    
    const endTurnText = this.add.text(700, 50, 'END TURN', {
      fontSize: '14px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    // Button hover effects
    endTurnBtn.on('pointerover', () => {
      this.tweens.add({
        targets: endTurnBtn,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    endTurnBtn.on('pointerout', () => {
      this.tweens.add({
        targets: endTurnBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    endTurnBtn.on('pointerdown', () => {
      this.createButtonClickEffect(endTurnBtn);
      this.endTurn();
    });

    // Close Button
    const closeBtn = this.add.image(750, 25, 'premium-button');
    closeBtn.setDisplaySize(80, 30);
    closeBtn.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(750, 25, 'CLOSE', {
      fontSize: '12px',
      fontFamily: 'Arial Black',
      color: '#e74c3c'
    }).setOrigin(0.5);

    closeBtn.on('pointerdown', () => {
      this.createButtonClickEffect(closeBtn);
      this.closeGame();
    });

    this.uiContainer.add([endTurnBtn, endTurnText, closeBtn, closeText]);
  }

  private createCardPreview() {
    this.cardPreviewContainer = this.add.container(600, 300);
    this.cardPreviewContainer.setDepth(200);
    this.cardPreviewContainer.setVisible(false);

    // Preview background
    const previewBg = this.add.graphics();
    previewBg.fillStyle(0x2c3e50, 0.95);
    previewBg.fillRoundedRect(-120, -170, 240, 340, 15);
    previewBg.lineStyle(3, 0x3498db, 1);
    previewBg.strokeRoundedRect(-120, -170, 240, 340, 15);

    this.cardPreviewContainer.add(previewBg);
  }

  private createTooltipSystem() {
    this.tooltipContainer = this.add.container(0, 0);
    this.tooltipContainer.setDepth(300);
    this.tooltipContainer.setVisible(false);
  }

  private updateHealthBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, current: number, max: number) {
    graphics.clear();
    
    const percentage = current / max;
    const barWidth = 180;
    const barHeight = 12;
    
    // Health bar gradient
    const color = percentage > 0.6 ? 0x27ae60 : percentage > 0.3 ? 0xf39c12 : 0xe74c3c;
    
    graphics.fillStyle(color, 0.8);
    graphics.fillRoundedRect(x - barWidth/2, y - barHeight/2, barWidth * percentage, barHeight, 6);
    
    // Add shine effect
    graphics.fillStyle(0xffffff, 0.3);
    graphics.fillRoundedRect(x - barWidth/2, y - barHeight/2, barWidth * percentage, barHeight/3, 6);
  }

  private updateManaBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, current: number, max: number) {
    graphics.clear();
    
    const barWidth = 180;
    const barHeight = 12;
    
    // Draw mana crystals
    for (let i = 0; i < max; i++) {
      const crystalX = x - barWidth/2 + (i * (barWidth / max)) + (barWidth / max / 2);
      const crystalY = y;
      
      if (i < current) {
        graphics.fillStyle(0x3498db, 0.9);
      } else {
        graphics.fillStyle(0x7f8c8d, 0.5);
      }
      
      graphics.fillRoundedRect(crystalX - 8, crystalY - 6, 16, 12, 3);
      
      if (i < current) {
        graphics.fillStyle(0xffffff, 0.4);
        graphics.fillRoundedRect(crystalX - 8, crystalY - 6, 16, 4, 3);
      }
    }
  }

  private createButtonClickEffect(button: Phaser.GameObjects.Image) {
    // Create ripple effect
    const ripple = this.add.graphics();
    ripple.lineStyle(2, 0x3498db, 1);
    ripple.strokeCircle(button.x, button.y, 5);
    ripple.setDepth(150);

    this.tweens.add({
      targets: ripple,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => ripple.destroy()
    });

    // Button press animation
    this.tweens.add({
      targets: button,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }

  private initializePlayers() {
    // Create enhanced player data with avatars
    this.player1 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: this.createGameDeck(),
      battlefield: []
    };

    this.player2 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: this.createGameDeck(),
      battlefield: []
    };

    // Draw initial hands
    this.drawCards(this.player1, 5);
    this.drawCards(this.player2, 5);
  }

  private createGameDeck(): GameCard[] {
    return KONIVRER_CARDS.slice(0, 30).map((card, index) => ({
      ...card,
      gameId: `${card.id}_${index}`,
      x: 0,
      y: 0,
      isPlayable: false,
      isHovered: false,
      isSelected: false
    }));
  }

  private drawCards(player: Player, count: number) {
    for (let i = 0; i < count && player.deck.length > 0; i++) {
      const card = player.deck.pop()!;
      player.hand.push(card);
      
      // Animate card draw
      this.animateCardDraw(card);
    }
    this.updateHandDisplay();
  }

  private animateCardDraw(card: GameCard) {
    // Create temporary card for animation
    const tempCard = this.add.image(400, -50, card.id);
    tempCard.setDisplaySize(60, 84);
    tempCard.setDepth(50);

    // Animate to hand position
    this.tweens.add({
      targets: tempCard,
      y: 530,
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        tempCard.destroy();
        this.updateHandDisplay();
      }
    });
  }

  private startGameWithAnimation() {
    this.gamePhase = 'playing';
    
    // Fade in effect
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    
    // Animate UI elements
    this.uiContainer.setAlpha(0);
    this.tweens.add({
      targets: this.uiContainer,
      alpha: 1,
      duration: 1500,
      ease: 'Power2'
    });

    this.updateDisplay();
  }

  private updateDisplay() {
    // Update health bars with animation
    this.tweens.add({
      targets: this.healthBar1,
      duration: 500,
      onUpdate: () => {
        this.updateHealthBar(this.healthBar1, 150, 50, this.player1.health, 30);
      }
    });

    this.tweens.add({
      targets: this.healthBar2,
      duration: 500,
      onUpdate: () => {
        this.updateHealthBar(this.healthBar2, 150, 550, this.player2.health, 30);
      }
    });

    // Update mana bars
    this.updateManaBar(this.manaBar1, 450, 50, this.player1.mana, this.player1.maxMana);
    this.updateManaBar(this.manaBar2, 450, 550, this.player2.mana, this.player2.maxMana);
  }

  private updateHandDisplay() {
    // Clear existing hand sprites
    this.player1.hand.forEach(card => {
      if (card.container) {
        card.container.destroy();
        card.container = undefined;
      }
    });

    // Display player 1 hand with premium effects
    const handStartX = 100;
    const handY = 530;
    const cardSpacing = this.isMobile ? 70 : 80;

    this.player1.hand.forEach((card, index) => {
      const x = handStartX + (index * cardSpacing);
      card.x = x;
      card.y = handY;
      
      // Check if card is playable
      card.isPlayable = card.cost <= this.player1.mana;
      
      // Create card container
      const cardContainer = this.add.container(x, handY);
      card.container = cardContainer;
      
      // Create card sprite
      const cardSprite = this.add.image(0, 0, card.id);
      cardSprite.setDisplaySize(60, 84);
      cardSprite.setInteractive({ cursor: 'pointer' });
      
      // Add glow effect for playable cards
      if (card.isPlayable) {
        const glow = this.add.image(0, 0, 'card-glow');
        glow.setTint(0x00ff00);
        glow.setAlpha(0.6);
        cardContainer.add(glow);
        card.glowEffect = glow;
      }
      
      cardContainer.add(cardSprite);
      
      // Set up interactions
      this.setupCardInteractions(card, cardSprite, cardContainer);
    });
  }

  private setupCardInteractions(card: GameCard, sprite: Phaser.GameObjects.Image, container: Phaser.GameObjects.Container) {
    // Hover effects
    sprite.on('pointerover', () => {
      if (card.isPlayable) {
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          y: card.y - 20,
          duration: 200,
          ease: 'Back.easeOut'
        });
        
        this.showCardTooltip(card, card.x, card.y - 100);
        
        // Add particle effect
        this.createCardHoverEffect(card);
      }
    });

    sprite.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        y: card.y,
        duration: 200,
        ease: 'Back.easeOut'
      });
      
      this.hideCardTooltip();
      this.removeCardHoverEffect(card);
    });

    // Touch/Click handling
    sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (card.isPlayable && this.currentPlayer === 1) {
        if (this.isMobile) {
          this.startCardDrag(card, pointer);
        } else {
          this.playCard(card);
        }
      }
    });

    // Mobile drag support
    if (this.isMobile) {
      this.input.setDraggable(sprite);
      
      sprite.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        container.x = dragX;
        container.y = dragY;
        this.updateDropZoneHighlights(dragX, dragY);
      });

      sprite.on('dragend', (pointer: Phaser.Input.Pointer) => {
        this.handleCardDrop(card, pointer.x, pointer.y);
      });
    }
  }

  private createCardHoverEffect(card: GameCard) {
    if (card.particles) return;

    const elementColors: { [key: string]: number } = {
      'Fire': 0xff6b6b,
      'Water': 0x4ecdc4,
      'Earth': 0x95a5a6,
      'Air': 0xf39c12,
      'Aether': 0xe74c3c,
      'Nether': 0x9b59b6,
      'Chaos': 0x2c3e50
    };

    const color = elementColors[card.elements[0]] || 0xffffff;
    
    card.particles = this.add.particles(card.x, card.y, 'particle-fire', {
      speed: { min: 20, max: 40 },
      scale: { start: 0.2, end: 0 },
      tint: color,
      alpha: { start: 0.8, end: 0 },
      lifespan: 1000,
      frequency: 100
    });
  }

  private removeCardHoverEffect(card: GameCard) {
    if (card.particles) {
      card.particles.destroy();
      card.particles = undefined;
    }
  }

  private showCardTooltip(card: GameCard, x: number, y: number) {
    this.tooltipContainer.removeAll(true);
    
    // Tooltip background
    const tooltipBg = this.add.graphics();
    tooltipBg.fillStyle(0x2c3e50, 0.95);
    tooltipBg.fillRoundedRect(0, 0, 250, 150, 10);
    tooltipBg.lineStyle(2, 0x3498db, 1);
    tooltipBg.strokeRoundedRect(0, 0, 250, 150, 10);

    // Card information with premium styling
    const nameText = this.add.text(125, 20, card.name, {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);

    const costText = this.add.text(125, 45, `Cost: ${card.cost}`, {
      fontSize: '14px',
      color: '#3498db'
    }).setOrigin(0.5);

    const typeText = this.add.text(125, 65, `${card.type} - ${card.rarity}`, {
      fontSize: '12px',
      color: '#f39c12'
    }).setOrigin(0.5);

    const elementsText = this.add.text(125, 85, `Elements: ${card.elements.join(', ')}`, {
      fontSize: '11px',
      color: '#2ecc71'
    }).setOrigin(0.5);

    if (card.strength) {
      const strengthText = this.add.text(125, 105, `Strength: ${card.strength}`, {
        fontSize: '12px',
        color: '#e74c3c'
      }).setOrigin(0.5);
      this.tooltipContainer.add(strengthText);
    }

    const descText = this.add.text(125, 125, card.description, {
      fontSize: '10px',
      color: '#bdc3c7',
      wordWrap: { width: 230 },
      align: 'center'
    }).setOrigin(0.5);

    this.tooltipContainer.add([tooltipBg, nameText, costText, typeText, elementsText, descText]);
    this.tooltipContainer.setPosition(x - 125, y - 75);
    this.tooltipContainer.setVisible(true);
    this.tooltipContainer.setDepth(300);

    // Animate tooltip appearance
    this.tooltipContainer.setAlpha(0);
    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });
  }

  private hideCardTooltip() {
    this.tooltipContainer.setVisible(false);
  }

  private playCard(card: GameCard) {
    if (card.cost > this.player1.mana) return;

    // Create spectacular play animation
    this.createCardPlayEffect(card);

    // Deduct mana
    this.player1.mana -= card.cost;

    // Remove from hand
    const handIndex = this.player1.hand.indexOf(card);
    this.player1.hand.splice(handIndex, 1);

    // Add to battlefield with animation
    this.player1.battlefield.push(card);
    this.animateCardToBattlefield(card);

    // Apply card effects
    this.applyCardEffects(card, this.player1, this.player2);

    // Update display
    this.updateDisplay();
    this.updateHandDisplay();
  }

  private createCardPlayEffect(card: GameCard) {
    // Screen flash effect
    const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0.3);
    flash.setDepth(250);
    
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });

    // Particle explosion
    const explosion = this.add.particles(card.x, card.y, 'particle-lightning', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 20
    });

    this.time.delayedCall(1000, () => explosion.destroy());
  }

  private animateCardToBattlefield(card: GameCard) {
    if (!card.container) return;

    const targetX = 200 + (this.player1.battlefield.length - 1) * 70;
    const targetY = 400;

    this.tweens.add({
      targets: card.container,
      x: targetX,
      y: targetY,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 800,
      ease: 'Power2'
    });
  }

  private applyCardEffects(card: GameCard, caster: Player, opponent: Player) {
    // Enhanced visual effects for different card types
    if (card.keywords.includes('Aggressive')) {
      this.createDamageEffect(opponent, 2);
      opponent.health -= 2;
    }
    
    if (card.keywords.includes('Defensive')) {
      this.createHealEffect(caster, 1);
      caster.health += 1;
    }
    
    // Special effects for specific cards
    if (card.name.toLowerCase().includes('lightning')) {
      this.createLightningEffect();
      opponent.health -= 3;
    }
  }

  private createDamageEffect(player: Player, damage: number) {
    const damageText = this.add.text(400, 300, `-${damage}`, {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#e74c3c',
      stroke: '#2c3e50',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: 250,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });
  }

  private createHealEffect(player: Player, heal: number) {
    const healText = this.add.text(400, 300, `+${heal}`, {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      color: '#27ae60',
      stroke: '#2c3e50',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: healText,
      y: 250,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 800,
      ease: 'Power2',
      onComplete: () => healText.destroy()
    });
  }

  private createLightningEffect() {
    // Lightning bolt effect
    const lightning = this.add.graphics();
    lightning.lineStyle(4, 0xf1c40f, 1);
    lightning.beginPath();
    lightning.moveTo(400, 0);
    lightning.lineTo(380, 100);
    lightning.lineTo(420, 200);
    lightning.lineTo(400, 300);
    lightning.strokePath();
    lightning.setDepth(200);

    this.tweens.add({
      targets: lightning,
      alpha: 0,
      duration: 300,
      onComplete: () => lightning.destroy()
    });
  }

  private endTurn() {
    if (this.gamePhase !== 'playing') return;

    // Turn transition effect
    this.createTurnTransitionEffect();

    // Switch players
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    
    if (this.currentPlayer === 1) {
      this.turnNumber++;
      
      // Increase max mana
      if (this.player1.maxMana < 10) this.player1.maxMana++;
      if (this.player2.maxMana < 10) this.player2.maxMana++;
    }

    // Restore mana
    const currentPlayerData = this.currentPlayer === 1 ? this.player1 : this.player2;
    currentPlayerData.mana = currentPlayerData.maxMana;

    // Draw a card
    this.drawCards(currentPlayerData, 1);

    this.updateDisplay();
  }

  private createTurnTransitionEffect() {
    const transition = this.add.rectangle(400, 300, 800, 600, 0x2c3e50, 0.8);
    transition.setDepth(250);

    const turnText = this.add.text(400, 300, `TURN ${this.turnNumber + 1}`, {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#f39c12',
      stroke: '#2c3e50',
      strokeThickness: 4
    }).setOrigin(0.5);
    turnText.setDepth(251);

    this.tweens.add({
      targets: [transition, turnText],
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        transition.destroy();
        turnText.destroy();
      }
    });
  }

  // Mobile-specific methods
  private handleTouchStart(pointer: Phaser.Input.Pointer) {
    this.touchStartPos = { x: pointer.x, y: pointer.y };
  }

  private handleTouchMove(pointer: Phaser.Input.Pointer) {
    if (!this.touchStartPos) return;

    const deltaX = pointer.x - this.touchStartPos.x;
    const deltaY = pointer.y - this.touchStartPos.y;

    // Pan camera on touch move
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      this.cameraController.scrollX -= deltaX * 0.5;
      this.cameraController.scrollY -= deltaY * 0.5;
      this.touchStartPos = { x: pointer.x, y: pointer.y };
    }
  }

  private handleTouchEnd(pointer: Phaser.Input.Pointer) {
    this.touchStartPos = null;
  }

  private handleZoom(delta: number) {
    this.zoomLevel = Phaser.Math.Clamp(this.zoomLevel + (delta > 0 ? -0.1 : 0.1), 0.5, 2);
    this.cameraController.setZoom(this.zoomLevel);
  }

  private startCardDrag(card: GameCard, pointer: Phaser.Input.Pointer) {
    this.draggedCard = card;
    // Visual feedback for drag start
    if (card.container) {
      card.container.setDepth(100);
      this.tweens.add({
        targets: card.container,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200
      });
    }
  }

  private handleCardDrop(card: GameCard, x: number, y: number) {
    // Check if dropped in battlefield
    if (y > 350 && y < 450 && x > 50 && x < 750) {
      this.playCard(card);
    } else {
      // Return to hand
      if (card.container) {
        this.tweens.add({
          targets: card.container,
          x: card.x,
          y: card.y,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Back.easeOut'
        });
      }
    }
    
    this.draggedCard = null;
    this.hideAllDropZoneHighlights();
  }

  private updateDropZoneHighlights(x: number, y: number) {
    // Show/hide drop zone highlights based on drag position
    this.dropZones.forEach(zone => {
      const bounds = zone.getBounds();
      if (Phaser.Geom.Rectangle.Contains(bounds, x, y)) {
        this.showDropZoneHighlight(zone);
      } else {
        this.hideDropZoneHighlight(zone);
      }
    });
  }

  private showDropZoneHighlight(zone: Phaser.GameObjects.Zone) {
    // Add visual highlight to drop zone
    const highlight = this.add.graphics();
    highlight.lineStyle(3, 0x2ecc71, 0.8);
    highlight.strokeRoundedRect(zone.x - zone.width/2, zone.y - zone.height/2, zone.width, zone.height, 15);
    highlight.setName(`highlight_${zone.name}`);
    highlight.setDepth(10);
  }

  private hideDropZoneHighlight(zone: Phaser.GameObjects.Zone) {
    const highlight = this.children.getByName(`highlight_${zone.name}`);
    if (highlight) {
      highlight.destroy();
    }
  }

  private hideAllDropZoneHighlights() {
    this.dropZones.forEach(zone => {
      this.hideDropZoneHighlight(zone);
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

  // Cleanup
  destroy() {
    this.activeTweens.forEach(tween => tween.destroy());
    this.spellEffects.forEach(effect => effect.destroy());
    super.destroy();
  }
}

// Extend window interface
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
  }
}