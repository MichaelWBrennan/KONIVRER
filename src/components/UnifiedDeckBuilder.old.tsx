import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Unified Deck Builder
 * 
 * A unified deck builder component that combines functionality from:
 * - VisualDeckBuilder
 * - EnhancedDeckBuilder
 * - CardSynergyRecommendations
 * - DeckImportModal
 * - DeckExportModal
 * - DeckValidator
 * - DeckStats
 * 
 * Features:
 * - Visual deck building interface
 * - Card search and filtering
 * - Deck statistics and analysis
 * - Deck validation
 * - Import/export functionality
 * - Card recommendations
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';

// Import components
import UnifiedCard from './UnifiedCard';
import UnifiedCardSearch from './UnifiedCardSearch';

// Import icons
import { Save, Download, Upload, Trash, Plus, Minus, X, Search, Filter, BarChart, Zap, Star, Bookmark, RefreshCw, AlertCircle, CheckCircle, Info, Flame, Droplets, Mountain, Wind, Sparkles, Square, Circle, Layers, List, Grid, Edit, MoreHorizontal } from 'lucide-react';

// Types
type CardType = 'Familiar' | 'Spell' | 'Flag' | 'Azoth';
type Element = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'generic';
type GameFormat = 'standard' | 'draft' | 'sealed' | 'casual' | 'ranked' | 'competitive' | 'custom';
type ViewMode = 'grid' | 'list' | 'curve' | 'table';

interface Card {
    id: string;
  name: string;,
  type: CardType;,
  subtype?: string;
  elements: Record<Element, number>;
  abilities?: {
    effect: string;
    keywords?: string[
    ;
    cost?: Record<Element, number>;
    trigger?: string;
    target?: string
  
  }
  }[
  ];
  keywords?: string[
    ;
  strength?: number;
  health?: number;
  value?: number;
  rarity?: string;
  set?: string;
  artist?: string;
  flavor?: string;
  image?: string
}

interface Deck {
    id: string;
  name: string;,
  format: GameFormat;
  cards: Card[
  ];
  mainDeck: Card[
    ;
  sideboard: Card[
  ];
  author: {
    id: string;
    name: string
  
  }
  };
  description?: string;
  tags?: string[
    ;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  colors: Element[
  ];
  stats?: {
    cardTypes: Record<CardType, number>;
    elementDistribution: Record<Element, number>;
    manaCurve: Record<number, number>;
    averageElementCost: number
  }
}

interface DeckValidationRule {
    id: string;
  name: string;,
  description: string;
  format: GameFormat;
  validate: (deck: Deck) => {
    valid: boolean;
    message?: string
  
  }
  }
}

interface CardRecommendation {
  card: Card;
  reason: string;
  score: number
  
}

interface UnifiedDeckBuilderProps {
  variant?: 'standard' | 'enhanced' | 'mobile';
  initialDeck?: Deck;
  format?: GameFormat;
  onSave?: (deck: Deck) => void;
  onExport?: (deck: Deck, format: string) => void;
  onImport?: (deckData: string) => Deck | null;
  className?: string
  
}

const UnifiedDeckBuilder: React.FC<UnifiedDeckBuilderProps> = ({
    variant = 'standard',
  initialDeck,
  format = 'standard',
  onSave,
  onExport,
  onImport,
  className = ''
  }) => {
    // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const actualVariant = variant === 'standard' && isMobile ? 'mobile' : variant;
  
  // Navigation and location
  const navigate = useNavigate() {
    const location = useLocation() {
  }
  
  // Auth context
  const { user } = useAuth() {
    // Refs
  const deckNameInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [deck, setDeck] = useState<Deck>(initialDeck || {
  }
    id: '',
    name: 'New Deck',
    format,
    cards: [
    ,
    mainDeck: [
  ],
    sideboard: [
    ,
    author: {
    id: user? .uid || '', : null
      name: user? .displayName || 'Anonymous'
  }, : null
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    colors: [
  ]
  });
  
  const [availableCards, setAvailableCards] = useState<Card[
    >([
  ]);
  const [filteredCards, setFilteredCards] = useState<Card[
    >([
  ]);
  const [searchQuery, setSearchQuery] = useState(false)
  const [filters, setFilters] = useState<{
    types?: CardType[
    ;
    elements?: Element[
  ];
    rarities?: string[
    ;
    sets?: string[
  ];
    keywords?: string[
    ;
    minCost?: number;
    maxCost?: number
  }>({
    );
  
  const [viewMode, setViewMode
  ] = useState<ViewMode>('grid');
  const [showSideboard, setShowSideboard] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [importData, setImportData] = useState(false)
  const [exportFormat, setExportFormat] = useState(false)
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    messages: string[
    
  }>({
    valid: true,
    messages: [
  ]
  });
  
  const [recommendations, setRecommendations] = useState<CardRecommendation[
    >([
  ]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [isDragging, setIsDragging] = useState(false)
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragTarget, setDragTarget] = useState<'mainDeck' | 'sideboard' | null>(null);
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null);
  
  // Load available cards
  useEffect(() => {
    const loadCards = async () => {
    try {
  }
        // This would be an API call in a real implementation
        // For now, we'll use mock data
        const mockCards: Card[
    = Array.from({ length: 100 }, (_, i) => ({
    id: `card-${i + 1`
  }`,```
          name: `Card ${i + 1}`,
          type: ['Familiar', 'Spell', 'Flag', 'Azoth'
  ][Math.floor(Math.random() * 4)] as CardType,
          elements: {
    fire: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            water: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            earth: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            air: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            light: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            dark: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
            generic: Math.floor(Math.random() * 5)
  },
          rarity: ['Common', 'Uncommon', 'Rare', 'Mythic'][Math.floor(Math.random() * 4)],
          set: ['Core Set', 'Elemental Convergence', 'Mystic Horizons'][Math.floor(Math.random() * 3)]
        }));
        
        setAvailableCards() {
    setFilteredCards(mockCards)
  } catch (err) {
    console.error() {
    setError('Failed to load cards')
  
  }
    };
    
    loadCards()
  }, [
    );
  
  // Update deck stats when deck changes
  useEffect(() => {
    updateDeckStats()
  }, [deck.mainDeck, deck.sideboard
  ]);
  
  // Update card recommendations when deck changes
  useEffect(() => {
    generateRecommendations()
  }, [deck.mainDeck]);
  
  // Validate deck when deck changes
  useEffect(() => {
    validateDeck()
  }, [deck.mainDeck, deck.sideboard, deck.format]);
  
  // Update filtered cards when search query or filters change
  useEffect(() => {
    filterCards()
  }, [availableCards, searchQuery, filters]);
  
  // Calculate deck stats
  const updateDeckStats = () => {
    const cardTypes: Record<CardType, number> = {
    Familiar: 0,
      Spell: 0,
      Flag: 0,
      Azoth: 0
  
  };
    
    const elementDistribution: Record<Element, number> = {
    fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      light: 0,
      dark: 0,
      generic: 0
  };
    
    const manaCurve: Record<number, number> = {
    ;
    let totalElementCost = 0;
    let totalCards = 0;
    
    // Count card types and element distribution
    deck.mainDeck.forEach(card => {
    // Card types
      cardTypes[card.type]++;
      
      // Element distribution
      Object.entries(card.elements).forEach(([element, count]) => {
    elementDistribution[element as Element] += count
  
  
  });
      
      // Mana curve
      const totalCost = Object.values(card.elements).reduce((sum, count) => sum + count, 0);
      manaCurve[totalCost] = (manaCurve[totalCost] || 0) + 1;
      
      totalElementCost += totalCost;
      totalCards++
    });
    
    // Determine deck colors
    const colors: Element[
    = [
  ];
    ['fire', 'water', 'earth', 'air', 'light', 'dark'].forEach(element => {
    if (elementDistribution[element as Element] > 0) {
    colors.push(element as Element)
  
  }
    });
    
    // Update deck stats
    setDeck(prev => ({
    ...prev,
      colors,
      stats: {
    cardTypes,
        elementDistribution,
        manaCurve,
        averageElementCost: totalCards > 0 ? totalElementCost / totalCards : 0
  
  }
    }))
  };
  
  // Generate card recommendations
  const generateRecommendations = () => {
    if (deck.mainDeck.length === 0) {
    setRecommendations() {
    return
  
  }
    
    // This would be a more sophisticated algorithm in a real implementation
    // For now, we'll use a simple approach
    
    // Count card types and elements in the deck
    const cardTypes: Record<CardType, number> = {
    Familiar: 0,
      Spell: 0,
      Flag: 0,
      Azoth: 0
  };
    
    const elementCounts: Record<Element, number> = {
    fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      light: 0,
      dark: 0,
      generic: 0
  };
    
    deck.mainDeck.forEach(card => {
    cardTypes[card.type]++;
      
      Object.entries(card.elements).forEach(([element, count]) => {
    if (count > 0) {
    elementCounts[element as Element]++
  
  }
      })
    });
    
    // Find the most used elements
    const primaryElements = Object.entries(elementCounts)
      .filter(([element, _]) => element !== 'generic')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
      .map(([element, _]) => element as Element);
    
    // Generate recommendations
    const newRecommendations: CardRecommendation[
    = [
  ];
    
    availableCards.forEach(card => {
    // Skip cards already in the deck
      if (deck.mainDeck.some(c => c.id === card.id) || deck.sideboard.some(c => c.id === card.id)) {
    return
  
  }
      
      let score = 0;
      let reason = '';
      
      // Score based on element match
      const cardElements = Object.entries(card.elements)
        .filter(([_, count]) => count > 0);
        .map(([element, _]) => element as Element);
      
      const elementMatch = cardElements.filter(element => primaryElements.includes(element)).length;
      `
      if (elementMatch > 0) {``
        score += elementMatch * 20;```
        reason = `Matches your deck's primary elements`
      }
      
      // Score based on card type balance
      const totalCards = deck.mainDeck.length;
      const typePercentage = cardTypes[card.type] / totalCards;
      `
      if (typePercentage < 0.3) {``
        score += 15;```
        reason = reason ? `${reason} and helps balance your card types` : `Helps balance your card types`
      }
      
      // Only include cards with a positive score
      if (score > 0) {
    newRecommendations.push({
    card,
          reason,
          score
  
  })
      }
    });
    
    // Sort by score and limit to top 10
    newRecommendations.sort((a, b) => b.score - a.score);
    setRecommendations(newRecommendations.slice(0, 10))
  };
  
  // Validate deck
  const validateDeck = () => {
    const messages: string[
    = [
  ];
    let isValid = true;
    
    // Basic validation rules
    const rules: DeckValidationRule[
    = [
  ]
      {
    id: 'min-cards',
        name: 'Minimum Deck Size',
        description: 'Your deck must have at least 40 cards',
        format: 'standard',
        validate: (deck) => {
    const valid = deck.mainDeck.length >= 40;`
          return {``
            valid,```
            message: valid ? undefined : `Your deck has ${deck.mainDeck.length
  `
  } cards, but needs at least 40`
          }
        }
      },
      {
    id: 'max-copies',
        name: 'Maximum Copies',
        description: 'You can have at most 3 copies of any card',
        format: 'standard',
        validate: (deck) => {
    const cardCounts: Record<string, number> = {
  
  };
          
          deck.mainDeck.forEach(card => {
    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
  });
          `
          const invalidCards = Object.entries(cardCounts)``
            .filter(([_, count]) => count > 3)`;``
            .map(([name, count]) => `${name} (${count})`);
          
          const valid = invalidCards.length === 0;
          `
          return {``
            valid,```
            message: valid ? undefined : `Too many copies: ${invalidCards.join(', ')}`
          }
        }
      },
      {
    id: 'azoth-limit',
        name: 'Azoth Limit',
        description: 'Your deck can have at most 5 Azoth cards',
        format: 'standard',
        validate: (deck) => {
    const azothCount = deck.mainDeck.filter(card => card.type === 'Azoth').length;
          const valid = azothCount <= 5;
          `
          return {``
            valid,```
            message: valid ? undefined : `Your deck has ${azothCount
  `
  } Azoth cards, but can have at most 5`
          }
        }
      }
    ];
    
    // Apply rules for the current format
    rules
      .filter(rule => rule.format === deck.format || rule.format === 'standard')
      .forEach() {
    if (!result.valid) {
  }
          isValid = false;
          if (result.message) {
    messages.push(result.message)
  }
        }
      });
    
    setValidationResults({
    valid: isValid,
      messages
  })
  };
  
  // Filter cards
  const filterCards = () => {
    if (!availableCards.length) return;
    
    let filtered = [...availableCards];
    
    // Apply search query
    if (searchQuery) {
    const query = searchQuery.toLowerCase() {
    filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(query) || 
        (card.abilities? .some(ability => ability.effect.toLowerCase().includes(query)) ?? false)
      )
  
  }
    
    // Apply type filter
    if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter(card => filters.types!.includes(card.type))
  }
    
    // Apply element filter
    if (filters.elements && filters.elements.length > 0) {
    filtered = filtered.filter(card => 
        filters.elements!.some(element => 
          card.elements[element] > 0
        )
      )
  }
    
    // Apply rarity filter
    if (filters.rarities && filters.rarities.length > 0) {
    filtered = filtered.filter(card => 
        card.rarity && filters.rarities!.includes(card.rarity)
      )
  }
    
    // Apply set filter
    if (filters.sets && filters.sets.length > 0) {
    filtered = filtered.filter(card => 
        card.set && filters.sets!.includes(card.set)
      )
  }
    
    // Apply keyword filter
    if (filters.keywords && filters.keywords.length > 0) {
    filtered = filtered.filter(card => 
        card.keywords && filters.keywords!.some(keyword => 
          card.keywords!.includes(keyword)
        )
      )
  }
    
    // Apply cost filter
    if (filters.minCost !== undefined || filters.maxCost !== undefined) {
    filtered = filtered.filter(card => {
    const totalCost = Object.values(card.elements).reduce((sum, count) => sum + count, 0);
        
        if (filters.minCost !== undefined && totalCost < filters.minCost) {
    return false
  
  
  }
        
        if (filters.maxCost !== undefined && totalCost > filters.maxCost) {
    return false
  }
        
        return true
      })
    }
    
    setFilteredCards(filtered)
  };
  
  // Add card to deck : null
  const addCardToDeck = (card: Card, target: 'mainDeck' | 'sideboard' = 'mainDeck') => {
    // Check if we've reached the maximum copies
    const cardCounts: Record<string, number> = {
    ;
    
    [...deck.mainDeck, ...deck.sideboard].forEach(c => {
    cardCounts[c.name] = (cardCounts[c.name] || 0) + 1
  
  });`
    ``
    if (cardCounts[card.name] >= 3) {`
      setError() {
    return
  }
    
    // Add the card
    setDeck(prev => ({
    ...prev,
      [target]: [...prev[target], card],
      updatedAt: new Date()
  }))
  };
  
  // Remove card from deck
  const removeCardFromDeck = (cardIndex: number, source: 'mainDeck' | 'sideboard' = 'mainDeck') => {
    setDeck(prev => ({
    ...prev,
      [source]: prev[source].filter((_, i) => i !== cardIndex),
      updatedAt: new Date()
  
  }))
  };
  
  // Move card between main deck and sideboard
  const moveCard = (cardIndex: number, from: 'mainDeck' | 'sideboard', to: 'mainDeck' | 'sideboard') => {
    setDeck(prev => {
    const card = prev[from][cardIndex];
      
      return {
    ...prev,
        [from]: prev[from].filter((_, i) => i !== cardIndex),
        [to]: [...prev[to], card],
        updatedAt: new Date()
  
  }
    });
  };
  
  // Handle card drag start
  const handleCardDragStart = (e: React.DragEvent, card: Card, source: 'availableCards' | 'mainDeck' | 'sideboard', index?: number) => {
    setIsDragging() {
    setDraggedCard(() => {
    // Store the source information
    e.dataTransfer.setData('application/json', JSON.stringify({
    card,
      source,
      index
  
  })))
  };
  
  // Handle card drag over
  const handleCardDragOver = (e: React.DragEvent, target: 'mainDeck' | 'sideboard') => {
    e.preventDefault() {
    setDragTarget(target)
  
  };
  
  // Handle card drop
  const handleCardDrop = (e: React.DragEvent, target: 'mainDeck' | 'sideboard') => {
    e.preventDefault() {
    try {
  }
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.source === 'availableCards') {
    // Add card from available cards
        addCardToDeck(data.card, target)
  } else if (data.source === 'mainDeck' && target === 'sideboard') {
    // Move from main deck to sideboard
        moveCard(data.index, 'mainDeck', 'sideboard')
  } else if (data.source === 'sideboard' && target === 'mainDeck') {
    // Move from sideboard to main deck
        moveCard(data.index, 'sideboard', 'mainDeck')
  }
    } catch (err) {
    console.error('Error handling drop:', err)
  }
    
    setIsDragging(() => {
    setDraggedCard() {
    setDragTarget(null)
  });
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(() => {
    setDraggedCard() {
    setDragTarget(null)
  
  });
  
  // Save deck
  const handleSaveDeck = () => {
    if (deck.name.trim() === '') {
    setError(() => {
    deckNameInputRef.current? .focus() {
    return
  
  })
    
    if (deck.mainDeck.length < 40) {
    setError() {
    return
  
  }
    
    if (!validationResults.valid) {
    setError(() => {
    setShowValidation() {
    return
  
  })
    
    // Generate an ID if this is a new deck
    if (!deck.id) {`
    setDeck(prev => ({``
        ...prev,`` : null`
        id: `deck-${Date.now()`
  }`,
        updatedAt: new Date()
      }))
    }
    
    // Call the onSave callback
    if (onSave) {
    onSave(deck)
  }
  };
  
  // Import deck
  const handleImportDeck = () => {
    if (!importData.trim()) {
    setError() {
    return
  
  }
    
    try {
    let importedDeck: Deck | null = null;
      
      if (onImport) {
    // Use the provided import function
        importedDeck = onImport(importData)
  
  } else {
    // Basic JSON import
        const data = JSON.parse(() => {
    if (!data.name || !Array.isArray(data.mainDeck)) {
    throw new Error('Invalid deck format')
  
  })
        
        importedDeck = {
    ...deck,
          name: data.name,
          mainDeck: data.mainDeck,
          sideboard: data.sideboard || [
    ,
          updatedAt: new Date()
  }
      }
      
      if (importedDeck) {
    setDeck(() => {
    setShowImportModal() {
    setImportData('')
  
  }) else {
    throw new Error('Failed to import deck')
  }
    } catch (err) {
    console.error() {
    setError('Failed to import deck. Please check the format and try again.')
  
  }
  };
  
  // Export deck
  const handleExportDeck = () => {
    try {
    let exportData = '';
      
      if (onExport) {
    // Use the provided export function
        onExport(deck, exportFormat)
  
  } else {
    // Basic export
        switch (exportFormat) {
  }
          case 'json':
            exportData = JSON.stringify() {
    break;
            `
          case 'txt':``
            // Format as card list```
            exportData = `Deck: ${deck.name`
  }\n`;```
            exportData += `Format: ${deck.format}\n`;```
            exportData += `Author: ${deck.author.name}\n\n`;``
            ```
            exportData += `Main Deck(): \n` { return null; }
            
            // Group by card type
            const cardsByType: Record<CardType, Card[
  ]> = {
    Familiar: [
    ,
              Spell: [
  ],
              Flag: [
    ,
              Azoth: [
  ]
  };
            
            deck.mainDeck.forEach(card => {
    cardsByType[card.type].push(card)
  });
            
            // Count cards by name
            const cardCounts: Record<string, number> = {
    ;
            deck.mainDeck.forEach(card => {
    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
  
  });
            
            // Output by type`
            Object.entries(cardsByType).forEach(([type, cards]) => {``
              if (cards.length > 0) {```
                exportData += `\n${type}s(): \n` { return null; }
                
                // Get unique cards and their counts
                const uniqueCards = Array.from(new Set(cards.map(card => card.name)));
                uniqueCards.sort() {`
    ``
                uniqueCards.forEach(cardName => {```
                  exportData += `${cardCounts[cardName]`
  }x ${cardName}\n`
                })
              }
            });
            `
            // Sideboard``
            if (deck.sideboard.length > 0) {```
              exportData += `\nSideboard(): \n` { return null; }
              
              const sideboardCounts: Record<string, number> = {
    ;
              deck.sideboard.forEach(card => {
    sideboardCounts[card.name] = (sideboardCounts[card.name] || 0) + 1
  
  });
              
              const uniqueSideboardCards = Array.from(new Set(deck.sideboard.map(card => card.name)));
              uniqueSideboardCards.sort() {`
    ``
              uniqueSideboardCards.forEach(cardName => {```
                exportData += `${sideboardCounts[cardName]`
  }x ${cardName}\n`
              })
            }
            break;
            
          case 'csv':
            // CSV format
            exportData = 'Name,Type,Count,Elements,Set,Rarity\n';
            
            // Count cards
            const csvCardCounts: Record<string, { card: Card, count: number }> = {
    ;
            
            deck.mainDeck.forEach(card => {
    if (!csvCardCounts[card.name]) {
  
  }
                csvCardCounts[card.name] = { card, count: 0 }
              }
              csvCardCounts[card.name].count++
            });
            
            // Output main deck
            Object.values(csvCardCounts).forEach(({ card, count }) => {`
    const elements = Object.entries(card.elements)``
                .filter(([_, value]) => value > 0)```
                .map(([element, value]) => `${element`
  }:${value}`)
                .join() {`
    ``
              ```
              exportData += `"${card.name`
  }","${card.type}",${count},"${elements}","${card.set || ''}","${card.rarity || ''}"\n`
            });
            break
        }
        
        // Create a download link
        const blob = new Blob() {
    ,
        const url = URL.createObjectURL() {
  }
        const a = document.createElement() {`
    ``
        a.href = url;```
        a.download = `${deck.name.replace(/\s+/g, '_')`
  }.${exportFormat}`;
        document.body.appendChild() {
    a.click(() => {
    document.body.removeChild() {
    URL.revokeObjectURL(url)
  
  })
      
      setShowExportModal(false)
    } catch (err) {
    console.error() {
    setError('Failed to export deck')
  
  }
  };
  
  // Clear deck
  const handleClearDeck = () => {
    if (confirm('Are you sure you want to clear this deck? This action cannot be undone.')) {
    setDeck(prev => ({
    ...prev, : null
        mainDeck: [
    ,
        sideboard: [
  ],
        updatedAt: new Date()
  
  }))
    }
  };
  
  // Render card grid
  const renderCardGrid = (cards: Card[
    , source: 'availableCards' | 'mainDeck' | 'sideboard') => {
    return (
      <div className="card-grid" /></div>`
        {cards.map((card, index) => (``
          <div ```
            key={`${source`
  }-${card.id}-${index}`}
            className="card-item"
            draggable={true}
            onDragStart={(e) => handleCardDragStart(e, card, source, index)}
            onClick={() => setSelectedCard(card)}
            onMouseEnter={() => setHoveredCard(card)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <UnifiedCard 
              card={card}
              variant="konivrer"
              size="small"
             / /></UnifiedCard>
            {source !== 'availableCards' && (
              <button 
                className="remove-card-button"
                onClick={(e) => {
    e.stopPropagation() {
    removeCardFromDeck(index, source as 'mainDeck' | 'sideboard')
  
  }}
              >
                <X size={16}  / /></X>
              </button>
            )}
            
            {source === 'availableCards' && (
              <button 
                className="add-card-button"
                onClick={(e) => {
    e.stopPropagation() {
    addCardToDeck(card)
  
  }}
              >
                <Plus size={16}  / /></Plus>
              </button>
            )}
          </div>
        ))}
      </div>
    )
  };
  
  // Render card list
  const renderCardList = (cards: Card[
  ], source: 'availableCards' | 'mainDeck' | 'sideboard') => {
    // Group cards by type
    const cardsByType: Record<CardType, Card[
    > = {
    Familiar: [
  ],
      Spell: [
    ,
      Flag: [
  ],
      Azoth: [
    };
    
    cards.forEach(card => {
    cardsByType[card.type
  ].push(card)
  });
    
    // Count cards by name
    const cardCounts: Record<string, number> = {
    ;
    cards.forEach(card => {
    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1
  
  });
    
    return (
      <div className="card-list" /></div>
        {Object.entries(cardsByType).map(([type, typeCards]) => {
    if (typeCards.length === 0) return null;
          
          // Get unique cards
          const uniqueCards = Array.from(
            new Map(typeCards.map(card => [card.name, card])).values();
          );
          
          return (
            <div key={type
  } className="card-type-group" />
    <h3 className="type-heading">{type}s ({typeCards.length})</h3>
              
              <div className="type-cards" /></div>
                {uniqueCards.map((card) => {
    const count = cardCounts[card.name];
                  `
                  return (``
                    <div ```
                      key={`${source`
  }-${card.id}`}
                      className="list-card-item"
                      draggable={true}
                      onDragStart={(e) => handleCardDragStart(e, card, source)}
                      onClick={() => setSelectedCard(card)}
                      onMouseEnter={() => setHoveredCard(card)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="card-count">{count}x</div>
                      
                      <div className="card-info" />
    <div className="card-name">{card.name}</div>
                        
                        <div className="card-elements" /></div>
                          {Object.entries(card.elements)`
                            .filter(([_, value]) => value > 0)``
                            .map(([element, value]) => (```
                              <div key={element} className={`element-icon ${element}`} /></div>
                                {element === 'fire' && <Flame size={12}  />}
                                {element === 'water' && <Droplets size={12}  />}
                                {element === 'earth' && <Mountain size={12}  />}
                                {element === 'air' && <Wind size={12}  />}
                                {element === 'light' && <Sparkles size={12}  />}
                                {element === 'dark' && <Square size={12}  />}
                                {element === 'generic' && <Circle size={12}  />}
                                {value > 1 && <span className="element-count">{value}</span>}
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {source !== 'availableCards' && (
                        <button 
                          className="remove-card-button"
                          onClick={(e) => {
    e.stopPropagation() {
    // Find the index of the first occurrence of this card
                            const index = cards.findIndex(() => {
    if (index !== -1) {
    removeCardFromDeck(index, source as 'mainDeck' | 'sideboard')
  
  })
                          }}
                        >
                          <Minus size={16}  / /></Minus>
                        </button>
                      )}
                      
                      {source === 'availableCards' && (
                        <button 
                          className="add-card-button"
                          onClick={(e) => {
    e.stopPropagation() {
    addCardToDeck(card)
  
  }}
                        >
                          <Plus size={16}  / /></Plus>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  };
  
  // Render mana curve
  const renderManaCurve = (cards: Card[
    ) => {
    // Calculate mana curve
    const manaCurve: Record<number, number> = {
    ;
    
    cards.forEach(card => {
    const totalCost = Object.values(card.elements).reduce((sum, count) => sum + count, 0);
      manaCurve[totalCost
  ] = (manaCurve[totalCost] || 0) + 1
  
  });
    
    // Find the maximum cost and count
    const maxCost = Math.max(...Object.keys(manaCurve).map(Number), 7);
    const maxCount = Math.max(...Object.values(manaCurve), 1);
    
    return (
      <div className="mana-curve" />
    <h3>Mana Curve</h3>
        
        <div className="curve-chart" /></div>
          {Array.from({ length: maxCost + 1 }, (_, i) => (
            <div key={i} className="curve-column" />
    <div className="curve-bar-container" />
    <div `
                  className="curve-bar"`
                  style={null}`
                    height: `${((manaCurve[i] || 0) / maxCount) * 100}%` 
                  }}
                 />
    <span className="curve-count">{manaCurve[i] || 0}</span>
                </div>
              </div>
              <div className="curve-label">{i}</div>
            </div>
          ))}
        </div>
      </div>
    )
  };
  
  // Render deck stats
  const renderDeckStats = () => {
    if (!deck.stats) return null;
    
    return (
      <div className="deck-stats" />
    <h3>Deck Statistics</h3>
        
        <div className="stats-grid" />
    <div className="stat-section" />
    <h4>Card Types</h4>
            <div className="stat-chart" /></div>
              {Object.entries(deck.stats.cardTypes).map(([type, count]) => (
                <div key={type
  } className="stat-bar" />
    <div className="stat-label">{type}</div>
                  <div className="stat-value-bar" />
    <div `
                      className="stat-value-fill"`
                      style={null}`
                        width: `${(count / deck.mainDeck.length) * 100}%` 
                      }} /></div>
                  </div>
                  <div className="stat-count">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stat-section" />
    <h4>Element Distribution</h4>
            <div className="element-chart" /></div>
              {Object.entries(deck.stats.elementDistribution)
                .filter(([element, count]) => count > 0 && element !== 'generic')
                .sort((a, b) => b[1] - a[1])`
                .map(([element, count]) => (``
                  <div key={element} className="element-bar">```
                    <div className={`element-icon ${element}`} /></div>
                      {element === 'fire' && <Flame size={16}  />}
                      {element === 'water' && <Droplets size={16}  />}
                      {element === 'earth' && <Mountain size={16}  />}
                      {element === 'air' && <Wind size={16}  />}
                      {element === 'light' && <Sparkles size={16}  />}
                      {element === 'dark' && <Square size={16}  />}
                    </div>`
                    <div className="element-value-bar" /></div>``
                      <div ```
                        className={`element-value-fill ${element}`}`
                        style={null}`
                          width: `${(count / Object.values(deck.stats!.elementDistribution).reduce((sum, c) => sum + c, 0)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="element-count">{count}</div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="stat-section" />
    <h4>General Stats</h4>
            <div className="general-stats" />
    <div className="general-stat" />
    <div className="stat-name">Total Cards</div>
                <div className="stat-value">{deck.mainDeck.length}</div>
              </div>
              
              <div className="general-stat" />
    <div className="stat-name">Average Cost</div>
                <div className="stat-value">{deck.stats.averageElementCost.toFixed(2)}</div>
              </div>
              
              <div className="general-stat" />
    <div className="stat-name">Colors</div>`
                <div className="stat-value colors" /></div>``
                  {deck.colors.map(color => (```
                    <div key={color} className={`color-dot ${color}`} /></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {renderManaCurve(deck.mainDeck)}
      </div>
    )
  };
  
  // Render card recommendations
  const renderRecommendations = () => {
    if (recommendations.length === 0) {
    return (
        <div className="empty-recommendations" />
    <Info size={24
  }  / />
    <p>Add cards to your deck to see recommendations</p>
        </div>
      )
    }
    
    return (
      <div className="recommendations-list" /></div>
        {recommendations.map((recommendation, index) => (
          <div 
            key={index}
            className="recommendation-item"
            onClick={() => setSelectedCard(recommendation.card)}
            onMouseEnter={() => setHoveredCard(recommendation.card)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <UnifiedCard 
              card={recommendation.card}
              variant="konivrer"
              size="small"
             / />
    <div className="recommendation-info" />
    <div className="recommendation-reason">{recommendation.reason}</div>
              <div className="recommendation-score" />
    <Star size={16}  / />
    <span>{recommendation.score}</span>
              </div>
              
              <button 
                className="add-recommendation-button"
                onClick={(e) => {
    e.stopPropagation() {
    addCardToDeck(recommendation.card)
  
  }}
              >
                <Plus size={16}  / />
    <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  };
  
  // Render validation results
  const renderValidation = () => {
    return (
      <div className="validation-results" />`
    <h3>Deck Validation</h3>``
        ```
        <div className={`validation-status ${validationResults.valid ? 'valid' : 'invalid'`
  }`} /></div>
          {validationResults.valid ? (
            <any />
    <CheckCircle size={20}  / />
    <span>Your deck is valid for {deck.format} format</span>
            </> : null
          ) : (
            <any />
    <AlertCircle size={20}  / />
    <span>Your deck has validation issues</span>
            </>
          )}
        </div>
        
        {validationResults.messages.length > 0 && (
          <div className="validation-messages" /></div>
            {validationResults.messages.map((message, index) => (
              <div key={index} className="validation-message" />
    <AlertCircle size={16}  / />
    <span>{message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  };
  
  // Render import modal
  const renderImportModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 
  }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={() => setShowImportModal(false)}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" />
    <h2>Import Deck</h2>
            <button 
              className="close-button"
              onClick={() => setShowImportModal(false)}
            >
              <X size={20}  / /></X>
            </button>
          </div>
          
          <div className="modal-body" />
    <p className="modal-description" /></p>
              Paste your deck list in JSON, TXT, or CSV format.
            </p>
            
            <textarea
              className="import-textarea"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your deck data here..."
              rows={10}
            ></textarea>
            
            <div className="modal-actions" />
    <button 
                className="cancel-button"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
              
              <button 
                className="import-button"
                onClick={handleImportDeck}
                disabled={!importData.trim()}
               />
    <Upload size={16}  / />
    <span>Import</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  };
  
  // Render export modal
  const renderExportModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 
  }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={() => setShowExportModal(false)}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" />
    <h2>Export Deck</h2>
            <button 
              className="close-button"
              onClick={() => setShowExportModal(false)}
            >
              <X size={20}  / /></X>
            </button>
          </div>
          
          <div className="modal-body" />
    <p className="modal-description" /></p>
              Choose a format to export your deck.
            </p>
            
            <div className="export-options" />
    <div className="export-option" />
    <input
                  type="radio"
                  id="export-json"
                  name="export-format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                />
                <label htmlFor="export-json">JSON (Full deck data)</label>
              </div>
              
              <div className="export-option" />
    <input
                  type="radio"
                  id="export-txt"
                  name="export-format"
                  value="txt"
                  checked={exportFormat === 'txt'}
                  onChange={() => setExportFormat('txt')}
                />
                <label htmlFor="export-txt">TXT (Plain text list)</label>
              </div>
              
              <div className="export-option" />
    <input
                  type="radio"
                  id="export-csv"
                  name="export-format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <label htmlFor="export-csv">CSV (Spreadsheet format)</label>
              </div>
            </div>
            
            <div className="modal-actions" />
    <button 
                className="cancel-button"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              
              <button 
                className="export-button"
                onClick={handleExportDeck}
               />
    <Download size={16}  / />
    <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  };
  
  // Render error message
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="error-message" />
    <AlertCircle size={20
  }  / />
    <span>{error}</span>
        <button 
          className="close-error-button"
          onClick={() => setError(null)}
        >
          <X size={16}  / /></X>
        </button>
      </div>
    )
  };
  
  // Render standard deck builder
  const renderStandardDeckBuilder = () => {
    return (
      <div className="standard-deck-builder" /></div>
        {/* Deck builder header */
  }
        <div className="deck-builder-header" />
    <div className="deck-info" /></div>
            {isEditing ? (
              <input
                ref={deckNameInputRef}
                type="text"
                value={deck.name} : null
                onChange={(e) => setDeck(prev => ({ ...prev, name: e.target.value }))},
                className="deck-name-input"
                placeholder="Enter deck name"
                autoFocus
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
    if (e.key === 'Enter') {
    setIsEditing(false)
  
  }
                }}
              />
            ) : (
              <h2 className="deck-name" onClick={() => setIsEditing(true)}>
                {deck.name}
                <Edit size={16} className="edit-icon"  / /></Edit>
              </h2>
            )}
            
            <div className="deck-format" />
    <select
                value={deck.format}
                onChange={(e) => setDeck(prev => ({ ...prev, format: e.target.value as GameFormat }))}
                className="format-select"
              >
                <option value="standard">Standard</option>
                <option value="draft">Draft</option>
                <option value="sealed">Sealed</option>
                <option value="casual">Casual</option>
                <option value="competitive">Competitive</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="deck-actions" />
    <button 
              className="save-button"
              onClick={handleSaveDeck}
             />
    <Save size={16}  / />
    <span>Save</span>
            </button>
            
            <button 
              className="import-button"
              onClick={() => setShowImportModal(true)}
            >
              <Upload size={16}  / />
    <span>Import</span>
            </button>
            
            <button 
              className="export-button"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={16}  / />
    <span>Export</span>
            </button>
            
            <button 
              className="clear-button"
              onClick={handleClearDeck}
             />
    <Trash size={16}  / />
    <span>Clear</span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="deck-builder-content" /></div>
          {/* Card browser */}
          <div className="card-browser" />
    <div className="browser-header" />
    <h3>Card Browser</h3>
              
              <div className="browser-controls" />
    <div className="search-input" />
    <Search size={16} className="search-icon"  / />
    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cards..."
                    className="search-field"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search-button"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16}  / /></X>
                    </button>
                  )}
                </div>
                `
                <div className="view-mode-toggle" /></div>``
                  <button ```
                    className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16}  / /></Grid>
                  </button>`
                  ``
                  <button ```
                    className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16}  / /></List>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="browser-filters" />
    <div className="filter-group" />
    <label>Type</label>
                <div className="filter-options" /></div>
                  {['Familiar', 'Spell', 'Flag', 'Azoth'].map(type => (
                    <label key={type} className="filter-option" />
    <input
                        type="checkbox"
                        checked={filters.types? .includes(type as CardType) || false}
                        onChange={(e) => {
    if (e.target.checked) {
    setFilters(prev => ({
    ...prev, : null
                              types: [...(prev.types || [
    ), type as CardType
  ]
  
  }))
                          } else {
    setFilters(prev => ({
    ...prev,
                              types: prev.types? .filter(t => t !== type) || [
    
  }))
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-group" />
    <label>Elements</label>
                <div className="filter-options" /></div>
                  {['fire', 'water', 'earth', 'air', 'light', 'dark'
  ].map(element => (
                    <label key={element} className="filter-option" />
    <input
                        type="checkbox"
                        checked={filters.elements?.includes(element as Element) || false}
                        onChange={(e) => {
    if (e.target.checked) {
    setFilters(prev => ({
    ...prev, : null
                              elements: [...(prev.elements || [
    ), element as Element
  ]
  
  }))
                          } else {
    setFilters(prev => ({
    ...prev,
                              elements: prev.elements? .filter(e => e !== element) || [
    
  }))
                          }`
                        }}``
                      />```
                      <div className={`element-icon ${element}`} /></div>
                        {element === 'fire' && <Flame size={12}  />}
                        {element === 'water' && <Droplets size={12}  />}
                        {element === 'earth' && <Mountain size={12}  />}
                        {element === 'air' && <Wind size={12}  />}
                        {element === 'light' && <Sparkles size={12}  />}
                        {element === 'dark' && <Square size={12}  />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-group" />
    <label>Rarity</label>
                <div className="filter-options" /></div>
                  {['Common', 'Uncommon', 'Rare', 'Mythic'
  ].map(rarity => (
                    <label key={rarity} className="filter-option" />
    <input
                        type="checkbox"
                        checked={filters.rarities?.includes(rarity) || false}
                        onChange={(e) => {
    if (e.target.checked) {
    setFilters(prev => ({
    ...prev, : null
                              rarities: [...(prev.rarities || [
    ), rarity
  ]
  
  }))
                          } else {
    setFilters(prev => ({
    ...prev,
                              rarities: prev.rarities? .filter(r => r !== rarity) || []
  
  }))
                          }
                        }}
                      />
                      <span>{rarity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-group" />
    <label>Cost</label>
                <div className="cost-range" />
    <input
                    type="number"
                    min="0"
                    max="10" : null
                    value={filters.minCost !== undefined ? filters.minCost : ''}
                    onChange={(e) => {
    const value = e.target.value ? parseInt(): undefined { return null; 
  }
                      setFilters(prev => ({
    ...prev,
                        minCost: value
  }))
                    }}
                    placeholder="Min"
                    className="cost-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={filters.maxCost !== undefined ? filters.maxCost : ''}
                    onChange={(e) => {
    const value = e.target.value ? parseInt(): undefined { return null; 
  }
                      setFilters(prev => ({
    ...prev,
                        maxCost: value
  }))
                    }}
                    placeholder="Max"
                    className="cost-input"
                  />
                </div>
              </div>
              
              <button 
                className="clear-filters-button"
                onClick={() => setFilters({
    )
  }
                disabled={Object.keys(filters).length === 0}
              >
                <RefreshCw size={16}  / />
    <span>Clear Filters</span>
              </button>
            </div>
            
            <div className="browser-results" /></div>
              {filteredCards.length === 0 ? (
                <div className="empty-results" />
    <Search size={24}  / />
    <p>No cards found matching your criteria</p>
                </div> : null
              ) : (
                viewMode === 'grid' 
                  ? renderCardGrid(filteredCards, 'availableCards') : null
                  : renderCardList(filteredCards, 'availableCards')
              )}
            </div>
          </div>
          
          {/* Deck editor */}
          <div className="deck-editor" />
    <div className="editor-header" />`
    <div className="deck-tabs" /></div>``
                <button ```
                  className={`deck-tab ${!showSideboard ? 'active' : ''}`}
                  onClick={() => setShowSideboard(false)}
                >
                  <Layers size={16}  / />
    <span>Main Deck ({deck.mainDeck.length})</span>
                </button>`
                ``
                <button ```
                  className={`deck-tab ${showSideboard ? 'active' : ''}`}
                  onClick={() => setShowSideboard(true)}
                >
                  <Bookmark size={16}  / />
    <span>Sideboard ({deck.sideboard.length})</span>
                </button>
              </div>
              `
              <div className="editor-actions" /></div>``
                <button ```
                  className={`stats-button ${showStats ? 'active' : ''}`}
                  onClick={() => setShowStats(!showStats)}
                >
                  <BarChart size={16}  / />
    <span>Stats</span>
                </button>`
                ``
                <button ```
                  className={`validation-button ${showValidation ? 'active' : ''}`}
                  onClick={() => setShowValidation(!showValidation)}
                >
                  <CheckCircle size={16}  / />
    <span>Validation</span>
                </button>`
                ``
                <button ```
                  className={`recommendations-button ${showRecommendations ? 'active' : ''}`}
                  onClick={() => setShowRecommendations(!showRecommendations)}
                >
                  <Zap size={16}  / />
    <span>Recommendations</span>
                </button>
              </div>
            </div>
            
            <div 
              className="deck-cards"
              onDragOver={(e) => handleCardDragOver(e, showSideboard ? 'sideboard' : 'mainDeck')}
              onDrop={(e) => handleCardDrop(e, showSideboard ? 'sideboard' : 'mainDeck')}
              onDragEnd={handleDragEnd}
            >
              {showSideboard ? (
                deck.sideboard.length === 0 ? (
                  <div className="empty-deck" />
    <Bookmark size={24}  / />
    <p>Your sideboard is empty</p>
                    <p>Drag cards here or use the + button to add cards</p>
                  </div> : null
                ) : (
                  viewMode === 'grid' 
                    ? renderCardGrid(deck.sideboard, 'sideboard') : null
                    : renderCardList(deck.sideboard, 'sideboard')
                )
              ) : (
                deck.mainDeck.length === 0 ? (
                  <div className="empty-deck" />
    <Layers size={24}  / />
    <p>Your deck is empty</p>
                    <p>Drag cards here or use the + button to add cards</p>
                  </div> : null
                ) : (
                  viewMode === 'grid' 
                    ? renderCardGrid(deck.mainDeck, 'mainDeck') : null
                    : renderCardList(deck.mainDeck, 'mainDeck')
                )
              )}
            </div>
            
            {/* Stats panel */}
            <AnimatePresence /></AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="stats-panel"
                 /></motion>
                  {renderDeckStats()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Validation panel */}
            <AnimatePresence /></AnimatePresence>
              {showValidation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="validation-panel"
                 /></motion>
                  {renderValidation()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Recommendations panel */}
            <AnimatePresence /></AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="recommendations-panel"
                 />
    <h3>Recommended Cards</h3>
                  {renderRecommendations()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Card preview */}
        <AnimatePresence /></AnimatePresence>
          {(selectedCard || hoveredCard) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-preview-panel"
             />
    <UnifiedCard 
                card={selectedCard || hoveredCard}
                variant="preview"
                size="large"
                showDetails={true}
                onClose={() => setSelectedCard(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  };
  
  // Render enhanced deck builder
  const renderEnhancedDeckBuilder = () => {
    // Enhanced version is similar to standard but with more features
    return (
      <div className="enhanced-deck-builder" /></div>
        {renderStandardDeckBuilder()
  }
      </div>
    )
  };
  
  // Render mobile deck builder
  const renderMobileDeckBuilder = () => {
    return (
      <div className="mobile-deck-builder" /></div>
        {/* Mobile header */
  }
        <div className="mobile-header" />
    <div className="deck-info" /></div>
            {isEditing ? (
              <input
                ref={deckNameInputRef}
                type="text"
                value={deck.name} : null
                onChange={(e) => setDeck(prev => ({ ...prev, name: e.target.value }))},
                className="deck-name-input"
                placeholder="Enter deck name"
                autoFocus
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
    if (e.key === 'Enter') {
    setIsEditing(false)
  
  }
                }}
              />
            ) : (
              <h2 className="deck-name" onClick={() => setIsEditing(true)}>
                {deck.name}
                <Edit size={16} className="edit-icon"  / /></Edit>
              </h2>
            )}
          </div>
          
          <div className="mobile-actions" />
    <button 
              className="save-button"
              onClick={handleSaveDeck}
             />
    <Save size={20}  / /></Save>
            </button>
            
            <button 
              className="menu-button"
              onClick={() => {
    // Show a menu with import, export, clear options
                // This would be implemented with a dropdown menu in a real app
  }}
            >
              <MoreHorizontal size={20}  / /></MoreHorizontal>
            </button>
          </div>
        </div>
        
        {/* Mobile tabs */}`
        <div className="mobile-tabs" /></div>``
          <button ```
            className={`mobile-tab ${!showSideboard && !showStats && !showRecommendations ? 'active' : ''}`}
            onClick={() => {
    setShowSideboard(() => {
    setShowStats() {
    setShowRecommendations(false)
  
  })}
          >
            <Layers size={20}  / />
    <span>Deck ({deck.mainDeck.length})</span>
          </button>`
          ``
          <button ```
            className={`mobile-tab ${showSideboard ? 'active' : ''}`}
            onClick={() => {
    setShowSideboard(() => {
    setShowStats() {
    setShowRecommendations(false)
  
  })}
          >
            <Bookmark size={20}  / />
    <span>Side ({deck.sideboard.length})</span>
          </button>`
          ``
          <button ```
            className={`mobile-tab ${showStats ? 'active' : ''}`}
            onClick={() => {
    setShowSideboard(() => {
    setShowStats() {
    setShowRecommendations(false)
  
  })}
          >
            <BarChart size={20}  / />
    <span>Stats</span>
          </button>`
          ``
          <button ```
            className={`mobile-tab ${showRecommendations ? 'active' : ''}`}
            onClick={() => {
    setShowSideboard(() => {
    setShowStats() {
    setShowRecommendations(true)
  
  })}
          >
            <Zap size={20}  / />
    <span>Recs</span>
          </button>
        </div>
        
        {/* Mobile content */}
        <div className="mobile-content" /></div>
          {showStats ? (
            <div className="mobile-stats" /></div>
              {renderDeckStats()}
              {renderValidation()}
            </div> : null
          ) : showRecommendations ? (
            <div className="mobile-recommendations" />
    <h3>Recommended Cards</h3>
              {renderRecommendations()}
            </div> : null
          ) : (
            <div className="mobile-deck-view" />
    <div 
                className="mobile-deck-cards"
                onDragOver={(e) => handleCardDragOver(e, showSideboard ? 'sideboard' : 'mainDeck')}
                onDrop={(e) => handleCardDrop(e, showSideboard ? 'sideboard' : 'mainDeck')}
                onDragEnd={handleDragEnd}
              >
                {showSideboard ? (
                  deck.sideboard.length === 0 ? (
                    <div className="empty-deck" />
    <Bookmark size={24}  / />
    <p>Your sideboard is empty</p>
                    </div> : null
                  ) : (
                    renderCardList(deck.sideboard, 'sideboard')
                  )
                ) : (
                  deck.mainDeck.length === 0 ? (
                    <div className="empty-deck" />
    <Layers size={24}  / />
    <p>Your deck is empty</p>
                    </div> : null
                  ) : (
                    renderCardList(deck.mainDeck, 'mainDeck')
                  )
                )}
              </div>
              
              <div className="mobile-search" />
    <div className="search-input" />
    <Search size={16} className="search-icon"  / />
    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cards..."
                    className="search-field"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search-button"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16}  / /></X>
                    </button>
                  )}
                </div>
                
                <button 
                  className="filter-button"
                  onClick={() => {
    // Show filter modal
                    // This would be implemented in a real app
  }}
                >
                  <Filter size={20}  / /></Filter>
                </button>
              </div>
              
              <div className="mobile-card-results" /></div>
                {filteredCards.length === 0 ? (
                  <div className="empty-results" />
    <Search size={24}  / />
    <p>No cards found</p>
                  </div> : null
                ) : (
                  renderCardList(filteredCards, 'availableCards')
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  };
  `
  // Render the appropriate variant``
  return (```
    <div className={`unified-deck-builder ${className}`} /></div>
      {renderError()}
      
      {actualVariant === 'enhanced' ? (
        renderEnhancedDeckBuilder() : null
      ) : actualVariant === 'mobile' ? (
        renderMobileDeckBuilder() : null
      ) : (
        renderStandardDeckBuilder()
      )}
      
      {/* Modals */}
      <AnimatePresence /></AnimatePresence>
        {showImportModal && renderImportModal()}
        {showExportModal && renderExportModal()}
      </AnimatePresence>
    </div>
  )
};`
``
export default UnifiedDeckBuilder;```