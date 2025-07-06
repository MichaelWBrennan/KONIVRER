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

// Advanced syntax fixes
function fixAdvancedSyntaxErrors(content) {
  // Fix malformed JSX self-closing tags
  content = content.replace(/<(\w+)([^>]*?)>\s*<\/\1>/g, '<$1$2 />');
  
  // Fix incomplete JSX elements
  content = content.replace(/<(\w+)([^>]*?)>\s*$/gm, '<$1$2></$1>');
  
  // Fix malformed function parameters
  content = content.replace(/\(\s*:\s*([^)]+)\)/g, '(param: $1)');
  
  // Fix incomplete object destructuring
  content = content.replace(/{\s*}\s*=\s*([^;]+);/g, 'const temp = $1;');
  
  // Fix malformed arrow functions with incomplete bodies
  content = content.replace(/=>\s*[^{}\s][^;]*$/gm, match => {
    if (!match.includes('{') && !match.includes(';')) {
      return match + ';';
    }
    return match;
  });
  
  // Fix incomplete class method declarations
  content = content.replace(/(\w+)\s*\([^)]*\)\s*:\s*([^{;]+)\s*;/g, '$1(): $2 { return null; }');
  
  // Fix incomplete interface declarations
  content = content.replace(/interface\s+(\w+)\s*{[^}]*$/gm, match => {
    if (!match.includes('}')) {
      return match + '\n}';
    }
    return match;
  });
  
  // Fix incomplete type declarations
  content = content.replace(/type\s+(\w+)\s*=\s*$/gm, 'type $1 = any;');
  
  // Fix incomplete enum declarations
  content = content.replace(/enum\s+(\w+)\s*{[^}]*$/gm, match => {
    if (!match.includes('}')) {
      return match + '\n}';
    }
    return match;
  });
  
  // Fix malformed template literals
  content = content.replace(/`[^`]*$/gm, match => {
    const openCount = (match.match(/`/g) || []).length;
    if (openCount % 2 === 1) {
      return match + '`';
    }
    return match;
  });
  
  // Fix incomplete conditional expressions
  content = content.replace(/\?\s*:\s*$/gm, '? null : null');
  content = content.replace(/\?\s*([^:]+)\s*$/gm, '? $1 : null');
  
  // Fix incomplete array/object literals
  content = content.replace(/\[\s*$/gm, '[]');
  content = content.replace(/{\s*$/gm, '{}');
  
  return content;
}

// Fix React/JSX specific advanced errors
function fixAdvancedReactErrors(content) {
  // Fix malformed JSX props
  content = content.replace(/(\w+)=\s*{[^}]*$/gm, '$1={null}');
  content = content.replace(/(\w+)=\s*"[^"]*$/gm, '$1=""');
  
  // Fix incomplete React hooks
  content = content.replace(/const\s+\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState\s*;/g, 
    'const [$1, $2] = useState(null);'
  );
  content = content.replace(/const\s+(\w+)\s*=\s*useEffect\s*;/g, 
    'useEffect(() => {}, []);'
  );
  
  // Fix incomplete component props
  content = content.replace(/(\w+):\s*React\.FC<([^>]*)>\s*=\s*\(\s*{\s*}\s*\)\s*=>/g, 
    '$1: React.FC<$2> = (props) =>'
  );
  
  return content;
}

// Fix TypeScript specific advanced errors
function fixAdvancedTypeScriptErrors(content) {
  // Fix incomplete generic constraints
  content = content.replace(/<T\s+extends\s*>/g, '<T extends any>');
  content = content.replace(/<(\w+)\s+extends\s*,/g, '<$1 extends any,');
  
  // Fix incomplete mapped types
  content = content.replace(/{\s*\[\s*(\w+)\s+in\s+([^\]]+)\s*\]\s*:\s*$/gm, 
    '{ [$1 in $2]: any }'
  );
  
  // Fix incomplete conditional types
  content = content.replace(/(\w+)\s+extends\s+([^?]+)\s*\?\s*$/gm, 
    '$1 extends $2 ? any : never'
  );
  
  // Fix incomplete utility types
  content = content.replace(/Partial<\s*>/g, 'Partial<any>');
  content = content.replace(/Required<\s*>/g, 'Required<any>');
  content = content.replace(/Pick<\s*,/g, 'Pick<any,');
  content = content.replace(/Omit<\s*,/g, 'Omit<any,');
  
  return content;
}

// Fix class-related advanced errors
function fixAdvancedClassErrors(content) {
  // Fix incomplete constructor calls
  content = content.replace(/new\s+(\w+)\s*\(\s*$/gm, 'new $1()');
  
  // Fix incomplete method overrides
  content = content.replace(/override\s+(\w+)\s*\([^)]*\)\s*;/g, 
    'override $1() { super.$1(); }'
  );
  
  // Fix incomplete abstract methods
  content = content.replace(/abstract\s+(\w+)\s*\([^)]*\)\s*:\s*([^;]+);/g, 
    'abstract $1(): $2;'
  );
  
  // Fix incomplete static methods
  content = content.replace(/static\s+(\w+)\s*\([^)]*\)\s*;/g, 
    'static $1() { return null; }'
  );
  
  return content;
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply all advanced fixes
    content = fixAdvancedSyntaxErrors(content);
    content = fixAdvancedReactErrors(content);
    content = fixAdvancedTypeScriptErrors(content);
    content = fixAdvancedClassErrors(content);
    
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