# KONIVRER Life Cards System

The Life Cards system is a unique mechanic in KONIVRER that replaces traditional health points with a set of face-down cards from your deck. This document explains how to implement and utilize this system.

## Core Concept

Instead of tracking health with a numerical value, KONIVRER uses Life Cards:

1. At the start of the game, the top 4 cards from each player's deck are set aside face-down as Life Cards
2. When a player would take damage, they reveal and discard Life Cards equal to the damage amount
3. When a player has no Life Cards remaining, they lose the game

This system creates strategic depth by:
- Making each game unique (different Life Cards each game)
- Creating tension (unknown Life Cards)
- Providing resource management decisions (protecting Life Cards)

## Implementation

### Setup Phase

```javascript
// Initialize Life Cards during game setup
function setupLifeCards(gameState, playerId) {
  // Get player's deck
  const deck = [...gameState.players[playerId].deck];
  
  // Shuffle the deck
  const shuffledDeck = shuffleDeck(deck);
  
  // Take top 4 cards as Life Cards
  const lifeCards = shuffledDeck.splice(0, 4);
  
  // Update game state
  gameState.players[playerId].lifeCards = lifeCards;
  gameState.players[playerId].deck = shuffledDeck;
  
  // Log the action
  gameState.gameLog.push(`${playerId} set aside 4 Life Cards`);
  
  return gameState;
}

// Shuffle deck function
function shuffleDeck(deck) {
  return [...deck].sort(() => Math.random() - 0.5);
}
```

### Damage Resolution

