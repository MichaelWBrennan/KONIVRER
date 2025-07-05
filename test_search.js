// Test the search parser
import { parseSearchQuery } from './src/utils/searchParser.js';
import fs from 'fs';

const cardsData = JSON.parse(fs.readFileSync('./src/data/cards.json', 'utf8'));

console.log('Testing search parser...');
console.log(`Total cards: ${cardsData.length}`);

// Test cost search
const costResults = parseSearchQuery('c:3', cardsData);
console.log(`Cost search 'c:3' results: ${costResults.length}`);

// Test flag search
const flagResults = parseSearchQuery('t:flag', cardsData);
console.log(`Flag search 't:flag' results: ${flagResults.length}`);

// Test ΦLAG search
const phiFlagResults = parseSearchQuery('t:ΦLAG', cardsData);
console.log(`ΦLAG search 't:ΦLAG' results: ${phiFlagResults.length}`);

// Find the flag card
const flagCard = cardsData.find(card => card.type === 'ΦLAG');
if (flagCard) {
  console.log(`\nFlag card found:`, flagCard.name, 'type:', flagCard.type);
  console.log(`Type lowercase:`, flagCard.type.toLowerCase());
}