/**
 * KONIVRER All-in-One Core Application - Streamlined Version
 * All features preserved, code optimized for conciseness
 */

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Import self-healing components conditionally
let SelfHealingErrorBoundary: any = null;
let withOptimization: any = null;

try {
  const selfHealerModule = require('./SelfHealer');
  SelfHealingErrorBoundary = selfHealerModule.SelfHealingErrorBoundary;
} catch (e) {
  // Fallback component
  SelfHealingErrorBoundary = ({ children, fallback }: any) => children || fallback;
}

try {
  const selfOptimizerModule = require('./SelfOptimizer');
  withOptimization = selfOptimizerModule.withOptimization;
} catch (e) {
  // Fallback HOC
  withOptimization = (component: any) => component;
}

// Import Vercel analytics directly for production
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Conditional imports to prevent build issues
const isBuild = shouldSkipAutonomousSystems();

// Dynamic imports for autonomous systems (only in development)
let trackCustomMetric = null, SpeedMonitor = null;
let SecurityProvider = null, SecurityAutomationProvider = null;
let useBackgroundCodeEvolution = null, useBackgroundDependencyManager = null, useUltraAutonomousCore = null;

if (!isBuild) {
  // Load autonomous systems with individual error handling
  import('../utils/speedTracking').then(m => {
    trackCustomMetric = m.trackCustomMetric;
    console.log('[KONIVRER] Speed tracking loaded');
  }).catch(e => console.warn('[KONIVRER] Speed tracking failed to load:', e));
  
  import('../components/SpeedMonitor').then(m => {
    SpeedMonitor = m.default;
    console.log('[KONIVRER] Speed monitor loaded');
  }).catch(e => console.warn('[KONIVRER] Speed monitor failed to load:', e));
  
  import('../security/SecurityProvider').then(m => {
    SecurityProvider = m.SecurityProvider;
    console.log('[KONIVRER] Security provider loaded');
  }).catch(e => console.warn('[KONIVRER] Security provider failed to load:', e));
  
  import('../security/SecurityAutomation').then(m => {
    SecurityAutomationProvider = m.SecurityAutomationProvider;
    console.log('[KONIVRER] Security automation loaded');
  }).catch(e => console.warn('[KONIVRER] Security automation failed to load:', e));
  
  import('../automation/BackgroundCodeEvolution').then(m => {
    useBackgroundCodeEvolution = m.useBackgroundCodeEvolution;
    console.log('[KONIVRER] Code evolution loaded');
  }).catch(e => console.warn('[KONIVRER] Code evolution failed to load:', e));
  
  import('../automation/BackgroundDependencyManager').then(m => {
    useBackgroundDependencyManager = m.useBackgroundDependencyManager;
    console.log('[KONIVRER] Dependency manager loaded');
  }).catch(e => console.warn('[KONIVRER] Dependency manager failed to load:', e));
  
  import('../automation/UltraAutonomousCore').then(m => {
    useUltraAutonomousCore = m.useUltraAutonomousCore;
    console.log('[KONIVRER] Ultra autonomous core loaded');
  }).catch(e => console.warn('[KONIVRER] Ultra autonomous core failed to load:', e));
}

// Types
interface Card {
  id: string; name: string; cost: number; type: 'Familiar' | 'Spell';
  elements: string[]; keywords: string[]; strength?: number; description: string;
}

interface BlogPost {
  id: string; title: string; content: string; author: string; date: string; tags: string[];
}

interface Deck { id: number; name: string; cards: Card[]; description: string; }

interface Tournament {
  id: string; name: string; status: 'Open' | 'In Progress' | 'Completed';
  players: number; maxPlayers: number; prize: string; startDate: string;
}

