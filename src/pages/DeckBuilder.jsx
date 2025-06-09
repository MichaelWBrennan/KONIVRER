import {
  Search,
  Filter,
  Plus,
  Minus,
  Save,
  Share2,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import CardViewer from '../components/CardViewer';
import DeckStats from '../components/DeckStats';
import cardsData from '../data/cards.json';

const DeckBuilder = () => {
  const { deckId: _deckId } = useParams();
  const [deck, setDeck] = useState({
    name: 'Untitled Deck',
    cards: [],
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    elements: [],
    rarity: '',
    cost: '',
    keywords: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter cards based on search and filters
  const filteredCards = cardsData.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.text.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesElements =
      filters.elements.length === 0 ||
      filters.elements.some(element => card.elements.includes(element));

    const matchesRarity = !filters.rarity || card.rarity === filters.rarity;

    const matchesCost = !filters.cost || card.cost.toString() === filters.cost;

    const matchesKeywords =
      filters.keywords.length === 0 ||
      filters.keywords.some(keyword => card.keywords.includes(keyword));

    return (
      matchesSearch &&
      matchesElements &&
      matchesRarity &&
      matchesCost &&
      matchesKeywords
    );
  });

  // Get unique values for filters
  const allElements = [...new Set(cardsData.flatMap(card => card.elements))];
  const allRarities = [...new Set(cardsData.map(card => card.rarity))];
  const allKeywords = [...new Set(cardsData.flatMap(card => card.keywords))];

  const addCardToDeck = card => {
    const existingCard = deck.cards.find(c => c.id === card.id);
    if (existingCard) {
      if (existingCard.count < 4) {
        // Max 4 copies per card
        setDeck(prev => ({
          ...prev,
          cards: prev.cards.map(c =>
            c.id === card.id ? { ...c, count: c.count + 1 } : c,
          ),
        }));
      }
    } else {
      setDeck(prev => ({
        ...prev,
        cards: [...prev.cards, { ...card, count: 1 }],
      }));
    }
  };

  const removeCardFromDeck = cardId => {
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.reduce((acc, card) => {
        if (card.id === cardId) {
          if (card.count > 1) {
            acc.push({ ...card, count: card.count - 1 });
          }
        } else {
          acc.push(card);
        }
        return acc;
      }, []),
    }));
  };

  const getTotalCards = () => {
    return deck.cards.reduce((total, card) => total + card.count, 0);
  };

  const saveDeck = () => {
    // TODO: Implement save functionality
    console.warn('Saving deck:', deck);
    alert('Deck saved successfully!');
  };

  const shareDeck = () => {
    // TODO: Implement share functionality
    console.warn('Sharing deck:', deck);
    alert('Deck shared successfully!');
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={deck.name}
              onChange={e =>
                setDeck(prev => ({ ...prev, name: e.target.value }))
              }
              className="text-2xl font-bold bg-transparent border-none outline-none text-primary w-full"
              placeholder="Deck Name"
            />
            <div className="text-sm text-secondary mt-1">
              {getTotalCards()}/40 cards
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn btn-secondary"
            >
              <BarChart3 size={16} />
              Stats
            </button>
            <button onClick={saveDeck} className="btn btn-primary">
              <Save size={16} />
              Save
            </button>
            <button onClick={shareDeck} className="btn btn-ghost">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card Search and Database */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="card">
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="border-t border-color pt-4 space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Elements Filter */}
                    <div>
                      <label
                        htmlFor="deck-elements-filter"
                        className="block text-sm font-medium mb-2"
                      >
                        Elements
                      </label>
                      <div id="deck-elements-filter" className="space-y-1">
                        {allElements.map(element => (
                          <label
                            key={element}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={filters.elements.includes(element)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    elements: [...prev.elements, element],
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    elements: prev.elements.filter(
                                      el => el !== element,
                                    ),
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{element}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rarity Filter */}
                    <div>
                      <label
                        htmlFor="deck-rarity-filter"
                        className="block text-sm font-medium mb-2"
                      >
                        Rarity
                      </label>
                      <select
                        id="deck-rarity-filter"
                        value={filters.rarity}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            rarity: e.target.value,
                          }))
                        }
                        className="input"
                      >
                        <option value="">All Rarities</option>
                        {allRarities.map(rarity => (
                          <option key={rarity} value={rarity}>
                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cost Filter */}
                    <div>
                      <label
                        htmlFor="deck-cost-filter"
                        className="block text-sm font-medium mb-2"
                      >
                        Cost
                      </label>
                      <select
                        id="deck-cost-filter"
                        value={filters.cost}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            cost: e.target.value,
                          }))
                        }
                        className="input"
                      >
                        <option value="">Any Cost</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(cost => (
                          <option key={cost} value={cost.toString()}>
                            {cost}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                      <label
                        htmlFor="deck-keywords-filter"
                        className="block text-sm font-medium mb-2"
                      >
                        Keywords
                      </label>
                      <div
                        id="deck-keywords-filter"
                        className="space-y-1 max-h-32 overflow-y-auto"
                      >
                        {allKeywords.map(keyword => (
                          <label
                            key={keyword}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={filters.keywords.includes(keyword)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    keywords: [...prev.keywords, keyword],
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    keywords: prev.keywords.filter(
                                      kw => kw !== keyword,
                                    ),
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{keyword}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  className="card hover:border-accent-primary cursor-pointer transition-all"
                  onClick={() => setSelectedCard(card)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCard(card);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${card.name}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{card.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <span>Cost: {card.cost}</span>
                        <span>•</span>
                        <span>Power: {card.power}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        addCardToDeck(card);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {card.elements.map(element => (
                      <span key={element} className="text-lg">
                        {element}
                      </span>
                    ))}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        card.rarity === 'common'
                          ? 'bg-gray-600'
                          : card.rarity === 'uncommon'
                            ? 'bg-green-600'
                            : card.rarity === 'rare'
                              ? 'bg-blue-600'
                              : 'bg-purple-600'
                      }`}
                    >
                      {card.rarity}
                    </span>
                  </div>

                  <p className="text-sm text-secondary">{card.text}</p>

                  {card.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {card.keywords.map(keyword => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-tertiary rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deck List */}
          <div className="space-y-6">
            {/* Deck Description */}
            <div className="card">
              <h3 className="font-semibold mb-3">Description</h3>
              <textarea
                value={deck.description}
                onChange={e =>
                  setDeck(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your deck strategy..."
                className="input resize-none h-24"
              />
            </div>

            {/* Deck List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Deck ({getTotalCards()}/40)</h3>
                <div className="text-sm text-secondary">
                  {deck.cards.length} unique cards
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {deck.cards.length === 0 ? (
                  <div className="text-center py-8 text-secondary">
                    <p>No cards in deck</p>
                    <p className="text-sm">Add cards from the database</p>
                  </div>
                ) : (
                  deck.cards.map(card => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-2 bg-tertiary rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{card.name}</div>
                        <div className="text-sm text-secondary">
                          Cost: {card.cost} • Power: {card.power}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeCardFromDeck(card.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center">{card.count}</span>
                        <button
                          onClick={() => addCardToDeck(card)}
                          className="btn btn-ghost btn-sm"
                          disabled={card.count >= 4}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deck Stats */}
            {showStats && <DeckStats deck={deck} />}
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardViewer
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddToDeck={() => addCardToDeck(selectedCard)}
        />
      )}
    </div>
  );
};

export { DeckBuilder };
export default DeckBuilder;
