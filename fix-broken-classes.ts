#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing broken class structures...\n');

// Get all TypeScript files
const getAllTsFiles = (dir: any) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const files = getAllTsFiles(path.join(__dirname, 'src'));
let fixedFiles = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix pattern: export class Name { } followed by methods outside
    const brokenClassPattern = /(export class \w+ \{\s*\n\s*\}\s*\n\s*)(public|private|protected)/;
    if (brokenClassPattern.test(content)) {
      // Find the class and move methods inside
      const lines = content.split('\n');
      const newLines = [];
      let inBrokenClass = false;
      let classIndent = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/export class \w+ \{/)) {
          newLines.push(line);
          inBrokenClass = true;
          classIndent = line.match(/^(\s*)/)[1];
          
          // Skip the empty class body and closing brace
          while (i + 1 < lines.length && lines[i + 1].trim() === '') i++;
          if (i + 1 < lines.length && lines[i + 1].trim() === '}') i++;
          
        } else if (inBrokenClass && (line.match(/^\s*(public|private|protected)/) || line.match(/^\s*\w+\s*\(/))) {
          // This is a method that should be inside the class
          newLines.push('  ' + line);
          
        } else if (inBrokenClass && line.match(/^export default/)) {
          // End of class methods, close the class
          newLines.push(classIndent + '}');
          newLines.push('');
          newLines.push(line);
          inBrokenClass = false;
          
        } else if (!inBrokenClass || !line.match(/^\s*\}/)) {
          newLines.push(line);
        }
      }
      
      content = newLines.join('\n');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${path.relative(__dirname, filePath)}`);
      fixedFiles++;
    }

  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log(`\n✨ Broken class fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);