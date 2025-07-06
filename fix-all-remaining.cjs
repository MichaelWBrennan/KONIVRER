#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

function fixAllSyntaxIssues(content) {
  // Fix malformed interfaces with extra braces
  content = content.replace(/interface\s+(\w+)\s*{\s*([^}]*)\s*}\s*}/g, 'interface $1 {\n  $2\n}');
  
  // Fix malformed function declarations
  content = content.replace(/(\w+):\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*{\s*}\s*return/g, '$1: React.FC = () => {\n  return');
  
  // Fix incomplete JSX elements
  content = content.replace(/<(\w+)([^>]*?)>\s*<\/\1>\s*<(\w+)/g, '<$1$2>\n    <$3');
  
  // Fix malformed object destructuring
  content = content.replace(/{\s*}\s*=\s*([^;]+);/g, 'const temp = $1;');
  
  // Fix incomplete useState calls
  content = content.replace(/useState\s*\(\s*\)\s*{\s*}/g, 'useState(null)');
  content = content.replace(/useState\s*{\s*}/g, 'useState(null)');
  
  // Fix incomplete useEffect calls
  content = content.replace(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{\s*}\s*([^}]+)\s*}\s*,\s*\[\s*\]\s*\)\s*;/g, 
    'useEffect(() => {\n    $1\n  }, []);'
  );
  
  // Fix malformed try-catch blocks
  content = content.replace(/try\s*{\s*}\s*([^}]+)\s*}\s*catch\s*\([^)]*\)\s*{\s*}\s*([^}]+)\s*}/g, 
    'try {\n    $1\n  } catch (error) {\n    $2\n  }'
  );
  
  // Fix incomplete arrow functions
  content = content.replace(/=>\s*{\s*}\s*([^}]+)\s*}/g, '=> {\n    $1\n  }');
  
  // Fix malformed conditional expressions
  content = content.replace(/\?\s*{\s*}\s*([^:]+)\s*:\s*{\s*}\s*([^}]+)/g, '? $1 : $2');
  
  // Fix incomplete array/object literals
  content = content.replace(/\[\s*\]\s*([^\]]+)\s*\]/g, '[\n    $1\n  ]');
  content = content.replace(/{\s*}\s*([^}]+)\s*}/g, '{\n    $1\n  }');
  
  // Fix malformed import/export statements
  content = content.replace(/import\s*{\s*}\s*([^}]+)\s*}\s*from/g, 'import {\n  $1\n} from');
  content = content.replace(/export\s*{\s*}\s*([^}]+)\s*}/g, 'export {\n  $1\n}');
  
  // Fix incomplete function parameters
  content = content.replace(/\(\s*:\s*([^)]+)\)/g, '(param: $1)');
  
  // Fix malformed JSX props
  content = content.replace(/(\w+)=\s*{\s*}\s*([^}]+)\s*}/g, '$1={$2}');
  content = content.replace(/(\w+)=\s*"\s*([^"]*)\s*"/g, '$1="$2"');
  
  // Fix incomplete class methods
  content = content.replace(/(\w+)\s*\([^)]*\)\s*:\s*([^{;]+)\s*;/g, '$1(): $2 { return null; }');
  
  // Fix incomplete type declarations
  content = content.replace(/type\s+(\w+)\s*=\s*$/gm, 'type $1 = any;');
  
  // Fix incomplete enum declarations
  content = content.replace(/enum\s+(\w+)\s*{\s*([^}]*)\s*$/gm, 'enum $1 {\n  $2\n}');
  
  // Fix malformed template literals
  content = content.replace(/`([^`]*)\s*$/gm, '`$1`');
  
  // Fix incomplete generic constraints
  content = content.replace(/<T\s+extends\s*>/g, '<T extends any>');
  content = content.replace(/<(\w+)\s+extends\s*,/g, '<$1 extends any,');
  
  // Fix incomplete mapped types
  content = content.replace(/{\s*\[\s*(\w+)\s+in\s+([^\]]+)\s*\]\s*:\s*$/gm, '{ [$1 in $2]: any }');
  
  // Fix incomplete conditional types
  content = content.replace(/(\w+)\s+extends\s+([^?]+)\s*\?\s*$/gm, '$1 extends $2 ? any : never');
  
  // Fix incomplete utility types
  content = content.replace(/Partial<\s*>/g, 'Partial<any>');
  content = content.replace(/Required<\s*>/g, 'Required<any>');
  content = content.replace(/Pick<\s*,/g, 'Pick<any,');
  content = content.replace(/Omit<\s*,/g, 'Omit<any,');
  
  // Fix incomplete constructor calls
  content = content.replace(/new\s+(\w+)\s*\(\s*$/gm, 'new $1()');
  
  // Fix incomplete method overrides
  content = content.replace(/override\s+(\w+)\s*\([^)]*\)\s*;/g, 'override $1() { super.$1(); }');
  
  // Fix incomplete abstract methods
  content = content.replace(/abstract\s+(\w+)\s*\([^)]*\)\s*:\s*([^;]+);/g, 'abstract $1(): $2;');
  
  // Fix incomplete static methods
  content = content.replace(/static\s+(\w+)\s*\([^)]*\)\s*;/g, 'static $1() { return null; }');
  
  return content;
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = fixAllSyntaxIssues(content);
    
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