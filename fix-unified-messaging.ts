#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';

function fixUnifiedMessaging() {
  const filePath = 'src/components/unified/UnifiedMessaging.tsx';
  const content = readFileSync(filePath, 'utf-8');
  
  // The file has severe JSX structure issues. Let me fix the return statement section
  const lines = content.split('\n');
  const fixedLines: string[] = [];
  
  let inReturn = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('return (')) {
      inReturn = true;
      fixedLines.push(line);
      continue;
    }
    
    if (inReturn) {
      // Fix the main container div
      if (line.includes('<div className={`unified-messaging') && line.includes('></div>')) {
        fixedLines.push(line.replace('></div>', '>'));
        continue;
      }
      
      // Fix button structure
      if (line.includes('<button') && line.includes('></button>')) {
        fixedLines.push(line.replace('></button>', '>'));
        continue;
      }
      
      // Fix self-closing divs that should contain content
      if (line.includes('<div') && line.includes('></div>')) {
        fixedLines.push(line.replace('></div>', '>'));
        continue;
      }
      
      // Fix AnimatePresence
      if (line.includes('<AnimatePresence />')) {
        fixedLines.push('      <AnimatePresence>');
        continue;
      }
      
      // Fix motion.div
      if (line.includes('className="messaging-panel"') && line.includes('/>')) {
        fixedLines.push(line.replace('/>', '>'));
        continue;
      }
      
      // Skip orphaned closing tags that don't match
      if (line.trim() === '</button>' && !lines[i-1].includes('<button')) {
        continue;
      }
      
      // Add missing closing tags where needed
      if (line.includes('<span className="unread-badge">') && !line.includes('</span>')) {
        fixedLines.push(line.replace('{unreadCount}', '{unreadCount}</span>'));
        continue;
      }
    }
    
    fixedLines.push(line);
  }
  
  let fixedContent = fixedLines.join('\n');
  
  // Additional fixes for specific patterns
  fixedContent = fixedContent.replace(
    /(<div className="messaging-panel">)\s*\n\s*(<div className="messaging-header">)/,
    '$1\n            $2'
  );
  
  // Ensure proper closing of main container
  if (!fixedContent.includes('    </div>\n  );')) {
    fixedContent = fixedContent.replace(/\s*\);$/, '\n    </div>\n  );');
  }
  
  writeFileSync(filePath, fixedContent, 'utf-8');
  console.log('Fixed UnifiedMessaging.tsx JSX structure');
}

fixUnifiedMessaging();