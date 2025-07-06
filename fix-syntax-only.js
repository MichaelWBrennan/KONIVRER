#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Fixing specific syntax errors only...\n');

// Get all TypeScript files
const files = execSync('find src -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' }).trim().split('\n');

let totalFixed = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Only fix very specific syntax patterns that we know are wrong
  
  // 1. Fix ": {;" pattern (should be ": {")
  content = content.replace(/: \{;/g, ': {');
  
  // 2. Fix "{}," pattern (should be "{}")
  content = content.replace(/\{\},/g, '{}');
  
  // 3. Fix "({;" pattern (should be "({")
  content = content.replace(/\(\{;/g, '({');
  
  // 4. Fix registerCardAnimation syntax
  content = content.replace(/registerCardAnimation\('([^']+)': any,/g, "registerCardAnimation('$1',");
  
  // 5. Fix broken constructor syntax
  content = content.replace(/constructor\(\) any = \{\}\): any \{/g, 'constructor(config: any = {}) {');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    totalFixed++;
    console.log(`✅ Fixed ${file}`);
  }
});

console.log(`\n📊 Fixed ${totalFixed} files`);

// Check final count
try {
  execSync('npm run type-check 2>&1', { encoding: 'utf8' });
  console.log('🎉 All TypeScript errors fixed!');
} catch (error) {
  const finalErrors = error.stdout.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`📊 Remaining errors: ${finalErrors}`);
}

console.log('\n✨ Syntax fixing complete!');