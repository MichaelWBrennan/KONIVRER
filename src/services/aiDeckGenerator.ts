/**
 * KONIVRER Deck Database - AI Deck Generator Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { AI_ARCHETYPES, AI_DIFFICULTY, AI_PERSONALITY } from './aiOpponent';

// Card interfaces
interface Card {
  id: string;
  name: string;
  cost: number;
  type: string;
  elements: string[];
  rarity: string;
  power?: number;
  health?: number;
  text?: string;
  keywords?: string[];
  effects?: CardEffect[];
  imageUrl?: string;
  flavorText?: string;
  artist?: string;
  set?: string;
  [key: string]: any;
}

interface CardEffect {
  type: string;
  value?: number | string;
  target?: string;
  condition?: string;
  [key: string]: any;
}

// Deck interfaces
interface Deck {
  id: string;
  name: string;
  cards: Card[];
  lands: Card[];
  sideboard: Card[];
  archetype: string;
  difficulty: string;
  personality: string;
  strategy: string;
  mainColors: string[];
  splashColors: string[];
  averageCost: number;
  creatureCount: number;
  spellCount: number;
  landCount: number;
  [key: string]: any;
}

// Card database (simplified for example)
const cardDatabase: Record<string, Card[]> = {
  fire: [],
  water: [],
  earth: [],
  air: [],
  void: [],
  multi: [],
  lands: []
};

// Initialize card database with sample cards
const initializeCardDatabase = (): void => {
  // Fire cards
  cardDatabase.fire = [
    {
      id: 'fire_1',
      name: 'Flame Elemental',
      cost: 3,
      type: 'familiar',
      elements: ['fire'],
      rarity: 'common',
      power: 3,
      health: 2,
      keywords: ['rush'],
      text: 'Rush (Can attack the turn it enters play)'
    },
    {
      id: 'fire_2',
      name: 'Inferno Blast',
      cost: 2,
      type: 'spell',
      elements: ['fire'],
      rarity: 'common',
      text: 'Deal 3 damage to target familiar or player'
    },
    // More fire cards would be defined here
  ];

  // Water cards
  cardDatabase.water = [
    {
      id: 'water_1',
      name: 'Tide Manipulator',
      cost: 2,
      type: 'familiar',
      elements: ['water'],
      rarity: 'common',
      power: 1,
      health: 3,
      text: 'When this enters play, draw a card'
    },
    {
      id: 'water_2',
      name: 'Counterspell',
      cost: 2,
      type: 'spell',
      elements: ['water'],
      rarity: 'uncommon',
      text: 'Counter target spell'
    },
    // More water cards would be defined here
  ];

  // Earth cards
  cardDatabase.earth = [
    {
      id: 'earth_1',
      name: 'Stone Guardian',
      cost: 4,
      type: 'familiar',
      elements: ['earth'],
      rarity: 'common',
      power: 2,
      health: 5,
      keywords: ['guard'],
      text: 'Guard (Opponents must attack this if able)'
    },
    {
      id: 'earth_2',
      name: 'Growth Spell',
      cost: 3,
      type: 'spell',
      elements: ['earth'],
      rarity: 'common',
      text: 'Target familiar gets +2/+2 until end of turn'
    },
    // More earth cards would be defined here
  ];

  // Air cards
  cardDatabase.air = [
    {
      id: 'air_1',
      name: 'Wind Sprite',
      cost: 1,
      type: 'familiar',
      elements: ['air'],
      rarity: 'common',
      power: 1,
      health: 1,
      keywords: ['evasion'],
      text: 'Evasion (This can\'t be blocked by familiars with power 2 or greater)'
    },
    {
      id: 'air_2',
      name: 'Gust of Wind',
      cost: 1,
      type: 'spell',
      elements: ['air'],
      rarity: 'common',
      text: 'Return target familiar to its owner\'s hand'
    },
    // More air cards would be defined here
  ];

  // Void cards
  cardDatabase.void = [
    {
      id: 'void_1',
      name: 'Shadow Lurker',
      cost: 2,
      type: 'familiar',
      elements: ['void'],
      rarity: 'uncommon',
      power: 2,
      health: 1,
      text: 'When this deals damage to a player, they discard a card'
    },
    {
      id: 'void_2',
      name: 'Soul Drain',
      cost: 3,
      type: 'spell',
      elements: ['void'],
      rarity: 'uncommon',
      text: 'Target player discards two cards'
    },
    // More void cards would be defined here
  ];

  // Multi-element cards
  cardDatabase.multi = [
    {
      id: 'multi_1',
      name: 'Elemental Fusion',
      cost: 4,
      type: 'familiar',
      elements: ['fire', 'water'],
      rarity: 'rare',
      power: 3,
      health: 3,
      text: 'When this enters play, deal 2 damage to target familiar and draw a card'
    },
    {
      id: 'multi_2',
      name: 'Nature\'s Wrath',
      cost: 5,
      type: 'spell',
      elements: ['earth', 'air'],
      rarity: 'rare',
      text: 'Put two 2/2 Elemental familiar tokens into play and they gain rush until end of turn'
    },
    // More multi-element cards would be defined here
  ];

  // Land cards
  cardDatabase.lands = [
    {
      id: 'land_1',
      name: 'Fire Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['fire'],
      rarity: 'common',
      text: 'Tap: Add one Fire Azoth to your pool'
    },
    {
      id: 'land_2',
      name: 'Water Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['water'],
      rarity: 'common',
      text: 'Tap: Add one Water Azoth to your pool'
    },
    {
      id: 'land_3',
      name: 'Earth Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['earth'],
      rarity: 'common',
      text: 'Tap: Add one Earth Azoth to your pool'
    },
    {
      id: 'land_4',
      name: 'Air Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['air'],
      rarity: 'common',
      text: 'Tap: Add one Air Azoth to your pool'
    },
    {
      id: 'land_5',
      name: 'Void Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['void'],
      rarity: 'common',
      text: 'Tap: Add one Void Azoth to your pool'
    },
    {
      id: 'land_6',
      name: 'Dual Azoth',
      cost: 0,
      type: 'azoth',
      elements: ['fire', 'water'],
      rarity: 'uncommon',
      text: 'Tap: Add one Fire or Water Azoth to your pool'
    },
    // More land cards would be defined here
  ];
};

// Initialize the card database
initializeCardDatabase();

/**
 * Get a name for the deck based on archetype and difficulty
 */
