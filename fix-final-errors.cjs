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

// Fix corrupted function and interface syntax
function fixCorruptedSyntax(content) {
  // Fix corrupted function declarations
  content = content.replace(/(\w+):\s*React\.FC[^=]*=\s*\(\s*[^)]*\)\s*=>\s*{}\s*\n\s*return/g, 
    '$1: React.FC = () => {\n  return'
  );
  
  // Fix corrupted interface declarations
  content = content.replace(/interface\s+(\w+)\s*{}\s*\n\s*\[key:\s*string\]:\s*any\s*\n\s*}\s*\n\s*}/g, 
    'interface $1 {\n  [key: string]: any;\n}'
  );
  
  // Fix corrupted useState calls
  content = content.replace(/useState\s*\(\s*\)\s*{}/g, 'useState(false)');
  content = content.replace(/useState\s*{}/g, 'useState(null)');
  
  // Fix corrupted JSX elements
  content = content.replace(/<(\w+)([^>]*?)>\s*<\/\1>\s*\n\s*<(\w+)/g, '<$1$2>\n    <$3');
  
  // Fix corrupted try-catch blocks
  content = content.replace(/try\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*catch\s*\([^)]*\)\s*{}\s*\n\s*([^}]+)\s*\n\s*}/g, 
    'try {\n    $1\n  } catch (error) {\n    $2\n  }'
  );
  
  // Fix corrupted object literals
  content = content.replace(/{\s*}\s*\n\s*([^}]+)\s*\n\s*}/g, '{\n    $1\n  }');
  
  // Fix corrupted array literals
  content = content.replace(/\[\s*\]\s*\n\s*([^\]]+)\s*\n\s*\]/g, '[\n    $1\n  ]');
  
  // Fix corrupted function calls
  content = content.replace(/(\w+)\s*\(\s*\)\s*{}\s*\n\s*([^}]+)\s*\n\s*}/g, '$1(() => {\n    $2\n  })');
  
  // Fix corrupted conditional expressions
  content = content.replace(/\?\s*{}\s*\n\s*([^:]+)\s*\n\s*:\s*{}\s*\n\s*([^}]+)/g, '? $1 : $2');
  
  // Fix corrupted import statements
  content = content.replace(/import\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*from/g, 'import {\n  $1\n} from');
  
  // Fix corrupted export statements
  content = content.replace(/export\s*{}\s*\n\s*([^}]+)\s*\n\s*}/g, 'export {\n  $1\n}');
  
  return content;
}

// Fix specific test file patterns
function fixTestFiles(content) {
  // Fix corrupted test function calls
  content = content.replace(/test\s*\(\s*'([^']+)'\s*,\s*\(\s*\)\s*=>\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*\)\s*;/g, 
    "test('$1', () => {\n  $2\n});"
  );
  
  content = content.replace(/it\s*\(\s*'([^']+)'\s*,\s*\(\s*\)\s*=>\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*\)\s*;/g, 
    "it('$1', () => {\n  $2\n});"
  );
  
  content = content.replace(/describe\s*\(\s*'([^']+)'\s*,\s*\(\s*\)\s*=>\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*\)\s*;/g, 
    "describe('$1', () => {\n  $2\n});"
  );
  
  // Fix expect statements
  content = content.replace(/expect\s*\(\s*([^)]+)\s*\)\s*{}\s*\n\s*([^}]+)\s*\n\s*}/g, 'expect($1).$2');
  
  return content;
}

// Fix React component patterns
function fixReactComponents(content) {
  // Fix corrupted component props
  content = content.replace(/const\s+(\w+):\s*React\.FC<([^>]*)>\s*=\s*\(\s*{\s*}\s*\)\s*=>/g, 
    'const $1: React.FC<$2> = (props) =>'
  );
  
  // Fix corrupted JSX return statements
  content = content.replace(/return\s*\(\s*\n\s*<([^>]+)>\s*<\/\1>\s*\n\s*<([^>]+)/g, 
    'return (\n    <$1>\n      <$2'
  );
  
  // Fix corrupted useEffect hooks
  content = content.replace(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{}\s*\n\s*([^}]+)\s*\n\s*}\s*,\s*\[\s*\]\s*\)\s*;/g, 
    'useEffect(() => {\n    $1\n  }, []);'
  );
  
  return content;
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply all fixes
    content = fixCorruptedSyntax(content);
    
    if (filePath.includes('.test.')) {
      content = fixTestFiles(content);
    }
    
    if (filePath.includes('.tsx')) {
      content = fixReactComponents(content);
    }
    
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