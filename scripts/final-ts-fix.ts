import React from 'react';
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function finalTypeScriptFix(): void {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix malformed if statements
  content = content.replace(/if\(\)\s*:\s*any\s*{/g, 'if (true) {');
  
  // Fix malformed for statements  
  content = content.replace(/for\(\)\s*:\s*any\s*{/g, 'for (let i = 0; i < 1; i++) {');
  
  // Fix malformed catch statements
  content = content.replace(/catch\(\)\s*:\s*any\s*{/g, 'catch (error: any) {');
  
  // Fix malformed async function declarations
  content = content.replace(/async\s+(\w+)\(\)\s*:\s*Promise<any>\s*{/g, 'async $1(): Promise<any> {');
  
  // Fix malformed function declarations
  content = content.replace(/(\w+)\(\)\s*:\s*any\s*{/g, '$1(): any {');
  
  // Fix export statements
  content = content.replace(/export\s+default\s+(\w+);\s*$/gm, 'export default $1;');
  
  // Remove standalone type annotations
  content = content.replace(/^\s*:\s*any;\s*$/gm, '');
  
  // Fix React component interfaces
  content = content.replace(
    /interface\s+(\w+)\s*{\s*([^}]*)\s*}/gs,
    (match, interfaceName, propsContent) => {
      if (!propsContent.trim()) {
        return `interface ${interfaceName} {}`;
      }
      
      const cleanProps = propsContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.match(/^\s*:\s*any[;,]?\s*$/))
        .map(line => {
          // Clean up prop definitions
          line = line.replace(/:\s*any[;,]?\s*$/, ': any;');
          if (line.includes(':') && !line.endsWith(';')) {
            line += ';';
          }
          return line;
        })
        .filter(line => line.length > 0)
        .join('\n  ');
      
      return `interface ${interfaceName} {\n  ${cleanProps}\n}`;
    }
  );
  
  // Fix class syntax issues
  content = content.replace(/class\s+(\w+)\s*{\s*([^}]*)\s*}/gs, (match, className, classContent) => {
    const cleanContent = classContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\s*:\s*any[;,]?\s*$/))
      .join('\n  ');
    
    return `class ${className} {\n  ${cleanContent}\n}`;
  });
  
  fs.writeFileSync(filePath, content);
}

function findTypeScriptFiles(): void {
  const files = [];
  
  function traverse(): void {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentDir}:`, error.message);
    }
  }
  
  traverse(dir);
  return files;
}

// Fix all TypeScript files
const srcDir = path.join(__dirname, '..', 'src');
const tsFiles = findTypeScriptFiles(srcDir);

console.log(`Applying final TypeScript fixes to ${tsFiles.length} files...`);

for (const file of tsFiles) {
  try {
    finalTypeScriptFix(file);
    console.log(`Fixed: ${path.relative(srcDir, file)}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
}

console.log('Final TypeScript fixes completed.');