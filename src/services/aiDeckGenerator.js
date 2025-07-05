/**
 * KONIVRER Deck Database - AI Deck Generator Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { AI_ARCHETYPES, AI_DIFFICULTY, AI_PERSONALITY } from './aiOpponent';

/**
 * Generate an AI deck based on archetype, difficulty, and personality
 * @param {String} archetype - Deck archetype
 * @param {String} difficulty - AI difficulty level
 * @param {String} personality - AI personality type
 * @returns {Object} - Generated deck
 */
export const generateAIDeck = (
  archetype = AI_ARCHETYPES.BALANCED,
  difficulty = AI_DIFFICULTY.MEDIUM,
  personality = AI_PERSONALITY.BALANCED
) => {
  // Base deck structure
  const deck = {
    id: `ai_${archetype}_${Date.now()}`,
    name: getArchetypeName(archetype, difficulty),
    cards: [],
    lands: [],
    sideboard: []
  };
  
  // Generate cards based on archetype
  switch (archetype) {
    case AI_ARCHETYPES.FIRE_AGGRO:
      deck.cards = generateFireAggroDeck(difficulty);
      break;
    case AI_ARCHETYPES.WATER_CONTROL:
      deck.cards = generateWaterControlDeck(difficulty);
      break;
    case AI_ARCHETYPES.EARTH_MIDRANGE:
      deck.cards = generateEarthMidrangeDeck(difficulty);
      break;
    case AI_ARCHETYPES.AIR_TEMPO:
      deck.cards = generateAirTempoDeck(difficulty);
      break;
    case AI_ARCHETYPES.VOID_COMBO:
      deck.cards = generateVoidComboDeck(difficulty);
      break;
    case AI_ARCHETYPES.MULTI_COLOR:
      deck.cards = generateMultiColorDeck(difficulty);
      break;
    default:
      deck.cards = generateBalancedDeck(difficulty);
  }
  
  // Adjust deck based on personality
  adjustDeckForPersonality(deck, personality);
  
  // Generate lands
  deck.lands = generateLands(deck.cards, archetype);
  
  // Generate sideboard if needed
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    deck.sideboard = generateSideboard(deck.cards, archetype, difficulty);
  }
  
  return deck;
};

/**
 * Get a name for the AI deck based on archetype and difficulty
 * @param {String} archetype - Deck archetype
 * @param {String} difficulty - AI difficulty level
 * @returns {String} - Deck name
 */
const getArchetypeName = (archetype, difficulty) => {
  const archetypeNames = {
    [AI_ARCHETYPES.FIRE_AGGRO]: 'Blazing Assault',
    [AI_ARCHETYPES.WATER_CONTROL]: 'Tidal Dominance',
    [AI_ARCHETYPES.EARTH_MIDRANGE]: 'Terra Firma',
    [AI_ARCHETYPES.AIR_TEMPO]: 'Windswept Tactics',
    [AI_ARCHETYPES.VOID_COMBO]: 'Void Convergence',
    [AI_ARCHETYPES.MULTI_COLOR]: 'Elemental Harmony'
  };
  
  const difficultyPrefix = {
    [AI_DIFFICULTY.EASY]: 'Novice',
    [AI_DIFFICULTY.MEDIUM]: 'Adept',
    [AI_DIFFICULTY.HARD]: 'Expert',
    [AI_DIFFICULTY.EXPERT]: 'Master'
  };
  
  const baseName = archetypeNames[archetype] || 'Balanced Strategy';
  const prefix = difficultyPrefix[difficulty] || 'Standard';
  
  return `${prefix} ${baseName}`;
};

/**
 * Generate a Fire Aggro deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateFireAggroDeck = (difficulty) => {
  // This would normally pull from a card database
  // For now, we'll create mock cards
  
  const cards = [];
  
  // Add creatures
  for (let i = 0; i < 24; i++) {
    cards.push({
      id: `fire_creature_${i}`,
      name: getRandomFireCreatureName(),
      type: 'Creature',
      cost: { fire: Math.min(Math.floor(i/8) + 1, 3) },
      power: Math.min(Math.floor(i/6) + 2, 5),
      toughness: Math.min(Math.floor(i/8) + 1, 3),
      text: getRandomFireAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add spells
  for (let i = 0; i < 12; i++) {
    cards.push({
      id: `fire_spell_${i}`,
      name: getRandomFireSpellName(),
      type: i % 3 === 0 ? 'Instant' : 'Sorcery',
      cost: { fire: Math.min(Math.floor(i/4) + 1, 4) },
      text: getRandomFireSpellText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].type === 'Creature') {
        cards[index].power += 1;
      } else {
        // Improve spell text
        cards[index].text = cards[index].text.replace('2 damage', '3 damage');
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Water Control deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateWaterControlDeck = (difficulty) => {
  const cards = [];
  
  // Add creatures
  for (let i = 0; i < 16; i++) {
    cards.push({
      id: `water_creature_${i}`,
      name: getRandomWaterCreatureName(),
      type: 'Creature',
      cost: { water: Math.min(Math.floor(i/5) + 1, 4) },
      power: Math.min(Math.floor(i/8) + 1, 3),
      toughness: Math.min(Math.floor(i/6) + 2, 5),
      text: getRandomWaterAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add counterspells
  for (let i = 0; i < 12; i++) {
    cards.push({
      id: `water_counter_${i}`,
      name: getRandomCounterspellName(),
      type: 'Instant',
      cost: { water: Math.min(Math.floor(i/4) + 1, 4) },
      text: getRandomCounterspellText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add card draw
  for (let i = 0; i < 8; i++) {
    cards.push({
      id: `water_draw_${i}`,
      name: getRandomCardDrawName(),
      type: i % 3 === 0 ? 'Instant' : 'Sorcery',
      cost: { water: Math.min(Math.floor(i/3) + 1, 5) },
      text: getRandomCardDrawText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].type === 'Creature') {
        cards[index].toughness += 1;
      } else if (cards[index].text.includes('counter')) {
        // Improve counterspell
        cards[index].text = cards[index].text.replace('counter target spell', 'counter target spell. Draw a card');
      } else if (cards[index].text.includes('draw')) {
        // Improve card draw
        cards[index].text = cards[index].text.replace('Draw a card', 'Draw two cards');
      }
    }
  }
  
  return cards;
};

/**
 * Generate an Earth Midrange deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateEarthMidrangeDeck = (difficulty) => {
  const cards = [];
  
  // Add creatures
  for (let i = 0; i < 22; i++) {
    cards.push({
      id: `earth_creature_${i}`,
      name: getRandomEarthCreatureName(),
      type: 'Creature',
      cost: { earth: Math.min(Math.floor(i/6) + 1, 5) },
      power: Math.min(Math.floor(i/7) + 2, 4),
      toughness: Math.min(Math.floor(i/5) + 2, 6),
      text: getRandomEarthAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add ramp spells
  for (let i = 0; i < 8; i++) {
    cards.push({
      id: `earth_ramp_${i}`,
      name: getRandomRampSpellName(),
      type: 'Sorcery',
      cost: { earth: Math.min(Math.floor(i/4) + 1, 3) },
      text: getRandomRampSpellText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add utility spells
  for (let i = 0; i < 6; i++) {
    cards.push({
      id: `earth_utility_${i}`,
      name: getRandomEarthUtilityName(),
      type: i % 2 === 0 ? 'Instant' : 'Sorcery',
      cost: { earth: Math.min(Math.floor(i/3) + 1, 4) },
      text: getRandomEarthUtilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].type === 'Creature') {
        cards[index].power += 1;
        cards[index].toughness += 1;
      } else if (cards[index].text.includes('search')) {
        // Improve ramp
        cards[index].text = cards[index].text.replace('search for a basic land', 'search for two basic lands');
      }
    }
  }
  
  return cards;
};

/**
 * Generate an Air Tempo deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateAirTempoDeck = (difficulty) => {
  const cards = [];
  
  // Add creatures
  for (let i = 0; i < 20; i++) {
    cards.push({
      id: `air_creature_${i}`,
      name: getRandomAirCreatureName(),
      type: 'Creature',
      cost: { air: Math.min(Math.floor(i/7) + 1, 4) },
      power: Math.min(Math.floor(i/6) + 1, 3),
      toughness: Math.min(Math.floor(i/8) + 1, 3),
      text: getRandomAirAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add bounce spells
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: `air_bounce_${i}`,
      name: getRandomBounceSpellName(),
      type: 'Instant',
      cost: { air: Math.min(Math.floor(i/5) + 1, 3) },
      text: getRandomBounceSpellText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add utility spells
  for (let i = 0; i < 6; i++) {
    cards.push({
      id: `air_utility_${i}`,
      name: getRandomAirUtilityName(),
      type: i % 2 === 0 ? 'Instant' : 'Sorcery',
      cost: { air: Math.min(Math.floor(i/3) + 1, 4) },
      text: getRandomAirUtilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].type === 'Creature') {
        // Add flying
        if (!cards[index].text.includes('Flying')) {
          cards[index].text = 'Flying. ' + cards[index].text;
        }
      } else if (cards[index].text.includes('return')) {
        // Improve bounce
        cards[index].text = cards[index].text.replace('return target creature', 'return up to two target creatures');
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Void Combo deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateVoidComboDeck = (difficulty) => {
  const cards = [];
  
  // Add creatures
  for (let i = 0; i < 16; i++) {
    cards.push({
      id: `void_creature_${i}`,
      name: getRandomVoidCreatureName(),
      type: 'Creature',
      cost: { void: Math.min(Math.floor(i/6) + 1, 4) },
      power: Math.min(Math.floor(i/7) + 1, 3),
      toughness: Math.min(Math.floor(i/7) + 1, 3),
      text: getRandomVoidAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add combo pieces
  for (let i = 0; i < 12; i++) {
    cards.push({
      id: `void_combo_${i}`,
      name: getRandomVoidComboName(),
      type: i % 3 === 0 ? 'Creature' : (i % 3 === 1 ? 'Enchantment' : 'Artifact'),
      cost: { void: Math.min(Math.floor(i/4) + 1, 5) },
      text: getRandomVoidComboText(),
      image: '/api/placeholder/200/280'
    });
    
    // Add power/toughness for creatures
    if (i % 3 === 0) {
      cards[cards.length - 1].power = Math.min(Math.floor(i/6) + 1, 3);
      cards[cards.length - 1].toughness = Math.min(Math.floor(i/6) + 1, 3);
    }
  }
  
  // Add utility spells
  for (let i = 0; i < 8; i++) {
    cards.push({
      id: `void_utility_${i}`,
      name: getRandomVoidUtilityName(),
      type: i % 2 === 0 ? 'Instant' : 'Sorcery',
      cost: { void: Math.min(Math.floor(i/3) + 1, 4) },
      text: getRandomVoidUtilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].text.includes('sacrifice')) {
        // Improve sacrifice effects
        cards[index].text = cards[index].text.replace('sacrifice a creature', 'sacrifice a creature: draw a card');
      } else if (cards[index].text.includes('search')) {
        // Improve tutoring
        cards[index].text = cards[index].text.replace('search your library', 'search your library for any card');
      }
    }
  }
  
  return cards;
};

/**
 * Generate a Multi-Color deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateMultiColorDeck = (difficulty) => {
  const cards = [];
  
  // Add multi-color creatures
  for (let i = 0; i < 20; i++) {
    const element1 = getRandomElement();
    let element2 = getRandomElement();
    while (element2 === element1) {
      element2 = getRandomElement();
    }
    
    const cost = {};
    cost[element1] = Math.min(Math.floor(i/10) + 1, 2);
    cost[element2] = Math.min(Math.floor(i/10) + 1, 2);
    
    cards.push({
      id: `multi_creature_${i}`,
      name: getRandomMultiCreatureName(),
      type: 'Creature',
      cost: cost,
      power: Math.min(Math.floor(i/6) + 2, 4),
      toughness: Math.min(Math.floor(i/6) + 2, 4),
      text: getRandomMultiAbilityText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Add multi-color spells
  for (let i = 0; i < 16; i++) {
    const element1 = getRandomElement();
    let element2 = getRandomElement();
    while (element2 === element1) {
      element2 = getRandomElement();
    }
    
    const cost = {};
    cost[element1] = Math.min(Math.floor(i/8) + 1, 2);
    cost[element2] = Math.min(Math.floor(i/8) + 1, 2);
    
    cards.push({
      id: `multi_spell_${i}`,
      name: getRandomMultiSpellName(),
      type: i % 3 === 0 ? 'Instant' : 'Sorcery',
      cost: cost,
      text: getRandomMultiSpellText(),
      image: '/api/placeholder/200/280'
    });
  }
  
  // Adjust based on difficulty
  if (difficulty === AI_DIFFICULTY.HARD || difficulty === AI_DIFFICULTY.EXPERT) {
    // Replace some cards with better versions
    for (let i = 0; i < 8; i++) {
      const index = Math.floor(Math.random() * cards.length);
      if (cards[index].type === 'Creature') {
        cards[index].power += 1;
        cards[index].toughness += 1;
      } else {
        // Improve spell effects
        cards[index].text = cards[index].text.replace('target creature', 'up to two target creatures');
      }
    }
  }
  
  return cards;
};

/**
 * Generate a balanced deck
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Deck cards
 */
