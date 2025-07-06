#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

function fixJSXFile(content: string): string {
  // Fix common JSX structure issues
  
  // 1. Fix missing closing tags for common elements
  const elementPairs = [
    ['h1', 'h1'], ['h2', 'h2'], ['h3', 'h3'], ['h4', 'h4'], ['h5', 'h5'], ['h6', 'h6'],
    ['p', 'p'], ['div', 'div'], ['span', 'span'], ['button', 'button'],
    ['nav', 'nav'], ['section', 'section'], ['article', 'article'], ['main', 'main'],
    ['header', 'header'], ['footer', 'footer'], ['aside', 'aside']
  ];
  
  for (const [open, close] of elementPairs) {
    // Fix pattern where opening tag exists but closing tag is missing or orphaned
    const openTagRegex = new RegExp(`(<${open}[^>]*>)([^<]*?)\\s*(?=\\n\\s*<(?!/${close}>)|$)`, 'g');
    content = content.replace(openTagRegex, (match, openTag, content) => {
      if (content.trim()) {
        return `${openTag}${content}</${close}>`;
      }
      return match;
    });
  }
  
  // 2. Fix JSX fragments and multiple root elements
  content = content.replace(
    /return\s*\(\s*\n((?:\s*<[^>]+>[\s\S]*?<\/[^>]+>\s*\n){2,})\s*\)/g,
    (match, elements) => {
      return `return (\n    <>\n${elements}    </>\n  )`;
    }
  );
  
  // 3. Fix Provider components that should contain children
  content = content.replace(
    /(<[^>]*Provider[^>]*)\s*\/>\s*\n\s*(\{[^}]*children[^}]*\})\s*\n\s*(<\/[^>]*Provider>)/g,
    '$1>\n      $2\n    $3'
  );
  
  // 4. Remove orphaned closing tags
  content = content.replace(/^\s*<\/[^>]+>\s*$/gm, '');
  
  // 5. Fix incomplete JSX expressions
  content = content.replace(/\{\s*$/, '');
  content = content.replace(/^\s*\}\s*$/gm, '');
  
  return content;
}

// Get list of files with TypeScript errors
function getFilesWithErrors(): string[] {
  try {
    const output = execSync('npm run type-check 2>&1', { encoding: 'utf-8' });
    const lines = output.split('\n');
    const files = new Set<string>();
    
    for (const line of lines) {
      const match = line.match(/^(src\/[^(]+\.tsx?)\(/);
      if (match) {
        files.add(match[1]);
      }
    }
    
    return Array.from(files);
  } catch (error) {
    console.log('Could not get error list, processing all TSX files...');
    return [];
  }
}

function main() {
  const errorFiles = getFilesWithErrors();
  const filesToProcess = errorFiles.length > 0 ? errorFiles.filter(f => f.endsWith('.tsx')) : [
    'src/accessibility/AccessibilitySettings.tsx',
    'src/components/AIAssistant.tsx',
    'src/components/AdvancedSearch.tsx',
    'src/pages/MobileCardExplorer.tsx',
    'src/pages/MobileDeckSearch.tsx'
  ];
  
  console.log(`Processing ${filesToProcess.length} files with errors...\n`);
  
  let fixedFiles = 0;
  
  for (const file of filesToProcess) {
    console.log(`Processing: ${file}`);
    
    try {
      const content = readFileSync(file, 'utf-8');
      const fixedContent = fixJSXFile(content);
      
      if (content !== fixedContent) {
        writeFileSync(file, fixedContent, 'utf-8');
        fixedFiles++;
        console.log(`  ✅ Fixed\n`);
      } else {
        console.log(`  ⏭️  No changes needed\n`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error}\n`);
    }
  }
  
  console.log(`🎉 Processing complete!`);
  console.log(`📊 Fixed ${fixedFiles} out of ${filesToProcess.length} files`);
}

// Run the main function
main();