// Sample data
const SAMPLE_CARDS: Card[] = [
  { id: 'c1', name: 'Flame Serpent', cost: 3, type: 'Familiar', elements: ['Fire'], keywords: ['Aggressive'], strength: 4, description: 'A fierce serpent wreathed in flames' },
  { id: 'c2', name: 'Frost Shield', cost: 2, type: 'Spell', elements: ['Water'], keywords: ['Defensive'], description: 'Creates a protective barrier of ice' },
  { id: 'c3', name: 'Earth Golem', cost: 5, type: 'Familiar', elements: ['Earth'], keywords: ['Sturdy'], strength: 7, description: 'A massive creature of stone and soil' },
  { id: 'c4', name: 'Wind Blade', cost: 1, type: 'Spell', elements: ['Air'], keywords: ['Quick'], description: 'A swift cutting wind attack' },
  { id: 'c5', name: 'Lightning Hawk', cost: 4, type: 'Familiar', elements: ['Air', 'Fire'], keywords: ['Flying', 'Quick'], strength: 3, description: 'A majestic bird crackling with electricity' },
  { id: 'c6', name: 'Crystal Shard', cost: 2, type: 'Spell', elements: ['Earth'], keywords: ['Piercing'], description: 'Sharp crystal projectiles' },
  { id: 'c7', name: 'Water Elemental', cost: 4, type: 'Familiar', elements: ['Water'], keywords: ['Fluid'], strength: 5, description: 'A being of pure water' },
  { id: 'c8', name: 'Fire Storm', cost: 6, type: 'Spell', elements: ['Fire'], keywords: ['Area'], description: 'Devastating area fire attack' }
];

const BLOG_POSTS: BlogPost[] = [
  { id: 'b1', title: 'Mastering Fire Decks', content: 'Fire decks are all about speed and aggression. Focus on low-cost creatures and direct damage spells...', author: 'CardMaster', date: '2024-01-15', tags: ['Strategy', 'Fire'] },
  { id: 'b2', title: 'Tournament Report: Winter Championship', content: 'Last weekend\'s tournament was intense with over 200 participants...', author: 'ProPlayer', date: '2024-01-10', tags: ['Tournament', 'Report'] },
  { id: 'b3', title: 'New Card Reveals', content: 'Exciting new cards coming in the next expansion...', author: 'DevTeam', date: '2024-01-05', tags: ['News', 'Cards'] }
];

const TOURNAMENTS: Tournament[] = [
  { id: 't1', name: 'Weekly Championship', status: 'Open', players: 24, maxPlayers: 32, prize: '500 Gold', startDate: '2024-01-20' },
  { id: 't2', name: 'Elemental Masters', status: 'In Progress', players: 16, maxPlayers: 16, prize: '1000 Gold', startDate: '2024-01-18' },
  { id: 't3', name: 'Rookie Tournament', status: 'Open', players: 8, maxPlayers: 16, prize: '200 Gold', startDate: '2024-01-22' }
];

// Context for global state
const AppContext = createContext<{
  user: any; setUser: (user: any) => void;
  decks: Deck[]; setDecks: (decks: Deck[]) => void;
  bookmarks: string[]; setBookmarks: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  user: null, setUser: () => {}, decks: [], setDecks: () => {}, bookmarks: [], setBookmarks: () => {}
});

// Utility components
const PageContainer: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}
  >
    {title && <h1 style={{ color: '#d4af37', marginBottom: '30px', textAlign: 'center' }}>⭐ {title} ⭐</h1>}
    {children}
  </motion.div>
);

const Card: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      backgroundColor: '#1a1a1a', border: '2px solid #d4af37', borderRadius: '10px',
      padding: '20px', cursor: onClick ? 'pointer' : 'default', transition: 'all 0.3s ease'
    }}
  >
    {children}
  </motion.div>
);