const generateBalancedDeck = (difficulty) => {
  const cards = [];
  
  // Add a mix of cards from different elements
  const fireCards = generateFireAggroDeck(difficulty).slice(0, 8);
  const waterCards = generateWaterControlDeck(difficulty).slice(0, 8);
  const earthCards = generateEarthMidrangeDeck(difficulty).slice(0, 8);
  const airCards = generateAirTempoDeck(difficulty).slice(0, 8);
  const voidCards = generateVoidComboDeck(difficulty).slice(0, 4);
  
  cards.push(...fireCards, ...waterCards, ...earthCards, ...airCards, ...voidCards);
  
  return cards;
};

/**
 * Adjust deck based on AI personality
 * @param {Object} deck - Deck to adjust
 * @param {String} personality - AI personality type
 */
const adjustDeckForPersonality = (deck, personality) => {
  switch (personality) {
    case AI_PERSONALITY.AGGRESSIVE:
      // Add more low-cost creatures and direct damage
      deck.cards = deck.cards.filter(card => 
        !(card.type === 'Creature' && getTotalCost(card) > 4)
      );
      
      // Add some aggressive replacements
      for (let i = 0; i < 6; i++) {
        deck.cards.push({
          id: `aggro_creature_${i}`,
          name: getRandomFireCreatureName(),
          type: 'Creature',
          cost: { fire: 1 },
          power: 2,
          toughness: 1,
          text: 'Haste',
          image: '/api/placeholder/200/280'
        });
      }
      break;
      
    case AI_PERSONALITY.DEFENSIVE:
      // Add more high-toughness creatures and defensive spells
      deck.cards = deck.cards.filter(card => 
        !(card.type === 'Creature' && card.power > card.toughness + 1)
      );
      
      // Add some defensive replacements
      for (let i = 0; i < 6; i++) {
        deck.cards.push({
          id: `defensive_creature_${i}`,
          name: getRandomEarthCreatureName(),
          type: 'Creature',
          cost: { earth: 2 },
          power: 1,
          toughness: 4,
          text: 'Defender',
          image: '/api/placeholder/200/280'
        });
      }
      break;
      
    case AI_PERSONALITY.CONTROL:
      // Add more counterspells and removal
      deck.cards = deck.cards.filter(card => 
        !(card.type === 'Creature' && getTotalCost(card) < 3)
      );
      
      // Add some control replacements
      for (let i = 0; i < 6; i++) {
        deck.cards.push({
          id: `control_spell_${i}`,
          name: getRandomCounterspellName(),
          type: 'Instant',
          cost: { water: 2 },
          text: 'Counter target spell.',
          image: '/api/placeholder/200/280'
        });
      }
      break;
      
    case AI_PERSONALITY.COMBO:
      // Add more card draw and combo pieces
      deck.cards = deck.cards.filter(card => 
        !(card.type === 'Creature' && !card.text.includes('draw') && !card.text.includes('search'))
      );
      
      // Add some combo replacements
      for (let i = 0; i < 6; i++) {
        deck.cards.push({
          id: `combo_piece_${i}`,
          name: getRandomVoidComboName(),
          type: i % 2 === 0 ? 'Creature' : 'Enchantment',
          cost: { void: 2 },
          text: 'Whenever you cast a spell, draw a card.',
          image: '/api/placeholder/200/280'
        });
        
        // Add power/toughness for creatures
        if (i % 2 === 0) {
          deck.cards[deck.cards.length - 1].power = 1;
          deck.cards[deck.cards.length - 1].toughness = 2;
        }
      }
      break;
  }
  
  // Ensure deck has exactly 36 cards (24 will be added as lands)
  while (deck.cards.length > 36) {
    const randomIndex = Math.floor(Math.random() * deck.cards.length);
    deck.cards.splice(randomIndex, 1);
  }
  
  while (deck.cards.length < 36) {
    // Add generic cards based on personality
    deck.cards.push(generateGenericCard(personality));
  }
};

