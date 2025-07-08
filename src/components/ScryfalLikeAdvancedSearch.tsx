/**
 * KONIVRER Deck Database - Scryfall-Like Advanced Search
 *
 * An exact replica of Scryfall's advanced search interface adapted for KONIVRER
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import '../styles/scryfall-advanced-search.css';

interface Card {
  id: string; name: string; cost: number; type: 'Familiar' | 'Spell';
  description: string; rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  elements: string[]; keywords: string[]; strength?: number; artist?: string;
}

interface SearchCriteria {
  cardName: string;
  text: string;
  typeLine: string;
  allowPartialTypes: boolean;
  elements: {
    brilliance: boolean;
    chaos: boolean;
    decay: boolean;
    growth: boolean;
    harmony: boolean;
    void: boolean;
  };
  elementComparison: 'exactly' | 'including' | 'atMost';
  commander: {
    brilliance: boolean;
    chaos: boolean;
    decay: boolean;
    growth: boolean;
    harmony: boolean;
    void: boolean;
  };
  manaCost: string;
  stats: {
    stat1: string;
    requirement1: string;
    value1: string;
  };
  rarity: {
    common: boolean;
    rare: boolean;
    epic: boolean;
    legendary: boolean;
  };
  artist: string;
  flavorText: string;
  preferences: {
    display: 'images' | 'text' | 'full';
    order: 'name' | 'cost' | 'rarity' | 'type';
    showAllPrints: boolean;
    includeExtras: boolean;
  };
}

interface ScryfalLikeAdvancedSearchProps {
  cards: Card[];
  onSearchResults: (results: Card[]) => void;
}

const ScryfalLikeAdvancedSearch: React.FC<ScryfalLikeAdvancedSearchProps> = ({ cards, onSearchResults }) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    cardName: '',
    text: '',
    typeLine: '',
    allowPartialTypes: false,
    elements: {
      brilliance: false,
      chaos: false,
      decay: false,
      growth: false,
      harmony: false,
      void: false
    },
    elementComparison: 'exactly',
    commander: {
      brilliance: false,
      chaos: false,
      decay: false,
      growth: false,
      harmony: false,
      void: false
    },
    manaCost: '',
    stats: {
      stat1: 'cost',
      requirement1: 'equal',
      value1: ''
    },
    rarity: {
      common: false,
      rare: false,
      epic: false,
      legendary: false
    },
    artist: '',
    flavorText: '',
    preferences: {
      display: 'images',
      order: 'name',
      showAllPrints: false,
      includeExtras: false
    }
  });

  const [isSearching, setIsSearching] = useState(false);

  // KONIVRER-specific adaptations
  const konivrElements = [
    { key: 'brilliance', label: 'Brilliance', symbol: '{B}', color: '#FFD700', mappedElements: ['Fire'] },
    { key: 'chaos', label: 'Chaos', symbol: '{C}', color: '#FF4500', mappedElements: ['Air', 'Fire'] },
    { key: 'decay', label: 'Decay', symbol: '{D}', color: '#8B4513', mappedElements: ['Shadow'] },
    { key: 'growth', label: 'Growth', symbol: '{G}', color: '#228B22', mappedElements: ['Earth'] },
    { key: 'harmony', label: 'Harmony', symbol: '{H}', color: '#87CEEB', mappedElements: ['Water'] },
    { key: 'void', label: 'Void', symbol: '{V}', color: '#696969', mappedElements: [] }
  ];

  const konivrTypes = [
    'Familiar', 'Spell', 'Elemental', 'Enchantment', 'Artifact', 'Land', 'Token'
  ];

  const konivrStats = [
    { value: 'cost', label: 'Mana Cost' },
    { value: 'strength', label: 'Strength' }
  ];

  const requirements = [
    { value: 'equal', label: '=' },
    { value: 'notEqual', label: '≠' },
    { value: 'lessThan', label: '<' },
    { value: 'lessEqual', label: '≤' },
    { value: 'greater', label: '>' },
    { value: 'greaterEqual', label: '≥' }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    
    try {
      const results = cards.filter(card => {
        // Card name filter
        if (searchCriteria.cardName && !card.name.toLowerCase().includes(searchCriteria.cardName.toLowerCase())) {
          return false;
        }

        // Text filter (description and keywords)
        if (searchCriteria.text) {
          const textLower = searchCriteria.text.toLowerCase();
          const matchesDescription = card.description.toLowerCase().includes(textLower);
          const matchesKeywords = card.keywords.some(keyword => keyword.toLowerCase().includes(textLower));
          if (!matchesDescription && !matchesKeywords) {
            return false;
          }
        }

        // Type filter
        if (searchCriteria.typeLine) {
          if (searchCriteria.allowPartialTypes) {
            if (!card.type.toLowerCase().includes(searchCriteria.typeLine.toLowerCase())) {
              return false;
            }
          } else {
            if (card.type.toLowerCase() !== searchCriteria.typeLine.toLowerCase()) {
              return false;
            }
          }
        }

        // Element filter
        const selectedElements = Object.entries(searchCriteria.elements)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => {
            const element = konivrElements.find(e => e.key === key);
            return element?.mappedElements || [];
          })
          .flat();

        if (selectedElements.length > 0) {
          const cardElements = card.elements;
          
          switch (searchCriteria.elementComparison) {
            case 'exactly':
              if (selectedElements.length !== cardElements.length || 
                  !selectedElements.every(e => cardElements.includes(e))) {
                return false;
              }
              break;
            case 'including':
              if (!selectedElements.every(e => cardElements.includes(e))) {
                return false;
              }
              break;
            case 'atMost':
              if (!cardElements.every(e => selectedElements.includes(e))) {
                return false;
              }
              break;
          }
        }

        // Stats filter
        if (searchCriteria.stats.value1) {
          const statValue = searchCriteria.stats.stat1 === 'cost' ? card.cost : card.strength || 0;
          const targetValue = parseInt(searchCriteria.stats.value1);
          
          if (!isNaN(targetValue)) {
            switch (searchCriteria.stats.requirement1) {
              case 'equal':
                if (statValue !== targetValue) return false;
                break;
              case 'notEqual':
                if (statValue === targetValue) return false;
                break;
              case 'lessThan':
                if (statValue >= targetValue) return false;
                break;
              case 'lessEqual':
                if (statValue > targetValue) return false;
                break;
              case 'greater':
                if (statValue <= targetValue) return false;
                break;
              case 'greaterEqual':
                if (statValue < targetValue) return false;
                break;
            }
          }
        }

        // Rarity filter
        const selectedRarities = Object.entries(searchCriteria.rarity)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1));

        if (selectedRarities.length > 0 && !selectedRarities.includes(card.rarity)) {
          return false;
        }

        // Artist filter
        if (searchCriteria.artist && card.artist && 
            !card.artist.toLowerCase().includes(searchCriteria.artist.toLowerCase())) {
          return false;
        }

        return true;
      });

      // Sort results
      const sortedResults = [...results].sort((a, b) => {
        switch (searchCriteria.preferences.order) {
          case 'cost':
            return a.cost - b.cost;
          case 'rarity':
            const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
          case 'type':
            return a.type.localeCompare(b.type);
          default:
            return a.name.localeCompare(b.name);
        }
      });

      onSearchResults(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const updateCriteria = (path: string, value: any) => {
    setSearchCriteria(prev => {
      const newCriteria = { ...prev };
      const keys = path.split('.');
      let current: any = newCriteria;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newCriteria;
    });
  };

  const clearAllFilters = () => {
    setSearchCriteria({
      cardName: '',
      text: '',
      typeLine: '',
      allowPartialTypes: false,
      elements: {
        brilliance: false,
        chaos: false,
        decay: false,
        growth: false,
        harmony: false,
        void: false
      },
      elementComparison: 'exactly',
      commander: {
        brilliance: false,
        chaos: false,
        decay: false,
        growth: false,
        harmony: false,
        void: false
      },
      manaCost: '',
      stats: {
        stat1: 'cost',
        requirement1: 'equal',
        value1: ''
      },
      rarity: {
        common: false,
        rare: false,
        epic: false,
        legendary: false
      },
      artist: '',
      flavorText: '',
      preferences: {
        display: 'images',
        order: 'name',
        showAllPrints: false,
        includeExtras: false
      }
    });
    onSearchResults(cards);
  };

  return (
    <div className="scryfall-advanced-search">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#d4af37' }}>
            Advanced Card Search
          </h1>

          {/* Card Name */}
          <div className="search-section">
            <label className="search-label">Card Name</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Any words in the name, e.g. &quot;Fire&quot;"
                value={searchCriteria.cardName}
                onChange={(e) => updateCriteria('cardName', e.target.value)}
              />
            </div>
          </div>

          {/* Text */}
          <div className="search-section">
            <label className="search-label">Text</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Any text, e.g. &quot;draw a card&quot;"
                value={searchCriteria.text}
                onChange={(e) => updateCriteria('text', e.target.value)}
              />
            </div>
            <p className="search-help-text">
              Enter text that should appear in the rules box or keywords. Word order doesn't matter.
            </p>
          </div>

          {/* Type Line */}
          <div className="search-section">
            <label className="search-label">Type Line</label>
            <div className="search-input-group">
              <select
                className="search-select"
                value={searchCriteria.typeLine}
                onChange={(e) => updateCriteria('typeLine', e.target.value)}
              >
                <option value="">Enter a type or choose from the list</option>
                {konivrTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="search-checkbox-group">
              <label className="search-checkbox-label">
                <input
                  type="checkbox"
                  checked={searchCriteria.allowPartialTypes}
                  onChange={(e) => updateCriteria('allowPartialTypes', e.target.checked)}
                />
                Allow partial type matches
              </label>
            </div>
            <p className="search-help-text">
              Choose any card type, supertype, or subtypes to match.
            </p>
          </div>

          {/* Elements */}
          <div className="search-section">
            <label className="search-label">Elements</label>
            <div className="element-selection">
              <fieldset className="element-fieldset">
                <legend>Card elements</legend>
                <div className="element-grid">
                  {konivrElements.map(element => (
                    <label key={element.key} className="element-label">
                      <input
                        type="checkbox"
                        checked={searchCriteria.elements[element.key as keyof typeof searchCriteria.elements]}
                        onChange={(e) => updateCriteria(`elements.${element.key}`, e.target.checked)}
                      />
                      <span className="element-symbol" style={{ color: element.color }}>
                        {element.symbol}
                      </span>
                      {element.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="element-comparison">
                <label className="search-label">Element Comparison</label>
                <select
                  className="search-select"
                  value={searchCriteria.elementComparison}
                  onChange={(e) => updateCriteria('elementComparison', e.target.value)}
                >
                  <option value="exactly">Exactly these elements</option>
                  <option value="including">Including these elements</option>
                  <option value="atMost">At most these elements</option>
                </select>
              </div>
            </div>
            <p className="search-help-text">
              "Including" means cards that have all the elements you select, with or without any others. "At most" means cards that have some or all of the elements you select.
            </p>
          </div>

          {/* Stats */}
          <div className="search-section">
            <label className="search-label">Stats</label>
            <div className="stats-group">
              <div className="stats-row">
                <select
                  className="search-select"
                  value={searchCriteria.stats.stat1}
                  onChange={(e) => updateCriteria('stats.stat1', e.target.value)}
                >
                  {konivrStats.map(stat => (
                    <option key={stat.value} value={stat.value}>{stat.label}</option>
                  ))}
                </select>
                <select
                  className="search-select"
                  value={searchCriteria.stats.requirement1}
                  onChange={(e) => updateCriteria('stats.requirement1', e.target.value)}
                >
                  {requirements.map(req => (
                    <option key={req.value} value={req.value}>{req.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="search-input"
                  placeholder="Value"
                  value={searchCriteria.stats.value1}
                  onChange={(e) => updateCriteria('stats.value1', e.target.value)}
                />
              </div>
            </div>
            <p className="search-help-text">
              Compare numeric values like mana cost or strength.
            </p>
          </div>

          {/* Rarity */}
          <div className="search-section">
            <label className="search-label">Rarity</label>
            <fieldset className="element-fieldset">
              <legend>Card rarity</legend>
              <div className="element-grid">
                {['common', 'rare', 'epic', 'legendary'].map(rarity => (
                  <label key={rarity} className="element-label">
                    <input
                      type="checkbox"
                      checked={searchCriteria.rarity[rarity as keyof typeof searchCriteria.rarity]}
                      onChange={(e) => updateCriteria(`rarity.${rarity}`, e.target.checked)}
                    />
                    <span style={{ 
                      color: rarity === 'legendary' ? '#ff6b35' : 
                             rarity === 'epic' ? '#9d4edd' :
                             rarity === 'rare' ? '#3a86ff' : '#ccc',
                      fontWeight: 'bold'
                    }}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Artist */}
          <div className="search-section">
            <label className="search-label">Artist</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Artist name"
                value={searchCriteria.artist}
                onChange={(e) => updateCriteria('artist', e.target.value)}
              />
            </div>
            <p className="search-help-text">
              Search for cards by a specific artist.
            </p>
          </div>

          {/* Preferences */}
          <div className="search-section">
            <label className="search-label">Display Preferences</label>
            <div className="stats-group">
              <div className="stats-row">
                <div>
                  <label className="search-label">Display</label>
                  <select
                    className="search-select"
                    value={searchCriteria.preferences.display}
                    onChange={(e) => updateCriteria('preferences.display', e.target.value)}
                  >
                    <option value="images">Images</option>
                    <option value="text">Text</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                <div>
                  <label className="search-label">Sort by</label>
                  <select
                    className="search-select"
                    value={searchCriteria.preferences.order}
                    onChange={(e) => updateCriteria('preferences.order', e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="cost">Mana Cost</option>
                    <option value="rarity">Rarity</option>
                    <option value="type">Type</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Search Buttons */}
          <div className="search-section">
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="search-button primary"
                style={{
                  background: '#d4af37',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="search-button secondary"
                style={{
                  background: 'transparent',
                  color: '#d4af37',
                  border: '1px solid #d4af37',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Clear All
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScryfalLikeAdvancedSearch;