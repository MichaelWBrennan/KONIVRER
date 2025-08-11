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

// Create a KONIVRER demo card
const createKonivrverCard = (id: string, name: string, lesserType: string, elements: string[], azothCost: number, rarity: 'common' | 'uncommon' | 'rare' = 'common'): Card => ({
  id,
  name,
  elements,
  lesserType,
  azothCost,
  rarity,
  setCode: 'KNR',
  setNumber: parseInt(id.replace('knr_', '')),
  power: lesserType === 'Familiar' ? azothCost : undefined,
  toughness: lesserType === 'Familiar' ? azothCost : undefined,
  rulesText: `A ${elements.join('/')} ${lesserType}.`,
  abilities: elements.includes('Fire') ? ['inferno'] : elements.includes('Water') ? ['submerged'] : undefined
});

// Create KONIVRER zones
const createKonivrverZones = (): Record<KonivrverZoneType, GameZone> => ({
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
    cards: [
      createKonivrverCard('knr_1', 'Fire Azoth', 'Resource', ['Fire'], 0),
      createKonivrverCard('knr_2', 'Water Azoth', 'Resource', ['Water'], 0),
      createKonivrverCard('knr_3', 'Earth Azoth', 'Resource', ['Earth'], 0)
    ],
    isVisible: true,
    allowDrop: true,
    layout: 'row',
    position: { x: 0, y: 550, width: 1000, height: 100 }
  },
  hand: {
    id: 'hand',
    name: 'Hand',
    cards: [
      createKonivrverCard('knr_4', 'Fire Salamander', 'Familiar', ['Fire'], 2, 'uncommon'),
      createKonivrverCard('knr_5', 'Lightning Bolt', 'Instant Spell', ['Fire'], 1),
      createKonivrverCard('knr_6', 'Water Undine', 'Familiar', ['Water'], 2, 'uncommon'),
      createKonivrverCard('knr_7', 'Healing Mist', 'Spell', ['Water'], 1)
    ],
    isVisible: true,
    allowDrop: false,
    layout: 'fan',
    position: { x: 100, y: 650, width: 800, height: 150 }
  },
  deck: {
    id: 'deck',
    name: 'Deck',
    cards: Array(36).fill(null).map((_, i) => 
      createKonivrverCard(`knr_${i + 8}`, `Demo Card ${i + 1}`, 'Spell', ['Fire'], 1)
    ),
    isVisible: false,
    allowDrop: false,
    layout: 'stack',
    position: { x: 850, y: 50, width: 80, height: 120 }
  },
  lifeCards: {
    id: 'lifeCards',
    name: 'Life Cards',
    cards: Array(20).fill(null).map((_, i) => 
      createKonivrverCard(`knr_life_${i}`, 'Life Card', 'Life', ['Neutral'], 0)
    ),
    isVisible: true,
    allowDrop: false,
    layout: 'stack',
    position: { x: 50, y: 200, width: 100, height: 150 }
  },
  flag: {
    id: 'flag',
    name: 'Flag',
    cards: [
      createKonivrverCard('knr_flag', 'Fire/Water Flag', 'Flag', ['Fire', 'Water'], 0, 'rare')
    ],
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
const createKonivrverPlayer = (id: string, name: string): PlayerState => ({
  id,
  name,
  azothPool: { fire: 3, water: 2, earth: 1, air: 0, light: 0, dark: 0, neutral: 0 },
  zones: createKonivrverZones(),
  flag: createKonivrverCard('knr_flag', 'Fire/Water Flag', 'Flag', ['Fire', 'Water'], 0, 'rare')
});

export const useKonivrverGameState = () => {
  // Initialize KONIVRER game state
  const [gameState, setGameState] = useState<GameState>(() => ({
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

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    validDropZones: []
  });

  // Get current player's life total from life cards
  const getCurrentPlayerLife = useCallback(() => {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    return currentPlayer.zones.lifeCards?.cards.length || 0;
  }, [gameState.currentPlayer, gameState.players]);

  // Start drag operation
  const startDrag = useCallback((card: Card, sourceZone: KonivrverZoneType) => {
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
  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      validDropZones: []
    });
  }, []);

  // Handle zone drop
  const handleZoneDrop = useCallback((targetZone: KonivrverZoneType) => {
    if (!dragState.draggedCard || !dragState.sourceZone) return;

    const { draggedCard, sourceZone } = dragState;

    setGameState(prev => {
      const newState = { ...prev };
      const currentPlayerIndex = newState.currentPlayer;
      const player = newState.players[currentPlayerIndex];

      // Remove card from source zone
      const sourceZoneCards = player.zones[sourceZone].cards;
      const cardIndex = sourceZoneCards.findIndex(c => c.id === draggedCard.id);
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
  const nextPhase = useCallback(() => {
    setGameState(prev => {
      const phases: KonivrverPhase[] = ['preGame', 'start', 'main', 'combat', 'postCombat', 'refresh'];
      const currentPhaseIndex = phases.indexOf(prev.phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      
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
  const drawCard = useCallback(() => {
    setGameState(prev => {
      const newState = { ...prev };
      const player = newState.players[newState.currentPlayer];
      const deck = player.zones.deck;
      const hand = player.zones.hand;
      
      if (deck.cards.length > 0) {
        const drawnCard = deck.cards.pop()!;
        hand.cards.push(drawnCard);
      }
      
      return newState;
    });
  }, []);

  // Play a card from hand
  const playCard = useCallback((card: Card) => {
    // Check if player has enough Azoth
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const hasEnoughAzoth = card.elements.every(element => {
      const azothKey = element.toLowerCase() as keyof typeof currentPlayer.azothPool;
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
      const newState = { ...prev };
      const player = newState.players[newState.currentPlayer];
      
      // Remove card from hand
      const handIndex = player.zones.hand.cards.findIndex(c => c.id === card.id);
      if (handIndex >= 0) {
        player.zones.hand.cards.splice(handIndex, 1);
        
        // Add card to target zone
        player.zones[targetZone].cards.push(card);
        
        // Deduct Azoth cost
        card.elements.forEach(element => {
          const azothKey = element.toLowerCase() as keyof typeof player.azothPool;
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