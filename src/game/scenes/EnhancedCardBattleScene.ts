/**
 * Enhanced Card Battle Scene with KONIVRER Database Integration
 * Features:
 * - Real KONIVRER card art and data
 * - Integrated card search and deck builder
 * - Deck import/export functionality
 * - Advanced game mechanics
 */

import Phaser from 'phaser';
import { KONIVRER_CARDS, Card } from '../../data/cards';

interface GameCard extends Card {
  gameId: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Image;
  isPlayable: boolean;
  isHovered: boolean;
}

interface Player {
  health: number;
  mana: number;
  maxMana: number;
  hand: GameCard[];
  deck: GameCard[];
  battlefield: GameCard[];
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
  description?: string;
  author?: string;
}

export class EnhancedCardBattleScene extends Phaser.Scene {
  private player1!: Player;
  private player2!: Player;
  private currentPlayer: 1 | 2 = 1;
  private turnNumber: number = 1;
  private selectedCard: GameCard | null = null;
  private gamePhase: 'setup' | 'playing' | 'ended' = 'setup';
  
  // UI Elements
  private healthText1!: Phaser.GameObjects.Text;
  private healthText2!: Phaser.GameObjects.Text;
  private manaText1!: Phaser.GameObjects.Text;
  private manaText2!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private endTurnButton!: Phaser.GameObjects.Rectangle;
  private endTurnButtonText!: Phaser.GameObjects.Text;
  private deckBuilderButton!: Phaser.GameObjects.Rectangle;
  private deckBuilderButtonText!: Phaser.GameObjects.Text;
  private searchButton!: Phaser.GameObjects.Rectangle;
  private searchButtonText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Rectangle;
  private closeButtonText!: Phaser.GameObjects.Text;
  
  // Game Areas
  private handArea!: Phaser.GameObjects.Rectangle;
  private battlefieldArea!: Phaser.GameObjects.Rectangle;
  private enemyHandArea!: Phaser.GameObjects.Rectangle;
  private enemyBattlefieldArea!: Phaser.GameObjects.Rectangle;
  
  // Deck and Search Integration
  private availableDecks: Deck[] = [];
  private currentDeck: Deck | null = null;
  private showDeckBuilder: boolean = false;
  private showCardSearch: boolean = false;

  constructor() {
    super({ key: 'EnhancedCardBattleScene' });
  }

  preload() {
    // Load card images from the KONIVRER database
    KONIVRER_CARDS.forEach(card => {
      const imagePath = `/assets/cards/${card.name.toUpperCase()}.png`;
      this.load.image(card.id, imagePath);
    });
    
    // Load UI elements
    this.load.image('card-back', '/assets/cards/card-back.png');
    this.load.image('battlefield-bg', '/assets/ui/battlefield.png');
  }

  create() {
    this.setupGame();
    this.createUI();
    this.createGameAreas();
    this.initializePlayers();
    this.startGame();
  }

  private setupGame() {
    // Initialize available decks (this would normally come from a database)
    this.availableDecks = this.generateSampleDecks();
    this.currentDeck = this.availableDecks[0]; // Default deck
  }

  private generateSampleDecks(): Deck[] {
    const fireElementalDeck: Deck = {
      id: 'fire-elemental',
      name: 'Fire Elemental Deck',
      description: 'Aggressive fire-based strategy',
      author: 'KONIVRER Team',
      cards: KONIVRER_CARDS.filter(card => 
        card.elements.includes('Fire') || card.name.toLowerCase().includes('fire')
      ).slice(0, 30)
    };

    const waterControlDeck: Deck = {
      id: 'water-control',
      name: 'Water Control Deck',
      description: 'Defensive water-based control',
      author: 'KONIVRER Team',
      cards: KONIVRER_CARDS.filter(card => 
        card.elements.includes('Water') || card.name.toLowerCase().includes('water')
      ).slice(0, 30)
    };

    const balancedDeck: Deck = {
      id: 'balanced',
      name: 'Balanced Elemental Deck',
      description: 'Well-rounded multi-element strategy',
      author: 'KONIVRER Team',
      cards: KONIVRER_CARDS.slice(0, 30)
    };

    return [fireElementalDeck, waterControlDeck, balancedDeck];
  }

