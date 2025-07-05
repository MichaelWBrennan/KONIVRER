import fs from 'fs';
import path from 'path';

#!/usr/bin/env node

/**
 * KONIVRER Deck Database - Card Image Management Script
 * 
 * This script helps add and optimize card images for the KONIVRER deck database.
 * It processes images according to the optimization guidelines and places them
 * in the correct directory structure.
 */

import fs from 'fs';
import path from 'path';
import {  execSync  } from 'child_process';

// Configuration
const CONFIG = {
  sourceDir: './card-images-source',
  targetDir: './public/assets/cards',
  targetWidth: 412,
  targetHeight: 562,
  quality: 85,
  maxFileSize: 200 * 1024, // 200KB
  supportedFormats: ['.png', '.jpg', '.jpeg', '.webp'],
};

// Expected card names based on the mapping
const EXPECTED_CARDS = [
  'ABISS', 'ANGEL', 'ASH', 'AURORA', 'AZOTH',
  'BRIGHTDUST', 'BRIGHTFULGURITE', 'BRIGHTLAHAR', 'BRIGHTLAVA', 
  'BRIGHTLIGHTNING', 'BRIGHTMUD', 'BRIGHTPERMAFROST', 'BRIGHTSTEAM', 
  'BRIGHTTHUNDERSNOW',
  'DARKDUST', 'DARKFULGURITE', 'DARKICE', 'DARKLAHAR', 'DARKLAVA', 
  'DARKLIGHTNING', 'DARKTHUNDERSNOW', 'DARKTYPHOON',
  'DUST', 'EMBERS', 'FOG', 'FROST', 'GEODE', 'GNOME', 'ICE', 'LAHAR',
  'LIGHTTYPHOON', 'LIGHTNING', 'MAGMA', 'MIASMA', 'MUD', 'NECROSIS',
  'PERMAFROST', 'RAINBOW', 'SALAMANDER', 'SYLPH', 'SMOKE', 'SOLAR',
  'STEAM', 'STORM', 'TAR', 'TYPHOON', 'UNDINE',
  'CHAOS', 'CHAOSDUST', 'CHAOSFULGURITE', 'CHAOSGNOME', 'CHAOSICE',
  'CHAOSLAVA', 'CHAOSLIGHTNING', 'CHAOSMIST', 'CHAOSMUD', 
  'CHAOSPERMAFROST', 'CHAOSSALAMANDER', 'CHAOSSYLPH', 'CHAOSSTEAM',
  'CHAOSTHUNDERSNOW', 'CHAOSUNDINE', 'SHADE', 'FLAG'
];

/**
 * Check if ImageMagick is available
 */
