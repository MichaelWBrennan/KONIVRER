/**
 * Deck Builder Scene with KONIVRER Integration
 * Features:
 * - Full card database browsing
 * - Advanced search and filtering
 * - Deck creation and editing
 * - Deck import/export
 * - Deck sharing and copying
 */

import Phaser from 'phaser';
import { KONIVRER_CARDS, Card } from '../../data/cards';

interface Deck {
  id: string;
  name: string;
  description: string;
  author: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

interface SearchFilters {
  name: string;
  elements: string[];
  types: string[];
  rarities: string[];
  costMin: number;
  costMax: number;
  keywords: string[];
}

export class DeckBuilderScene extends Phaser.Scene {
  private currentDeck: Deck;
  private availableCards: Card[] = [];
  private filteredCards: Card[] = [];
  private searchFilters: SearchFilters;
  private selectedCard: Card | null = null;
  private deckCards: Map<string, number> = new Map(); // cardId -> count
  
  // UI Elements
  private deckNameText!: Phaser.GameObjects.Text;
  private deckCountText!: Phaser.GameObjects.Text;
  private searchInput!: HTMLInputElement;
  private cardGrid: Phaser.GameObjects.Image[] = [];
  private deckList: Phaser.GameObjects.Container[] = [];
  
  // Layout constants
  private readonly CARD_SIZE = 60;
  private readonly CARD_SPACING = 70;
  private readonly CARDS_PER_ROW = 8;
  private readonly GRID_START_X = 80;
  private readonly GRID_START_Y = 150;
  private readonly DECK_AREA_X = 600;
  private readonly DECK_AREA_Y = 150;

  constructor() {
    super({ key: 'DeckBuilderScene' });
  }

  init() {
    this.availableCards = [...KONIVRER_CARDS];
    this.filteredCards = [...KONIVRER_CARDS];
    this.searchFilters = {
      name: '',
      elements: [],
      types: [],
      rarities: [],
      costMin: 0,
      costMax: 10,
      keywords: []
    };
    
    this.currentDeck = {
      id: 'new-deck',
      name: 'New Deck',
      description: 'A custom deck',
      author: 'Player',
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      tags: []
    };
  }

  preload() {
    // Load all card images
    KONIVRER_CARDS.forEach(card => {
      const imagePath = `/assets/cards/${card.name.toUpperCase()}.png`;
      this.load.image(card.id, imagePath);
    });
  }

  create() {
    this.createBackground();
    this.createHeader();
    this.createSearchInterface();
    this.createCardGrid();
    this.createDeckArea();
    this.createFilterPanel();
    this.createActionButtons();
    
    this.updateCardGrid();
    this.updateDeckDisplay();
  }

  private createBackground() {
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
    
    // Create sections
    this.add.rectangle(300, 300, 580, 580, 0x2d3436, 0.3); // Card browser area
    this.add.rectangle(650, 300, 280, 580, 0x636e72, 0.3); // Deck area
  }

