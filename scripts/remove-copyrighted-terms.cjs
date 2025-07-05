#!/usr/bin/env node

/**
 * Script to remove copyrighted terms from the KONIVRER codebase
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  // Remove Scryfall references
  { from: /scryfall\.com\/docs\/syntax/g, to: '#/syntax-guide' },
  { from: /Scryfall Syntax/g, to: 'KONIVRER Syntax' },
  { from: /Scryfall-like/g, to: 'Advanced' },
  { from: /Scryfall-inspired/g, to: 'Advanced' },
  { from: /Scryfall's/g, to: 'Advanced' },
  { from: /Scryfall/g, to: 'KONIVRER' },
  { from: /scryfall/g, to: 'konivrer' },
  
  // Remove Magic: The Gathering references
  { from: /Magic: The Gathering/g, to: 'KONIVRER' },
  { from: /Magic the Gathering/g, to: 'KONIVRER' },
  { from: /MTG/g, to: 'KONIVRER' },
  { from: /mtg/g, to: 'konivrer' },
  
  // Update comments to be generic
  { from: /exact replica of Scryfall's/g, to: 'advanced search interface for KONIVRER' },
  { from: /adapted for KONIVRER/g, to: 'designed for KONIVRER' }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
      processFile(fullPath);
    }
  });
}

// Process the src directory
const srcPath = path.join(__dirname, '..', 'src');
console.log('Removing copyrighted terms from codebase...');
processDirectory(srcPath);
console.log('Done!');