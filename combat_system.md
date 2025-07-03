# KONIVRER Combat System

The combat system in KONIVRER revolves around strategic Familiar battles in the Combat Row. This document explains the mechanics, implementation, and strategic considerations of the combat system.

## Combat Flow

Combat in KONIVRER follows a structured flow:

1. **Attack Phase**: Active player declares attackers
2. **Defense Phase**: Defending player declares blockers
3. **Resolution Phase**: Combat damage is calculated and applied

### Attack Phase

```javascript
// Declare attacker
function declareAttacker(gameState, attackingPlayerId, cardId, targetId) {
  // Get the attacking card
  const attackerIndex = gameState.players[attackingPlayerId].field.findIndex(card => card.id === cardId);
  
  if (attackerIndex === -1) {
    gameState.gameLog.push(`Error: Card ${cardId} not found in ${attackingPlayerId}'s field`);
    return gameState;
  }
  
  // Check if card can attack
  const attacker = gameState.players[attackingPlayerId].field[attackerIndex];
  
  if (attacker.tapped || attacker.summoningSickness) {
    gameState.gameLog.push(`Error: ${attacker.name} cannot attack this turn`);
    return gameState;
  }
  
  // Move card to combat row
  const attackingCard = gameState.players[attackingPlayerId].field.splice(attackerIndex, 1)[0];
  attackingCard.attacking = true;
  attackingCard.target = targetId; // Can be a player ID or card ID
  
  // Add to combat row
  gameState.players[attackingPlayerId].combatRow.push(attackingCard);
  
  // Log the action
  if (targetId.startsWith('player')) {
    gameState.gameLog.push(`${attackingPlayerId}'s ${attackingCard.name} attacks ${targetId} directly`);
  } else {
    const targetCard = findCardById(gameState, targetId);
    gameState.gameLog.push(`${attackingPlayerId}'s ${attackingCard.name} attacks ${targetCard.name}`);
  }
  
  return gameState;
}

