import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Share2, 
  Download, 
  Upload, 
  Star, 
  Trophy, 
  Target, 
  Calendar,
  Heart,
  Lock,
  Globe,
  Users,
  BookOpen,
  Save,
  Grid,
  List,
  MoreVertical,
  Tag,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';

const SavedDecks = () => {
  const [decks, setDecks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('modified');
  const [viewMode, setViewMode] = useState('grid');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const mockDecks = [
      {
        id: 1,
        name: 'Elemental Storm',
        format: 'Standard',
        colors: ['Fire', 'Air'],
        cardCount: 40,
        lastModified: '2024-06-07',
        created: '2024-05-15',
        winRate: 68.5,
        gamesPlayed: 23,
        wins: 16,
        losses: 7,
        isFavorite: true,
        isPublic: false,
        isLegal: true,
        description: 'Aggressive deck focusing on elemental synergies and quick wins.',
        tags: ['Aggro', 'Elemental', 'Competitive'],
        author: 'You',
        version: '2.1',
        tournamentResults: [
          { tournament: 'Friday Night KONIVRER', placement: '2nd', date: '2024-06-01' },
          { tournament: 'Local Store Championship', placement: '1st', date: '2024-05-20' }
        ],
        notes: 'Strong against control decks, weak to heavy removal.',
        collaborators: [],
        forkCount: 3,
        likeCount: 12,
        thumbnail: '/api/placeholder/200/120'
      },
      {
        id: 2,
        name: 'Control Master',
        format: 'Standard',
        colors: ['Water', 'Earth'],
        cardCount: 40,
        lastModified: '2024-06-05',
        created: '2024-04-20',
        winRate: 72.1,
        gamesPlayed: 18,
        wins: 13,
        losses: 5,
        isFavorite: false,
        isPublic: true,
        isLegal: true,
        description: 'Control deck with powerful late-game threats.',
        tags: ['Control', 'Late Game', 'Tournament'],
        author: 'You',
        version: '1.3',
        tournamentResults: [
          { tournament: 'Regional Qualifier', placement: '4th', date: '2024-05-30' }
        ],
        notes: 'Needs more early game interaction.',
        collaborators: ['ElementalMage', 'StormCaller'],
        forkCount: 7,
        likeCount: 24,
        thumbnail: '/api/placeholder/200/120'
      },
      {
        id: 3,
        name: 'Draft Experiment',
        format: 'Draft',
        colors: ['Fire', 'Water', 'Air'],
        cardCount: 40,
        lastModified: '2024-06-03',
        created: '2024-06-03',
        winRate: 45.0,
        gamesPlayed: 4,
        wins: 2,
        losses: 2,
        isFavorite: false,
        isPublic: false,
        isLegal: true,
        description: 'Experimental three-color draft deck.',
        tags: ['Draft', 'Experimental', 'Three-Color'],
        author: 'You',
        version: '1.0',
        tournamentResults: [],
        notes: 'Mana base needs work, too ambitious.',
        collaborators: [],
        forkCount: 0,
        likeCount: 2,
        thumbnail: '/api/placeholder/200/120'
      }
    ];

    setDecks(mockDecks);
  }, []);

  const filteredDecks = decks.filter(deck => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'favorites' && deck.isFavorite) ||
                         (filter === 'public' && deck.isPublic) ||
                         (filter === 'private' && !deck.isPublic) ||
                         deck.format.toLowerCase() === filter.toLowerCase();
    
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'winrate':
        return b.winRate - a.winRate;
      case 'games':
        return b.gamesPlayed - a.gamesPlayed;
      case 'created':
        return new Date(b.created) - new Date(a.created);
      default: // modified
        return new Date(b.lastModified) - new Date(a.lastModified);
    }
  });

  const handleToggleFavorite = (deckId) => {
    setDecks(prev => prev.map(deck => 
      deck.id === deckId ? { ...deck, isFavorite: !deck.isFavorite } : deck
    ));
    analytics.buttonClick('deck_favorite_toggle', deckId);
  };

  const handleDeleteDeck = (deckId) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      setDecks(prev => prev.filter(deck => deck.id !== deckId));
      analytics.buttonClick('deck_delete', deckId);
    }
  };

  const handleDuplicateDeck = (deckId) => {
    const originalDeck = decks.find(d => d.id === deckId);
    if (originalDeck) {
      const newDeck = {
        ...originalDeck,
        id: Date.now(),
        name: `${originalDeck.name} (Copy)`,
        created: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        version: '1.0',
        tournamentResults: [],
        forkCount: 0,
        likeCount: 0
      };
      setDecks(prev => [newDeck, ...prev]);
      analytics.buttonClick('deck_duplicate', deckId);
    }
  };

  const handleShareDeck = (deck) => {
    setSelectedDeck(deck);
    setShowShareModal(true);
    analytics.buttonClick('deck_share', deck.id);
  };

  const handleImportDeck = () => {
    if (importText.trim()) {
      // In a real app, this would parse the deck list
      const newDeck = {
        id: Date.now(),
        name: 'Imported Deck',
        format: 'Standard',
        colors: ['Fire'],
        cardCount: 40,
        lastModified: new Date().toISOString().split('T')[0],
        created: new Date().toISOString().split('T')[0],
        winRate: 0,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        isFavorite: false,
        isPublic: false,
        isLegal: true,
        description: 'Imported deck list',
        tags: ['Imported'],
        author: 'You',
        version: '1.0',
        tournamentResults: [],
        notes: '',
        collaborators: [],
        forkCount: 0,
        likeCount: 0,
        thumbnail: '/api/placeholder/200/120'
      };
      
      setDecks(prev => [newDeck, ...prev]);
      setImportText('');
      setShowImportModal(false);
      analytics.buttonClick('deck_import');
    }
  };

  const getWinRateColor = (winRate) => {
    if (winRate >= 70) return 'text-green-400';
    if (winRate >= 60) return 'text-yellow-400';
    if (winRate >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Decks</h1>
          <p className="text-secondary">
            Manage your saved deck lists and track their performance
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-secondary"
          >
            <Upload size={16} />
            Import Deck
          </button>
          <Link to="/deckbuilder" className="btn btn-primary">
            <Plus size={16} />
            New Deck
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <BookOpen className="mx-auto text-accent-primary mb-2" size={24} />
          <div className="text-2xl font-bold">{decks.length}</div>
          <div className="text-sm text-muted">Total Decks</div>
        </div>
        <div className="card text-center">
          <Heart className="mx-auto text-red-400 mb-2" size={24} />
          <div className="text-2xl font-bold">{decks.filter(d => d.isFavorite).length}</div>
          <div className="text-sm text-muted">Favorites</div>
        </div>
        <div className="card text-center">
          <Trophy className="mx-auto text-yellow-400 mb-2" size={24} />
          <div className="text-2xl font-bold">
            {decks.reduce((acc, deck) => acc + deck.tournamentResults.length, 0)}
          </div>
          <div className="text-sm text-muted">Tournament Results</div>
        </div>
        <div className="card text-center">
          <TrendingUp className="mx-auto text-green-400 mb-2" size={24} />
          <div className="text-2xl font-bold">
            {decks.length > 0 ? Math.round(decks.reduce((acc, deck) => acc + deck.winRate, 0) / decks.length) : 0}%
          </div>
          <div className="text-sm text-muted">Avg Win Rate</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Search decks..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Decks</option>
            <option value="favorites">Favorites</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="standard">Standard</option>
            <option value="draft">Draft</option>
            <option value="legacy">Legacy</option>
          </select>
          
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="modified">Last Modified</option>
            <option value="name">Name</option>
            <option value="winrate">Win Rate</option>
            <option value="games">Games Played</option>
            <option value="created">Date Created</option>
          </select>
          
          <div className="flex border border-color rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-accent-primary text-white' : 'text-muted hover:text-primary'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-accent-primary text-white' : 'text-muted hover:text-primary'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Deck Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedDecks.map(deck => (
            <div key={deck.id} className="card hover:border-accent-primary transition-all duration-300 group">
              {/* Deck Thumbnail */}
              <div className="relative mb-4">
                <img
                  src={deck.thumbnail}
                  alt={deck.name}
                  className="w-full h-32 object-cover rounded-lg bg-tertiary"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {deck.isFavorite && (
                    <div className="bg-red-500 text-white p-1 rounded">
                      <Heart size={12} fill="currentColor" />
                    </div>
                  )}
                  {deck.isPublic ? (
                    <div className="bg-green-600 text-white p-1 rounded">
                      <Globe size={12} />
                    </div>
                  ) : (
                    <div className="bg-gray-600 text-white p-1 rounded">
                      <Lock size={12} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {deck.format}
                  </span>
                </div>
              </div>

              {/* Deck Info */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold line-clamp-1">{deck.name}</h3>
                  <div className="flex gap-1">
                    {deck.colors.map((color, index) => (
                      <span key={index} className="text-xs">
                        {color === 'Fire' ? '🔥' : color === 'Water' ? '💧' : 
                         color === 'Earth' ? '🌍' : color === 'Air' ? '💨' : '⚡'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-secondary line-clamp-2 mb-3">
                  {deck.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {deck.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-tertiary text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted">Win Rate:</span>
                    <div className={`font-bold ${getWinRateColor(deck.winRate)}`}>
                      {deck.winRate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted">Games:</span>
                    <div className="font-bold">{deck.gamesPlayed}</div>
                  </div>
                </div>
              </div>

              {/* Tournament Results */}
              {deck.tournamentResults.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-muted mb-1">Recent Results:</div>
                  {deck.tournamentResults.slice(0, 2).map((result, index) => (
                    <div key={index} className="text-xs flex justify-between">
                      <span className="line-clamp-1">{result.tournament}</span>
                      <span className={`font-medium ${
                        result.placement === '1st' ? 'text-yellow-400' : 
                        result.placement.includes('2nd') || result.placement.includes('3rd') ? 'text-gray-300' : 
                        'text-secondary'
                      }`}>
                        {result.placement}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-color">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Clock size={12} />
                  <span>{new Date(deck.lastModified).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleFavorite(deck.id)}
                    className={`btn btn-sm btn-ghost ${deck.isFavorite ? 'text-red-400' : ''}`}
                  >
                    <Heart size={14} fill={deck.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  
                  <Link to={`/deckbuilder/${deck.id}`} className="btn btn-sm btn-ghost">
                    <Edit size={14} />
                  </Link>
                  
                  <button
                    onClick={() => handleDuplicateDeck(deck.id)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Copy size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleShareDeck(deck)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Share2 size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="btn btn-sm btn-ghost text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDecks.map(deck => (
            <div key={deck.id} className="card">
              <div className="flex items-center gap-4">
                <img
                  src={deck.thumbnail}
                  alt={deck.name}
                  className="w-16 h-16 rounded-lg bg-tertiary flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{deck.name}</h3>
                      <p className="text-sm text-secondary line-clamp-1">{deck.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {deck.isFavorite && <Heart className="text-red-400" size={16} fill="currentColor" />}
                      {deck.isPublic ? <Globe className="text-green-400" size={16} /> : <Lock className="text-muted" size={16} />}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-muted">{deck.format}</span>
                    <span className={`font-medium ${getWinRateColor(deck.winRate)}`}>
                      {deck.winRate}% ({deck.wins}-{deck.losses})
                    </span>
                    <span className="text-muted">{deck.gamesPlayed} games</span>
                    <span className="text-muted">{new Date(deck.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Link to={`/deckbuilder/${deck.id}`} className="btn btn-sm btn-secondary">
                    <Edit size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleShareDeck(deck)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedDecks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No decks found</h3>
          <p className="text-secondary mb-4">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first deck to get started'
            }
          </p>
          <Link to="/deckbuilder" className="btn btn-primary">
            <Plus size={16} />
            Create Your First Deck
          </Link>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Import Deck</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deck List</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="input resize-none"
                  rows={12}
                  placeholder="Paste your deck list here...&#10;&#10;Example:&#10;4 Brilliant Watcher&#10;4 Infernal Sprinter&#10;3 Gustling Wisp&#10;..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportDeck}
                  disabled={!importText.trim()}
                  className="btn btn-primary"
                >
                  Import Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedDeck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-color rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Share Deck</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Share Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://konivrer.com/decks/${selectedDeck.id}`}
                      readOnly
                      className="input flex-1"
                    />
                    <button className="btn btn-secondary">Copy</button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Make Public</div>
                    <div className="text-sm text-secondary">Allow others to view and copy this deck</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDeck.isPublic}
                    onChange={() => {
                      setDecks(prev => prev.map(deck => 
                        deck.id === selectedDeck.id ? { ...deck, isPublic: !deck.isPublic } : deck
                      ));
                      setSelectedDeck(prev => ({ ...prev, isPublic: !prev.isPublic }));
                    }}
                    className="rounded"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedDecks;