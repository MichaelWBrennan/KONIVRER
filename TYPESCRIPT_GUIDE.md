# TypeScript Conversion Guide

This repository uses TypeScript exclusively. This guide provides information on how to work with TypeScript in this project.

## TypeScript Only Policy

This repository has a strict TypeScript-only policy. All code must be written in TypeScript, not JavaScript.

## Converting JavaScript to TypeScript

If you need to convert JavaScript code to TypeScript, follow these steps:

1. Change the file extension from `.js` to `.ts` (or `.jsx` to `.tsx` for React components)
2. Add type annotations to function parameters and return types
3. Add type annotations to variables
4. Create interfaces for object structures
5. Use enums instead of string constants where appropriate

You can also use our automated conversion tools:

```bash
# Basic conversion
npm run convert:to-typescript

# Advanced conversion with better type inference
npm run convert:advanced

# Advanced conversion with options
npx ts-node scripts/advanced-typescript-conversion.ts --verbose --include "src"
```

The advanced conversion tool provides better type inference and handles:
- React components (both class and functional)
- Node.js scripts
- Complex object structures
- Function parameters and return types
- Variable declarations
- Class properties
- And more

## TypeScript Best Practices

- Always specify return types for functions
- Use interfaces for object shapes
- Use type aliases for complex types
- Avoid using `any` when possible
- Use generics for reusable components
- Use union types for variables that can have multiple types
- Use optional properties instead of nullable properties when appropriate

## Type Definitions

### Common Types

```typescript
// Card type
interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  element?: string;
  power?: number;
  toughness?: number;
  cost: number;
  text: string;
  keywords?: string[];
  imageUrl?: string;
}

// Player type
interface Player {
  id: string;
  name: string;
  health: number;
  azoth: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
  graveyard: Card[];
}

// Game state type
interface GameState {
  players: Player[];
  activePlayer: string;
  turn: number;
  phase: GamePhase;
  combat?: CombatState;
}
```

### Enums

```typescript
// Card type enum
enum CardType {
  FAMILIAR = 'familiar',
  SPELL = 'spell',
  ARTIFACT = 'artifact',
  FLAG = 'flag',
  AZOTH = 'azoth'
}

// Card rarity enum
enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  FLAG = 'flag'
}

// Game phase enum
enum GamePhase {
  DRAW = 'draw',
  MAIN = 'main',
  COMBAT = 'combat',
  SECOND_MAIN = 'second_main',
  END = 'end'
}
```

## Enforcing TypeScript

The repository has several mechanisms to enforce TypeScript:

- Pre-commit hooks that prevent committing JavaScript files
- GitHub Actions that check for JavaScript files
- ESLint rules that enforce TypeScript usage
- TypeScript compiler options that disallow JavaScript

To check for JavaScript files in the src directory:

```bash
npm run check:no-js
```

## Troubleshooting

If you encounter issues with TypeScript:

1. Run `npm run type-check` to see all TypeScript errors
2. Use `npm run fix:typescript` to automatically fix common TypeScript errors
3. Consult the TypeScript documentation at https://www.typescriptlang.org/docs/

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Common TypeScript Patterns

### React Components

```typescript
import React, { useState, useEffect } from 'react';

interface CardProps {
  card: Card;
  onClick?: (card: Card) => void;
  isSelected?: boolean;
}

const CardComponent: React.FC<CardProps> = ({ card, onClick, isSelected = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`} 
      onClick={handleClick}
    >
      <h3>{card.name}</h3>
      <p>{card.text}</p>
    </div>
  );
};

export default CardComponent;
```

### Custom Hooks

```typescript
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  const refetch = () => {
    fetchData();
  };
  
  return { data, loading, error, refetch };
}

export default useFetch;
```

### Context API

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string) => {
    // Implementation
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const userData = await response.json();
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```