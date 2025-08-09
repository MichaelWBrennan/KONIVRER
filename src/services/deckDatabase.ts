import { Deck } from '../types';

// Mock deck database - In a real implementation, this would connect to a backend
const MOCK_DECKS: Deck[] = [
  {
    id: 'deck-1',
    name: 'Lightning Aggro',
    description: 'Fast red aggro deck focused on burn spells and quick creatures',
    format: 'Standard',
    cards: [
      {
        id: 'card-1',
        card_id: 'lightning-bolt',
        name: 'Lightning Bolt',
        quantity: 4,
        is_sideboard: false,
        mana_cost: '{R}',
        type_line: 'Instant',
        cmc: 1
      },
      {
        id: 'card-2', 
        card_id: 'monastery-swiftspear',
        name: 'Monastery Swiftspear',
        quantity: 4,
        is_sideboard: false,
        mana_cost: '{R}',
        type_line: 'Creature — Human Monk',
        cmc: 1
      },
      {
        id: 'card-3',
        card_id: 'lava-spike',
        name: 'Lava Spike',
        quantity: 4,
        is_sideboard: false,
        mana_cost: '{R}',
        type_line: 'Sorcery',
        cmc: 1
      }
    ],
    mainboard_count: 60,
    sideboard_count: 15,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    author: 'ProPlayer123',
    tags: ['aggro', 'burn', 'competitive']
  },
  {
    id: 'deck-2',
    name: 'Control Blue',
    description: 'Classic blue control deck with counterspells and card draw',
    format: 'Standard',
    cards: [
      {
        id: 'card-4',
        card_id: 'counterspell',
        name: 'Counterspell',
        quantity: 4,
        is_sideboard: false,
        mana_cost: '{U}{U}',
        type_line: 'Instant',
        cmc: 2
      },
      {
        id: 'card-5',
        card_id: 'divination',
        name: 'Divination',
        quantity: 3,
        is_sideboard: false,
        mana_cost: '{2}{U}',
        type_line: 'Sorcery',
        cmc: 3
      }
    ],
    mainboard_count: 60,
    sideboard_count: 15,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    author: 'ControlMaster',
    tags: ['control', 'blue', 'competitive']
  },
  {
    id: 'deck-3',
    name: 'Ramp Green',
    description: 'Mana ramp strategy with big creatures and land acceleration',
    format: 'Modern',
    cards: [
      {
        id: 'card-6',
        card_id: 'llanowar-elves',
        name: 'Llanowar Elves',
        quantity: 4,
        is_sideboard: false,
        mana_cost: '{G}',
        type_line: 'Creature — Elf Druid',
        cmc: 1
      },
      {
        id: 'card-7',
        card_id: 'primeval-titan',
        name: 'Primeval Titan',
        quantity: 2,
        is_sideboard: false,
        mana_cost: '{4}{G}{G}',
        type_line: 'Creature — Beast',
        cmc: 6
      }
    ],
    mainboard_count: 60,
    sideboard_count: 15,
    created_at: '2024-01-08T11:30:00Z',
    updated_at: '2024-01-14T13:20:00Z',
    author: 'NaturePlayer',
    tags: ['ramp', 'green', 'midrange']
  }
];

export async function searchDecks(query: string): Promise<Deck[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim()) {
    return MOCK_DECKS;
  }
  
  const lowercaseQuery = query.toLowerCase();
  
  return MOCK_DECKS.filter(deck => 
    deck.name.toLowerCase().includes(lowercaseQuery) ||
    deck.description.toLowerCase().includes(lowercaseQuery) ||
    deck.format.toLowerCase().includes(lowercaseQuery) ||
    deck.author?.toLowerCase().includes(lowercaseQuery) ||
    deck.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    deck.cards.some(card => card.name.toLowerCase().includes(lowercaseQuery))
  );
}

export async function getDeckById(id: string): Promise<Deck | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_DECKS.find(deck => deck.id === id) || null;
}

export async function getDecksByFormat(format: string): Promise<Deck[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_DECKS.filter(deck => 
    deck.format.toLowerCase() === format.toLowerCase()
  );
}

export async function getDecksByAuthor(author: string): Promise<Deck[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_DECKS.filter(deck => 
    deck.author?.toLowerCase() === author.toLowerCase()
  );
}