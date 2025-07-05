#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixTypeScriptSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix prop destructuring with default values and type annotations
  content = content.replace(
    /(\w+)\s*=\s*([^:]+):\s*any;/g,
    '$1 = $2,'
  );
  
  // Fix interface prop syntax
  content = content.replace(
    /(\w+):\s*prop(\w+):\s*any;/g,
    '$1: $2;'
  );
  
  // Fix standalone type annotations
  content = content.replace(
    /:\s*any;\s*$/gm,
    ''
  );
  
  // Fix function parameter syntax
  content = content.replace(
    /(\w+)\(([^)]*)\)\s*{/g,
    (match, funcName, params) => {
      // Add proper TypeScript parameter typing
      const fixedParams = params.replace(/(\w+)\s*=\s*([^,)]+)/g, '$1: any = $2');
      return `${funcName}(${fixedParams}): any {`;
    }
  );
  
  // Fix class method syntax
  content = content.replace(
    /(\s+)(\w+)\s*\([^)]*\)\s*{/g,
    (match, indent, methodName, params) => {
      if (methodName === 'constructor' || methodName === 'render') {
        return match; // Don't modify constructors or render methods
      }
      return `${indent}${methodName}(): any {`;
    }
  );
  
  // Fix async method syntax
  content = content.replace(
    /(\s+)async\s+(\w+)\s*\([^)]*\)\s*{/g,
    '$1async $2(): Promise<any> {'
  );
  
  // Fix React component prop interfaces
  content = content.replace(
    /interface\s+(\w+)\s*{\s*([^}]*)\s*}/g,
    (match, interfaceName, props) => {
      const fixedProps = props
        .split('\n')
        .map(line => {
          return line.replace(/(\w+)\s*=\s*([^:,]+):\s*any[;,]?/g, '$1?: any;');
        })
        .join('\n');
      return `interface ${interfaceName} {\n${fixedProps}\n}`;
    }
  );
  
  fs.writeFileSync(filePath, content);
}

function findTypeScriptFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
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

console.log(`Fixing TypeScript syntax in ${tsFiles.length} files...`);

for (const file of tsFiles) {
  try {
    fixTypeScriptSyntax(file);
    console.log(`Fixed: ${path.relative(srcDir, file)}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
}

console.log('TypeScript syntax fixes completed.');