#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing remaining TypeScript errors...\n');

// Get current errors and group by type
let errorOutput;
try {
  errorOutput = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
} catch (error) {
  errorOutput = error.stdout;
}

const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
console.log(`Found ${errorLines.length} errors to fix\n`);

// Group errors by file
const errorsByFile = {};
errorLines.forEach(line => {
  const match = line.match(/^([^(]+)\(/);
  if (match) {
    const file = match[1];
    if (!errorsByFile[file]) errorsByFile[file] = [];
    errorsByFile[file].push(line);
  }
});

// Fix each file
Object.keys(errorsByFile).forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  console.log(`Fixing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix common syntax patterns
  
  // Fix broken function parameter syntax
  if (content.includes(') any = {}): any {')) {
    content = content.replace(/constructor\(\) any = \{\}\): any \{/g, 'constructor(config: any = {}) {');
    modified = true;
  }

  // Fix broken method definitions
  content = content.replace(/(\w+)\(\) any = \{\}\): any \{/g, '$1(config: any = {}) {');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix registerCardAnimation syntax
  content = content.replace(/registerCardAnimation\('([^']+)': any,/g, "registerCardAnimation('$1',");
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix broken method calls with syntax errors
  content = content.replace(/(\w+)\(\) any\)/g, '$1()');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix broken parameter lists
  content = content.replace(/\(\) any = \{\}\)/g, '(config: any = {})');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix broken return types
  content = content.replace(/\): any \{/g, ') {');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix broken JSDoc comments
  content = content.replace(/\* @param \{Object\s*\n\} /g, '* @param ');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix missing commas in object literals
  content = content.replace(/(\w+): (\w+) (\w+):/g, '$1: $2, $3:');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  // Fix broken class method syntax
  content = content.replace(/(\w+)\(\) any\s*\{/g, '$1() {');
  if (content !== fs.readFileSync(filePath, 'utf8')) modified = true;

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed syntax errors`);
  }
});

// Check final count
try {
  const finalCheck = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
  const finalErrors = finalCheck.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`\n📊 Remaining errors: ${finalErrors}`);
} catch (error) {
  const finalErrors = error.stdout.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`\n📊 Remaining errors: ${finalErrors}`);
}

console.log('\n✨ Syntax error fixing complete!');