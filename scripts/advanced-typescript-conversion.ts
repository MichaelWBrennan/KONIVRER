/**
 * Advanced TypeScript Conversion Tool
 * 
 * This script provides more sophisticated conversion of JavaScript files to TypeScript,
 * handling complex patterns, React components, and more.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const ROOT_DIR: string = path.resolve(__dirname, '..');
const EXCLUDE_DIRS: string[] = ['node_modules', 'dist', 'build', '.git'];
const EXCLUDE_FILES: string[] = ['sw.js']; // Service worker should remain as JS

// Type definitions
interface ConversionStats {
  totalFiles: number;
  convertedFiles: number;
  skippedFiles: number;
  errorFiles: number;
  fileDetails: {
    converted: string[];
    skipped: string[];
    errors: string[];
  };
}

interface ConversionOptions {
  dryRun: boolean;
  verbose: boolean;
  forceConvert: boolean;
  outputDir?: string;
  includePattern?: string;
  excludePattern?: string;
}

// Find all JavaScript files
function findJavaScriptFiles(dir: string, options: ConversionOptions): string[] {
  let results: string[] = [];
  
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(file)) continue;
      
      // Recursively search directories
      results = results.concat(findJavaScriptFiles(filePath, options));
    } else if (file.endsWith('.js') && !EXCLUDE_FILES.includes(file)) {
      // Apply include/exclude patterns if specified
      if (options.includePattern && !filePath.match(new RegExp(options.includePattern))) {
        continue;
      }
      
      if (options.excludePattern && filePath.match(new RegExp(options.excludePattern))) {
        continue;
      }
      
      results.push(filePath);
    }
  }
  
  return results;
}

// Detect if a file is a React component
function isReactComponent(content: string): boolean {
  // Check for React imports
  if (content.includes('import React') || content.includes('from "react"') || content.includes("from 'react'")) {
    return true;
  }
  
  // Check for JSX syntax
  if (content.includes('</') || content.match(/<[A-Z][A-Za-z0-9]*/) || content.match(/<[a-z]+\s+[^>]*>/)) {
    return true;
  }
  
  // Check for React component patterns
  if (content.includes('extends Component') || content.includes('extends React.Component')) {
    return true;
  }
  
  // Check for hooks
  if (content.match(/use[A-Z][A-Za-z0-9]*\(/)) {
    return true;
  }
  
  return false;
}

// Detect if a file is a Node.js script
function isNodeScript(content: string): boolean {
  // Check for Node.js specific imports
  if (content.includes('require(') || 
      content.includes('module.exports') || 
      content.includes('process.env') || 
      content.includes('__dirname') || 
      content.includes('__filename')) {
    return true;
  }
  
  // Check for Node.js specific APIs
  if (content.includes('fs.') || 
      content.includes('path.') || 
      content.includes('http.') || 
      content.includes('child_process')) {
    return true;
  }
  
  return false;
}

