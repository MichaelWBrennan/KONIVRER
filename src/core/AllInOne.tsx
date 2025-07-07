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
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { trackCustomMetric } from '../utils/speedTracking';
import SpeedMonitor from '../components/SpeedMonitor';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityProvider } from '../security/SecurityProvider';
import { SecurityAutomationProvider } from '../security/SecurityAutomation';
import { useBackgroundCodeEvolution } from '../automation/BackgroundCodeEvolution';
import { useBackgroundDependencyManager } from '../automation/BackgroundDependencyManager';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    // Home link only appears when not on the home page
    ...(isHomePage ? [] : [{ path: '/', label: 'Home' }]),
    { path: '/cards', label: 'Cards' },
    { path: '/decks', label: 'Decks' },
    { path: '/game', label: 'Play' },
    { path: '/tournaments', label: 'Events' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Reset form
      setUsername('');
      setPassword('');
    }
  };

  return (
    <>
      <nav
        style={{
          background: '#3a2921', // Dark brown to match the ancient scroll theme
          padding: '1rem 2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          borderBottom: '1px solid #8b5a2b', // Match the ancient scroll border
          fontFamily: 'OpenDyslexic, Arial, sans-serif',
        }}
      >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Left side - Main navigation */}
        <div
          style={{
            display: 'flex',
            gap: '3rem', // Increased spacing between items
            alignItems: 'center',
            justifyContent: 'center', // Center the navigation items
            flex: 1, // Take up available space
          }}
        >
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Track navigation clicks for speed insights
                if (!shouldSkipAutonomousSystems()) {
                  trackCustomMetric('NAVIGATION_CLICK', performance.now());
                  trackCustomMetric(
                    `NAVIGATION_TO_${item.path.replace('/', '') || 'HOME'}`,
                    performance.now(),
                  );
                }
              }}
              style={{
                color: '#fff',
                textDecoration: 'none',
                padding: '0.5rem 1rem', // Added horizontal padding
                transition: 'all 0.3s ease',
                fontSize: '18px', // Increased font size for better visibility
                fontWeight: '500', // Medium weight for all items
                borderBottom: '2px solid transparent',
                textAlign: 'center', // Center text
                minWidth: '80px', // Ensure minimum width
                fontFamily: 'OpenDyslexic, Arial, sans-serif', // Use OpenDyslexic font
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderBottom = '2px solid #fff';
                e.currentTarget.style.color = '#ccc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderBottom = '2px solid transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side - Login button */}
        <div>
          <button
            onClick={() => isLoggedIn ? setIsLoggedIn(false) : setShowLoginModal(true)}
            style={{
              background: isLoggedIn ? '#28a745' : 'transparent',
              color: '#fff',
              border: '1px solid #fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              fontFamily: 'OpenDyslexic, Arial, sans-serif',
              display: 'inline-block',
              textAlign: 'center',
              minWidth: '80px',
            }}
            onMouseEnter={e => {
              if (!isLoggedIn) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
              }
            }}
            onMouseLeave={e => {
              if (!isLoggedIn) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }
            }}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>

    {/* Login Modal */}
    {showLoginModal && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          background: '#f8f0dd',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          border: '2px solid #8b5a2b',
          maxWidth: '400px',
          width: '90%',
          fontFamily: 'OpenDyslexic, Arial, sans-serif',
          position: 'relative',
        }}>
          <button 
            onClick={() => setShowLoginModal(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#3a2921',
            }}
          >
            ×
          </button>
          
          <h2 style={{ 
            color: '#3a2921', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontFamily: 'OpenDyslexic, Arial, sans-serif',
          }}>
            Login to KONIVRER
          </h2>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #8b5a2b',
                  fontSize: '16px',
                  fontFamily: 'OpenDyslexic, Arial, sans-serif',
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #8b5a2b',
                  fontSize: '16px',
                  fontFamily: 'OpenDyslexic, Arial, sans-serif',
                }}
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3a2921',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'OpenDyslexic, Arial, sans-serif',
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )}
  </>
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
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      background: '#f8f9fa',
      minHeight: '90vh',
    }}
  >
    {/* Header Section */}
    <div style={{ marginBottom: '3rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#3a2921' }}
      >
        [STAR]
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '4rem',
          fontWeight: '700',
          color: '#000',
          marginBottom: '1rem',
          letterSpacing: '2px',
        }}
      >
        KONIVRER
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '1rem',
          fontWeight: '300',
        }}
      >
        Trading Card Game
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#3a2921' }}
      >
        [STAR]
      </motion.div>
    </div>

    {/* Experience KONIVRER Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          color: '#000',
          marginBottom: '1rem',
          borderBottom: '2px solid #000',
          paddingBottom: '0.5rem',
        }}
      >
        Experience KONIVRER
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3
          style={{ fontSize: '1.2rem', color: '#333', marginBottom: '0.5rem' }}
        >
          Enhanced Game Implementation
        </h3>
        <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
          Experience the complete KONIVRER trading card game with all zones,
          mechanics, and enhanced card display.
        </p>
      </div>

      <Link
        to="/konivrer-demo"
        style={{
          display: 'inline-block',
          background: '#007bff',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          margin: '0.5rem',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#0056b3';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#007bff';
        }}
      >
Play KONIVRER Demo
      </Link>
    </motion.div>

    {/* AI Consciousness Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          color: '#000',
          marginBottom: '1rem',
          borderBottom: '2px solid #000',
          paddingBottom: '0.5rem',
        }}
      >
[BRAIN] AI Consciousness Testing
      </h2>

      <p
        style={{
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '1rem',
        }}
      >
        Test the cutting-edge AI system with 100% consciousness metrics, life
        card mortality awareness, and quantum decision making.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          '[PERCENT] 100% Consciousness Level',
          '[SKULL] Life Card Mortality Awareness',
          '[ATOM] Quantum Decision Engine',
          '[EYE] Theory of Mind Analysis',
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              padding: '0.5rem',
              background: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/ai-consciousness-demo"
          style={{
            background: '#28a745',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
View AI Demo
        </Link>
        <Link
          to="/game/ai-testing"
          style={{
            background: '#dc3545',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
        >
Play vs AI
        </Link>
      </div>
    </motion.div>

    {/* Player vs Player Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          color: '#000',
          marginBottom: '1rem',
          borderBottom: '2px solid #000',
          paddingBottom: '0.5rem',
        }}
      >
[SWORDS] Player vs Player
      </h2>

      <p
        style={{
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem',
        }}
      >
        Challenge other players in classic KONIVRER matches with full game
        mechanics and competitive play.
      </p>

      <Link
        to="/game/pvp"
        style={{
          background: '#6f42c1',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'all 0.3s ease',
        }}
      >
Challenge Players
      </Link>
    </motion.div>

    {/* Latest News Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          color: '#000',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #000',
          paddingBottom: '0.5rem',
        }}
      >
        Latest News
      </h2>

      {[
        {
          title: 'New Mobile Experience',
          desc: "We've completely redesigned our app for a better mobile experience with an esoteric theme and improved accessibility!",
        },
        {
          title: 'Tournament Season Begins',
          desc: 'Join our weekly tournaments for a chance to win exclusive prizes and earn special rewards.',
        },
        {
          title: 'New Card Set Released',
          desc: 'Explore the latest expansion with powerful new cards and exciting mechanics.',
        },
        {
          title: 'Community Event This Weekend',
          desc: 'Join us for a special community event with prizes, tournaments, and more!',
        },
      ].map((news, index) => (
        <div
          key={index}
          style={{
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: index < 3 ? '1px solid #eee' : 'none',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            {news.title}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            {news.desc}
          </p>
          <div style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#3a2921' }}>[STAR]</div>
        </div>
      ))}
    </motion.div>

    {/* Bottom Navigation Links */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      style={{
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '2rem',
      }}
    >
      {[
        { path: '/cards', label: 'Cards' },
        { path: '/decks', label: 'Decks' },
        { path: '/tournaments', label: 'Tournaments' },
        { path: '/game', label: 'Play' },
        { path: '/rules', label: 'Rules' },
      ].map((link, index) => (
        <Link
          key={index}
          to={link.path}
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '0.5rem 1rem',
            border: '1px solid #007bff',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#007bff';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#007bff';
          }}
        >
          {link.label}
        </Link>
      ))}
    </motion.div>
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

