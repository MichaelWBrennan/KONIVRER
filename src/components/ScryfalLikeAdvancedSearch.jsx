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
      white: false,
      blue: false,
      black: false,
      red: false,
      green: false,
      colorless: false
    },
    colorComparison: 'exactly',
    commander: {
      white: false,
      blue: false,
      black: false,
      red: false,
      green: false,
      colorless: false
    },
    manaCost: '',
    stats: {
      stat1: 'manaValue',
      requirement1: 'equal',
      value1: ''
    },
    games: {
      paper: true,
      arena: false,
      mtgo: false
    },
    formats: {
      status1: 'legal',
      format1: ''
    },
    sets: {
      set: '',
      blockOrGroup: ''
    },
    rarity: {
      common: false,
      uncommon: false,
      rare: false,
      mythic: false
    },
    criteria: '',
    allowPartialCriteria: false,
    prices: {
      currency1: 'usd',
      requirement1: 'lessThan',
      value1: ''
    },
    artist: '',
    flavorText: '',
    loreFinder: '',
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

  // KONIVRER-specific adaptations
  const konivrElements = [
    { key: 'white', label: 'Brilliance', symbol: '{B}', color: '#FFD700' },
    { key: 'blue', label: 'Chaos', symbol: '{C}', color: '#FF4500' },
    { key: 'black', label: 'Decay', symbol: '{D}', color: '#8B4513' },
    { key: 'red', label: 'Growth', symbol: '{G}', color: '#228B22' },
    { key: 'green', label: 'Harmony', symbol: '{H}', color: '#87CEEB' },
    { key: 'colorless', label: 'Void', symbol: '{V}', color: '#696969' }
  ];

  const konivrTypes = [
    'Elemental', 'Familiar', 'Spell', 'Enchantment', 'Artifact', 'Land', 'Token'
  ];

  const konivrStats = [
    { value: 'manaValue', label: 'Mana Value' },
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'strength', label: 'Strength' }
  ];

  const konivrFormats = [
    'Standard', 'Modern', 'Legacy', 'Vintage', 'Commander', 'Limited'
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
          <h1 className="text-3xl font-bold text-center mb-8">Advanced Search</h1>

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

          {/* Commander */}
          <div className="search-section">
            <label className="search-label">Commander</label>
            <fieldset className="element-fieldset">
              <legend>Commander elements</legend>
              <div className="element-grid">
                {konivrElements.map(element => (
                  <label key={element.key} className="element-label">
                    <input
                      type="checkbox"
                      checked={searchCriteria.commander[element.key]}
                      onChange={(e) => updateCriteria(`commander.${element.key}`, e.target.checked)}
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
              Select your commanders' element identity, and only cards that fit in your deck will be returned.
            </p>
          </div>

          {/* Mana Cost */}
          <div className="search-section">
            <label className="search-label">Mana Cost</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Any mana symbols, e.g. &quot;{B}{H}&quot;"
                value={searchCriteria.manaCost}
                onChange={(e) => updateCriteria('manaCost', e.target.value)}
              />
              <button className="add-symbol-btn">
                <Plus className="w-4 h-4" />
                Add symbol
              </button>
            </div>
            <p className="search-help-text">
              Find cards with this exact mana cost.
            </p>
          </div>

          {/* Stats */}
          <div className="search-section">
            <label className="search-label">Stats</label>
            <div className="stats-group">
              <div className="stats-row">
                <label className="search-label">Stat 1</label>
                <select
                  className="search-select"
                  value={searchCriteria.stats.stat1}
                  onChange={(e) => updateCriteria('stats.stat1', e.target.value)}
                >
                  {konivrStats.map(stat => (
                    <option key={stat.value} value={stat.value}>{stat.label}</option>
                  ))}
                </select>
                
                <label className="search-label">Stat 1 requirement</label>
                <select
                  className="search-select"
                  value={searchCriteria.stats.requirement1}
                  onChange={(e) => updateCriteria('stats.requirement1', e.target.value)}
                >
                  <option value="equal">equal to</option>
                  <option value="lessThan">less than</option>
                  <option value="greaterThan">greater than</option>
                  <option value="lessThanOrEqual">less than or equal to</option>
                  <option value="greaterThanOrEqual">greater than or equal to</option>
                  <option value="notEqual">not equal to</option>
                </select>
                
                <label className="search-label">Stat 1 value</label>
                <input
                  type="number"
                  className="search-input"
                  placeholder="Any value, e.g. &quot;2&quot;"
                  value={searchCriteria.stats.value1}
                  onChange={(e) => updateCriteria('stats.value1', e.target.value)}
                />
              </div>
            </div>
            <p className="search-help-text">
              Restrict cards based on their numeric statistics. Cards without stats will not be returned.
            </p>
          </div>

          {/* Games */}
          <div className="search-section">
            <label className="search-label">Games</label>
            <fieldset className="games-fieldset">
              <legend>Games</legend>
              <div className="games-grid">
                <label className="games-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.games.paper}
                    onChange={(e) => updateCriteria('games.paper', e.target.checked)}
                  />
                  Paper
                </label>
                <label className="games-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.games.arena}
                    onChange={(e) => updateCriteria('games.arena', e.target.checked)}
                  />
                  Arena
                </label>
                <label className="games-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.games.mtgo}
                    onChange={(e) => updateCriteria('games.mtgo', e.target.checked)}
                  />
                  KONIVRER Online
                </label>
              </div>
            </fieldset>
            <p className="search-help-text">
              Include or exclude cards appearing in paper, Arena, or KONIVRER Online.
            </p>
          </div>

          {/* Formats */}
          <div className="search-section">
            <label className="search-label">Formats</label>
            <div className="formats-group">
              <div className="formats-row">
                <label className="search-label">Format Status 1</label>
                <select
                  className="search-select"
                  value={searchCriteria.formats.status1}
                  onChange={(e) => updateCriteria('formats.status1', e.target.value)}
                >
                  <option value="legal">Legal</option>
                  <option value="restricted">Restricted</option>
                  <option value="banned">Banned</option>
                </select>
                
                <label className="search-label">Format 1</label>
                <select
                  className="search-select"
                  value={searchCriteria.formats.format1}
                  onChange={(e) => updateCriteria('formats.format1', e.target.value)}
                >
                  <option value="">Select format</option>
                  {konivrFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="search-help-text">
              Future Standard lets you brew using the upcoming standard additions/rotations.
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
                
                <label className="search-label">Block or Group</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter a block name or choose from the list"
                  value={searchCriteria.sets.blockOrGroup}
                  onChange={(e) => updateCriteria('sets.blockOrGroup', e.target.value)}
                />
              </div>
            </div>
            <p className="search-help-text">
              Restrict cards based on their set, block, or group.
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
                <label className="rarity-label">
                  <input
                    type="checkbox"
                    checked={searchCriteria.rarity.mythic}
                    onChange={(e) => updateCriteria('rarity.mythic', e.target.checked)}
                  />
                  Mythic Rare
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

          {/* Prices */}
          <div className="search-section">
            <label className="search-label">Prices</label>
            <div className="prices-group">
              <div className="prices-row">
                <label className="search-label">Currency 1</label>
                <select
                  className="search-select"
                  value={searchCriteria.prices.currency1}
                  onChange={(e) => updateCriteria('prices.currency1', e.target.value)}
                >
                  <option value="usd">USD</option>
                  <option value="eur">Euros</option>
                  <option value="tix">KONIVRER Tickets</option>
                </select>
                
                <label className="search-label">Currency 1 requirement</label>
                <select
                  className="search-select"
                  value={searchCriteria.prices.requirement1}
                  onChange={(e) => updateCriteria('prices.requirement1', e.target.value)}
                >
                  <option value="lessThan">less than</option>
                  <option value="greaterThan">greater than</option>
                  <option value="lessThanOrEqual">less than or equal to</option>
                  <option value="greaterThanOrEqual">greater than or equal to</option>
                </select>
                
                <label className="search-label">Currency 1 value</label>
                <input
                  type="number"
                  step="0.01"
                  className="search-input"
                  value={searchCriteria.prices.value1}
                  onChange={(e) => updateCriteria('prices.value1', e.target.value)}
                />
              </div>
            </div>
            <p className="search-help-text">
              Restrict cards based on their price.
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

          {/* Lore Finder */}
          <div className="search-section">
            <label className="search-label">Lore Finder™</label>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                value={searchCriteria.loreFinder}
                onChange={(e) => updateCriteria('loreFinder', e.target.value)}
              />
            </div>
            <p className="search-help-text">
              Enter names or words here and the system will search each part of the card for that word. Great for finding every card that mentions your favorite character or creature type.
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
                  <option value="priceUsd">Sort by Price: USD</option>
                  <option value="priceEur">Sort by Price: EUR</option>
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