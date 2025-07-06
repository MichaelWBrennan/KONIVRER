#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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

function fixJSXStructure(content: string): string {
  // Container elements that should not be self-closing
  const containerElements = ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'form', 'fieldset', 'legend', 'label', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th'];
  
  // Fix incorrectly self-closed container elements
  for (const element of containerElements) {
    const pattern = new RegExp(`<${element}([^>]*?)\\s*/>`, 'g');
    content = content.replace(pattern, `<${element}$1></${element}>`);
  }
  
  // Fix JSX structure where elements are not properly nested
  // This is a more complex fix that requires understanding the intended structure
  
  // Fix cases where there are multiple root elements without a wrapper
  content = content.replace(/return\s*\(\s*(<[^>]+>\s*<\/[^>]+>\s*)+(<[^>]+>[\s\S]*?<\/[^>]+>)\s*\)/g, (match, ...groups) => {
    // If we have multiple JSX elements at the root level, wrap them in a fragment or div
    const elements = match.match(/<[^>]+>[\s\S]*?<\/[^>]+>/g);
    if (elements && elements.length > 1) {
      return `return (\n    <>\n      ${elements.join('\n      ')}\n    </>\n  )`;
    }
    return match;
  });
  
  return content;
}

function fixFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    content = fixJSXStructure(content);
    
    if (content !== originalContent) {
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
  const files = getAllTsxFiles(srcDir).filter(f => f.endsWith('.tsx'));
  
  console.log(`Found ${files.length} TSX files to process...\n`);
  
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