/**
 * Generate lands for a deck
 * @param {Array} cards - Deck cards
 * @param {String} archetype - Deck archetype
 * @returns {Array} - Land cards
 */
const generateLands = (cards, archetype) => {
  const lands = [];
  const elementCounts = countElementsInDeck(cards);
  const totalElements = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
  
  // Calculate land distribution
  const landDistribution = {};
  for (const [element, count] of Object.entries(elementCounts)) {
    landDistribution[element] = Math.round((count / totalElements) * 24);
  }
  
  // Ensure we have exactly 24 lands
  let totalLands = Object.values(landDistribution).reduce((sum, count) => sum + count, 0);
  
  // Adjust if needed
  while (totalLands < 24) {
    // Add to the most used element
    const mostUsedElement = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    landDistribution[mostUsedElement]++;
    totalLands++;
  }
  
  while (totalLands > 24) {
    // Remove from the least used element
    const leastUsedElement = Object.entries(elementCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => a[1] - b[1])[0][0];
    landDistribution[leastUsedElement]--;
    totalLands--;
  }
  
  // Create land cards
  for (const [element, count] of Object.entries(landDistribution)) {
    for (let i = 0; i < count; i++) {
      lands.push({
        id: `${element}_land_${i}`,
        name: `${capitalizeFirstLetter(element)} Source`,
        type: 'Land',
        text: `Tap: Add one ${element} mana to your mana pool.`,
        image: '/api/placeholder/200/280'
      });
    }
  }
  
  return lands;
};

