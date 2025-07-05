# KONIVRER Keyword Implementation

This document details the implementation of all KONIVRER keywords based on the official rules.

## Overview

KONIVRER features 8 unique keywords that activate only once when the respective Spell/Familiar is played. Each keyword has specific targeting restrictions and elemental interactions.

## Implemented Keywords

### 1. Amalgam ⚯
**Rule**: Choose one of two listed Keywords when summoned (gains keyword + linked element) OR choose one of two listed Elements when used as Azoth.

**Implementation**:
- **Summoned**: Triggers choice UI for keyword and element selection
- **Azoth**: Triggers choice UI for element type selection
- **Code Location**: `src/engine/keywordSystem.js` - `applyAmalgamEffect()`

**Game State Changes**:
```javascript
// When summoned
gameState.waitingForInput = true;
gameState.inputType = 'amalgam_keyword_choice';

// When used as Azoth
gameState.waitingForInput = true;
gameState.inputType = 'amalgam_element_choice';
```

### 2. Brilliance ✦
**Rule**: Place target Familiar with +1 Counters or Spell with Strength ≤ ○ used to pay for this card's Strength on the bottom of its owner's life cards. (doesn't affect □ cards)

**Implementation**:
- Targets Familiars with counters or Spells with strength ≤ Aether used
- Excludes Nether (□) element cards
- Moves target to bottom of life cards
- **Code Location**: `src/engine/keywordSystem.js` - `applyBrillianceEffect()`

### 3. Gust ≋
**Rule**: Return target Familiar with +1 Counters or Spell with Strength ≤ △ used to pay for this card's Strength to its owner's hand. (doesn't affect ▽ cards)

**Implementation**:
- Targets Familiars with counters or Spells with strength ≤ Fire used
- Excludes Water (▽) element cards
- Returns target to owner's hand
- **Code Location**: `src/engine/keywordSystem.js` - `applyGustEffect()`

### 4. Inferno ※
**Rule**: After damage is dealt to the target card, add damage ≤ △ used to pay for this card's Strength. (doesn't affect ▽ cards)

**Implementation**:
- Sets up triggered ability for additional damage
- Additional damage equals Fire element used
- Excludes Water (▽) element cards
- **Code Location**: `src/engine/keywordSystem.js` - `applyInfernoEffect()`

**Trigger Setup**:
```javascript
card.infernoTrigger = {
  active: true,
  additionalDamage: fireUsed
};
```

### 5. Steadfast ⬢
**Rule**: Redirect damage ≤ ⊡ used to pay for this card's Strength, that would be done to you or cards you control, to this card's Strength. (doesn't affect △ cards)

**Implementation**:
- Sets up replacement effect for damage redirection
- Redirect amount equals Earth element used
- Excludes Fire (△) element cards
- **Code Location**: `src/engine/keywordSystem.js` - `applySteadfastEffect()`

**Protection Setup**:
```javascript
card.steadfastProtection = {
  active: true,
  redirectAmount: earthUsed
};
```

### 6. Submerged ≈
**Rule**: Place target Familiar with +1 Counters or Spell with Strength ≤ ▽ used to pay for this card's Strength, that many cards below the top of its owner's deck. (doesn't affect △ cards)

**Implementation**:
- Targets Familiars with counters or Spells with strength ≤ Water used
- Excludes Fire (△) element cards
- Places target below top of deck (second position)
- **Code Location**: `src/engine/keywordSystem.js` - `applySubmergedEffect()`

### 7. Quintessence ⬟
**Rule**: This card can't be played as a Familiar. While in the Azoth row, it produces any Azoth type.

**Implementation**:
- **Summon Prevention**: Blocks summoning in `src/engine/cardActions.js`
- **Universal Azoth**: Modified `src/engine/elementalSystem.js` to handle any element production
- **Code Location**: Multiple files for complete implementation

**Summon Check**:
```javascript
if (card.keywords && card.keywords.includes('QUINTESSENCE')) {
  gameState.gameLog.push(`Error: ${card.name} with Quintessence cannot be summoned as a Familiar`);
  return gameState;
}
```

**Azoth Production**:
```javascript
if (azoth.quintessenceAzoth) {
  // Can produce any element type
  available[ELEMENTS.FIRE]++;
  available[ELEMENTS.WATER]++;
  // ... all elements
}
```

### 8. Void ◯
**Rule**: Remove target card from the game. (doesn't affect ○ cards)

**Implementation**:
- Targets any card in any zone
- Excludes Aether (○) element cards
- Permanently removes card to `removedFromPlay` zone
- **Code Location**: `src/engine/keywordSystem.js` - `applyVoidEffect()`

## Targeting System

### Valid Target Functions
Each keyword has specific targeting logic:

- `getBrillianceValidTargets()` - Familiars with counters or Spells ≤ Aether used
- `getGustValidTargets()` - Familiars with counters or Spells ≤ Fire used  
- `getSubmergedValidTargets()` - Familiars with counters or Spells ≤ Water used
- `getVoidValidTargets()` - Any card except Aether element cards

### Element Restrictions
Keywords respect elemental immunities:
- **Brilliance**: Doesn't affect Nether (□) cards
- **Gust**: Doesn't affect Water (▽) cards
- **Inferno**: Doesn't affect Water (▽) cards
- **Steadfast**: Doesn't affect Fire (△) cards
- **Submerged**: Doesn't affect Fire (△) cards
- **Void**: Doesn't affect Aether (○) cards

## Input Handling

### Waiting for Input States
When keywords require player choices, the game enters waiting states:

```javascript
gameState.waitingForInput = true;
gameState.inputType = 'keyword_target_type';
gameState.inputData = {
  playerId,
  cardId,
  validTargets,
  // additional data
};
```

### Input Types
- `amalgam_keyword_choice` - Choose keyword and element for Amalgam
- `amalgam_element_choice` - Choose element for Amalgam Azoth
- `brilliance_target` - Choose target for Brilliance effect
- `gust_target` - Choose target for Gust effect
- `submerged_target` - Choose target for Submerged effect
- `void_target` - Choose target for Void effect

## Execution System

### Target Execution
The `executeKeywordTarget()` function handles target resolution:

```javascript
export function executeKeywordTarget(gameState, keywordType, targetInfo) {
  switch (keywordType) {
    case 'brilliance_target':
      return executeBrillianceTarget(gameState, targetCard, targetPlayerIndex, targetZone);
    // ... other cases
  }
}
```

### Zone Management
Helper function `removeCardFromZone()` handles card movement between zones:
- Field → Life Cards (Brilliance)
- Field → Hand (Gust)  
- Field → Deck position (Submerged)
- Any Zone → Removed from Play (Void)

## Synergy System

### Keyword Counting
The system tracks multiple instances of the same keyword for synergy effects:

```javascript
const keywordCounts = {
  [KEYWORDS.AMALGAM]: 0,
  [KEYWORDS.BRILLIANCE]: 0,
  // ... all keywords
};
```

### Synergy Effects
When 2+ cards with the same keyword are on the field:
- **Amalgam**: Enhanced adaptability
- **Brilliance**: Radiant synergy
- **Gust**: Wind storm effect
- **Inferno**: Spreading flames
- **Steadfast**: Fortress defense
- **Submerged**: Deep current effect
- **Quintessence**: Pure energy resonance
- **Void**: Enhanced removal

## Integration Points

### Game Engine Integration
Keywords integrate with:
- **Card Actions**: Summon prevention (Quintessence)
- **Elemental System**: Universal Azoth production (Quintessence)
- **Combat System**: Damage triggers (Inferno, Steadfast)
- **Rules Engine**: Triggered and replacement effects

### UI Integration
Keywords provide display information via `getKeywordDisplayInfo()`:
- Name (uppercase)
- Symbol (Unicode character)
- Description (rules text)

## Testing Considerations

### Edge Cases
- Multiple keyword interactions
- Element immunity interactions
- Zone transition edge cases
- Quintessence Azoth calculation

### Validation
- Target validity checking
- Element restriction enforcement
- Zone state consistency
- Input state management

This implementation provides a complete, rules-accurate keyword system that integrates seamlessly with KONIVRER's unique game mechanics.