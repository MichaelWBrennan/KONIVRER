import { Search, Filter, Grid, List, Eye, Plus } from 'lucide-react';
import { useState } from 'react';

import CardViewer from '../components/CardViewer';
import cardsData from '../data/cards.json';

const CardDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    elements: [],
    rarity: '',
    cost: '',
    keywords: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const allElements = [...new Set(cardsData.flatMap(card => card.elements))];
  const allRarities = [...new Set(cardsData.map(card => card.rarity))];
  const allKeywords = [...new Set(cardsData.flatMap(card => card.keywords))];

  // Filter and sort cards
  const filteredAndSortedCards = cardsData
    .filter(card => {
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

      return matchesSearch && matchesElements && matchesRarity && matchesCost && matchesKeywords;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return a.cost - b.cost;
        case 'power':
          return b.power - a.power;
        case 'rarity': {
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, legendary: 4 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        default:
          return 0;
      }
    });

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-600';
      case 'uncommon':
        return 'bg-green-600';
      case 'rare':
        return 'bg-blue-600';
      case 'legendary':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className='min-h-screen bg-primary'>
      <div className='container py-6'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Card Database</h1>
          <p className='text-secondary'>
            Browse and search through all {cardsData.length} KONIVRER cards
          </p>
        </div>

        {/* Search and Controls */}
        <div className='card mb-6'>
          <div className='flex flex-col lg:flex-row gap-4 mb-4'>
            {/* Search Bar */}
            <div className='flex-1 relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted'
                size={16}
              />
              <input
                type='text'
                placeholder='Search cards by name or text...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='input pl-10'
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='input lg:w-48'
            >
              <option value='name'>Sort by Name</option>
              <option value='cost'>Sort by Cost</option>
              <option value='power'>Sort by Power</option>
              <option value='rarity'>Sort by Rarity</option>
            </select>

            {/* View Mode */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Filters Toggle */}
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
            <div className='border-t border-color pt-4 space-y-4'>
              <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* Elements Filter */}
                <div>
                  <label htmlFor='elements-filter' className='block text-sm font-medium mb-2'>
                    Elements
                  </label>
                  <div id='elements-filter' className='space-y-1'>
                    {allElements.map(element => (
                      <label key={element} className='flex items-center gap-2'>
                        <input
                          type='checkbox'
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
                                elements: prev.elements.filter(el => el !== element),
                              }));
                            }
                          }}
                          className='rounded'
                        />
                        <span className='text-sm'>{element}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarity Filter */}
                <div>
                  <label htmlFor='rarity-filter' className='block text-sm font-medium mb-2'>
                    Rarity
                  </label>
                  <select
                    id='rarity-filter'
                    value={filters.rarity}
                    onChange={e => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                    className='input'
                  >
                    <option value=''>All Rarities</option>
                    {allRarities.map(rarity => (
                      <option key={rarity} value={rarity}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cost Filter */}
                <div>
                  <label htmlFor='cost-filter' className='block text-sm font-medium mb-2'>
                    Cost
                  </label>
                  <select
                    id='cost-filter'
                    value={filters.cost}
                    onChange={e => setFilters(prev => ({ ...prev, cost: e.target.value }))}
                    className='input'
                  >
                    <option value=''>Any Cost</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(cost => (
                      <option key={cost} value={cost.toString()}>
                        {cost}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Keywords Filter */}
                <div>
                  <label htmlFor='keywords-filter' className='block text-sm font-medium mb-2'>
                    Keywords
                  </label>
                  <div id='keywords-filter' className='space-y-1 max-h-32 overflow-y-auto'>
                    {allKeywords.map(keyword => (
                      <label key={keyword} className='flex items-center gap-2'>
                        <input
                          type='checkbox'
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
                                keywords: prev.keywords.filter(kw => kw !== keyword),
                              }));
                            }
                          }}
                          className='rounded'
                        />
                        <span className='text-sm'>{keyword}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ elements: [], rarity: '', cost: '', keywords: [] })}
                className='btn btn-ghost text-sm'
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className='text-sm text-secondary mt-4'>
            Showing {filteredAndSortedCards.length} of {cardsData.length} cards
          </div>
        </div>

        {/* Cards Display */}
        {viewMode === 'grid' ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredAndSortedCards.map(card => (
              <div
                key={card.id}
                className='card hover:border-accent-primary cursor-pointer transition-all group'
                onClick={() => setSelectedCard(card)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCard(card);
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label={`View details for ${card.name}`}
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <h3 className='font-semibold group-hover:text-accent-primary transition-colors'>
                      {card.name}
                    </h3>
                    <div className='flex items-center gap-2 text-sm text-secondary'>
                      <span>Cost: {card.cost}</span>
                      <span>•</span>
                      <span>Power: {card.power}</span>
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // TODO: Add to deck functionality
                    }}
                    className='btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className='flex items-center gap-2 mb-2'>
                  {card.elements.map(element => (
                    <span key={element} className='text-lg'>
                      {element}
                    </span>
                  ))}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(card.rarity)}`}
                  >
                    {card.rarity}
                  </span>
                </div>

                <p className='text-sm text-secondary line-clamp-3'>{card.text}</p>

                {card.keywords.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {card.keywords.map(keyword => (
                      <span key={keyword} className='px-2 py-1 bg-tertiary rounded text-xs'>
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-2'>
            {filteredAndSortedCards.map(card => (
              <div
                key={card.id}
                className='card hover:border-accent-primary cursor-pointer transition-all'
                onClick={() => setSelectedCard(card)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCard(card);
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label={`View details for ${card.name}`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='flex items-center gap-2'>
                      {card.elements.map(element => (
                        <span key={element} className='text-lg'>
                          {element}
                        </span>
                      ))}
                    </div>

                    <div className='flex-1'>
                      <h3 className='font-semibold'>{card.name}</h3>
                      <p className='text-sm text-secondary line-clamp-1'>{card.text}</p>
                    </div>

                    <div className='flex items-center gap-4 text-sm'>
                      <span>Cost: {card.cost}</span>
                      <span>Power: {card.power}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(card.rarity)}`}
                      >
                        {card.rarity}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                      className='btn btn-ghost btn-sm'
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        // TODO: Add to deck functionality
                      }}
                      className='btn btn-ghost btn-sm'
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedCards.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-xl font-semibold mb-2'>No cards found</h3>
            <p className='text-secondary'>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardViewer
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddToDeck={() => {
            // TODO: Add to deck functionality
            console.warn('Add to deck:', selectedCard);
          }}
        />
      )}
    </div>
  );
};

export default CardDatabase;