// Helper to find a card by ID across all zones
function findCardById(gameState, cardId) {
  for (const playerId in gameState.players) {
    const player = gameState.players[playerId];
    
    // Check field
    const fieldCard = player.field.find(card => card.id === cardId);
    if (fieldCard) return fieldCard;
    
    // Check combat row
    const combatCard = player.combatRow.find(card => card.id === cardId);
    if (combatCard) return combatCard;
  }
  
  return null;
}
```

### Defense Phase

```javascript
// Declare defender
function declareDefender(gameState, defendingPlayerId, defenderCardId, attackerCardId) {
  // Get the defending card
  const defenderIndex = gameState.players[defendingPlayerId].field.findIndex(card => card.id === defenderCardId);
  
  if (defenderIndex === -1) {
    gameState.gameLog.push(`Error: Card ${defenderCardId} not found in ${defendingPlayerId}'s field`);
    return gameState;
  }
  
  // Check if card can defend
  const defender = gameState.players[defendingPlayerId].field[defenderIndex];
  
  if (defender.tapped) {
    gameState.gameLog.push(`Error: ${defender.name} cannot defend (tapped)`);
    return gameState;
  }
  
  // Find the attacking card
  const attackingPlayerId = getOpponent(defendingPlayerId);
  const attackerIndex = gameState.players[attackingPlayerId].combatRow.findIndex(card => card.id === attackerCardId);
  
  if (attackerIndex === -1) {
    gameState.gameLog.push(`Error: Attacking card ${attackerCardId} not found`);
    return gameState;
  }
  
  // Move defender to combat row
  const defendingCard = gameState.players[defendingPlayerId].field.splice(defenderIndex, 1)[0];
  defendingCard.defending = true;
  defendingCard.blockingId = attackerCardId;
  
  // Add to combat row
  gameState.players[defendingPlayerId].combatRow.push(defendingCard);
  
  // Update attacker to show it's being blocked
  gameState.players[attackingPlayerId].combatRow[attackerIndex].blocked = true;
  
  // Log the action
  const attackingCard = gameState.players[attackingPlayerId].combatRow[attackerIndex];
  gameState.gameLog.push(`${defendingPlayerId}'s ${defendingCard.name} blocks ${attackingCard.name}`);
  
  return gameState;
}
```

### Resolution Phase

```javascript
// Resolve combat
function resolveCombat(gameState) {
  // Get players
  const activePlayerId = gameState.activePlayer;
  const defendingPlayerId = getOpponent(activePlayerId);
  
  // Process all attackers
  const attackers = gameState.players[activePlayerId].combatRow;
  const defenders = gameState.players[defendingPlayerId].combatRow;
  
  // Track cards to move to discard after combat
  const cardsToDiscard = [];
  
  // Process each attacker
  attackers.forEach(attacker => {
    // Find if this attacker is blocked
    const blockingDefenders = defenders.filter(defender => defender.blockingId === attacker.id);
    
    if (blockingDefenders.length > 0) {
      // Attacker is blocked - resolve combat with each blocker
      blockingDefenders.forEach(defender => {
        // Calculate combat damage
        const attackerElement = getPrimaryElement(attacker.elements);
        const defenderElement = getPrimaryElement(defender.elements);
        
        // Apply elemental advantages
        const attackDamage = calculateElementalDamage(
          attackerElement, 
          defenderElement, 
          attacker.strength
        );
        
        const defenseDamage = calculateElementalDamage(
          defenderElement, 
          attackerElement, 
          defender.strength
        );
        
        // Apply damage
        defender.health -= attackDamage;
        attacker.health -= defenseDamage;
        
        // Log the combat
        gameState.gameLog.push(
          `${attacker.name} (${attackDamage}) and ${defender.name} (${defenseDamage}) deal damage to each other`
        );
        
        // Check if either card is destroyed
        if (defender.health <= 0) {
          gameState.gameLog.push(`${defender.name} is destroyed`);
          cardsToDiscard.push({playerId: defendingPlayerId, cardId: defender.id});
        }
        
        if (attacker.health <= 0) {
          gameState.gameLog.push(`${attacker.name} is destroyed`);
          cardsToDiscard.push({playerId: activePlayerId, cardId: attacker.id});
        }
      });
    } else {
      // Attacker is unblocked - deal damage to target
      if (attacker.target.startsWith('player')) {
        // Direct attack on player - deal damage to Life Cards
        const targetPlayerId = attacker.target;
        damagePlayer(gameState, targetPlayerId, attacker.strength, activePlayerId, attacker);
      } else {
        // Attack on a specific card
        const targetCard = findCardById(gameState, attacker.target);
        if (targetCard) {
          // Apply damage to target card
          targetCard.health -= attacker.strength;
          
          // Log the attack
          gameState.gameLog.push(`${attacker.name} deals ${attacker.strength} damage to ${targetCard.name}`);
          
          // Check if target is destroyed
          if (targetCard.health <= 0) {
            gameState.gameLog.push(`${targetCard.name} is destroyed`);
            cardsToDiscard.push({
              playerId: targetCard.controllerId, 
              cardId: targetCard.id
            });
          }
        }
      }
    }
  });
  
  // Process cards to discard
  cardsToDiscard.forEach(({playerId, cardId}) => {
    // Remove from combat row
    const combatIndex = gameState.players[playerId].combatRow.findIndex(card => card.id === cardId);
    if (combatIndex !== -1) {
      const card = gameState.players[playerId].combatRow.splice(combatIndex, 1)[0];
      gameState.players[playerId].discardPile.push(card);
    }
  });
  
  // Return surviving attackers to field
  gameState.players[activePlayerId].combatRow.forEach(card => {
    // Reset combat flags
    card.attacking = false;
    card.blocked = false;
    card.target = null;
    
    // Move back to field
    gameState.players[activePlayerId].field.push(card);
  });
  
  // Return surviving defenders to field
  gameState.players[defendingPlayerId].combatRow.forEach(card => {
    // Reset combat flags
    card.defending = false;
    card.blockingId = null;
    
    // Move back to field
    gameState.players[defendingPlayerId].field.push(card);
  });
  
  // Clear combat rows
  gameState.players[activePlayerId].combatRow = [];
  gameState.players[defendingPlayerId].combatRow = [];
  
  // Log end of combat
  gameState.gameLog.push('Combat phase ended');
  
  return gameState;
}
```

## Combat Mechanics

### Strength and Health

Each Familiar has two primary stats:

1. **Strength**: Determines how much damage it deals in combat
   - Base value determined by card
   - Modified by Azoth spent beyond cost
   - Can be further modified by effects

2. **Health**: Determines how much damage it can take before being destroyed
   - Base value determined by card
   - Can be modified by effects
   - Resets at end of turn unless otherwise specified

```javascript
// Example Familiar card
const familiar = {
  id: 'card-123',
  name: 'Shadow Assassin',
  type: 'Familiar',
  elements: { nether: 1, generic: 1 },
  baseStrength: 2,
  baseHealth: 2,
  strength: 2, // Current strength (can be modified)
  health: 2,   // Current health (can be modified)
  abilities: [
    {
      trigger: 'enter',
      effect: 'target_familiar_damage',
      value: 1
    }
  ],
  tapped: false,
  summoningSickness: true
};
```

### Special Combat Abilities

Familiars can have special abilities that affect combat:

1. **First Strike**: Deals damage before normal combat damage
2. **Overwhelm**: Excess damage carries over to the player
3. **Defender**: Must be attacked before player can be targeted
4. **Evasion**: Can only be blocked by Familiars with specific traits

```javascript
// Implement First Strike
function resolveFirstStrike(gameState) {
  // Get players
  const activePlayerId = gameState.activePlayer;
  const defendingPlayerId = getOpponent(activePlayerId);
  
  // Get all attackers and defenders with First Strike
  const firstStrikeAttackers = gameState.players[activePlayerId].combatRow.filter(
    card => card.abilities.some(ability => ability.keyword === 'first_strike')
  );
  
  const firstStrikeDefenders = gameState.players[defendingPlayerId].combatRow.filter(
    card => card.abilities.some(ability => ability.keyword === 'first_strike')
  );
  
  // Process First Strike combat
  // (Similar to normal combat but happens first and only for First Strike cards)
  
  // Then proceed with normal combat for surviving cards
  
  return gameState;
}

