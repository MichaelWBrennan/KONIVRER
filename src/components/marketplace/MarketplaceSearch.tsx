import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import * as s from './marketplaceSearch.css';

interface CardSearchResult {
  id: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  currency: string;
  marketplace: string;
  availability: string;
  priceRanges: {
    low: number;
    mid: number;
    high: number;
    market: number;
  };
}

interface SearchFilters {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  marketplace?: string;
  rarity?: string;
  type?: string;
  element?: string;
}

export const MarketplaceSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 100,
    marketplace: '',
    rarity: '',
    type: '',
    element: '',
  });

  const handleSearch = async () => {
    if (!filters.query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/marketplace/search', {
        params: {
          query: filters.query,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          marketplace: filters.marketplace || undefined,
          rarity: filters.rarity || undefined,
          type: filters.type || undefined,
          element: filters.element || undefined,
        },
      });

      if (response.data.success) {
        setSearchResults(response.data.data);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('Failed to search cards');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'tcgplayer':
        return '🛒';
      case 'scryfall':
        return '🔍';
      case 'cardmarket':
        return '🇪🇺';
      default:
        return '💳';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return '#4CAF50';
      case 'limited':
        return '#FF9800';
      case 'out_of_stock':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Marketplace Search</h2>
        <p className={s.subtitle}>Find cards and compare prices across marketplaces</p>
      </div>

      <div className={s.searchSection}>
        <div className={s.searchBar}>
          <input
            type="text"
            placeholder="Search for cards..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={s.searchInput}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !filters.query.trim()}
            className={s.searchButton}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className={s.filters}>
          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Price Range</label>
            <div className={s.priceRange}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || 0)}
                className={s.priceInput}
              />
              <span className={s.priceSeparator}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || 100)}
                className={s.priceInput}
              />
            </div>
          </div>

          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Marketplace</label>
            <select
              value={filters.marketplace}
              onChange={(e) => handleFilterChange('marketplace', e.target.value)}
              className={s.filterSelect}
            >
              <option value="">All Marketplaces</option>
              <option value="tcgplayer">TCGPlayer</option>
              <option value="scryfall">Scryfall</option>
              <option value="cardmarket">CardMarket</option>
            </select>
          </div>

          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Rarity</label>
            <select
              value={filters.rarity}
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
              className={s.filterSelect}
            >
              <option value="">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="mythic">Mythic</option>
            </select>
          </div>

          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className={s.filterSelect}
            >
              <option value="">All Types</option>
              <option value="creature">Creature</option>
              <option value="spell">Spell</option>
              <option value="artifact">Artifact</option>
              <option value="instant">Instant</option>
            </select>
          </div>

          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Element</label>
            <select
              value={filters.element}
              onChange={(e) => handleFilterChange('element', e.target.value)}
              className={s.filterSelect}
            >
              <option value="">All Elements</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="earth">Earth</option>
              <option value="air">Air</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="chaos">Chaos</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className={s.errorMessage}>
          {error}
        </div>
      )}

      <div className={s.results}>
        {searchResults.length > 0 ? (
          <div className={s.resultsGrid}>
            {searchResults.map((card) => (
              <div key={`${card.id}-${card.marketplace}`} className={s.cardItem}>
                <div className={s.cardImage}>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className={s.cardImageImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/cards/card_back.svg';
                    }}
                  />
                </div>
                <div className={s.cardInfo}>
                  <h3 className={s.cardName}>{card.name}</h3>
                  <div className={s.cardPrice}>
                    <span className={s.priceValue}>
                      {formatPrice(card.currentPrice, card.currency)}
                    </span>
                    <span className={s.marketplace}>
                      {getMarketplaceIcon(card.marketplace)} {card.marketplace}
                    </span>
                  </div>
                  <div className={s.cardDetails}>
                    <div className={s.availability}>
                      <span
                        className={s.availabilityDot}
                        style={{ backgroundColor: getAvailabilityColor(card.availability) }}
                      />
                      {card.availability.replace('_', ' ')}
                    </div>
                    <div className={s.priceRanges}>
                      <span className={s.priceRangeItem}>
                        Low: {formatPrice(card.priceRanges.low, card.currency)}
                      </span>
                      <span className={s.priceRangeItem}>
                        High: {formatPrice(card.priceRanges.high, card.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className={s.noResults}>
              <p>No cards found. Try adjusting your search criteria.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};