```javascript
// Handle damage to a player
function damagePlayer(gameState, targetPlayerId, damageAmount, sourcePlayerId, sourceCard) {
  // Get target player's Life Cards
  const lifeCards = gameState.players[targetPlayerId].lifeCards;
  
  // Calculate actual damage (limited by remaining Life Cards)
  const actualDamage = Math.min(damageAmount, lifeCards.length);
  
  // If no damage can be dealt, return early
  if (actualDamage <= 0) return gameState;
  
  // Reveal and discard Life Cards
  const revealedCards = lifeCards.splice(0, actualDamage);
  
  // Log the damage
  if (sourceCard) {
    gameState.gameLog.push(`${sourcePlayerId}'s ${sourceCard.name} dealt ${actualDamage} damage to ${targetPlayerId}`);
  } else {
    gameState.gameLog.push(`${targetPlayerId} took ${actualDamage} damage`);
  }
  
  // Log each revealed Life Card
  revealedCards.forEach(card => {
    gameState.gameLog.push(`${targetPlayerId} revealed ${card.name} as a Life Card`);
    
    // Move card to discard pile
    gameState.players[targetPlayerId].discardPile.push(card);
  });
  
  // Check for game over
  if (gameState.players[targetPlayerId].lifeCards.length === 0) {
    gameState.gameOver = true;
    gameState.winner = sourcePlayerId;
    gameState.gameLog.push(`${targetPlayerId} has no Life Cards remaining!`);
    gameState.gameLog.push(`${sourcePlayerId} wins the game!`);
  }
  
  return gameState;
}
```

### UI Representation

The Life Cards zone should be visually distinct:

1. **Life Cards Zone**:
   - Position: Left side of player's area, below Flag
   - Visual: Stack of face-down cards
   - Counter: Number of remaining Life Cards

2. **Life Card Reveal Animation**:
   - When a Life Card is revealed, flip it face-up
   - Show the card briefly (2-3 seconds)
   - Animate it moving to the discard pile

3. **Life Cards Status**:
   - Color-code based on remaining cards:
     - 4 cards: Green
     - 3 cards: Yellow
     - 2 cards: Orange
     - 1 card: Red

## Strategic Implications

### Deck Building Considerations

The Life Cards system affects deck building in several ways:

1. **Card Distribution**:
   - Players must consider that 4 random cards will be removed from their deck
   - Key combo pieces might become Life Cards
   - Including redundant effects helps mitigate this risk

2. **Card Quality**:
   - High-value cards might be lost as Life Cards
   - Balance between powerful cards and utility cards becomes important

3. **Deck Size**:
   - The minimum 40-card deck size ensures 36 cards remain after Life Cards
   - Larger decks reduce the chance of specific cards becoming Life Cards

### In-Game Strategy

The Life Cards system creates unique strategic decisions:

1. **Damage Assessment**:
   - Each point of damage is significant (only 4 Life Cards total)
   - Players must carefully evaluate attack/defense decisions

2. **Information Tracking**:
   - As Life Cards are revealed, players gain information about what's not in the opponent's deck
   - This information can inform strategic decisions

3. **Resource Management**:
   - Protecting Life Cards becomes a priority
   - Trading card advantage for Life Card protection can be worthwhile

## Special Interactions

### Life Card Recovery

Some cards allow players to recover Life Cards:

```javascript
// Recover a Life Card
function recoverLifeCard(gameState, playerId, cardSource) {
  // Check if player has cards in discard pile
  if (gameState.players[playerId].discardPile.length === 0) {
    gameState.gameLog.push(`${playerId} has no cards in discard pile to recover`);
    return gameState;
  }
  
  // Allow player to select a card from discard pile
  // (In actual implementation, this would be an async user selection)
  const selectedCard = selectCardFromDiscardPile(gameState, playerId);
  
  // Add selected card as a new Life Card
  gameState.players[playerId].lifeCards.push(selectedCard);
  
  // Remove card from discard pile
  const cardIndex = gameState.players[playerId].discardPile.findIndex(card => card.id === selectedCard.id);
  gameState.players[playerId].discardPile.splice(cardIndex, 1);
  
  // Log the action
  gameState.gameLog.push(`${playerId} recovered ${selectedCard.name} as a Life Card using ${cardSource.name}`);
  
  return gameState;
}
```

### Life Card Inspection

Some effects allow players to look at Life Cards without revealing them:

```javascript
// Inspect Life Cards
function inspectLifeCards(gameState, playerId, targetPlayerId, count) {
  // Get target player's Life Cards
  const lifeCards = gameState.players[targetPlayerId].lifeCards;
  
  // Limit count to available Life Cards
  const actualCount = Math.min(count, lifeCards.length);
  
  // Get cards to inspect (without removing them)
  const cardsToInspect = lifeCards.slice(0, actualCount);
  
  // In actual implementation, show these cards only to the inspecting player
  // This is a private action that doesn't change game state
  
  // Log the action (visible to all players)
  gameState.gameLog.push(`${playerId} inspected ${actualCount} of ${targetPlayerId}'s Life Cards`);
  
  return gameState;
}
```

### Life Card Manipulation

Advanced cards can manipulate the order of Life Cards:

```javascript
// Rearrange Life Cards
function rearrangeLifeCards(gameState, playerId) {
  // In actual implementation, this would be an async user interaction
  // to reorder their Life Cards
  
  // Log the action
  gameState.gameLog.push(`${playerId} rearranged their Life Cards`);
  
  return gameState;
}
```

## Team Game Variations

In team games (2v2 or 3v3), the Life Cards system is modified:

1. **Shared Life Cards**:
   - Each team shares a pool of Life Cards
   - 4 Life Cards per player on the team (8 for 2v2, 12 for 3v3)

2. **Damage Distribution**:
   - When a team takes damage, they decide which player's Life Cards to reveal
   - This adds strategic depth to team play

```javascript
// Handle team damage
function damageTeam(gameState, targetTeamId, damageAmount, sourceTeamId, sourceCard) {
  // Get target team's players
  const teamPlayers = getTeamPlayers(gameState, targetTeamId);
  
  // Calculate total Life Cards across team
  const totalLifeCards = teamPlayers.reduce((sum, playerId) => {
    return sum + gameState.players[playerId].lifeCards.length;
  }, 0);
  
  // If no Life Cards remain, return early
  if (totalLifeCards === 0) return gameState;
  
  // Calculate actual damage (limited by remaining Life Cards)
  const actualDamage = Math.min(damageAmount, totalLifeCards);
  
  // Log the damage
  if (sourceCard) {
    gameState.gameLog.push(`${sourceTeamId}'s ${sourceCard.name} dealt ${actualDamage} damage to ${targetTeamId}`);
  } else {
    gameState.gameLog.push(`${targetTeamId} took ${actualDamage} damage`);
  }
  
  // Distribute damage among team members
  // (In actual implementation, this would involve player choice)
  let remainingDamage = actualDamage;
  
  while (remainingDamage > 0) {
    // Select player to take damage
    const targetPlayerId = selectPlayerForDamage(gameState, targetTeamId);
    
    // If player has no Life Cards, skip
    if (gameState.players[targetPlayerId].lifeCards.length === 0) continue;
    
    // Reveal one Life Card
    const revealedCard = gameState.players[targetPlayerId].lifeCards.pop();
    
    // Log the revealed card
    gameState.gameLog.push(`${targetPlayerId} revealed ${revealedCard.name} as a Life Card`);
    
    // Move card to discard pile
    gameState.players[targetPlayerId].discardPile.push(revealedCard);
    
    // Reduce remaining damage
    remainingDamage--;
  }
  
  // Check for team elimination
  if (totalLifeCards - actualDamage === 0) {
    gameState.gameOver = true;
    gameState.winner = sourceTeamId;
    gameState.gameLog.push(`${targetTeamId} has no Life Cards remaining!`);
    gameState.gameLog.push(`${sourceTeamId} wins the game!`);
  }
  
  return gameState;
}
```

## Conclusion

The Life Cards system is a defining feature of KONIVRER that:
- Creates a unique damage resolution system
- Adds strategic depth to gameplay
- Makes each game feel different
- Introduces interesting deck building constraints

By implementing this system with clear visual feedback and intuitive interactions, players can easily understand and engage with this innovative mechanic.