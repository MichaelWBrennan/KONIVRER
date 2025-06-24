// Debug script to test image path generation
import { readFileSync } from 'fs';
import { getArtNameFromCardData } from './src/utils/cardArtMapping.js';

const cardsData = JSON.parse(readFileSync('./src/data/cards.json', 'utf8'));

// Test a few cards
const testCards = cardsData.slice(0, 5);

console.log('Testing image path generation:');
testCards.forEach(card => {
  const artName = getArtNameFromCardData(card);
  const suffix = artName === 'PhVE_ELEMENT_PhLAG' ? '_face_6.png' : '_face_1.png';
  const imagePath = `/assets/cards/${artName}${suffix}`;
  
  console.log(`Card: ${card.name}`);
  console.log(`  Art Name: ${artName}`);
  console.log(`  Image Path: ${imagePath}`);
  console.log(`  Expected URL: https://konivrer-deck-database-qbjz-qoemg27ls-crypto3ks-projects.vercel.app${imagePath}`);
  console.log('---');
});