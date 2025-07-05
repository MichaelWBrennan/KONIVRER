/**
 * KONIVRER Deck Database - Scryfall-Like Advanced Search
 * 
 * An exact replica of Scryfall's advanced search interface adapted for KONIVRER
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { searchCards } from '../utils/comprehensiveSearchEngine';

const ScryfalLikeAdvancedSearch = () => {
  const { cards, loading } = useData();
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    cardName: '',
    text: '',
    typeLine: '',
    allowPartialTypes: false,
    colors: {
      fire: false,
      water: false,
      earth: false,
      air: false,
      aether: false,
      nether: false,
      generic: false
    },
    colorComparison: 'exactly',
    flag: {
      fire: false,
      water: false,
      earth: false,
      air: false,
      aether: false,
      nether: false,
      generic: false
    },
    cost: '',


    sets: {
      set: ''
    },
    rarity: {
      common: false,
      uncommon: false,
      rare: false
    },
    criteria: '',
    allowPartialCriteria: false,
    artist: '',
    flavorText: '',

    language: 'default',
    preferences: {
      display: 'images',
      order: 'name',
      showAllPrints: false,
      includeExtras: false
    }
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // KONIVRER-specific adaptations - using alchemical symbols for classic elements
  const konivrElements = [
    { key: 'fire', label: 'Fire', symbol: '🜂', color: '#000000' },
    { key: 'water', label: 'Water', symbol: '🜄', color: '#000000' },
    { key: 'earth', label: 'Earth', symbol: '🜃', color: '#000000' },
    { key: 'air', label: 'Air', symbol: '🜁', color: '#000000' },
    { key: 'aether', label: 'Aether', symbol: '○', color: '#000000' },
    { key: 'nether', label: 'Nether', symbol: '□', color: '#000000' },
    { key: 'generic', label: 'Generic', symbol: '✡︎⃝', color: '#000000' }
  ];

  const konivrTypes = [
    'Elemental', 'Familiar', 'Spell', 'Enchantment', 'Artifact', 'Land', 'Token'
  ];





  const handleSearch = async () => {
    if (!cards) return;
    
    setIsSearching(true);
    try {
      const results = await searchCards(cards, searchCriteria);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const updateCriteria = (path, value) => {
    setSearchCriteria(prev => {
      const newCriteria = { ...prev };
      const keys = path.split('.');
      let current = newCriteria;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newCriteria;
    });
  };

  return (
    <div className="scryfall-advanced-search">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >


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
              <button className="add-symbol-btn">
                <Plus className="w-4 h-4" />
                Add symbol
              </button>
            </div>
            <p className="search-help-text">
              Enter text that should appear in the rules box. You can use ~ as a placeholder for the card name. Word order doesn't matter.
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
              Choose any card type, supertype, or subtypes to match. Click the "IS" or "NOT" button to toggle between including and excluding a type.
            </p>
          </div>

          {/* Elements (Colors) */}
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
                        checked={searchCriteria.colors[element.key]}
                        onChange={(e) => updateCriteria(`colors.${element.key}`, e.target.checked)}
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
                  value={searchCriteria.colorComparison}
                  onChange={(e) => updateCriteria('colorComparison', e.target.value)}
                >
                  <option value="exactly">Exactly these elements</option>
                  <option value="including">Including these elements</option>
                  <option value="atMost">At most these elements</option>
                </select>
              </div>
            </div>
            <p className="search-help-text">
              "Including" means cards that are all the elements you select, with or without any others. "At most" means cards that have some or all of the elements you select, plus void.
            </p>
          </div>

          {/* Flag */}
          <div className="search-section">
            <label className="search-label">Flag</label>
            <fieldset className="element-fieldset">
              <legend>Flag elements</legend>
              <div className="element-grid">
                {konivrElements.map(element => (
                  <label key={element.key} className="element-label">
                    <input
                      type="checkbox"
                      checked={searchCriteria.flag[element.key]}
                      onChange={(e) => updateCriteria(`flag.${element.key}`, e.target.checked)}
                    />
                    <span className="element-symbol" style={{ color: element.color }}>
                      {element.symbol}
                    </span>
                    {element.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="search-help-text">
              Select your flag's element identity, and only cards that fit in your deck will be returned.
            </p>
          </div>

          {/* Cost */}
          <div className="search-section">
            <label className="search-label">Cost</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Any mana symbols, e.g. &quot;{B}{H}&quot;"
                value={searchCriteria.cost}
                onChange={(e) => updateCriteria('cost', e.target.value)}
              />
              <button className="add-symbol-btn">
                <Plus className="w-4 h-4" />
                Add symbol
              </button>
            </div>
            <p className="search-help-text">
              Find cards with this exact cost.
            </p>
          </div>



          {/* Sets */}
          <div className="search-section">
            <label className="search-label">Sets</label>
            <div className="sets-group">
              <div className="sets-row">
                <label className="search-label">Set</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter a set name or choose from the list"
                  value={searchCriteria.sets.set}
                  onChange={(e) => updateCriteria('sets.set', e.target.value)}
                />
              </div>
            </div>
            <p className="search-help-text">
              Restrict cards based on their set.
            </p>
          </div>

          {/* Rarity */}
          <div className="search-section">
            <label className="search-label">Rarity</label>
            <fieldset className="rarity-fieldset">
              <legend>Desired rarities</legend>
              <div className="rarity-grid">
                <label className="rarity-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.rarity.common}
                    onChange={(e) => updateCriteria('rarity.common', e.target.checked)}
                  />
                  Common
                </label>
                <label className="rarity-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.rarity.uncommon}
                    onChange={(e) => updateCriteria('rarity.uncommon', e.target.checked)}
                  />
                  Uncommon
                </label>
                <label className="rarity-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.rarity.rare}
                    onChange={(e) => updateCriteria('rarity.rare', e.target.checked)}
                  />
                  Rare
                </label>
              </div>
            </fieldset>
            <p className="search-help-text">
              Only return cards of the selected rarities.
            </p>
          </div>

          {/* Criteria */}
          <div className="search-section">
            <label className="search-label">Criteria</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Enter a criterion or choose from the list"
                value={searchCriteria.criteria}
                onChange={(e) => updateCriteria('criteria', e.target.value)}
              />
            </div>
            <div className="search-checkbox-group">
              <label className="search-checkbox-label">
                <input
                  type="checkbox"
                  checked={searchCriteria.allowPartialCriteria}
                  onChange={(e) => updateCriteria('allowPartialCriteria', e.target.checked)}
                />
                Allow partial criteria matches
              </label>
            </div>
            <p className="search-help-text">
              Enter any card criteria to match, in any order. Click the "IS" or "NOT" button to toggle between including and excluding an item.
            </p>
          </div>



          {/* Artist */}
          <div className="search-section">
            <label className="search-label">Artist</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                value={searchCriteria.artist}
                onChange={(e) => updateCriteria('artist', e.target.value)}
              />
            </div>
          </div>

          {/* Flavor Text */}
          <div className="search-section">
            <label className="search-label">Flavor Text</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                value={searchCriteria.flavorText}
                onChange={(e) => updateCriteria('flavorText', e.target.value)}
              />
            </div>
            <p className="search-help-text">
              Enter words that should appear in the flavor text. Word order doesn't matter.
            </p>
          </div>


          {/* Language */}
          <div className="search-section">
            <label className="search-label">Language</label>
            <div className="search-input-group">
              <select
                className="search-select"
                value={searchCriteria.language}
                onChange={(e) => updateCriteria('language', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="any">Any</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <p className="search-help-text">
              Specify a language to return results in.
            </p>
          </div>

          {/* Preferences */}
          <div className="search-section">
            <label className="search-label">Preferences</label>
            <div className="preferences-group">
              <div className="preferences-row">
                <label className="search-label">Display</label>
                <select
                  className="search-select"
                  value={searchCriteria.preferences.display}
                  onChange={(e) => updateCriteria('preferences.display', e.target.value)}
                >
                  <option value="images">Display as Images</option>
                  <option value="checklist">Display as Checklist</option>
                  <option value="text">Display as Text Only</option>
                  <option value="full">Display as Full</option>
                </select>
                
                <label className="search-label">Order</label>
                <select
                  className="search-select"
                  value={searchCriteria.preferences.order}
                  onChange={(e) => updateCriteria('preferences.order', e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="releaseDate">Sort by Release Date</option>
                  <option value="setNumber">Sort by Set/Number</option>
                  <option value="rarity">Sort by Rarity</option>
                  <option value="element">Sort by Element</option>
                  <option value="manaValue">Sort by Mana Value</option>
                  <option value="attack">Sort by Attack</option>
                  <option value="defense">Sort by Defense</option>
                  <option value="strength">Sort by Strength</option>
                  <option value="artist">Sort by Artist Name</option>
                </select>
              </div>
              
              <div className="preferences-checkboxes">
                <label className="search-checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.preferences.showAllPrints}
                    onChange={(e) => updateCriteria('preferences.showAllPrints', e.target.checked)}
                  />
                  Show all card prints
                </label>
                <label className="search-checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.preferences.includeExtras}
                    onChange={(e) => updateCriteria('preferences.includeExtras', e.target.checked)}
                  />
                  Include extra cards (tokens, planes, schemes, etc)
                </label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-button-section">
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={isSearching || loading}
            >
              <Search className="w-5 h-5 mr-2" />
              {isSearching ? 'Searching...' : 'Search with these options'}
            </button>
          </div>

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h2 className="text-xl font-semibold mb-4">
                {searchResults.length} cards found
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((card, index) => (
                  <div key={index} className="card-result">
                    <div className="card-image-placeholder">
                      {card.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ScryfalLikeAdvancedSearch;