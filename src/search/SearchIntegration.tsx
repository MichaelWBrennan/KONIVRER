import React, { useState, useEffect } from 'react';
import ScryfallSearchEngine, { KonivrCard } from './ScryfallSearchEngine';
import ScryfallSearchInterface from './ScryfallSearchInterface';
import './ScryfallSearch.css';

// Sample KONIVRER card data - replace with your actual data source
const sampleCards: KonivrCard[] = [
  {
    id: 'konivr-001',
    name: 'Lightning Bolt',
    manaCost: '{R}',
    cmc: 1,
    colors: ['red'],
    colorIdentity: ['red'],
    type: 'Instant',
    subtypes: [],
    supertypes: [],
    rarity: 'common',
    set: 'KNV',
    setName: 'KONIVRER Core',
    oracleText: 'Lightning Bolt deals 3 damage to any target.',
    artist: 'Christopher Rush',
    imageUrl: '/images/cards/lightning-bolt.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['instant'],
    price: 0.25,
    collectorNumber: '001',
    layout: 'normal'
  },
  {
    id: 'konivr-002',
    name: 'Serra Angel',
    manaCost: '{3}{W}{W}',
    cmc: 5,
    colors: ['white'],
    colorIdentity: ['white'],
    type: 'Creature',
    subtypes: ['Angel'],
    supertypes: [],
    rarity: 'uncommon',
    set: 'KNV',
    setName: 'KONIVRER Core',
    power: 4,
    toughness: 4,
    oracleText: 'Flying, vigilance',
    artist: 'Douglas Shuler',
    imageUrl: '/images/cards/serra-angel.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: ['flying', 'vigilance'],
    abilities: ['flying', 'vigilance'],
    price: 1.50,
    collectorNumber: '002',
    layout: 'normal'
  },
  {
    id: 'konivr-003',
    name: 'Black Lotus',
    manaCost: '{0}',
    cmc: 0,
    colors: [],
    colorIdentity: [],
    type: 'Artifact',
    subtypes: [],
    supertypes: [],
    rarity: 'mythic',
    set: 'KNV',
    setName: 'KONIVRER Core',
    oracleText: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
    artist: 'Christopher Rush',
    imageUrl: '/images/cards/black-lotus.jpg',
    legalities: {
      standard: 'banned',
      modern: 'banned',
      legacy: 'banned'
    },
    keywords: [],
    abilities: ['tap', 'sacrifice'],
    price: 25000.00,
    collectorNumber: '003',
    layout: 'normal'
  },
  {
    id: 'konivr-004',
    name: 'Tarmogoyf',
    manaCost: '{1}{G}',
    cmc: 2,
    colors: ['green'],
    colorIdentity: ['green'],
    type: 'Creature',
    subtypes: ['Lhurgoyf'],
    supertypes: [],
    rarity: 'rare',
    set: 'KNV',
    setName: 'KONIVRER Core',
    power: 0,
    toughness: 1,
    oracleText: "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus 1.",
    artist: 'Justin Murray',
    imageUrl: '/images/cards/tarmogoyf.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['variable-power', 'variable-toughness'],
    price: 45.00,
    collectorNumber: '004',
    layout: 'normal'
  },
  {
    id: 'konivr-005',
    name: 'Counterspell',
    manaCost: '{U}{U}',
    cmc: 2,
    colors: ['blue'],
    colorIdentity: ['blue'],
    type: 'Instant',
    subtypes: [],
    supertypes: [],
    rarity: 'common',
    set: 'KNV',
    setName: 'KONIVRER Core',
    oracleText: 'Counter target spell.',
    artist: 'Mark Poole',
    imageUrl: '/images/cards/counterspell.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['counter'],
    price: 2.00,
    collectorNumber: '005',
    layout: 'normal'
  },
  {
    id: 'konivr-006',
    name: 'Dark Ritual',
    manaCost: '{B}',
    cmc: 1,
    colors: ['black'],
    colorIdentity: ['black'],
    type: 'Instant',
    subtypes: [],
    supertypes: [],
    rarity: 'common',
    set: 'KNV',
    setName: 'KONIVRER Core',
    oracleText: 'Add {B}{B}{B}.',
    artist: 'Sandra Everingham',
    imageUrl: '/images/cards/dark-ritual.jpg',
    legalities: {
      standard: 'banned',
      modern: 'banned',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['mana'],
    price: 3.50,
    collectorNumber: '006',
    layout: 'normal'
  },
  {
    id: 'konivr-007',
    name: 'Shivan Dragon',
    manaCost: '{4}{R}{R}',
    cmc: 6,
    colors: ['red'],
    colorIdentity: ['red'],
    type: 'Creature',
    subtypes: ['Dragon'],
    supertypes: [],
    rarity: 'rare',
    set: 'KNV',
    setName: 'KONIVRER Core',
    power: 5,
    toughness: 5,
    oracleText: 'Flying',
    artist: 'Melissa A. Benson',
    imageUrl: '/images/cards/shivan-dragon.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: ['flying'],
    abilities: ['flying'],
    price: 8.00,
    collectorNumber: '007',
    layout: 'normal'
  },
  {
    id: 'konivr-008',
    name: 'Llanowar Elves',
    manaCost: '{G}',
    cmc: 1,
    colors: ['green'],
    colorIdentity: ['green'],
    type: 'Creature',
    subtypes: ['Elf', 'Druid'],
    supertypes: [],
    rarity: 'common',
    set: 'KNV',
    setName: 'KONIVRER Core',
    power: 1,
    toughness: 1,
    oracleText: '{T}: Add {G}.',
    artist: 'Anson Maddocks',
    imageUrl: '/images/cards/llanowar-elves.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['tap', 'mana'],
    price: 0.50,
    collectorNumber: '008',
    layout: 'normal'
  },
  {
    id: 'konivr-009',
    name: 'Wrath of God',
    manaCost: '{2}{W}{W}',
    cmc: 4,
    colors: ['white'],
    colorIdentity: ['white'],
    type: 'Sorcery',
    subtypes: [],
    supertypes: [],
    rarity: 'rare',
    set: 'KNV',
    setName: 'KONIVRER Core',
    oracleText: 'Destroy all creatures. They can\'t be regenerated.',
    artist: 'Kev Walker',
    imageUrl: '/images/cards/wrath-of-god.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['destroy', 'board-wipe'],
    price: 12.00,
    collectorNumber: '009',
    layout: 'normal'
  },
  {
    id: 'konivr-010',
    name: 'Jace, the Mind Sculptor',
    manaCost: '{2}{U}{U}',
    cmc: 4,
    colors: ['blue'],
    colorIdentity: ['blue'],
    type: 'Legendary Planeswalker',
    subtypes: ['Jace'],
    supertypes: ['Legendary'],
    rarity: 'mythic',
    set: 'KNV',
    setName: 'KONIVRER Core',
    loyalty: 3,
    oracleText: '+2: Look at the top card of target player\'s library. You may put that card on the bottom of that player\'s library.\n0: Draw three cards, then put two cards from your hand on top of your library in any order.\n-1: Return target creature to its owner\'s hand.\n-12: Exile all cards from target player\'s library, then that player shuffles their hand into their library.',
    artist: 'Jason Chan',
    imageUrl: '/images/cards/jace-mind-sculptor.jpg',
    legalities: {
      standard: 'legal',
      modern: 'legal',
      legacy: 'legal'
    },
    keywords: [],
    abilities: ['planeswalker', 'card-draw', 'bounce', 'ultimate'],
    price: 85.00,
    collectorNumber: '010',
    layout: 'normal'
  }
];

interface SearchIntegrationProps {
  onCardSelect?: (card: KonivrCard) => void;
  initialCards?: KonivrCard[];
}

export const SearchIntegration: React.FC<SearchIntegrationProps> = ({
  onCardSelect,
  initialCards = sampleCards
}) => {
  const [searchEngine, setSearchEngine] = useState<ScryfallSearchEngine | null>(null);
  const [selectedCard, setSelectedCard] = useState<KonivrCard | null>(null);

  useEffect(() => {
    // Initialize the search engine with card data
    const engine = new ScryfallSearchEngine(initialCards);
    setSearchEngine(engine);
  }, [initialCards]);

  const handleCardSelect = (card: KonivrCard) => {
    setSelectedCard(card);
    onCardSelect?.(card);
  };

  const handleSearchResults = (results: any) => {
    console.log('Search results:', results);
  };

  if (!searchEngine) {
    return <div>Loading search engine...</div>;
  }

  return (
    <div className="search-integration">
      <div className="search-header">
        <h1>KONIVRER Card Search</h1>
        <p>Search through the KONIVRER card database using advanced Scryfall-style syntax</p>
      </div>

      <ScryfallSearchInterface
        searchEngine={searchEngine}
        onCardSelect={handleCardSelect}
        onSearchResults={handleSearchResults}
        placeholder="Search KONIVRER cards... (e.g., c:red cmc:3, t:creature pow>=4)"
        showAdvancedFilters={true}
        showSortOptions={true}
        showSearchHistory={true}
        maxResults={50}
      />

      {selectedCard && (
        <div className="selected-card-details">
          <h3>Selected Card</h3>
          <div className="card-details">
            <div className="card-image-large">
              <img src={selectedCard.imageUrl} alt={selectedCard.name} />
            </div>
            <div className="card-info-detailed">
              <h4>{selectedCard.name}</h4>
              <p><strong>Mana Cost:</strong> {selectedCard.manaCost}</p>
              <p><strong>Type:</strong> {selectedCard.type}</p>
              {selectedCard.power !== undefined && selectedCard.toughness !== undefined && (
                <p><strong>Power/Toughness:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
              )}
              {selectedCard.loyalty !== undefined && (
                <p><strong>Loyalty:</strong> {selectedCard.loyalty}</p>
              )}
              <p><strong>Rarity:</strong> {selectedCard.rarity}</p>
              <p><strong>Set:</strong> {selectedCard.setName} ({selectedCard.set})</p>
              <p><strong>Oracle Text:</strong> {selectedCard.oracleText}</p>
              <p><strong>Artist:</strong> {selectedCard.artist}</p>
              {selectedCard.price && (
                <p><strong>Price:</strong> ${selectedCard.price.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="search-examples">
        <h3>Example Searches</h3>
        <div className="examples-grid">
          <div className="example">
            <code>c:red</code>
            <span>All red cards</span>
          </div>
          <div className="example">
            <code>t:creature pow&gt;=4</code>
            <span>Creatures with power 4 or greater</span>
          </div>
          <div className="example">
            <code>cmc:3 r:rare</code>
            <span>Rare cards with CMC 3</span>
          </div>
          <div className="example">
            <code>o:flying t:dragon</code>
            <span>Dragons with flying</span>
          </div>
          <div className="example">
            <code>c:blue AND c:white</code>
            <span>Blue and white cards</span>
          </div>
          <div className="example">
            <code>(c:red OR c:green) cmc&lt;=2</code>
            <span>Red or green cards with CMC 2 or less</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchIntegration;