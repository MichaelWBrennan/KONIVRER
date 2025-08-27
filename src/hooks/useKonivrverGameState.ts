import { useState, useCallback } from 'react';
import type { 
  GameState, 
  PlayerState, 
  Card, 
  GameZone, 
  KonivrverZoneType, 
  KonivrverPhase,
  DragState 
} from '../types/game';

/**
 * KONIVRER-specific game state hook
 * Manages game state according to KONIVRER rules
 */

// TODO: Create card factory function for actual KONIVRER cards from database

// Create KONIVRER zones
const createKonivrverZones : any : any = (): Record<KonivrverZoneType, GameZone> => ({
  field: {
    id: 'field',
    name: 'Field',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'grid',
    position: { x: 200, y: 200, width: 600, height: 300 }
  },
  combatRow: {
    id: 'combatRow',
    name: 'Combat Row',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'row',
    position: { x: 200, y: 150, width: 600, height: 50 }
  },
  azothRow: {
    id: 'azothRow',
    name: 'Azoth Row',
    cards: [], // TODO: Initialize with player's azoth/resource cards
    isVisible: true,
    allowDrop: true,
    layout: 'row',
    position: { x: 0, y: 550, width: 1000, height: 100 }
  },
  hand: {
    id: 'hand',
    name: 'Hand',
    cards: [], // TODO: Initialize with player's starting hand
    isVisible: true,
    allowDrop: false,
    layout: 'fan',
    position: { x: 100, y: 650, width: 800, height: 150 }
  },
  deck: {
    id: 'deck',
    name: 'Deck',
    cards: [], // TODO: Initialize with player's deck cards
    isVisible: false,
    allowDrop: false,
    layout: 'stack',
    position: { x: 850, y: 50, width: 80, height: 120 }
  },
  lifeCards: {
    id: 'lifeCards',
    name: 'Life Cards',
    cards: [], // TODO: Initialize with player's life cards
    isVisible: true,
    allowDrop: false,
    layout: 'stack',
    position: { x: 50, y: 200, width: 100, height: 150 }
  },
  flag: {
    id: 'flag',
    name: 'Flag',
    cards: [], // TODO: Initialize with player's flag card
    isVisible: true,
    allowDrop: false,
    layout: 'stack',
    position: { x: 50, y: 50, width: 100, height: 150 }
  },
  removedFromPlay: {
    id: 'removedFromPlay',
    name: 'Removed from Play',
    cards: [],
    isVisible: true,
    allowDrop: true,
    layout: 'stack',
    position: { x: 850, y: 400, width: 100, height: 150 }
  },
  stack: {
    id: 'stack',
    name: 'Stack (DRC)',
    cards: [],
    isVisible: true,
    allowDrop: false,
    layout: 'stack',
    position: { x: 450, y: 50, width: 100, height: 150 }
  }
});

// Create KONIVRER player
const createKonivrverPlayer : any : any = (id: string, name: string): PlayerState => ({
  id,
  name,
  azothPool: { fire: 3, water: 2, earth: 1, air: 0, light: 0, dark: 0, neutral: 0 },
  zones: createKonivrverZones(),
  flag: undefined // TODO: Initialize with player's flag card
});

