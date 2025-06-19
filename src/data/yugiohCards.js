// Yu-Gi-Oh! Card Database
// Compatible with Dueling Nexus format

export const yugiohCards = {
  // Iconic Monsters
  89631139: {
    id: 89631139,
    name: 'Blue-Eyes White Dragon',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 8,
    attack: 3000,
    defense: 2500,
    cardType: 'Normal Monster',
    description:
      'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.',
    rarity: 'Ultra Rare',
    archetype: 'Blue-Eyes',
    image: '/api/placeholder/200/290',
  },
  46986414: {
    id: 46986414,
    name: 'Dark Magician',
    type: 'Monster',
    attribute: 'DARK',
    level: 7,
    attack: 2500,
    defense: 2100,
    cardType: 'Normal Monster',
    description: 'The ultimate wizard in terms of attack and defense.',
    rarity: 'Ultra Rare',
    archetype: 'Dark Magician',
    image: '/api/placeholder/200/290',
  },
  38517737: {
    id: 38517737,
    name: 'Blue-Eyes Alternative White Dragon',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 8,
    attack: 3000,
    defense: 2500,
    cardType: 'Effect Monster',
    description:
      'Cannot be Normal Summoned/Set. Must first be Special Summoned (from your hand) by revealing "Blue-Eyes White Dragon" in your hand. You can only Special Summon "Blue-Eyes Alternative White Dragon" once per turn this way. This card\'s name becomes "Blue-Eyes White Dragon" while it is on the field or in the GY. Once per turn: You can target 1 monster your opponent controls; destroy it. This card cannot attack the turn this effect is activated.',
    rarity: 'Secret Rare',
    archetype: 'Blue-Eyes',
    image: '/api/placeholder/200/290',
  },
  20721928: {
    id: 20721928,
    name: 'Elemental HERO Sparkman',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 4,
    attack: 1600,
    defense: 1400,
    cardType: 'Normal Monster',
    description:
      'An Elemental HERO with the power of lightning. He uses his electric powers to shock his enemies.',
    rarity: 'Common',
    archetype: 'Elemental HERO',
    image: '/api/placeholder/200/290',
  },
  21844576: {
    id: 21844576,
    name: 'Elemental HERO Avian',
    type: 'Monster',
    attribute: 'WIND',
    level: 3,
    attack: 1000,
    defense: 1000,
    cardType: 'Normal Monster',
    description:
      'A winged Elemental HERO who wheels through the sky and manipulates the wind. His signature move, Featherbreak, gives villainy a blow from above.',
    rarity: 'Common',
    archetype: 'Elemental HERO',
    image: '/api/placeholder/200/290',
  },
  79979666: {
    id: 79979666,
    name: 'Elemental HERO Burstinatrix',
    type: 'Monster',
    attribute: 'FIRE',
    level: 3,
    attack: 1200,
    defense: 800,
    cardType: 'Normal Monster',
    description:
      'A flame manipulator who is an Elemental HERO. She can launch fireballs and fire blasts at her enemies.',
    rarity: 'Common',
    archetype: 'Elemental HERO',
    image: '/api/placeholder/200/290',
  },

  // Spell Cards
  2347656: {
    id: 2347656,
    name: 'Mystical Space Typhoon',
    type: 'Spell',
    cardType: 'Quick-Play Spell',
    description: 'Target 1 Spell/Trap on the field; destroy it.',
    rarity: 'Common',
    image: '/api/placeholder/200/290',
  },
  19613556: {
    id: 19613556,
    name: 'Heavy Storm',
    type: 'Spell',
    cardType: 'Normal Spell',
    description: 'Destroy all Spell and Trap Cards on the field.',
    rarity: 'Rare',
    image: '/api/placeholder/200/290',
  },
  55144522: {
    id: 55144522,
    name: 'Pot of Greed',
    type: 'Spell',
    cardType: 'Normal Spell',
    description: 'Draw 2 cards.',
    rarity: 'Rare',
    image: '/api/placeholder/200/290',
  },
  24094653: {
    id: 24094653,
    name: 'Polymerization',
    type: 'Spell',
    cardType: 'Normal Spell',
    description:
      'Fusion Summon 1 Fusion Monster from your Extra Deck, using monsters from your hand or field as Fusion Material.',
    rarity: 'Common',
    archetype: 'Polymerization',
    image: '/api/placeholder/200/290',
  },
  1845204: {
    id: 1845204,
    name: 'Instant Fusion',
    type: 'Spell',
    cardType: 'Normal Spell',
    description:
      'Pay 1000 LP; Special Summon 1 Level 5 or lower Fusion Monster from your Extra Deck, but it cannot attack, also destroy it during the End Phase.',
    rarity: 'Rare',
    image: '/api/placeholder/200/290',
  },

  // Trap Cards
  44095762: {
    id: 44095762,
    name: 'Mirror Force',
    type: 'Trap',
    cardType: 'Normal Trap',
    description:
      "When an opponent's monster declares an attack: Destroy all Attack Position monsters your opponent controls.",
    rarity: 'Common',
    image: '/api/placeholder/200/290',
  },
  53129443: {
    id: 53129443,
    name: 'Bottomless Trap Hole',
    type: 'Trap',
    cardType: 'Normal Trap',
    description:
      'When your opponent Summons a monster(s) with 1500 or more ATK: Destroy that monster(s) with 1500 or more ATK, and if you do, banish it.',
    rarity: 'Rare',
    image: '/api/placeholder/200/290',
  },
  4206964: {
    id: 4206964,
    name: 'Compulsory Evacuation Device',
    type: 'Trap',
    cardType: 'Normal Trap',
    description: 'Target 1 monster on the field; return it to the hand.',
    rarity: 'Common',
    image: '/api/placeholder/200/290',
  },
  83764718: {
    id: 83764718,
    name: 'Solemn Judgment',
    type: 'Trap',
    cardType: 'Counter Trap',
    description:
      'When a monster(s) would be Summoned, OR a Spell/Trap Card is activated: Pay half your LP; negate the Summon or activation, and if you do, destroy that card.',
    rarity: 'Ultra Rare',
    image: '/api/placeholder/200/290',
  },

  // Fusion Monsters
  23995346: {
    id: 23995346,
    name: 'Blue-Eyes Ultimate Dragon',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 12,
    attack: 4500,
    defense: 3800,
    cardType: 'Fusion Monster',
    description:
      '"Blue-Eyes White Dragon" + "Blue-Eyes White Dragon" + "Blue-Eyes White Dragon"',
    rarity: 'Ultra Rare',
    archetype: 'Blue-Eyes',
    fusionMaterial: [
      'Blue-Eyes White Dragon',
      'Blue-Eyes White Dragon',
      'Blue-Eyes White Dragon',
    ],
    image: '/api/placeholder/200/290',
  },
  35809262: {
    id: 35809262,
    name: 'Elemental HERO Flame Wingman',
    type: 'Monster',
    attribute: 'WIND',
    level: 6,
    attack: 2100,
    defense: 1200,
    cardType: 'Fusion Monster',
    description:
      '"Elemental HERO Avian" + "Elemental HERO Burstinatrix"\nMust be Fusion Summoned. When this card destroys an opponent\'s monster by battle: Inflict damage to your opponent equal to the ATK of the destroyed monster.',
    rarity: 'Ultra Rare',
    archetype: 'Elemental HERO',
    fusionMaterial: ['Elemental HERO Avian', 'Elemental HERO Burstinatrix'],
    image: '/api/placeholder/200/290',
  },
  20721928: {
    id: 58932615,
    name: 'Elemental HERO Thunder Giant',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 6,
    attack: 2400,
    defense: 1500,
    cardType: 'Fusion Monster',
    description:
      '"Elemental HERO Sparkman" + "Elemental HERO Avian"\nMust be Fusion Summoned. When this card is Fusion Summoned: You can destroy 1 face-down monster your opponent controls.',
    rarity: 'Rare',
    archetype: 'Elemental HERO',
    fusionMaterial: ['Elemental HERO Sparkman', 'Elemental HERO Avian'],
    image: '/api/placeholder/200/290',
  },

  // Effect Monsters
  77585513: {
    id: 77585513,
    name: 'Dark Magician Girl',
    type: 'Monster',
    attribute: 'DARK',
    level: 6,
    attack: 2000,
    defense: 1700,
    cardType: 'Effect Monster',
    description:
      'This card gains 300 ATK for every "Dark Magician" or "Magician of Black Chaos" in the GY.',
    rarity: 'Ultra Rare',
    archetype: 'Dark Magician',
    image: '/api/placeholder/200/290',
  },
  26412047: {
    id: 26412047,
    name: 'Summoned Skull',
    type: 'Monster',
    attribute: 'DARK',
    level: 6,
    attack: 2500,
    defense: 1200,
    cardType: 'Normal Monster',
    description:
      'A fiend with dark powers for confusing enemies. Among the Fiend-Type monsters, this monster boasts considerable force.',
    rarity: 'Rare',
    image: '/api/placeholder/200/290',
  },
  70781052: {
    id: 70781052,
    name: 'Cyber Dragon',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 5,
    attack: 2100,
    defense: 1600,
    cardType: 'Effect Monster',
    description:
      'If your opponent controls a monster and you control no monsters, you can Special Summon this card (from your hand).',
    rarity: 'Ultra Rare',
    archetype: 'Cyber',
    image: '/api/placeholder/200/290',
  },

  // More Support Cards
  72302403: {
    id: 72302403,
    name: 'Blue-Eyes White Dragon',
    type: 'Monster',
    attribute: 'LIGHT',
    level: 8,
    attack: 3000,
    defense: 2500,
    cardType: 'Normal Monster',
    description:
      'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.',
    rarity: 'Common',
    archetype: 'Blue-Eyes',
    image: '/api/placeholder/200/290',
  },
};

