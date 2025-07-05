import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardsData from '../data/cards.json';
import { Search } from 'lucide-react';

const AdvancedSearchPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    type: '',
    element: '',
    cost: '',
    rarity: '',
    set: 'prima-materia',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const elements = [
    { value: '', label: 'Any Element' },
    { value: 'Quintessence', label: 'Quintessence' },
    { value: 'Brilliance', label: 'Brilliance (Aether)' },
    { value: 'Gust', label: 'Gust (Air)' },
    { value: 'Inferno', label: 'Inferno (Fire)' },
    { value: 'Steadfast', label: 'Steadfast (Earth)' },
    { value: 'Submerged', label: 'Submerged (Water)' },
    { value: 'Void', label: 'Void (Nether)' },
  ];

  const rarities = [
    { value: '', label: 'Any Rarity' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
  ];

  const sets = [
    { value: 'prima-materia', label: 'Prima Materia' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter cards based on form data
    const results = cardsData.filter(card => {
      // Name filter
      if (formData.name && !card.name.toLowerCase().includes(formData.name.toLowerCase())) {
        return false;
      }
      
      // Text filter
      if (formData.text && !card.description?.toLowerCase().includes(formData.text.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (formData.type && !card.type?.toLowerCase().includes(formData.type.toLowerCase())) {
        return false;
      }
      
      // Element filter
      if (formData.element && !card.elements?.some(element => 
        element.toLowerCase() === formData.element.toLowerCase()
      )) {
        return false;
      }
      
      // Cost filter
      if (formData.cost) {
        const costValue = parseInt(formData.cost);
        if (!isNaN(costValue)) {
          const cardCost = card.cost?.length || 0;
          if (cardCost !== costValue) {
            return false;
          }
        }
      }
      
      // Rarity filter
      if (formData.rarity) {
        let cardRarity;
        const costCount = card.cost?.length || 0;
        
        if (costCount === 1 || costCount >= 6 || card.name === 'AZOΘ') {
          cardRarity = 'rare';
        } else if (costCount >= 4 && costCount <= 5) {
          cardRarity = 'uncommon';
        } else {
          cardRarity = 'common';
        }
        
        if (cardRarity !== formData.rarity) {
          return false;
        }
      }
      
      // Set filter
      if (formData.set && card.set !== formData.set) {
        return false;
      }
      
      return true;
    });
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleCardSelect = (card) => {
    const cardSet = card.set || 'prima-materia';
    const cardName = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    navigate(`/card/${cardSet}/${card.id}/${cardName}`);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      text: '',
      type: '',
      element: '',
      cost: '',
      rarity: '',
      set: 'prima-materia',
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="container mx-auto px-4 py-0 whitespace-nowrap max-w-4xl">
      <h1 className="text-3xl font-bold text-amber-100 mb-6 text-center">Advanced Search</h1>
      
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-6 mb-8 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Name */}
            <div>
              <label htmlFor="name" className="block text-amber-200 mb-2">Card Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
                placeholder="Search by card name"
              />
            </div>
            
            {/* Card Text */}
            <div>
              <label htmlFor="text" className="block text-amber-200 mb-2">Card Text</label>
              <input
                type="text"
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
                placeholder="Search card text"
              />
            </div>
            
            {/* Card Type */}
            <div>
              <label htmlFor="type" className="block text-amber-200 mb-2">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
                placeholder="e.g. Elemental, Spell"
              />
            </div>
            
            {/* Element */}
            <div>
              <label htmlFor="element" className="block text-amber-200 mb-2">Element</label>
              <select
                id="element"
                name="element"
                value={formData.element}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
              >
                {elements.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Cost */}
            <div>
              <label htmlFor="cost" className="block text-amber-200 mb-2">Cost (Number of Symbols)</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                max="10"
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
                placeholder="e.g. 3"
              />
            </div>
            
            {/* Rarity */}
            <div>
              <label htmlFor="rarity" className="block text-amber-200 mb-2">Rarity</label>
              <select
                id="rarity"
                name="rarity"
                value={formData.rarity}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
              >
                {rarities.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Set */}
            <div>
              <label htmlFor="set" className="block text-amber-200 mb-2">Set</label>
              <select
                id="set"
                name="set"
                value={formData.set}
                onChange={handleInputChange}
                className="w-full bg-amber-950/50 border border-amber-800/40 rounded-lg px-4 py-0 whitespace-nowrap text-amber-100 focus:border-amber-600 focus:outline-none"
              >
                {sets.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-600 text-amber-100 px-6 py-0 whitespace-nowrap rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-md"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="bg-amber-950/50 hover:bg-amber-900 text-amber-300 px-6 py-0 whitespace-nowrap rounded-lg font-medium transition-colors border border-amber-800/40 shadow-md"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      {hasSearched && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-amber-100 mb-4">
            Search Results ({searchResults.length} {searchResults.length === 1 ? 'card' : 'cards'})
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map(card => (
                <div 
                  key={card.id}
                  className="bg-amber-950/30 border border-amber-800/40 rounded-lg overflow-hidden cursor-pointer hover:border-amber-600 transition-colors shadow-md"
                  onClick={() => handleCardSelect(card)}
                >
                  <div className="p-4">
                    <h3 className="font-bold text-amber-100 text-lg mb-1">{card.name}</h3>
                    <p className="text-amber-300/70 text-sm">{card.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-amber-950/30 border border-amber-800/40 rounded-lg">
              <p className="text-amber-300">No cards found matching your criteria.</p>
              <p className="text-amber-400 mt-2">Try adjusting your search parameters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPage;