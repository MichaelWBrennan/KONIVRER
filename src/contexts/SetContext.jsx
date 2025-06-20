import { createContext, useContext, useState, useEffect } from 'react';
import setsData from '../data/sets.json';

const SetContext = createContext();

export const useSet = () => {
  const context = useContext(SetContext);
  if (!context) {
    throw new Error('useSet must be used within a SetProvider');
  }
  return context;
};

export const SetProvider = ({ children }) => {
  const [sets, setSets] = useState([]);
  const [activeSets, setActiveSets] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);

  // Initialize sets data
  useEffect(() => {
    initializeSets();
  }, []);

  const initializeSets = () => {
    // Load sets from localStorage or use default data
    const savedSets = JSON.parse(
      localStorage.getItem('konivrer_sets') || JSON.stringify(setsData),
    );
    setSets(savedSets);

    // Filter active sets
    const active = savedSets.filter(set => set.isActive);
    setActiveSets(active);

    // Get visible cards from active sets
    updateVisibleCards(active);
  };

  const updateVisibleCards = activeSets => {
    const allVisibleCardIds = activeSets
      .filter(set => set.isVisible)
      .flatMap(set => set.cardIds);

    // Here you would fetch the actual card data based on IDs
    // For now, we'll keep it as an empty array since no cards should be visible by default
    setVisibleCards([]);
  };

  const toggleSetVisibility = setId => {
    const updatedSets = sets.map(set =>
      set.id === setId ? { ...set, isVisible: !set.isVisible } : set,
    );

    setSets(updatedSets);
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(set => set.isActive);
    setActiveSets(active);
    updateVisibleCards(active);
  };

  const toggleSetActive = setId => {
    const updatedSets = sets.map(set =>
      set.id === setId
        ? {
            ...set,
            isActive: !set.isActive,
            isVisible: set.isActive ? false : set.isVisible,
          }
        : set,
    );

    setSets(updatedSets);
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(set => set.isActive);
    setActiveSets(active);
    updateVisibleCards(active);
  };

  const addSet = newSet => {
    const setWithId = {
      ...newSet,
      id: newSet.id || `set_${Date.now()}`,
      isActive: false,
      isVisible: false,
      cardIds: newSet.cardIds || [],
    };

    const updatedSets = [...sets, setWithId];
    setSets(updatedSets);
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));
  };

  const removeSet = setId => {
    const updatedSets = sets.filter(set => set.id !== setId);
    setSets(updatedSets);
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(set => set.isActive);
    setActiveSets(active);
    updateVisibleCards(active);
  };

  const updateSet = (setId, updates) => {
    const updatedSets = sets.map(set =>
      set.id === setId ? { ...set, ...updates } : set,
    );

    setSets(updatedSets);
    localStorage.setItem('konivrer_sets', JSON.stringify(updatedSets));

    const active = updatedSets.filter(set => set.isActive);
    setActiveSets(active);
    updateVisibleCards(active);
  };

  const value = {
    sets,
    activeSets,
    visibleCards,
    toggleSetVisibility,
    toggleSetActive,
    addSet,
    removeSet,
    updateSet,
    initializeSets,
  };

  return <SetContext.Provider value={value}>{children}</SetContext.Provider>;
};
