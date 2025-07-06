#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Final TypeScript cleanup...\n');

// Get current errors
let errorOutput;
try {
  errorOutput = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
} catch (error) {
  errorOutput = error.stdout;
}

const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
const errorsByFile = {};

// Group errors by file
errorLines.forEach(line => {
  const match = line.match(/^([^(]+)\(/);
  if (match) {
    const file = match[1];
    if (!errorsByFile[file]) errorsByFile[file] = [];
    errorsByFile[file].push(line);
  }
});

console.log(`Found errors in ${Object.keys(errorsByFile).length} files`);

// Fix files with syntax errors
Object.keys(errorsByFile).forEach(filePath => {
  const errors = errorsByFile[filePath];
  const hasSyntaxErrors = errors.some(err => 
    err.includes('Declaration or statement expected') ||
    err.includes("'}' expected") ||
    err.includes('Unexpected keyword or identifier')
  );
  
  if (hasSyntaxErrors) {
    console.log(`Fixing syntax errors in ${filePath}`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix common patterns
      // Remove duplicate closing braces
      content = content.replace(/\s*};\s*\n\s*};\s*\n\s*}/g, '\n    };\n  }\n}');
      
      // Fix missing closing braces for return statements
      content = content.replace(/(\s+data: input,)\s*\n\s*}\s*\n\s*\/\/ Default export/g, '$1\n    };\n  }\n}\n\n// Default export');
      
      // Ensure proper class structure
      const lines = content.split('\n');
      const fixedLines = [];
      let inClass = false;
      let braceCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('export class ') && line.includes('{')) {
          inClass = true;
          braceCount = 1;
          fixedLines.push(line);
        } else if (inClass) {
          braceCount += (line.match(/\{/g) || []).length;
          braceCount -= (line.match(/\}/g) || []).length;
          fixedLines.push(line);
          
          if (braceCount === 0) {
            inClass = false;
          }
        } else {
          fixedLines.push(line);
        }
      }
      
      fs.writeFileSync(filePath, fixedLines.join('\n'));
      
    } catch (error) {
      console.log(`Error fixing ${filePath}: ${error.message}`);
    }
  }
});

// Check final count
try {
  const finalCheck = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
  const finalErrors = finalCheck.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`\n📊 Final error count: ${finalErrors}`);
} catch (error) {
  console.log('\n📊 Checking final error count...');
}