// Helper functions for card database
export const getCardById = id => {
  return yugiohCards[id] || null;
};

export const getCardByName = name => {
  return (
    Object.values(yugiohCards).find(
      card => card.name.toLowerCase() === name.toLowerCase(),
    ) || null
  );
};

export const getCardsByArchetype = archetype => {
  return Object.values(yugiohCards).filter(
    card =>
      card.archetype &&
      card.archetype.toLowerCase() === archetype.toLowerCase(),
  );
};

export const getCardsByType = type => {
  return Object.values(yugiohCards).filter(
    card => card.type.toLowerCase() === type.toLowerCase(),
  );
};

export const searchCards = query => {
  const searchTerm = query.toLowerCase();
  return Object.values(yugiohCards).filter(
    card =>
      card.name.toLowerCase().includes(searchTerm) ||
      card.description.toLowerCase().includes(searchTerm) ||
      (card.archetype && card.archetype.toLowerCase().includes(searchTerm)),
  );
};

// Sample deck lists compatible with Dueling Nexus format
export const sampleDecks = {
  blueEyes: {
    name: 'Blue-Eyes White Dragon Deck',
    author: 'DuelistKing',
    description: 'A powerful Blue-Eyes focused deck with support cards',
    format: 'TCG',
    mainDeck: [
      { cardId: 89631139, count: 3 }, // Blue-Eyes White Dragon
      { cardId: 38517737, count: 3 }, // Blue-Eyes Alternative White Dragon
      { cardId: 2347656, count: 2 }, // Mystical Space Typhoon
      { cardId: 44095762, count: 2 }, // Mirror Force
      { cardId: 24094653, count: 2 }, // Polymerization
    ],
    extraDeck: [
      { cardId: 23995346, count: 1 }, // Blue-Eyes Ultimate Dragon
    ],
    sideDeck: [],
  },
  elementalHero: {
    name: 'Elemental HERO Deck',
    author: 'HeroFan',
    description: 'Fusion-based HERO deck with multiple combinations',
    format: 'TCG',
    mainDeck: [
      { cardId: 20721928, count: 3 }, // Elemental HERO Sparkman
      { cardId: 21844576, count: 3 }, // Elemental HERO Avian
      { cardId: 79979666, count: 3 }, // Elemental HERO Burstinatrix
      { cardId: 24094653, count: 3 }, // Polymerization
      { cardId: 1845204, count: 2 }, // Instant Fusion
      { cardId: 2347656, count: 2 }, // Mystical Space Typhoon
    ],
    extraDeck: [
      { cardId: 35809262, count: 2 }, // Elemental HERO Flame Wingman
      { cardId: 58932615, count: 2 }, // Elemental HERO Thunder Giant
    ],
    sideDeck: [],
  },
};

export default yugiohCards;