// Implement Overwhelm
function applyOverwhelm(gameState, attacker, defender, defendingPlayerId) {
  // Calculate excess damage
  const excessDamage = Math.max(0, attacker.strength - defender.health);
  
  if (excessDamage > 0 && attacker.abilities.some(ability => ability.keyword === 'overwhelm')) {
    // Apply excess damage to player
    gameState.gameLog.push(`${attacker.name}'s Overwhelm deals ${excessDamage} excess damage`);
    damagePlayer(gameState, defendingPlayerId, excessDamage, attacker.controllerId, attacker);
  }
  
  return gameState;
}
```

## Combat Row Implementation

The Combat Row is a special zone where battles take place:

```javascript
// Combat Row structure in game state
gameState.players.player1.combatRow = [
  // Cards currently in combat
];

gameState.players.player2.combatRow = [
  // Cards currently in combat
];
```

### UI Representation

The Combat Row should be visually distinct:

1. **Combat Row Zone**:
   - Position: Between the two players' fields
   - Visual: Highlighted area with clear separation
   - Labels: "Attacking" and "Defending" sections

2. **Combat Animations**:
   - Attacking: Card moves forward with attack animation
   - Blocking: Defender moves to intercept attacker
   - Damage: Visual effects showing damage dealt
   - Destruction: Animation for destroyed Familiars

3. **Combat Information**:
   - Show attack lines connecting attackers to targets
   - Display strength/health values prominently
   - Highlight elemental advantages/disadvantages

## Strategic Considerations

### Attack Decisions

Players must consider several factors when attacking:

1. **Target Selection**:
   - Attack opponent directly to damage Life Cards
   - Attack opponent's Familiars to clear the board
   - Consider elemental advantages/disadvantages

2. **Risk Assessment**:
   - Will the attacker survive potential blocks?
   - Is losing the attacker worth the potential damage?
   - How will the board state change after combat?

3. **Timing**:
   - Early aggression vs. board development
   - Attacking before or after playing additional cards
   - Setting up for future turns

### Defense Decisions

Defenders face their own strategic choices:

1. **Block Assignment**:
   - Which attackers to block
   - How many defenders to assign to each attacker
   - Whether to let some damage through

2. **Resource Preservation**:
   - Protecting valuable Familiars
   - Trading less valuable Familiars for attackers
   - Preserving Life Cards vs. board presence

3. **Counter-attack Setup**:
   - Positioning for next turn's attack
   - Preserving specific Familiars for combos
   - Forcing opponent to overcommit

## Combat-Related Keywords

KONIVRER features several keywords that modify combat:

1. **Swift**: Can attack the turn it enters play (no summoning sickness)
2. **Guardian**: Must be attacked before other Familiars or player
3. **Piercing**: Ignores defensive abilities
4. **Resilient**: Survives with 1 health the first time it would be destroyed each turn

```javascript
// Implement Swift
function canAttack(card) {
  if (card.tapped) return false;
  if (card.summoningSickness && !hasAbility(card, 'swift')) return false;
  return true;
}

// Implement Guardian
function validateAttack(gameState, attackingPlayerId, targetId) {
  const defendingPlayerId = getOpponent(attackingPlayerId);
  
  // Check if there are any Guardians
  const guardians = gameState.players[defendingPlayerId].field.filter(
    card => hasAbility(card, 'guardian')
  );
  
  // If there are Guardians, they must be attacked first
  if (guardians.length > 0) {
    // If target is not a Guardian, attack is invalid
    if (!targetId.startsWith('player')) {
      const targetCard = findCardById(gameState, targetId);
      if (!hasAbility(targetCard, 'guardian')) {
        return false;
      }
    } else {
      // Cannot attack player directly if Guardians exist
      return false;
    }
  }
  
  return true;
}

// Helper to check for ability
function hasAbility(card, abilityKeyword) {
  return card.abilities.some(ability => ability.keyword === abilityKeyword);
}
```

## Conclusion

The combat system in KONIVRER creates dynamic and strategic gameplay through:
- Clear phases that allow for strategic decision-making
- Elemental interactions that add depth to combat
- Special abilities that create unique combat situations
- The Combat Row as a dedicated battlefield zone

By implementing this system with intuitive controls and clear visual feedback, players can engage with the strategic depth of KONIVRER's combat mechanics.