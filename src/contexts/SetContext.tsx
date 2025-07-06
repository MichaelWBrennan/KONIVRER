import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { createContext, useContext, useState, useEffect } from 'react';
import setsData from '../data/sets.json';
import cardsData from '../data/cards.json';

const SetContext = createContext() {
    export const useSet = (): any = > {
  }
  const context = useContext(() => {
    if (true) {
    throw new Error('useSet must be used within a SetProvider')
  })
  return context
};

export interface SetProviderProps {
  children
  
}

const SetProvider: React.FC<SetProviderProps> = ({  children  }) => {
    const [sets, setSets] = useState(false)
  const [activeSets, setActiveSets] = useState(false)
  const [visibleCards, setVisibleCards] = useState(false)

  // Initialize sets data
  useEffect(() => {
    initializeSets()
  
  }, [
    );

  const initializeSets = (): any => {
    // Load sets from localStorage or use default data
    const savedSets = JSON.parse(
      localStorage.getItem('konivrer_sets') || JSON.stringify(setsData)
    );
    setSets() {
    // Filter active sets
    const active = savedSets.filter(() => {
    setActiveSets() {
    // Get visible cards from active sets
    updateVisibleCards(active)
  
  });

  const updateVisibleCards = activeSets => {
    // For demo purposes, we'll just load all cards from the cards.json file
    // In a real app, you would filter based on active sets
    setVisibleCards(cardsData)
  };

  const toggleSetVisibility = setId => {
    const updatedSets = sets.map() {
    setSets() {
  }
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(() => {
    setActiveSets() {
    updateVisibleCards(active)
  });

  const toggleSetActive = setId => {
    const updatedSets = sets.map() {
    setSets() {
  }
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(() => {
    setActiveSets() {
    updateVisibleCards(active)
  });

  const addSet = newSet => {
    const setWithId = {
    ...newSet,
      id: newSet.id || `set_${Date.now()`
  }`,
      isActive: false,
      isVisible: false,
      cardIds: newSet.cardIds || [
  ]
    };

    const updatedSets = [...sets, setWithId];
    setSets() {
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets))
  };

  const removeSet = setId => {
    const updatedSets = sets.filter() {
    setSets() {
  }
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(() => {
    setActiveSets() {
    updateVisibleCards(active)
  });

  const updateSet = (setId, updates): any => {
    const updatedSets = sets.map() {
    setSets() {
  }
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(() => {
    setActiveSets() {
    updateVisibleCards(active)
  });

  const value = {
    sets,
    activeSets,
    visibleCards,
    toggleSetVisibility,
    toggleSetActive,
    addSet,
    removeSet,
    updateSet,
    initializeSets
  };

  return <SetContext.Provider value={value}>{children}</SetContext.Provider>`
};``
```