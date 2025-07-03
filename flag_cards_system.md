# KONIVRER Flag Cards System

Flag cards are a unique and central mechanic in KONIVRER that define a deck's elemental identity and provide strategic advantages. This document explains the implementation and strategic implications of the Flag system.

## Core Concept

Each KONIVRER deck must include exactly one Flag card that:
- Defines the deck's elemental alignment
- Provides bonuses to cards of matching elements
- Creates advantages against specific opposing elements
- Does not count toward the 40-card deck minimum

Flag cards remain in the Flag zone throughout the game, visible to all players, and cannot be removed or affected by most card effects.

## Implementation

### Flag Card Structure

```javascript
// Example Flag card structure
const flagCard = {
  id: 'flag-001',
  name: 'Flame Sovereign',
  type: 'Flag',
  elements: { fire: 2 },
  primaryElement: 'fire',
  strongAgainst: 'earth',
  weakAgainst: 'water',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Fire Familiars get +1 Strength.',
      implementation: (gameState, playerId) => {
        // Apply +1 Strength to all Fire Familiars
        gameState.players[playerId].field.forEach(card => {
          if (card.type === 'Familiar' && card.elements.fire > 0) {
            card.strength += 1;
          }
        });
        return gameState;
      }
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, deal 1 damage to target Familiar.',
      implementation: (gameState, playerId, targetId) => {
        // Deal 1 damage to target Familiar
        const targetCard = findCardById(gameState, targetId);
        if (targetCard && targetCard.type === 'Familiar') {
          targetCard.health -= 1;
          gameState.gameLog.push(`${flagCard.name} deals 1 damage to ${targetCard.name}`);
          
          // Check if target is destroyed
          if (targetCard.health <= 0) {
            gameState.gameLog.push(`${targetCard.name} is destroyed`);
            removeCardFromField(gameState, targetCard.controllerId, targetCard.id);
          }
        }
        return gameState;
      }
    }
  ]
};
```

### Flag Zone Implementation

The Flag zone is a special area where the Flag card resides:

```javascript
// Add Flag zone to game state
gameState.players.player1.flagZone = flagCard;
gameState.players.player2.flagZone = opponentFlagCard;

// Function to set up Flag at game start
function setupFlag(gameState, playerId, flagCard) {
  // Place Flag in Flag zone
  gameState.players[playerId].flagZone = flagCard;
  
  // Log the action
  gameState.gameLog.push(`${playerId} sets ${flagCard.name} as their Flag`);
  
  return gameState;
}
```

### Applying Flag Effects

Flag effects should be applied at appropriate times:

```javascript
// Apply continuous Flag effects
function applyContinuousFlagEffects(gameState) {
  // For each player
  for (const playerId in gameState.players) {
    const flagCard = gameState.players[playerId].flagZone;
    
    // Skip if no Flag (shouldn't happen in normal play)
    if (!flagCard) continue;
    
    // Apply each continuous effect
    flagCard.abilities.forEach(ability => {
      if (ability.trigger === 'continuous') {
        gameState = ability.implementation(gameState, playerId);
      }
    });
  }
  
  return gameState;
}

// Apply turn start Flag effects
function applyTurnStartFlagEffects(gameState, playerId) {
  const flagCard = gameState.players[playerId].flagZone;
  
  // Skip if no Flag
  if (!flagCard) return gameState;
  
  // Apply each turn start effect
  flagCard.abilities.forEach(ability => {
    if (ability.trigger === 'turn_start') {
      // For effects that require targets, prompt player for target
      // In actual implementation, this would be an async user selection
      const targetId = selectTarget(gameState, playerId, ability.targetRequirements);
      
      if (targetId) {
        gameState = ability.implementation(gameState, playerId, targetId);
      }
    }
  });
  
  return gameState;
}
```

## Flag Types and Elemental Alignment

KONIVRER features seven primary Flag types, each aligned with a different element:

### 1. Fire Flags

```javascript
const fireFlag = {
  name: 'Flame Sovereign',
  primaryElement: 'fire',
  strongAgainst: 'earth',
  weakAgainst: 'water',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Fire Familiars get +1 Strength.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, deal 1 damage to target Familiar.'
    }
  ]
};
```

### 2. Water Flags

```javascript
const waterFlag = {
  name: 'Tide Master',
  primaryElement: 'water',
  strongAgainst: 'fire',
  weakAgainst: 'earth',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Water Familiars get +1 Health.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, draw an additional card.'
    }
  ]
};
```

### 3. Earth Flags

```javascript
const earthFlag = {
  name: 'Stone Guardian',
  primaryElement: 'earth',
  strongAgainst: 'water',
  weakAgainst: 'fire',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Earth Familiars get +2 Health.'
    },
    {
      trigger: 'damage',
      effect: 'When you would take damage, reduce it by 1 (minimum 1).'
    }
  ]
};
```

