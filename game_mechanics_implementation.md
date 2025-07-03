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

## Gameplay Phases Implementation

The game is divided into several phases, implemented as follows:

```javascript
// Game initialization with Pre-Game Actions
function initializeGame(player1Deck, player2Deck) {
  const gameState = createEmptyGameState();
  
  // Set up player 1
  gameState.players.player1.deck = shuffleDeck(player1Deck);
  
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player1LifeCards = gameState.players.player1.deck.splice(0, 4);
  gameState.players.player1.lifeCards = player1LifeCards;
  
  // Set up player 2
  gameState.players.player2.deck = shuffleDeck(player2Deck);
  
  // Pre-Game Action: Take top 4 cards as Life Cards
  const player2LifeCards = gameState.players.player2.deck.splice(0, 4);
  gameState.players.player2.lifeCards = player2LifeCards;
  
  // Set up Flags
  const player1Flag = player1Deck.find(card => card.type === 'Flag');
  const player2Flag = player2Deck.find(card => card.type === 'Flag');
  
  gameState.players.player1.flagZone = player1Flag;
  gameState.players.player2.flagZone = player2Flag;
  
  // Start Phase: Draw 2 cards (only at game start)
  drawCards(gameState, 'player1', 2);
  drawCards(gameState, 'player2', 2);
  
  // Initialize first turn
  gameState.currentTurn = 1;
  gameState.activePlayer = 'player1';
  gameState.phase = 'START';
  
  // Log game start
  gameState.gameLog.push('Game started');
  
  return gameState;
}

// Phase handlers
const phaseHandlers = {
  // Start Phase
  START: (gameState) => {
    const activePlayer = gameState.activePlayer;
    
    // Update phase
    gameState.phase = 'START';
    gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Start Phase`);
    
    // Only draw 2 cards at the very beginning of the game (handled in initializeGame)
    // For subsequent turns, no card draw happens in Start Phase
    
    // Allow player to optionally place 1 card as Azoth
    // This is handled through user action, not automatically
    
    return gameState;
  },
  
  // Main Phase
  MAIN: (gameState, action) => {
    const activePlayer = gameState.activePlayer;
    
    // Update phase if just entering
    if (gameState.phase !== 'MAIN') {
      gameState.phase = 'MAIN';
      gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Main Phase`);
    }
    
    // Handle different action types
    if (action) {
      switch (action.type) {
        case 'PLAY_CARD_SUMMON':
          // Summon: Play card as Familiar with +1 counters
          return playSummon(gameState, action.playerId, action.cardId, action.azothSpent);
          
        case 'PLAY_CARD_TRIBUTE':
          // Tribute: Reduce cost by sacrificing Familiars
          return playTribute(gameState, action.playerId, action.cardId, action.tributeCardIds);
          
        case 'PLAY_CARD_AZOTH':
          // Azoth: Place card in Azoth Row
          return playAzoth(gameState, action.playerId, action.cardId, action.elementType);
          
        case 'PLAY_CARD_SPELL':
          // Spell: Play card as one-time effect
          return playSpell(gameState, action.playerId, action.cardId, action.azothSpent, action.abilityIndex);
          
        case 'PLAY_CARD_BURST':
          // Burst: Play card for free from Life Cards
          return playBurst(gameState, action.playerId, action.cardId);
      }
    }
    
    return gameState;
  },
  
  // Combat Phase
  COMBAT: (gameState, action) => {
    const activePlayer = gameState.activePlayer;
    const defendingPlayer = activePlayer === 'player1' ? 'player2' : 'player1';
    
    // Update phase if just entering
    if (gameState.phase !== 'COMBAT') {
      gameState.phase = 'COMBAT';
      gameState.gameLog.push(`Turn ${gameState.currentTurn}: Combat Phase`);
    }
    
    // Handle different action types
    if (action) {
      switch (action.type) {
        case 'DECLARE_ATTACKER':
          // Move Familiar to Combat Row as attacker
          return declareAttacker(gameState, action.playerId, action.cardId, action.targetId);
          
        case 'DECLARE_DEFENDER':
          // Move Familiar to Combat Row as defender
          return declareDefender(gameState, action.playerId, action.cardId, action.attackerCardId);
          
        case 'RESOLVE_COMBAT':
          // Resolve all combat
          return resolveCombat(gameState);
      }
    }
    
    return gameState;
  },
  
  // Post-Combat Main Phase
  POST_COMBAT_MAIN: (gameState, action) => {
    const activePlayer = gameState.activePlayer;
    
    // Update phase if just entering
    if (gameState.phase !== 'POST_COMBAT_MAIN') {
      gameState.phase = 'POST_COMBAT_MAIN';
      gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Post-Combat Main Phase`);
    }
    
    // Handle playing additional cards (same actions as Main Phase)
    if (action) {
      return phaseHandlers.MAIN(gameState, action);
    }
    
    return gameState;
  },
  
  // Refresh Phase
  REFRESH: (gameState) => {
    const activePlayer = gameState.activePlayer;
    
    // Update phase
    gameState.phase = 'REFRESH';
    gameState.gameLog.push(`Turn ${gameState.currentTurn}: ${activePlayer}'s Refresh Phase`);
    
    // Refresh all rested Azoth (turn vertical)
    gameState.players[activePlayer].azothRow.forEach(azoth => {
      azoth.rested = false;
    });
    
    // End turn cleanup
    // Switch active player
    gameState.activePlayer = activePlayer === 'player1' ? 'player2' : 'player1';
    
    // If it's now player1's turn, increment the turn counter
    if (gameState.activePlayer === 'player1') {
      gameState.currentTurn++;
    }
    
    // Reset phase to START for next player
    gameState.phase = 'START';
    
    return gameState;
  }
};

