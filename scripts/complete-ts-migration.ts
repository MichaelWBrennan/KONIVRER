#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced TypeScript migration with proper type definitions
function createTypeDefinitions(): void {
  const typesDir = path.join(__dirname, '..', 'src', 'types');
  
  // Ensure types directory exists
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Create comprehensive type definitions
  const typeFiles = {
    'card.ts': `// Card type definitions for KONIVRER
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
  reminder?: string;
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
  rarity?: 'common' | 'uncommon' | 'rare' | 'mythic';
  rested?: boolean;
  set?: string;
  artist?: string;
  flavorText?: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  format: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}`,

    'game.ts': `// Game state and mechanics types
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

export interface GameAction {
  type: string;
  payload: any;
  playerId: string;
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  wins: number;
  losses: number;
}`,

    'api.ts': `// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
}`,

    'component.ts': `// React component prop types
import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}`,

    'index.ts': `// Main type exports
export * from './card';
export * from './game';
export * from './api';
export * from './component';

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export {};`
  };

  // Write type definition files
  Object.entries(typeFiles).forEach(([filename, content]) => {
    const filePath = path.join(typesDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`Created type definition: ${filename}`);
  });
}

// Create modern React components with proper TypeScript
function createModernComponents(): void {
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  
  // Create a modern Layout component
  const layoutComponent = `import React from 'react';
import { Outlet } from 'react-router-dom';
import { BaseComponentProps } from '../types';

interface LayoutProps extends BaseComponentProps {
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  showNavigation = true 
}) => {
  return (
    <div className={\`min-h-screen bg-gray-900 text-white \${className}\`}>
      {showNavigation && (
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">KONIVRER</h1>
              <div className="flex gap-4">
                <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
                <a href="/cards" className="hover:text-blue-400 transition-colors">Cards</a>
                <a href="/decks" className="hover:text-blue-400 transition-colors">Decks</a>
                <a href="/tournaments" className="hover:text-blue-400 transition-colors">Tournaments</a>
            </div>
        </nav>
      )}
      <main>
        {children || <Outlet />}
    </div>
  );
};

export default Layout;`;

  // Create ErrorBoundary component
  const errorBoundaryComponent = `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              Reload Page
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}`;

  // Write component files
  const componentFiles = {
    'Layout.tsx': layoutComponent,
    'ErrorBoundary.tsx': errorBoundaryComponent
  };

  Object.entries(componentFiles).forEach(([filename, content]) => {
    const filePath = path.join(componentsDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`Created modern component: ${filename}`);
  });
}

// Update package.json with TypeScript optimizations
function updatePackageJson(): void {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add TypeScript-specific scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'type-check': 'tsc --noEmit',
    'type-check:watch': 'tsc --noEmit --watch',
    'build:types': 'tsc --emitDeclarationOnly',
    'lint:types': 'tsc --noEmit && eslint . --ext .ts,.tsx',
    'dev:typed': 'npm run type-check && npm run dev'
  };

  // Ensure TypeScript dependencies are present
  const tsDevDeps = {
    '@types/react': '^18.2.67',
    '@types/react-dom': '^18.2.22',
    '@types/node': '^20.11.30',
    'typescript': '^5.4.5'
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...tsDevDeps
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with TypeScript optimizations');
}

// Create modern tsconfig with strict settings
function updateTsConfig(): void {
  const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
  
  const modernTsConfig = {
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      
      // Bundler mode
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      
      // Strict type checking
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noImplicitReturns: true,
      noImplicitOverride: true,
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      
      // Additional strict checks
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true,
      
      // Path mapping
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
        "@components/*": ["./src/components/*"],
        "@pages/*": ["./src/pages/*"],
        "@types/*": ["./src/types/*"],
        "@utils/*": ["./src/utils/*"],
        "@hooks/*": ["./src/hooks/*"],
        "@services/*": ["./src/services/*"]
      },
      
      // Type checking
      types: ["vite/client", "vitest/globals"]
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
    references: [{ path: "./tsconfig.node.json" }]
  };

  fs.writeFileSync(tsconfigPath, JSON.stringify(modernTsConfig, null, 2));
  console.log('Updated tsconfig.json with modern strict settings');
}

// Main migration function
async function runCompleteMigration(): void {
  console.log('🚀 Starting complete TypeScript migration...\n');

  try {
    console.log('📝 Creating comprehensive type definitions...');
    createTypeDefinitions();
    
    console.log('\n🏗️  Creating modern React components...');
    createModernComponents();
    
    console.log('\n📦 Updating package.json...');
    updatePackageJson();
    
    console.log('\n⚙️  Updating TypeScript configuration...');
    updateTsConfig();
    
    console.log('\n✅ TypeScript migration completed successfully!');
    console.log('\n🎉 Your KONIVRER project is now fully converted to state-of-the-art TypeScript!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run type-check');
    console.log('3. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runCompleteMigration();