const getArchetypeName = (archetype: string, difficulty: string): string => {
  const archetypeNames: Record<string, string> = {
    [AI_ARCHETYPES.FIRE_AGGRO]: 'Blazing Assault',
    [AI_ARCHETYPES.WATER_CONTROL]: 'Tide Mastery',
    [AI_ARCHETYPES.EARTH_MIDRANGE]: 'Stone Bulwark',
    [AI_ARCHETYPES.AIR_TEMPO]: 'Swift Winds',
    [AI_ARCHETYPES.VOID_COMBO]: 'Shadow Convergence',
    [AI_ARCHETYPES.MULTI_COLOR]: 'Elemental Harmony'
  };

  const difficultyPrefix: Record<string, string> = {
    [AI_DIFFICULTY.EASY]: 'Novice',
    [AI_DIFFICULTY.MEDIUM]: 'Adept',
    [AI_DIFFICULTY.HARD]: 'Expert',
    [AI_DIFFICULTY.EXPERT]: 'Master'
  };

  const baseName = archetypeNames[archetype] || 'Unknown Deck';
  const prefix = difficultyPrefix[difficulty] || '';

  return `${prefix} ${baseName}`;
};

/**
 * Generate a Fire Aggro deck
 */
const generateFireAggroDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core fire aggro cards
  const fireCards = cardDatabase.fire.filter(card => 
    (card.type === 'familiar' && (card.power || 0) >= 2) || 
    (card.type === 'spell' && card.text?.includes('damage'))
  );
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 16 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 18 :
                       difficulty === AI_DIFFICULTY.HARD ? 20 : 22;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 6 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 8 :
                    difficulty === AI_DIFFICULTY.HARD ? 10 : 12;
  
  // Add creatures
  for (let i = 0; i < creatureCount; i++) {
    if (fireCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * fireCards.length);
      const card = fireCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add spells
  for (let i = 0; i < spellCount; i++) {
    if (fireCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * fireCards.length);
      const card = fireCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Adjust based on personality
  if (personality === AI_PERSONALITY.AGGRESSIVE) {
    // Add more aggressive cards
    const aggressiveCards = cardDatabase.fire.filter(card => 
      card.keywords?.includes('rush') || 
      (card.type === 'familiar' && (card.power || 0) > (card.health || 0))
    );
    
    for (let i = 0; i < 4; i++) {
      if (aggressiveCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * aggressiveCards.length);
        cards.push({ ...aggressiveCards[randomIndex] });
      }
    }
  } else if (personality === AI_PERSONALITY.DEFENSIVE) {
    // Add more defensive cards
    const defensiveCards = cardDatabase.fire.filter(card => 
      card.keywords?.includes('guard') || 
      (card.type === 'familiar' && (card.health || 0) > (card.power || 0))
    );
    
    for (let i = 0; i < 4; i++) {
      if (defensiveCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * defensiveCards.length);
        cards.push({ ...defensiveCards[randomIndex] });
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Water Control deck
 */
const generateWaterControlDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core water control cards
  const waterCards = cardDatabase.water.filter(card => 
    (card.type === 'spell' && card.text?.includes('counter')) || 
    (card.type === 'familiar' && card.text?.includes('draw'))
  );
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 12 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 14 :
                       difficulty === AI_DIFFICULTY.HARD ? 16 : 18;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 10 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 12 :
                    difficulty === AI_DIFFICULTY.HARD ? 14 : 16;
  
  // Add creatures
  for (let i = 0; i < creatureCount; i++) {
    if (waterCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * waterCards.length);
      const card = waterCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add spells
  for (let i = 0; i < spellCount; i++) {
    if (waterCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * waterCards.length);
      const card = waterCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Adjust based on personality
  if (personality === AI_PERSONALITY.CONTROL) {
    // Add more control cards
    const controlCards = cardDatabase.water.filter(card => 
      card.text?.includes('counter') || 
      card.text?.includes('return')
    );
    
    for (let i = 0; i < 4; i++) {
      if (controlCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * controlCards.length);
        cards.push({ ...controlCards[randomIndex] });
      }
    }
  } else if (personality === AI_PERSONALITY.COMBO) {
    // Add more combo-oriented cards
    const comboCards = cardDatabase.water.filter(card => 
      card.text?.includes('draw') || 
      card.text?.includes('search')
    );
    
    for (let i = 0; i < 4; i++) {
      if (comboCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * comboCards.length);
        cards.push({ ...comboCards[randomIndex] });
      }
    }
  }
  
  return cards;
};

/**
 * Generate an Earth Midrange deck
 */
const generateEarthMidrangeDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core earth midrange cards
  const earthCards = cardDatabase.earth.filter(card => 
    (card.type === 'familiar' && (card.health || 0) >= 3) || 
    (card.type === 'spell' && card.text?.includes('+'))
  );
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 14 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 16 :
                       difficulty === AI_DIFFICULTY.HARD ? 18 : 20;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 8 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 10 :
                    difficulty === AI_DIFFICULTY.HARD ? 12 : 14;
  
  // Add creatures
  for (let i = 0; i < creatureCount; i++) {
    if (earthCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * earthCards.length);
      const card = earthCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add spells
  for (let i = 0; i < spellCount; i++) {
    if (earthCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * earthCards.length);
      const card = earthCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Adjust based on personality
  if (personality === AI_PERSONALITY.DEFENSIVE) {
    // Add more defensive cards
    const defensiveCards = cardDatabase.earth.filter(card => 
      card.keywords?.includes('guard') || 
      (card.type === 'familiar' && (card.health || 0) >= 4)
    );
    
    for (let i = 0; i < 4; i++) {
      if (defensiveCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * defensiveCards.length);
        cards.push({ ...defensiveCards[randomIndex] });
      }
    }
  } else if (personality === AI_PERSONALITY.BALANCED) {
    // Add balanced mix of cards
    const balancedCards = cardDatabase.earth.filter(card => 
      (card.type === 'familiar' && (card.power || 0) === (card.health || 0)) || 
      card.text?.includes('token')
    );
    
    for (let i = 0; i < 4; i++) {
      if (balancedCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * balancedCards.length);
        cards.push({ ...balancedCards[randomIndex] });
      }
    }
  }
  
  return cards;
};

/**
 * Generate an Air Tempo deck
 */
const generateAirTempoDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core air tempo cards
  const airCards = cardDatabase.air.filter(card => 
    (card.type === 'familiar' && card.keywords?.includes('evasion')) || 
    (card.type === 'spell' && card.text?.includes('return'))
  );
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 16 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 18 :
                       difficulty === AI_DIFFICULTY.HARD ? 20 : 22;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 6 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 8 :
                    difficulty === AI_DIFFICULTY.HARD ? 10 : 12;
  
  // Add creatures
  for (let i = 0; i < creatureCount; i++) {
    if (airCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * airCards.length);
      const card = airCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add spells
  for (let i = 0; i < spellCount; i++) {
    if (airCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * airCards.length);
      const card = airCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Adjust based on personality
  if (personality === AI_PERSONALITY.AGGRESSIVE) {
    // Add more aggressive cards
    const aggressiveCards = cardDatabase.air.filter(card => 
      card.keywords?.includes('rush') || 
      (card.type === 'familiar' && (card.power || 0) >= 2)
    );
    
    for (let i = 0; i < 4; i++) {
      if (aggressiveCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * aggressiveCards.length);
        cards.push({ ...aggressiveCards[randomIndex] });
      }
    }
  } else if (personality === AI_PERSONALITY.CONTROL) {
    // Add more control cards
    const controlCards = cardDatabase.air.filter(card => 
      card.text?.includes('return') || 
      card.text?.includes('tap')
    );
    
    for (let i = 0; i < 4; i++) {
      if (controlCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * controlCards.length);
        cards.push({ ...controlCards[randomIndex] });
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Void Combo deck
 */
const generateVoidComboDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core void combo cards
  const voidCards = cardDatabase.void.filter(card => 
    (card.type === 'familiar' && card.text?.includes('discard')) || 
    (card.type === 'spell' && card.text?.includes('discard'))
  );
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 12 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 14 :
                       difficulty === AI_DIFFICULTY.HARD ? 16 : 18;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 10 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 12 :
                    difficulty === AI_DIFFICULTY.HARD ? 14 : 16;
  
  // Add creatures
  for (let i = 0; i < creatureCount; i++) {
    if (voidCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * voidCards.length);
      const card = voidCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add spells
  for (let i = 0; i < spellCount; i++) {
    if (voidCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * voidCards.length);
      const card = voidCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Adjust based on personality
  if (personality === AI_PERSONALITY.COMBO) {
    // Add more combo cards
    const comboCards = cardDatabase.void.filter(card => 
      card.text?.includes('search') || 
      card.text?.includes('graveyard')
    );
    
    for (let i = 0; i < 4; i++) {
      if (comboCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * comboCards.length);
        cards.push({ ...comboCards[randomIndex] });
      }
    }
  } else if (personality === AI_PERSONALITY.CONTROL) {
    // Add more control cards
    const controlCards = cardDatabase.void.filter(card => 
      card.text?.includes('discard') || 
      card.text?.includes('sacrifice')
    );
    
    for (let i = 0; i < 4; i++) {
      if (controlCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * controlCards.length);
        cards.push({ ...controlCards[randomIndex] });
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Multi-Color deck
 */
const generateMultiColorDeck = (difficulty: string, personality: string): Card[] => {
  const cards: Card[] = [];
  
  // Add core multi-color cards
  const multiCards = cardDatabase.multi;
  
  // Add creatures based on difficulty
  const creatureCount = difficulty === AI_DIFFICULTY.EASY ? 14 : 
                       difficulty === AI_DIFFICULTY.MEDIUM ? 16 :
                       difficulty === AI_DIFFICULTY.HARD ? 18 : 20;
  
  // Add spells based on difficulty
  const spellCount = difficulty === AI_DIFFICULTY.EASY ? 8 : 
                    difficulty === AI_DIFFICULTY.MEDIUM ? 10 :
                    difficulty === AI_DIFFICULTY.HARD ? 12 : 14;
  
  // Add multi-color creatures
  for (let i = 0; i < Math.floor(creatureCount / 2); i++) {
    if (multiCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * multiCards.length);
      const card = multiCards[randomIndex];
      if (card.type === 'familiar') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add multi-color spells
  for (let i = 0; i < Math.floor(spellCount / 2); i++) {
    if (multiCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * multiCards.length);
      const card = multiCards[randomIndex];
      if (card.type === 'spell') {
        cards.push({ ...card });
      }
    }
  }
  
  // Add some single-color cards from each element
  const elements = ['fire', 'water', 'earth', 'air', 'void'];
  
  elements.forEach(element => {
    const elementCards = cardDatabase[element as keyof typeof cardDatabase];
    
    // Add 2-3 creatures from each element
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      if (elementCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * elementCards.length);
        const card = elementCards[randomIndex];
        if (card.type === 'familiar') {
          cards.push({ ...card });
        }
      }
    }
    
    // Add 1-2 spells from each element
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      if (elementCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * elementCards.length);
        const card = elementCards[randomIndex];
        if (card.type === 'spell') {
          cards.push({ ...card });
        }
      }
    }
  });
  
  return cards;
};

/**
 * Generate lands for a deck
 */
const generateLands = (cards: Card[], difficulty: string): Card[] => {
  const lands: Card[] = [];
  
  // Count elements in the deck
  const elementCounts: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    void: 0
  };
  
  cards.forEach(card => {
    card.elements.forEach(element => {
      if (elementCounts[element] !== undefined) {
        elementCounts[element]++;
      }
    });
  });
  
  // Determine total land count based on difficulty
  const totalLandCount = difficulty === AI_DIFFICULTY.EASY ? 22 : 
                        difficulty === AI_DIFFICULTY.MEDIUM ? 24 :
                        difficulty === AI_DIFFICULTY.HARD ? 26 : 28;
  
  // Calculate land distribution based on element counts
  const totalElementCount = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
  const landDistribution: Record<string, number> = {};
  
  Object.keys(elementCounts).forEach(element => {
    const ratio = totalElementCount > 0 ? elementCounts[element] / totalElementCount : 0;
    landDistribution[element] = Math.max(1, Math.round(ratio * totalLandCount));
  });
  
  // Add lands based on distribution
  Object.keys(landDistribution).forEach(element => {
    const count = landDistribution[element];
    const elementLands = cardDatabase.lands.filter(land => 
      land.elements.includes(element) && land.elements.length === 1
    );
    
    for (let i = 0; i < count; i++) {
      if (elementLands.length > 0) {
        const randomIndex = Math.floor(Math.random() * elementLands.length);
        lands.push({ ...elementLands[randomIndex] });
      }
    }
  });
  
  // Add some dual lands for higher difficulties
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    const dualLands = cardDatabase.lands.filter(land => land.elements.length > 1);
    
    for (let i = 0; i < 4; i++) {
      if (dualLands.length > 0) {
        const randomIndex = Math.floor(Math.random() * dualLands.length);
        lands.push({ ...dualLands[randomIndex] });
      }
    }
  }
  
  return lands;
};

/**
 * Generate a sideboard for a deck
 */
const generateSideboard = (mainDeck: Card[], difficulty: string): Card[] => {
  const sideboard: Card[] = [];
  
  // Only generate sideboards for higher difficulties
  if (difficulty === AI_DIFFICULTY.EASY) {
    return sideboard;
  }
  
  // Count elements in the main deck
  const elementCounts: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    void: 0
  };
  
  mainDeck.forEach(card => {
    card.elements.forEach(element => {
      if (elementCounts[element] !== undefined) {
        elementCounts[element]++;
      }
    });
  });
  
  // Find primary elements
  const primaryElements = Object.keys(elementCounts)
    .filter(element => elementCounts[element] > 0)
    .sort((a, b) => elementCounts[b] - elementCounts[a])
    .slice(0, 2);
  
  // Add sideboard cards from primary elements
  primaryElements.forEach(element => {
    const elementCards = cardDatabase[element as keyof typeof cardDatabase];
    
    // Add cards that aren't in the main deck
    const uniqueCards = elementCards.filter(card => 
      !mainDeck.some(mainCard => mainCard.id === card.id)
    );
    
    // Add 3-5 cards from each primary element
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      if (uniqueCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * uniqueCards.length);
        sideboard.push({ ...uniqueCards[randomIndex] });
      }
    }
  });
  
  // Add some utility cards from other elements
  const otherElements = Object.keys(elementCounts)
    .filter(element => !primaryElements.includes(element));
  
  otherElements.forEach(element => {
    const elementCards = cardDatabase[element as keyof typeof cardDatabase];
    
    // Add 1-2 cards from each other element
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      if (elementCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * elementCards.length);
        sideboard.push({ ...elementCards[randomIndex] });
      }
    }
  });
  
  return sideboard.slice(0, 15); // Limit to 15 cards
};

