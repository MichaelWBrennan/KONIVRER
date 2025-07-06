/**
 * KONIVRER Card Database
 * Modern card data following KONIVRER game rules
 */

// KONIVRER Elements (no artifacts/sorceries)
export const KONIVRER_ELEMENTS = {
    FIRE: 'Fire',
  WATER: 'Water', 
  EARTH: 'Earth',
  AIR: 'Air',
  AETHER: 'Aether',
  NETHER: 'Nether';
  NEUTRAL: 'Neutral'
  };

// KONIVRER Card Types (everything can be cast at instant speed)
export const KONIVRER_TYPES = {
    FAMILIAR: 'Familiar',
  SPELL: 'Spell',
  ENCHANTMENT: 'Enchantment';
  LAND: 'Land'
  };

// KONIVRER Keywords (all familiars have haste and vigilance)
export const KONIVRER_KEYWORDS = {
    HASTE: 'Haste',
  VIGILANCE: 'Vigilance',
  FLYING: 'Flying',
  TRAMPLE: 'Trample',
  WARD: 'Ward',
  ECHO: 'Echo',
  CHANNEL: 'Channel',
  MANIFEST: 'Manifest',
  PHASE: 'Phase';
  RESONATE: 'Resonate'
  };

// Sample KONIVRER cards following the game rules
export const konivrCards = [
    // Fire Familiars
  {
    id: 'fire-drake-001',
    name: 'Ember Drake',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.FIRE,
    cost: 3,
    strength: 4,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.FLYING
  ],
    text: 'When Ember Drake enters play, deal 2 damage to any target.',
    flavorText: 'Born from volcanic fury, it soars on wings of flame.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '001',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },
  
  {
    id: 'fire-elemental-002',
    name: 'Blazing Elemental',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.FIRE,
    cost: 2,
    strength: 3,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.TRAMPLE],
    text: 'Whenever Blazing Elemental deals damage, create a Fire token.',
    flavorText: 'Pure elemental fire given form and purpose.',
    rarity: 'Uncommon',
    set: 'Core Set',
    setNumber: '002',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Water Familiars
  {
    id: 'water-spirit-003',
    name: 'Tidal Spirit',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.WATER,
    cost: 2,
    strength: 2,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.PHASE],
    text: 'When Tidal Spirit enters play, draw a card.',
    flavorText: 'It flows like water, strikes like a tsunami.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '003',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  {
    id: 'water-leviathan-004',
    name: 'Deep Leviathan',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.WATER,
    cost: 6,
    strength: 8,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.WARD],
    text: 'Ward 2. When Deep Leviathan enters play, return target familiar to its owner\'s hand.',
    flavorText: 'Ancient guardian of the deepest trenches.',
    rarity: 'Rare',
    set: 'Core Set',
    setNumber: '004',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Earth Familiars
  {
    id: 'earth-golem-005',
    name: 'Stone Golem',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.EARTH,
    cost: 4,
    strength: 5,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.TRAMPLE],
    text: 'Stone Golem enters play with a +1/+1 counter for each Earth familiar you control.',
    flavorText: 'Carved from living stone, animated by ancient magic.',
    rarity: 'Uncommon',
    set: 'Core Set',
    setNumber: '005',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Air Familiars
  {
    id: 'air-sylph-006',
    name: 'Wind Sylph',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.AIR,
    cost: 1,
    strength: 1,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.FLYING],
    text: 'Flying. When Wind Sylph enters play, you may return target spell to its owner\'s hand.',
    flavorText: 'Swift as the wind, elusive as a whisper.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '006',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Aether Familiars
  {
    id: 'aether-phoenix-007',
    name: 'Aether Phoenix',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.AETHER,
    cost: 5,
    strength: 4,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.FLYING, KONIVRER_KEYWORDS.ECHO],
    text: 'Flying, Echo 3. When Aether Phoenix is removed from play, return it to your hand.',
    flavorText: 'Death is but a doorway for beings of pure aether.',
    rarity: 'Rare',
    set: 'Core Set',
    setNumber: '007',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Nether Familiars
  {
    id: 'nether-shade-008',
    name: 'Void Shade',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.NETHER,
    cost: 3,
    strength: 3,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.PHASE],
    text: 'Phase. When Void Shade deals damage to a player, that player discards a card.',
    flavorText: 'It exists between dimensions, touching all yet belonging to none.',
    rarity: 'Uncommon',
    set: 'Core Set',
    setNumber: '008',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Spells() {
    id: 'fire-bolt-009',
    name: 'Fire Bolt',
    type: KONIVRER_TYPES.SPELL,
    element: KONIVRER_ELEMENTS.FIRE,
    cost: 1,
    text: 'Deal 3 damage to any target. Can be cast at instant speed.',
    flavorText: 'A focused burst of elemental fire.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '009',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  {
    id: 'water-healing-010',
    name: 'Healing Waters',
    type: KONIVRER_TYPES.SPELL,
    element: KONIVRER_ELEMENTS.WATER,
    cost: 2,
    text: 'Target player gains 5 life. Draw a card. Can be cast at instant speed.',
    flavorText: 'The waters of life flow eternal.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '010',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Enchantments
  {
    id: 'elemental-bond-011',
    name: 'Elemental Bond',
    type: KONIVRER_TYPES.ENCHANTMENT,
    element: KONIVRER_ELEMENTS.NEUTRAL,
    cost: 2,
    text: 'Whenever a familiar enters play under your control, draw a card.',
    flavorText: 'The connection between summoner and familiar transcends the physical realm.',
    rarity: 'Rare',
    set: 'Core Set',
    setNumber: '011',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Lands
  {
    id: 'fire-shrine-012',
    name: 'Fire Shrine',
    type: KONIVRER_TYPES.LAND,
    element: KONIVRER_ELEMENTS.FIRE,
    cost: 0,
    text: 'Tap: Add one Fire mana to your mana pool.',
    flavorText: 'Sacred ground where fire elementals gather.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '012',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  {
    id: 'water-spring-013',
    name: 'Sacred Spring',
    type: KONIVRER_TYPES.LAND,
    element: KONIVRER_ELEMENTS.WATER,
    cost: 0,
    text: 'Tap: Add one Water mana to your mana pool.',
    flavorText: 'Pure waters blessed by ancient water spirits.',
    rarity: 'Common',
    set: 'Core Set',
    setNumber: '013',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Multi-element cards
  {
    id: 'elemental-fusion-014',
    name: 'Elemental Fusion',
    type: KONIVRER_TYPES.SPELL,
    element: KONIVRER_ELEMENTS.NEUTRAL,
    cost: 4,
    text: 'Choose two different elements. Create a 4/4 Elemental familiar token with both chosen elements. Can be cast at instant speed.',
    flavorText: 'When elements unite, their power multiplies.',
    rarity: 'Rare',
    set: 'Core Set',
    setNumber: '014',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy']
  },

  // Legendary Familiars
  {
    id: 'primal-dragon-015',
    name: 'Primal Dragon',
    type: KONIVRER_TYPES.FAMILIAR,
    element: KONIVRER_ELEMENTS.FIRE,
    cost: 8,
    strength: 10,
    keywords: [KONIVRER_KEYWORDS.HASTE, KONIVRER_KEYWORDS.VIGILANCE, KONIVRER_KEYWORDS.FLYING, KONIVRER_KEYWORDS.TRAMPLE],
    text: 'Flying, Trample. When Primal Dragon enters play, deal 5 damage to each opponent.',
    flavorText: 'The first and mightiest of all fire dragons.',
    rarity: 'Mythic',
    set: 'Core Set',
    setNumber: '015',
    artist: 'KONIVRER Art Team',
    formats: ['Standard', 'Extended', 'Legacy'];
    legendary: true
  }
];
// Export default card data
export default konivrCards;