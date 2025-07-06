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
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixJSXStructure(content: string): string {
  // Fix Provider components that are self-closing but should contain children
  content = content.replace(
    /(<[^>]*Provider[^>]*)\s*\/>\s*\n\s*(\{[^}]*\}|\{children\}|[^<]*)\s*\n\s*(<\/[^>]*Provider>)/g,
    '$1>\n      $2\n    $3'
  );
  
  // Fix orphaned closing tags
  content = content.replace(/^\s*<\/[^>]+>\s*$/gm, '');
  
  // Fix JSX fragments with improper structure
  content = content.replace(
    /return\s*\(\s*<>\s*\n((?:\s*<[^>]+><\/[^>]+>\s*\n)+)/g,
    (match, elements) => {
      const lines = elements.trim().split('\n');
      const properlyIndented = lines.map(line => '      ' + line.trim()).join('\n');
      return `return (\n    <div>\n${properlyIndented}\n    </div>\n  `;
    }
  );
  
  // Fix button elements that are missing closing tags
  content = content.replace(
    /(<button[^>]*>(?:[^<]|<(?!\/button>))*?)(\s*<button)/g,
    '$1</button>\n$2'
  );
  
  // Fix div elements that should contain content but are self-closing
  content = content.replace(
    /(<div[^>]*><\/div>)\s*\n\s*([^<\s][^<]*)/g,
    (match, div, content) => {
      return div.replace('></div>', `>\n        ${content.trim()}\n      </div>`);
    }
  );
  
  // Fix nav elements that should contain their button children
  content = content.replace(
    /(<nav[^>]*><\/nav>)\s*\n\s*(<button[^>]*>[\s\S]*?<\/button>)/g,
    (match, nav, button) => {
      return nav.replace('></nav>', `>\n        ${button}\n      </nav>`);
    }
  );
  
  // Fix h1-h6 elements that have orphaned closing tags
  content = content.replace(
    /(<h[1-6][^>]*><\/h[1-6]>)\s*\n\s*([^<\s][^<]*)\s*\n\s*(<\/h[1-6]>)/g,
    (match, openTag, content, closeTag) => {
      return openTag.replace('></h', `>\n        ${content.trim()}\n      </h`);
    }
  );
  
  // Fix cases where there are multiple root elements in return statement
  content = content.replace(
    /return\s*\(\s*\n((?:\s*<[^>]+>[\s\S]*?<\/[^>]+>\s*\n){2,})\s*\)/g,
    (match, elements) => {
      return `return (\n    <>\n${elements}    </>\n  )`;
    }
  );
  
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
  const files = getAllTsxFiles(srcDir);
  
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