function checkImageMagick(): void {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Sharp is available (Node.js image processing)
 */
function checkSharp(): void {
  try {
    require('sharp');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create directories if they don't exist
 */
function ensureDirectories(): void {
  if (!fs.existsSync(CONFIG.sourceDir)) {
    fs.mkdirSync(CONFIG.sourceDir, { recursive: true });
    console.log(`📁 Created source directory: ${CONFIG.sourceDir}`);
  }
  
  if (!fs.existsSync(CONFIG.targetDir)) {
    fs.mkdirSync(CONFIG.targetDir, { recursive: true });
    console.log(`📁 Created target directory: ${CONFIG.targetDir}`);
  }
}

/**
 * Get file size in bytes
 */
function getFileSize(): void {
  return fs.statSync(filePath).size;
}

/**
 * Process image using ImageMagick
 */
function processWithImageMagick(): void {
  const command = `convert "${inputPath}" -resize ${CONFIG.targetWidth}x${CONFIG.targetHeight}! -quality ${CONFIG.quality} -strip "${outputPath}"`;
  execSync(command);
}

/**
 * Process image using Sharp (if available)
 */
async function processWithSharp(): void {
  import sharp from 'sharp';
  
  await sharp(inputPath)
    .resize(CONFIG.targetWidth, CONFIG.targetHeight, { fit: 'fill' })
    .webp({ quality: CONFIG.quality })
    .toFile(outputPath);
}

/**
 * Find source image for a card name
 */
function findSourceImage(): void {
  for (const ext of CONFIG.supportedFormats) {
    const filePath = path.join(CONFIG.sourceDir, `${cardName}${ext}`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

/**
 * Process a single card image
 */
async function processCardImage(): void {
  const sourceImage = findSourceImage(cardName);
  
  if (!sourceImage) {
    console.log(`⚠️  No source image found for ${cardName}`);
    return false;
  }

  const outputPath = path.join(CONFIG.targetDir, `${cardName}.webp`);
  
  try {
    if (checkSharp()) {
      await processWithSharp(sourceImage, outputPath);
    } else if (checkImageMagick()) {
      processWithImageMagick(sourceImage, outputPath);
    } else {
      console.log(`❌ No image processing tools available. Please install ImageMagick or Sharp.`);
      return false;
    }

    const fileSize = getFileSize(outputPath);
    const fileSizeKB = Math.round(fileSize / 1024);
    
    if (fileSize > CONFIG.maxFileSize) {
      console.log(`⚠️  ${cardName}: ${fileSizeKB}KB (exceeds ${CONFIG.maxFileSize / 1024}KB limit)`);
    } else {
      console.log(`✅ ${cardName}: ${fileSizeKB}KB`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error processing ${cardName}: ${error.message}`);
    return false;
  }
}

/**
 * Main processing function
 */
async function main(): void {
  console.log('🎴 KONIVRER Card Image Processor');
  console.log('================================\n');

  // Check prerequisites
  const hasSharp = checkSharp();
  const hasImageMagick = checkImageMagick();
  
  if (!hasSharp && !hasImageMagick) {
    console.log('❌ No image processing tools found!');
    console.log('Please install one of the following:');
    console.log('  - Sharp: npm install sharp');
    console.log('  - ImageMagick: apt-get install imagemagick (Linux) or brew install imagemagick (macOS)');
    process.exit(1);
  }

  console.log(`🔧 Using: ${hasSharp ? 'Sharp' : 'ImageMagick'}`);
  
  // Ensure directories exist
  ensureDirectories();

  // Check for source images
  const sourceFiles = fs.readdirSync(CONFIG.sourceDir)
    .filter(file => CONFIG.supportedFormats.some(ext => file.toLowerCase().endsWith(ext)));

  if (sourceFiles.length === 0) {
    console.log(`\n📋 No source images found in ${CONFIG.sourceDir}`);
    console.log('Please add your card images to this directory with names matching:');
    EXPECTED_CARDS.slice(0, 10).forEach(card => console.log(`  - ${card}.png`));
    console.log('  - ... etc');
    return;
  }

  console.log(`\n📋 Found ${sourceFiles.length} source images`);
  console.log(`🎯 Target: ${CONFIG.targetWidth}x${CONFIG.targetHeight}, max ${CONFIG.maxFileSize / 1024}KB\n`);

  // Process each expected card
  let processed = 0;
  let successful = 0;

  for (const cardName of EXPECTED_CARDS) {
    const success = await processCardImage(cardName);
    if (success) successful++;
    processed++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processed} cards`);
  console.log(`   Successful: ${successful} cards`);
  console.log(`   Failed: ${processed - successful} cards`);

  // Calculate total size
  const targetFiles = fs.readdirSync(CONFIG.targetDir)
    .filter(file => file.endsWith('.webp') || file.endsWith('.png'));
  
  const totalSize = targetFiles.reduce((sum, file) => {
    return sum + getFileSize(path.join(CONFIG.targetDir, file));
  }, 0);

  console.log(`   Total size: ${Math.round(totalSize / 1024 / 1024 * 100) / 100}MB`);
  
  if (totalSize > 100 * 1024 * 1024) {
    console.log(`⚠️  Warning: Total size exceeds 100MB Vercel limit`);
  } else {
    console.log(`✅ Total size is within Vercel deployment limits`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processCardImage, EXPECTED_CARDS, CONFIG };