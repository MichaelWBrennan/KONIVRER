#!/usr/bin/env node
/**
 * KONIVRER Deck Database - TypeScript Migration Script
 *
 * This script helps migrate JavaScript/JSX files to TypeScript/TSX
 * It performs the following tasks:
 * 1. Renames .js/.jsx files to .ts/.tsx
 * 2. Adds basic type annotations
 * 3. Creates type definition files for core data structures
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const SRC_DIR = path.resolve(process.cwd(), 'src');
const TYPES_DIR = path.resolve(SRC_DIR, 'types');
const EXCLUDED_DIRS = ['node_modules', 'dist', 'build', '.git'];
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const INTERACTIVE = process.argv.includes('--interactive');
const SPECIFIC_FILE = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];

// Create types directory if it doesn't exist
if (!fs.existsSync(TYPES_DIR) && !DRY_RUN) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
  console.log(`Created types directory at ${TYPES_DIR}`);
}

// Helper functions
function log(): void {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',    // Cyan
    success: '\x1b[32m%s\x1b[0m',  // Green
    warning: '\x1b[33m%s\x1b[0m',  // Yellow
    error: '\x1b[31m%s\x1b[0m'     // Red
  };
  
  console.log(colors[type], message);
}

function shouldProcessFile(): void {
  const ext = path.extname(filePath);
  return ['.js', '.jsx'].includes(ext) && 
         !filePath.endsWith('.test.js') && 
         !filePath.endsWith('.test.jsx') &&
         !filePath.endsWith('.config.js') &&
         !filePath.includes('vite.config') &&
         !filePath.includes('vitest.config');
}

function getTypeScriptExtension(): void {
  const ext = path.extname(filePath);
  if (ext === '.js') return '.ts';
  if (ext === '.jsx') return '.tsx';
  return ext;
}

function hasReactImport(): void {
  return /import\s+React|import\s+{\s*.*React/.test(content);
}

function hasJSXSyntax(): void {
  return /<[A-Z][A-Za-z0-9]*|<[a-z][A-Za-z0-9]*>/.test(content);
}

function addBasicTypeAnnotations(): void {
  // This is a simplified version - a real implementation would use a proper parser
  let modifiedContent = content;
  
  // Add React import if JSX is used but React isn't imported
  if (hasJSXSyntax(content) && !hasReactImport(content)) {
    modifiedContent = `import React from 'react';\n${modifiedContent}`;
  }
  
  // Add FC type to functional components
  if (hasJSXSyntax(content)) {
    modifiedContent = modifiedContent.replace(
      /const\s+([A-Z][A-Za-z0-9]*)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=>/g,
      (match, componentName, props) => {
        // Extract prop names
        const propNames = props.split(',').map(p => p.trim());
        const propsTypeName = `${componentName}Props`;
        
        // Create props interface
        const propsInterface = `interface ${propsTypeName} {\n${
          propNames.map(prop => `  ${prop}: any;`).join('\n')
        }\n}\n\n`;
        
        // Add FC type
        return `${propsInterface}const ${componentName}: React.FC<${propsTypeName}> = ({ ${props} }) =>`;
      }
    );
  }
  
  // Add useState type annotations
  modifiedContent = modifiedContent.replace(
    /const\s+\[([^,]+),\s*set([^]]+)\]\s*=\s*useState\(([^)]*)\)/g,
    (match, stateName, setterName, initialValue) => {
      // Try to infer the type
      let type = 'any';
      if (initialValue === 'false' || initialValue === 'true') type = 'boolean';
      else if (initialValue === '0' || /^\d+$/.test(initialValue)) type = 'number';
      else if (initialValue === '""' || initialValue === "''") type = 'string';
      else if (initialValue === '[]') type = 'any[]';
      else if (initialValue === '{}') type = 'Record<string, any>';
      else if (initialValue === 'null') type = 'null';
      
      return `const [${stateName}, set${setterName}] = useState<${type}>(${initialValue})`;
    }
  );
  
  // Add useRef type annotations
  modifiedContent = modifiedContent.replace(
    /const\s+([^=]+)\s*=\s*useRef\(([^)]*)\)/g,
    (match, refName, initialValue) => {
      // Try to infer the type
      let type = 'any';
      if (initialValue === 'null') type = 'HTMLElement';
      
      return `const ${refName} = useRef<${type}>(${initialValue})`;
    }
  );
  
  // Add function return types
  modifiedContent = modifiedContent.replace(
    /function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*{/g,
    (match, funcName, params) => {
      return `function ${funcName}(${params}): any {`;
    }
  );
  
  // Add arrow function return types
  modifiedContent = modifiedContent.replace(
    /const\s+([A-Za-z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g,
    (match, funcName, params) => {
      return `const ${funcName} = (${params}): any => {`;
    }
  );
  
  return modifiedContent;
}

function createTypeDefinitionFiles(): void {
  // Create card.ts
  const cardTypes = `/**
 * KONIVRER Deck Database - Card Type Definitions
 */

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

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  owner: string;
  created: Date;
  updated: Date;
  isPublic: boolean;
  format: string;
  tags: string[];
}
`;

  // Create game.ts
  const gameTypes = `/**
 * KONIVRER Deck Database - Game Type Definitions
 */

import { Card } from './card';

export type GamePhase = 'start' | 'main' | 'combat' | 'refresh';
export type PlayerType = 'player' | 'opponent';

export interface Flag {
  name: string;
  elements: string[];
  image: string;
}

export interface GameState {
  turn: number;
  phase: GamePhase;
  activePlayer: PlayerType;
  playerLifeCards: number;
  opponentLifeCards: number;
  playerFlag: Flag;
  opponentFlag: Flag;
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

export interface StackEntry {
  effect: {
    type: string;
    card: Card;
    target?: any;
  };
  player: PlayerType;
  timestamp: number;
}
`;

  // Create api.ts
  const apiTypes = `/**
 * KONIVRER Deck Database - API Type Definitions
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  created: Date;
  lastLogin?: Date;
  isAdmin: boolean;
}

export interface AuthResponse extends ApiResponse<User> {
  token?: string;
}

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: string;
  startDate: Date;
  endDate?: Date;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
  rounds: TournamentRound[];
  organizer: string;
}

export interface TournamentRound {
  id: string;
  number: number;
  matches: TournamentMatch[];
  status: 'upcoming' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface TournamentMatch {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
  score?: {
    player1: number;
    player2: number;
  };
  status: 'upcoming' | 'active' | 'completed';
  tableNumber?: number;
}
`;

  // Create component.ts
  const componentTypes = `/**
 * KONIVRER Deck Database - Component Type Definitions
 */

import { ReactNode, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { Card, Deck } from './card';
import { User, Tournament } from './api';
import { GameState, PlayerType } from './game';

export interface CardComponentProps {
  card: Card;
  onClick?: (id: string) => void;
  onMouseEnter?: (card: Card) => void;
  onMouseLeave?: () => void;
  className?: string;
  isSelected?: boolean;
  isRested?: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface DeckComponentProps {
  deck: Deck;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  showStats?: boolean;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export interface InputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

export interface GameBoardProps {
  onExit: () => void;
  initialState?: Partial<GameState>;
  playerDeck?: Card[];
  opponentDeck?: Card[];
}

export interface ProfileProps {
  user: User;
  isCurrentUser: boolean;
  onEdit?: () => void;
}

export interface TournamentCardProps {
  tournament: Tournament;
  onClick?: (id: string) => void;
  onRegister?: (id: string) => void;
  isRegistered?: boolean;
}
`;

  if (!DRY_RUN) {
    fs.writeFileSync(path.join(TYPES_DIR, 'card.ts'), cardTypes);
    fs.writeFileSync(path.join(TYPES_DIR, 'game.ts'), gameTypes);
    fs.writeFileSync(path.join(TYPES_DIR, 'api.ts'), apiTypes);
    fs.writeFileSync(path.join(TYPES_DIR, 'component.ts'), componentTypes);
    log('Created type definition files in src/types/', 'success');
  } else {
    log('Would create type definition files in src/types/', 'info');
  }
}

// Process a single file
async function processFile(): void {
  if (!shouldProcessFile(filePath)) {
    if (VERBOSE) log(`Skipping ${filePath}`, 'warning');
    return false;
  }
  
  const newExt = getTypeScriptExtension(filePath);
  const newPath = filePath.replace(/\.(js|jsx)$/, newExt);
  
  if (VERBOSE) log(`Processing ${filePath} -> ${newPath}`, 'info');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = addBasicTypeAnnotations(content, filePath);
    
    if (INTERACTIVE) {
      const answer = await new Promise(resolve => {
        rl.question(`Convert ${filePath} to TypeScript? (y/n) `, resolve);
      });
      
      if (answer.toLowerCase() !== 'y') {
        log(`Skipping ${filePath}`, 'warning');
        return false;
      }
    }
    
    if (!DRY_RUN) {
      fs.writeFileSync(newPath, modifiedContent);
      fs.unlinkSync(filePath);
      log(`Converted ${filePath} -> ${newPath}`, 'success');
    } else {
      log(`Would convert ${filePath} -> ${newPath}`, 'info');
    }
    
    return true;
  } catch (error) {
    log(`Error processing ${filePath}: ${error.message}`, 'error');
    return false;
  }
}

// Walk directory recursively
async function walkDir(): void {
  let converted = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !EXCLUDED_DIRS.includes(file)) {
      converted += await walkDir(filePath);
    } else if (stat.isFile()) {
      if (SPECIFIC_FILE && !filePath.includes(SPECIFIC_FILE)) continue;
      
      const success = await processFile(filePath);
      if (success) converted++;
    }
  }
  
  return converted;
}

// Main function
async function main(): void {
  log('Starting TypeScript migration...', 'info');
  
  if (DRY_RUN) {
    log('DRY RUN: No files will be modified', 'warning');
  }
  
  // Create type definition files
  createTypeDefinitionFiles();
  
  // Process files
  const converted = await walkDir(SRC_DIR);
  
  log(`Migration complete. ${converted} files converted.`, 'success');
  
  // Update package.json to include TypeScript dependencies
  if (!DRY_RUN) {
    try {
      log('Installing TypeScript dependencies...', 'info');
      execSync('npm install --save-dev typescript @types/react @types/react-dom @types/node', { stdio: 'inherit' });
      log('TypeScript dependencies installed.', 'success');
    } catch (error) {
      log(`Error installing TypeScript dependencies: ${error.message}`, 'error');
    }
  } else {
    log('Would install TypeScript dependencies', 'info');
  }
  
  rl.close();
}

// Run the script
main().catch(error => {
  log(`Error: ${error.message}`, 'error');
  process.exit(1);
});