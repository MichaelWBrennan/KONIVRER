import { useState, useMemo, useCallback } from 'react';
import { useCards, useSeedKonivrrerCards } from '../hooks/useCards';
import { useAppStore } from '../stores/appStore';
import type { Card } from '../stores/appStore';

interface CardSearchProps {
  onCardSelect?: (card: Card) => void;
}

export const CardSearch: React.FC<CardSearchProps> = ({ onCardSelect }) => {
  const { searchFilters, setSearchFilters, setError } = useAppStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchFilters.search || '');
  
  // Debounced search - update filters when user stops typing
  const updateSearch = useCallback(
    debounce((term: string) => {
      setSearchFilters({ search: term, page: 1 });
    }, 500),
    [setSearchFilters]
  );

  const { data: cardsData, isLoading, error } = useCards(searchFilters);
  const seedMutation = useSeedKonivrrerCards();

  // Update search term locally and trigger debounced update
  const handleSearchChange = (term: string) => {
    setLocalSearchTerm(term);
    updateSearch(term);
  };

  const handleFilterChange = (key: string, value: any) => {
    setSearchFilters({ [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setSearchFilters({ page });
  };

  const handleSeedCards = async () => {
    try {
      await seedMutation.mutateAsync(undefined);
      setError(null);
    } catch (error) {
      setError('Failed to seed cards: ' + (error as Error).message);
    }
  };

  const handleAddToDeck = (card: Card) => {
    // Implement add to deck functionality
    // This could open a modal to select which deck to add to
    // or add to a "working deck" in the deck builder
    console.log('Adding card to deck:', card.name);
    alert(`"${card.name}" will be added to your deck... (Feature coming soon)`);
  };

  // Get unique values for filters from current results
  const filterOptions = useMemo(() => {
    const cards = cardsData?.items || [];
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
          <button onClick={handleSeedCards} disabled={seedMutation.isPending}>
            {seedMutation.isPending ? 'Seeding...' : 'Seed Sample Cards'}
          </button>
        </div>
      </div>
    );
  }

  const cards = cardsData?.items || [];
  const pagination = cardsData ? {
    currentPage: cardsData.page,
    totalPages: cardsData.pages,
    total: cardsData.total
  } : null;

  return (
    <div>
      <div className="search-container">
        <h1 className="nav-title">Card Search</h1>
        
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={handleSeedCards} 
            disabled={seedMutation.isPending}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: seedMutation.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {seedMutation.isPending ? 'Seeding...' : 'Seed KONIVRER Cards'}
          </button>
        </div>

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

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      <div className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1rem'
        }}
      >
        {cards.map((card: Card) => (
          <div
            key={card.id}
            className="card-item"
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              background: 'var(--card-bg)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <img
              src={card.webpUrl || card.imageUrl || '/placeholder-card.png'}
              alt={card.name}
              style={{ width: '100%', borderRadius: '4px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/placeholder-card.png') {
                  target.src = card.imageUrl || '/placeholder-card.png';
                }
              }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{card.name}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {card.element} {card.type} • Cost: {card.cost}
              </p>
              {card.power !== undefined && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {card.power}/{card.toughness}
                </p>
              )}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    background: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToDeck(card);
                  }}
                >
                  + Deck
                </button>
                <button
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    background: 'var(--secondary-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardSelect?.(card);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '2rem 0' }}>
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              background: 'var(--secondary-bg)',
              cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '0.5rem 1rem' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              background: 'var(--secondary-bg)',
              cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {cards.length === 0 && !isLoading && (
        <div className="no-results" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No cards found matching your search criteria.</p>
          {!cardsData?.total && (
            <button onClick={handleSeedCards} disabled={seedMutation.isPending}>
              {seedMutation.isPending ? 'Seeding...' : 'Seed Sample Cards'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}