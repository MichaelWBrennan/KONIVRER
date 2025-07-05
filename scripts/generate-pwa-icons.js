/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * Script to generate PWA icons
 * Generates 192x192 and 512x512 icons for PWA
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icon function
function generateIcon(size) {
  console.log(`Generating ${size}x${size} icon...`);
  
  // Create canvas
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2a3f5f');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Draw card outline
  const cardWidth = size * 0.7;
  const cardHeight = size * 0.9;
  const cardX = (size - cardWidth) / 2;
  const cardY = (size - cardHeight) / 2;
  
  // Card background
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 10);
  ctx.fill();
  
  // Card border
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = size * 0.01;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 10);
  ctx.stroke();
  
  // Draw card elements
  const elementSize = size * 0.15;
  const elementY = cardY + elementSize * 0.7;
  
  // Fire element (top left)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cardX + elementSize, elementY, elementSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Water element (top right)
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(cardX + cardWidth - elementSize, elementY, elementSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Card title bar
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(cardX + size * 0.05, cardY + size * 0.25, cardWidth - size * 0.1, size * 0.08);
  
  // Card content lines
  ctx.fillStyle = '#cbd5e1';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(
      cardX + size * 0.05, 
      cardY + size * 0.4 + i * size * 0.1, 
      cardWidth - size * 0.1, 
      size * 0.05
    );
  }
  
  // Draw "K" letter
  const fontSize = size * 0.2;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', size / 2, size / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `pwa-${size}x${size}.png`), buffer);
  console.log(`Generated ${size}x${size} icon successfully!`);
}

// Generate icons
generateIcon(192);
generateIcon(512);

console.log('PWA icons generated successfully!');