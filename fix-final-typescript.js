#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 Final TypeScript error cleanup...\n');

// Get specific error files and fix them individually
function getErrorFiles() {
  try {
    const output = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
    return [];
  } catch (error) {
    const lines = error.stdout.split('\n').filter(line => line.includes('error TS'));
    const files = new Set();
    lines.forEach(line => {
      const match = line.match(/^([^(]+)\(/);
      if (match) files.add(match[1]);
    });
    return Array.from(files);
  }
}

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix specific syntax patterns based on common errors
  
  // 1. Fix broken constructor syntax
  content = content.replace(/constructor\(\) any = \{\}\): any \{/g, 'constructor(config: any = {}) {');
  
  // 2. Fix registerCardAnimation calls
  content = content.replace(/registerCardAnimation\('([^']+)': any,/g, "registerCardAnimation('$1',");
  
  // 3. Fix broken method definitions
  content = content.replace(/(\w+)\(\) any = \{\}\): any \{/g, '$1(config: any = {}) {');
  
  // 4. Fix broken JSDoc comments
  content = content.replace(/\* @param \{Object\s*\n\} /g, '* @param ');
  
  // 5. Fix broken return types
  content = content.replace(/\): any \{/g, ') {');
  
  // 6. Fix missing semicolons in class properties
  content = content.replace(/^(\s+\w+:\s*[^;,\n]+)$/gm, '$1;');
  
  // 7. Fix missing commas in object literals (only in arrays)
  content = content.replace(/(\w+: '[^']*')\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: \d+)\s*\n(\s+\w+:)/g, '$1,\n$2');
  content = content.replace(/(\w+: \[[^\]]*\])\s*\n(\s+\w+:)/g, '$1,\n$2');
  
  // 8. Fix broken class method calls
  content = content.replace(/(\w+)\(\) any\)/g, '$1()');
  
  // 9. Fix broken parameter syntax
  content = content.replace(/\(\) any = \{\}\)/g, '(config: any = {})');
  
  // 10. Fix missing closing braces in classes
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    content += '\n}'.repeat(openBraces - closeBraces);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Process all error files
const errorFiles = getErrorFiles();
console.log(`Found ${errorFiles.length} files with errors\n`);

let fixedCount = 0;
errorFiles.forEach(file => {
  console.log(`Fixing ${file}...`);
  if (fixFile(file)) {
    fixedCount++;
    console.log(`  ✅ Fixed`);
  } else {
    console.log(`  ⏭️  No changes needed`);
  }
});

console.log(`\n📊 Fixed ${fixedCount} files`);

// Final error count
try {
  execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
  console.log('🎉 All TypeScript errors fixed!');
} catch (error) {
  const finalErrors = error.stdout.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`📊 Remaining errors: ${finalErrors}`);
  
  if (finalErrors < 100) {
    console.log('\nRemaining errors:');
    const errorLines = error.stdout.split('\n').filter(line => line.includes('error TS')).slice(0, 10);
    errorLines.forEach(line => console.log(`  ${line}`));
  }
}

console.log('\n✨ Final cleanup complete!');