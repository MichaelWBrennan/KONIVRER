/**
 * Deck Manager Utility
 * Handles deck creation, sharing, import/export, and community features
 */

import { Card, KONIVRER_CARDS } from '../../data/cards';

export interface Deck {
  id: string;
  name: string;
  description: string;
  author: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  likes: number;
  downloads: number;
  version: string;
}

export interface DeckStats {
  totalCards: number;
  elementDistribution: { [element: string]: number };
  rarityDistribution: { [rarity: string]: number };
  typeDistribution: { [type: string]: number };
  averageCost: number;
  costDistribution: { [cost: number]: number };
}

export class DeckManager {
  private static instance: DeckManager;
  private readonly STORAGE_KEY = 'konivrer-decks';
  private readonly COMMUNITY_STORAGE_KEY = 'konivrer-community-decks';

  static getInstance(): DeckManager {
    if (!DeckManager.instance) {
      DeckManager.instance = new DeckManager();
    }
    return DeckManager.instance;
  }

  /**
   * Save a deck to local storage
   */
  saveDeck(deck: Deck): void {
    const decks = this.getLocalDecks();
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    
    deck.updatedAt = new Date();
    
    if (existingIndex > -1) {
      decks[existingIndex] = deck;
    } else {
      decks.push(deck);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(decks));
  }