  private createHeader() {
    this.add.text(400, 30, 'KONIVRER Deck Builder', {
      fontSize: '24px',
      color: '#ffe66d',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Close button
    const closeButton = this.add.rectangle(750, 30, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(750, 30, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    closeButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });

    // Battle button
    const battleButton = this.add.rectangle(650, 30, 80, 30, 0x45b7d1);
    battleButton.setInteractive({ cursor: 'pointer' });
    
    const battleText = this.add.text(650, 30, 'Battle', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    battleButton.on('pointerdown', () => {
      this.startBattleWithDeck();
    });
  }

  private createSearchInterface() {
    // Search label
    this.add.text(50, 70, 'Search Cards:', {
      fontSize: '16px',
      color: '#ffffff'
    });

    // Create HTML input for search
    const searchContainer = this.add.dom(200, 70);
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Enter card name...';
    this.searchInput.style.width = '200px';
    this.searchInput.style.height = '25px';
    this.searchInput.style.fontSize = '14px';
    this.searchInput.style.padding = '5px';
    this.searchInput.style.border = '1px solid #ccc';
    this.searchInput.style.borderRadius = '4px';
    
    this.searchInput.addEventListener('input', () => {
      this.searchFilters.name = this.searchInput.value;
      this.applyFilters();
    });

    searchContainer.setElement(this.searchInput);

    // Card count display
    this.add.text(450, 70, 'Cards Found:', {
      fontSize: '14px',
      color: '#cccccc'
    });
  }

  private createFilterPanel() {
    const filterY = 100;
    
    // Element filters
    this.add.text(50, filterY, 'Elements:', {
      fontSize: '14px',
      color: '#ffffff'
    });

    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Aether', 'Nether', 'Chaos'];
    elements.forEach((element, index) => {
      const x = 120 + (index * 60);
      const button = this.add.rectangle(x, filterY, 50, 20, 0x45b7d1, 0.5);
      button.setInteractive({ cursor: 'pointer' });
      
      const text = this.add.text(x, filterY, element.slice(0, 3), {
        fontSize: '10px',
        color: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.toggleElementFilter(element, button);
      });
    });

    // Type filters
    this.add.text(50, filterY + 30, 'Types:', {
      fontSize: '14px',
      color: '#ffffff'
    });

    const types = ['Familiar', 'Flag'];
    types.forEach((type, index) => {
      const x = 120 + (index * 80);
      const button = this.add.rectangle(x, filterY + 30, 70, 20, 0x96ceb4, 0.5);
      button.setInteractive({ cursor: 'pointer' });
      
      const text = this.add.text(x, filterY + 30, type, {
        fontSize: '12px',
        color: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.toggleTypeFilter(type, button);
      });
    });

    // Rarity filters
    this.add.text(300, filterY + 30, 'Rarity:', {
      fontSize: '14px',
      color: '#ffffff'
    });

    const rarities = ['Common', 'Uncommon', 'Rare'];
    rarities.forEach((rarity, index) => {
      const x = 370 + (index * 70);
      const button = this.add.rectangle(x, filterY + 30, 60, 20, 0xfeca57, 0.5);
      button.setInteractive({ cursor: 'pointer' });
      
      const text = this.add.text(x, filterY + 30, rarity.slice(0, 4), {
        fontSize: '10px',
        color: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.toggleRarityFilter(rarity, button);
      });
    });
  }

  private createCardGrid() {
    // Grid will be populated by updateCardGrid()
  }

  private createDeckArea() {
    this.add.text(650, 70, 'Current Deck', {
      fontSize: '18px',
      color: '#ffe66d',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Deck name input
    this.deckNameText = this.add.text(650, 100, this.currentDeck.name, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Deck count
    this.deckCountText = this.add.text(650, 120, '0/30 cards', {
      fontSize: '14px',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Deck list area
    this.add.rectangle(650, 300, 260, 300, 0x2d3436, 0.5);
  }

  private createActionButtons() {
    const buttonY = 550;
    
    // Save Deck
    const saveButton = this.add.rectangle(550, buttonY, 80, 30, 0x96ceb4);
    saveButton.setInteractive({ cursor: 'pointer' });
    
    const saveText = this.add.text(550, buttonY, 'Save', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    saveButton.on('pointerdown', () => {
      this.saveDeck();
    });

    // Load Deck
    const loadButton = this.add.rectangle(650, buttonY, 80, 30, 0x45b7d1);
    loadButton.setInteractive({ cursor: 'pointer' });
    
    const loadText = this.add.text(650, buttonY, 'Load', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    loadButton.on('pointerdown', () => {
      this.showDeckLibrary();
    });

    // Clear Deck
    const clearButton = this.add.rectangle(750, buttonY, 80, 30, 0xff6b6b);
    clearButton.setInteractive({ cursor: 'pointer' });
    
    const clearText = this.add.text(750, buttonY, 'Clear', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    clearButton.on('pointerdown', () => {
      this.clearDeck();
    });

    // Export/Import buttons
    const exportButton = this.add.rectangle(580, 520, 60, 25, 0xfeca57);
    exportButton.setInteractive({ cursor: 'pointer' });
    
    const exportText = this.add.text(580, 520, 'Export', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    exportButton.on('pointerdown', () => {
      this.exportDeck();
    });

    const importButton = this.add.rectangle(650, 520, 60, 25, 0xfeca57);
    importButton.setInteractive({ cursor: 'pointer' });
    
    const importText = this.add.text(650, 520, 'Import', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    importButton.on('pointerdown', () => {
      this.importDeck();
    });
  }

  private updateCardGrid() {
    // Clear existing grid
    this.cardGrid.forEach(sprite => sprite.destroy());
    this.cardGrid = [];

    // Display filtered cards
    const maxCards = 24; // Limit for performance
    const cardsToShow = this.filteredCards.slice(0, maxCards);

    cardsToShow.forEach((card, index) => {
      const row = Math.floor(index / this.CARDS_PER_ROW);
      const col = index % this.CARDS_PER_ROW;
      const x = this.GRID_START_X + (col * this.CARD_SPACING);
      const y = this.GRID_START_Y + (row * this.CARD_SPACING);

      const cardSprite = this.add.image(x, y, card.id);
      cardSprite.setDisplaySize(this.CARD_SIZE, this.CARD_SIZE * 1.4);
      cardSprite.setInteractive({ cursor: 'pointer' });

      // Add to grid array
      this.cardGrid.push(cardSprite);

      // Hover effects
      cardSprite.on('pointerover', () => {
        cardSprite.setScale(1.1);
        this.showCardDetails(card, x + 100, y);
      });

      cardSprite.on('pointerout', () => {
        cardSprite.setScale(1.0);
        this.hideCardDetails();
      });

      // Click to add to deck
      cardSprite.on('pointerdown', () => {
        this.addCardToDeck(card);
      });
    });

    // Update card count
    this.add.text(520, 70, `${this.filteredCards.length}`, {
      fontSize: '14px',
      color: '#4ecdc4'
    });
  }

  private showCardDetails(card: Card, x: number, y: number) {
    // Create detailed card info panel
    const panel = this.add.rectangle(x, y, 200, 150, 0x000000, 0.9);
    panel.setName('card-details');

    const nameText = this.add.text(x, y - 60, card.name, {
      fontSize: '14px',
      color: '#ffe66d',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    nameText.setName('card-details');

    const costText = this.add.text(x, y - 40, `Cost: ${card.cost}`, {
      fontSize: '12px',
      color: '#4ecdc4'
    }).setOrigin(0.5);
    costText.setName('card-details');

    const typeText = this.add.text(x, y - 20, `${card.type} - ${card.rarity}`, {
      fontSize: '12px',
      color: '#96ceb4'
    }).setOrigin(0.5);
    typeText.setName('card-details');

    const elementsText = this.add.text(x, y, `Elements: ${card.elements.join(', ')}`, {
      fontSize: '10px',
      color: '#ffffff'
    }).setOrigin(0.5);
    elementsText.setName('card-details');

    if (card.strength) {
      const strengthText = this.add.text(x, y + 20, `Strength: ${card.strength}`, {
        fontSize: '10px',
        color: '#ff6b6b'
      }).setOrigin(0.5);
      strengthText.setName('card-details');
    }

    const descText = this.add.text(x, y + 40, card.description, {
      fontSize: '9px',
      color: '#cccccc',
      wordWrap: { width: 180 }
    }).setOrigin(0.5);
    descText.setName('card-details');

    // Show count in deck
    const countInDeck = this.deckCards.get(card.id) || 0;
    if (countInDeck > 0) {
      const countText = this.add.text(x, y + 60, `In deck: ${countInDeck}`, {
        fontSize: '10px',
        color: '#ffe66d'
      }).setOrigin(0.5);
      countText.setName('card-details');
    }
  }

  private hideCardDetails() {
    this.children.list.filter(child => child.name === 'card-details').forEach(child => {
      child.destroy();
    });
  }

  private addCardToDeck(card: Card) {
    const currentCount = this.deckCards.get(card.id) || 0;
    const totalCards = Array.from(this.deckCards.values()).reduce((sum, count) => sum + count, 0);

    // Check deck limits
    if (totalCards >= 30) {
      this.showMessage('Deck is full (30 cards maximum)');
      return;
    }

    if (currentCount >= 3) {
      this.showMessage('Maximum 3 copies of each card allowed');
      return;
    }

    // Add card to deck
    this.deckCards.set(card.id, currentCount + 1);
    this.updateDeckDisplay();
    this.showMessage(`Added ${card.name} to deck`);
  }

  private removeCardFromDeck(card: Card) {
    const currentCount = this.deckCards.get(card.id) || 0;
    
    if (currentCount > 1) {
      this.deckCards.set(card.id, currentCount - 1);
    } else {
      this.deckCards.delete(card.id);
    }
    
    this.updateDeckDisplay();
  }

  private updateDeckDisplay() {
    // Clear existing deck list
    this.deckList.forEach(container => container.destroy());
    this.deckList = [];

    // Update deck count
    const totalCards = Array.from(this.deckCards.values()).reduce((sum, count) => sum + count, 0);
    this.deckCountText.setText(`${totalCards}/30 cards`);

    // Display deck cards
    let yOffset = 0;
    this.deckCards.forEach((count, cardId) => {
      const card = KONIVRER_CARDS.find(c => c.id === cardId);
      if (!card) return;

      const container = this.add.container(this.DECK_AREA_X, this.DECK_AREA_Y + yOffset);
      
      // Card mini image
      const cardImage = this.add.image(-80, 0, card.id);
      cardImage.setDisplaySize(30, 42);
      container.add(cardImage);

      // Card name and count
      const nameText = this.add.text(-40, -5, `${card.name} x${count}`, {
        fontSize: '12px',
        color: '#ffffff'
      });
      container.add(nameText);

      // Cost
      const costText = this.add.text(60, -5, `${card.cost}`, {
        fontSize: '12px',
        color: '#4ecdc4'
      });
      container.add(costText);

      // Remove button
      const removeButton = this.add.rectangle(80, 0, 20, 20, 0xff6b6b);
      removeButton.setInteractive({ cursor: 'pointer' });
      removeButton.on('pointerdown', () => {
        this.removeCardFromDeck(card);
      });
      container.add(removeButton);

      const removeText = this.add.text(80, 0, '-', {
        fontSize: '14px',
        color: '#ffffff'
      }).setOrigin(0.5);
      container.add(removeText);

      this.deckList.push(container);
      yOffset += 25;
    });
  }

  private applyFilters() {
    this.filteredCards = this.availableCards.filter(card => {
      // Name filter
      if (this.searchFilters.name && 
          !card.name.toLowerCase().includes(this.searchFilters.name.toLowerCase())) {
        return false;
      }

      // Element filter
      if (this.searchFilters.elements.length > 0 &&
          !this.searchFilters.elements.some(element => card.elements.includes(element))) {
        return false;
      }

      // Type filter
      if (this.searchFilters.types.length > 0 &&
          !this.searchFilters.types.includes(card.type)) {
        return false;
      }

      // Rarity filter
      if (this.searchFilters.rarities.length > 0 &&
          !this.searchFilters.rarities.includes(card.rarity)) {
        return false;
      }

      // Cost filter
      if (card.cost < this.searchFilters.costMin || card.cost > this.searchFilters.costMax) {
        return false;
      }

      return true;
    });

    this.updateCardGrid();
  }

  private toggleElementFilter(element: string, button: Phaser.GameObjects.Rectangle) {
    const index = this.searchFilters.elements.indexOf(element);
    if (index > -1) {
      this.searchFilters.elements.splice(index, 1);
      button.setAlpha(0.5);
    } else {
      this.searchFilters.elements.push(element);
      button.setAlpha(1.0);
    }
    this.applyFilters();
  }

  private toggleTypeFilter(type: string, button: Phaser.GameObjects.Rectangle) {
    const index = this.searchFilters.types.indexOf(type);
    if (index > -1) {
      this.searchFilters.types.splice(index, 1);
      button.setAlpha(0.5);
    } else {
      this.searchFilters.types.push(type);
      button.setAlpha(1.0);
    }
    this.applyFilters();
  }

  private toggleRarityFilter(rarity: string, button: Phaser.GameObjects.Rectangle) {
    const index = this.searchFilters.rarities.indexOf(rarity);
    if (index > -1) {
      this.searchFilters.rarities.splice(index, 1);
      button.setAlpha(0.5);
    } else {
      this.searchFilters.rarities.push(rarity);
      button.setAlpha(1.0);
    }
    this.applyFilters();
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
    this.currentDeck.updatedAt = new Date();

    // Save to localStorage
    const savedDecks = JSON.parse(localStorage.getItem('konivrer-decks') || '[]');
    const existingIndex = savedDecks.findIndex((deck: Deck) => deck.id === this.currentDeck.id);
    
    if (existingIndex > -1) {
      savedDecks[existingIndex] = this.currentDeck;
    } else {
      savedDecks.push(this.currentDeck);
    }
    
    localStorage.setItem('konivrer-decks', JSON.stringify(savedDecks));
    this.showMessage('Deck saved successfully!');
  }

  private showDeckLibrary() {
    // Load saved decks from localStorage
    const savedDecks = JSON.parse(localStorage.getItem('konivrer-decks') || '[]');
    
    // Create deck library overlay
    const overlay = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9);
    overlay.setName('deck-library');
    
    const title = this.add.text(400, 150, 'Deck Library', {
      fontSize: '20px',
      color: '#ffe66d',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setName('deck-library');

    // Display saved decks
    savedDecks.forEach((deck: Deck, index: number) => {
      const y = 200 + (index * 40);
      
      const deckButton = this.add.rectangle(400, y, 500, 35, 0x45b7d1);
      deckButton.setInteractive({ cursor: 'pointer' });
      deckButton.setName('deck-library');
      
      const deckText = this.add.text(400, y, `${deck.name} (${deck.cards.length} cards)`, {
        fontSize: '14px',
        color: '#ffffff'
      }).setOrigin(0.5);
      deckText.setName('deck-library');

      deckButton.on('pointerdown', () => {
        this.loadDeck(deck);
        this.closeDeckLibrary();
      });
    });

    // Close button
    const closeButton = this.add.rectangle(550, 170, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.setName('deck-library');
    
    const closeText = this.add.text(550, 170, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    closeText.setName('deck-library');

    closeButton.on('pointerdown', () => {
      this.closeDeckLibrary();
    });
  }

  private closeDeckLibrary() {
    this.children.list.filter(child => child.name === 'deck-library').forEach(child => {
      child.destroy();
    });
  }

  private loadDeck(deck: Deck) {
    this.currentDeck = { ...deck };
    this.deckCards.clear();
    
    // Count cards in deck
    deck.cards.forEach(card => {
      const currentCount = this.deckCards.get(card.id) || 0;
      this.deckCards.set(card.id, currentCount + 1);
    });
    
    this.updateDeckDisplay();
    this.deckNameText.setText(deck.name);
    this.showMessage(`Loaded deck: ${deck.name}`);
  }

  private clearDeck() {
    this.deckCards.clear();
    this.updateDeckDisplay();
    this.showMessage('Deck cleared');
  }

  private exportDeck() {
    const deckData = {
      ...this.currentDeck,
      cards: Array.from(this.deckCards.entries()).map(([cardId, count]) => ({
        cardId,
        count
      }))
    };
    
    const exportString = JSON.stringify(deckData, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(exportString).then(() => {
      this.showMessage('Deck exported to clipboard!');
    }).catch(() => {
      this.showMessage('Export failed - check console');
      console.log('Deck Export:', exportString);
    });
  }

  private importDeck() {
    // This would show an import dialog
    // For now, show a simple prompt
    const importData = prompt('Paste deck data:');
    if (!importData) return;
    
    try {
      const deckData = JSON.parse(importData);
      this.currentDeck = { ...deckData };
      this.deckCards.clear();
      
      deckData.cards.forEach((entry: { cardId: string, count: number }) => {
        this.deckCards.set(entry.cardId, entry.count);
      });
      
      this.updateDeckDisplay();
      this.deckNameText.setText(this.currentDeck.name);
      this.showMessage('Deck imported successfully!');
    } catch (error) {
      this.showMessage('Invalid deck data');
    }
  }

  private startBattleWithDeck() {
    // Pass current deck to battle scene
    const deckArray: Card[] = [];
    this.deckCards.forEach((count, cardId) => {
      const card = KONIVRER_CARDS.find(c => c.id === cardId);
      if (card) {
        for (let i = 0; i < count; i++) {
          deckArray.push(card);
        }
      }
    });

    if (deckArray.length < 20) {
      this.showMessage('Deck must have at least 20 cards to battle');
      return;
    }

    // Store deck for battle scene
    this.registry.set('playerDeck', deckArray);
    this.scene.start('EnhancedCardBattleScene');
  }

  private showMessage(message: string) {
    const messageText = this.add.text(400, 580, message, {
      fontSize: '14px',
      color: '#ffe66d',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      messageText.destroy();
    });
  }
}