// Convert a JavaScript file to TypeScript
function convertToTypeScript(filePath: string, options: ConversionOptions): boolean {
  if (options.verbose) {
    console.log(`Converting ${filePath} to TypeScript...`);
  }
  
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Determine file type
    const isReact = isReactComponent(content);
    const isNode = isNodeScript(content);
    
    // Create a TypeScript version of the file
    let tsFilePath: string;
    
    if (isReact && filePath.endsWith('.js')) {
      // Convert .js to .tsx for React components
      tsFilePath = filePath.replace(/\.js$/, '.tsx');
    } else {
      // Convert .js to .ts for regular files
      tsFilePath = filePath.replace(/\.js$/, '.ts');
    }
    
    // If outputDir is specified, adjust the output path
    if (options.outputDir) {
      const relativePath = path.relative(ROOT_DIR, tsFilePath);
      tsFilePath = path.join(options.outputDir, relativePath);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(tsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    
    // Convert the content
    let tsContent = convertContent(content, isReact, isNode);
    
    // Write the TypeScript file
    if (!options.dryRun) {
      fs.writeFileSync(tsFilePath, tsContent);
      
      // Remove the JavaScript file unless we're outputting to a different directory
      if (!options.outputDir) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (options.verbose) {
      console.log(`✓ Converted ${filePath} to ${tsFilePath}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
    return false;
  }
}

// Convert JavaScript content to TypeScript
function convertContent(content: string, isReact: boolean, isNode: boolean): string {
  let tsContent = content;
  
  // Add React import if it's a React component but doesn't have it
  if (isReact && !content.includes('import React')) {
    tsContent = `import React from 'react';\n${tsContent}`;
  }
  
  // Convert require statements to imports
  tsContent = convertRequireToImport(tsContent);
  
  // Convert module.exports to export default
  tsContent = convertModuleExports(tsContent);
  
  // Add 'any' type to function parameters
  tsContent = addTypesToFunctions(tsContent);
  
  // Add types to variables
  tsContent = addTypesToVariables(tsContent);
  
  // Add types to class properties
  tsContent = addTypesToClassProperties(tsContent);
  
  // Add interfaces for object literals
  tsContent = addInterfacesForObjects(tsContent);
  
  // Add React component types if it's a React file
  if (isReact) {
    tsContent = addReactComponentTypes(tsContent);
  }
  
  return tsContent;
}

// Convert require statements to imports
function convertRequireToImport(content: string): string {
  // Match const/let/var something = require('module')
  const requirePattern = /(const|let|var)\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g;
  
  return content.replace(requirePattern, (match, declarationType, variableName, moduleName) => {
    return `import ${variableName} from '${moduleName}';`;
  });
}

// Convert module.exports to export default
function convertModuleExports(content: string): string {
  // Simple case: module.exports = something;
  let result = content.replace(/module\.exports\s*=\s*([^;]+);/g, 'export default $1;');
  
  // Complex case: module.exports = { ... }
  const exportPattern = /module\.exports\s*=\s*{([^}]+)}/g;
  result = result.replace(exportPattern, (match, exportContent) => {
    // Check if it's a simple object with key-value pairs
    if (exportContent.includes(':')) {
      return `export default {${exportContent}};`;
    } else {
      // It's a list of variables to export
      const exports = exportContent.split(',').map(e => e.trim());
      return exports.map(e => `export { ${e} };`).join('\n');
    }
  });
  
  return result;
}

// Add types to functions
function addTypesToFunctions(content: string): string {
  // Add types to function parameters
  let result = content.replace(/function\s+(\w+)\s*\(([^)]*)\)(\s*{)/g, (match, funcName, params, bracket) => {
    if (!params.trim()) return `function ${funcName}(): any${bracket}`;
    
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
    
    return `function ${funcName}(${typedParams}): any${bracket}`;
  });
  
  // Add types to arrow functions
  result = result.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g, (match, funcName, params) => {
    if (!params.trim()) return `const ${funcName} = (): any =>`;
    
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
    
    return `const ${funcName} = (${typedParams}): any =>`;
  });
  
  return result;
}

// Add types to variables
function addTypesToVariables(content: string): string {
  // Add types to variable declarations
  return content.replace(/(const|let|var)\s+(\w+)(\s*=\s*[^;]+;)/g, (match, declarationType, variableName, assignment) => {
    // Skip if already has a type
    if (match.includes(':')) return match;
    
    // Check if it's an array
    if (assignment.includes('[') && assignment.includes(']')) {
      return `${declarationType} ${variableName}: any[]${assignment}`;
    }
    
    // Check if it's an object
    if (assignment.includes('{') && assignment.includes('}')) {
      return `${declarationType} ${variableName}: Record<string, any>${assignment}`;
    }
    
    // Check if it's a function
    if (assignment.includes('=>') || assignment.includes('function')) {
      return `${declarationType} ${variableName}: Function${assignment}`;
    }
    
    // Check if it's a string
    if (assignment.includes("'") || assignment.includes('"') || assignment.includes('`')) {
      return `${declarationType} ${variableName}: string${assignment}`;
    }
    
    // Check if it's a number
    if (assignment.match(/=\s*\d+/)) {
      return `${declarationType} ${variableName}: number${assignment}`;
    }
    
    // Check if it's a boolean
    if (assignment.includes('true') || assignment.includes('false')) {
      return `${declarationType} ${variableName}: boolean${assignment}`;
    }
    
    // Default to any
    return `${declarationType} ${variableName}: any${assignment}`;
  });
}

// Add types to class properties
function addTypesToClassProperties(content: string): string {
  // Find class declarations
  const classPattern = /class\s+(\w+)(\s+extends\s+(\w+))?\s*{([^}]+)}/g;
  
  return content.replace(classPattern, (match, className, extendsClause, parentClass, classBody) => {
    // Add types to class properties
    const typedClassBody = classBody.replace(/(\s+)(\w+)(\s*=\s*[^;]+;)/g, '$1$2: any$3');
    
    return `class ${className}${extendsClause || ''} {${typedClassBody}}`;
  });
}

// Add interfaces for object literals
function addInterfacesForObjects(content: string): string {
  // This is a simplified approach - a real implementation would need to parse the AST
  // to properly handle nested objects and complex structures
  
  // Find variable declarations with object literals
  const objectPattern = /(const|let|var)\s+(\w+)\s*=\s*({[^;]+});/g;
  
  let interfaces = '';
  let modifiedContent = content;
  
  // Replace object literals with typed interfaces
  modifiedContent = modifiedContent.replace(objectPattern, (match, declarationType, variableName, objectLiteral) => {
    // Skip if already has a type
    if (match.includes(':')) return match;
    
    // Create interface name based on variable name
    const interfaceName = variableName.charAt(0).toUpperCase() + variableName.slice(1) + 'Interface';
    
    // Extract properties from object literal
    const properties = objectLiteral.match(/(\w+):\s*([^,}]+)/g);
    
    if (properties) {
      // Create interface
      let interfaceDefinition = `interface ${interfaceName} {\n`;
      
      properties.forEach(prop => {
        const [propName, propValue] = prop.split(':').map(p => p.trim());
        let propType = 'any';
        
        // Infer type from value
        if (propValue.includes("'") || propValue.includes('"') || propValue.includes('`')) {
          propType = 'string';
        } else if (propValue.match(/^\d+$/)) {
          propType = 'number';
        } else if (propValue === 'true' || propValue === 'false') {
          propType = 'boolean';
        } else if (propValue.includes('[') && propValue.includes(']')) {
          propType = 'any[]';
        } else if (propValue.includes('{') && propValue.includes('}')) {
          propType = 'Record<string, any>';
        } else if (propValue.includes('=>') || propValue.includes('function')) {
          propType = 'Function';
        }
        
        interfaceDefinition += `  ${propName}: ${propType};\n`;
      });
      
      interfaceDefinition += '}\n\n';
      interfaces += interfaceDefinition;
      
      // Replace the original declaration with a typed one
      return `${declarationType} ${variableName}: ${interfaceName} = ${objectLiteral};`;
    }
    
    return match;
  });
  
  // Add interfaces at the beginning of the file
  return interfaces + modifiedContent;
}