### 4. Air Flags

```javascript
const airFlag = {
  name: 'Wind Dancer',
  primaryElement: 'air',
  strongAgainst: 'water',
  weakAgainst: 'earth',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Air Familiars cannot be blocked by Familiars with Strength greater than 2.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, you may return target Familiar to its owner\'s hand.'
    }
  ]
};
```

### 5. Aether Flags

```javascript
const aetherFlag = {
  name: 'Cosmic Weaver',
  primaryElement: 'aether',
  strongAgainst: 'nether',
  weakAgainst: 'generic',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Aether cards cost 1 less to play (minimum 1).'
    },
    {
      trigger: 'turn_end',
      effect: 'At the end of your turn, transform target Familiar into a random Familiar with cost 1 higher.'
    }
  ]
};
```

### 6. Nether Flags

```javascript
const netherFlag = {
  name: 'Void Harbinger',
  primaryElement: 'nether',
  strongAgainst: 'generic',
  weakAgainst: 'aether',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'When your Nether Familiar destroys an opponent\'s Familiar, remove it from the game.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, look at the top card of your opponent\'s deck. You may put it on the bottom.'
    }
  ]
};
```

### 7. Generic Flags

```javascript
const genericFlag = {
  name: 'Balance Keeper',
  primaryElement: 'generic',
  strongAgainst: 'aether',
  weakAgainst: 'nether',
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Familiars get +1/+1 if they have at least three different elements in their cost.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, add one Azoth of any element to your Azoth pool.'
    }
  ]
};
```

## Deck Building Constraints

The Flag system imposes important deck building constraints:

```javascript
// Validate deck based on Flag
function validateDeck(deck, flagCard) {
  // Check if deck has exactly one Flag
  const flags = deck.filter(card => card.type === 'Flag');
  if (flags.length !== 1 || flags[0].id !== flagCard.id) {
    return {
      valid: false,
      error: 'Deck must contain exactly one Flag card.'
    };
  }
  
  // Check if deck meets minimum size (40 cards excluding Flag)
  const nonFlagCards = deck.filter(card => card.type !== 'Flag');
  if (nonFlagCards.length < 40) {
    return {
      valid: false,
      error: `Deck must contain at least 40 cards excluding Flag (currently ${nonFlagCards.length}).`
    };
  }
  
  // Check card limits (1 copy per card)
  const cardCounts = {};
  for (const card of nonFlagCards) {
    cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
    if (cardCounts[card.id] > 1) {
      return {
        valid: false,
        error: `Deck contains multiple copies of ${card.name}. Only 1 copy per card is allowed.`
      };
    }
  }
  
  // Check rarity distribution
  const commons = nonFlagCards.filter(card => card.rarity === 'common');
  const uncommons = nonFlagCards.filter(card => card.rarity === 'uncommon');
  const rares = nonFlagCards.filter(card => card.rarity === 'rare');
  
  if (commons.length !== 25) {
    return {
      valid: false,
      error: `Deck must contain exactly 25 Common cards (currently ${commons.length}).`
    };
  }
  
  if (uncommons.length !== 13) {
    return {
      valid: false,
      error: `Deck must contain exactly 13 Uncommon cards (currently ${uncommons.length}).`
    };
  }
  
  if (rares.length !== 2) {
    return {
      valid: false,
      error: `Deck must contain exactly 2 Rare cards (currently ${rares.length}).`
    };
  }
  
  return { valid: true };
}
```

## UI Representation

The Flag zone should be prominently displayed:

1. **Flag Zone**:
   - Position: Left side of player's area, top
   - Visual: Distinct area with Flag card fully visible
   - Border: Colored according to Flag's primary element

2. **Flag Card Display**:
   - Show full card art and text
   - Highlight elemental alignment
   - Display strengths and weaknesses

3. **Flag Effects Visualization**:
   - Show active effects with icons or highlights
   - Connect Flag to affected cards with visual indicators
   - Animate when Flag abilities trigger

## Strategic Implications

### Deck Construction

The Flag system profoundly impacts deck building:

1. **Elemental Focus**:
   - Incentivizes including cards of the Flag's primary element
   - Creates natural synergies within the deck
   - Influences card selection based on Flag abilities

2. **Counter-Strategy Awareness**:
   - Players must consider their Flag's weaknesses
   - Include cards that mitigate weaknesses
   - Prepare for common counter-strategies

3. **Rarity Balance**:
   - The strict rarity distribution (25/13/2) forces strategic choices
   - Limited rare slots require careful consideration
   - Common cards form the backbone of strategy