/**
 * Calculate deck statistics
 */
const calculateDeckStats = (deck: Deck): Deck => {
  // Calculate average cost
  const nonLandCards = deck.cards.filter(card => card.type !== 'azoth');
  const totalCost = nonLandCards.reduce((sum, card) => sum + card.cost, 0);
  deck.averageCost = nonLandCards.length > 0 ? totalCost / nonLandCards.length : 0;
  
  // Count card types
  deck.creatureCount = deck.cards.filter(card => card.type === 'familiar').length;
  deck.spellCount = deck.cards.filter(card => card.type === 'spell').length;
  deck.landCount = deck.lands.length;
  
  // Determine main colors
  const elementCounts: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    void: 0
  };
  
  deck.cards.forEach(card => {
    card.elements.forEach(element => {
      if (elementCounts[element] !== undefined) {
        elementCounts[element]++;
      }
    });
  });
  
  // Main colors are the top 1-2 elements
  deck.mainColors = Object.keys(elementCounts)
    .filter(element => elementCounts[element] > 0)
    .sort((a, b) => elementCounts[b] - elementCounts[a])
    .slice(0, 2);
  
  // Splash colors are elements with fewer cards
  deck.splashColors = Object.keys(elementCounts)
    .filter(element => 
      elementCounts[element] > 0 && 
      !deck.mainColors.includes(element)
    );
  
  return deck;
};

