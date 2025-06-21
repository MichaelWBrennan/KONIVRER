import React, { createContext, useContext, useState, useEffect } from 'react';
import DeckService from '../services/DeckService';
import { useBattlePass } from './BattlePassContext';

// Create context
const DeckContext = createContext();

/**
 * Provider component for deck management
 */
export const DeckProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [recentDecks, setRecentDecks] = useState([]);
  const [battlePassDecks, setBattlePassDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const battlePass = useBattlePass();

  // Load decks on mount
  useEffect(() => {
    loadDecks();
  }, []);

  // Load all deck data
  const loadDecks = async () => {
    setLoading(true);
    
    try {
      // Load deck metadata
      const deckMetadata = DeckService.getAllDeckMetadata();
      setDecks(deckMetadata);
      
      // Load active deck
      const active = DeckService.getActivePlayerDeck();
      setActiveDeck(active);
      
      // Load recent decks
      const recent = DeckService.getRecentDecks();
      setRecentDecks(recent);
      
      // Load battle pass decks
      const bpDecks = DeckService.getBattlePassDecks();
      setBattlePassDecks(bpDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save a deck
  const saveDeck = async (deck, name, id = null) => {
    try {
      const deckId = DeckService.saveDeck(deck, name, id);
      await loadDecks(); // Reload decks to update state
      return deckId;
    } catch (error) {
      console.error('Error saving deck:', error);
      return null;
    }
  };

  // Load a specific deck
  const loadDeck = (deckId) => {
    return DeckService.loadDeck(deckId);
  };

  // Delete a deck
  const deleteDeck = async (deckId) => {
    try {
      const success = DeckService.deleteDeck(deckId);
      if (success) {
        await loadDecks(); // Reload decks to update state
      }
      return success;
    } catch (error) {
      console.error('Error deleting deck:', error);
      return false;
    }
  };

  // Set active deck for gameplay
  const setActivePlayerDeck = async (deckId) => {
    try {
      const success = DeckService.setActivePlayerDeck(deckId);
      if (success) {
        const active = DeckService.getActivePlayerDeck();
        setActiveDeck(active);
      }
      return success;
    } catch (error) {
      console.error('Error setting active deck:', error);
      return false;
    }
  };

  // Validate a deck
  const validateDeck = (deck) => {
    return DeckService.validateDeck(deck);
  };

  // Import a deck from code
  const importDeck = async (deckCode, name = 'Imported Deck') => {
    try {
      const deck = DeckService.importDeckFromCode(deckCode);
      if (!deck) {
        throw new Error('Invalid deck code');
      }
      
      const deckId = await saveDeck(deck, name);
      return deckId;
    } catch (error) {
      console.error('Error importing deck:', error);
      return null;
    }
  };

  // Export a deck to code
  const exportDeck = (deckId) => {
    try {
      const deck = loadDeck(deckId);
      if (!deck) {
        throw new Error('Deck not found');
      }
      
      return DeckService.exportDeckToCode(deck);
    } catch (error) {
      console.error('Error exporting deck:', error);
      return '';
    }
  };

  // Add a battle pass deck to collection
  const addBattlePassDeck = async (deck, source) => {
    try {
      const deckId = DeckService.addBattlePassDeck(deck, source);
      await loadDecks(); // Reload decks to update state
      
      // Notify battle pass system
      if (battlePass) {
        battlePass.unlockCosmetic('decks', deckId);
      }
      
      return deckId;
    } catch (error) {
      console.error('Error adding battle pass deck:', error);
      return null;
    }
  };

  // Create a new empty deck
  const createNewDeck = async (name = 'New Deck') => {
    const emptyDeck = {
      cards: [],
      sideboard: [],
      format: 'standard'
    };
    
    return await saveDeck(emptyDeck, name);
  };

  // Context value
  const value = {
    decks,
    activeDeck,
    recentDecks,
    battlePassDecks,
    loading,
    loadDecks,
    saveDeck,
    loadDeck,
    deleteDeck,
    setActivePlayerDeck,
    validateDeck,
    importDeck,
    exportDeck,
    addBattlePassDeck,
    createNewDeck
  };

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
};

// Custom hook to use the deck context
export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};

export default DeckContext;