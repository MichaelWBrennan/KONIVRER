/**
 * Convert JavaScript files to TypeScript
 * 
 * This script automatically converts JavaScript files to TypeScript
 * and updates configurations to ensure TypeScript is the only language used.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git'];
const EXCLUDE_FILES = ['sw.js']; // Service worker should remain as JS

// Find all JavaScript files
function findJavaScriptFiles(dir) {
  let results = [];
  
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(file)) continue;
      
      // Recursively search directories
      results = results.concat(findJavaScriptFiles(filePath));
    } else if (file.endsWith('.js') && !EXCLUDE_FILES.includes(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Convert a JavaScript file to TypeScript
function convertToTypeScript(filePath) {
  console.log(`Converting ${filePath} to TypeScript...`);
  
  // Read the file content
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Create a TypeScript version of the file
  const tsFilePath = filePath.replace(/\.js$/, '.ts');
  
  // Add basic TypeScript annotations
  let tsContent = content;
  
  // Add 'any' type to function parameters
  tsContent = tsContent.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, funcName, params) => {
    if (!params.trim()) return `function ${funcName}()`;
    
    const typedParams = params.split(',').map(param => {
      param = param.trim();
      if (param.includes(':')) return param; // Already has type annotation
      if (param.includes('=')) {
        // Has default value
        const [paramName, defaultValue] = param.split('=').map(p => p.trim());
        return `${paramName}: any = ${defaultValue}`;
      }
      return `${param}: any`;
    }).join(', ');
    
    return `function ${funcName}(${typedParams})`;
  });
  
  // Add return type to functions
  tsContent = tsContent.replace(/function\s+(\w+)\s*\(([^)]*)\)(\s*{)/g, (match, funcName, params, bracket) => {
    return `function ${funcName}(${params}): any${bracket}`;
  });
  
  // Add types to variables with 'let' or 'const'
  tsContent = tsContent.replace(/(let|const)\s+(\w+)\s*=/g, '$1 $2: any =');
  
  // Write the TypeScript file
  fs.writeFileSync(tsFilePath, tsContent);
  
  // Remove the JavaScript file
  fs.unlinkSync(filePath);
  
  console.log(`✓ Converted ${filePath} to ${tsFilePath}`);
}

// Update tsconfig to include all TypeScript files
function updateTsConfig() {
  console.log('Updating tsconfig.json...');
  
  const tsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  // Ensure all TypeScript files are included
  tsconfig.include = ['**/*.ts', '**/*.tsx'];
  
  // Exclude node_modules, dist, etc.
  tsconfig.exclude = ['node_modules', 'dist', 'build', '**/*.js'];
  
  // Add allowJs: false to ensure only TypeScript is used
  tsconfig.compilerOptions.allowJs = false;
  
  // Write the updated tsconfig
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  
  console.log('✓ Updated tsconfig.json');
}

