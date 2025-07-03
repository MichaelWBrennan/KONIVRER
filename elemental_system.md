# KONIVRER Elemental System Implementation

The elemental system is a core mechanic of KONIVRER that defines card costs, strengths, and interactions. This document provides detailed guidance on implementing this system.

## Elemental Types

KONIVRER features seven elemental types:

1. **Fire (△)**: Aggressive, direct damage
2. **Water (▽)**: Flow, card draw, flexibility
3. **Earth (⊡)**: Stability, defense, permanence
4. **Air (△)**: Speed, evasion, manipulation
5. **Aether (○)**: Transformation, power, rarity
6. **Nether (□)**: Void, removal, disruption
7. **Generic (⊗)**: Universal, adaptable

## Elemental Cost Implementation

Each card has an elemental cost that must be paid using Azoth resources:

```javascript
// Card elemental cost structure
const cardCost = {
  fire: 2,    // Requires 2 Fire Azoth
  water: 0,   // Requires 0 Water Azoth
  earth: 0,   // Requires 0 Earth Azoth
  air: 0,     // Requires 0 Air Azoth
  aether: 0,  // Requires 0 Aether Azoth
  nether: 0,  // Requires 0 Nether Azoth
  generic: 1  // Requires 1 Generic Azoth (can be paid with any element)
};
```

## Strength Calculation

A card's Strength is determined by the amount of Azoth spent beyond the required elemental cost:

```javascript
// Calculate card strength
function calculateStrength(azothSpent, cardCost) {
  // Calculate total required Azoth
  const requiredAzoth = Object.values(cardCost).reduce((sum, val) => sum + val, 0);
  
  // Strength is excess Azoth spent
  return Math.max(0, azothSpent - requiredAzoth);
}

// Example usage
const card = {
  name: "ABISS",
  cost: { fire: 2, generic: 1 }
};

// Player spends 5 total Azoth (2 Fire + 3 Generic)
const strength = calculateStrength(5, card.cost); // Returns 2 (5 - 3)
```

## Elemental Interactions

Elements have natural strengths and weaknesses against each other:

| Element | Strong Against | Weak Against |
|---------|---------------|-------------|
| Fire    | Earth         | Water       |
| Water   | Fire          | Earth       |
| Earth   | Air           | Fire        |
| Air     | Water         | Earth       |
| Aether  | Nether        | Generic     |
| Nether  | Generic       | Aether      |
| Generic | Air           | Nether      |

Implement these interactions with a bonus damage system:

```javascript
// Elemental advantage matrix
const elementalAdvantages = {
  fire: "earth",
  water: "fire",
  earth: "air",
  air: "water",
  aether: "nether",
  nether: "generic",
  generic: "air"
};

// Apply elemental advantage in combat
function calculateElementalDamage(attackerElement, defenderElement, baseDamage) {
  if (elementalAdvantages[attackerElement] === defenderElement) {
    return baseDamage + 1; // +1 damage when attacking weak element
  }
  
  if (elementalAdvantages[defenderElement] === attackerElement) {
    return Math.max(1, baseDamage - 1); // -1 damage when attacking strong element (minimum 1)
  }
  
  return baseDamage; // Normal damage otherwise
}
```

## Flag Elemental Bonuses

Flag cards provide elemental identity and bonuses:

```javascript
// Flag effects based on elements
const flagEffects = {
  fire: {
    name: "Flame Sovereign",
    effect: (gameState, playerId) => {
      // Fire cards get +1 strength
      gameState.players[playerId].field.forEach(card => {
        if (card.elements.includes("fire")) {
          card.strength += 1;
        }
      });
      return gameState;
    },
    strongAgainst: "earth"
  },
  water: {
    name: "Tide Master",
    effect: (gameState, playerId) => {
      // Draw an extra card each turn
      gameState.players[playerId].drawBonus = 1;
      return gameState;
    },
    strongAgainst: "fire"
  },
  // Additional flag effects for other elements...
};
```

## Elemental Visualization

Implement visual cues for elemental types:

1. **Color Coding**:
   - Fire: Red/Orange
   - Water: Blue
   - Earth: Green/Brown
   - Air: White/Light Blue
   - Aether: Purple/Gold
   - Nether: Black/Dark Purple
   - Generic: Gray/Silver

2. **Symbol Display**:
   - Show elemental symbols (△, ▽, ⊡, etc.) on cards
   - Use consistent positioning (top-left corner)
   - Size symbols proportionally to cost (larger for higher costs)

