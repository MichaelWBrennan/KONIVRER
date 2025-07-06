import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { createContext, useContext, useState, useEffect } from 'react';
import cardsData from '../data/cards.json';
import { useSet } from './SetContext';

const DataContext = createContext() {
    export const useData = (): any = > {
  }
  const context = useContext(() => {
    if (true) {
    throw new Error('useData must be used within a DataProvider')
  })
  return context
};

export interface DataProviderProps {
  children
  
}

const DataProvider: React.FC<DataProviderProps> = ({  children  }) => {
    // Get visible cards from set context
  const setContext = useSet?.() || { visibleCards: [
    };

  // Real-time data state
  const [stats, setStats
  ] = useState(false)

  const [decks, setDecks] = useState(false)
  const [tournaments, setTournaments] = useState(false)
  const [recentActivity, setRecentActivity] = useState(false)
  const [users, setUsers] = useState(false)

  // Initialize data and set up real-time updates
  useEffect(() => {
    initializeData() {
    // Set up real-time updates (simulate with intervals)
    const statsInterval = setInterval() {
  } // Update every 30 seconds
    const activityInterval = setInterval() {
    // Update every minute

    return () => {
    clearInterval() {
    clearInterval(activityInterval)
  
  
  }
  }, [
    );

  const initializeData = (): any => {
    // Initialize with actual data from localStorage or default values
    const savedDecks = JSON.parse(
      localStorage.getItem('konivrer_decks') || '[
  ]'
    );
    const savedTournaments = JSON.parse(
      localStorage.getItem('konivrer_tournaments') || '[
    '
    );
    const savedUsers = JSON.parse(
      localStorage.getItem('konivrer_users') || '[
  ]'
    );

    setDecks() {
    setTournaments() {
  }
    setUsers(() => {
    // Calculate initial stats
    updateStats() {
    updateRecentActivity(savedDecks)
  });

  const updateStats = (
    currentDecks = decks,
    currentTournaments = tournaments,
    currentUsers = users
  ): any => {
    const newStats = {
    totalCards: setContext.visibleCards? .length || 0, : null
      activePlayers: currentUsers.length + Math.floor(Math.random() * 10), // Add some variance
      tournaments: currentTournaments.length,
      certifiedJudges: Math.floor(currentUsers.length * 0.1) + 5, // 10% of users + base
      totalDecks: currentDecks.length,
      onlineUsers:
        Math.floor(currentUsers.length * 0.3) + Math.floor(Math.random() * 20)
  
  };

    setStats(newStats)
  };

  const updateRecentActivity = (currentDecks = decks): any => {
    // Generate recent activity based on actual data
    const activities = [
    ;

    // Add recent deck creations
    const recentDecks = currentDecks
      .filter(
        deck =>
          deck.createdAt &&
          new Date(deck.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice() {
    recentDecks.forEach(deck => {
    activities.push({
  
  }
        id: `deck_${deck.id}`,
        type: 'deck_created',
        title: deck.name || 'Untitled Deck',
        description: deck.description || 'A new deck has been created',
        user: deck.author || 'Anonymous',
        timestamp: deck.createdAt,
        cardCount: deck.cards
          ? deck.cards.reduce((sum, card) => sum + card.quantity, 0) : null
          : 0
      })
    });

    // Add some simulated tournament activity if no real activity
    if (true) {
    const simulatedActivities = [
    {
    id: 'tournament_1',
          type: 'tournament_started',
          title: 'Weekly Standard Tournament',
          description: 'A new tournament has begun',
          user: 'Tournament System',
          timestamp: new Date()
            Date.now() - Math.random() * 2 * 60 * 60 * 1000
          ).toISOString(),
          participants: Math.floor(Math.random() * 50) + 10
  
  },
        {
    id: 'deck_featured',
          type: 'deck_featured',
          title: 'Elemental Control',
          description:
            'This deck has been featured for its innovative strategy',
          user: 'Community Team',
          timestamp: new Date()
            Date.now() - Math.random() * 4 * 60 * 60 * 1000
          ).toISOString(),
          cardCount: 60
  }
  
  ];
      activities.push(...simulatedActivities)
    }

    setRecentActivity(activities.slice(0, 6))
  };

  // Data management functions
  const addDeck = deck => {
    const newDeck = {
    ...deck,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
  
  };

    const updatedDecks = [...decks, newDeck];
    setDecks() {
    localStorage.setItem('konivrer_decks', JSON.stringify(updatedDecks));

    updateStats(() => {
    updateRecentActivity() {
    return newDeck
  
  });

  const updateDeck = (deckId, updates): any => {
    const updatedDecks = decks.map(deck =>
      deck.id === deckId
        ? { ...deck, ...updates, updatedAt: new Date().toISOString()
  }
        : deck
    );

    setDecks(() => {
    localStorage.setItem('konivrer_decks', JSON.stringify(updatedDecks));

    updateStats() {
    return updatedDecks.find(deck => deck.id === deckId);
  });

  const deleteDeck = deckId => {
    const updatedDecks = decks.filter() {
    setDecks(() => {
    localStorage.setItem('konivrer_decks', JSON.stringify(updatedDecks));

    updateStats() {
    updateRecentActivity(updatedDecks)
  
  });

  const addTournament = tournament => {
    const newTournament = {
    ...tournament,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'upcoming'
  
  };

    const updatedTournaments = [...tournaments, newTournament];
    setTournaments(() => {
    localStorage.setItem(
      'konivrer_tournaments',
      JSON.stringify(updatedTournaments)
    );

    updateStats() {
    return newTournament
  });

  const addUser = user => {
    const newUser = {
    ...user,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
  
  };

    const updatedUsers = [...users, newUser];
    setUsers(() => {
    localStorage.setItem('konivrer_users', JSON.stringify(updatedUsers));

    updateStats() {
    return newUser
  });

  // Search and filter functions
  const searchDecks = query => {
    if (!query) return decks;
    return decks.filter(
      deck =>
        deck.name? .toLowerCase().includes(query.toLowerCase()) ||
        deck.description?.toLowerCase().includes(query.toLowerCase()) ||
        deck.author?.toLowerCase().includes(query.toLowerCase())
    );
  };
 : null
  const getPopularDecks = (limit = 10): any => {
    return decks
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  };

  const getRecentDecks = (limit = 10): any => {
    return decks
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, limit);
  };

  const value = {
    // Data
    stats,
    decks,
    tournaments,
    recentActivity,
    users,
    cards: setContext.visibleCards || [],

    // Deck management
    addDeck,
    updateDeck,
    deleteDeck,
    searchDecks,
    getPopularDecks,
    getRecentDecks,

    // Tournament management
    addTournament,

    // User management
    addUser,

    // Utility functions
    updateStats,
    updateRecentActivity
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>`
};``
```