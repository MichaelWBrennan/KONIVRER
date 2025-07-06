#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface FixPattern {
  pattern: RegExp;
  replacement: string;
  description: string;
}

const fixPatterns: FixPattern[] = [
  // Fix JSX self-closing tags with incorrect syntax
  {
    pattern: /\s+\/\s+\/>/g,
    replacement: ' />',
    description: 'Fix malformed self-closing JSX tags'
  },
  
  // Fix JSX elements that should be self-closing
  {
    pattern: /<(\w+)([^>]*?)><\/\1>/g,
    replacement: '<$1$2 />',
    description: 'Convert empty JSX elements to self-closing'
  },
  
  // Fix addEventListener syntax with colon instead of comma
  {
    pattern: /addEventListener\('([^']+)'\s*:\s*any,/g,
    replacement: "addEventListener('$1',",
    description: 'Fix addEventListener syntax'
  },
  
  // Fix switch statement syntax with type annotation
  {
    pattern: /switch\s*\(([^)]+)\)\s*:\s*any\s*{/g,
    replacement: 'switch ($1) {',
    description: 'Fix switch statement syntax'
  },
  
  // Fix for loop syntax with type annotation
  {
    pattern: /for\s*\(([^)]+)\)\s*:\s*any\s*{/g,
    replacement: 'for ($1) {',
    description: 'Fix for loop syntax'
  },
  
  // Fix while loop syntax with type annotation
  {
    pattern: /while\s*\(([^)]*)\)\s*:\s*any\s*{/g,
    replacement: 'while ($1) {',
    description: 'Fix while loop syntax'
  },
  
  // Fix malformed JSX opening tags that are missing closing >
  {
    pattern: /<(\w+)([^>]*?)><\/div>/g,
    replacement: '<$1$2></$1>',
    description: 'Fix mismatched JSX closing tags'
  }
];

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        traverse(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let hasChanges = false;
    
    for (const { pattern, replacement, description } of fixPatterns) {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      
      if (content !== originalContent) {
        hasChanges = true;
        console.log(`  ✓ Applied: ${description}`);
      }
    }
    
    if (hasChanges) {
      writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

function main() {
  const srcDir = join(process.cwd(), 'src');
  const files = getAllTsxFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript/TSX files to process...\n`);
  
  let fixedFiles = 0;
  
  for (const file of files) {
    const relativePath = file.replace(process.cwd() + '/', '');
    console.log(`Processing: ${relativePath}`);
    
    if (fixFile(file)) {
      fixedFiles++;
      console.log(`  ✅ Fixed\n`);
    } else {
      console.log(`  ⏭️  No changes needed\n`);
    }
  }
  
  console.log(`\n🎉 Processing complete!`);
  console.log(`📊 Fixed ${fixedFiles} out of ${files.length} files`);
}

// Run the main function
main();