// Add React component types
function addReactComponentTypes(content: string): string {
  let result = content;
  
  // Add types to functional components
  result = result.replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g, (match, componentName, props) => {
    // Skip if already has a type
    if (match.includes(':')) return match;
    
    // Create props interface
    const propsInterfaceName = `${componentName}Props`;
    let propsInterface = `interface ${propsInterfaceName} {\n`;
    
    // Extract props
    const propsList = props.split(',').map(p => p.trim());
    propsList.forEach(prop => {
      if (prop) {
        // Handle destructured props
        if (prop.includes('{')) {
          const destructuredProps = prop.match(/{([^}]+)}/);
          if (destructuredProps) {
            const props = destructuredProps[1].split(',').map(p => p.trim());
            props.forEach(p => {
              propsInterface += `  ${p}: any;\n`;
            });
          }
        } else {
          propsInterface += `  ${prop}: any;\n`;
        }
      }
    });
    
    propsInterface += '}\n\n';
    
    // Add React.FC type
    return `${propsInterface}const ${componentName}: React.FC<${propsInterfaceName}> = (${props}) => {`;
  });
  
  // Add types to class components
  result = result.replace(/class\s+(\w+)\s+extends\s+(React\.Component|Component)(\s*{)/g, (match, componentName, baseClass, bracket) => {
    // Skip if already has a type
    if (match.includes('<')) return match;
    
    // Create props and state interfaces
    const propsInterfaceName = `${componentName}Props`;
    const stateInterfaceName = `${componentName}State`;
    
    const interfaces = `interface ${propsInterfaceName} {}\n\ninterface ${stateInterfaceName} {}\n\n`;
    
    // Add generic types to component
    return `${interfaces}class ${componentName} extends ${baseClass}<${propsInterfaceName}, ${stateInterfaceName}>${bracket}`;
  });
  
  return result;
}

