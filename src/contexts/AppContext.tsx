import { createContext } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
}

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
  description: string;
  authorId: string;
  authorUsername: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  format?: string;
}

// App Context type
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  publicDecks: Deck[];
  setPublicDecks: (decks: Deck[]) => void;
  currentDeck: Deck | null;
  setCurrentDeck: (deck: Deck | null) => void;
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowGame: (show: boolean) => void;
  addCardToDeck: (cardId: string, deckId?: string) => void;
  createDeck: (name: string, description: string, isPublic: boolean) => Deck;
  publishDeck: (deckId: string, isPublic: boolean) => void;
  importDeck: (deck: Deck) => void;
}

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  decks: [],
  setDecks: () => {},
  publicDecks: [],
  setPublicDecks: () => {},
  currentDeck: null,
  setCurrentDeck: () => {},
  bookmarks: [],
  setBookmarks: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
  setShowGame: () => {},
  addCardToDeck: () => {},
  createDeck: () => ({ id: '', name: '', cards: [], description: '', authorId: '', authorUsername: '', isPublic: false, createdAt: new Date(), updatedAt: new Date(), tags: [] }),
  publishDeck: () => {},
  importDeck: () => {},
});
