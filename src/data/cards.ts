import { cardDataGenerator } from '../services/cardDataGenerator';

// Card database based on OCR extraction from card images
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
  // OCR-extracted fields
  ocrExtractedName?: string;
  ocrCost?: string;
  ocrTypeLine?: string;
  ocrRulesText?: string;
  ocrStats?: string;
  ocrSetCode?: string;
  ocrRawText?: string; // Full OCR output for debugging
  imageHash?: string; // For caching
  lastOcrUpdate?: number; // Timestamp of last OCR processing
}

// Generate card data from existing assets (fallback method)
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

// Fallback card database (generated from naming patterns)
const fallbackCardDatabase: Card[] = cardNames.map((name, index) => {
  const element = getCardElement(name);
  const type = getCardType(name);
  const rarity = getCardRarity(name);
  
  return {
    id: `card_${index + 1}`,
    name: name.charAt(0) + name.slice(1).toLowerCase().replace(/([A-Z])/g, ' $1'),
    type,
    element,
    rarity,
    cost: 1, // Default cost, to be configured per card
    power: type === 'Creature' ? 1 : undefined, // Default power, to be configured per card
    toughness: type === 'Creature' ? 1 : undefined, // Default toughness, to be configured per card
    description: `A ${element.toLowerCase()} ${type.toLowerCase()} from the KONIVRER Azoth TCG.`,
    imageUrl: `/assets/cards/${name}.png`,
    webpUrl: `/assets/cards/${name}.webp`
  };
});

/**
 * Get card database, preferring OCR-extracted data when available
 */
export function getCardDatabase(): Card[] {
  // Try to load OCR-extracted data first
  const ocrData = cardDataGenerator.loadCardData();
  if (ocrData && ocrData.length > 0) {
    console.log('Using OCR-extracted card data');
    return ocrData;
  }
  
  console.log('Using fallback pattern-based card data');
  return fallbackCardDatabase;
}

// Export the card database
export const cardDatabase = getCardDatabase();

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
  winRate: number; // Win rate as a decimal (0.0 to 1.0)
}

// Deck database will be populated from user-created decks