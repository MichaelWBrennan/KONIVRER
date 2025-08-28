import { cardDataGenerator } from '../services/cardDataGenerator';

// KONIVRER Card database with pattern-based data generation
export interface Card {
  id: string;
  name: string;
  lesserType: string; // KONIVRER-specific card type system
  elements: string[]; // KONIVRER supports multiple elements per card
  rarity: 'common' | 'uncommon' | 'rare'; // ☽, ☉, 🜠 symbols
  azothCost: number; // KONIVRER uses Azoth instead of mana
  power?: number;
  toughness?: number;
  rulesText?: string;
  flavorText?: string;
  abilities?: string[]; // Keyword abilities
  setCode: string;
  setNumber: number;
  imageUrl: string;
  webpUrl: string;
  imageHash?: string; // For caching
  // Legacy compatibility fields
  type?: string;
  element?: string;
  cost?: number;
  description?: string;
}

// Generate card data from existing assets (fallback method)
const cardNames     : any = [
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

function getCardElements(name: string): string[] {
  const elements: string[]     : any = [];
  if (name.startsWith('BRIGHT')) elements.push('Light');
  if (name.startsWith('CHAOS')) elements.push('Chaos');
  if (name.startsWith('DARK')) elements.push('Dark');
  if (name.includes('FIRE') || name.includes('LAVA') || name.includes('EMBER') || name.includes('SALAMANDER')) elements.push('Fire');
  if (name.includes('WATER') || name.includes('ICE') || name.includes('STEAM') || name.includes('UNDINE')) elements.push('Water');
  if (name.includes('EARTH') || name.includes('DUST') || name.includes('MUD') || name.includes('GNOME')) elements.push('Earth');
  if (name.includes('AIR') || name.includes('STORM') || name.includes('TYPHOON') || name.includes('SYLPH')) elements.push('Air');
  return elements.length > 0 ? elements : ['Neutral'];
}

function getCardLesserType(name: string): string {
  if (name.includes('GNOME') || name.includes('SALAMANDER') || name.includes('SYLPH') || 
      name.includes('UNDINE') || name.includes('ANGEL')) return 'Familiar';
  if (name.includes('LIGHTNING') || name.includes('BOLT')) return 'Instant Spell';
  if (name.includes('DUST') || name.includes('GEODE') || name.includes('TAR')) return 'Artifact';
  if (name === 'FLAG' || name.includes('FLAG')) return 'Flag';
  return 'Spell';
}

function getCardRarity(name: string): 'common' | 'uncommon' | 'rare' {
  if (name === 'AZOTH' || name === 'RAINBOW' || name === 'XAOS') return 'rare';
  if (name.includes('CHAOS') || name.includes('BRIGHT')) return 'rare';
  if (name.includes('DARK')) return 'uncommon';
  return 'common';
}

function getCardAbilities(name: string): string[] {
  const abilities: string[]     : any = [];
  if (name.includes('BRIGHT')) abilities.push('brilliance');
  if (name.includes('CHAOS')) abilities.push('quintessence');
  if (name.includes('DARK')) abilities.push('void');
  if (name.includes('FIRE') || name.includes('LAVA')) abilities.push('inferno');
  if (name.includes('WATER') || name.includes('ICE')) abilities.push('submerged');
  if (name.includes('EARTH') || name.includes('DUST')) abilities.push('steadfast');
  if (name.includes('AIR') || name.includes('STORM')) abilities.push('gust');
  return abilities;
}

// Fallback card database (generated from naming patterns)
const fallbackCardDatabase: Card[]     : any = cardNames.map((name, index) => {
  const elements     : any = getCardElements(name);
  const lesserType     : any = getCardLesserType(name);
  const rarity     : any = getCardRarity(name);
  const abilities     : any = getCardAbilities(name);
  
  return {
    id: `konivrer_${index + 1}`,
    name: name.charAt(0) + name.slice(1).toLowerCase().replace(/([A-Z])/g, ' $1'),
    lesserType,
    elements,
    rarity,
    azothCost: rarity === 'rare' ? 3 : rarity === 'uncommon' ? 2 : 1, // Basic cost scaling
    power: lesserType === 'Familiar' ? (rarity === 'rare' ? 3 : rarity === 'uncommon' ? 2 : 1) : undefined,
    toughness: lesserType === 'Familiar' ? (rarity === 'rare' ? 3 : rarity === 'uncommon' ? 2 : 1) : undefined,
    rulesText: `A ${elements.join('/')} ${lesserType} from the KONIVRER Azoth TCG.`,
    flavorText: `"In the world of KONIVRER, even the smallest spark can ignite great change."`,
    abilities,
    setCode: 'KNR',
    setNumber: index + 1,
    imageUrl: `/assets/cards/${name}.png`,
    webpUrl: `/assets/cards/${name}.webp`,
    // Legacy compatibility
    type: lesserType,
    element: elements[0],
    cost: rarity === 'rare' ? 3 : rarity === 'uncommon' ? 2 : 1,
    manaCost: rarity === 'rare' ? 3 : rarity === 'uncommon' ? 2 : 1,
    color: elements[0]?.toLowerCase(),
    text: `A ${elements.join('/')} ${lesserType} from the KONIVRER Azoth TCG.`,
    description: `A ${elements.join('/')} ${lesserType} from the KONIVRER Azoth TCG.`
  };
});

/**
 * Get card database, preferring generated data when available
 */
export function getCardDatabase(): Card[] {
  // Try to load generated data first
  const generatedData     : any = cardDataGenerator.loadCardData();
  if (generatedData && generatedData.length > 0) {
    console.log('Using generated card data');
    return generatedData;
  }
  
  console.log('Using fallback pattern-based card data');
  return fallbackCardDatabase;
}

// Export the card database
export const cardDatabase     : any = getCardDatabase();

// KONIVRER Deck structure
export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: string[]; // Card IDs
  flag?: string; // Flag card ID - required for KONIVRER, does not count toward 40 card total
  azothIdentity: string[]; // Elements from the Flag card
  format: string;
  createdAt: Date;
  updatedAt: Date;
  winRate: number; // Win rate as a decimal (0.0 to 1.0)
  // KONIVRER deck construction validation
  cardCounts?: {
    total: number;      // Must be exactly 40
    common: number;     // Must be exactly 25 (🜠)
    uncommon: number;   // Must be exactly 13 (☽)
    rare: number;       // Must be exactly 2 (☉)
  };
  isValid?: boolean;
  // Legacy compatibility
  mainElement?: string;
}

// Deck database will be populated from user-created decks