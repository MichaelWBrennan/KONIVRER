#!/usr/bin/env node

/**
 * Script to add MIT license headers to source files
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LICENSE_HEADER = `/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

`;

function hasLicenseHeader(content) {
  return content.includes('Copyright (c) 2024 KONIVRER Deck Database') || 
         content.includes('Licensed under the MIT License');
}

function addLicenseHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasLicenseHeader(content)) {
      console.log(`Skipping ${filePath} - already has license header`);
      return;
    }

    const newContent = LICENSE_HEADER + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added license header to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Process JavaScript and JSX files
      if (/\.(js|jsx|ts|tsx)$/.test(item) && !item.includes('.test.') && !item.includes('.spec.')) {
        addLicenseHeader(fullPath);
      }
    }
  }
}

// Start processing from src directory
const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  console.log('Adding MIT license headers to source files...');
  processDirectory(srcDir);
  console.log('License header addition complete!');
} else {
  console.error('src directory not found');
}