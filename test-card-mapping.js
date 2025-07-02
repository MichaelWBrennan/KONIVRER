import { getCardArtPathFromData } from './src/utils/cardArtMapping.js';
import { readFileSync } from 'fs';

const cardsData = JSON.parse(readFileSync('./src/data/cards.json', 'utf8'));

// Test the first few cards
console.log('Testing card art mapping:');
for (let i = 0; i < 5; i++) {
  const card = cardsData[i];
  const url = getCardArtPathFromData(card);
  console.log(`${card.name} -> ${url}`);
}

// Test specific cards
const testCards = [
  { name: 'ΦIVE ELEMENT ΦLAG' },
  { name: 'ABISS' },
  { name: 'BRIΓT DVST' },
  { name: 'LIΓTNING' }
];

console.log('\nTesting specific cards:');
testCards.forEach(card => {
  const url = getCardArtPathFromData(card);
  console.log(`${card.name} -> ${url}`);
});