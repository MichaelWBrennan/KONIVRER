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

    // Fix broken class structures where constructor/methods are outside the class
    const classMatches = content.match(/export class (\w+) \{\s*\n\s*\}\s*\n\s*(public|private|protected|\w+)/g);
    if (classMatches) {
      // This indicates a broken class structure
      const lines = content.split('\n');
      let inClass = false;
      let classStartLine = -1;
      let classEndLine = -1;
      let braceCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('export class ') && line.includes('{')) {
          inClass = true;
          classStartLine = i;
          braceCount = 1;
        } else if (inClass) {
          braceCount += (line.match(/\{/g) || []).length;
          braceCount -= (line.match(/\}/g) || []).length;
          
          if (braceCount === 0) {
            classEndLine = i;
            break;
          }
        }
      }
      
      // If we found a class that ends too early, extend it to include following methods
      if (classStartLine !== -1 && classEndLine !== -1) {
        let nextMethodLine = -1;
        for (let i = classEndLine + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('public ') || line.startsWith('private ') || line.startsWith('protected ') || 
              line.includes('(') && line.includes(')') && line.includes('{')) {
            nextMethodLine = i;
            break;
          }
          if (line.startsWith('export ') || line.startsWith('//') || line === '') {
            break;
          }
        }
        
        if (nextMethodLine !== -1) {
          // Find the end of the methods
          let methodEndLine = lines.length - 1;
          for (let i = nextMethodLine; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('export ') && !line.includes('export default')) {
              methodEndLine = i - 1;
              break;
            }
          }
          
          // Move the methods inside the class
          const methodLines = lines.slice(nextMethodLine, methodEndLine + 1);
          const newLines = [
            ...lines.slice(0, classEndLine),
            ...methodLines.map(line => '  ' + line), // Indent the methods
            '}',
            ...lines.slice(methodEndLine + 1)
          ];
          
          // Remove the original method lines
          const finalLines = newLines.filter((line, index) => {
            const originalIndex = index - (classEndLine - nextMethodLine);
            return originalIndex < nextMethodLine || originalIndex > methodEndLine;
          });
          
          content = finalLines.join('\n');
          modified = true;
        }
      }
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

console.log(`\n✨ Class structure fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);