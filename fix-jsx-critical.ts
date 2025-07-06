#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';

function fixCriticalJSXIssues(content: string): string {
  // Fix orphaned closing tags
  content = content.replace(/^\s*<\/[^>]+>\s*$/gm, '');
  
  // Fix multiple consecutive empty elements that should be nested
  content = content.replace(
    /(<div[^>]*><\/div>)\s*\n\s*(<div[^>]*><\/div>)/g,
    '$1\n      $2'
  );
  
  // Fix JSX fragments that are not properly structured
  content = content.replace(
    /return\s*\(\s*<>\s*((?:<[^>]+><\/[^>]+>\s*)+)/g,
    (match, elements) => {
      // Properly nest the elements
      const lines = elements.trim().split('\n');
      const nestedElements = lines.map(line => '      ' + line.trim()).join('\n');
      return `return (\n    <div>\n${nestedElements}\n    </div>`;
    }
  );
  
  // Fix button elements that are not properly closed
  content = content.replace(
    /(<button[^>]*>[\s\S]*?)(<button[^>]*>)/g,
    '$1</button>\n            $2'
  );
  
  // Fix nav elements that should contain their children
  content = content.replace(
    /(<nav[^>]*><\/nav>)\s*\n\s*(<button)/g,
    (match, nav, button) => {
      return nav.replace('></nav>', `>\n            ${button.trim()}`);
    }
  );
  
  return content;
}

function fixFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    content = fixCriticalJSXIssues(content);
    
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

// Fix the most problematic files first
const problematicFiles = [
  'src/accessibility/AccessibilitySettings.tsx',
  'src/accessibility/AccessibilityProvider.tsx'
];

console.log('Fixing critical JSX issues...\n');

for (const file of problematicFiles) {
  console.log(`Processing: ${file}`);
  if (fixFile(file)) {
    console.log(`  ✅ Fixed\n`);
  } else {
    console.log(`  ⏭️  No changes needed\n`);
  }
}

console.log('🎉 Critical fixes complete!');

// Run the main function