const RulesPage: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
      KONIVRER Rules
    </h1>
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h2>Game Overview</h2>
      <p>
        KONIVRER is a strategic trading card game where players use elemental
        magic and creatures to defeat their opponents.
      </p>

      <h3>Card Types</h3>
      <ul>
        <li>
          <strong>Fire, Water, Earth, Air</strong> - Magic elements
        </li>
        <li>
          <strong>Familiar Cards</strong> - Creatures you can summon
        </li>
        <li>
          <strong>Spell Cards</strong> - Special effects
        </li>
        <li>
          <strong>Life Cards</strong> - Your health points
        </li>
        <li>
          <strong>Flag Cards</strong> - Win conditions
        </li>
      </ul>

      <h3>How to Win</h3>
      <p>
        Use strategy and elemental combinations to defeat your opponent by
        reducing their life points to zero or achieving flag card conditions.
      </p>
    </div>
  </div>
);

const KonivreDemoPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ marginBottom: '2rem', color: '#333' }}>KONIVRER Demo</h1>
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Experience the complete KONIVRER trading card game with all zones,
        mechanics, and enhanced card display.
      </p>
      <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#3a2921' }}>[STAR]</div>
      <p>Demo coming soon! This will showcase the full game experience.</p>
    </div>
  </div>
);

const AIDemoPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ marginBottom: '2rem', color: '#333' }}>
      AI Consciousness Demo
    </h1>
    <div
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Test the cutting-edge AI system with 100% consciousness metrics, life
        card mortality awareness, and quantum decision making.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          '[PERCENT] 100% Consciousness Level',
          '[SKULL] Life Card Mortality Awareness',
          '[ATOM] Quantum Decision Engine',
          '[EYE] Theory of Mind Analysis',
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      <p>
        AI Demo coming soon! This will showcase advanced AI consciousness
        features.
      </p>
    </div>
  </div>
);



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
              title: '[TROPHY] Tournament',
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
      <h2>[TROPHY] Upcoming Tournaments</h2>
      <p>Weekly Championship - Starts in 2 days</p>
      <p>Monthly Grand Prix - Registration open</p>
      <p>Seasonal Championship - Qualifiers ongoing</p>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/registration logic here
    console.log('[LOGIN] Attempting login for:', username);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div
        style={{
          background: '#f8f0dd',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #8b5a2b',
          maxWidth: '400px',
          width: '100%',
          fontFamily: 'OpenDyslexic, Arial, sans-serif',
        }}
      >
        <h1 style={{ 
          marginBottom: '2rem', 
          color: '#3a2921',
          fontFamily: 'OpenDyslexic, Arial, sans-serif',
        }}>
          {isRegistering ? 'Register' : 'Login'}
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '1rem',
              border: '2px solid #8b5a2b',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'OpenDyslexic, Arial, sans-serif',
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '1rem',
              border: '2px solid #8b5a2b',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'OpenDyslexic, Arial, sans-serif',
            }}
          />
          
          <button
            type="submit"
            style={{
              padding: '1rem',
              background: '#3a2921',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'OpenDyslexic, Arial, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a1f19';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3a2921';
            }}
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        
        <p style={{ 
          marginTop: '1rem', 
          color: '#666',
          fontFamily: 'OpenDyslexic, Arial, sans-serif',
        }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3a2921',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              fontFamily: 'OpenDyslexic, Arial, sans-serif',
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

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

  // PWA registration and speed tracking initialization
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Track app initialization time
    if (!shouldSkipAutonomousSystems()) {
      trackCustomMetric('APP_INITIALIZATION', performance.now());
    }
  }, []);

  // Skip analytics during build
  const isBuilding = shouldSkipAutonomousSystems();

  return (
    <SecurityProvider>
      <SecurityAutomationProvider>
        <AppContext.Provider value={{ state, actions }}>
          <Router>
            <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
              <Navigation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/decks" element={<DeckBuilderPage />} />
                <Route path="/deck" element={<DeckBuilderPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/online" element={<GamePage />} />
                <Route path="/game/pvp" element={<GamePage />} />
                <Route path="/game/ai-testing" element={<GamePage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/konivrer-demo" element={<KonivreDemoPage />} />
                <Route path="/ai-consciousness-demo" element={<AIDemoPage />} />
              </Routes>
              <BackgroundAutomation />
            </div>
            {!isBuilding && <Analytics />}
            {!isBuilding && (
              <SpeedInsights
                beforeSend={(event: any) => {
                  // Enhanced speed tracking with custom metrics
                  if (
                    event.name === 'CLS' ||
                    event.name === 'LCP' ||
                    event.name === 'FID'
                  ) {
                    console.log(
                      `[SPEED INSIGHTS] ${event.name}: ${event.value}`,
                    );
                  }
                  return event;
                }}
              />
            )}
            <SpeedMonitor />
          </Router>
        </AppContext.Provider>
      </SecurityAutomationProvider>
    </SecurityProvider>
  );
};

// Invisible background automation component
const BackgroundAutomation: React.FC = () => {
  // Initialize autonomous systems silently
  useBackgroundCodeEvolution();
  useBackgroundDependencyManager();

  // Log that autonomous systems are active (only in development)
  React.useEffect(() => {
    // Skip autonomous systems during build/deployment
    if (shouldSkipAutonomousSystems()) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[AUTONOMOUS SYSTEMS] All systems active and running hyper-responsively in background',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] 🧬 Code Evolution: Monitoring technology trends (every second)',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] 📦 Dependency Manager: Checking for updates (every second)',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] 🛡️ Security Automation: Protecting against threats (every second)',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] ⚡ Performance Optimizer: Improving efficiency continuously',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] 🔇 Silent Operation: No user interaction required',
      );
      console.log(
        '[AUTONOMOUS SYSTEMS] ⚡ Hyper-Responsive: Maximum 1-second response time',
      );
    } else if (process.env.NODE_ENV === 'production') {
      console.log(
        '[AUTONOMOUS SYSTEMS] Production mode - autonomous systems disabled during deployment',
      );
    }
  }, []);

  // Return null - completely invisible to users
  return null;
};

export default AllInOneApp;