  private createUI() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

    // Health displays
    this.healthText1 = this.add.text(50, 50, 'Health: 30', {
      fontSize: '18px',
      color: '#ff6b6b'
    });

    this.healthText2 = this.add.text(50, 520, 'Health: 30', {
      fontSize: '18px',
      color: '#ff6b6b'
    });

    // Mana displays
    this.manaText1 = this.add.text(200, 50, 'Mana: 1/1', {
      fontSize: '18px',
      color: '#4ecdc4'
    });

    this.manaText2 = this.add.text(200, 520, 'Mana: 1/1', {
      fontSize: '18px',
      color: '#4ecdc4'
    });

    // Turn indicator
    this.turnText = this.add.text(350, 25, 'Turn 1 - Player 1', {
      fontSize: '20px',
      color: '#ffe66d'
    });

    // End Turn Button
    this.endTurnButton = this.add.rectangle(650, 50, 100, 40, 0x45b7d1);
    this.endTurnButton.setInteractive({ cursor: 'pointer' });
    this.endTurnButtonText = this.add.text(650, 50, 'End Turn', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.endTurnButton.on('pointerdown', () => this.endTurn());

    // Deck Builder Button
    this.deckBuilderButton = this.add.rectangle(500, 25, 120, 30, 0x96ceb4);
    this.deckBuilderButton.setInteractive({ cursor: 'pointer' });
    this.deckBuilderButtonText = this.add.text(500, 25, 'Deck Builder', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.deckBuilderButton.on('pointerdown', () => this.openDeckBuilder());

    // Card Search Button
    this.searchButton = this.add.rectangle(630, 25, 100, 30, 0xfeca57);
    this.searchButton.setInteractive({ cursor: 'pointer' });
    this.searchButtonText = this.add.text(630, 25, 'Card Search', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.searchButton.on('pointerdown', () => this.openCardSearch());

    // Close Game Button
    this.closeButton = this.add.rectangle(750, 25, 80, 30, 0xff6b6b);
    this.closeButton.setInteractive({ cursor: 'pointer' });
    this.closeButtonText = this.add.text(750, 25, 'Close', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.closeButton.on('pointerdown', () => this.closeGame());
  }

  private createGameAreas() {
    // Enemy hand area (top)
    this.enemyHandArea = this.add.rectangle(400, 120, 700, 80, 0x2d3436, 0.3);
    this.add.text(400, 120, 'Enemy Hand', {
      fontSize: '16px',
      color: '#ddd'
    }).setOrigin(0.5);

    // Enemy battlefield (upper middle)
    this.enemyBattlefieldArea = this.add.rectangle(400, 220, 700, 100, 0x636e72, 0.3);
    this.add.text(400, 220, 'Enemy Battlefield', {
      fontSize: '16px',
      color: '#ddd'
    }).setOrigin(0.5);

    // Player battlefield (lower middle)
    this.battlefieldArea = this.add.rectangle(400, 380, 700, 100, 0x636e72, 0.3);
    this.add.text(400, 380, 'Your Battlefield', {
      fontSize: '16px',
      color: '#ddd'
    }).setOrigin(0.5);

    // Player hand area (bottom)
    this.handArea = this.add.rectangle(400, 480, 700, 80, 0x2d3436, 0.3);
    this.add.text(400, 480, 'Your Hand', {
      fontSize: '16px',
      color: '#ddd'
    }).setOrigin(0.5);
  }

  private initializePlayers() {
    // Create decks from current deck selection
    const player1Deck = this.createGameDeck(this.currentDeck!);
    const player2Deck = this.createGameDeck(this.availableDecks[1]); // AI uses different deck

    this.player1 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: this.shuffleDeck(player1Deck),
      battlefield: []
    };

    this.player2 = {
      health: 30,
      mana: 1,
      maxMana: 1,
      hand: [],
      deck: this.shuffleDeck(player2Deck),
      battlefield: []
    };

    // Draw initial hands
    this.drawCards(this.player1, 5);
    this.drawCards(this.player2, 5);
  }

  private createGameDeck(deck: Deck): GameCard[] {
    return deck.cards.map((card, index) => ({
      ...card,
      gameId: `${card.id}_${index}`,
      x: 0,
      y: 0,
      isPlayable: false,
      isHovered: false
    }));
  }

  private shuffleDeck(deck: GameCard[]): GameCard[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private drawCards(player: Player, count: number) {
    for (let i = 0; i < count && player.deck.length > 0; i++) {
      const card = player.deck.pop()!;
      player.hand.push(card);
    }
    this.updateHandDisplay();
  }

  private startGame() {
    this.gamePhase = 'playing';
    this.updateDisplay();
    this.updateHandDisplay();
  }

  private updateDisplay() {
    this.healthText1.setText(`Health: ${this.player1.health}`);
    this.healthText2.setText(`Health: ${this.player2.health}`);
    this.manaText1.setText(`Mana: ${this.player1.mana}/${this.player1.maxMana}`);
    this.manaText2.setText(`Mana: ${this.player2.mana}/${this.player2.maxMana}`);
    this.turnText.setText(`Turn ${this.turnNumber} - Player ${this.currentPlayer}`);
  }

  private updateHandDisplay() {
    // Clear existing hand sprites
    this.player1.hand.forEach(card => {
      if (card.sprite) {
        card.sprite.destroy();
        card.sprite = undefined;
      }
    });

    // Display player 1 hand
    const handStartX = 100;
    const handY = 480;
    const cardSpacing = 80;

    this.player1.hand.forEach((card, index) => {
      const x = handStartX + (index * cardSpacing);
      card.x = x;
      card.y = handY;
      
      // Check if card is playable
      card.isPlayable = card.cost <= this.player1.mana;
      
      // Create card sprite
      const cardSprite = this.add.image(x, handY, card.id);
      cardSprite.setDisplaySize(60, 84);
      cardSprite.setInteractive({ cursor: 'pointer' });
      
      // Set tint based on playability
      if (card.isPlayable) {
        cardSprite.setTint(0xffffff);
      } else {
        cardSprite.setTint(0x666666);
      }
      
      card.sprite = cardSprite;

      // Add hover effects
      cardSprite.on('pointerover', () => {
        if (card.isPlayable) {
          cardSprite.setScale(1.1);
          this.showCardTooltip(card, x, handY - 100);
        }
      });

      cardSprite.on('pointerout', () => {
        cardSprite.setScale(1.0);
        this.hideCardTooltip();
      });

      // Add click handler
      cardSprite.on('pointerdown', () => {
        if (card.isPlayable && this.currentPlayer === 1) {
          this.playCard(card);
        }
      });
    });

    // Display enemy hand (face down)
    const enemyHandY = 120;
    this.player2.hand.forEach((card, index) => {
      const x = handStartX + (index * cardSpacing);
      const cardBack = this.add.image(x, enemyHandY, 'card-back');
      cardBack.setDisplaySize(60, 84);
    });
  }

  private showCardTooltip(card: GameCard, x: number, y: number) {
    // Create tooltip background
    const tooltip = this.add.rectangle(x, y, 200, 120, 0x000000, 0.8);
    tooltip.setName('tooltip');
    
    // Add card info
    const nameText = this.add.text(x, y - 40, card.name, {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    nameText.setName('tooltip');

    const costText = this.add.text(x, y - 20, `Cost: ${card.cost}`, {
      fontSize: '12px',
      color: '#4ecdc4'
    }).setOrigin(0.5);
    costText.setName('tooltip');

    const typeText = this.add.text(x, y, `${card.type} - ${card.rarity}`, {
      fontSize: '12px',
      color: '#ffe66d'
    }).setOrigin(0.5);
    typeText.setName('tooltip');

    const elementsText = this.add.text(x, y + 20, `Elements: ${card.elements.join(', ')}`, {
      fontSize: '10px',
      color: '#96ceb4'
    }).setOrigin(0.5);
    elementsText.setName('tooltip');

    if (card.strength) {
      const strengthText = this.add.text(x, y + 35, `Strength: ${card.strength}`, {
        fontSize: '10px',
        color: '#ff6b6b'
      }).setOrigin(0.5);
      strengthText.setName('tooltip');
    }
  }

  private hideCardTooltip() {
    this.children.list.filter(child => child.name === 'tooltip').forEach(child => {
      child.destroy();
    });
  }

  private playCard(card: GameCard) {
    if (card.cost > this.player1.mana) return;

    // Deduct mana
    this.player1.mana -= card.cost;

    // Remove from hand
    const handIndex = this.player1.hand.indexOf(card);
    this.player1.hand.splice(handIndex, 1);

    // Add to battlefield
    this.player1.battlefield.push(card);

    // Apply card effects
    this.applyCardEffects(card, this.player1, this.player2);

    // Update display
    this.updateDisplay();
    this.updateHandDisplay();
    this.updateBattlefieldDisplay();

    // Check win condition
    this.checkWinCondition();
  }

  private applyCardEffects(card: GameCard, caster: Player, opponent: Player) {
    // Apply effects based on card type and keywords
    if (card.keywords.includes('Aggressive')) {
      opponent.health -= 2;
    }
    
    if (card.keywords.includes('Defensive')) {
      caster.health += 1;
    }
    
    if (card.keywords.includes('Enhanced')) {
      caster.mana += 1;
    }
    
    // Special card effects
    if (card.name.toLowerCase().includes('lightning')) {
      opponent.health -= 3;
    }
    
    if (card.name.toLowerCase().includes('healing')) {
      caster.health += 5;
    }
  }

  private updateBattlefieldDisplay() {
    // Clear existing battlefield sprites
    this.player1.battlefield.forEach(card => {
      if (card.sprite) {
        card.sprite.destroy();
      }
    });

    // Display battlefield cards
    const battlefieldY = 380;
    const startX = 150;
    const spacing = 70;

    this.player1.battlefield.forEach((card, index) => {
      const x = startX + (index * spacing);
      const cardSprite = this.add.image(x, battlefieldY, card.id);
      cardSprite.setDisplaySize(50, 70);
      card.sprite = cardSprite;
    });
  }

  private endTurn() {
    if (this.gamePhase !== 'playing') return;

    // Switch players
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    
    if (this.currentPlayer === 1) {
      this.turnNumber++;
      
      // Increase max mana (up to 10)
      if (this.player1.maxMana < 10) this.player1.maxMana++;
      if (this.player2.maxMana < 10) this.player2.maxMana++;
    }

    // Restore mana
    const currentPlayerData = this.currentPlayer === 1 ? this.player1 : this.player2;
    currentPlayerData.mana = currentPlayerData.maxMana;

    // Draw a card
    this.drawCards(currentPlayerData, 1);

    // AI turn
    if (this.currentPlayer === 2) {
      this.time.delayedCall(1000, () => {
        this.playAITurn();
      });
    }

    this.updateDisplay();
    this.updateHandDisplay();
  }

  private playAITurn() {
    // Simple AI: play the first affordable card
    const playableCards = this.player2.hand.filter(card => card.cost <= this.player2.mana);
    
    if (playableCards.length > 0) {
      const cardToPlay = playableCards[0];
      
      // Deduct mana
      this.player2.mana -= cardToPlay.cost;
      
      // Remove from hand
      const handIndex = this.player2.hand.indexOf(cardToPlay);
      this.player2.hand.splice(handIndex, 1);
      
      // Add to battlefield
      this.player2.battlefield.push(cardToPlay);
      
      // Apply effects
      this.applyCardEffects(cardToPlay, this.player2, this.player1);
    }

    // End AI turn
    this.time.delayedCall(500, () => {
      this.endTurn();
    });
  }

  private checkWinCondition() {
    if (this.player1.health <= 0) {
      this.endGame('Player 2 Wins!');
    } else if (this.player2.health <= 0) {
      this.endGame('Player 1 Wins!');
    }
  }

  private endGame(message: string) {
    this.gamePhase = 'ended';
    
    // Display win message
    const winText = this.add.text(400, 300, message, {
      fontSize: '32px',
      color: '#ffe66d',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Add restart button
    const restartButton = this.add.rectangle(400, 350, 150, 50, 0x45b7d1);
    restartButton.setInteractive({ cursor: 'pointer' });
    
    const restartText = this.add.text(400, 350, 'Play Again', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    restartButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }

  private openDeckBuilder() {
    // This would open a deck builder interface
    // For now, show available decks
    this.showDeckSelection();
  }

  private showDeckSelection() {
    // Create deck selection overlay
    const overlay = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
    overlay.setName('deck-overlay');
    
    const title = this.add.text(400, 150, 'Select Deck', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setName('deck-overlay');

    // Display available decks
    this.availableDecks.forEach((deck, index) => {
      const y = 200 + (index * 60);
      
      const deckButton = this.add.rectangle(400, y, 500, 50, 0x45b7d1);
      deckButton.setInteractive({ cursor: 'pointer' });
      deckButton.setName('deck-overlay');
      
      const deckText = this.add.text(400, y, `${deck.name} (${deck.cards.length} cards)`, {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5);
      deckText.setName('deck-overlay');
      
      const descText = this.add.text(400, y + 15, deck.description || '', {
        fontSize: '12px',
        color: '#cccccc'
      }).setOrigin(0.5);
      descText.setName('deck-overlay');

      deckButton.on('pointerdown', () => {
        this.currentDeck = deck;
        this.closeDeckSelection();
        this.scene.restart(); // Restart with new deck
      });
    });

    // Close button
    const closeButton = this.add.rectangle(550, 170, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.setName('deck-overlay');
    
    const closeText = this.add.text(550, 170, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    closeText.setName('deck-overlay');

    closeButton.on('pointerdown', () => {
      this.closeDeckSelection();
    });
  }

  private closeDeckSelection() {
    this.children.list.filter(child => child.name === 'deck-overlay').forEach(child => {
      child.destroy();
    });
  }

  private openCardSearch() {
    // This would integrate with the UnifiedCardSearch component
    // For now, show a simple card browser
    this.showCardBrowser();
  }

  private showCardBrowser() {
    // Create card browser overlay
    const overlay = this.add.rectangle(400, 300, 700, 500, 0x000000, 0.9);
    overlay.setName('search-overlay');
    
    const title = this.add.text(400, 80, 'KONIVRER Card Database', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    title.setName('search-overlay');

    // Display cards in a grid
    const cardsPerRow = 6;
    const cardSize = 40;
    const spacing = 50;
    const startX = 150;
    const startY = 120;

    KONIVRER_CARDS.slice(0, 24).forEach((card, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = startX + (col * spacing);
      const y = startY + (row * spacing);
      
      const cardSprite = this.add.image(x, y, card.id);
      cardSprite.setDisplaySize(cardSize, cardSize * 1.4);
      cardSprite.setInteractive({ cursor: 'pointer' });
      cardSprite.setName('search-overlay');
      
      // Add hover effect
      cardSprite.on('pointerover', () => {
        cardSprite.setScale(1.2);
        this.showCardTooltip(card as GameCard, x + 60, y);
      });
      
      cardSprite.on('pointerout', () => {
        cardSprite.setScale(1.0);
        this.hideCardTooltip();
      });
    });

    // Close button
    const closeButton = this.add.rectangle(650, 100, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.setName('search-overlay');
    
    const closeText = this.add.text(650, 100, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    closeText.setName('search-overlay');

    closeButton.on('pointerdown', () => {
      this.closeCardBrowser();
    });
  }

  private closeCardBrowser() {
    this.children.list.filter(child => child.name === 'search-overlay').forEach(child => {
      child.destroy();
    });
  }

  private closeGame() {
    // Return to main app
    if (window.setShowGame) {
      window.setShowGame(false);
    }
  }
}

// Extend window interface for game integration
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
  }
}