// Run the conversion process
async function runConversion(options: ConversionOptions): Promise<ConversionStats> {
  console.log('Starting advanced JavaScript to TypeScript conversion...');
  
  // Find all JavaScript files
  const jsFiles = findJavaScriptFiles(ROOT_DIR, options);
  console.log(`Found ${jsFiles.length} JavaScript files to convert`);
  
  // Initialize stats
  const stats: ConversionStats = {
    totalFiles: jsFiles.length,
    convertedFiles: 0,
    skippedFiles: 0,
    errorFiles: 0,
    fileDetails: {
      converted: [],
      skipped: [],
      errors: []
    }
  };
  
  // Convert each JavaScript file to TypeScript
  for (const file of jsFiles) {
    try {
      const success = convertToTypeScript(file, options);
      
      if (success) {
        stats.convertedFiles++;
        stats.fileDetails.converted.push(file);
      } else {
        stats.errorFiles++;
        stats.fileDetails.errors.push(file);
      }
    } catch (error) {
      console.error(`Error converting ${file}:`, error);
      stats.errorFiles++;
      stats.fileDetails.errors.push(file);
    }
  }
  
  // Print summary
  console.log('\nConversion Summary:');
  console.log(`Total files: ${stats.totalFiles}`);
  console.log(`Converted files: ${stats.convertedFiles}`);
  console.log(`Skipped files: ${stats.skippedFiles}`);
  console.log(`Error files: ${stats.errorFiles}`);
  
  if (options.verbose) {
    console.log('\nConverted files:');
    stats.fileDetails.converted.forEach(file => console.log(`- ${file}`));
    
    if (stats.fileDetails.skipped.length > 0) {
      console.log('\nSkipped files:');
      stats.fileDetails.skipped.forEach(file => console.log(`- ${file}`));
    }
    
    if (stats.fileDetails.errors.length > 0) {
      console.log('\nError files:');
      stats.fileDetails.errors.forEach(file => console.log(`- ${file}`));
    }
  }
  
  return stats;
}

// Parse command line arguments
function parseArgs(): ConversionOptions {
  const args = process.argv.slice(2);
  const options: ConversionOptions = {
    dryRun: false,
    verbose: false,
    forceConvert: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--force':
        options.forceConvert = true;
        break;
      case '--output-dir':
        options.outputDir = args[++i];
        break;
      case '--include':
        options.includePattern = args[++i];
        break;
      case '--exclude':
        options.excludePattern = args[++i];
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

// Print help message
function printHelp(): void {
  console.log(`
Advanced TypeScript Conversion Tool

Usage: ts-node advanced-typescript-conversion.ts [options]

Options:
  --dry-run         Don't actually convert files, just show what would be done
  --verbose         Show detailed output
  --force           Force conversion even if it might cause issues
  --output-dir DIR  Output converted files to DIR instead of replacing originals
  --include PATTERN Only include files matching PATTERN
  --exclude PATTERN Exclude files matching PATTERN
  --help            Show this help message
  `);
}

// Main function
async function main(): Promise<void> {
  const options = parseArgs();
  
  if (options.dryRun) {
    console.log('Running in dry-run mode. No files will be modified.');
  }
  
  await runConversion(options);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { runConversion, ConversionOptions, ConversionStats };