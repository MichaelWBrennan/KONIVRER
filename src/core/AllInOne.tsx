/**
 * KONIVRER All-in-One Core Application
 * Consolidated app with all features in minimal code
 */

import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityProvider } from '../security/SecurityProvider';
import { DataProtectionPanel } from '../security/DataProtection';
import { SecurityAuditPanel } from '../security/SecurityAudit';
import { AutoSecurityUpdaterPanel } from '../security/AutoSecurityUpdater';
import { SecurityIntelligencePanel } from '../security/SecurityIntelligence';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Spell';
  elements: string[];
  keywords: string[];
  strength?: number;
  description: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  likes: number;
  bookmarked: boolean;
}

interface GameState {
  players: Player[];
  currentPlayer: number;
  phase: 'draw' | 'main' | 'combat' | 'end';
  turn: number;
}

interface Player {
  id: string;
  name: string;
  health: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
}

// Sample data
const SAMPLE_CARDS: Card[] = [
  {
    id: '1',
    name: 'Fire Bolt',
    cost: 1,
    type: 'Spell',
    elements: ['Fire'],
    keywords: [],
    description: 'Deal 3 damage to any target',
  },
  {
    id: '2',
    name: 'Water Guardian',
    cost: 3,
    type: 'Familiar',
    elements: ['Water'],
    keywords: ['Haste', 'Vigilance'],
    strength: 4,
    description: 'A protective water spirit',
  },
  {
    id: '3',
    name: 'Earth Golem',
    cost: 5,
    type: 'Familiar',
    elements: ['Earth'],
    keywords: ['Haste', 'Vigilance'],
    strength: 7,
    description: 'Massive stone creature',
  },
  {
    id: '4',
    name: 'Air Strike',
    cost: 2,
    type: 'Spell',
    elements: ['Air'],
    keywords: [],
    description: 'Deal 4 damage to flying targets',
  },
];

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'KONIVRER Strategy Guide',
    content: 'Master the elements...',
    author: 'GameMaster',
    date: '2024-01-15',
    tags: ['strategy', 'guide'],
    likes: 42,
    bookmarked: false,
  },
  {
    id: '2',
    title: 'Tournament Results',
    content: 'Latest tournament winners...',
    author: 'TourneyBot',
    date: '2024-01-14',
    tags: ['tournament', 'results'],
    likes: 28,
    bookmarked: true,
  },
];

// Global state context
interface AppState {
  cards: Card[];
  posts: BlogPost[];
  currentDeck: Card[];
  gameState: GameState | null;
  user: { name: string; id: string } | null;
}

const AppContext = createContext<{
  state: AppState;
  actions: {
    addToDeck: (card: Card) => void;
    removeFromDeck: (cardId: string) => void;
    toggleBookmark: (postId: string) => void;
    likePost: (postId: string) => void;
    startGame: (opponent: string) => void;
  };
}>({} as any);

// Consolidated components
const Navigation: React.FC = () => {
  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/cards', label: '🃏 Cards' },
    { path: '/deck', label: '📚 Deck Builder' },
    { path: '/game', label: '🎮 Play' },
    { path: '/tournaments', label: '🏆 Tournaments' },
    { path: '/blog', label: '📝 Blog' },
  ];

  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const CardComponent: React.FC<{
  card: Card;
  onAdd?: () => void;
  compact?: boolean;
}> = ({ card, onAdd, compact = false }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{
      border: '2px solid #ddd',
      borderRadius: '12px',
      padding: compact ? '8px' : '16px',
      background: 'linear-gradient(145deg, #f9f9f9, #e6e6e6)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      cursor: onAdd ? 'pointer' : 'default',
      minWidth: compact ? '150px' : '200px',
    }}
    onClick={onAdd}
  >
    <h3
      style={{
        margin: '0 0 8px 0',
        color: '#333',
        fontSize: compact ? '14px' : '16px',
      }}
    >
      {card.name}
    </h3>
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
      Cost: {card.cost} | Type: {card.type}
      {card.strength && ` | Strength: ${card.strength}`}
    </div>
    <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
      Elements: {card.elements.join(', ')}
      {card.keywords.length > 0 && ` | Keywords: ${card.keywords.join(', ')}`}
    </div>
    <p
      style={{ margin: 0, fontSize: compact ? '11px' : '12px', color: '#555' }}
    >
      {card.description}
    </p>
  </motion.div>
);

const SearchFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  options: string[];
}> = ({ searchTerm, onSearchChange, filterType, onFilterChange, options }) => (
  <div
    style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
  >
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={e => onSearchChange(e.target.value)}
      style={{
        padding: '10px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        minWidth: '250px',
      }}
    />
    <select
      value={filterType}
      onChange={e => onFilterChange(e.target.value)}
      style={{
        padding: '10px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
      }}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Page components
const HomePage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        fontSize: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}
    >
      KONIVRER
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}
    >
      Next-Generation Trading Card Game Platform
    </motion.p>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '2rem',
      }}
    >
      {[
        { title: '🎮 Play Now', desc: 'Start a game with AI or friends' },
        {
          title: '🃏 Browse Cards',
          desc: 'Explore the complete card database',
        },
        { title: '📚 Build Decks', desc: 'Create powerful deck combinations' },
        { title: '🏆 Tournaments', desc: 'Join competitive tournaments' },
        { title: '📝 Community', desc: 'Read strategy guides and news' },
        { title: '🤖 AI Features', desc: 'Get AI-powered recommendations' },
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #eee',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
            {feature.title}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {feature.desc}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);

const CardsPage: React.FC = () => {
  const { state } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCards = useMemo(() => {
    return state.cards.filter(card => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || card.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [state.cards, searchTerm, filterType]);

  const types = ['All', 'Familiar', 'Spell'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Card Database
      </h1>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        options={types}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <AnimatePresence>
          {filteredCards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CardComponent card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DeckBuilderPage: React.FC = () => {
  const { state, actions } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const availableCards = useMemo(() => {
    return state.cards.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [state.cards, searchTerm]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Deck Builder
      </h1>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        <div>
          <h2>Available Cards</h2>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            {availableCards.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                compact
                onAdd={() => actions.addToDeck(card)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2>Current Deck ({state.currentDeck.length}/60)</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            {state.currentDeck.map((card, index) => (
              <CardComponent
                key={`${card.id}-${index}`}
                card={card}
                compact
                onAdd={() => actions.removeFromDeck(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPage: React.FC = () => {
  const { state, actions } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  const filteredPosts = useMemo(() => {
    return state.posts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag =
        filterTag === 'All' || post.tags.includes(filterTag.toLowerCase());
      return matchesSearch && matchesTag;
    });
  }, [state.posts, searchTerm, filterTag]);

  const allTags = [
    'All',
    ...Array.from(new Set(state.posts.flatMap(post => post.tags))),
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Community Blog
      </h1>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterTag}
        onFilterChange={setFilterTag}
        options={allTags}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredPosts.map(post => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #eee',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
              {post.title}
            </h2>
            <div
              style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}
            >
              By {post.author} on {post.date} | Tags: {post.tags.join(', ')}
            </div>
            <p style={{ margin: '0 0 1rem 0', color: '#555' }}>
              {post.content}
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => actions.likePost(post.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                👍 {post.likes}
              </button>
              <button
                onClick={() => actions.toggleBookmark(post.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: post.bookmarked ? '#f39c12' : '#666',
                }}
              >
                {post.bookmarked ? '🔖' : '📑'} Bookmark
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

const GamePage: React.FC = () => {
  const { state, actions } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>Game Center</h1>

      {!state.gameState ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            {
              title: '🤖 vs AI',
              desc: 'Play against intelligent AI',
              action: () => actions.startGame('AI'),
            },
            {
              title: '👥 vs Friend',
              desc: 'Local multiplayer game',
              action: () => actions.startGame('Local'),
            },
            {
              title: '🌐 Online Match',
              desc: 'Find online opponents',
              action: () => actions.startGame('Online'),
            },
            {
              title: '🏆 Tournament',
              desc: 'Join competitive play',
              action: () => navigate('/tournaments'),
            },
          ].map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={option.action}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #eee',
                cursor: 'pointer',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                {option.title}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                {option.desc}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Game in Progress</h2>
          <p>
            Turn {state.gameState.turn} - Phase: {state.gameState.phase}
          </p>
          <p>
            Current Player:{' '}
            {state.gameState.players[state.gameState.currentPlayer]?.name}
          </p>
          {/* Game board would go here */}
        </div>
      )}
    </div>
  );
};

const TournamentsPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ marginBottom: '2rem', color: '#333' }}>Tournaments</h1>
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2>🏆 Upcoming Tournaments</h2>
      <p>Weekly Championship - Starts in 2 days</p>
      <p>Monthly Grand Prix - Registration open</p>
      <p>Seasonal Championship - Qualifiers ongoing</p>
    </div>
  </div>
);

// Main app component
const AllInOneApp: React.FC = () => {
  const [state, setState] = useState<AppState>({
    cards: SAMPLE_CARDS,
    posts: SAMPLE_POSTS,
    currentDeck: [],
    gameState: null,
    user: { name: 'Player', id: '1' },
  });

  const actions = {
    addToDeck: (card: Card) => {
      if (state.currentDeck.length < 60) {
        setState(prev => ({
          ...prev,
          currentDeck: [...prev.currentDeck, card],
        }));
      }
    },
    removeFromDeck: (cardId: string) => {
      setState(prev => ({
        ...prev,
        currentDeck: prev.currentDeck.filter(
          (_, index) =>
            index !== prev.currentDeck.findIndex(c => c.id === cardId),
        ),
      }));
    },
    toggleBookmark: (postId: string) => {
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post,
        ),
      }));
    },
    likePost: (postId: string) => {
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post,
        ),
      }));
    },
    startGame: (opponent: string) => {
      const gameState: GameState = {
        players: [
          {
            id: '1',
            name: 'Player',
            health: 20,
            deck: [...state.currentDeck],
            hand: [],
            field: [],
          },
          {
            id: '2',
            name: opponent,
            health: 20,
            deck: [...SAMPLE_CARDS],
            hand: [],
            field: [],
          },
        ],
        currentPlayer: 0,
        phase: 'draw',
        turn: 1,
      };
      setState(prev => ({ ...prev, gameState }));
    },
  };

  // PWA registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  return (
    <SecurityProvider>
      <AppContext.Provider value={{ state, actions }}>
        <Router>
          <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/deck" element={<DeckBuilderPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/blog" element={<BlogPage />} />
            </Routes>
            <DataProtectionPanel />
            <SecurityAuditPanel />
            <AutoSecurityUpdaterPanel />
            <SecurityIntelligencePanel />
          </div>
        </Router>
      </AppContext.Provider>
    </SecurityProvider>
  );
};

export default AllInOneApp;
