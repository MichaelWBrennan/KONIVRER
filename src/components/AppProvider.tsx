import React, { useState, useEffect, ReactNode } from 'react';
import { AppContext, User, Deck, DeckCard } from '../contexts/AppContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('konivrer_user');
    const savedDecks = localStorage.getItem('konivrer_decks');
    const savedBookmarks = localStorage.getItem('konivrer_bookmarks');
    const savedCurrentDeck = localStorage.getItem('konivrer_current_deck');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }

    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (error) {
        console.error('Error parsing saved decks:', error);
      }
    }

    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error parsing saved bookmarks:', error);
      }
    }

    if (savedCurrentDeck) {
      try {
        setCurrentDeck(JSON.parse(savedCurrentDeck));
      } catch (error) {
        console.error('Error parsing saved current deck:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('konivrer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('konivrer_user');
    }
  }, [user]);

  // Save decks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('konivrer_decks', JSON.stringify(decks));
  }, [decks]);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('konivrer_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save current deck to localStorage whenever it changes
  useEffect(() => {
    if (currentDeck) {
      localStorage.setItem('konivrer_current_deck', JSON.stringify(currentDeck));
    } else {
      localStorage.removeItem('konivrer_current_deck');
    }
  }, [currentDeck]);

  const setShowGame = (show: boolean) => {
    // Implementation for showing/hiding game
    console.log('Show game:', show);
  };

  const addCardToDeck = (cardId: string, deckId?: string) => {
    const targetDeckId = deckId || currentDeck?.id;
    if (!targetDeckId) return;

    if (targetDeckId === currentDeck?.id && currentDeck) {
      // Update current deck
      const existingCard = currentDeck.cards.find(dc => dc.cardId === cardId);
      const updatedCards = existingCard
        ? currentDeck.cards.map(dc => 
            dc.cardId === cardId 
              ? { ...dc, quantity: dc.quantity + 1 }
              : dc
          )
        : [...currentDeck.cards, { cardId, quantity: 1 }];

      const updatedDeck = {
        ...currentDeck,
        cards: updatedCards,
        updatedAt: new Date()
      };

      setCurrentDeck(updatedDeck);
      
      // Also update in decks array if it exists there
      setDecks(prev => 
        prev.map(deck => 
          deck.id === targetDeckId ? updatedDeck : deck
        )
      );
    } else {
      // Update deck in decks array
      setDecks(prev => 
        prev.map(deck => {
          if (deck.id === targetDeckId) {
            const existingCard = deck.cards.find(dc => dc.cardId === cardId);
            const updatedCards = existingCard
              ? deck.cards.map(dc => 
                  dc.cardId === cardId 
                    ? { ...dc, quantity: dc.quantity + 1 }
                    : dc
                )
              : [...deck.cards, { cardId, quantity: 1 }];

            return {
              ...deck,
              cards: updatedCards,
              updatedAt: new Date()
            };
          }
          return deck;
        })
      );
    }
  };

  const createDeck = (name: string, description: string, isPublic: boolean): Deck => {
    if (!user) {
      throw new Error('User must be logged in to create a deck');
    }

    const newDeck: Deck = {
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      cards: [],
      authorId: user.id,
      authorUsername: user.username,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      format: 'Standard'
    };

    setDecks(prev => [...prev, newDeck]);
    
    if (isPublic) {
      setPublicDecks(prev => [...prev, newDeck]);
    }

    return newDeck;
  };

  const publishDeck = (deckId: string, isPublic: boolean) => {
    // Update deck privacy status
    setDecks(prev => 
      prev.map(deck => 
        deck.id === deckId 
          ? { ...deck, isPublic, updatedAt: new Date() }
          : deck
      )
    );

    // Update current deck if it matches
    if (currentDeck?.id === deckId) {
      setCurrentDeck(prev => 
        prev ? { ...prev, isPublic, updatedAt: new Date() } : null
      );
    }

    // Add to or remove from public decks
    const deck = decks.find(d => d.id === deckId) || currentDeck;
    if (deck) {
      if (isPublic) {
        setPublicDecks(prev => {
          const exists = prev.some(d => d.id === deckId);
          if (!exists) {
            return [...prev, { ...deck, isPublic: true, updatedAt: new Date() }];
          }
          return prev.map(d => 
            d.id === deckId ? { ...d, isPublic: true, updatedAt: new Date() } : d
          );
        });
      } else {
        setPublicDecks(prev => prev.filter(d => d.id !== deckId));
      }
    }
  };

  const importDeck = (deck: Deck) => {
    if (!user) return;

    const importedDeck: Deck = {
      ...deck,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: user.id,
      authorUsername: user.username,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: `${deck.name} (Imported)`
    };

    setDecks(prev => [...prev, importedDeck]);
    setCurrentDeck(importedDeck);
  };

  const contextValue = {
    user,
    setUser,
    decks,
    setDecks,
    publicDecks,
    setPublicDecks,
    currentDeck,
    setCurrentDeck,
    bookmarks,
    setBookmarks,
    showLoginModal,
    setShowLoginModal,
    setShowGame,
    addCardToDeck,
    createDeck,
    publishDeck,
    importDeck
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;