/**
 * KONIVRER Card Database - Official 65 Cards
 * Based on the actual card images in /public/assets/cards/
 */

export interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Flag';
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[];
  keywords: string[];
  strength?: number;
  artist?: string;
}

// Helper function to determine card properties based on name
const getCardProperties = (name: string) => {
  const upperName = name.toUpperCase();
  
  // Determine rarity
  let rarity: 'Common' | 'Uncommon' | 'Rare' = 'Common';
  if (upperName.includes('BRIGHT') || upperName.includes('DARK') || upperName.includes('CHAOS')) {
    rarity = 'Rare';
  } else if (['ANGEL', 'AZOTH', 'RAINBOW', 'SOLAR', 'XAOS', 'AURORA', 'MIASMA', 'NECROSIS'].includes(upperName)) {
    rarity = 'Rare';
  } else if (['SALAMANDER', 'SYLPH', 'UNDINE', 'GNOME', 'STORM', 'TYPHOON', 'GEODE', 'SHADE'].includes(upperName)) {
    rarity = 'Uncommon';
  }

  // Determine type
  const type: 'Familiar' | 'Flag' = upperName === 'FLAG' ? 'Flag' : 'Familiar';

  // Determine elements based on card name
  let elements: string[] = [];
  if (upperName.includes('FIRE') || upperName.includes('FLAME') || upperName.includes('EMBER') || upperName.includes('LAVA') || upperName.includes('MAGMA') || upperName.includes('ASH') || upperName === 'SALAMANDER') {
    elements = ['Fire'];
  } else if (upperName.includes('WATER') || upperName.includes('ICE') || upperName.includes('FROST') || upperName.includes('STEAM') || upperName.includes('PERMAFROST') || upperName === 'UNDINE') {
    elements = ['Water'];
  } else if (upperName.includes('EARTH') || upperName.includes('MUD') || upperName.includes('DUST') || upperName.includes('GEODE') || upperName === 'GNOME') {
    elements = ['Earth'];
  } else if (upperName.includes('AIR') || upperName.includes('WIND') || upperName.includes('LIGHTNING') || upperName.includes('STORM') || upperName.includes('TYPHOON') || upperName === 'SYLPH') {
    elements = ['Air'];
  } else if (upperName.includes('NETHER') || upperName.includes('DARK') || upperName.includes('SHADE') || upperName.includes('MIASMA') || upperName.includes('NECROSIS') || upperName.includes('TAR')) {
    elements = ['Nether'];
  } else if (upperName.includes('AETHER') || upperName.includes('BRIGHT') || upperName.includes('SOLAR') || upperName.includes('AURORA') || upperName.includes('RAINBOW') || upperName === 'ANGEL') {
    elements = ['Aether'];
  } else if (upperName.includes('CHAOS') || upperName === 'XAOS') {
    elements = ['Chaos'];
  } else {
    // Mixed or special elements
    if (upperName.includes('LAHAR')) elements = ['Fire', 'Earth'];
    else if (upperName.includes('FULGURITE')) elements = ['Air', 'Earth'];
    else if (upperName.includes('THUNDERSNOW')) elements = ['Air', 'Water'];
    else if (upperName === 'FOG') elements = ['Air', 'Water'];
    else if (upperName === 'SMOKE') elements = ['Fire', 'Air'];
    else if (upperName === 'ABISS') elements = ['Water', 'Nether'];
    else if (upperName === 'AZOTH') elements = ['Aether'];
    else elements = ['Neutral'];
  }

  // Determine keywords based on card properties
  let keywords: string[] = [];
  if (type === 'Flag') {
    keywords = ['Support', 'Aura'];
  } else {
    if (elements.includes('Fire')) keywords.push('Aggressive');
    if (elements.includes('Water')) keywords.push('Defensive');
    if (elements.includes('Air')) keywords.push('Flying');
    if (elements.includes('Earth')) keywords.push('Sturdy');
    if (elements.includes('Nether')) keywords.push('Stealth');
    if (elements.includes('Aether')) keywords.push('Radiant');
    if (elements.includes('Chaos')) keywords.push('Unpredictable');
    if (upperName.includes('BRIGHT')) keywords.push('Enhanced');
    if (upperName.includes('DARK')) keywords.push('Corrupted');
    if (upperName.includes('CHAOS')) keywords.push('Chaotic');
  }

  // Determine strength for Familiars
  let strength: number | undefined;
  if (type === 'Familiar') {
    if (rarity === 'Rare') strength = Math.floor(Math.random() * 3) + 6; // 6-8
    else if (rarity === 'Uncommon') strength = Math.floor(Math.random() * 3) + 4; // 4-6
    else strength = Math.floor(Math.random() * 3) + 2; // 2-4
  }

  // Determine cost based on rarity and strength
  let cost: number;
  if (type === 'Flag') {
    cost = rarity === 'Rare' ? 4 : rarity === 'Uncommon' ? 3 : 2;
  } else {
    cost = Math.max(1, Math.floor((strength || 2) * 0.8) + (rarity === 'Rare' ? 1 : 0));
  }

  return { rarity, type, elements, keywords, strength, cost };
};

