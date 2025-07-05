# TypeScript Migration Plan for KONIVRER Deck Database

## Overview

This document outlines the plan to migrate the KONIVRER Deck Database from JavaScript to TypeScript for improved code quality, maintainability, and performance.

## Benefits of TypeScript

1. **Static Type Checking**: Catch errors at compile time rather than runtime
2. **Improved IDE Support**: Better autocompletion, navigation, and refactoring tools
3. **Self-Documenting Code**: Types serve as documentation for functions and components
4. **Enhanced Refactoring**: Safer and more efficient code changes
5. **Better Scalability**: Easier to maintain as the codebase grows
6. **Performance Optimizations**: TypeScript compiler can help optimize code

## Migration Strategy

### Phase 1: Setup and Configuration

1. ✅ Verify TypeScript configuration in `tsconfig.json`
2. Update build tools to properly handle TypeScript files
3. Create type definition files for external libraries without TypeScript support

### Phase 2: Core Infrastructure Migration

1. Create type definitions for core data structures
   - Card types
   - Deck types
   - User types
   - Game state types
2. Migrate utility functions to TypeScript
3. Migrate API service layer to TypeScript

### Phase 3: Component Migration

1. Create type definitions for props and state
2. Migrate components from `.jsx` to `.tsx`
3. Implement proper typing for component props, state, and event handlers
4. Add proper return types for all functions

### Phase 4: Context and State Management Migration

1. Type all context providers and consumers
2. Add proper typing for state management (Zustand)
3. Type all reducers and actions

### Phase 5: Server-Side Migration

1. Migrate Express server code to TypeScript
2. Create type definitions for API requests and responses
3. Implement proper error handling with typed errors

### Phase 6: Testing and Validation

1. Update test files to TypeScript
2. Add type checking to CI/CD pipeline
3. Validate type coverage across the codebase

## Implementation Details

### Type Definitions for Core Data Structures

```typescript
// src/types/card.ts
export interface Element {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

export interface Keyword {
  id: string;
  name: string;
  description: string;
}

export interface Card {
  id: string;
  name: string;
  elements: Element[];
  cost: number;
  type: 'Familiar' | 'Spell';
  counters?: number;
  keywords: Keyword[];
  text: string;
  image: string;
  rarity?: 'common' | 'uncommon' | 'rare';
  rested?: boolean;
}

// src/types/game.ts
export interface GameState {
  turn: number;
  phase: 'start' | 'main' | 'combat' | 'refresh';
  activePlayer: 'player' | 'opponent';
  playerLifeCards: number;
  opponentLifeCards: number;
  playerField: Card[];
  opponentField: Card[];
  playerCombatRow: Card[];
  opponentCombatRow: Card[];
  playerAzoth: Card[];
  opponentAzoth: Card[];
  playerHand: Card[];
  opponentHandCount: number;
  playerDeckCount: number;
  opponentDeckCount: number;
  playerRemovedFromPlay: Card[];
  opponentRemovedFromPlay: Card[];
}

// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Component Migration Example

```typescript
// Before (JSX)
import React, { useState } from 'react';

const CardComponent = ({ card, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(card.id)}
    >
      <img src={card.image} alt={card.name} />
      <div className="card-name">{card.name}</div>
    </div>
  );
};

export default CardComponent;

// After (TSX)
import React, { useState, FC, MouseEvent } from 'react';
import { Card } from '../types/card';

interface CardComponentProps {
  card: Card;
  onClick: (id: string) => void;
}

const CardComponent: FC<CardComponentProps> = ({ card, onClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    onClick(card.id);
  };
  
  return (
    <div 
      className={`card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img src={card.image} alt={card.name} />
      <div className="card-name">{card.name}</div>
    </div>
  );
};

export default CardComponent;
```

## Performance Optimizations

1. **Code Splitting**: Use dynamic imports to split code into smaller chunks
2. **Tree Shaking**: TypeScript helps eliminate unused code
3. **Memoization**: Use React.memo and useMemo with proper typing
4. **Type-Based Optimizations**: The TypeScript compiler can make optimizations based on type information

## Timeline

- Phase 1: 1 day
- Phase 2: 2-3 days
- Phase 3: 3-5 days
- Phase 4: 2-3 days
- Phase 5: 2-3 days
- Phase 6: 1-2 days

Total estimated time: 11-17 days

## Conclusion

Migrating to TypeScript will significantly improve the quality, maintainability, and performance of the KONIVRER Deck Database. The migration will be done incrementally to minimize disruption to ongoing development.