// Update ESLint config to enforce TypeScript
function updateEslintConfig() {
  console.log('Updating ESLint configuration...');
  
  const eslintPath = path.join(ROOT_DIR, '.eslintrc.cjs');
  let eslintConfig = fs.readFileSync(eslintPath, 'utf8');
  
  // Add rule to disallow JavaScript files
  if (!eslintConfig.includes('no-js-files')) {
    eslintConfig = eslintConfig.replace(
      /rules: {/,
      `rules: {
    // Custom rule to disallow JavaScript files
    'no-js-files': 'error',`
    );
  }
  
  // Write the updated ESLint config
  fs.writeFileSync(eslintPath, eslintConfig);
  
  console.log('✓ Updated ESLint configuration');
}

// Update package.json to enforce TypeScript
function updatePackageJson() {
  console.log('Updating package.json...');
  
  const packagePath = path.join(ROOT_DIR, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add script to check for JavaScript files
  packageJson.scripts['check:no-js'] = "find src -name '*.js' | grep -q . && echo 'JavaScript files found in src/' && exit 1 || echo 'No JavaScript files found in src/'";
  
  // Add pre-commit hook to check for JavaScript files
  if (!packageJson.husky) {
    packageJson.husky = {
      hooks: {
        'pre-commit': 'npm run check:no-js'
      }
    };
  } else if (!packageJson.husky.hooks) {
    packageJson.husky.hooks = {
      'pre-commit': 'npm run check:no-js'
    };
  } else {
    packageJson.husky.hooks['pre-commit'] = 'npm run check:no-js && ' + (packageJson.husky.hooks['pre-commit'] || '');
  }
  
  // Write the updated package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  console.log('✓ Updated package.json');
}

// Create a GitHub Action to enforce TypeScript
function createGitHubAction() {
  console.log('Creating GitHub Action to enforce TypeScript...');
  
  const actionDir = path.join(ROOT_DIR, '.github', 'workflows');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(actionDir)) {
    fs.mkdirSync(actionDir, { recursive: true });
  }
  
  const actionPath = path.join(actionDir, 'enforce-typescript.yml');
  const actionContent = `name: Enforce TypeScript

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  enforce-typescript:
    name: Enforce TypeScript
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Check for JavaScript files
        run: |
          if find src -name "*.js" | grep -q .; then
            echo "JavaScript files found in src/ directory:"
            find src -name "*.js"
            exit 1
          else
            echo "No JavaScript files found in src/ directory."
          fi
      
      - name: TypeScript check
        run: |
          npm ci
          npm run type-check
`;
  
  fs.writeFileSync(actionPath, actionContent);
  
  console.log('✓ Created GitHub Action to enforce TypeScript');
}

// Create a TypeScript conversion guide
function createConversionGuide() {
  console.log('Creating TypeScript conversion guide...');
  
  const guidePath = path.join(ROOT_DIR, 'TYPESCRIPT_GUIDE.md');
  const guideContent = `# TypeScript Conversion Guide

This repository uses TypeScript exclusively. This guide provides information on how to work with TypeScript in this project.

## TypeScript Only Policy

This repository has a strict TypeScript-only policy. All code must be written in TypeScript, not JavaScript.

## Converting JavaScript to TypeScript

If you need to convert JavaScript code to TypeScript, follow these steps:

1. Change the file extension from \`.js\` to \`.ts\` (or \`.jsx\` to \`.tsx\` for React components)
2. Add type annotations to function parameters and return types
3. Add type annotations to variables
4. Create interfaces for object structures
5. Use enums instead of string constants where appropriate

## TypeScript Best Practices

- Always specify return types for functions
- Use interfaces for object shapes
- Use type aliases for complex types
- Avoid using \`any\` when possible
- Use generics for reusable components
- Use union types for variables that can have multiple types
- Use optional properties instead of nullable properties when appropriate

## Enforcing TypeScript

The repository has several mechanisms to enforce TypeScript:

- Pre-commit hooks that prevent committing JavaScript files
- GitHub Actions that check for JavaScript files
- ESLint rules that enforce TypeScript usage
- TypeScript compiler options that disallow JavaScript

## Troubleshooting

If you encounter issues with TypeScript:

1. Run \`npm run type-check\` to see all TypeScript errors
2. Use \`npm run fix:typescript\` to automatically fix common TypeScript errors
3. Consult the TypeScript documentation at https://www.typescriptlang.org/docs/

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
`;
  
  fs.writeFileSync(guidePath, guideContent);
  
  console.log('✓ Created TypeScript conversion guide');
}

// Main function
async function main() {
  console.log('Starting JavaScript to TypeScript conversion...');
  
  // Find all JavaScript files
  const jsFiles = findJavaScriptFiles(ROOT_DIR);
  console.log(`Found ${jsFiles.length} JavaScript files to convert`);
  
  // Convert each JavaScript file to TypeScript
  for (const file of jsFiles) {
    convertToTypeScript(file);
  }
  
  // Update configuration files
  updateTsConfig();
  updateEslintConfig();
  updatePackageJson();
  
  // Create GitHub Action
  createGitHubAction();
  
  // Create conversion guide
  createConversionGuide();
  
  console.log('\nConversion complete!');
  console.log(`Converted ${jsFiles.length} JavaScript files to TypeScript`);
  console.log('Updated configuration files to enforce TypeScript');
  console.log('Created GitHub Action to enforce TypeScript');
  console.log('Created TypeScript conversion guide');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});