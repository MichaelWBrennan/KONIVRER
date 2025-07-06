#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing final TypeScript errors...\n');

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

    // Remove motion import if motion is not used in the file
    if (content.includes("import { motion } from 'framer-motion';") && !content.includes('motion.')) {
      content = content.replace(/import { motion } from 'framer-motion';\s*\n/, '');
      modified = true;
    }

    // Remove unused lucide-react imports
    const lucideImportMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];/);
    if (lucideImportMatch) {
      const imports = lucideImportMatch[1].split(',').map(s => s.trim());
      const usedImports = imports.filter(imp => {
        const regex = new RegExp(`<${imp}\\b|${imp}\\s*[,}]`, 'g');
        return regex.test(content.replace(lucideImportMatch[0], ''));
      });
      
      if (usedImports.length === 0) {
        content = content.replace(lucideImportMatch[0], '');
        modified = true;
      } else if (usedImports.length !== imports.length) {
        const newImport = `import { ${usedImports.join(', ')} } from 'lucide-react';`;
        content = content.replace(lucideImportMatch[0], newImport);
        modified = true;
      }
    }

    // Fix unused _config parameters by removing them entirely
    if (content.includes('_config') && content.includes('is declared but its value is never read')) {
      content = content.replace(/constructor\(_config:[^)]+\)/g, 'constructor()');
      content = content.replace(/this\._config = _config;/g, '');
      content = content.replace(/private _config:[^;]+;/g, '');
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

console.log(`\n✨ Final error fixing complete!`);
console.log(`✅ Fixed: ${fixedFiles} files`);

// Check final error count
try {
  const finalTypeCheck = execSync('npm run type-check 2>&1', { encoding: 'utf8', cwd: __dirname });
  const finalErrors = finalTypeCheck.split('\n').filter(line => line.includes('error TS')).length;
  console.log(`📊 Remaining errors: ${finalErrors}`);
} catch (error) {
  console.log('📊 Checking final error count...');
}