### In-Game Strategy

Flag cards influence gameplay decisions:

1. **Resource Allocation**:
   - Prioritize Azoth for cards that benefit from Flag bonuses
   - Balance between Flag-synergy cards and other utilities
   - Adapt resource allocation based on opponent's Flag

2. **Matchup Assessment**:
   - Quickly identify favorable/unfavorable Flag matchups
   - Adjust aggression level based on elemental advantages
   - Prioritize different win conditions based on matchup

3. **Ability Timing**:
   - Optimize timing of Flag abilities
   - Set up board states that maximize Flag benefits
   - Force opponent into positions where their Flag is less effective

## Advanced Flag Mechanics

### Multi-Element Flags

Some advanced Flags incorporate multiple elements:

```javascript
const dualElementFlag = {
  name: 'Storm Herald',
  elements: { air: 1, water: 1 },
  primaryElement: 'air',
  secondaryElement: 'water',
  strongAgainst: ['fire', 'earth'],
  weakAgainst: [],
  abilities: [
    {
      trigger: 'continuous',
      effect: 'Your Air and Water Familiars get +1 Strength and +1 Health.'
    },
    {
      trigger: 'turn_start',
      effect: 'At the start of your turn, you may return target Familiar to its owner\'s hand or draw a card.'
    }
  ]
};
```

### Flag Resonance

When both players have Flags with specific relationships, special effects can trigger:

```javascript
// Check for Flag resonance
function checkFlagResonance(gameState) {
  const player1Flag = gameState.players.player1.flagZone;
  const player2Flag = gameState.players.player2.flagZone;
  
  // Skip if either player doesn't have a Flag
  if (!player1Flag || !player2Flag) return gameState;
  
  // Check for opposing elements (direct weakness)
  if (player1Flag.weakAgainst === player2Flag.primaryElement) {
    // Apply resonance effect
    gameState.gameLog.push(`${player2Flag.name} resonates against ${player1Flag.name}!`);
    
    // Example effect: Player 2 gets an Azoth bonus
    addAzoth(gameState, 'player2', player2Flag.primaryElement, 1);
  }
  
  if (player2Flag.weakAgainst === player1Flag.primaryElement) {
    // Apply resonance effect
    gameState.gameLog.push(`${player1Flag.name} resonates against ${player2Flag.name}!`);
    
    // Example effect: Player 1 gets an Azoth bonus
    addAzoth(gameState, 'player1', player1Flag.primaryElement, 1);
  }
  
  return gameState;
}
```

### Flag Awakening

Some Flags have powerful abilities that can be activated under specific conditions:

```javascript
// Check for Flag awakening conditions
function checkFlagAwakening(gameState, playerId) {
  const flagCard = gameState.players[playerId].flagZone;
  
  // Skip if no Flag
  if (!flagCard || !flagCard.awakeningAbility) return gameState;
  
  // Check awakening condition
  if (flagCard.awakeningCondition(gameState, playerId)) {
    // Trigger awakening if not already awakened
    if (!flagCard.awakened) {
      flagCard.awakened = true;
      gameState.gameLog.push(`${flagCard.name} has awakened!`);
      
      // Apply awakening effect
      gameState = flagCard.awakeningAbility.implementation(gameState, playerId);
    }
  }
  
  return gameState;
}

// Example awakening condition and ability
const flagWithAwakening = {
  // ... other flag properties ...
  awakened: false,
  awakeningCondition: (gameState, playerId) => {
    // Awakens when player has 3 or fewer Life Cards remaining
    return gameState.players[playerId].lifeCards.length <= 3;
  },
  awakeningAbility: {
    effect: 'When awakened, all your Familiars get +2/+2 and gain First Strike.',
    implementation: (gameState, playerId) => {
      // Apply +2/+2 and First Strike to all Familiars
      gameState.players[playerId].field.forEach(card => {
        if (card.type === 'Familiar') {
          card.strength += 2;
          card.health += 2;
          
          // Add First Strike if not already present
          if (!card.abilities.some(ability => ability.keyword === 'first_strike')) {
            card.abilities.push({
              keyword: 'first_strike',
              effect: 'This Familiar deals combat damage before Familiars without First Strike.'
            });
          }
        }
      });
      
      return gameState;
    }
  }
};
```

## Conclusion

The Flag system is a defining feature of KONIVRER that:
- Creates a strong deck identity through elemental alignment
- Provides strategic depth through Flag abilities and elemental interactions
- Imposes meaningful deck building constraints
- Establishes clear strengths and weaknesses for each deck

By implementing this system with clear visual representation and intuitive mechanics, players can easily understand and engage with this core aspect of KONIVRER's gameplay.