/**
 * Generate an AI deck based on archetype, difficulty, and personality
 */
export const generateAIDeck = (
  archetype: string = AI_ARCHETYPES.BALANCED,
  difficulty: string = AI_DIFFICULTY.MEDIUM,
  personality: string = AI_PERSONALITY.BALANCED
): Deck => {
  // Base deck structure
  const deck: Deck = {
    id: `ai_${archetype}_${Date.now()}`,
    name: getArchetypeName(archetype, difficulty),
    cards: [],
    lands: [],
    sideboard: [],
    archetype,
    difficulty,
    personality,
    strategy: '',
    mainColors: [],
    splashColors: [],
    averageCost: 0,
    creatureCount: 0,
    spellCount: 0,
    landCount: 0
  };
  
  // Generate cards based on archetype
  switch (archetype) {
    case AI_ARCHETYPES.FIRE_AGGRO:
      deck.cards = generateFireAggroDeck(difficulty, personality);
      deck.strategy = 'Aggressive deck that aims to win quickly with direct damage and fast creatures';
      break;
    case AI_ARCHETYPES.WATER_CONTROL:
      deck.cards = generateWaterControlDeck(difficulty, personality);
      deck.strategy = 'Control deck that counters opponent\'s spells and draws cards for card advantage';
      break;
    case AI_ARCHETYPES.EARTH_MIDRANGE:
      deck.cards = generateEarthMidrangeDeck(difficulty, personality);
      deck.strategy = 'Midrange deck that plays efficient creatures and buffs them for value';
      break;
    case AI_ARCHETYPES.AIR_TEMPO:
      deck.cards = generateAirTempoDeck(difficulty, personality);
      deck.strategy = 'Tempo deck that plays evasive creatures and disrupts the opponent\'s game plan';
      break;
    case AI_ARCHETYPES.VOID_COMBO:
      deck.cards = generateVoidComboDeck(difficulty, personality);
      deck.strategy = 'Combo deck that disrupts the opponent\'s hand while setting up powerful combinations';
      break;
    case AI_ARCHETYPES.MULTI_COLOR:
      deck.cards = generateMultiColorDeck(difficulty, personality);
      deck.strategy = 'Flexible deck that uses cards from multiple elements for versatility';
      break;
    default:
      deck.cards = generateMultiColorDeck(difficulty, personality);
      deck.strategy = 'Balanced deck with a mix of creatures and spells';
  }
  
  // Generate lands
  deck.lands = generateLands(deck.cards, difficulty);
  
  // Generate sideboard
  deck.sideboard = generateSideboard(deck.cards, difficulty);
  
  // Calculate deck statistics
  return calculateDeckStats(deck);
};

