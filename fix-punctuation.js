#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Fixing punctuation errors...\n');

// Get files with specific error types
function getFilesWithErrors(errorType) {
  try {
    const output = execSync('npm run type-check 2>&1', { encoding: 'utf8' });
    return [];
  } catch (error) {
    const lines = error.stdout.split('\n').filter(line => line.includes(errorType));
    const files = new Set();
    lines.forEach(line => {
      const match = line.match(/^([^(]+)\(/);
      if (match) files.add(match[1]);
    });
    return Array.from(files);
  }
}

// Fix missing commas in object literals
const commaFiles = getFilesWithErrors("',' expected");
console.log(`Fixing comma errors in ${commaFiles.length} files...`);

commaFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Fix missing commas in object properties (be very conservative)
  // Only fix obvious cases where a property ends with a value and next line starts with a property
  content = content.replace(/(\w+: '[^']*')\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: \d+)\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: true)\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: false)\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: \[[^\]]*\])\s*\n(\s+\w+:)/g, '$1,\n$2');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`  ✅ Fixed commas in ${file}`);
  }
});

// Fix missing semicolons
const semicolonFiles = getFilesWithErrors("';' expected");
console.log(`\nFixing semicolon errors in ${semicolonFiles.length} files...`);

semicolonFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Fix missing semicolons at end of statements (be conservative)
  // Only fix obvious variable declarations and simple statements
  content = content.replace(/^(\s*const \w+ = [^;]+)$/gm, '$1;');
  content = content.replace(/^(\s*let \w+ = [^;]+)$/gm, '$1;');
  content = content.replace(/^(\s*var \w+ = [^;]+)$/gm, '$1;');
  content = content.replace(/^(\s*export const \w+ = [^;]+)$/gm, '$1;');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`  ✅ Fixed semicolons in ${file}`);
  }
});

// Check final count
try {
  execSync('npm run type-check 2>&1', { encoding: 'utf8' });
  console.log('\n🎉 All TypeScript errors fixed!');
} catch (error) {
  const finalErrors = error.stdout.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`\n📊 Remaining errors: ${finalErrors}`);
}

console.log('\n✨ Punctuation fixing complete!');