// Test the card name to filename conversion logic

const testCards = [
  'AZOΘ',
  'BRIΓT DVST', 
  'BRIΓT LIΓTNING',
  'PERMAΦROST',
  'TIΦOON',
  'ΣADE',
  'ΦIVE ELEMENT ΦLAG'
];

function getCardImagePath(name) {
  if (!name) return null;
  
  // Convert card name to ASCII filename format
  let filename = name
    // Convert Greek letters to ASCII equivalents
    .replace(/Γ/g, 'G')
    .replace(/Φ/g, 'Ph')
    .replace(/Θ/g, 'TH')
    .replace(/Σ/g, 'S')
    // Replace spaces with underscores for variant cards
    .replace(/\s+/g, '_');
  
  // Special case for ΦIVE ELEMENT ΦLAG which uses _face_6.png and Ph format
  if (name === 'ΦIVE ELEMENT ΦLAG') {
    filename = 'PhVE_ELEMENT_PhLAG';
    return `/assets/cards/${filename}_face_6.png`;
  }
  
  return `/assets/cards/${filename}_face_1.png`;
}

console.log('Card name -> Filename conversion test:');
testCards.forEach(card => {
  const path = getCardImagePath(card);
  console.log(`"${card}" -> "${path}"`);
});