  /**
   * Load all local decks
   */
  getLocalDecks(): Deck[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const decks = JSON.parse(stored);
      return decks.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading local decks:', error);
      return [];
    }
  }

  /**
   * Delete a deck
   */
  deleteDeck(deckId: string): boolean {
    const decks = this.getLocalDecks();
    const filteredDecks = decks.filter(d => d.id !== deckId);
    
    if (filteredDecks.length < decks.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDecks));
      return true;
    }
    
    return false;
  }

  /**
   * Create a new deck
   */
  createDeck(name: string, description: string = '', author: string = 'Player'): Deck {
    return {
      id: this.generateDeckId(),
      name,
      description,
      author,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      tags: [],
      likes: 0,
      downloads: 0,
      version: '1.0.0'
    };
  }

  /**
   * Generate a unique deck ID
   */
  private generateDeckId(): string {
    return `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export deck to JSON string
   */
  exportDeck(deck: Deck): string {
    const exportData = {
      ...deck,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
      cardIds: deck.cards.map(card => card.id)
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import deck from JSON string
   */
  importDeck(jsonString: string): Deck | null {
    try {
      const importData = JSON.parse(jsonString);
      
      // Validate import data
      if (!importData.name || !importData.cardIds || !Array.isArray(importData.cardIds)) {
        throw new Error('Invalid deck format');
      }
      
      // Reconstruct cards from IDs
      const cards: Card[] = [];
      for (const cardId of importData.cardIds) {
        const card = KONIVRER_CARDS.find(c => c.id === cardId);
        if (card) {
          cards.push(card);
        }
      }
      
      // Create new deck with imported data
      const deck: Deck = {
        id: this.generateDeckId(), // Generate new ID
        name: importData.name,
        description: importData.description || '',
        author: importData.author || 'Imported',
        cards,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: importData.tags || [],
        likes: 0,
        downloads: 0,
        version: importData.version || '1.0.0'
      };
      
      return deck;
    } catch (error) {
      console.error('Error importing deck:', error);
      return null;
    }
  }

  /**
   * Calculate deck statistics
   */
  calculateDeckStats(deck: Deck): DeckStats {
    const stats: DeckStats = {
      totalCards: deck.cards.length,
      elementDistribution: {},
      rarityDistribution: {},
      typeDistribution: {},
      averageCost: 0,
      costDistribution: {}
    };
    
    let totalCost = 0;
    
    deck.cards.forEach(card => {
      // Element distribution
      card.elements.forEach(element => {
        stats.elementDistribution[element] = (stats.elementDistribution[element] || 0) + 1;
      });
      
      // Rarity distribution
      stats.rarityDistribution[card.rarity] = (stats.rarityDistribution[card.rarity] || 0) + 1;
      
      // Type distribution
      stats.typeDistribution[card.type] = (stats.typeDistribution[card.type] || 0) + 1;
      
      // Cost distribution
      stats.costDistribution[card.cost] = (stats.costDistribution[card.cost] || 0) + 1;
      
      totalCost += card.cost;
    });
    
    stats.averageCost = deck.cards.length > 0 ? totalCost / deck.cards.length : 0;
    
    return stats;
  }

  /**
   * Validate deck for play
   */
  validateDeck(deck: Deck): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check minimum cards
    if (deck.cards.length < 20) {
      errors.push('Deck must have at least 20 cards');
    }
    
    // Check maximum cards
    if (deck.cards.length > 60) {
      errors.push('Deck cannot have more than 60 cards');
    }
    
    // Check card limits (max 3 of each card)
    const cardCounts = new Map<string, number>();
    deck.cards.forEach(card => {
      const count = cardCounts.get(card.id) || 0;
      cardCounts.set(card.id, count + 1);
    });
    
    cardCounts.forEach((count, cardId) => {
      if (count > 3) {
        const card = KONIVRER_CARDS.find(c => c.id === cardId);
        errors.push(`Too many copies of ${card?.name || 'Unknown Card'} (${count}/3)`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate sample decks for new players
   */
  generateSampleDecks(): Deck[] {
    const fireElementalDeck = this.createDeck(
      'Fire Elemental Aggro',
      'Fast-paced aggressive deck focused on fire elements',
      'KONIVRER Team'
    );
    fireElementalDeck.cards = KONIVRER_CARDS
      .filter(card => card.elements.includes('Fire') || card.name.toLowerCase().includes('fire'))
      .slice(0, 30);
    fireElementalDeck.tags = ['Aggro', 'Fire', 'Beginner'];

    const waterControlDeck = this.createDeck(
      'Water Control',
      'Defensive control deck with water elements',
      'KONIVRER Team'
    );
    waterControlDeck.cards = KONIVRER_CARDS
      .filter(card => card.elements.includes('Water') || card.name.toLowerCase().includes('water'))
      .slice(0, 30);
    waterControlDeck.tags = ['Control', 'Water', 'Beginner'];

    const balancedDeck = this.createDeck(
      'Balanced Elements',
      'Well-rounded deck with multiple elements',
      'KONIVRER Team'
    );
    balancedDeck.cards = KONIVRER_CARDS.slice(0, 30);
    balancedDeck.tags = ['Balanced', 'Midrange', 'Beginner'];

    const chaosDeck = this.createDeck(
      'Chaos Storm',
      'Unpredictable deck with chaos elements',
      'KONIVRER Team'
    );
    chaosDeck.cards = KONIVRER_CARDS
      .filter(card => card.elements.includes('Chaos') || card.keywords.includes('Chaotic'))
      .concat(KONIVRER_CARDS.filter(card => card.rarity === 'Rare'))
      .slice(0, 30);
    chaosDeck.tags = ['Chaos', 'Advanced', 'Combo'];

    return [fireElementalDeck, waterControlDeck, balancedDeck, chaosDeck];
  }

  /**
   * Share deck to community (simulated)
   */
  shareDeck(deck: Deck): string {
    deck.isPublic = true;
    deck.downloads = 0;
    deck.likes = 0;
    
    // Save to community storage (simulated)
    const communityDecks = this.getCommunityDecks();
    communityDecks.push({ ...deck });
    localStorage.setItem(this.COMMUNITY_STORAGE_KEY, JSON.stringify(communityDecks));
    
    // Generate share code
    const shareCode = btoa(JSON.stringify({
      id: deck.id,
      name: deck.name,
      author: deck.author,
      cardIds: deck.cards.map(c => c.id)
    }));
    
    return shareCode;
  }

  /**
   * Import deck from share code
   */
  importFromShareCode(shareCode: string): Deck | null {
    try {
      const shareData = JSON.parse(atob(shareCode));
      
      const cards: Card[] = [];
      for (const cardId of shareData.cardIds) {
        const card = KONIVRER_CARDS.find(c => c.id === cardId);
        if (card) {
          cards.push(card);
        }
      }
      
      const deck = this.createDeck(
        `${shareData.name} (Copy)`,
        `Imported from ${shareData.author}`,
        'Imported'
      );
      deck.cards = cards;
      
      return deck;
    } catch (error) {
      console.error('Error importing from share code:', error);
      return null;
    }
  }

  /**
   * Get community decks (simulated)
   */
  getCommunityDecks(): Deck[] {
    try {
      const stored = localStorage.getItem(this.COMMUNITY_STORAGE_KEY);
      if (!stored) {
        // Initialize with sample decks
        const sampleDecks = this.generateSampleDecks();
        sampleDecks.forEach(deck => {
          deck.isPublic = true;
          deck.likes = Math.floor(Math.random() * 50);
          deck.downloads = Math.floor(Math.random() * 100);
        });
        localStorage.setItem(this.COMMUNITY_STORAGE_KEY, JSON.stringify(sampleDecks));
        return sampleDecks;
      }
      
      const decks = JSON.parse(stored);
      return decks.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading community decks:', error);
      return [];
    }
  }

  /**
   * Like a community deck
   */
  likeDeck(deckId: string): void {
    const communityDecks = this.getCommunityDecks();
    const deck = communityDecks.find(d => d.id === deckId);
    if (deck) {
      deck.likes++;
      localStorage.setItem(this.COMMUNITY_STORAGE_KEY, JSON.stringify(communityDecks));
    }
  }

  /**
   * Download a community deck
   */
  downloadDeck(deckId: string): Deck | null {
    const communityDecks = this.getCommunityDecks();
    const sourceDeck = communityDecks.find(d => d.id === deckId);
    
    if (sourceDeck) {
      // Increment download count
      sourceDeck.downloads++;
      localStorage.setItem(this.COMMUNITY_STORAGE_KEY, JSON.stringify(communityDecks));
      
      // Create a copy for the user
      const userDeck = this.createDeck(
        `${sourceDeck.name} (Downloaded)`,
        `Downloaded from ${sourceDeck.author}. ${sourceDeck.description}`,
        'Downloaded'
      );
      userDeck.cards = [...sourceDeck.cards];
      userDeck.tags = [...sourceDeck.tags];
      
      return userDeck;
    }
    
    return null;
  }

  /**
   * Search community decks
   */
  searchCommunityDecks(query: string, tags: string[] = []): Deck[] {
    const communityDecks = this.getCommunityDecks();
    
    return communityDecks.filter(deck => {
      const matchesQuery = !query || 
        deck.name.toLowerCase().includes(query.toLowerCase()) ||
        deck.description.toLowerCase().includes(query.toLowerCase()) ||
        deck.author.toLowerCase().includes(query.toLowerCase());
      
      const matchesTags = tags.length === 0 || 
        tags.some(tag => deck.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }
}

// Export singleton instance
export const deckManager = DeckManager.getInstance();