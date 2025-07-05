# KONIVRER Keyword System

This document explains the keyword system in KONIVRER and how it differs from the elemental system.

## Keywords vs Elements

**Keywords** and **Elements** are two separate and distinct systems in KONIVRER:

### Keywords
Keywords are special abilities or effects that cards can have. They are **NOT** elements and do not affect elemental costs or Azoth generation.

**The Six Keywords:**
- **Brilliance** (✦): Provides enhanced effects when conditions are met
- **Void** (◯): Removes cards from play permanently  
- **Gust** (≋): Affects movement and positioning
- **Submerged** (≈): Interacts with hidden or face-down cards
- **Inferno** (※): Deals damage over time or area effects
- **Steadfast** (⬢): Provides defensive bonuses or resistance

### Elements
Elements are the resource system used for paying card costs and generating Azoth.

**The Seven Elements:**
- **Fire** (△): Aggressive, direct damage
- **Water** (▽): Flow, card draw, flexibility  
- **Earth** (⊡): Stability, defense, permanence
- **Air** (△): Speed, evasion, manipulation
- **Aether** (○): Transformation, power, rarity
- **Nether** (□): Void, removal, disruption
- **Generic** (⊗): Universal, adaptable

## How Keywords Work

### Keyword Resolution
Keywords resolve when cards are played, except when played via **Burst**:

1. **Summon**: Keywords resolve normally
2. **Tribute**: Keywords resolve normally  
3. **Azoth**: Keywords do not resolve (card becomes resource)
4. **Spell**: Keywords resolve normally
5. **Burst**: Keywords do NOT resolve (per official rules)

### Keyword Synergies
When multiple cards with the same keyword are on the field, synergy effects may trigger:

- **2+ Brilliance**: Enhanced effects across all Brilliance cards
- **2+ Void**: Increased removal power
- **2+ Gust**: Wind storm effects
- **2+ Submerged**: Deep current effects  
- **2+ Inferno**: Spreading flame effects
- **2+ Steadfast**: Fortress defense effects

### Implementation Details

Keywords are stored in the `keywords` array on each card object:

```javascript
const card = {
  name: "ABISS",
  type: "ELEMENTAL", 
  elements: { aether: 1, nether: 1, water: 1 }, // Elemental costs
  keywords: ["VOID", "SUBMERGED"],              // Keywords (separate!)
  // ... other properties
};
```

## Common Misconceptions

### ❌ WRONG: Keywords are elements
```javascript
// This is INCORRECT - don't map keywords to elements
const elementMap = {
  'Brilliance': ELEMENTS.FIRE,  // NO!
  'Void': ELEMENTS.NETHER,      // NO!
  'Submerged': ELEMENTS.WATER   // NO!
};
```

### ✅ CORRECT: Keywords are separate
```javascript
// This is CORRECT - keywords and elements are separate
const card = {
  elements: { fire: 2, generic: 1 },    // For paying costs
  keywords: ["BRILLIANCE", "INFERNO"]   // For special effects
};
```

## Card Database Structure

In the JSON card database, cards have both `elements` and `keywords` fields:

```json
{
  "name": "ABISS",
  "type": "ELEMENTAL",
  "elements": ["Quintessence", "Void", "Submerged"],
  "cost": ["Quintessence", "Void", "Submerged"], 
  "keywords": ["VOID", "SUBMERGED"],
  "description": "VOID, SUBMERGED"
}
```

Note that:
- `elements` and `cost` refer to elemental requirements
- `keywords` are the special abilities
- Some element names in the database (like "Void", "Submerged") may coincidentally match keyword names, but they serve different purposes

## UI Representation

### Keyword Display
- Show keyword symbols next to card names
- Use distinct visual styling from elemental symbols
- Display keyword descriptions on hover/tap
- Group cards by keywords in deck builders

### Element Display  
- Show elemental cost symbols in card corners
- Use color coding for different elements
- Display available Azoth by element type
- Show elemental advantages in combat

## Integration with Game Engine

The keyword system integrates with the game engine through:

1. **Card Creation**: Keywords are added to cards during conversion from JSON
2. **Play Resolution**: Keywords trigger when cards are played (except Burst)
3. **Synergy Checking**: Field is scanned for keyword combinations
4. **Effect Application**: Each keyword has specific mechanical effects

## Future Expansion

The keyword system is designed to be extensible:

- New keywords can be added to the `KEYWORDS` constant
- Each keyword gets its own effect function
- Synergy effects can be expanded for new combinations
- UI can be updated to display new keyword symbols

## Summary

Remember: **Keywords ≠ Elements**

- **Keywords** = Special abilities and effects on cards
- **Elements** = Resource costs and Azoth generation

Keep these systems separate in code, documentation, and player understanding!