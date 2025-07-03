# KONIVRER Game Mechanics Implementation Guide

This document provides technical guidance for implementing the core game mechanics of KONIVRER based on the official rules.

## Core Game State

The game state should track the following information:

```javascript
// Example game state structure
const gameState = {
  players: {
    player1: {
      health: 20,
      flag: { /* Flag card data */ },
      lifeCards: [/* 4 face-down cards */],
      hand: [/* Cards in hand */],
      field: [/* Cards on field */],
      combatRow: [/* Cards in combat */],
      azothRow: [/* Azoth resources */],
      deck: [/* Remaining cards */],
      removedFromPlay: [/* Void-affected cards */],
      mana: { current: 0, max: 0 }
    },
    player2: {
      // Same structure as player1
    }
  },
  currentTurn: 1,
  activePlayer: 'player1',
  phase: 'DRAW', // DRAW, MAIN, ATTACK, DEFENSE, RESOLUTION, END
  gameLog: [/* Log entries */]
}
```

## Elemental System Implementation

The elemental system is central to KONIVRER. Implement it as follows:

```javascript
// Element types
const ELEMENTS = {
  FIRE: '△',
  WATER: '▽',
  EARTH: '⊡',
  AIR: '△',
  AETHER: '○',
  NETHER: '□',
  GENERIC: '⊗'
};

// Card cost example
const cardCost = {
  [ELEMENTS.FIRE]: 2,
  [ELEMENTS.GENERIC]: 1
};

// Function to check if player can pay the cost
function canPayCost(playerAzoth, cardCost) {
  // Check each element type
  for (const element in cardCost) {
    if (element === ELEMENTS.GENERIC) continue; // Generic is handled separately
    if ((playerAzoth[element] || 0) < cardCost[element]) return false;
  }
  
  // Check if player has enough total Azoth for generic costs
  const totalAvailable = Object.values(playerAzoth).reduce((sum, val) => sum + val, 0);
  const totalRequired = Object.values(cardCost).reduce((sum, val) => sum + val, 0);
  
  return totalAvailable >= totalRequired;
}

// Function to calculate card strength based on excess Azoth spent
function calculateStrength(azothSpent, cardCost) {
  const requiredAzoth = Object.values(cardCost).reduce((sum, val) => sum + val, 0);
  return Math.max(0, azothSpent - requiredAzoth);
}
```

## Turn Phases Implementation

Each turn phase should be implemented with specific allowed actions:

```javascript
// Phase handlers
const phaseHandlers = {
  DRAW: (gameState) => {
    // Draw a card from active player's deck
    const activePlayer = gameState.activePlayer;
    if (gameState.players[activePlayer].deck.length > 0) {
      const drawnCard = gameState.players[activePlayer].deck.pop();
      gameState.players[activePlayer].hand.push(drawnCard);
      gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer} drew a card`);
    }
    
    // Increment mana for the turn
    gameState.players[activePlayer].mana.max = Math.min(10, gameState.players[activePlayer].mana.max + 1);
    gameState.players[activePlayer].mana.current = gameState.players[activePlayer].mana.max;
    
    return gameState;
  },
  
  MAIN: (gameState, action) => {
    // Handle playing cards from hand
    if (action.type === 'PLAY_CARD') {
      const { playerId, cardId, targetId } = action;
      // Implement card playing logic
      // Check costs, apply effects, etc.
    }
    
    return gameState;
  },
  
  ATTACK: (gameState, action) => {
    // Handle declaring attackers
    if (action.type === 'DECLARE_ATTACKER') {
      const { playerId, cardId, targetId } = action;
      // Move card to combat row and mark as attacker
    }
    
    return gameState;
  },
  
  DEFENSE: (gameState, action) => {
    // Handle declaring defenders
    if (action.type === 'DECLARE_DEFENDER') {
      const { playerId, cardId, targetId } = action;
      // Move card to combat row and mark as defender
    }
    
    return gameState;
  },
  
  RESOLUTION: (gameState) => {
    // Resolve combat
    // For each attacker without a blocker, deal damage to opponent
    // For each attacker with a blocker, have them deal damage to each other
    
    return gameState;
  },
  
  END: (gameState) => {
    // End turn cleanup
    // Resolve end-of-turn effects
    // Switch active player
    gameState.activePlayer = gameState.activePlayer === 'player1' ? 'player2' : 'player1';
    
    // If it's now player1's turn, increment the turn counter
    if (gameState.activePlayer === 'player1') {
      gameState.currentTurn++;
    }
    
    // Reset phase to DRAW for next player
    gameState.phase = 'DRAW';
    
    return gameState;
  }
};
```

## Life Cards System

The Life Cards system is unique to KONIVRER and should be implemented as follows:

```javascript
// Initialize life cards
function setupLifeCards(playerDeck) {
  // Shuffle deck
  const shuffledDeck = [...playerDeck].sort(() => Math.random() - 0.5);
  
  // Take top 4 cards as life cards
  const lifeCards = shuffledDeck.splice(0, 4);
  
  return {
    lifeCards,
    remainingDeck: shuffledDeck
  };
}

