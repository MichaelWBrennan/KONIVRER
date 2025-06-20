import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Eye,
  Download,
  Heart,
  Star,
  User,
  Calendar,
  BarChart3,
  Zap,
  Trophy,
  Target,
} from 'lucide-react';

const DeckSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    element: 'all',
    rarity: 'all',
    author: 'all',
  });

  // Sample deck data
  const [decks] = useState([
    {
      id: 1,
      name: 'Inferno Aggro',
      author: 'FireMaster',
      element: 'Inferno',
      likes: 245,
      views: 1520,
      rating: 4.8,
      lastUpdated: '2025-06-18',
      description: 'Fast-paced aggressive deck focusing on early game pressure',
      cardCount: 40,
      winRate: 68.5,
      featured: true,
    },
    {
      id: 2,
      name: 'Submerged Control',
      author: 'AquaStrategist',
      element: 'Submerged',
      likes: 189,
      views: 980,
      rating: 4.6,
      lastUpdated: '2025-06-17',
      description: 'Control-oriented deck with powerful late-game threats',
      cardCount: 40,
      winRate: 72.3,
      featured: false,
    },
    {
      id: 3,
      name: 'Steadfast Midrange',
      author: 'RockSolid',
      element: 'Steadfast',
      likes: 156,
      views: 743,
      rating: 4.4,
      lastUpdated: '2025-06-16',
      description: 'Balanced midrange strategy with defensive capabilities',
      cardCount: 40,
      winRate: 65.2,
      featured: false,
    },
    {
      id: 4,
      name: 'Gust Tempo',
      author: 'WindRider',
      element: 'Gust',
      likes: 203,
      views: 1234,
      rating: 4.7,
      lastUpdated: '2025-06-19',
      description: 'High-tempo deck with bounce and evasion tactics',
      cardCount: 40,
      winRate: 70.1,
      featured: true,
    },
    {
      id: 5,
      name: 'Brilliance Combo',
      author: 'LightWeaver',
      element: 'Brilliance',
      likes: 178,
      views: 892,
      rating: 4.5,
      lastUpdated: '2025-06-15',
      description: 'Intricate combo deck with powerful synergies',
      cardCount: 40,
      winRate: 63.8,
      featured: false,
    },
    {
      id: 6,
      name: 'Void Disruption',
      author: 'VoidWalker',
      element: 'Void',
      likes: 134,
      views: 567,
      rating: 4.3,
      lastUpdated: '2025-06-14',
      description: 'Disruptive strategy focusing on removal and exile',
      cardCount: 40,
      winRate: 61.9,
      featured: false,
    },
  ]);

  const [filteredDecks, setFilteredDecks] = useState(decks);

  // Filter and sort decks
  useEffect(() => {
    let filtered = decks.filter(deck => {
      const matchesSearch =
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesElement =
        filters.element === 'all' || deck.element === filters.element;
      const matchesAuthor =
        filters.author === 'all' || deck.author === filters.author;

      return matchesSearch && matchesElement && matchesAuthor;
    });

    // Sort decks
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'popularity':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'winRate':
          aValue = a.winRate;
          bValue = b.winRate;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = a.likes;
          bValue = b.likes;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDecks(filtered);
  }, [searchTerm, filters, sortBy, sortOrder, decks]);

  const getElementColor = element => {
    const colors = {
      Inferno: 'text-red-400',
      Submerged: 'text-blue-400',
      Steadfast: 'text-yellow-400',
      Gust: 'text-green-400',
      Brilliance: 'text-purple-400',
      Void: 'text-gray-400',
    };
    return colors[element] || 'text-gray-400';
  };

  const getElementIcon = element => {
    const icons = {
      Inferno: '🜂',
      Submerged: '🜄',
      Steadfast: '🜃',
      Gust: '🜁',
      Brilliance: '⭘',
      Void: '▢',
    };
    return icons[element] || '✡⃝';
  };

  const DeckCard = ({ deck }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-card rounded-lg p-6 border border-color hover:border-blue-500/50 transition-all duration-300"
    >
      {deck.featured && (
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-yellow-400">Featured</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1">{deck.name}</h3>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <User className="w-4 h-4" />
            <span>{deck.author}</span>
          </div>
        </div>
        <div className={`text-2xl ${getElementColor(deck.element)}`}>
          {getElementIcon(deck.element)}
        </div>
      </div>

      <p className="text-secondary text-sm mb-4 line-clamp-2">
        {deck.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <span>{deck.winRate}% WR</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{deck.rating}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span>{deck.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span>{deck.views}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-secondary mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {deck.lastUpdated}
        </span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          View
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const DeckListItem = ({ deck }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-lg p-4 border border-color hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`text-2xl ${getElementColor(deck.element)}`}>
            {getElementIcon(deck.element)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{deck.name}</h3>
              {deck.featured && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {deck.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {deck.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <span>{deck.winRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{deck.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-400" />
            <span>{deck.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>{deck.views}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Search className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl font-bold">Deck Search</h1>
            </div>
            <p className="text-secondary text-lg">
              Discover and explore community-created decks
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search decks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Element Filter */}
            <select
              value={filters.element}
              onChange={e =>
                setFilters({ ...filters, element: e.target.value })
              }
              className="px-4 py-2 bg-background border border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Elements</option>
              <option value="Inferno">🜂 Inferno</option>
              <option value="Submerged">🜄 Submerged</option>
              <option value="Steadfast">🜃 Steadfast</option>
              <option value="Gust">🜁 Gust</option>
              <option value="Brilliance">⭘ Brilliance</option>
              <option value="Void">▢ Void</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={e => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-4 py-2 bg-background border border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity-desc">Most Popular</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="winRate-desc">Highest Win Rate</option>
              <option value="lastUpdated-desc">Recently Updated</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary">
              Showing {filteredDecks.length} deck
              {filteredDecks.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background border border-color hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background border border-color hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Deck Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map(deck => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDecks.map(deck => (
              <DeckListItem key={deck.id} deck={deck} />
            ))}
          </div>
        )}

        {filteredDecks.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No decks found</h3>
            <p className="text-secondary">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckSearch;
