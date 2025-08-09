// Card database based on existing assets
export interface Card {
  id: string;
  name: string;
  type: string;
  element: string;
  rarity: string;
  cost: number;
  power?: number;
  toughness?: number;
  description: string;
  imageUrl: string;
  webpUrl: string;
}

// Generate card data from existing assets
const cardNames = [
  'ABISS', 'ANGEL', 'ASH', 'AURORA', 'AZOTH', 'BRIGHTDUST', 'BRIGHTFULGURITE',
  'BRIGHTLAHAR', 'BRIGHTLAVA', 'BRIGHTLIGHTNING', 'BRIGHTMUD', 'BRIGHTPERMAFROST',
  'BRIGHTSTEAM', 'BRIGHTTHUNDERSNOW', 'CHAOS', 'CHAOSDUST', 'CHAOSFULGURITE',
  'CHAOSGNOME', 'CHAOSICE', 'CHAOSLAVA', 'CHAOSLIGHTNING', 'CHAOSMIST',
  'CHAOSMUD', 'CHAOSPERMAFROST', 'CHAOSSALAMANDER', 'CHAOSSTEAM', 'CHAOSSYLPH',
  'CHAOSTHUNDERSNOW', 'CHAOSUNDINE', 'DARKDUST', 'DARKFULGURITE', 'DARKICE',
  'DARKLAHAR', 'DARKLAVA', 'DARKLIGHTNING', 'DARKTHUNDERSNOW', 'DARKTYPHOON',
  'DUST', 'EMBERS', 'FLAG', 'FOG', 'FROST', 'GEODE', 'GNOME', 'ICE', 'LAHAR',
  'LIGHTNING', 'LIGHTTYPHOON', 'MAGMA', 'MIASMA', 'MUD', 'NECROSIS',
  'PERMAFROST', 'RAINBOW', 'SALAMANDER', 'SHADE', 'SMOKE', 'SOLAR', 'STEAM',
  'STORM', 'SYLPH', 'TAR', 'TYPHOON', 'UNDINE', 'XAOS'
];

function getCardElement(name: string): string {
  if (name.startsWith('BRIGHT')) return 'Light';
  if (name.startsWith('CHAOS')) return 'Chaos';
  if (name.startsWith('DARK')) return 'Dark';
  if (name.includes('FIRE') || name.includes('LAVA') || name.includes('EMBER')) return 'Fire';
  if (name.includes('WATER') || name.includes('ICE') || name.includes('STEAM')) return 'Water';
  if (name.includes('EARTH') || name.includes('DUST') || name.includes('MUD')) return 'Earth';
  if (name.includes('AIR') || name.includes('STORM') || name.includes('TYPHOON')) return 'Air';
  return 'Neutral';
}

function getCardType(name: string): string {
  if (name.includes('GNOME') || name.includes('SALAMANDER') || name.includes('SYLPH') || 
      name.includes('UNDINE') || name.includes('ANGEL')) return 'Creature';
  if (name.includes('LIGHTNING') || name.includes('BOLT')) return 'Instant';
  if (name.includes('DUST') || name.includes('GEODE') || name.includes('TAR')) return 'Artifact';
  return 'Spell';
}

function getCardRarity(name: string): string {
  if (name === 'AZOTH' || name === 'RAINBOW' || name === 'XAOS') return 'Mythic';
  if (name.includes('CHAOS') || name.includes('BRIGHT')) return 'Rare';
  if (name.includes('DARK')) return 'Uncommon';
  return 'Common';
}

export const cardDatabase: Card[] = cardNames.map((name, index) => {
  const element = getCardElement(name);
  const type = getCardType(name);
  const rarity = getCardRarity(name);
  
  return {
    id: `card_${index + 1}`,
    name: name.charAt(0) + name.slice(1).toLowerCase().replace(/([A-Z])/g, ' $1'),
    type,
    element,
    rarity,
    cost: Math.floor(Math.random() * 8) + 1,
    power: type === 'Creature' ? Math.floor(Math.random() * 8) + 1 : undefined,
    toughness: type === 'Creature' ? Math.floor(Math.random() * 8) + 1 : undefined,
    description: `A powerful ${element.toLowerCase()} ${type.toLowerCase()} from the KONIVRER Azoth TCG.`,
    imageUrl: `/assets/cards/${name}.png`,
    webpUrl: `/assets/cards/${name}.webp`
  };
});

// Deck structure
export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: string[];
  mainElement: string;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample decks using existing cards
export const sampleDecks: Deck[] = [
  {
    id: 'deck_1',
    name: 'Chaos Storm',
    description: 'A powerful chaos-based deck focusing on unpredictable effects',
    cards: cardDatabase.filter(card => card.element === 'Chaos').slice(0, 40).map(card => card.id),
    mainElement: 'Chaos',
    format: 'Standard',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'deck_2', 
    name: 'Light Brigade',
    description: 'Aggressive light-based creature deck with strong synergies',
    cards: cardDatabase.filter(card => card.element === 'Light').slice(0, 40).map(card => card.id),
    mainElement: 'Light',
    format: 'Standard',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'deck_3',
    name: 'Dark Control',
    description: 'Control deck with dark magic and powerful late-game threats',
    cards: cardDatabase.filter(card => card.element === 'Dark').slice(0, 40).map(card => card.id),
    mainElement: 'Dark', 
    format: 'Standard',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25')
  }
];