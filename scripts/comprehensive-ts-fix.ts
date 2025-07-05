import React from 'react';
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function comprehensiveTypeScriptFix(): void {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix React component prop interfaces with proper syntax
  content = content.replace(
    /interface\s+(\w+Props)\s*{\s*([^}]*)\s*}/gs,
    (match, interfaceName, propsContent) => {
      // Clean up the props content
      const cleanProps = propsContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove any trailing colons and fix syntax
          line = line.replace(/:\s*any[;,]?\s*$/, ': any;');
          line = line.replace(/[;,]\s*$/, ';');
          if (!line.endsWith(';') && line.includes(':')) {
            line += ';';
          }
          return line;
        })
        .join('\n  ');
      
      return `interface ${interfaceName} {\n  ${cleanProps}\n}`;
    }
  );
  
  // Fix function parameter syntax with proper TypeScript types
  content = content.replace(
    /(\w+)\s*\(\s*([^)]*)\s*\)\s*:\s*any\s*{/g,
    (match, funcName, params) => {
      // Clean up parameters
      const cleanParams = params
        .split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0)
        .map(param => {
          if (!param.includes(':')) {
            return `${param}: any`;
          }
          return param;
        })
        .join(', ');
      
      return `${funcName}(${cleanParams}): any {`;
    }
  );
  
  // Fix class method syntax
  content = content.replace(
    /(\s+)(\w+)\(\)\s*:\s*any\s*{/g,
    '$1$2(): any {'
  );
  
  // Fix async method syntax
  content = content.replace(
    /(\s+)async\s+(\w+)\(\)\s*:\s*Promise<any>\s*{/g,
    '$1async $2(): Promise<any> {'
  );
  
  // Fix JSX syntax issues
  content = content.replace(
    /h2:\s*props\s*=>\s*,/g,
    'h2: (props: any) => null,'
  );
  
  // Fix incomplete JSX elements
  content = content.replace(
    /<(\w+)([^>]*)>\s*$/gm,
    '<$1$2></$1>'
  );
  
  // Fix malformed conditional rendering
  content = content.replace(
    /\)\s*}\s*$/gm,
    ')}'
  );
  
  // Fix standalone type annotations
  content = content.replace(
    /^\s*:\s*any;\s*$/gm,
    ''
  );
  
  // Fix icon type annotations
  content = content.replace(
    /icon:\s*Icon:\s*any;/g,
    'icon: any;'
  );
  
  // Fix return statements in class methods
  content = content.replace(
    /(\s+)return\s+([^;]+);\s*$/gm,
    '$1return $2;'
  );
  
  // Fix erf function syntax
  content = content.replace(
    /erf\(x\)\s*{/g,
    'erf(x: number): number {'
  );
  
  // Fix normalInverseCDF function syntax
  content = content.replace(
    /normalInverseCDF\(p\)\s*{/g,
    'normalInverseCDF(p: number): number {'
  );
  
  // Fix other method parameter syntax
  content = content.replace(
    /(\w+)\(([^)]*)\)\s*{/g,
    (match, methodName, params) => {
      if (methodName === 'constructor' || methodName === 'render' || methodName === 'componentDidMount') {
        return match;
      }
      
      // Add types to parameters
      const typedParams = params
        .split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0)
        .map(param => {
          if (param.includes('=') && !param.includes(':')) {
            // Handle default parameters
            const [name, defaultValue] = param.split('=').map(p => p.trim());
            return `${name}: any = ${defaultValue}`;
          } else if (!param.includes(':') && param.length > 0) {
            return `${param}: any`;
          }
          return param;
        })
        .join(', ');
      
      return `${methodName}(${typedParams}): any {`;
    }
  );
  
  fs.writeFileSync(filePath, content);
}

function findTypeScriptFiles(): void {
  const files = [];
  
  function traverse(): void {
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
  }
  
  traverse(dir);
  return files;
}

// Fix all TypeScript files
const srcDir = path.join(__dirname, '..', 'src');
const tsFiles = findTypeScriptFiles(srcDir);

console.log(`Applying comprehensive TypeScript fixes to ${tsFiles.length} files...`);

for (const file of tsFiles) {
  try {
    comprehensiveTypeScriptFix(file);
    console.log(`Fixed: ${path.relative(srcDir, file)}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
}

console.log('Comprehensive TypeScript fixes completed.');