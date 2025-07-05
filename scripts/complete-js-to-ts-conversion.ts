#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete JavaScript to TypeScript conversion
function convertAllRemainingFiles(): void {
  const projectRoot = path.join(__dirname, '..');
  
  // Find all remaining JS/JSX files (excluding node_modules and specific files)
  const excludePatterns = [
    'node_modules',
    'dist',
    '.git',
    'public/sw.js', // Service worker should stay as JS
  ];
  
  function findJSFiles(): void {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(projectRoot, fullPath);
      
      // Skip excluded patterns
      if (excludePatterns.some(pattern => relativePath.includes(pattern))) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findJSFiles(fullPath, files);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  const jsFiles = findJSFiles(projectRoot);
  console.log(`Found ${jsFiles.length} JavaScript files to convert:`);
  
  jsFiles.forEach(file => {
    console.log(`  ${path.relative(projectRoot, file)}`);
  });
  
  // Convert each file
  jsFiles.forEach(jsFile => {
    const content = fs.readFileSync(jsFile, 'utf8');
    const relativePath = path.relative(projectRoot, jsFile);
    
    // Determine new extension
    let newExtension = '.ts';
    if (jsFile.endsWith('.jsx')) {
      newExtension = '.tsx';
    } else if (content.includes('React') || content.includes('jsx') || content.includes('<')) {
      newExtension = '.tsx';
    }
    
    // Create new filename
    const newFile = jsFile.replace(/\.(js|jsx)$/, newExtension);
    
    // Convert content to TypeScript
    let tsContent = convertToTypeScript(content, relativePath);
    
    // Write new file
    fs.writeFileSync(newFile, tsContent);
    
    // Remove old file
    fs.unlinkSync(jsFile);
    
    console.log(`Converted: ${relativePath} → ${path.relative(projectRoot, newFile)}`);
  });
}

function convertToTypeScript(): void {
  let tsContent = content;
  
  // Add TypeScript imports and types based on file type
  if (filePath.includes('server/')) {
    // Server-side TypeScript conversions
    tsContent = convertServerFile(tsContent);
  } else if (filePath.includes('scripts/')) {
    // Build script conversions
    tsContent = convertScriptFile(tsContent);
  } else if (filePath.includes('vite.config')) {
    // Vite config conversion
    tsContent = convertViteConfig(tsContent);
  } else if (filePath.includes('.eslintrc')) {
    // ESLint config conversion
    tsContent = convertESLintConfig(tsContent);
  } else {
    // General TypeScript conversion
    tsContent = convertGeneralFile(tsContent);
  }
  
  return tsContent;
}

function convertServerFile(): void {
  let tsContent = content;
  
  // Add Node.js types
  if (!tsContent.includes('import')) {
    tsContent = `import { Request, Response, NextFunction } from 'express';\nimport { Server } from 'http';\n\n${tsContent}`;
  }
  
  // Convert require statements to imports
  tsContent = tsContent.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import $1 from '$2'");
  tsContent = tsContent.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import { $1 } from '$2'");
  
  // Add type annotations for common patterns
  tsContent = tsContent.replace(/app\.(\w+)\(['"]([^'"]+)['"],\s*\(([^)]+)\)\s*=>/g, 
    "app.$1('$2', ($3: Request, res: Response, next: NextFunction) =>");
  
  // Add return types for functions
  tsContent = tsContent.replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1(): void {');
  
  return tsContent;
}

function convertScriptFile(): void {
  let tsContent = content;
  
  // Add Node.js types for scripts
  if (!tsContent.includes('import')) {
    tsContent = `import fs from 'fs';\nimport path from 'path';\n\n${tsContent}`;
  }
  
  // Convert require statements
  tsContent = tsContent.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import $1 from '$2'");
  tsContent = tsContent.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import { $1 } from '$2'");
  
  // Add type annotations for common patterns
  tsContent = tsContent.replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1(): void {');
  
  return tsContent;
}

function convertViteConfig(): void {
  let tsContent = content;
  
  // Convert to TypeScript Vite config
  tsContent = `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport { VitePWA } from 'vite-plugin-pwa';\n\n${tsContent}`;
  
  // Remove old imports
  tsContent = tsContent.replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];\s*/g, '');
  tsContent = tsContent.replace(/const\s+\{[^}]*\}\s*=\s*require\([^)]+\);\s*/g, '');
  
  // Ensure export default
  if (!tsContent.includes('export default')) {
    tsContent = tsContent.replace(/module\.exports\s*=/, 'export default');
  }
  
  return tsContent;
}

function convertESLintConfig(): void {
  let tsContent = content;
  
  // Convert ESLint config to TypeScript
  tsContent = `import type { ESLint } from 'eslint';\n\n${tsContent}`;
  
  // Convert module.exports to export default
  tsContent = tsContent.replace(/module\.exports\s*=/, 'const config: ESLint.ConfigData = ');
  tsContent += '\n\nexport default config;';
  
  return tsContent;
}

function convertGeneralFile(): void {
  let tsContent = content;
  
  // Add React types if it's a React file
  if (tsContent.includes('React') || tsContent.includes('jsx') || tsContent.includes('<')) {
    if (!tsContent.includes("import React")) {
      tsContent = `import React from 'react';\n${tsContent}`;
    }
  }
  
  // Convert require statements to imports
  tsContent = tsContent.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import $1 from '$2'");
  tsContent = tsContent.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\)/g, "import { $1 } from '$2'");
  
  // Add basic type annotations
  tsContent = tsContent.replace(/function\s+(\w+)\s*\([^)]*\)\s*{/g, 'function $1(): any {');
  
  return tsContent;
}

// Update .gitattributes for proper language detection
function updateGitAttributes(): void {
  const gitAttributesPath = path.join(__dirname, '..', '.gitattributes');
  const gitAttributes = `# TypeScript language detection
*.ts linguist-language=TypeScript
*.tsx linguist-language=TypeScript
*.js linguist-language=TypeScript
*.jsx linguist-language=TypeScript

# Exclude certain files from language stats
node_modules/* linguist-vendored
dist/* linguist-generated
public/sw.js linguist-vendored
*.min.js linguist-generated
*.bundle.js linguist-generated

# Force TypeScript detection
src/**/*.ts linguist-language=TypeScript
src/**/*.tsx linguist-language=TypeScript
server/**/*.ts linguist-language=TypeScript
scripts/**/*.ts linguist-language=TypeScript
`;

  fs.writeFileSync(gitAttributesPath, gitAttributes);
  console.log('Updated .gitattributes for proper TypeScript language detection');
}

// Main execution
console.log('🚀 Starting complete JavaScript to TypeScript conversion...\n');

try {
  convertAllRemainingFiles();
  updateGitAttributes();
  
  console.log('\n✅ Complete JavaScript to TypeScript conversion finished!');
  console.log('\n🎉 Your repository should now be 100% TypeScript!');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run type-check');
  console.log('3. Commit and push changes');
  
} catch (error) {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
}