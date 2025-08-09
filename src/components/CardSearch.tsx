import { useState, useMemo } from 'react';
import { Card, cardDatabase } from '../data/cards';

interface CardSearchProps {
  onCardSelect?: (card: Card) => void;
}

export const CardSearch: React.FC<CardSearchProps> = ({ onCardSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elementFilter, setElementFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');

  // Get unique values for filters
  const elements = useMemo(() => 
    [...new Set(cardDatabase.map(card => card.element))].sort(), []);
  const types = useMemo(() => 
    [...new Set(cardDatabase.map(card => card.type))].sort(), []);
  const rarities = useMemo(() => 
    [...new Set(cardDatabase.map(card => card.rarity))].sort(), []);

  // Filter cards based on search criteria
  const filteredCards = useMemo(() => {
    return cardDatabase.filter(card => {
      const matchesSearch = searchTerm === '' || 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesElement = elementFilter === '' || card.element === elementFilter;
      const matchesType = typeFilter === '' || card.type === typeFilter;
      const matchesRarity = rarityFilter === '' || card.rarity === rarityFilter;

      return matchesSearch && matchesElement && matchesType && matchesRarity;
    });
  }, [searchTerm, elementFilter, typeFilter, rarityFilter]);

  return (
    <div>
      <div className="search-container">
        <h1 className="nav-title">Card Search</h1>
        <input
          type="text"
          placeholder="Search cards by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="filters">
          <select 
            value={elementFilter} 
            onChange={(e) => setElementFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Elements</option>
            {elements.map(element => (
              <option key={element} value={element}>{element}</option>
            ))}
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={rarityFilter} 
            onChange={(e) => setRarityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>

        <div className="results-count">
          {filteredCards.length} cards found
        </div>
      </div>

      <div className="card-grid">
        {filteredCards.map(card => (
          <div 
            key={card.id} 
            className="card-item"
            onClick={() => onCardSelect?.(card)}
            style={{ cursor: onCardSelect ? 'pointer' : 'default' }}
          >
            <img 
              src={card.webpUrl} 
              alt={card.name}
              className="card-image"
              onError={(e) => {
                // Fallback to PNG if WebP fails
                (e.target as HTMLImageElement).src = card.imageUrl;
              }}
            />
            <div className="card-info">
              <div className="card-name">{card.name}</div>
              <div className="card-details">
                <div>{card.element} {card.type} • {card.rarity}</div>
                <div>Cost: {card.cost}</div>
                {card.power !== undefined && card.toughness !== undefined && (
                  <div>Power/Toughness: {card.power}/{card.toughness}</div>
                )}
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  {card.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};