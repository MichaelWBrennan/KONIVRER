import { useState, useCallback } from 'react';
import { GameState, Card, PlayerState, GameZone, DragState } from '../types/game';

// Demo card data to simulate KONIVRER Arena cards
const createDemoCard = (id: string, name: string, manaCost: number, type: string, color?: string): Card => ({
  id,
  name,
  elements: [color || 'neutral'],
  lesserType: type,
  azothCost: manaCost,
  setCode: 'DEMO',
  setNumber: parseInt(id.replace('demo_', '')),
  rarity: 'common',
  power: type.toLowerCase().includes('creature') || type.toLowerCase().includes('familiar') ? Math.floor(Math.random() * 5) + 1 : undefined,
  toughness: type.toLowerCase().includes('creature') || type.toLowerCase().includes('familiar') ? Math.floor(Math.random() * 5) + 1 : undefined,
  // Legacy compatibility
  manaCost,
  type,
  color,
  text: `Demo ${type} for KONIVRER`,
  description: `Demo ${type} for KONIVRER`,
});

const createInitialZones = (): Record<string, GameZone> => ({
  hand: {
    id: 'hand',
    name: 'Hand',
    cards: [
      createDemoCard('card1', 'Lightning Bolt', 1, 'Instant', 'red'),
      createDemoCard('card2', 'Forest', 0, 'Basic Land', 'green'),
      createDemoCard('card3', 'Serra Angel', 5, 'Creature - Angel', 'white'),
      createDemoCard('card4', 'Counterspell', 2, 'Instant', 'blue'),
      createDemoCard('card5', 'Dark Ritual', 1, 'Instant', 'black'),
      createDemoCard('card6', 'Giant Growth', 1, 'Instant', 'green'),
      createDemoCard('card7', 'Fireball', 1, 'Sorcery', 'red')
    ],
    isVisible: true,
    allowDrop: true,
    layout: 'fan'
  },
  battlefield: {
    id: 'battlefield',
    name: 'Battlefield',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'grid'
  },
  library: {
    id: 'library',
    name: 'Library',
    cards: Array.from({ length: 53 }, (_, i) => 
      createDemoCard(`lib${i}`, `Library Card ${i + 1}`, 1, 'Creature', 'colorless')
    ),
    isVisible: false,
    allowDrop: false,
    layout: 'stack'
  },
  graveyard: {
    id: 'graveyard',
    name: 'Graveyard',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'stack'
  },
  exile: {
    id: 'exile',
    name: 'Exile',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'stack'
  },
  stack: {
    id: 'stack',
    name: 'Stack',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'stack'
  }
});

