/**
 * Convert a specific JavaScript file to TypeScript
 * 
 * Usage: ts-node scripts/convert-file.ts <file-path>
 */

import * as fs from 'fs';
import * as path from 'path';
import { runConversion, ConversionOptions } from './advanced-typescript-conversion';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Error: No file path provided');
  console.log('Usage: ts-node scripts/convert-file.ts <file-path>');
  process.exit(1);
}

const filePath = args[0];

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error(`Error: File ${filePath} does not exist`);
  process.exit(1);
}

// Check if the file is a JavaScript file
if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
  console.error(`Error: File ${filePath} is not a JavaScript file`);
  process.exit(1);
}

// Convert the file
console.log(`Converting ${filePath} to TypeScript...`);

const options: ConversionOptions = {
  dryRun: false,
  verbose: true,
  forceConvert: true,
  includePattern: filePath
};

runConversion(options)
  .then(stats => {
    if (stats.convertedFiles > 0) {
      console.log(`Successfully converted ${filePath} to TypeScript`);
    } else {
      console.error(`Failed to convert ${filePath} to TypeScript`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });