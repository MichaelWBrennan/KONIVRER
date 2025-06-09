import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Star, Eye, Copy, Filter, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

const DeckDiscovery = ({ onImportDeck }) => {
  const { decks: allDecks, getPopularDecks, getRecentDecks } = useData();
  const [decks, setDecks] = useState([]);
  const [filters, setFilters] = useState({
    format: '',
    archetype: '',
    timeframe: 'week',
    minPlacement: ''
  });
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'winrate'
  const [selectedDeck, setSelectedDeck] = useState(null);

  // Load and filter real deck data
  useEffect(() => {
    let filteredDecks = [...allDecks];

    // Apply filters
    if (filters.format) {
      filteredDecks = filteredDecks.filter(deck => 
        deck.format?.toLowerCase() === filters.format.toLowerCase()
      );
    }

    if (filters.archetype) {
      filteredDecks = filteredDecks.filter(deck => 
        deck.archetype?.toLowerCase() === filters.archetype.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filteredDecks = getRecentDecks(50);
        break;
      case 'popular':
        filteredDecks = getPopularDecks(50);
        break;
      case 'winrate':
        filteredDecks.sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
        break;
      default:
        break;
    }

    // If no real decks exist, show a helpful message
    if (filteredDecks.length === 0 && allDecks.length === 0) {
      // Create some example decks to show the interface
      const exampleDecks = [
        {
          id: 'example1',
          name: 'Example Fire Deck',
          description: 'Create your own deck to see it here!',
          author: 'System',
          format: 'Standard',
          archetype: 'Example',
          cards: [
            { name: 'Lightning Bolt', quantity: 4 },
            { name: 'Infernal Sprinter', quantity: 3 }
          ],
          createdAt: new Date().toISOString(),
          isExample: true
        }
      ];
      setDecks(exampleDecks);
    } else {
      setDecks(filteredDecks);
    }
  }, [allDecks, filters, sortBy, getRecentDecks, getPopularDecks]);

  const getFilteredDecks = () => {
    return decks.filter(deck => {
      if (filters.format && deck.format !== filters.format) return false;
      if (filters.archetype && deck.archetype !== filters.archetype) return false;
      if (filters.minPlacement && deck.placement > parseInt(filters.minPlacement)) return false;
      
      // Time filter
      const deckDate = new Date(deck.date);
      const now = new Date();
      const daysDiff = (now - deckDate) / (1000 * 60 * 60 * 24);
      
      if (filters.timeframe === 'day' && daysDiff > 1) return false;
      if (filters.timeframe === 'week' && daysDiff > 7) return false;
      if (filters.timeframe === 'month' && daysDiff > 30) return false;
      
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.popularity - a.popularity;
        case 'winrate':
          return b.winRate - a.winRate;
        case 'recent':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  };

  const getPlacementColor = (placement) => {
    if (placement === 1) return 'text-yellow-400';
    if (placement <= 3) return 'text-gray-300';
    if (placement <= 8) return 'text-orange-400';
    return 'text-gray-500';
  };

  const getPlacementIcon = (placement) => {
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    return `#${placement}`;
  };

  const DeckCard = ({ deck }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={() => setSelectedDeck(deck)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{deck.name}</h3>
          <p className="text-sm text-gray-400">{deck.archetype} • {deck.format}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-lg ${getPlacementColor(deck.placement)}`}>
            {getPlacementIcon(deck.placement)}
          </span>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star size={14} />
            <span className="text-sm">{deck.votes}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <Users size={14} />
          <span>{deck.pilot}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{new Date(deck.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye size={14} />
          <span>{deck.views}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">{deck.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {deck.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-green-400">{deck.winRate}% WR</span>
          <span className="text-blue-400">{deck.popularity}% Pop</span>
        </div>
      </div>
    </motion.div>
  );

  const DeckDetails = ({ deck, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{deck.name}</h2>
            <p className="text-gray-400">{deck.archetype} • {deck.format}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">Tournament Info</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Event:</strong> {deck.tournament}</p>
              <p><strong>Pilot:</strong> {deck.pilot}</p>
              <p><strong>Placement:</strong> {getPlacementIcon(deck.placement)}</p>
              <p><strong>Date:</strong> {new Date(deck.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">Performance</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Win Rate:</strong> {deck.winRate}%</p>
              <p><strong>Popularity:</strong> {deck.popularity}%</p>
              <p><strong>Views:</strong> {deck.views}</p>
              <p><strong>Votes:</strong> {deck.votes}</p>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-white mb-2">Deck Stats</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Main Deck:</strong> {deck.cards.reduce((sum, card) => sum + card.quantity, 0)} cards</p>
              <p><strong>Sideboard:</strong> {deck.sideboard.reduce((sum, card) => sum + card.quantity, 0)} cards</p>
              <p><strong>Unique Cards:</strong> {deck.cards.length}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Main Deck</h3>
            <div className="space-y-2">
              {deck.cards.map(card => (
                <div key={card.id} className="flex justify-between bg-gray-700 rounded p-2">
                  <span className="text-white">{card.name}</span>
                  <span className="text-gray-400">×{card.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Sideboard</h3>
            <div className="space-y-2">
              {deck.sideboard.map(card => (
                <div key={card.id} className="flex justify-between bg-gray-700 rounded p-2">
                  <span className="text-white">{card.name}</span>
                  <span className="text-gray-400">×{card.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div className="flex space-x-2">
            {deck.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-700 text-sm text-gray-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${deck.name}\n\n${deck.cards.map(card => 
                    `${card.quantity}x ${card.name}`
                  ).join('\n')}\n\nSideboard:\n${deck.sideboard.map(card => 
                    `${card.quantity}x ${card.name}`
                  ).join('\n')}`
                );
                alert('Deck copied to clipboard!');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button
              onClick={() => {
                onImportDeck(deck);
                onClose();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <span>Import Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Deck Discovery</h1>
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-400" size={20} />
          <span className="text-gray-400">Tournament-winning decks</span>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <select
            value={filters.format}
            onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value }))}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">All Formats</option>
            <option value="Standard">Standard</option>
            <option value="Extended">Extended</option>
            <option value="Legacy">Legacy</option>
          </select>
          
          <select
            value={filters.archetype}
            onChange={(e) => setFilters(prev => ({ ...prev, archetype: e.target.value }))}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="">All Archetypes</option>
            <option value="Aggro">Aggro</option>
            <option value="Control">Control</option>
            <option value="Midrange">Midrange</option>
            <option value="Combo">Combo</option>
          </select>
          
          <select
            value={filters.timeframe}
            onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="winrate">Highest Win Rate</option>
          </select>
          
          <input
            type="number"
            placeholder="Max Placement"
            value={filters.minPlacement}
            onChange={(e) => setFilters(prev => ({ ...prev, minPlacement: e.target.value }))}
            className="bg-gray-700 text-white rounded px-3 py-2"
            min="1"
            max="32"
          />
        </div>
      </div>
      
      {/* Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getFilteredDecks().map(deck => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
      
      {getFilteredDecks().length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Trophy size={48} className="mx-auto mb-4 opacity-50" />
          <p>No decks found matching your criteria</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
      
      {selectedDeck && (
        <DeckDetails 
          deck={selectedDeck} 
          onClose={() => setSelectedDeck(null)}
        />
      )}
    </div>
  );
};

export default DeckDiscovery;