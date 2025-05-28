import { Plus, Search, Grid, List, Edit, Copy, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MyDecks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('updated');
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'public', 'private'

  // Mock deck data - in a real app this would come from an API
  const [decks] = useState([
    {
      id: '1',
      name: 'Fire & Earth Aggro',
      description: 'A fast-paced deck focusing on fire and earth synergies for quick victories.',
      cardCount: 40,
      isPublic: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      author: 'You',
      elements: ['🜂', '🜃'],
      wins: 15,
      losses: 8,
      winRate: 65,
    },
    {
      id: '2',
      name: 'Water Control',
      description: 'Control the battlefield with water spells and defensive creatures.',
      cardCount: 40,
      isPublic: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      author: 'You',
      elements: ['🜄'],
      wins: 12,
      losses: 6,
      winRate: 67,
    },
    {
      id: '3',
      name: 'Elemental Harmony',
      description: 'A balanced deck utilizing all four elements for versatile gameplay.',
      cardCount: 38,
      isPublic: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-16',
      author: 'You',
      elements: ['🜁', '🜂', '🜃', '🜄'],
      wins: 8,
      losses: 12,
      winRate: 40,
    },
  ]);

  // Filter and sort decks
  const filteredAndSortedDecks = decks
    .filter(deck => {
      const matchesSearch =
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterBy === 'all' ||
        (filterBy === 'public' && deck.isPublic) ||
        (filterBy === 'private' && !deck.isPublic);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'winrate':
          return b.winRate - a.winRate;
        default:
          return 0;
      }
    });

  const duplicateDeck = deckId => {
    console.warn('Duplicating deck:', deckId);
    // TODO: Implement deck duplication
  };

  const deleteDeck = deckId => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      console.warn('Deleting deck:', deckId);
      // TODO: Implement deck deletion
    }
  };

  const shareDeck = deckId => {
    console.warn('Sharing deck:', deckId);
    // TODO: Implement deck sharing
  };

  return (
    <div className='min-h-screen bg-primary'>
      <div className='container py-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>My Decks</h1>
            <p className='text-secondary'>Manage your deck collection ({decks.length} decks)</p>
          </div>

          <Link to='/deckbuilder' className='btn btn-primary'>
            <Plus size={16} />
            New Deck
          </Link>
        </div>

        {/* Search and Controls */}
        <div className='card mb-6'>
          <div className='flex flex-col lg:flex-row gap-4 mb-4'>
            {/* Search Bar */}
            <div className='flex-1 relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted'
                size={16}
              />
              <input
                type='text'
                placeholder='Search your decks...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='input pl-10'
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={e => setFilterBy(e.target.value)}
              className='input lg:w-48'
            >
              <option value='all'>All Decks</option>
              <option value='public'>Public Decks</option>
              <option value='private'>Private Decks</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='input lg:w-48'
            >
              <option value='updated'>Last Updated</option>
              <option value='created'>Date Created</option>
              <option value='name'>Name</option>
              <option value='winrate'>Win Rate</option>
            </select>

            {/* View Mode */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className='text-sm text-secondary'>
            Showing {filteredAndSortedDecks.length} of {decks.length} decks
          </div>
        </div>

        {/* Decks Display */}
        {viewMode === 'grid' ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredAndSortedDecks.map(deck => (
              <div key={deck.id} className='card hover:border-accent-primary transition-all group'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h3 className='font-semibold text-lg'>{deck.name}</h3>
                      {deck.isPublic ? (
                        <span className='px-2 py-1 bg-green-600 rounded text-xs'>Public</span>
                      ) : (
                        <span className='px-2 py-1 bg-gray-600 rounded text-xs'>Private</span>
                      )}
                    </div>
                    <p className='text-sm text-secondary line-clamp-2 mb-3'>{deck.description}</p>
                  </div>
                </div>

                {/* Elements */}
                <div className='flex items-center gap-2 mb-3'>
                  {deck.elements.map(element => (
                    <span key={element} className='text-xl'>
                      {element}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className='grid grid-cols-3 gap-4 mb-4 text-sm'>
                  <div className='text-center'>
                    <div className='font-semibold'>{deck.cardCount}</div>
                    <div className='text-secondary'>Cards</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-semibold'>
                      {deck.wins}-{deck.losses}
                    </div>
                    <div className='text-secondary'>W-L</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-semibold'>{deck.winRate}%</div>
                    <div className='text-secondary'>Win Rate</div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center justify-between pt-3 border-t border-color'>
                  <div className='text-xs text-secondary'>
                    Updated {new Date(deck.updatedAt).toLocaleDateString()}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Link
                      to={`/deckbuilder/${deck.id}`}
                      className='btn btn-ghost btn-sm'
                      title='Edit'
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => duplicateDeck(deck.id)}
                      className='btn btn-ghost btn-sm'
                      title='Duplicate'
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => shareDeck(deck.id)}
                      className='btn btn-ghost btn-sm'
                      title='Share'
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className='btn btn-ghost btn-sm text-red-400 hover:text-red-300'
                      title='Delete'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredAndSortedDecks.map(deck => (
              <div key={deck.id} className='card hover:border-accent-primary transition-all'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    {/* Elements */}
                    <div className='flex items-center gap-1'>
                      {deck.elements.map(element => (
                        <span key={element} className='text-lg'>
                          {element}
                        </span>
                      ))}
                    </div>

                    {/* Deck Info */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-semibold'>{deck.name}</h3>
                        {deck.isPublic ? (
                          <span className='px-2 py-1 bg-green-600 rounded text-xs'>Public</span>
                        ) : (
                          <span className='px-2 py-1 bg-gray-600 rounded text-xs'>Private</span>
                        )}
                      </div>
                      <p className='text-sm text-secondary line-clamp-1'>{deck.description}</p>
                    </div>

                    {/* Stats */}
                    <div className='flex items-center gap-6 text-sm'>
                      <span>{deck.cardCount} cards</span>
                      <span>
                        {deck.wins}-{deck.losses} ({deck.winRate}%)
                      </span>
                      <span className='text-secondary'>
                        {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-1'>
                    <Link
                      to={`/deckbuilder/${deck.id}`}
                      className='btn btn-ghost btn-sm'
                      title='Edit'
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => duplicateDeck(deck.id)}
                      className='btn btn-ghost btn-sm'
                      title='Duplicate'
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => shareDeck(deck.id)}
                      className='btn btn-ghost btn-sm'
                      title='Share'
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className='btn btn-ghost btn-sm text-red-400 hover:text-red-300'
                      title='Delete'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedDecks.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>📚</div>
            <h3 className='text-xl font-semibold mb-2'>No decks found</h3>
            <p className='text-secondary mb-6'>
              {decks.length === 0
                ? "You haven't created any decks yet"
                : 'Try adjusting your search or filters'}
            </p>
            <Link to='/deckbuilder' className='btn btn-primary'>
              <Plus size={16} />
              Create Your First Deck
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDecks;