// Generate descriptions based on card properties
const generateDescription = (name: string, properties: any) => {
  const { type, elements, keywords } = properties;
  
  if (type === 'Flag') {
    return `A mystical banner that channels ${elements.join(' and ').toLowerCase()} energy to support allies.`;
  }

  const elementDesc = elements.length > 1 
    ? `A creature of ${elements.join(' and ').toLowerCase()} elements`
    : `A ${elements[0].toLowerCase()} elemental being`;

  const keywordDesc = keywords.length > 0 
    ? ` with ${keywords.join(' and ').toLowerCase()} abilities`
    : '';

  return `${elementDesc}${keywordDesc}.`;
};

// Card names from the actual files in /public/assets/cards/
const CARD_NAMES = [
  'ABISS', 'ANGEL', 'ASH', 'AURORA', 'AZOTH',
  'BRIGHTDUST', 'BRIGHTFULGURITE', 'BRIGHTLAHAR', 'BRIGHTLAVA', 'BRIGHTLIGHTNING',
  'BRIGHTMUD', 'BRIGHTPERMAFROST', 'BRIGHTSTEAM', 'BRIGHTTHUNDERSNOW',
  'CHAOS', 'CHAOSDUST', 'CHAOSFULGURITE', 'CHAOSGNOME', 'CHAOSICE',
  'CHAOSLAVA', 'CHAOSLIGHTNING', 'CHAOSMIST', 'CHAOSMUD', 'CHAOSPERMAFROST',
  'CHAOSSALAMANDER', 'CHAOSSTEAM', 'CHAOSSYLPH', 'CHAOSTHUNDERSNOW', 'CHAOSUNDINE',
  'DARKDUST', 'DARKFULGURITE', 'DARKICE', 'DARKLAHAR', 'DARKLAVA',
  'DARKLIGHTNING', 'DARKTHUNDERSNOW', 'DARKTYPHOON',
  'DUST', 'EMBERS', 'FLAG', 'FOG', 'FROST', 'GEODE', 'GNOME',
  'ICE', 'LAHAR', 'LIGHTNING', 'LIGHTTYPHOON', 'MAGMA', 'MIASMA',
  'MUD', 'NECROSIS', 'PERMAFROST', 'RAINBOW', 'SALAMANDER',
  'SHADE', 'SMOKE', 'SOLAR', 'STEAM', 'STORM', 'SYLPH',
  'TAR', 'TYPHOON', 'UNDINE', 'XAOS'
];

// Generate the complete card database
export const KONIVRER_CARDS: Card[] = CARD_NAMES.map((name, index) => {
  const properties = getCardProperties(name);
  const formattedName = name.charAt(0) + name.slice(1).toLowerCase();
  
  return {
    id: (index + 1).toString(),
    name: formattedName,
    description: generateDescription(formattedName, properties),
    artist: 'KONIVRER Team',
    ...properties
  };
});

export default KONIVRER_CARDS;