/**
 * Generate a sideboard for a deck
 * @param {Array} mainDeck - Main deck cards
 * @param {String} archetype - Deck archetype
 * @param {String} difficulty - AI difficulty level
 * @returns {Array} - Sideboard cards
 */
const generateSideboard = (mainDeck, archetype, difficulty) => {
  // This would be more complex in a real implementation
  // For now, just generate 15 generic cards
  const sideboard = [];
  
  for (let i = 0; i < 15; i++) {
    sideboard.push(generateGenericCard(AI_PERSONALITY.BALANCED));
  }
  
  return sideboard;
};

/**
 * Generate a generic card based on personality
 * @param {String} personality - AI personality type
 * @returns {Object} - Generated card
 */
const generateGenericCard = (personality) => {
  switch (personality) {
    case AI_PERSONALITY.AGGRESSIVE:
      return {
        id: `generic_aggro_${Date.now()}_${Math.random()}`,
        name: getRandomFireCreatureName(),
        type: 'Creature',
        cost: { fire: 2 },
        power: 3,
        toughness: 1,
        text: 'Haste',
        image: '/api/placeholder/200/280'
      };
      
    case AI_PERSONALITY.DEFENSIVE:
      return {
        id: `generic_defense_${Date.now()}_${Math.random()}`,
        name: getRandomEarthCreatureName(),
        type: 'Creature',
        cost: { earth: 2 },
        power: 1,
        toughness: 4,
        text: 'Defender',
        image: '/api/placeholder/200/280'
      };
      
    case AI_PERSONALITY.CONTROL:
      return {
        id: `generic_control_${Date.now()}_${Math.random()}`,
        name: getRandomCounterspellName(),
        type: 'Instant',
        cost: { water: 2 },
        text: 'Counter target spell.',
        image: '/api/placeholder/200/280'
      };
      
    case AI_PERSONALITY.COMBO:
      return {
        id: `generic_combo_${Date.now()}_${Math.random()}`,
        name: getRandomCardDrawName(),
        type: 'Sorcery',
        cost: { void: 2 },
        text: 'Draw two cards.',
        image: '/api/placeholder/200/280'
      };
      
    default:
      return {
        id: `generic_balanced_${Date.now()}_${Math.random()}`,
        name: getRandomMultiCreatureName(),
        type: 'Creature',
        cost: { [getRandomElement()]: 2 },
        power: 2,
        toughness: 2,
        text: 'When this creature enters the battlefield, draw a card.',
        image: '/api/placeholder/200/280'
      };
  }
};

/**
 * Count the elements used in a deck
 * @param {Array} cards - Deck cards
 * @returns {Object} - Element counts
 */
const countElementsInDeck = (cards) => {
  const elementCounts = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    void: 0
  };
  
  cards.forEach(card => {
    if (card.cost) {
      for (const [element, count] of Object.entries(card.cost)) {
        if (elementCounts[element] !== undefined) {
          elementCounts[element] += count;
        }
      }
    }
  });
  
  return elementCounts;
};

/**
 * Get total mana cost of a card
 * @param {Object} card - Card to evaluate
 * @returns {Number} - Total mana cost
 */
const getTotalCost = (card) => {
  if (!card.cost) return 0;
  
  return Object.values(card.cost).reduce((sum, count) => sum + count, 0);
};

/**
 * Get a random element
 * @returns {String} - Random element
 */
const getRandomElement = () => {
  const elements = ['fire', 'water', 'earth', 'air', 'void'];
  return elements[Math.floor(Math.random() * elements.length)];
};

