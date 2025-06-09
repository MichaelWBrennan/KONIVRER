import { useState, useEffect } from 'react';
import { Plus, Minus, Heart, Star, Package, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectionManager = ({ cards }) => {
  const [collection, setCollection] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('owned'); // 'owned', 'missing', 'wishlist', 'stats'
  const [filters, setFilters] = useState({
    rarity: '',
    set: '',
    type: '',
    owned: 'all' // 'all', 'owned', 'missing'
  });

  // Load collection from localStorage
  useEffect(() => {
    const savedCollection = localStorage.getItem('konivrer-collection');
    const savedWishlist = localStorage.getItem('konivrer-wishlist');
    
    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save collection to localStorage
  useEffect(() => {
    localStorage.setItem('konivrer-collection', JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem('konivrer-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const updateCardQuantity = (cardId, quantity) => {
    setCollection(prev => ({
      ...prev,
      [cardId]: Math.max(0, quantity)
    }));
  };

  const toggleWishlist = (cardId) => {
    setWishlist(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const getOwnedQuantity = (cardId) => collection[cardId] || 0;
  const isInWishlist = (cardId) => wishlist.includes(cardId);

  const getCollectionStats = () => {
    const totalCards = cards.length;
    const ownedCards = Object.keys(collection).filter(id => collection[id] > 0).length;
    const totalOwned = Object.values(collection).reduce((sum, qty) => sum + qty, 0);
    
    const rarityStats = {};
    const setStats = {};
    
    cards.forEach(card => {
      const owned = getOwnedQuantity(card.id);
      
      // Rarity stats
      if (!rarityStats[card.rarity]) {
        rarityStats[card.rarity] = { total: 0, owned: 0, ownedCards: 0 };
      }
      rarityStats[card.rarity].total++;
      if (owned > 0) {
        rarityStats[card.rarity].ownedCards++;
        rarityStats[card.rarity].owned += owned;
      }
      
      // Set stats
      if (!setStats[card.set]) {
        setStats[card.set] = { total: 0, owned: 0, ownedCards: 0 };
      }
      setStats[card.set].total++;
      if (owned > 0) {
        setStats[card.set].ownedCards++;
        setStats[card.set].owned += owned;
      }
    });

    return {
      totalCards,
      ownedCards,
      totalOwned,
      completionPercentage: (ownedCards / totalCards) * 100,
      rarityStats,
      setStats,
      wishlistCount: wishlist.length
    };
  };

  const getFilteredCards = () => {
    return cards.filter(card => {
      const owned = getOwnedQuantity(card.id);
      
      // Ownership filter
      if (filters.owned === 'owned' && owned === 0) return false;
      if (filters.owned === 'missing' && owned > 0) return false;
      
      // Other filters
      if (filters.rarity && card.rarity !== filters.rarity) return false;
      if (filters.set && card.set !== filters.set) return false;
      if (filters.type && card.type !== filters.type) return false;
      
      // View mode filter
      if (viewMode === 'owned' && owned === 0) return false;
      if (viewMode === 'missing' && owned > 0) return false;
      if (viewMode === 'wishlist' && !isInWishlist(card.id)) return false;
      
      return true;
    });
  };

  const CollectionStats = () => {
    const stats = getCollectionStats();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="text-blue-400" size={20} />
            <h3 className="font-medium text-white">Collection</h3>
          </div>
          <div className="text-2xl font-bold text-white">{stats.ownedCards}/{stats.totalCards}</div>
          <div className="text-sm text-gray-400">{stats.completionPercentage.toFixed(1)}% complete</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <h3 className="font-medium text-white">Total Cards</h3>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalOwned}</div>
          <div className="text-sm text-gray-400">Cards owned</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="text-red-400" size={20} />
            <h3 className="font-medium text-white">Wishlist</h3>
          </div>
          <div className="text-2xl font-bold text-white">{stats.wishlistCount}</div>
          <div className="text-sm text-gray-400">Cards wanted</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="text-yellow-400" size={20} />
            <h3 className="font-medium text-white">Value</h3>
          </div>
          <div className="text-2xl font-bold text-white">$0</div>
          <div className="text-sm text-gray-400">Estimated value</div>
        </div>
      </div>
    );
  };

  const CardGrid = () => {
    const filteredCards = getFilteredCards();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map(card => {
          const owned = getOwnedQuantity(card.id);
          const inWishlist = isInWishlist(card.id);
          
          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white truncate">{card.name}</h3>
                <button
                  onClick={() => toggleWishlist(card.id)}
                  className={`p-1 rounded ${inWishlist ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors`}
                >
                  <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <span>{card.elements.join('')}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  card.rarity === 'common' ? 'bg-gray-600' :
                  card.rarity === 'uncommon' ? 'bg-green-600' :
                  card.rarity === 'rare' ? 'bg-blue-600' :
                  'bg-purple-600'
                }`}>
                  {card.rarity}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">{card.text}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCardQuantity(card.id, owned - 1)}
                    disabled={owned === 0}
                    className="p-1 text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white font-medium w-8 text-center">{owned}</span>
                  <button
                    onClick={() => updateCardQuantity(card.id, owned + 1)}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-400">
                  Cost: {card.cost}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Collection Manager</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('owned')}
            className={`px-3 py-1 rounded ${viewMode === 'owned' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Owned
          </button>
          <button
            onClick={() => setViewMode('missing')}
            className={`px-3 py-1 rounded ${viewMode === 'missing' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Missing
          </button>
          <button
            onClick={() => setViewMode('wishlist')}
            className={`px-3 py-1 rounded ${viewMode === 'wishlist' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Wishlist
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-3 py-1 rounded ${viewMode === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Stats
          </button>
        </div>
      </div>

      <CollectionStats />

      {viewMode !== 'stats' && (
        <>
          {/* Filters */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-400" />
              
              <select
                value={filters.rarity}
                onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="mythic">Mythic</option>
              </select>
              
              <select
                value={filters.set}
                onChange={(e) => setFilters(prev => ({ ...prev, set: e.target.value }))}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="">All Sets</option>
                <option value="Core Set">Core Set</option>
                <option value="Expansion 1">Expansion 1</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="bg-gray-700 text-white rounded px-3 py-1"
              >
                <option value="">All Types</option>
                <option value="Creature">Creature</option>
                <option value="Spell">Spell</option>
                <option value="Equipment">Equipment</option>
                <option value="Artifact">Artifact</option>
              </select>
            </div>
          </div>

          <CardGrid />
        </>
      )}

      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">Rarity Breakdown</h3>
            {Object.entries(getCollectionStats().rarityStats).map(([rarity, stats]) => (
              <div key={rarity} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 capitalize">{rarity}</span>
                  <span className="text-white">{stats.ownedCards}/{stats.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      rarity === 'common' ? 'bg-gray-500' :
                      rarity === 'uncommon' ? 'bg-green-500' :
                      rarity === 'rare' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${(stats.ownedCards / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">Set Completion</h3>
            {Object.entries(getCollectionStats().setStats).map(([set, stats]) => (
              <div key={set} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{set}</span>
                  <span className="text-white">{stats.ownedCards}/{stats.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(stats.ownedCards / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManager;