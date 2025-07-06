#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all TypeScript and JavaScript files
function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
      results = results.concat(getAllFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Fix common syntax errors
function fixSyntaxErrors(content) {
  // Fix trailing commas in object literals and arrays
  content = content.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix trailing commas in function calls
  content = content.replace(/,(\s*\))/g, '$1');
  
  // Fix trailing semicolons in object literals
  content = content.replace(/;(\s*[}])/g, '$1');
  
  // Fix double commas
  content = content.replace(/,,+/g, ',');
  
  // Fix trailing commas before semicolons
  content = content.replace(/,(\s*;)/g, '$1');
  
  // Fix malformed arrow functions
  content = content.replace(/=>\s*;/g, '=> {}');
  
  // Fix incomplete ternary operators
  content = content.replace(/\?\s*;/g, '? null : null;');
  
  // Fix incomplete object destructuring
  content = content.replace(/{\s*}\s*=/g, '{}');
  
  // Fix malformed template literals
  content = content.replace(/`[^`]*$/gm, match => match + '`');
  
  // Fix incomplete function declarations
  content = content.replace(/function\s+\w+\s*\(\s*\)\s*;/g, match => 
    match.replace(';', ' {}')
  );
  
  // Fix incomplete class methods
  content = content.replace(/(\w+)\s*\(\s*\)\s*;/g, '$1() {}');
  
  // Fix malformed JSX
  content = content.replace(/<(\w+)([^>]*?)\/>/g, (match, tag, attrs) => {
    if (attrs.includes('=;') || attrs.includes('={;')) {
      attrs = attrs.replace(/=\s*[;{]*\s*/g, '=""');
    }
    return `<${tag}${attrs} />`;
  });
  
  // Fix incomplete variable declarations
  content = content.replace(/const\s+\w+\s*=\s*;/g, match => 
    match.replace('=;', '= null;')
  );
  content = content.replace(/let\s+\w+\s*=\s*;/g, match => 
    match.replace('=;', '= null;')
  );
  content = content.replace(/var\s+\w+\s*=\s*;/g, match => 
    match.replace('=;', '= null;')
  );
  
  return content;
}

// Fix TypeScript specific errors
function fixTypeScriptErrors(content) {
  // Fix incomplete type annotations
  content = content.replace(/:\s*;/g, ': any;');
  content = content.replace(/:\s*,/g, ': any,');
  content = content.replace(/:\s*}/g, ': any }');
  
  // Fix incomplete interface properties
  content = content.replace(/(\w+):\s*;/g, '$1: any;');
  
  // Fix incomplete generic types
  content = content.replace(/<\s*>/g, '<any>');
  content = content.replace(/<\s*,/g, '<any,');
  content = content.replace(/,\s*>/g, ', any>');
  
  // Fix incomplete function return types
  content = content.replace(/\):\s*{/g, '): void {');
  
  // Fix incomplete async function declarations
  content = content.replace(/async\s+(\w+)\s*\(\s*\)\s*;/g, 'async $1() {}');
  
  return content;
}

// Fix React/JSX specific errors
function fixReactErrors(content) {
  // Fix incomplete JSX elements
  content = content.replace(/<(\w+)([^>]*?)>\s*$/gm, '<$1$2></$1>');
  
  // Fix malformed JSX props
  content = content.replace(/(\w+)=\s*;/g, '$1=""');
  content = content.replace(/(\w+)=\s*{;/g, '$1={null}');
  
  // Fix incomplete React component declarations
  content = content.replace(/const\s+(\w+):\s*React\.FC\s*=\s*;/g, 
    'const $1: React.FC = () => <div></div>;'
  );
  
  return content;
}

// Fix class-related errors
function fixClassErrors(content) {
  // Fix incomplete class declarations
  content = content.replace(/class\s+(\w+)\s*{[^}]*$/gm, match => {
    if (!match.includes('}')) {
      return match + '\n}';
    }
    return match;
  });
  
  // Fix incomplete method declarations
  content = content.replace(/(\w+)\s*\([^)]*\)\s*;/g, '$1() {}');
  
  // Fix constructor issues
  content = content.replace(/constructor\s*\([^)]*\)\s*;/g, 'constructor() {}');
  
  return content;
}

// Fix import/export errors
function fixImportExportErrors(content) {
  // Fix incomplete imports
  content = content.replace(/import\s*;/g, '');
  content = content.replace(/import\s+{\s*}\s+from/g, 'import {} from');
  content = content.replace(/import\s+\*\s+from/g, 'import * as temp from');
  
  // Fix incomplete exports
  content = content.replace(/export\s*;/g, '');
  content = content.replace(/export\s+{\s*};/g, '');
  
  return content;
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply all fixes
    content = fixSyntaxErrors(content);
    content = fixTypeScriptErrors(content);
    content = fixReactErrors(content);
    content = fixClassErrors(content);
    content = fixImportExportErrors(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  const srcDir = path.join(__dirname, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('src directory not found');
    process.exit(1);
  }
  
  const files = getAllFiles(srcDir);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\nFixed ${fixedCount} files out of ${files.length} total files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, getAllFiles };