/**
 * Capitalize the first letter of a string
 * @param {String} string - String to capitalize
 * @returns {String} - Capitalized string
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Random name generators for cards
const getRandomFireCreatureName = () => {
  const prefixes = ['Blazing', 'Fiery', 'Burning', 'Molten', 'Inferno', 'Ember', 'Flame', 'Volcanic'];
  const suffixes = ['Elemental', 'Warrior', 'Mage', 'Dragon', 'Phoenix', 'Berserker', 'Shaman', 'Knight'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomFireSpellName = () => {
  const prefixes = ['Searing', 'Blazing', 'Fiery', 'Burning', 'Molten', 'Inferno', 'Volcanic'];
  const suffixes = ['Blast', 'Strike', 'Bolt', 'Wave', 'Eruption', 'Surge', 'Barrage', 'Fury'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomWaterCreatureName = () => {
  const prefixes = ['Tidal', 'Aquatic', 'Oceanic', 'Abyssal', 'Coral', 'Wave', 'Frost', 'Deep'];
  const suffixes = ['Elemental', 'Mage', 'Serpent', 'Leviathan', 'Merfolk', 'Guardian', 'Kraken', 'Hydra'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomCounterspellName = () => {
  const prefixes = ['Mystic', 'Arcane', 'Cryptic', 'Sudden', 'Forceful', 'Mental', 'Psychic', 'Thought'];
  const suffixes = ['Denial', 'Negation', 'Counterspell', 'Dissipation', 'Nullification', 'Rejection', 'Cancellation', 'Veto'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomCardDrawName = () => {
  const prefixes = ['Deep', 'Careful', 'Thoughtful', 'Insightful', 'Profound', 'Ancestral', 'Mystical', 'Arcane'];
  const suffixes = ['Insight', 'Study', 'Meditation', 'Contemplation', 'Analysis', 'Divination', 'Revelation', 'Epiphany'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomEarthCreatureName = () => {
  const prefixes = ['Ancient', 'Verdant', 'Primal', 'Towering', 'Massive', 'Colossal', 'Primordial', 'Titanic'];
  const suffixes = ['Elemental', 'Wurm', 'Beast', 'Treefolk', 'Golem', 'Guardian', 'Behemoth', 'Colossus'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomRampSpellName = () => {
  const prefixes = ['Natural', 'Wild', 'Primal', 'Verdant', 'Fertile', 'Abundant', 'Lush', 'Thriving'];
  const suffixes = ['Growth', 'Cultivation', 'Abundance', 'Flourishing', 'Renewal', 'Expansion', 'Enrichment', 'Vitality'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomEarthUtilityName = () => {
  const prefixes = ['Natural', 'Primal', 'Verdant', 'Wild', 'Earthen', 'Sylvan', 'Gaea\'s', 'Titanic'];
  const suffixes = ['Might', 'Vigor', 'Blessing', 'Strength', 'Resilience', 'Endurance', 'Fortitude', 'Resolve'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomAirCreatureName = () => {
  const prefixes = ['Windswept', 'Aerial', 'Soaring', 'Nimble', 'Swift', 'Zephyr', 'Tempest', 'Cyclonic'];
  const suffixes = ['Elemental', 'Djinn', 'Sphinx', 'Eagle', 'Falcon', 'Sprite', 'Harpy', 'Drake'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomBounceSpellName = () => {
  const prefixes = ['Sudden', 'Swift', 'Temporal', 'Ethereal', 'Fleeting', 'Momentary', 'Transient', 'Ephemeral'];
  const suffixes = ['Displacement', 'Banishment', 'Expulsion', 'Repulsion', 'Rejection', 'Departure', 'Retreat', 'Dismissal'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomAirUtilityName = () => {
  const prefixes = ['Windswept', 'Aerial', 'Swift', 'Nimble', 'Zephyr\'s', 'Tempest', 'Cyclonic', 'Gust'];
  const suffixes = ['Tactics', 'Maneuver', 'Stratagem', 'Approach', 'Method', 'Technique', 'Ploy', 'Gambit'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomVoidCreatureName = () => {
  const prefixes = ['Void', 'Shadow', 'Spectral', 'Ethereal', 'Phantom', 'Umbral', 'Abyssal', 'Nether'];
  const suffixes = ['Elemental', 'Wraith', 'Specter', 'Shade', 'Revenant', 'Apparition', 'Phantom', 'Entity'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomVoidComboName = () => {
  const prefixes = ['Void', 'Dark', 'Forbidden', 'Unholy', 'Sinister', 'Malevolent', 'Nefarious', 'Eldritch'];
  const suffixes = ['Pact', 'Ritual', 'Covenant', 'Bargain', 'Contract', 'Communion', 'Convergence', 'Synthesis'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomVoidUtilityName = () => {
  const prefixes = ['Void', 'Dark', 'Shadow', 'Nether', 'Umbral', 'Abyssal', 'Eldritch', 'Occult'];
  const suffixes = ['Manipulation', 'Exploitation', 'Utilization', 'Machination', 'Calculation', 'Operation', 'Orchestration', 'Manifestation'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomMultiCreatureName = () => {
  const prefixes = ['Elemental', 'Prismatic', 'Chromatic', 'Iridescent', 'Kaleidoscopic', 'Convergent', 'Harmonic', 'Synergistic'];
  const suffixes = ['Avatar', 'Archon', 'Sovereign', 'Paragon', 'Champion', 'Harbinger', 'Exemplar', 'Incarnation'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

const getRandomMultiSpellName = () => {
  const prefixes = ['Elemental', 'Prismatic', 'Chromatic', 'Convergent', 'Harmonic', 'Synergistic', 'Unified', 'Coalescent'];
  const suffixes = ['Confluence', 'Fusion', 'Synthesis', 'Convergence', 'Harmony', 'Synergy', 'Unity', 'Coalescence'];
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

// Random ability text generators
const getRandomFireAbilityText = () => {
  const abilities = [
    'When this creature enters the battlefield, it deals 1 damage to target creature or player.',
    'Whenever this creature attacks, it deals 1 damage to target creature or player.',
    'Sacrifice this creature: It deals 2 damage to target creature or player.',
    'Haste',
    'First Strike',
    'When this creature dies, it deals 2 damage to target creature or player.',
    'Whenever you cast a fire spell, this creature gets +1/+0 until end of turn.',
    'Whenever this creature deals combat damage to a player, it deals 1 damage to each creature that player controls.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomFireSpellText = () => {
  const spellTexts = [
    'Deal 3 damage to target creature or player.',
    'Deal 2 damage to each creature your opponents control.',
    'Deal 4 damage to target creature.',
    'Deal 1 damage to each creature. Creatures dealt damage this way can\'t block this turn.',
    'Target creature gets +2/+0 and gains first strike until end of turn.',
    'Creatures you control get +1/+0 until end of turn.',
    'Destroy target artifact.',
    'Deal 2 damage to target creature. If that creature would die this turn, exile it instead.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomWaterAbilityText = () => {
  const abilities = [
    'When this creature enters the battlefield, draw a card.',
    'Whenever you cast a water spell, you may tap or untap target creature.',
    'Tap: Draw a card, then discard a card.',
    'This creature can\'t be blocked.',
    'When this creature enters the battlefield, return target creature to its owner\'s hand.',
    'Whenever this creature deals combat damage to a player, you may draw a card.',
    'This creature gets +1/+1 as long as you control a water source.',
    'When this creature dies, draw a card.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomCounterspellText = () => {
  const spellTexts = [
    'Counter target spell.',
    'Counter target creature spell.',
    'Counter target non-creature spell.',
    'Counter target spell unless its controller pays 2 mana.',
    'Counter target spell. Its controller may draw a card.',
    'Counter target spell with converted mana cost 3 or less.',
    'Counter target spell. If that spell is countered this way, exile it instead of putting it into its owner\'s graveyard.',
    'Counter target spell. You lose 2 life.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomCardDrawText = () => {
  const spellTexts = [
    'Draw two cards.',
    'Draw a card, then draw another card if you control a water source.',
    'Draw three cards, then discard a card.',
    'Look at the top three cards of your library. Put one into your hand and the rest on the bottom of your library in any order.',
    'Draw a card for each water source you control.',
    'Target player draws two cards.',
    'Each player draws a card.',
    'Draw a card. If you control three or more water sources, draw another card.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomEarthAbilityText = () => {
  const abilities = [
    'When this creature enters the battlefield, you may search your library for a basic land card, reveal it, put it into your hand, then shuffle.',
    'This creature gets +0/+2 as long as you control an earth source.',
    'Whenever this creature blocks, it gets +0/+3 until end of turn.',
    'When this creature enters the battlefield, you gain 3 life.',
    'This creature can block an additional creature each combat.',
    'Whenever another creature enters the battlefield under your control, this creature gets +1/+1 until end of turn.',
    'Tap: Add one mana of any color.',
    'This creature can\'t be the target of fire spells or abilities from fire sources.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomRampSpellText = () => {
  const spellTexts = [
    'Search your library for a basic land card, put it onto the battlefield tapped, then shuffle.',
    'Search your library for up to two basic land cards, reveal them, put them into your hand, then shuffle.',
    'Target land you control becomes a 3/3 elemental creature with haste until end of turn. It\'s still a land.',
    'Put target land card from a graveyard onto the battlefield under your control.',
    'Creatures you control get +0/+2 until end of turn.',
    'You gain 3 life for each earth source you control.',
    'Destroy target artifact or enchantment.',
    'Create a 3/3 green Elemental creature token.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomEarthUtilityText = () => {
  const spellTexts = [
    'Target creature gets +2/+2 until end of turn.',
    'Regenerate target creature.',
    'Target creature gains hexproof until end of turn.',
    'Target creature gets +1/+1 for each earth source you control until end of turn.',
    'Creatures you control gain trample until end of turn.',
    'Prevent all combat damage that would be dealt this turn.',
    'Target creature fights target creature an opponent controls.',
    'Create two 1/1 green Saproling creature tokens.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomAirAbilityText = () => {
  const abilities = [
    'Flying',
    'When this creature enters the battlefield, tap target creature an opponent controls.',
    'Whenever this creature deals combat damage to a player, you may return target creature to its owner\'s hand.',
    'This creature can only be blocked by creatures with flying.',
    'Whenever you cast an air spell, this creature gets +1/+1 until end of turn.',
    'When this creature enters the battlefield, look at the top two cards of your library. Put one on top and one on the bottom.',
    'This creature gets +1/+0 for each air source you control.',
    'Whenever this creature becomes the target of a spell, you may draw a card.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomBounceSpellText = () => {
  const spellTexts = [
    'Return target creature to its owner\'s hand.',
    'Return target nonland permanent to its owner\'s hand.',
    'Return up to two target creatures to their owners\' hands.',
    'Return all creatures to their owners\' hands.',
    'Return target permanent you control and target permanent you don\'t control to their owners\' hands.',
    'Return target creature to its owner\'s hand. Its controller draws a card.',
    'Return target creature to its owner\'s hand. You gain 2 life.',
    'Return target attacking or blocking creature to its owner\'s hand.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomAirUtilityText = () => {
  const spellTexts = [
    'Tap up to two target creatures.',
    'Target creature gains flying until end of turn.',
    'Creatures you control gain flying until end of turn.',
    'Prevent all combat damage that would be dealt by creatures without flying this turn.',
    'Look at the top three cards of your library. Put one into your hand and the rest on the bottom of your library in any order.',
    'Target creature gets -2/-0 until end of turn.',
    'Creatures your opponents control get -1/-0 until end of turn.',
    'Target creature can\'t be blocked this turn.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomVoidAbilityText = () => {
  const abilities = [
    'When this creature dies, each opponent loses 2 life and you gain 2 life.',
    'Sacrifice another creature: This creature gets +2/+2 until end of turn.',
    'When this creature enters the battlefield, each player discards a card.',
    'Whenever you sacrifice another creature, put a +1/+1 counter on this creature.',
    'When this creature enters the battlefield, exile target card from a graveyard.',
    'Whenever a creature an opponent controls dies, you gain 1 life.',
    'This creature gets +1/+1 for each card in your graveyard.',
    'Whenever this creature deals combat damage to a player, that player discards a card.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomVoidComboText = () => {
  const comboTexts = [
    'Whenever you cast a spell, each opponent loses 1 life.',
    'At the beginning of your upkeep, sacrifice a creature. If you do, draw a card.',
    'Whenever a creature dies, put a charge counter on this. Then, if there are three or more charge counters on it, remove them and create a 5/5 black Demon creature token with flying.',
    'Whenever you gain life, each opponent loses that much life.',
    'Whenever a creature enters the battlefield under your control, you may pay 1 life. If you do, draw a card.',
    'Whenever you sacrifice a creature, target opponent sacrifices a creature.',
    'At the beginning of your end step, if you lost life this turn, create a 2/2 black Zombie creature token.',
    'Whenever you cast a void spell, target opponent discards a card.'
  ];
  
  return comboTexts[Math.floor(Math.random() * comboTexts.length)];
};

const getRandomVoidUtilityText = () => {
  const spellTexts = [
    'Target player discards two cards.',
    'Each player sacrifices a creature.',
    'Target player loses 3 life and you gain 3 life.',
    'Exile target card from a graveyard. Draw a card.',
    'Target creature gets -3/-3 until end of turn.',
    'Search your library for a card, put it into your hand, then shuffle. You lose 2 life.',
    'Return target creature card from your graveyard to your hand.',
    'Create a 2/2 black Zombie creature token.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};

const getRandomMultiAbilityText = () => {
  const abilities = [
    'When this creature enters the battlefield, you gain 2 life and draw a card.',
    'This creature has vigilance and trample.',
    'This creature has flying and first strike.',
    'When this creature dies, it deals 2 damage to target creature and you gain 2 life.',
    'Whenever you cast a multi-colored spell, put a +1/+1 counter on this creature.',
    'This creature gets +1/+1 for each different type of mana used to cast it.',
    'When this creature enters the battlefield, choose one — Create a 1/1 token; or Draw a card; or Gain 3 life.',
    'This creature has protection from mono-colored spells.'
  ];
  
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const getRandomMultiSpellText = () => {
  const spellTexts = [
    'Choose one — Destroy target artifact; or Destroy target enchantment; or Destroy target land.',
    'Target creature gets +2/+2 and gains flying and vigilance until end of turn.',
    'Deal 2 damage to target creature and you gain 2 life.',
    'Counter target spell. Its controller loses 2 life.',
    'Create a 2/2 green and blue Elemental creature token with flying and hexproof.',
    'Draw a card, then add one mana of any color.',
    'Target player discards a card, then draws a card.',
    'Exile target creature. Its controller gains life equal to its power.'
  ];
  
  return spellTexts[Math.floor(Math.random() * spellTexts.length)];
};