/**
 * Generate multiple AI decks for a tournament
 */
export const generateAIDecksForTournament = (
  count: number,
  difficultyRange: string[] = [AI_DIFFICULTY.MEDIUM, AI_DIFFICULTY.HARD],
  personalityDistribution: Record<string, number> = {
    [AI_PERSONALITY.AGGRESSIVE]: 0.3,
    [AI_PERSONALITY.DEFENSIVE]: 0.2,
    [AI_PERSONALITY.BALANCED]: 0.2,
    [AI_PERSONALITY.CONTROL]: 0.2,
    [AI_PERSONALITY.COMBO]: 0.1
  }
): Deck[] => {
  const decks: Deck[] = [];
  
  // Generate decks
  for (let i = 0; i < count; i++) {
    // Randomly select archetype
    const archetypes = Object.values(AI_ARCHETYPES);
    const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];
    
    // Randomly select difficulty from range
    const difficulty = difficultyRange[Math.floor(Math.random() * difficultyRange.length)];
    
    // Select personality based on distribution
    const personalities = Object.keys(personalityDistribution);
    const personalityRandom = Math.random();
    let cumulativeProbability = 0;
    let personality = AI_PERSONALITY.BALANCED;
    
    for (const p of personalities) {
      cumulativeProbability += personalityDistribution[p];
      if (personalityRandom <= cumulativeProbability) {
        personality = p;
        break;
      }
    }
    
    // Generate deck
    const deck = generateAIDeck(archetype, difficulty, personality);
    decks.push(deck);
  }
  
  return decks;
};

