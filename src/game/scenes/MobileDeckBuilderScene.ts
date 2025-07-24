/**
 * Mobile-Optimized Deck Builder Scene
 * Features:
 * - Touch-friendly interface
 * - Swipe gestures for navigation
 * - Pinch to zoom card preview
 * - Drag and drop deck building
 * - Responsive design for all screen sizes
 */

import Phaser from 'phaser';
import { KONIVRER_CARDS, Card } from '../../data/cards';
import { deckManager, Deck } from '../utils/DeckManager';

interface TouchCard extends Card {
  sprite?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  isSelected: boolean;
  inDeck: number; // Count in current deck
}

export class MobileDeckBuilderScene extends Phaser.Scene {
  private isMobile: boolean = false;
  private currentDeck: Deck;
  private availableCards: TouchCard[] = [];
  private filteredCards: TouchCard[] = [];
  private deckCards: Map<string, number> = new Map();
  
  // UI Containers
  private mainContainer!: Phaser.GameObjects.Container;
  private cardGridContainer!: Phaser.GameObjects.Container;
  private deckContainer!: Phaser.GameObjects.Container;
  private filterContainer!: Phaser.GameObjects.Container;
  private previewContainer!: Phaser.GameObjects.Container;
  
  // Mobile Controls
  private scrollY: number = 0;
  private maxScrollY: number = 0;
  private isScrolling: boolean = false;
  private lastTouchY: number = 0;
  private velocity: number = 0;
  private selectedCardForPreview: TouchCard | null = null;
  
  // Layout Constants
  private readonly CARD_SIZE = this.isMobile ? 50 : 60;
  private readonly CARD_SPACING = this.isMobile ? 60 : 70;
  private readonly CARDS_PER_ROW = this.isMobile ? 6 : 8;
  private readonly GRID_PADDING = 20;
  
  // Touch Gestures
  private pinchStartDistance: number = 0;
  private pinchStartScale: number = 1;
  private currentScale: number = 1;

  constructor() {
    super({ key: 'MobileDeckBuilderScene' });
  }

  init() {
    this.detectMobile();
    this.initializeDeck();
    this.prepareCards();
  }

  preload() {
    // Load all card images
    KONIVRER_CARDS.forEach(card => {
      const imagePath = `/assets/cards/${card.name.toUpperCase()}.png`;
      this.load.image(card.id, imagePath);
    });
    
    // Create mobile-optimized UI assets
    this.createMobileAssets();
  }

  create() {
    this.setupMobileLayout();
    this.createTouchControls();
    this.createFilterInterface();
    this.createCardGrid();
    this.createDeckArea();
    this.createPreviewArea();
    this.updateCardGrid();
  }

  private detectMobile() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   window.innerWidth < 768;
  }

  private initializeDeck() {
    this.currentDeck = deckManager.createDeck('New Mobile Deck', 'Created on mobile device');
  }

  private prepareCards() {
    this.availableCards = KONIVRER_CARDS.map(card => ({
      ...card,
      isSelected: false,
      inDeck: 0
    }));
    this.filteredCards = [...this.availableCards];
  }

  private createMobileAssets() {
    // Mobile-friendly button
    const buttonCanvas = this.add.graphics();
    buttonCanvas.fillGradientStyle(0x3498db, 0x2980b9, 0x3498db, 0x2980b9, 1);
    buttonCanvas.fillRoundedRect(0, 0, this.isMobile ? 100 : 120, this.isMobile ? 50 : 40, 12);
    buttonCanvas.lineStyle(2, 0x2c3e50, 1);
    buttonCanvas.strokeRoundedRect(0, 0, this.isMobile ? 100 : 120, this.isMobile ? 50 : 40, 12);
    buttonCanvas.generateTexture('mobile-button', this.isMobile ? 100 : 120, this.isMobile ? 50 : 40);
    buttonCanvas.destroy();

    // Touch-friendly card background
    const cardBgCanvas = this.add.graphics();
    cardBgCanvas.fillStyle(0x2c3e50, 0.9);
    cardBgCanvas.fillRoundedRect(0, 0, this.CARD_SIZE + 10, (this.CARD_SIZE * 1.4) + 10, 8);
    cardBgCanvas.lineStyle(2, 0x34495e, 1);
    cardBgCanvas.strokeRoundedRect(0, 0, this.CARD_SIZE + 10, (this.CARD_SIZE * 1.4) + 10, 8);
    cardBgCanvas.generateTexture('card-bg-mobile', this.CARD_SIZE + 10, (this.CARD_SIZE * 1.4) + 10);
    cardBgCanvas.destroy();

    // Filter button
    const filterCanvas = this.add.graphics();
    filterCanvas.fillStyle(0x9b59b6, 0.8);
    filterCanvas.fillRoundedRect(0, 0, this.isMobile ? 80 : 100, this.isMobile ? 35 : 30, 8);
    filterCanvas.generateTexture('filter-button', this.isMobile ? 80 : 100, this.isMobile ? 35 : 30);
    filterCanvas.destroy();
  }

  private setupMobileLayout() {
    // Premium gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0c0c0c, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    bg.fillRect(0, 0, 800, 600);

    // Main container for all UI elements
    this.mainContainer = this.add.container(0, 0);
    
    // Header with mobile-friendly design
    this.createMobileHeader();
  }

  private createMobileHeader() {
    const headerBg = this.add.graphics();
    headerBg.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 0.95);
    headerBg.fillRect(0, 0, 800, this.isMobile ? 80 : 60);
    
    const title = this.add.text(400, this.isMobile ? 25 : 20, 'KONIVRER DECK BUILDER', {
      fontSize: this.isMobile ? '20px' : '24px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Mobile navigation buttons
    const backButton = this.add.image(50, this.isMobile ? 40 : 30, 'mobile-button');
    backButton.setDisplaySize(this.isMobile ? 80 : 100, this.isMobile ? 40 : 30);
    backButton.setInteractive({ cursor: 'pointer' });
    
    const backText = this.add.text(50, this.isMobile ? 40 : 30, 'BACK', {
      fontSize: this.isMobile ? '14px' : '12px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);

    const battleButton = this.add.image(750, this.isMobile ? 40 : 30, 'mobile-button');
    battleButton.setDisplaySize(this.isMobile ? 80 : 100, this.isMobile ? 40 : 30);
    battleButton.setInteractive({ cursor: 'pointer' });
    
    const battleText = this.add.text(750, this.isMobile ? 40 : 30, 'BATTLE', {
      fontSize: this.isMobile ? '14px' : '12px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Button interactions
    backButton.on('pointerdown', () => {
      this.createTouchFeedback(backButton);
      this.scene.start('MainMenuScene');
    });

    battleButton.on('pointerdown', () => {
      this.createTouchFeedback(battleButton);
      this.startBattleWithDeck();
    });

    this.mainContainer.add([headerBg, title, backButton, backText, battleButton, battleText]);
  }

  private createTouchControls() {
    // Enable touch scrolling
    this.input.on('pointerdown', this.onTouchStart, this);
    this.input.on('pointermove', this.onTouchMove, this);
    this.input.on('pointerup', this.onTouchEnd, this);

    // Pinch to zoom for card preview
    this.setupPinchZoom();
    
    // Momentum scrolling
    this.setupMomentumScrolling();
  }

  private setupPinchZoom() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const activePointers = this.input.manager.pointers.filter(p => p.isDown);
      if (activePointers.length === 2) {
        const [p1, p2] = activePointers;
        this.pinchStartDistance = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        this.pinchStartScale = this.currentScale;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const activePointers = this.input.manager.pointers.filter(p => p.isDown);
      if (activePointers.length === 2 && this.selectedCardForPreview) {
        const [p1, p2] = activePointers;
        const currentDistance = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        
        if (this.pinchStartDistance > 0) {
          const scale = (currentDistance / this.pinchStartDistance) * this.pinchStartScale;
          this.currentScale = Phaser.Math.Clamp(scale, 0.5, 3);
          
          if (this.previewContainer) {
            this.previewContainer.setScale(this.currentScale);
          }
        }
      }
    });
  }

  private setupMomentumScrolling() {
    // Smooth momentum scrolling for mobile
    this.physics.world.on('worldstep', () => {
      if (!this.isScrolling && Math.abs(this.velocity) > 0.1) {
        this.scrollY += this.velocity;
        this.velocity *= 0.95; // Friction
        
        // Clamp scroll position
        this.scrollY = Phaser.Math.Clamp(this.scrollY, -this.maxScrollY, 0);
        
        if (this.cardGridContainer) {
          this.cardGridContainer.y = this.scrollY + 120;
        }
      }
    });
  }

  private createFilterInterface() {
    const filterY = this.isMobile ? 90 : 70;
    
    this.filterContainer = this.add.container(0, filterY);
    
    // Scrollable filter bar
    const filterBg = this.add.graphics();
    filterBg.fillStyle(0x34495e, 0.8);
    filterBg.fillRect(0, 0, 800, this.isMobile ? 60 : 40);
    
    // Element filters with touch-friendly sizing
    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Aether', 'Nether', 'Chaos'];
    const filterSpacing = this.isMobile ? 90 : 100;
    
    elements.forEach((element, index) => {
      const x = 50 + (index * filterSpacing);
      const button = this.add.image(x, this.isMobile ? 30 : 20, 'filter-button');
      button.setInteractive({ cursor: 'pointer' });
      
      const text = this.add.text(x, this.isMobile ? 30 : 20, element.slice(0, 4), {
        fontSize: this.isMobile ? '12px' : '10px',
        fontFamily: 'Arial Black',
        color: '#ffffff'
      }).setOrigin(0.5);

      // Touch feedback
      button.on('pointerdown', () => {
        this.createTouchFeedback(button);
        this.toggleElementFilter(element, button);
      });

      this.filterContainer.add([button, text]);
    });

    this.filterContainer.add(filterBg);
    this.mainContainer.add(this.filterContainer);
  }

  private createCardGrid() {
    this.cardGridContainer = this.add.container(0, this.isMobile ? 160 : 120);
    this.mainContainer.add(this.cardGridContainer);
  }

  private createDeckArea() {
    const deckY = this.isMobile ? 500 : 480;
    
    this.deckContainer = this.add.container(0, deckY);
    
    // Deck background
    const deckBg = this.add.graphics();
    deckBg.fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71, 0.3);
    deckBg.fillRoundedRect(20, 0, 760, this.isMobile ? 100 : 80, 15);
    deckBg.lineStyle(2, 0x2ecc71, 0.8);
    deckBg.strokeRoundedRect(20, 0, 760, this.isMobile ? 100 : 80, 15);
    
    const deckTitle = this.add.text(400, this.isMobile ? 20 : 15, 'CURRENT DECK (0/30)', {
      fontSize: this.isMobile ? '16px' : '14px',
      fontFamily: 'Arial Black',
      color: '#2ecc71'
    }).setOrigin(0.5);

    // Deck action buttons
    const saveButton = this.add.image(150, this.isMobile ? 50 : 40, 'mobile-button');
    saveButton.setDisplaySize(this.isMobile ? 80 : 100, this.isMobile ? 35 : 30);
    saveButton.setInteractive({ cursor: 'pointer' });
    
    const saveText = this.add.text(150, this.isMobile ? 50 : 40, 'SAVE', {
      fontSize: this.isMobile ? '12px' : '10px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);

    const clearButton = this.add.image(650, this.isMobile ? 50 : 40, 'mobile-button');
    clearButton.setDisplaySize(this.isMobile ? 80 : 100, this.isMobile ? 35 : 30);
    clearButton.setInteractive({ cursor: 'pointer' });
    
    const clearText = this.add.text(650, this.isMobile ? 50 : 40, 'CLEAR', {
      fontSize: this.isMobile ? '12px' : '10px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Button interactions
    saveButton.on('pointerdown', () => {
      this.createTouchFeedback(saveButton);
      this.saveDeck();
    });

    clearButton.on('pointerdown', () => {
      this.createTouchFeedback(clearButton);
      this.clearDeck();
    });

    this.deckContainer.add([deckBg, deckTitle, saveButton, saveText, clearButton, clearText]);
    this.mainContainer.add(this.deckContainer);
  }

  private createPreviewArea() {
    this.previewContainer = this.add.container(400, 300);
    this.previewContainer.setDepth(200);
    this.previewContainer.setVisible(false);
    
    // Preview background with mobile-friendly size
    const previewBg = this.add.graphics();
    const previewWidth = this.isMobile ? 280 : 320;
    const previewHeight = this.isMobile ? 400 : 450;
    
    previewBg.fillStyle(0x2c3e50, 0.98);
    previewBg.fillRoundedRect(-previewWidth/2, -previewHeight/2, previewWidth, previewHeight, 20);
    previewBg.lineStyle(3, 0x3498db, 1);
    previewBg.strokeRoundedRect(-previewWidth/2, -previewHeight/2, previewWidth, previewHeight, 20);

    // Close button for preview
    const closePreview = this.add.image(previewWidth/2 - 30, -previewHeight/2 + 30, 'mobile-button');
    closePreview.setDisplaySize(50, 30);
    closePreview.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(previewWidth/2 - 30, -previewHeight/2 + 30, 'X', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#e74c3c'
    }).setOrigin(0.5);

    closePreview.on('pointerdown', () => {
      this.hideCardPreview();
    });

    this.previewContainer.add([previewBg, closePreview, closeText]);
    this.add.existing(this.previewContainer);
  }

  private updateCardGrid() {
    // Clear existing cards
    this.cardGridContainer.removeAll(true);
    
    // Calculate grid layout
    const startX = this.GRID_PADDING + this.CARD_SIZE/2;
    const startY = this.GRID_PADDING + this.CARD_SIZE/2;
    
    this.filteredCards.forEach((card, index) => {
      const row = Math.floor(index / this.CARDS_PER_ROW);
      const col = index % this.CARDS_PER_ROW;
      const x = startX + (col * this.CARD_SPACING);
      const y = startY + (row * this.CARD_SPACING);
      
      this.createCardElement(card, x, y);
    });
    
    // Update scroll limits
    const totalRows = Math.ceil(this.filteredCards.length / this.CARDS_PER_ROW);
    this.maxScrollY = Math.max(0, (totalRows * this.CARD_SPACING) - 300);
  }

  private createCardElement(card: TouchCard, x: number, y: number) {
    const cardContainer = this.add.container(x, y);
    card.container = cardContainer;
    
    // Card background
    const cardBg = this.add.image(0, 0, 'card-bg-mobile');
    
    // Card image
    const cardImage = this.add.image(0, 0, card.id);
    cardImage.setDisplaySize(this.CARD_SIZE, this.CARD_SIZE * 1.4);
    cardImage.setInteractive({ cursor: 'pointer' });
    
    // Deck count indicator
    if (card.inDeck > 0) {
      const countBg = this.add.circle(this.CARD_SIZE/2 - 10, -this.CARD_SIZE/2 + 10, 12, 0xe74c3c);
      const countText = this.add.text(this.CARD_SIZE/2 - 10, -this.CARD_SIZE/2 + 10, card.inDeck.toString(), {
        fontSize: '12px',
        fontFamily: 'Arial Black',
        color: '#ffffff'
      }).setOrigin(0.5);
      
      cardContainer.add([countBg, countText]);
    }
    
    // Cost indicator
    const costBg = this.add.circle(-this.CARD_SIZE/2 + 10, -this.CARD_SIZE/2 + 10, 12, 0x3498db);
    const costText = this.add.text(-this.CARD_SIZE/2 + 10, -this.CARD_SIZE/2 + 10, card.cost.toString(), {
      fontSize: '12px',
      fontFamily: 'Arial Black',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    cardContainer.add([cardBg, cardImage, costBg, costText]);
    
    // Touch interactions
    cardImage.on('pointerdown', () => {
      this.handleCardTouch(card);
    });
    
    // Long press for preview
    let pressTimer: Phaser.Time.TimerEvent;
    cardImage.on('pointerdown', () => {
      pressTimer = this.time.delayedCall(500, () => {
        this.showCardPreview(card);
      });
    });
    
    cardImage.on('pointerup', () => {
      if (pressTimer) {
        pressTimer.destroy();
      }
    });
    
    this.cardGridContainer.add(cardContainer);
  }

  private handleCardTouch(card: TouchCard) {
    this.createTouchFeedback(card.container!);
    
    const currentCount = this.deckCards.get(card.id) || 0;
    const totalCards = Array.from(this.deckCards.values()).reduce((sum, count) => sum + count, 0);
    
    // Add to deck
    if (totalCards < 30 && currentCount < 3) {
      this.deckCards.set(card.id, currentCount + 1);
      card.inDeck = currentCount + 1;
      this.updateCardGrid();
      this.updateDeckDisplay();
      this.showToast(`Added ${card.name} to deck`);
    } else if (totalCards >= 30) {
      this.showToast('Deck is full (30 cards maximum)');
    } else {
      this.showToast('Maximum 3 copies per card');
    }
  }

  private showCardPreview(card: TouchCard) {
    this.selectedCardForPreview = card;
    this.previewContainer.removeAll(true);
    
    // Recreate preview with card details
    const previewWidth = this.isMobile ? 280 : 320;
    const previewHeight = this.isMobile ? 400 : 450;
    
    const previewBg = this.add.graphics();
    previewBg.fillStyle(0x2c3e50, 0.98);
    previewBg.fillRoundedRect(-previewWidth/2, -previewHeight/2, previewWidth, previewHeight, 20);
    previewBg.lineStyle(3, 0x3498db, 1);
    previewBg.strokeRoundedRect(-previewWidth/2, -previewHeight/2, previewWidth, previewHeight, 20);
    
    // Large card image
    const cardImage = this.add.image(0, -50, card.id);
    cardImage.setDisplaySize(150, 210);
    
    // Card details
    const nameText = this.add.text(0, 100, card.name, {
      fontSize: this.isMobile ? '18px' : '20px',
      fontFamily: 'Arial Black',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);
    
    const typeText = this.add.text(0, 130, `${card.type} - ${card.rarity}`, {
      fontSize: this.isMobile ? '14px' : '16px',
      color: '#f39c12'
    }).setOrigin(0.5);
    
    const elementsText = this.add.text(0, 150, `Elements: ${card.elements.join(', ')}`, {
      fontSize: this.isMobile ? '12px' : '14px',
      color: '#2ecc71'
    }).setOrigin(0.5);
    
    const descText = this.add.text(0, 180, card.description, {
      fontSize: this.isMobile ? '10px' : '12px',
      color: '#bdc3c7',
      wordWrap: { width: previewWidth - 40 },
      align: 'center'
    }).setOrigin(0.5);
    
    // Close button
    const closeButton = this.add.image(previewWidth/2 - 30, -previewHeight/2 + 30, 'mobile-button');
    closeButton.setDisplaySize(50, 30);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(previewWidth/2 - 30, -previewHeight/2 + 30, 'X', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#e74c3c'
    }).setOrigin(0.5);
    
    closeButton.on('pointerdown', () => {
      this.hideCardPreview();
    });
    
    this.previewContainer.add([previewBg, cardImage, nameText, typeText, elementsText, descText, closeButton, closeText]);
    this.previewContainer.setVisible(true);
    this.currentScale = 1;
    
    // Animate preview appearance
    this.previewContainer.setScale(0);
    this.tweens.add({
      targets: this.previewContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  private hideCardPreview() {
    this.tweens.add({
      targets: this.previewContainer,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.previewContainer.setVisible(false);
        this.selectedCardForPreview = null;
      }
    });
  }

  private createTouchFeedback(target: Phaser.GameObjects.GameObject) {
    // Visual feedback for touch
    this.tweens.add({
      targets: target,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  private showToast(message: string) {
    const toast = this.add.container(400, 550);
    
    const toastBg = this.add.graphics();
    toastBg.fillStyle(0x2c3e50, 0.9);
    toastBg.fillRoundedRect(-100, -15, 200, 30, 15);
    
    const toastText = this.add.text(0, 0, message, {
      fontSize: this.isMobile ? '12px' : '14px',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);
    
    toast.add([toastBg, toastText]);
    toast.setDepth(300);
    
    // Animate toast
    toast.setAlpha(0);
    this.tweens.add({
      targets: toast,
      alpha: 1,
      duration: 200,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: toast,
            alpha: 0,
            duration: 200,
            onComplete: () => toast.destroy()
          });
        });
      }
    });
  }

  // Touch event handlers
  private onTouchStart(pointer: Phaser.Input.Pointer) {
    this.isScrolling = true;
    this.lastTouchY = pointer.y;
    this.velocity = 0;
  }

  private onTouchMove(pointer: Phaser.Input.Pointer) {
    if (!this.isScrolling) return;
    
    const deltaY = pointer.y - this.lastTouchY;
    this.scrollY += deltaY;
    this.velocity = deltaY;
    
    // Clamp scroll position
    this.scrollY = Phaser.Math.Clamp(this.scrollY, -this.maxScrollY, 0);
    
    if (this.cardGridContainer) {
      this.cardGridContainer.y = this.scrollY + (this.isMobile ? 160 : 120);
    }
    
    this.lastTouchY = pointer.y;
  }

  private onTouchEnd(pointer: Phaser.Input.Pointer) {
    this.isScrolling = false;
  }

  private toggleElementFilter(element: string, button: Phaser.GameObjects.Image) {
    // Toggle filter logic
    button.setTint(button.tint === 0xffffff ? 0x666666 : 0xffffff);
    this.applyFilters();
  }

  private applyFilters() {
    // Apply current filters to card list
    this.updateCardGrid();
  }

  private updateDeckDisplay() {
    const totalCards = Array.from(this.deckCards.values()).reduce((sum, count) => sum + count, 0);
    
    // Update deck title
    const deckTitle = this.deckContainer.list.find(child => child.type === 'Text') as Phaser.GameObjects.Text;
    if (deckTitle) {
      deckTitle.setText(`CURRENT DECK (${totalCards}/30)`);
    }
  }

  private saveDeck() {
    // Convert deck cards to array
    const deckArray: Card[] = [];
    this.deckCards.forEach((count, cardId) => {
      const card = KONIVRER_CARDS.find(c => c.id === cardId);
      if (card) {
        for (let i = 0; i < count; i++) {
          deckArray.push(card);
        }
      }
    });

    this.currentDeck.cards = deckArray;
    deckManager.saveDeck(this.currentDeck);
    this.showToast('Deck saved successfully!');
  }

  private clearDeck() {
    this.deckCards.clear();
    this.availableCards.forEach(card => {
      card.inDeck = 0;
    });
    this.updateCardGrid();
    this.updateDeckDisplay();
    this.showToast('Deck cleared');
  }

  private startBattleWithDeck() {
    const totalCards = Array.from(this.deckCards.values()).reduce((sum, count) => sum + count, 0);
    
    if (totalCards < 20) {
      this.showToast('Deck must have at least 20 cards to battle');
      return;
    }

    // Store deck for battle scene
    const deckArray: Card[] = [];
    this.deckCards.forEach((count, cardId) => {
      const card = KONIVRER_CARDS.find(c => c.id === cardId);
      if (card) {
        for (let i = 0; i < count; i++) {
          deckArray.push(card);
        }
      }
    });

    this.registry.set('playerDeck', deckArray);
    this.scene.start('PremiumCardBattleScene');
  }
}