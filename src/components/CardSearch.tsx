import React, { useState, useMemo, useCallback } from 'react';
import { useCards } from '../hooks/useCards';
import { useAppStore } from '../stores/appStore';
import { debounce } from '../utils/timing';
import { Card } from '../data/cards';  // Use our local Card type
import * as cs from './cardSearch.css.ts';
import { CardViewerModal } from './CardViewerModal';
import * as nav from '../nav.css.ts';

interface CardSearchProps {
  onCardSelect?: (card: Card) => void;
}

export const CardSearch: React.FC<CardSearchProps>  : any = () => {
  const [selectedCard, setSelectedCard]  : any = useState<Card | null>(null);
  const { searchFilters, setSearchFilters }  : any = useAppStore();
  const [localSearchTerm, setLocalSearchTerm]  : any = useState(searchFilters.search || '');
  
  // Using the existing useCards hook from src/hooks/useCards.ts to fetch data from the backend API.
  // Debounced search - update filters when user stops typing
  const updateSearch  : any = useCallback(
    debounce((term: string) => {
      setSearchFilters({ search: term, page: 1 });
    }, 500),
    [setSearchFilters]
  );

  const { data: cardsData, isLoading, error }  : any = useCards(searchFilters);

  // Update search term locally and trigger debounced update
  const handleSearchChange  : any = (term: string) => {
    setLocalSearchTerm(term);
    updateSearch(term);
  };

  const handleFilterChange  : any = (key: string, value: any) => {
    setSearchFilters({ [key]: value, page: 1 });
  };

  const handlePageChange  : any = (page: number) => {
    setSearchFilters({ page });
  };

  

  // Get unique values for filters from current results
  const filterOptions  : any = useMemo(() => {
    const cards  : any = cardsData?.cards || [];
    return {
      elements: [...new Set(cards.map((card: Card) => card.element))].sort() as string[],
      types: [...new Set(cards.map((card: Card) => card.type))].sort() as string[],
      rarities: [...new Set(cards.map((card: Card) => card.rarity))].sort() as string[],
    };
  }, [cardsData]);

  if (error) {
    return (
      <div className="error-container">
        <h1>Card Search</h1>
        <div className="error">
          Error loading cards: {error.message}
        </div>
      </div>
    );
  }

  const cards  : any = cardsData?.cards || [];
  const pagination  : any = cardsData ? {
    currentPage: cardsData.page,
    totalPages: Math.ceil(cardsData.total / (cardsData.pageSize || 20)),
    total: cardsData.total
  } : null;

  return (
    <div>
      <div className="search-container">
        <h1 className={nav.navTitle}>Card Search</h1>

        <input
          type="text"
          placeholder="Search cards by name, description, or keywords..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
        
        <div className="filters">
          <select
            value={searchFilters.element || ''}
            onChange={(e) => handleFilterChange('element', e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">All Elements</option>
            {filterOptions.elements.map(element => (
              <option key={element} value={element}>{element}</option>
            ))}
          </select>
          
          <select
            value={searchFilters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {filterOptions.types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={searchFilters.rarity || ''}
            onChange={(e) => handleFilterChange('rarity', e.target.value || undefined)}
            className="filter-select"
          >
            <option value="">All Rarities</option>
            {filterOptions.rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>

          <label className={cs.filtersRow}>
            <input
              type="checkbox"
              checked={searchFilters.legalOnly || false}
              onChange={(e) => handleFilterChange('legalOnly', e.target.checked || undefined)}
            />
            Tournament Legal Only
          </label>
        </div>
      </div>

      {isLoading && (
        <div className="loading">Loading cards...</div>
      )}

      {pagination && (
        <div className="pagination-info">
          Showing {((pagination.currentPage - 1) * searchFilters.limit!) + 1}-{Math.min(pagination.currentPage * searchFilters.limit!, pagination.total)} of {pagination.total} cards
        </div>
      )}

      <div className={cs.cardsGrid}>
        {cards.map((card: Card) => (
          <div
            key={card.id}
            className={`card-item ${cs.cardItem}`}
            onClick={() => setSelectedCard(card)}
          >
            <img
              src={card.webpUrl || card.imageUrl || '/placeholder-card.png'}
              alt={card.name}
              className={cs.cardImg}
              onError={(e) => {
                const target  : any = e.target as HTMLImageElement;
                if (target.src !== '/placeholder-card.png') {
                  target.src = card.imageUrl || '/placeholder-card.png';
                }
              }}
            />
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={cs.pagination}>
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className={cs.pageButton}
          >
            Previous
          </button>
          
          <span className={cs.paginationInfo}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className={cs.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {cards.length === 0 && !isLoading && (
        <div className={`no-results ${cs.noResults}`}>
          <p>No cards found matching your search criteria.</p>
        </div>
      )}

      <CardViewerModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
};