/**
 * Adjust AI deck based on match history and meta
 */
export const adjustAIDeck = (
  deck: Deck,
  matchHistory: any[],
  meta: any
): Deck => {
  // Clone the deck to avoid modifying the original
  const adjustedDeck: Deck = JSON.parse(JSON.stringify(deck));
  
  // Analyze match history to find weaknesses
  const losses = matchHistory.filter(match => match.result === 'loss');
  
  if (losses.length === 0) {
    // No losses, no need to adjust
    return adjustedDeck;
  }
  
  // Count elements that caused losses
  const elementLosses: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    void: 0
  };
  
  losses.forEach(match => {
    match.opponentDeck.mainColors.forEach((element: string) => {
      if (elementLosses[element] !== undefined) {
        elementLosses[element]++;
      }
    });
  });
  
  // Find the element that caused the most losses
  const worstMatchup = Object.keys(elementLosses)
    .sort((a, b) => elementLosses[b] - elementLosses[a])[0];
  
  // Add cards that are good against the worst matchup
  const counterCards: Record<string, string[]> = {
    fire: ['water', 'earth'],
    water: ['earth', 'void'],
    earth: ['air', 'fire'],
    air: ['fire', 'void'],
    void: ['water', 'air']
  };
  
  const counterElements = counterCards[worstMatchup] || [];
  
  // Add 3-5 cards that counter the worst matchup
  for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
    if (counterElements.length > 0) {
      const element = counterElements[Math.floor(Math.random() * counterElements.length)];
      const elementCards = cardDatabase[element as keyof typeof cardDatabase];
      
      if (elementCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * elementCards.length);
        const card = elementCards[randomIndex];
        
        // Replace a random card of the same type
        const sameTypeCards = adjustedDeck.cards.filter(c => c.type === card.type);
        if (sameTypeCards.length > 0) {
          const replaceIndex = adjustedDeck.cards.indexOf(
            sameTypeCards[Math.floor(Math.random() * sameTypeCards.length)]
          );
          adjustedDeck.cards[replaceIndex] = { ...card };
        } else {
          // If no cards of the same type, just add it
          adjustedDeck.cards.push({ ...card });
        }
      }
    }
  }
  
  // Adjust lands to match the new card distribution
  adjustedDeck.lands = generateLands(adjustedDeck.cards, deck.difficulty);
  
  // Recalculate deck statistics
  return calculateDeckStats(adjustedDeck);
};

export default {
  generateAIDeck,
  generateAIDecksForTournament,
  adjustAIDeck
};