// Navigation Component
const Navigation: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setUser({ username: credentials.username, isLoggedIn: true });
      setShowLoginModal(false);
      setCredentials({ username: '', password: '' });
    }
  };

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/cards', icon: '🗃️', label: 'Cards' },
    { path: '/decks', icon: '📚', label: 'Decks' },
    { path: '/tournament', icon: '🏆', label: 'Tournament' },
    { path: '/play', icon: '▶️', label: 'Play' }
  ];

  return (
    <header style={{ 
      background: '#000', 
      color: 'white', 
      padding: '8px 15px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      minHeight: '60px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        maxWidth: '1400px', 
        margin: '0 auto',
        gap: '15px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', flexShrink: 0 }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>⭐</h1>
        </Link>
        
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'visible' }}>
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            overflow: 'visible'
          }}>
            {navItems.map(({ path, icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  style={{
                    color: '#d4af37', 
                    textDecoration: 'none', 
                    padding: '6px 8px', 
                    borderRadius: '4px',
                    backgroundColor: location.pathname === path ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    minWidth: '50px',
                    maxWidth: '70px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== path) {
                      e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '14px', marginBottom: '1px' }}>{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              background: 'none', 
              border: '1px solid #d4af37', 
              color: '#d4af37', 
              cursor: 'pointer',
              padding: '6px 12px', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px', 
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px' }}>↗️</span>
            {user?.isLoggedIn ? 'Profile' : 'Login'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                backgroundColor: '#1a1a1a', color: 'white', padding: '30px', borderRadius: '10px',
                border: '2px solid #d4af37', maxWidth: '400px', width: '90%'
              }}
            >
              <h2 style={{ marginTop: 0, color: '#d4af37' }}>⭐ Login to KONIVRER ⭐</h2>
              <form onSubmit={handleLogin}>
                {['username', 'password'].map(field => (
                  <div key={field} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'white', textTransform: 'capitalize' }}>
                      {field}:
                    </label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      value={credentials[field as keyof typeof credentials]}
                      onChange={(e) => setCredentials(prev => ({ ...prev, [field]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px', border: '1px solid #d4af37', borderRadius: '5px',
                        fontSize: '16px', backgroundColor: '#333', color: 'white'
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    style={{
                      padding: '10px 20px', border: '1px solid #d4af37', borderRadius: '5px',
                      backgroundColor: 'transparent', color: '#d4af37', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px', border: 'none', borderRadius: '5px',
                      backgroundColor: '#d4af37', color: '#000', cursor: 'pointer'
                    }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Page Components
const HomePage: React.FC = () => {
  const features = [
    { title: 'Browse Cards', desc: 'Explore our mystical card collection', link: '/cards' },
    { title: 'Build Decks', desc: 'Create powerful deck combinations', link: '/decks' },
    { title: 'Join Tournaments', desc: 'Compete in epic tournaments', link: '/tournament' },
    { title: 'Play Now', desc: 'Battle against other mystics', link: '/play' }
  ];

  return (
    <PageContainer>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'white' }}>⭐ Welcome to KONIVRER ⭐</h1>
        <p style={{ fontSize: '20px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
          The ultimate mystical trading card game. Build powerful decks, discover ancient strategies, and compete with players from across the realms.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {features.map(({ title, desc, link }) => (
          <Link key={title} to={link} style={{ textDecoration: 'none' }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>{title}</h3>
                <p style={{ color: '#ccc' }}>{desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('');

  const filteredCards = useMemo(() => {
    let results = SAMPLE_CARDS;
    
    // Enhanced search with advanced syntax support
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Check for advanced syntax patterns
      const nameMatch = searchTerm.match(/name:([^\s]+)/i);
      const costMatch = searchTerm.match(/cost:([<>=]+)?(\d+)/i);
      const typeMatch = searchTerm.match(/type:([^\s]+)/i);
      const elementMatch = searchTerm.match(/element:([^\s]+)/i);
      
      results = results.filter(card => {
        // Name search
        if (nameMatch) {
          const nameQuery = nameMatch[1].toLowerCase();
          if (!card.name.toLowerCase().includes(nameQuery)) return false;
        }
        
        // Cost search
        if (costMatch) {
          const operator = costMatch[1] || '=';
          const value = parseInt(costMatch[2]);
          if (operator === '>=' && card.cost < value) return false;
          if (operator === '<=' && card.cost > value) return false;
          if (operator === '>' && card.cost <= value) return false;
          if (operator === '<' && card.cost >= value) return false;
          if (operator === '=' && card.cost !== value) return false;
        }
        
        // Type search
        if (typeMatch) {
          const typeQuery = typeMatch[1].toLowerCase();
          if (!card.type.toLowerCase().includes(typeQuery)) return false;
        }
        
        // Element search
        if (elementMatch) {
          const elementQuery = elementMatch[1].toLowerCase();
          if (!card.elements.some(el => el.toLowerCase().includes(elementQuery))) return false;
        }
        
        // If no advanced syntax, do regular text search
        if (!nameMatch && !costMatch && !typeMatch && !elementMatch) {
          const matchesSearch = card.name.toLowerCase().includes(searchLower) ||
                               card.description.toLowerCase().includes(searchLower) ||
                               card.keywords.some(k => k.toLowerCase().includes(searchLower));
          if (!matchesSearch) return false;
        }
        
        return true;
      });
    }
    
    // Apply filter dropdowns
    results = results.filter(card => {
      const matchesType = !selectedType || card.type === selectedType;
      const matchesElement = !selectedElement || card.elements.includes(selectedElement);
      return matchesType && matchesElement;
    });
    
    return results;
  }, [searchTerm, selectedType, selectedElement]);

  const filterStyle = {
    padding: '10px', border: '1px solid #d4af37', borderRadius: '5px',
    backgroundColor: '#333', color: 'white', fontSize: '16px'
  };

  return (
    <PageContainer title="Cards & Search">
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search cards... (try: name:fire, cost:>=3, type:familiar, element:water)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...filterStyle, minWidth: '200px', flex: 1 }}
        />
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={filterStyle}>
          <option value="">All Types</option>
          <option value="Familiar">Familiar</option>
          <option value="Spell">Spell</option>
        </select>
        <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)} style={filterStyle}>
          <option value="">All Elements</option>
          {['Fire', 'Water', 'Earth', 'Air'].map(element => (
            <option key={element} value={element}>{element}</option>
          ))}
        </select>
      </div>

      {/* Search Results Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: '#ccc',
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        <span>Found {filteredCards.length} cards</span>
        {(searchTerm || selectedType || selectedElement) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setSelectedElement('');
            }}
            style={{
              background: 'none',
              border: '1px solid #d4af37',
              color: '#d4af37',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Search Syntax Help */}
      {searchTerm && (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#ccc'
        }}>
          <strong style={{ color: '#d4af37' }}>Advanced Search Syntax:</strong> 
          <span style={{ marginLeft: '10px' }}>
            name:fire • cost:&gt;=3 • cost:&lt;=2 • type:familiar • element:water
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredCards.map(card => (
          <Card key={card.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ color: '#d4af37', margin: 0 }}>{card.name}</h3>
              <span style={{
                backgroundColor: '#d4af37', color: '#000', padding: '4px 8px',
                borderRadius: '12px', fontSize: '14px', fontWeight: 'bold'
              }}>
                {card.cost}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: card.type === 'Familiar' ? '#8b5a2b' : '#5a4a3a',
                color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginRight: '5px'
              }}>
                {card.type}
              </span>
              {card.strength && (
                <span style={{
                  backgroundColor: '#d4af37', color: '#000', padding: '2px 6px',
                  borderRadius: '4px', fontSize: '12px'
                }}>
                  STR: {card.strength}
                </span>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}>
              {card.elements.map(element => (
                <span key={element} style={{
                  backgroundColor: '#333', color: '#d4af37', padding: '2px 6px',
                  borderRadius: '4px', fontSize: '12px', marginRight: '5px'
                }}>
                  {element}
                </span>
              ))}
            </div>
            <div style={{ marginBottom: '10px' }}>
              {card.keywords.map(keyword => (
                <span key={keyword} style={{
                  backgroundColor: '#555', color: 'white', padding: '2px 6px',
                  borderRadius: '4px', fontSize: '12px', marginRight: '5px'
                }}>
                  {keyword}
                </span>
              ))}
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>{card.description}</p>
          </Card>
        ))}
      </div>
      
      {/* No Results Message */}
      {filteredCards.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#ccc',
          fontSize: '18px',
          marginTop: '50px'
        }}>
          <p>No cards found matching your search criteria.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Try adjusting your search terms or clearing the filters.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

const DecksPage: React.FC = () => {
  const { decks, setDecks } = useContext(AppContext);
  const [newDeckName, setNewDeckName] = useState('');

  const createDeck = () => {
    if (newDeckName.trim()) {
      setDecks([...decks, {
        id: Date.now(),
        name: newDeckName,
        cards: [],
        description: 'New mystical deck'
      }]);
      setNewDeckName('');
    }
  };

  return (
    <PageContainer title="Mystical Deck Builder">
      <Card>
        <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>Create New Deck</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Deck name..."
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            style={{
              flex: 1, padding: '10px', border: '1px solid #d4af37', borderRadius: '5px',
              fontSize: '16px', backgroundColor: '#333', color: 'white'
            }}
          />
          <button
            onClick={createDeck}
            style={{
              padding: '10px 20px', backgroundColor: '#d4af37', color: '#000',
              border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}
          >
            Create
          </button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {decks.map(deck => (
          <Card key={deck.id}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{deck.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>{deck.description}</p>
            <p style={{ color: '#d4af37', marginBottom: '15px' }}>{deck.cards.length} cards</p>
            <button style={{
              padding: '8px 16px', backgroundColor: '#d4af37', color: '#000',
              border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}>
              Edit Deck
            </button>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

const TournamentPage: React.FC = () => (
  <PageContainer title="Mystical Tournaments">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
      {TOURNAMENTS.map(tournament => (
        <Card key={tournament.id}>
          <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{tournament.name}</h3>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '5px 0', color: '#ccc' }}>
              Status: <strong style={{ color: '#d4af37' }}>{tournament.status}</strong>
            </p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>
              Players: <strong style={{ color: '#d4af37' }}>{tournament.players}/{tournament.maxPlayers}</strong>
            </p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>
              Prize: <strong style={{ color: '#d4af37' }}>{tournament.prize}</strong>
            </p>
          </div>
          <button style={{
            padding: '10px 20px',
            backgroundColor: tournament.status === 'Open' ? '#d4af37' : '#666',
            color: tournament.status === 'Open' ? '#000' : '#ccc',
            border: 'none', borderRadius: '5px',
            cursor: tournament.status === 'Open' ? 'pointer' : 'not-allowed'
          }}>
            {tournament.status === 'Open' ? 'Join Tournament' : 'View Details'}
          </button>
        </Card>
      ))}
    </div>
  </PageContainer>
);

const PlayPage: React.FC = () => {
  const gameModes = [
    { title: 'Quick Match', desc: 'Find an opponent and start playing immediately', icon: '⭐' },
    { title: 'Ranked Match', desc: 'Compete in ranked games to climb the mystical ladder', icon: '⭐' },
    { title: 'Practice Mode', desc: 'Practice against AI opponents', icon: '⭐' },
    { title: 'Friend Match', desc: 'Play against your mystical allies', icon: '⭐' }
  ];

  return (
    <PageContainer title="Play KONIVRER">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {gameModes.map(({ title, desc, icon }) => (
          <Card key={title}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
              <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{title}</h3>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>{desc}</p>
              <button style={{
                padding: '12px 24px', backgroundColor: '#d4af37', color: '#000',
                border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
              }}>
                Start Game
              </button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

const BlogPage: React.FC = () => {
  const { bookmarks, setBookmarks } = useContext(AppContext);

  const toggleBookmark = (postId: string) => {
    setBookmarks(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <PageContainer title="Mystical Chronicles">
      <div style={{ display: 'grid', gap: '20px' }}>
        {BLOG_POSTS.map(post => (
          <Card key={post.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>{post.title}</h2>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ color: '#ccc', marginRight: '15px' }}>By {post.author}</span>
                  <span style={{ color: '#ccc' }}>{post.date}</span>
                </div>
                <p style={{ color: '#ccc', marginBottom: '15px' }}>{post.content}</p>
                <div>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      backgroundColor: '#333', color: '#d4af37', padding: '2px 8px',
                      borderRadius: '4px', fontSize: '12px', marginRight: '5px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(post.id)}
                style={{
                  background: 'none', border: 'none', color: bookmarks.includes(post.id) ? '#d4af37' : '#666',
                  cursor: 'pointer', fontSize: '20px', marginLeft: '15px'
                }}
              >
                ⭐
              </button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

const RulesPage: React.FC = () => (
  <PageContainer title="KONIVRER Rules">
    <Card>
      <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Basic Game Rules</h2>
      <div style={{ color: '#ccc', lineHeight: '1.6' }}>
        {[
          { title: 'Objective', content: 'Defeat your opponent by reducing their life points to zero using mystical cards and strategic gameplay.' },
          { title: 'Deck Construction', content: ['Minimum 30 cards per deck', 'Maximum 3 copies of any single card', 'Must include at least 2 different elements'] },
          { title: 'Turn Structure', content: ['Draw Phase: Draw one card', 'Main Phase: Play cards and activate abilities', 'Combat Phase: Attack with your familiars', 'End Phase: End your turn'] },
          { title: 'Card Types', content: 'Familiars: Creatures that can attack and defend. Spells: One-time effects that provide various benefits.' },
          { title: 'Elements', content: 'Fire, Water, Earth, and Air each have unique strengths and weaknesses. Master them all to become a true mystic!' }
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#d4af37' }}>{title}</h3>
            {Array.isArray(content) ? (
              <ul>{content.map((item, i) => <li key={i}>{item}</li>)}</ul>
            ) : (
              <p>{content}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  </PageContainer>
);

// Main App Component with all autonomous systems
const AllInOneApp: React.FC = () => {
  console.log('[KONIVRER] App initializing...');
  console.log('[KONIVRER] Build mode:', isBuild);
  
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState<Deck[]>([
    { id: 1, name: 'Fire Aggro', cards: [], description: 'Fast-paced fire deck' },
    { id: 2, name: 'Water Control', cards: [], description: 'Defensive water strategy' }
  ]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Initialize autonomous systems if not in build mode
  useEffect(() => {
    if (!isBuild) {
      try {
        // Initialize ultra-autonomous systems for 24/7/365 silent operation
        if (useUltraAutonomousCore) {
          useUltraAutonomousCore();
          console.log('[KONIVRER] Ultra autonomous core initialized');
        }
        if (useBackgroundCodeEvolution) {
          useBackgroundCodeEvolution();
          console.log('[KONIVRER] Background code evolution initialized');
        }
        if (useBackgroundDependencyManager) {
          useBackgroundDependencyManager();
          console.log('[KONIVRER] Background dependency manager initialized');
        }
        if (trackCustomMetric) {
          trackCustomMetric('app_initialized', 1);
          console.log('[KONIVRER] Metrics tracking initialized');
        }
        
        // Log silent autonomous activation
        console.log('[KONIVRER] 🤖 Ultra-autonomous systems activated - 24/7/365 silent operation');
      } catch (error) {
        console.warn('[KONIVRER] Some autonomous systems failed to initialize:', error);
      }
    }
  }, []);

  const contextValue = { user, setUser, decks, setDecks, bookmarks, setBookmarks };

  const AppContent = () => (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white', fontFamily: 'OpenDyslexic, Arial, sans-serif' }}>
      <Router>
        <AppContext.Provider value={contextValue}>
          <Navigation />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/tournament" element={<TournamentPage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/rules" element={<RulesPage />} />
            </Routes>
          </AnimatePresence>
          {!isBuild && SpeedMonitor && <SpeedMonitor />}
        </AppContext.Provider>
      </Router>
      <Analytics />
      <SpeedInsights />
    </div>
  );

  // Always render core app with optional enhancements
  const CoreApp = () => <AppContent />;
  
  // Try to enhance with autonomous systems, but always fallback to core app
  try {
    return (
      <SelfHealingErrorBoundary
        fallback={<CoreApp />}
      >
        {!isBuild && SecurityProvider && SecurityAutomationProvider ? (
          <SecurityProvider>
            <SecurityAutomationProvider>
              <CoreApp />
            </SecurityAutomationProvider>
          </SecurityProvider>
        ) : (
          <CoreApp />
        )}
      </SelfHealingErrorBoundary>
    );
  } catch (error) {
    console.warn('[KONIVRER] Enhanced features failed, using core app:', error);
    return <CoreApp />;
  }
};

// Export optimized components
export default withOptimization(AllInOneApp, { name: 'AllInOneApp', memoize: true });
export const OptimizedHomePage = withOptimization(HomePage, { name: 'HomePage', memoize: true });
export const OptimizedCardsPage = withOptimization(CardsPage, { name: 'CardsPage', memoize: true });
export const OptimizedDecksPage = withOptimization(DecksPage, { name: 'DecksPage', memoize: true });
export const OptimizedPlayPage = withOptimization(PlayPage, { name: 'PlayPage', memoize: true });
export const OptimizedTournamentPage = withOptimization(TournamentPage, { name: 'TournamentPage', memoize: true });
export const OptimizedBlogPage = withOptimization(BlogPage, { name: 'BlogPage', memoize: true });
export const OptimizedRulesPage = withOptimization(RulesPage, { name: 'RulesPage', memoize: true });