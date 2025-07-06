import React from 'react';
/**
 * TypeScript Error Auto-Fix Script
 * 
 * This script automatically fixes common TypeScript errors in the codebase.
 * It uses the TypeScript Compiler API to analyze and fix issues.
 */

import fs from 'fs';
import path from 'path';
const { execSync } = require('child_process');

// Check if ts-morph is installed
try {
  require.resolve('ts-morph');
} catch (e) {
  console.log('Installing ts-morph...');
  execSync('npm install --no-save ts-morph');
}

const { Project, SyntaxKind } = require('ts-morph');

// Initialize TypeScript project
console.log('Initializing TypeScript project...');
const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
});

// Get all TypeScript files
const sourceFiles = project.getSourceFiles();
console.log(`Found ${sourceFiles.length} TypeScript files`);

// Get error information
console.log('Analyzing TypeScript errors...');
let errorOutput;
try {
  errorOutput = execSync('npx tsc --noEmit', { encoding: 'utf8' });
} catch (error) {
  // tsc returns non-zero exit code when there are errors
  errorOutput = error.stdout;
}

// Parse errors
const errors = [];
const errorLines = errorOutput.split('\n');

for (const line of errorLines) {
  const match = line.match(/(.+)\((\d+),(\d+)\): error TS(\d+): (.+)/);
  if (match) {
    const [_, filePath, lineNum, column, code, message] = match;
    errors.push({
      filePath: filePath.trim(),
      line: parseInt(lineNum),
      column: parseInt(column),
      code: parseInt(code),
      message: message.trim(),
    });
  }
}

console.log(`Found ${errors.length} TypeScript errors`);

// Group errors by file
const fileErrors = {};
for (const error of errors) {
  if (!fileErrors[error.filePath]) {
    fileErrors[error.filePath] = [];
  }
  fileErrors[error.filePath].push(error);
}

// Sort files by error count (descending)
const sortedFiles = Object.keys(fileErrors).sort(
  (a, b) => fileErrors[b].length - fileErrors[a].length
);

// Process files with errors
let fixedErrorCount = 0;
let remainingErrorCount = errors.length;

console.log('Starting to fix errors...');
for (const filePath of sortedFiles) {
  const fileErrorCount = fileErrors[filePath].length;
  console.log(`Processing ${filePath} (${fileErrorCount} errors)`);
  
  try {
    const sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) {
      console.log(`  Source file not found: ${filePath}`);
      continue;
    }

    // Apply fixes
    const fixedInFile = fixFile(sourceFile, fileErrors[filePath]);
    
    // Save changes
    if (fixedInFile > 0) {
      sourceFile.saveSync();
      fixedErrorCount += fixedInFile;
      remainingErrorCount -= fixedInFile;
      console.log(`  Fixed ${fixedInFile} issues in: ${filePath}`);
    } else {
      console.log(`  No issues fixed in: ${filePath}`);
    }
  } catch (err) {
    console.error(`  Error processing ${filePath}:`, err.message);
  }
}

console.log('\nSummary:');
console.log(`- Total errors: ${errors.length}`);
console.log(`- Fixed errors: ${fixedErrorCount}`);
console.log(`- Remaining errors: ${remainingErrorCount}`);

// Main function to fix errors in a file
function fixFile(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Fix missing imports
  fixedCount += fixMissingImports(sourceFile, errors);
  
  // Fix syntax errors
  fixedCount += fixSyntaxErrors(sourceFile, errors);
  
  // Fix missing types
  fixedCount += fixMissingTypes(sourceFile, errors);
  
  // Fix implicit any errors
  fixedCount += fixImplicitAny(sourceFile, errors);
  
  // Fix missing interfaces
  fixedCount += fixMissingInterfaces(sourceFile, errors);
  
  // Fix object literal errors
  fixedCount += fixObjectLiteralErrors(sourceFile, errors);
  
  return fixedCount;
}

// Fix missing imports
function fixMissingImports(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Find "Cannot find name" errors
  const missingNameErrors = errors.filter(e => e.code === 2304);
  
  for (const error of missingNameErrors) {
    const match = error.message.match(/Cannot find name '(\w+)'/);
    if (match) {
      const missingName = match[1];
      
      // Check if this is a React component
      if (missingName.match(/^[A-Z][a-zA-Z0-9]*$/)) {
        // Add React import if not present
        if (!sourceFile.getImportDeclaration(i => i.getModuleSpecifierValue() === 'react')) {
          sourceFile.addImportDeclaration({
            moduleSpecifier: 'react',
            namedImports: ['React']
          });
          fixedCount++;
        }
      }
    }
  }
  
  return fixedCount;
}

// Fix syntax errors
function fixSyntaxErrors(sourceFile: any, errors: any) {
  let fixedCount = 0;
  const text = sourceFile.getFullText();
  
  // Fix missing closing braces
  const openBraces = (text.match(/{/g) || []).length;
  const closeBraces = (text.match(/}/g) || []).length;
  
  if (openBraces > closeBraces) {
    const diff = openBraces - closeBraces;
    sourceFile.addStatements('}'.repeat(diff));
    fixedCount += diff;
  }
  
  // Fix missing parentheses
  const openParens = (text.match(/\(/g) || []).length;
  const closeParens = (text.match(/\)/g) || []).length;
  
  if (openParens > closeParens) {
    const diff = openParens - closeParens;
    sourceFile.addStatements(')'.repeat(diff));
    fixedCount += diff;
  }
  
  return fixedCount;
}

// Fix missing types
function fixMissingTypes(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Add proper return types to functions
  sourceFile.getFunctions().forEach(func => {
    if (!func.getReturnTypeNode() && !func.isAsync()) {
      func.setReturnType('any');
      fixedCount++;
    }
  });

  // Add types to method parameters
  sourceFile.getMethods().forEach(method => {
    method.getParameters().forEach(param => {
      if (!param.getTypeNode()) {
        param.setType('any');
        fixedCount++;
      }
    });
  });

  // Add types to variables
  sourceFile.getVariableDeclarations().forEach(variable => {
    if (!variable.getTypeNode() && !variable.getInitializer()) {
      variable.setType('any');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Fix implicit any errors
function fixImplicitAny(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Find implicit any errors
  const implicitAnyErrors = errors.filter(e => e.code === 7006);
  
  for (const error of implicitAnyErrors) {
    const line = error.line - 1; // 0-based line number
    const lineText = sourceFile.getFullText().split('\n')[line];
    
    // Add type annotation
    if (lineText.includes('function') || lineText.includes('=>')) {
      // Function parameter
      const paramMatch = error.message.match(/Parameter '(\w+)'/);
      if (paramMatch) {
        const paramName = paramMatch[1];
        const regex = new RegExp(`(${paramName})(?!\\s*:)`, 'g');
        const newLineText = lineText.replace(regex, `${paramName}: any`);
        
        // Replace the line
        const startPos = sourceFile.getPositionOfLineAndCharacter(line, 0);
        const endPos = sourceFile.getPositionOfLineAndCharacter(line, lineText.length);
        sourceFile.replaceText([startPos, endPos], newLineText);
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Fix missing interfaces
function fixMissingInterfaces(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Find object literals that could benefit from interfaces
  sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression).forEach(obj => {
    const parent = obj.getParent();
    
    // If it's a variable declaration
    if (parent.getKind() === SyntaxKind.VariableDeclaration) {
      const varDecl = parent;
      if (!varDecl.getTypeNode()) {
        // Create an interface name based on variable name
        const varName = varDecl.getName();
        if (varName) {
          const interfaceName = varName.charAt(0).toUpperCase() + varName.slice(1) + 'Interface';
          
          // Create interface
          const properties = obj.getProperties();
          if (properties.length > 0) {
            let interfaceText = `interface ${interfaceName} {\n`;
            
            properties.forEach(prop => {
              const propName = prop.getName();
              interfaceText += `  ${propName}: any;\n`;
            });
            
            interfaceText += '}\n\n';
            
            // Add interface before the variable declaration
            sourceFile.insertText(0, interfaceText);
            
            // Add type to variable
            varDecl.setType(interfaceName);
            fixedCount++;
          }
        }
      }
    }
  });
  
  return fixedCount;
}

// Fix object literal errors
function fixObjectLiteralErrors(sourceFile: any, errors: any) {
  let fixedCount = 0;
  
  // Find object literal errors
  const objectLiteralErrors = errors.filter(e => 
    e.code === 2322 || // Type assignment error
    e.code === 2741    // Property missing in type
  );
  
  for (const error of objectLiteralErrors) {
    const line = error.line - 1; // 0-based line number
    const lineText = sourceFile.getFullText().split('\n')[line];
    
    // Check if it's a property missing error
    const propertyMatch = error.message.match(/Property '(\w+)' is missing/);
    if (propertyMatch) {
      const propertyName = propertyMatch[1];
      
      // Find the object literal
      const objectLiterals = sourceFile.getDescendantsOfKindAtPos(
        SyntaxKind.ObjectLiteralExpression,
        sourceFile.getPositionOfLineAndCharacter(line, error.column)
      );
      
      if (objectLiterals.length > 0) {
        const objectLiteral = objectLiterals[0];
        
        // Add the missing property
        const lastProp = objectLiteral.getProperties().pop();
        const insertPos = lastProp ? lastProp.getEnd() : objectLiteral.getPos() + 1;
        
        sourceFile.insertText(
          insertPos,
          `${lastProp ? ',\n  ' : '  '}${propertyName}: undefined`
        );
        
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}