3. **Animations**:
   - Fire: Flame effects
   - Water: Ripple/flow effects
   - Earth: Crumbling/growth effects
   - Air: Swirling wind effects
   - Aether: Glowing/pulsing effects
   - Nether: Void/darkness effects
   - Generic: Neutral shimmer effects

## Azoth Resource Management

Implement a resource system for Azoth:

```javascript
// Player's Azoth resources
const playerAzoth = {
  fire: 2,
  water: 1,
  earth: 0,
  air: 1,
  aether: 0,
  nether: 0,
  generic: 0,
  total: 4 // Convenience property for total available Azoth
};

// Function to pay card cost
function payCardCost(playerAzoth, cardCost) {
  // Deep copy to avoid modifying original
  const remainingAzoth = {...playerAzoth};
  const remainingCost = {...cardCost};
  
  // First, pay specific elemental costs
  for (const element in remainingCost) {
    if (element === "generic") continue; // Handle generic separately
    
    if (remainingAzoth[element] >= remainingCost[element]) {
      remainingAzoth[element] -= remainingCost[element];
      remainingCost[element] = 0;
    } else {
      return null; // Cannot pay the cost
    }
  }
  
  // Then, pay generic costs with any remaining Azoth
  const genericCost = remainingCost.generic || 0;
  let remainingGeneric = genericCost;
  
  // Use any element to pay generic cost
  for (const element in remainingAzoth) {
    if (element === "total") continue; // Skip the total property
    
    const usableAmount = Math.min(remainingAzoth[element], remainingGeneric);
    remainingAzoth[element] -= usableAmount;
    remainingGeneric -= usableAmount;
    
    if (remainingGeneric <= 0) break;
  }
  
  if (remainingGeneric > 0) {
    return null; // Cannot pay the full generic cost
  }
  
  // Recalculate total
  remainingAzoth.total = Object.entries(remainingAzoth)
    .filter(([key]) => key !== "total")
    .reduce((sum, [_, value]) => sum + value, 0);
  
  return remainingAzoth;
}
```

## Elemental Synergies

Implement special effects when multiple cards of the same element are played:

```javascript
// Check for elemental synergies
function checkElementalSynergies(gameState, playerId) {
  const field = gameState.players[playerId].field;
  
  // Count elements on field
  const elementCounts = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    aether: 0,
    nether: 0,
    generic: 0
  };
  
  // Count primary elements of each card
  field.forEach(card => {
    const primaryElement = getPrimaryElement(card.elements);
    if (primaryElement) {
      elementCounts[primaryElement]++;
    }
  });
  
  // Apply synergy effects based on counts
  for (const element in elementCounts) {
    if (elementCounts[element] >= 3) {
      // Apply "Triad" effect for having 3+ of same element
      applyTriadEffect(gameState, playerId, element);
    }
  }
  
  return gameState;
}

// Get primary element of a card (first non-generic element)
function getPrimaryElement(elements) {
  for (const element in elements) {
    if (element !== "generic" && elements[element] > 0) {
      return element;
    }
  }
  return "generic";
}

// Apply special effects for elemental triads
function applyTriadEffect(gameState, playerId, element) {
  switch (element) {
    case "fire":
      // Fire Triad: Deal 1 damage to all opponent's Familiars
      gameState.players[getOpponent(playerId)].field.forEach(card => {
        card.health -= 1;
      });
      break;
    case "water":
      // Water Triad: Draw an additional card
      drawCard(gameState, playerId);
      break;
    case "earth":
      // Earth Triad: All your Familiars gain +0/+1 (0 attack, 1 health)
      gameState.players[playerId].field.forEach(card => {
        card.health += 1;
      });
      break;
    // Additional triad effects for other elements...
  }
  
  return gameState;
}
```

## UI Representation

The UI should clearly represent the elemental system:

1. **Azoth Pool Display**:
   - Show available Azoth by element
   - Use color-coded icons for each element
   - Display total available Azoth

2. **Card Cost Display**:
   - Show elemental symbols with cost numbers
   - Highlight costs that can/cannot be paid
   - Show potential Strength value based on available Azoth

3. **Elemental Effects Visualization**:
   - Highlight elemental advantages in combat
   - Show special effects when elemental synergies trigger
   - Animate Flag bonuses when applied

## Conclusion

The elemental system provides strategic depth to KONIVRER through:
- Resource management (Azoth allocation)
- Strategic decisions (which elements to focus on)
- Deck building constraints (Flag alignment)
- Combat advantages (elemental strengths/weaknesses)

By implementing this system with clear visual cues and consistent mechanics, players can engage with the strategic depth of KONIVRER's elemental interactions.