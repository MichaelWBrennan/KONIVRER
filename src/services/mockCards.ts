import { ScryfallCard } from '../types';

// Mock card database for when Scryfall API is not available
const MOCK_CARDS: ScryfallCard[] = [
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    mana_cost: '{R}',
    type_line: 'Instant',
    oracle_text: 'Lightning Bolt deals 3 damage to any target.',
    colors: ['R'],
    color_identity: ['R'],
    cmc: 1,
    rarity: 'common',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'counterspell',
    name: 'Counterspell',
    mana_cost: '{U}{U}',
    type_line: 'Instant',
    oracle_text: 'Counter target spell.',
    colors: ['U'],
    color_identity: ['U'],
    cmc: 2,
    rarity: 'common',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'llanowar-elves',
    name: 'Llanowar Elves',
    mana_cost: '{G}',
    type_line: 'Creature — Elf Druid',
    oracle_text: '{T}: Add {G}.',
    power: '1',
    toughness: '1',
    colors: ['G'],
    color_identity: ['G'],
    cmc: 1,
    rarity: 'common',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'serra-angel',
    name: 'Serra Angel',
    mana_cost: '{3}{W}{W}',
    type_line: 'Creature — Angel',
    oracle_text: 'Flying, vigilance',
    power: '4',
    toughness: '4',
    colors: ['W'],
    color_identity: ['W'],
    cmc: 5,
    rarity: 'uncommon',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'shivan-dragon',
    name: 'Shivan Dragon',
    mana_cost: '{4}{R}{R}',
    type_line: 'Creature — Dragon',
    oracle_text: 'Flying',
    power: '5',
    toughness: '5',
    colors: ['R'],
    color_identity: ['R'],
    cmc: 6,
    rarity: 'rare',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'black-lotus',
    name: 'Black Lotus',
    mana_cost: '{0}',
    type_line: 'Artifact',
    oracle_text: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
    colors: [],
    color_identity: [],
    cmc: 0,
    rarity: 'rare',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'giant-growth',
    name: 'Giant Growth',
    mana_cost: '{G}',
    type_line: 'Instant',
    oracle_text: 'Target creature gets +3/+3 until end of turn.',
    colors: ['G'],
    color_identity: ['G'],
    cmc: 1,
    rarity: 'common',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  },
  {
    id: 'ancestral-recall',
    name: 'Ancestral Recall',
    mana_cost: '{U}',
    type_line: 'Instant',
    oracle_text: 'Target player draws three cards.',
    colors: ['U'],
    color_identity: ['U'],
    cmc: 1,
    rarity: 'rare',
    set: 'lea',
    set_name: 'Limited Edition Alpha',
    image_uris: {
      normal: '/placeholder-card.png',
      small: '/placeholder-card.png'
    }
  }
];

export async function searchMockCards(query: string): Promise<ScryfallCard[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!query.trim()) {
    return MOCK_CARDS;
  }
  
  const lowercaseQuery = query.toLowerCase();
  
  // Handle Scryfall-style search syntax
  if (lowercaseQuery.startsWith('type:')) {
    const typeQuery = lowercaseQuery.replace('type:', '').trim();
    return MOCK_CARDS.filter(card => 
      card.type_line.toLowerCase().includes(typeQuery)
    );
  }
  
  if (lowercaseQuery.startsWith('color:')) {
    const colorQuery = lowercaseQuery.replace('color:', '').trim();
    const colorMap: Record<string, string> = {
      'white': 'W',
      'blue': 'U', 
      'black': 'B',
      'red': 'R',
      'green': 'G'
    };
    const colorCode = colorMap[colorQuery] || colorQuery.toUpperCase();
    return MOCK_CARDS.filter(card => 
      card.colors?.includes(colorCode)
    );
  }
  
  if (lowercaseQuery.startsWith('cmc:')) {
    const cmcQuery = parseInt(lowercaseQuery.replace('cmc:', '').trim());
    return MOCK_CARDS.filter(card => card.cmc === cmcQuery);
  }
  
  // Default text search
  return MOCK_CARDS.filter(card => 
    card.name.toLowerCase().includes(lowercaseQuery) ||
    card.type_line.toLowerCase().includes(lowercaseQuery) ||
    card.oracle_text?.toLowerCase().includes(lowercaseQuery) ||
    card.colors?.some(color => color.toLowerCase().includes(lowercaseQuery))
  );
}

export async function autocompleteMockCards(query: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (query.length < 2) {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase();
  const suggestions = MOCK_CARDS
    .filter(card => card.name.toLowerCase().startsWith(lowercaseQuery))
    .map(card => card.name)
    .slice(0, 8);
    
  return suggestions;
}