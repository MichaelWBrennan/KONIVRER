import { createContext } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
}

export interface Deck {
  id: number;
  name: string;
  cards: string[];
  description: string;
}

// App Context type
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowGame: (show: boolean) => void;
}

// Create the context with default values
export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  decks: [],
  setDecks: () => {},
  bookmarks: [],
  setBookmarks: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
  setShowGame: () => {},
});