// Handle damage to player
function damagePlayer(gameState, playerId, damageAmount) {
  // If player has life cards, reveal them instead of reducing health
  if (gameState.players[playerId].lifeCards.length > 0) {
    const revealedCards = [];
    
    for (let i = 0; i < damageAmount; i++) {
      if (gameState.players[playerId].lifeCards.length === 0) break;
      
      const revealedCard = gameState.players[playerId].lifeCards.pop();
      revealedCards.push(revealedCard);
      gameState.gameLog.push(`${playerId} revealed ${revealedCard.name} as a Life Card`);
    }
    
    // Check for game over
    if (gameState.players[playerId].lifeCards.length === 0) {
      gameState.gameOver = true;
      gameState.winner = playerId === 'player1' ? 'player2' : 'player1';
      gameState.gameLog.push(`${gameState.winner} wins the game!`);
    }
    
    return revealedCards;
  } else {
    // If no life cards, reduce health (legacy behavior)
    gameState.players[playerId].health = Math.max(0, gameState.players[playerId].health - damageAmount);
    
    // Check for game over
    if (gameState.players[playerId].health === 0) {
      gameState.gameOver = true;
      gameState.winner = playerId === 'player1' ? 'player2' : 'player1';
      gameState.gameLog.push(`${gameState.winner} wins the game!`);
    }
    
    return [];
  }
}
```

## Flag Card Implementation

Flag cards define a deck's identity and provide special bonuses:

```javascript
// Flag card effects
const flagEffects = {
  // Example flag effect for a Fire-aligned flag
  FIRE_FLAG: {
    name: "Flame Sovereign",
    element: ELEMENTS.FIRE,
    effect: (gameState, playerId) => {
      // Fire cards get +1 strength
      gameState.players[playerId].field.forEach(card => {
        if (card.elements.includes(ELEMENTS.FIRE)) {
          card.strength += 1;
        }
      });
      
      return gameState;
    },
    // Element that this flag is strong against
    strongAgainst: ELEMENTS.EARTH
  }
};

// Apply flag bonus damage
function applyFlagBonusDamage(attackerFlag, defenderElement, baseDamage) {
  if (attackerFlag.strongAgainst === defenderElement) {
    return baseDamage + 1; // +1 damage when attacking weak element
  }
  return baseDamage;
}
```

## Void Keyword Implementation

The Void keyword is a special mechanic that removes cards from play:

```javascript
// Apply Void effect
function applyVoidEffect(gameState, targetCardId, targetPlayerId) {
  // Find the card in any zone
  let targetCard = null;
  let sourceZone = null;
  
  const zones = ['hand', 'field', 'combatRow', 'deck'];
  
  for (const zone of zones) {
    const cardIndex = gameState.players[targetPlayerId][zone].findIndex(card => card.id === targetCardId);
    if (cardIndex >= 0) {
      targetCard = gameState.players[targetPlayerId][zone][cardIndex];
      sourceZone = zone;
      // Remove card from its current zone
      gameState.players[targetPlayerId][zone].splice(cardIndex, 1);
      break;
    }
  }
  
  if (targetCard && sourceZone) {
    // Add card to removed from play zone
    gameState.players[targetPlayerId].removedFromPlay.push(targetCard);
    gameState.gameLog.push(`${targetCard.name} was removed from play from ${targetPlayerId}'s ${sourceZone}`);
  }
  
  return gameState;
}
```

## Networking Considerations

For multiplayer implementation:

1. **State Synchronization**
   - Use WebSockets for real-time updates
   - Send only state changes, not the entire game state
   - Implement reconnection logic to handle disconnects

2. **Action Validation**
   - Validate all actions on the server
   - Prevent cheating by checking if actions are legal
   - Implement timeouts for player actions

3. **Spectator Mode**
   - Allow spectators to view games without affecting state
   - Implement privacy options for tournament play

## Performance Optimization

1. **Card Rendering**
   - Use object pooling for card instances
   - Implement virtual scrolling for large collections
   - Cache card images and data

2. **Animation**
   - Use requestAnimationFrame for smooth animations
   - Disable animations on low-end devices
   - Implement animation queuing for complex sequences

3. **State Management**
   - Use immutable data structures for game state
   - Implement efficient diffing for state updates
   - Consider using a state management library (Redux, MobX)