export const useKonivrverGameState : any : any = () => {
  // Initialize KONIVRER game state
  const [gameState, setGameState] : any : any = useState<GameState>(() => ({
    players: [
      createKonivrverPlayer('player1', 'Player 1'),
      createKonivrverPlayer('player2', 'Player 2')
    ],
    currentPlayer: 0,
    turn: 1,
    phase: 'preGame',
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
  }));

  const [dragState, setDragState] : any : any = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    validDropZones: []
  });

  // Get current player's life total from life cards
  const getCurrentPlayerLife : any : any = useCallback(() => {
    const currentPlayer : any : any = gameState.players[gameState.currentPlayer];
    return currentPlayer.zones.lifeCards?.cards.length || 0;
  }, [gameState.currentPlayer, gameState.players]);

  // Start drag operation
  const startDrag : any : any = useCallback((card: Card, sourceZone: KonivrverZoneType) => {
    // Determine valid drop zones for this card
    let validZones: KonivrverZoneType[] = [];
    
    switch (card.lesserType) {
      case 'Familiar':
        validZones = ['field', 'combatRow'];
        break;
      case 'Instant Spell':
      case 'Spell':
        validZones = ['stack'];
        break;
      case 'Resource':
        validZones = ['azothRow'];
        break;
      default:
        validZones = ['field'];
    }

    setDragState({
      isDragging: true,
      draggedCard: card,
      sourceZone,
      validDropZones: validZones,
      dragOffset: { x: 0, y: 0 }
    });
  }, []);

  // End drag operation
  const endDrag : any : any = useCallback(() => {
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      validDropZones: []
    });
  }, []);

  // Handle zone drop
  const handleZoneDrop : any : any = useCallback((targetZone: KonivrverZoneType) => {
    if (!dragState.draggedCard || !dragState.sourceZone) return;

    const { draggedCard, sourceZone } : any : any = dragState;

    setGameState(prev => {
      const newState : any : any = { ...prev };
      const currentPlayerIndex : any : any = newState.currentPlayer;
      const player : any : any = newState.players[currentPlayerIndex];

      // Remove card from source zone
      const sourceZoneCards : any : any = player.zones[sourceZone].cards;
      const cardIndex : any : any = sourceZoneCards.findIndex(c => c.id === draggedCard.id);
      if (cardIndex >= 0) {
        sourceZoneCards.splice(cardIndex, 1);
      }

      // Add card to target zone
      player.zones[targetZone].cards.push(draggedCard);

      return newState;
    });

    endDrag();
  }, [dragState, endDrag]);

  // Advance to next phase
  const nextPhase : any : any = useCallback(() => {
    setGameState(prev => {
      const phases: KonivrverPhase[] : any : any = ['preGame', 'start', 'main', 'combat', 'postCombat', 'refresh'];
      const currentPhaseIndex : any : any = phases.indexOf(prev.phase);
      const nextPhaseIndex : any : any = (currentPhaseIndex + 1) % phases.length;
      
      let newState = { ...prev, phase: phases[nextPhaseIndex] };
      
      // If we're going back to preGame, advance to next turn and switch players
      if (phases[nextPhaseIndex] === 'preGame') {
        newState.turn += 1;
        newState.currentPlayer = 1 - newState.currentPlayer;
        newState.activePlayer = newState.currentPlayer;
        newState.priorityPlayer = newState.currentPlayer;
      }
      
      return newState;
    });
  }, []);

  // Draw a card
  const drawCard : any : any = useCallback(() => {
    setGameState(prev => {
      const newState : any : any = { ...prev };
      const player : any : any = newState.players[newState.currentPlayer];
      const deck : any : any = player.zones.deck;
      const hand : any : any = player.zones.hand;
      
      if (deck.cards.length > 0) {
        const drawnCard : any : any = deck.cards.pop()!;
        hand.cards.push(drawnCard);
      }
      
      return newState;
    });
  }, []);

  // Play a card from hand
  const playCard : any : any = useCallback((card: Card) => {
    // Check if player has enough Azoth
    const currentPlayer : any : any = gameState.players[gameState.currentPlayer];
    const hasEnoughAzoth : any : any = card.elements.every(element => {
      const azothKey : any : any = element.toLowerCase() as keyof typeof currentPlayer.azothPool;
      return currentPlayer.azothPool[azothKey] >= (card.azothCost || 0);
    });

    if (!hasEnoughAzoth) {
      console.log('Not enough Azoth to play this card');
      return;
    }

    // Determine target zone based on card type
    let targetZone: KonivrverZoneType;
    if (card.lesserType === 'Familiar') {
      targetZone = 'field';
    } else if (card.lesserType?.includes('Instant') || card.lesserType?.includes('Spell')) {
      targetZone = 'stack';
    } else {
      targetZone = 'field';
    }

    setGameState(prev => {
      const newState : any : any = { ...prev };
      const player : any : any = newState.players[newState.currentPlayer];
      
      // Remove card from hand
      const handIndex : any : any = player.zones.hand.cards.findIndex(c => c.id === card.id);
      if (handIndex >= 0) {
        player.zones.hand.cards.splice(handIndex, 1);
        
        // Add card to target zone
        player.zones[targetZone].cards.push(card);
        
        // Deduct Azoth cost
        card.elements.forEach(element => {
          const azothKey : any : any = element.toLowerCase() as keyof typeof player.azothPool;
          if (player.azothPool[azothKey] >= (card.azothCost || 0)) {
            player.azothPool[azothKey] -= (card.azothCost || 0);
          }
        });
      }
      
      return newState;
    });
  }, [gameState]);

  return {
    gameState,
    dragState,
    getCurrentPlayerLife,
    startDrag,
    endDrag,
    handleZoneDrop,
    nextPhase,
    drawCard,
    playCard
  };
};