const createInitialPlayer = (id: string, name: string): PlayerState => ({
  id,
  name,
  azothPool: { fire: 0, water: 0, earth: 0, air: 0, light: 0, dark: 0, neutral: 0 },
  zones: createInitialZones() as any, // Type cast to avoid zone type mismatch for now
  // Legacy compatibility
  life: 20,
  manaPool: { white: 0, blue: 0, black: 0, red: 0, green: 0, colorless: 0 }
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [
      createInitialPlayer('player1', 'You'),
      createInitialPlayer('player2', 'Opponent')
    ],
    currentPlayer: 0,
    turn: 1,
    phase: 'main',
    stack: [],
    activePlayer: 0,
    priorityPlayer: 0,
    deckConstructionRules: {
      totalCards: 40,
      commonCards: 25,
      uncommonCards: 13,
      rareCards: 2,
      flagRequired: true,
      maxCopiesPerCard: 1
    }
  });

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    validDropZones: []
  });

  const selectCard = useCallback((card: Card) => {
    setGameState(prev => {
      const newState = { ...prev };
      // Find and update the card's selection state
      for (const player of newState.players) {
        for (const zone of Object.values(player.zones)) {
          const cardIndex = zone.cards.findIndex(c => c.id === card.id);
          if (cardIndex !== -1) {
            zone.cards[cardIndex] = { 
              ...zone.cards[cardIndex], 
              isSelected: !zone.cards[cardIndex].isSelected 
            };
            
            if (zone.cards[cardIndex].isSelected) {
              setSelectedCards(prev => [...prev, zone.cards[cardIndex]]);
            } else {
              setSelectedCards(prev => prev.filter(c => c.id !== card.id));
            }
            break;
          }
        }
      }
      return newState;
    });
  }, []);

  const doubleClickCard = useCallback((card: Card) => {
    // Auto-play logic: move to appropriate zone
    if (card.type.toLowerCase().includes('land')) {
      moveCard(card.id, 'battlefield');
    } else if (card.type.toLowerCase().includes('creature')) {
      moveCard(card.id, 'battlefield');
    } else {
      moveCard(card.id, 'stack');
    }
  }, []);

  const rightClickCard = useCallback((card: Card) => {
    // Toggle tap state for mobile long-press or desktop right-click
    setGameState(prev => {
      const newState = { ...prev };
      for (const player of newState.players) {
        for (const zone of Object.values(player.zones)) {
          const cardIndex = zone.cards.findIndex(c => c.id === card.id);
          if (cardIndex !== -1) {
            zone.cards[cardIndex] = { 
              ...zone.cards[cardIndex], 
              isTapped: !zone.cards[cardIndex].isTapped 
            };
            break;
          }
        }
      }
      return newState;
    });
  }, []);

  const startDrag = useCallback((card: Card, position: { x: number; y: number }) => {
    // Determine valid drop zones based on card type and current zone
    const validDropZones = ['battlefield', 'graveyard', 'exile', 'hand'];
    if (card.type.toLowerCase().includes('instant') || card.type.toLowerCase().includes('sorcery')) {
      validDropZones.push('stack');
    }

    setDragState({
      isDragging: true,
      draggedCard: card,
      dragOffset: position,
      sourceZone: findCardZone(card.id),
      validDropZones
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false, draggedCard: undefined }));
  }, []);

  const findCardZone = useCallback((cardId: string): string | undefined => {
    for (const player of gameState.players) {
      for (const [zoneId, zone] of Object.entries(player.zones)) {
        if (zone.cards.some(c => c.id === cardId)) {
          return zoneId;
        }
      }
    }
    return undefined;
  }, [gameState]);

  const moveCard = useCallback((cardId: string, targetZoneId: string, playerIndex: number = 0) => {
    setGameState(prev => {
      const newState = { ...prev };
      let sourceCard: Card | undefined;

      // Find and remove card from source zone
      for (const player of newState.players) {
        for (const [, zone] of Object.entries(player.zones)) {
          const cardIndex = zone.cards.findIndex(c => c.id === cardId);
          if (cardIndex !== -1) {
            sourceCard = zone.cards[cardIndex];
            zone.cards.splice(cardIndex, 1);
            break;
          }
        }
        if (sourceCard) break;
      }

      // Add card to target zone
      if (sourceCard && newState.players[playerIndex].zones[targetZoneId]) {
        // Reset card state when moving
        const resetCard = { 
          ...sourceCard, 
          isSelected: false, 
          isTapped: targetZoneId === 'battlefield' ? sourceCard.isTapped : false 
        };
        newState.players[playerIndex].zones[targetZoneId].cards.push(resetCard);
      }

      return newState;
    });

    // Clear drag state
    setDragState(prev => ({ ...prev, isDragging: false, draggedCard: undefined }));
  }, []);

  const handleZoneDrop = useCallback((zoneId: string) => {
    if (dragState.draggedCard) {
      moveCard(dragState.draggedCard.id, zoneId);
    }
  }, [dragState.draggedCard, moveCard]);

  const nextTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: 1 - prev.currentPlayer,
      turn: prev.currentPlayer === 1 ? prev.turn + 1 : prev.turn,
      phase: 'untap'
    }));
  }, []);

  const nextPhase = useCallback(() => {
    const phases: GameState['phase'][] = ['untap', 'upkeep', 'draw', 'main1', 'combat', 'main2', 'end', 'cleanup'];
    const currentIndex = phases.indexOf(gameState.phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    
    setGameState(prev => ({
      ...prev,
      phase: phases[nextIndex]
    }));
  }, [gameState.phase]);

  return {
    gameState,
    selectedCards,
    dragState,
    selectCard,
    doubleClickCard,
    rightClickCard,
    startDrag,
    endDrag,
    handleZoneDrop,
    moveCard,
    nextTurn,
    nextPhase
  };
};