// Implementation of specific card playing methods

// Summon: Play card as Familiar with +1 counters
function playSummon(gameState, playerId, cardId, azothSpent) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Check if card can be played as Familiar
  if (card.type !== 'Familiar') {
    gameState.gameLog.push(`Error: ${card.name} cannot be summoned (not a Familiar)`);
    return gameState;
  }
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: Cannot pay elemental cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  gameState = payCardCost(gameState, playerId, card.elements);
  
  // Calculate +1 counters based on generic Azoth spent
  const genericCost = card.elements.generic || 0;
  const counters = Math.max(0, azothSpent - genericCost);
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card strength and health with counters
  playedCard.strength = playedCard.baseStrength + counters;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = counters;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  gameState.players[playerId].field.push(playedCard);
  
  // Log the action
  gameState.gameLog.push(`${playerId} summons ${playedCard.name} with ${counters} +1 counters`);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

// Tribute: Reduce cost by sacrificing Familiars
function playTribute(gameState, playerId, cardId, tributeCardIds) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Calculate cost reduction from tributes
  let costReduction = 0;
  const tributeCards = [];
  
  for (const tributeId of tributeCardIds) {
    const fieldIndex = gameState.players[playerId].field.findIndex(c => c.id === tributeId);
    
    if (fieldIndex === -1) {
      gameState.gameLog.push(`Error: Tribute card ${tributeId} not found on field`);
      return gameState;
    }
    
    const tributeCard = gameState.players[playerId].field[fieldIndex];
    
    // Cost reduction = sum of element costs + counters
    const elementCosts = Object.values(tributeCard.elements).reduce((sum, cost) => sum + cost, 0);
    costReduction += elementCosts + (tributeCard.counters || 0);
    
    tributeCards.push(tributeCard);
  }
  
  // Apply cost reduction
  const reducedElements = {...card.elements};
  let remainingReduction = costReduction;
  
  // Reduce generic cost first
  if (reducedElements.generic) {
    const reduction = Math.min(reducedElements.generic, remainingReduction);
    reducedElements.generic -= reduction;
    remainingReduction -= reduction;
  }
  
  // Reduce other elements if there's still reduction left
  for (const element in reducedElements) {
    if (element === 'generic') continue;
    
    if (remainingReduction > 0 && reducedElements[element] > 0) {
      const reduction = Math.min(reducedElements[element], remainingReduction);
      reducedElements[element] -= reduction;
      remainingReduction -= reduction;
    }
  }
  
  // Check if player can pay the reduced cost
  if (!canPayCost(gameState.players[playerId].azoth, reducedElements)) {
    gameState.gameLog.push(`Error: Cannot pay reduced cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the reduced cost
  gameState = payCardCost(gameState, playerId, reducedElements);
  
  // Remove tributed cards from field and add to removed from play
  for (const tributeCard of tributeCards) {
    const fieldIndex = gameState.players[playerId].field.findIndex(c => c.id === tributeCard.id);
    const removedCard = gameState.players[playerId].field.splice(fieldIndex, 1)[0];
    gameState.players[playerId].removedFromPlay.push(removedCard);
    
    gameState.gameLog.push(`${playerId} tributes ${removedCard.name}`);
  }
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set card properties
  playedCard.strength = playedCard.baseStrength;
  playedCard.health = playedCard.baseHealth;
  playedCard.counters = 0;
  playedCard.summoningSickness = true;
  playedCard.tapped = false;
  playedCard.controllerId = playerId;
  
  // Add to field
  gameState.players[playerId].field.push(playedCard);
  
  // Log the action
  gameState.gameLog.push(`${playerId} plays ${playedCard.name} via Tribute`);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

// Azoth: Place card in Azoth Row
function playAzoth(gameState, playerId, cardId, elementType) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Set as Azoth
  playedCard.asAzoth = true;
  playedCard.elementType = elementType;
  playedCard.rested = false;
  
  // Add to Azoth Row
  gameState.players[playerId].azothRow.push(playedCard);
  
  // Log the action
  gameState.gameLog.push(`${playerId} places ${playedCard.name} as ${elementType} Azoth`);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

// Spell: Play card as one-time effect
function playSpell(gameState, playerId, cardId, azothSpent, abilityIndex) {
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Check if player can pay the elemental costs
  if (!canPayCost(gameState.players[playerId].azoth, card.elements)) {
    gameState.gameLog.push(`Error: Cannot pay elemental cost for ${card.name}`);
    return gameState;
  }
  
  // Pay the cost
  gameState = payCardCost(gameState, playerId, card.elements);
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Calculate generic Azoth spent for ability
  const genericValue = azothSpent - (playedCard.elements.generic || 0);
  
  // Apply the selected ability
  if (playedCard.abilities && playedCard.abilities[abilityIndex]) {
    const ability = playedCard.abilities[abilityIndex];
    
    // Replace ⊗ in ability text with genericValue
    const resolvedEffect = ability.effect.replace('⊗', genericValue.toString());
    
    // Log the spell effect
    gameState.gameLog.push(`${playerId} casts ${playedCard.name}: ${resolvedEffect}`);
    
    // Apply the ability effect
    gameState = applySpellEffect(gameState, playerId, ability, genericValue);
  }
  
  // Put card on bottom of deck
  gameState.players[playerId].deck.unshift(playedCard);
  
  // Draw a card after playing
  gameState = drawCard(gameState, playerId);
  
  return gameState;
}

// Burst: Play card for free from Life Cards
function playBurst(gameState, playerId, cardId) {
  // This is called when a Life Card is revealed due to damage
  // The card should already be in the player's hand at this point
  
  // Find card in hand
  const handIndex = gameState.players[playerId].hand.findIndex(card => card.id === cardId);
  
  if (handIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${playerId}'s hand`);
    return gameState;
  }
  
  const card = gameState.players[playerId].hand[handIndex];
  
  // Calculate ⊗ value based on remaining Life Cards
  const genericValue = gameState.players[playerId].lifeCards.length;
  
  // Remove card from hand
  const playedCard = gameState.players[playerId].hand.splice(handIndex, 1)[0];
  
  // Log the action
  gameState.gameLog.push(`${playerId} plays ${playedCard.name} as Burst (⊗ = ${genericValue})`);
  
  // Apply card effect based on type
  if (playedCard.type === 'Familiar') {
    // Add to field with strength/health but no keywords
    playedCard.strength = playedCard.baseStrength;
    playedCard.health = playedCard.baseHealth;
    playedCard.burstPlayed = true; // Mark as played via Burst (keywords don't resolve)
    playedCard.summoningSickness = true;
    playedCard.tapped = false;
    playedCard.controllerId = playerId;
    
    gameState.players[playerId].field.push(playedCard);
  } else if (playedCard.type === 'Spell') {
    // Apply spell effect with ⊗ = remaining Life Cards
    // But keywords don't resolve
    if (playedCard.abilities && playedCard.abilities.length > 0) {
      const ability = playedCard.abilities[0];
      
      // Replace ⊗ in ability text with genericValue
      const resolvedEffect = ability.effect.replace('⊗', genericValue.toString());
      
      // Log the spell effect
      gameState.gameLog.push(`${playerId} casts ${playedCard.name}: ${resolvedEffect}`);
      
      // Apply the ability effect
      gameState = applySpellEffect(gameState, playerId, ability, genericValue);
    }
    
    // Put card on bottom of deck
    gameState.players[playerId].deck.unshift(playedCard);
  }
  
  // No card draw for Burst plays
  
  return gameState;
}

// Helper function to draw multiple cards
function drawCards(gameState, playerId, count) {
  for (let i = 0; i < count; i++) {
    gameState = drawCard(gameState, playerId);
  }
  return gameState;
}

// Helper function to draw a single card
function drawCard(gameState, playerId) {
  if (gameState.players[playerId].deck.length > 0) {
    const drawnCard = gameState.players[playerId].deck.pop();
    gameState.players[playerId].hand.push(drawnCard);
    gameState.gameLog.push(`${playerId} draws a card`);
  } else {
    gameState.gameLog.push(`${playerId} has no cards left to draw!`);
  }
  return gameState;
}
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