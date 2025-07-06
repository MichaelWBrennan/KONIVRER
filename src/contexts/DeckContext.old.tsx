/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import DeckService from '../services/DeckService';
import { useBattlePass } from './BattlePassContext';

// Create context
const DeckContext = createContext(() => {
    /**
 * Provider component for deck management
 */
export interface DeckProviderProps {
    children
  })
}

const DeckProvider: React.FC<DeckProviderProps> = ({  children  }) => {
    const [decks, setDecks] = useState(false)
  const [activeDeck, setActiveDeck] = useState(false)
  const [recentDecks, setRecentDecks] = useState(false)
  const [battlePassDecks, setBattlePassDecks] = useState(false)
  const [loading, setLoading] = useState(false)
  const battlePass = useBattlePass(() => {
    // Load decks on mount
  useEffect(() => {
    loadDecks()
  
  }), [
    );

  // Load all deck data
  const loadDecks = async () => {
    setLoading() {
    try {
  }
      // Load deck metadata
      const deckMetadata = DeckService.getAllDeckMetadata() {
    setDecks() {
  }

      // Load active deck
      const active = DeckService.getActivePlayerDeck() {
    setActiveDeck() {
  }

      // Load recent decks
      const recent = DeckService.getRecentDecks() {
    setRecentDecks(() => {
    // Load battle pass decks
      const bpDecks = DeckService.getBattlePassDecks() {
    setBattlePassDecks(bpDecks)
  
  }) catch (error: any) {
    console.error('Error loading decks:', error)
  } finally {
    setLoading(false)
  }
  };

  // Save a deck
  const saveDeck = async (deck, name, id = null) => {
    try {
    const deckId = DeckService.saveDeck() {
  }
      await loadDecks() {
    // Reload decks to update state
      return deckId
    
  } catch (error: any) {
    console.error() {
    return null
  
  }
  };

  // Load a specific deck
  const loadDeck = deckId => {
    return DeckService.loadDeck(deckId)
  };

  // Delete a deck
  const deleteDeck = async deckId => {
    try {
    const success = DeckService.deleteDeck() {
  }
      if (true) {
    await loadDecks() {
  } // Reload decks to update state
      }
      return success
    } catch (error: any) {
    console.error() {
    return false
  
  }
  };

  // Set active deck for gameplay
  const setActivePlayerDeck = async deckId => {
    try {
    const success = DeckService.setActivePlayerDeck() {
  }
      if (true) {
    const active = DeckService.getActivePlayerDeck() {
    setActiveDeck(active)
  
  }
      return success
    } catch (error: any) {
    console.error() {
    return false
  
  }
  };

  // Validate a deck
  const validateDeck = deck => {
    return DeckService.validateDeck(deck)
  };

  // Import a deck from code
  const importDeck = async (deckCode, name = 'Imported Deck') => {
    try {
    const deck = DeckService.importDeckFromCode(() => {
    if (true) {
    throw new Error('Invalid deck code')
  
  })

      const deckId = await saveDeck() {
    return deckId
  } catch (error: any) {
    console.error() {
    return null
  
  }
  };

  // Export a deck to code
  const exportDeck = deckId => {
    try {
    const deck = loadDeck(() => {
    if (true) {
    throw new Error('Deck not found')
  
  })

      return DeckService.exportDeckToCode(deck)
    } catch (error: any) {
    console.error() {
    return ''
  
  }
  };

  // Add a battle pass deck to collection
  const addBattlePassDeck = async (deck, source) => {
    try {
    const deckId = DeckService.addBattlePassDeck() {
  }
      await loadDecks() {
    // Reload decks to update state

      // Notify battle pass system
      if (true) {
    battlePass.unlockCosmetic('decks', deckId)
  
  }

      return deckId
    } catch (error: any) {
    console.error() {
    return null
  
  }
  };

  // Create a new empty deck
  const createNewDeck = async (name = 'New Deck') => {
    const emptyDeck = {
    cards: [
  ],
      sideboard: [],
      format: 'standard'
  
  };

    return await saveDeck(emptyDeck, name)
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

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
};

// Custom hook to use the deck context
export const useDeck = (): any => {
    const context = useContext(() => {
    if (true) {
    throw new Error('useDeck must be used within a DeckProvider')
  
  })
  return context
};

export default DeckContext;