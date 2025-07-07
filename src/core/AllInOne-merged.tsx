/**
 * KONIVRER All-in-One Core Application - Merged Version
 * Comprehensive app with all pages and features from all versions
 */

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SelfHealingErrorBoundary } from './SelfHealer';
import { withOptimization } from './SelfOptimizer';

// Conditional imports to prevent build issues
const isBuild = shouldSkipAutonomousSystems();

// Only import these if not in build mode
let Analytics = null;
let SpeedInsights = null;
let trackCustomMetric = null;
let SpeedMonitor = null;
let SecurityProvider = null;
let SecurityAutomationProvider = null;
let useBackgroundCodeEvolution = null;
let useBackgroundDependencyManager = null;

// Only load these modules if not in build mode
if (!isBuild) {
  try {
    // Dynamic imports for non-build environments
    import('@vercel/analytics/react').then(module => {
      Analytics = module.Analytics;
    });
    
    import('@vercel/speed-insights/react').then(module => {
      SpeedInsights = module.SpeedInsights;
    });
    
    import('../utils/speedTracking').then(module => {
      trackCustomMetric = module.trackCustomMetric;
    });
    
    import('../components/SpeedMonitor').then(module => {
      SpeedMonitor = module.default;
    });
    
    import('../security/SecurityProvider').then(module => {
      SecurityProvider = module.SecurityProvider;
    });
    
    import('../security/SecurityAutomation').then(module => {
      SecurityAutomationProvider = module.SecurityAutomationProvider;
    });
    
    import('../automation/BackgroundCodeEvolution').then(module => {
      useBackgroundCodeEvolution = module.useBackgroundCodeEvolution;
    });
    
    import('../automation/BackgroundDependencyManager').then(module => {
      useBackgroundDependencyManager = module.useBackgroundDependencyManager;
    });
  } catch (error) {
    console.error('[KONIVRER] Error loading dynamic modules:', error);
  }
}

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
}

// Sample data
const SAMPLE_CARDS: Card[] = [
  {
    id: 'c1',
    name: 'Flame Serpent',
    cost: 3,
    type: 'Familiar',
    elements: ['Fire'],
    keywords: ['Swift'],
    strength: 2,
    description: 'When summoned, deal 1 damage to target familiar.'
  },
  {
    id: 'c2',
    name: 'Frost Wolf',
    cost: 4,
    type: 'Familiar',
    elements: ['Water', 'Air'],
    keywords: ['Guard'],
    strength: 3,
    description: 'Opposing familiars must attack this first if able.'
  },
  {
    id: 'c3',
    name: 'Lightning Bolt',
    cost: 2,
    type: 'Spell',
    elements: ['Air'],
    keywords: ['Instant'],
    description: 'Deal 3 damage to any target.'
  },
  {
    id: 'c4',
    name: 'Earth Golem',
    cost: 5,
    type: 'Familiar',
    elements: ['Earth'],
    keywords: ['Sturdy'],
    strength: 4,
    description: 'Takes 1 less damage from all sources.'
  },
  {
    id: 'c5',
    name: 'Mystic Binding',
    cost: 3,
    type: 'Spell',
    elements: ['Spirit'],
    keywords: ['Continuous'],
    description: 'Target familiar cannot attack or use abilities.'
  },
  {
    id: 'c6',
    name: 'Shadow Assassin',
    cost: 4,
    type: 'Familiar',
    elements: ['Void'],
    keywords: ['Stealth', 'Swift'],
    strength: 3,
    description: 'Cannot be targeted by spells until it attacks.'
  }
];

const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'New Expansion Announced: Echoes of Eternity',
    content: 'We are excited to announce our next expansion set, Echoes of Eternity, coming this fall. This set introduces 120 new cards and two new mechanics: Resonance and Timeshift.',
    author: 'Dev Team',
    date: '2025-06-15',
    tags: ['Announcement', 'Expansion', 'New Cards']
  },
  {
    id: 'b2',
    title: 'Tournament Rules Update',
    content: 'Starting next month, all official tournaments will use the new Swiss-elimination hybrid format. This combines the best aspects of Swiss rounds with a clean elimination bracket.',
    author: 'Tournament Committee',
    date: '2025-06-10',
    tags: ['Tournament', 'Rules', 'Competitive']
  },
  {
    id: 'b3',
    title: 'Card Spotlight: Shadow Assassin',
    content: 'This week we take a deep dive into one of the most versatile cards in the current meta: Shadow Assassin. Learn strategies, counters, and deck building tips.',
    author: 'Strategy Team',
    date: '2025-06-05',
    tags: ['Strategy', 'Card Analysis', 'Meta']
  }
];

// Simple Navigation Component
const Navigation: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header style={{
      background: '#3a2921',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>KONIVRER</h1>
          </Link>
          <span style={{ marginLeft: '10px', fontSize: '14px', opacity: 0.8 }}>Card Game Database</span>
        </div>

        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={{ margin: '0 10px' }}>
              <Link to="/cards" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/cards' ? '2px solid white' : '2px solid transparent' }}>
                Cards
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/decks" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/decks' ? '2px solid white' : '2px solid transparent' }}>
                Decks
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/play" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/play' ? '2px solid white' : '2px solid transparent' }}>
                Play
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/events" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/events' ? '2px solid white' : '2px solid transparent' }}>
                Events
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/blog" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/blog' ? '2px solid white' : '2px solid transparent' }}>
                Blog
              </Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/rules" style={{ color: 'white', textDecoration: 'none', padding: '5px 0', borderBottom: location.pathname === '/rules' ? '2px solid white' : '2px solid transparent' }}>
                Rules
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}>
            <h2 style={{ color: '#3a2921', marginTop: 0 }}>Login</h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#3a2921' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#3a2921' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    background: '#ddd',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#8b5a2b',
                    border: 'none',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

// Home Page
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '36px',
          color: '#3a2921',
          marginBottom: '10px'
        }}>
          Welcome to KONIVRER
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          The ultimate card game of elemental strategy and tactical mastery
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Card Database</h3>
          <button 
            onClick={() => navigate('/cards')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Browse Cards
          </button>
        </div>
        
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Deck Builder</h3>
          <button 
            onClick={() => navigate('/decks')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Build Decks
          </button>
        </div>
        
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Game Rules</h3>
          <button 
            onClick={() => navigate('/play')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Learn to Play
          </button>
        </div>
        
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Tournaments</h3>
          <button 
            onClick={() => navigate('/events')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Join Events
          </button>
        </div>
        
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Latest News</h3>
          <button 
            onClick={() => navigate('/blog')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Read Blog
          </button>
        </div>
        
        <div style={{
          background: '#f2e8c9',
          border: '1px solid #8b5a2b',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Demo Game</h3>
          <button 
            onClick={() => navigate('/konivrer-demo')}
            style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5a2b'}
          >
            Try Demo
          </button>
        </div>
      </div>
    </div>
  );
};

// Cards Page
const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCards = SAMPLE_CARDS.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || card.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Card Database</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '70%',
            fontSize: '16px'
          }}
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '25%',
            fontSize: '16px'
          }}
        >
          <option value="All">All Types</option>
          <option value="Familiar">Familiars</option>
          <option value="Spell">Spells</option>
        </select>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredCards.map(card => (
          <div key={card.id} style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#3a2921' }}>{card.name}</h3>
              <span style={{ 
                background: '#8b5a2b', 
                color: 'white', 
                borderRadius: '50%', 
                width: '25px', 
                height: '25px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {card.cost}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {card.elements.map(element => (
                <span key={element} style={{
                  background: '#e0d2b4',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {element}
                </span>
              ))}
            </div>
            
            <div style={{ 
              background: '#e0d2b4', 
              padding: '8px', 
              borderRadius: '4px', 
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {card.type} {card.strength ? `• Strength: ${card.strength}` : ''}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              {card.keywords.map(keyword => (
                <span key={keyword} style={{
                  display: 'inline-block',
                  background: '#3a2921',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginRight: '5px',
                  marginBottom: '5px'
                }}>
                  {keyword}
                </span>
              ))}
            </div>
            
            <p style={{ margin: '0', fontSize: '14px', color: '#666', flex: 1 }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Deck Builder Page
const DecksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDeck, setCurrentDeck] = useState<Card[]>([]);

  const availableCards = SAMPLE_CARDS.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToDeck = (card: Card) => {
    if (currentDeck.length < 60) {
      setCurrentDeck(prev => [...prev, card]);
    }
  };

  const removeFromDeck = (index: number) => {
    setCurrentDeck(prev => prev.filter((_, i) => i !== index));
  };

  const deckStats = {
    totalCards: currentDeck.length,
    familiars: currentDeck.filter(card => card.type === 'Familiar').length,
    spells: currentDeck.filter(card => card.type === 'Spell').length,
    avgCost: currentDeck.length > 0
      ? (currentDeck.reduce((sum, card) => sum + card.cost, 0) / currentDeck.length).toFixed(1)
      : '0',
    elements: {
      Fire: currentDeck.filter(card => card.elements.includes('Fire')).length,
      Water: currentDeck.filter(card => card.elements.includes('Water')).length,
      Earth: currentDeck.filter(card => card.elements.includes('Earth')).length,
      Air: currentDeck.filter(card => card.elements.includes('Air')).length,
      Spirit: currentDeck.filter(card => card.elements.includes('Spirit')).length,
      Void: currentDeck.filter(card => card.elements.includes('Void')).length,
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Deck Builder</h1>
      
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Available Cards */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Available Cards</h2>
          
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '100%',
              fontSize: '16px',
              marginBottom: '20px'
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            maxHeight: '600px',
            overflowY: 'auto',
            padding: '10px',
            background: '#f9f5e8',
            borderRadius: '8px'
          }}>
            {availableCards.map(card => (
              <div key={card.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                background: '#f2e8c9',
                borderRadius: '4px',
                border: '1px solid #e0d2b4'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ 
                      background: '#8b5a2b', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '25px', 
                      height: '25px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {card.cost}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>{card.name}</span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: '#e0d2b4', 
                      padding: '2px 6px', 
                      borderRadius: '4px' 
                    }}>
                      {card.type}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => addToDeck(card)}
                  disabled={currentDeck.length >= 60}
                  style={{
                    background: currentDeck.length >= 60 ? '#ccc' : '#8b5a2b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: currentDeck.length >= 60 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current Deck */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ color: '#3a2921', margin: 0 }}>Current Deck</h2>
            <span style={{ 
              background: currentDeck.length >= 60 ? '#4caf50' : '#f9f5e8', 
              color: currentDeck.length >= 60 ? 'white' : '#3a2921',
              padding: '5px 10px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {currentDeck.length}/60 Cards
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '10px',
            background: '#f9f5e8',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {currentDeck.length === 0 ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: '#666',
                background: '#f2e8c9',
                borderRadius: '4px'
              }}>
                Your deck is empty. Add cards from the left panel.
              </div>
            ) : (
              currentDeck.map((card, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#f2e8c9',
                  borderRadius: '4px',
                  border: '1px solid #e0d2b4'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        background: '#8b5a2b', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: '25px', 
                        height: '25px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {card.cost}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{card.name}</span>
                      <span style={{ 
                        fontSize: '12px', 
                        background: '#e0d2b4', 
                        padding: '2px 6px', 
                        borderRadius: '4px' 
                      }}>
                        {card.type}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromDeck(index)}
                    style={{
                      background: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div style={{ 
            background: '#f2e8c9', 
            borderRadius: '8px', 
            padding: '15px',
            border: '1px solid #e0d2b4'
          }}>
            <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Deck Statistics</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Cards:</span>
                  <strong>{deckStats.totalCards}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Familiars:</span>
                  <strong>{deckStats.familiars}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Spells:</span>
                  <strong>{deckStats.spells}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Avg. Cost:</span>
                  <strong>{deckStats.avgCost}</strong>
                </p>
              </div>
              
              <div>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fire:</span>
                  <strong>{deckStats.elements.Fire}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Water:</span>
                  <strong>{deckStats.elements.Water}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Earth:</span>
                  <strong>{deckStats.elements.Earth}</strong>
                </p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Air:</span>
                  <strong>{deckStats.elements.Air}</strong>
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  background: currentDeck.length >= 60 ? '#4caf50' : '#8b5a2b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {currentDeck.length >= 60 ? 'Save Deck' : `Add ${60 - currentDeck.length} More Cards`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Play Page (Game Center)
const PlayPage: React.FC = () => {
  const gameOptions = [
    {
      title: 'vs AI',
      desc: 'Play against intelligent AI',
      action: () => alert('AI game coming soon!')
    },
    {
      title: 'vs Friend',
      desc: 'Local multiplayer game',
      action: () => alert('Local multiplayer coming soon!')
    },
    {
      title: 'Online Match',
      desc: 'Play against other players',
      action: () => alert('Online matches coming soon!')
    },
    {
      title: 'Tutorial',
      desc: 'Learn the basics',
      action: () => alert('Tutorial coming soon!')
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Game Center</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {gameOptions.map((option, index) => (
          <div key={index} style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}
          onClick={option.action}
          >
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>{option.title}</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>{option.desc}</p>
            <button style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Start
            </button>
          </div>
        ))}
      </div>
      
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '2px solid #8b5a2b'
      }}>
        <h2 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Basic Rules</h2>
        
        <div style={{ color: '#666', lineHeight: '1.6' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Game Overview</h3>
          <p>KONIVRER is a strategic card game where players summon familiars and cast spells using elemental energy. The goal is to reduce your opponent's life points to zero.</p>
          
          <h3 style={{ color: '#3a2921', margin: '20px 0 10px' }}>Setup</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Each player starts with 20 life points</li>
            <li>Shuffle your deck of exactly 60 cards</li>
            <li>Draw 5 cards to form your starting hand</li>
            <li>Decide randomly who goes first</li>
          </ul>
          
          <h3 style={{ color: '#3a2921', margin: '20px 0 10px' }}>Turn Structure</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li><strong>Draw Phase:</strong> Draw one card from your deck</li>
            <li><strong>Energy Phase:</strong> Gain one energy crystal (up to a maximum of 10)</li>
            <li><strong>Main Phase:</strong> Play familiars and spells by spending energy</li>
            <li><strong>Attack Phase:</strong> Attack with your familiars</li>
            <li><strong>End Phase:</strong> Resolve end-of-turn effects</li>
          </ol>
          
          <h3 style={{ color: '#3a2921', margin: '20px 0 10px' }}>Card Types</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Familiars:</strong> Creatures that fight for you. They have a strength value and can attack once per turn.</li>
            <li><strong>Spells:</strong> One-time effects or ongoing enchantments that modify the game state.</li>
          </ul>
          
          <h3 style={{ color: '#3a2921', margin: '20px 0 10px' }}>Winning the Game</h3>
          <p>Reduce your opponent's life points to zero, or force them to run out of cards in their deck.</p>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button style={{
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Download Complete Rulebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Events Page (Tournaments)
const EventsPage: React.FC = () => {
  const upcomingEvents = [
    {
      name: 'Weekly Championship',
      date: 'Starts in 2 days',
      description: 'Compete for weekly prizes and ranking points',
      status: 'Open Registration'
    },
    {
      name: 'Monthly Grand Prix',
      date: 'Registration open',
      description: 'The biggest monthly tournament with exclusive rewards',
      status: 'Open Registration'
    },
    {
      name: 'Beginner Friendly Tournament',
      date: 'Tomorrow',
      description: 'Perfect for new players to learn competitive play',
      status: 'Open Registration'
    },
    {
      name: 'Element Masters Series',
      date: 'Next week',
      description: 'Specialized tournament focusing on elemental mastery',
      status: 'Coming Soon'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Tournaments & Events</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Upcoming Events</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {upcomingEvents.map((event, index) => (
            <div key={index} style={{
              background: '#f2e8c9',
              border: '1px solid #8b5a2b',
              borderRadius: '8px',
              padding: '20px',
              position: 'relative'
            }}>
              <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '5px' }}>{event.name}</h3>
              <p style={{ color: '#666', margin: '0 0 10px', fontSize: '14px' }}>{event.date}</p>
              <p style={{ color: '#666', margin: '0 0 15px' }}>{event.description}</p>
              
              <button style={{
                background: '#8b5a2b',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Register Now
              </button>
              
              <span style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: event.status === 'Open Registration' ? '#4caf50' : '#ff9800',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '2px solid #8b5a2b',
        marginTop: '40px',
        maxWidth: '800px',
        margin: '40px auto 0',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Tournament Rules</h2>
        <div style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
          <p><strong>Deck Requirements:</strong> 60 cards minimum, no more than 3 copies of any single card</p>
          <p><strong>Match Format:</strong> Best of 3 games, Swiss rounds followed by elimination</p>
          <p><strong>Time Limits:</strong> 50 minutes per match, 25 minutes per game</p>
          <p><strong>Prizes:</strong> Tournament points, exclusive cards, and seasonal rewards</p>
        </div>
      </div>
    </div>
  );
};

// Blog Page
const BlogPage: React.FC = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>KONIVRER Blog</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px' }}>
        <div>
          {SAMPLE_BLOG_POSTS.map(post => (
            <div key={post.id} style={{
              background: 'white',
              borderRadius: '8px',
              padding: '25px',
              marginBottom: '30px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #e0d2b4'
            }}>
              <h2 style={{ color: '#3a2921', marginTop: 0, marginBottom: '10px' }}>{post.title}</h2>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#666', 
                fontSize: '14px',
                marginBottom: '15px'
              }}>
                <span style={{ marginRight: '15px' }}>By {post.author}</span>
                <span>{post.date}</span>
              </div>
              
              <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '20px' }}>
                {post.content}
              </p>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    background: '#f2e8c9',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#8b5a2b'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <button style={{
                  background: 'transparent',
                  color: '#8b5a2b',
                  border: '1px solid #8b5a2b',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div style={{
            background: '#f2e8c9',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            border: '1px solid #e0d2b4'
          }}>
            <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Categories</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              color: '#8b5a2b'
            }}>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e0d2b4' }}>Announcements</li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e0d2b4' }}>Strategy Guides</li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e0d2b4' }}>Card Spotlights</li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e0d2b4' }}>Tournament Reports</li>
              <li style={{ padding: '8px 0', borderBottom: '1px solid #e0d2b4' }}>Community Stories</li>
              <li style={{ padding: '8px 0' }}>Developer Updates</li>
            </ul>
          </div>
          
          <div style={{
            background: '#f2e8c9',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e0d2b4'
          }}>
            <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Subscribe</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Get the latest KONIVRER news delivered to your inbox
            </p>
            
            <input
              type="email"
              placeholder="Your email address"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #e0d2b4',
                marginBottom: '10px'
              }}
            />
            
            <button style={{
              width: '100%',
              background: '#8b5a2b',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rules Page
const RulesPage: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#3a2921', marginBottom: '30px', textAlign: 'center' }}>KONIVRER Rules</h1>
    
    <div style={{
      background: 'white',
      padding: '40px',
      borderRadius: '8px',
      border: '2px solid #8b5a2b'
    }}>
      <h2 style={{ color: '#3a2921', marginBottom: '20px' }}>Complete Rulebook</h2>
      
      <div style={{ color: '#444', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>1. Game Overview</h3>
          <p>KONIVRER is a strategic card game where players summon familiars and cast spells using elemental energy. The goal is to reduce your opponent's life points to zero.</p>
          <p>The game combines resource management, strategic planning, and tactical combat to create a deep and engaging experience.</p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>2. Game Components</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Cards:</strong> The primary game component, including Familiars and Spells</li>
            <li><strong>Energy Crystals:</strong> Resource tokens used to play cards</li>
            <li><strong>Life Counter:</strong> Tracks each player's remaining life points</li>
            <li><strong>Element Markers:</strong> Used to track elemental affinities</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>3. Card Types</h3>
          <h4 style={{ color: '#8b5a2b', marginBottom: '10px' }}>Familiars</h4>
          <p>Creatures that fight for you. They have the following attributes:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Cost:</strong> Energy required to summon</li>
            <li><strong>Strength:</strong> Combat power and damage dealt</li>
            <li><strong>Elements:</strong> Elemental affiliations</li>
            <li><strong>Keywords:</strong> Special abilities</li>
            <li><strong>Effect Text:</strong> Unique abilities</li>
          </ul>
          
          <h4 style={{ color: '#8b5a2b', margin: '15px 0 10px' }}>Spells</h4>
          <p>Magical effects that influence the game. Types include:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Instant:</strong> One-time effects</li>
            <li><strong>Continuous:</strong> Ongoing effects that remain in play</li>
            <li><strong>Reaction:</strong> Can be played during your opponent's turn</li>
            <li><strong>Ritual:</strong> Powerful effects with additional costs</li>
          </ul>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>4. Game Setup</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Each player starts with 20 life points</li>
            <li>Shuffle your deck of exactly 60 cards</li>
            <li>Draw 5 cards to form your starting hand</li>
            <li>Decide randomly who goes first</li>
            <li>First player does not draw a card on their first turn</li>
          </ol>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>5. Turn Structure</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li><strong>Draw Phase:</strong> Draw one card from your deck</li>
            <li><strong>Energy Phase:</strong> Gain one energy crystal (up to a maximum of 10)</li>
            <li><strong>Main Phase:</strong> Play familiars and spells by spending energy</li>
            <li><strong>Attack Phase:</strong> Attack with your familiars</li>
            <li><strong>End Phase:</strong> Resolve end-of-turn effects</li>
          </ol>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>6. Combat Rules</h3>
          <p>Combat follows these steps:</p>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Declare attackers (familiars can only attack once per turn)</li>
            <li>Opponent declares blockers (can block with multiple familiars)</li>
            <li>Resolve combat damage (both attacker and blocker deal damage equal to their strength)</li>
            <li>Unblocked attackers deal damage directly to the opponent's life points</li>
          </ol>
        </section>
        
        <section>
          <h3 style={{ color: '#3a2921', marginBottom: '15px' }}>7. Winning the Game</h3>
          <p>A player wins when any of these conditions are met:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Reduce opponent's life points to zero</li>
            <li>Force opponent to draw from an empty deck</li>
            <li>Meet a special victory condition specified by a card</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

// KONIVRER Demo Page
const KonivreDemoPage: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Interactive Demo</h1>
    
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '8px',
      border: '2px solid #8b5a2b',
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Experience KONIVRER</h2>
      <p style={{ color: '#666', maxWidth: '800px', margin: '0 auto 20px' }}>
        This interactive demo lets you play through a guided tutorial match to learn the basics of KONIVRER.
        No download required - play right in your browser!
      </p>
      
      <button style={{
        background: '#8b5a2b',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Start Demo
      </button>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Learn the Basics</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          The demo walks you through the fundamental mechanics of KONIVRER, including summoning familiars,
          casting spells, and engaging in combat.
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Card types and attributes</li>
          <li>Energy management</li>
          <li>Turn structure</li>
          <li>Basic combat</li>
        </ul>
      </div>
      
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Interactive Gameplay</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          The demo features a fully interactive game board where you can:
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Draw cards from your deck</li>
          <li>Play cards onto the field</li>
          <li>Attack and block with familiars</li>
          <li>Cast spells and activate abilities</li>
          <li>Track life points and resources</li>
        </ul>
      </div>
      
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>System Requirements</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          The demo runs in your browser with minimal requirements:
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li>JavaScript enabled</li>
          <li>Internet connection</li>
          <li>No downloads or installations required</li>
          <li>Works on desktop and tablet devices</li>
        </ul>
      </div>
    </div>
  </div>
);

// AI Demo Page
const AIDemoPage: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>AI Opponent Demo</h1>
    
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '8px',
      border: '2px solid #8b5a2b',
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Challenge Our Advanced AI</h2>
      <p style={{ color: '#666', maxWidth: '800px', margin: '0 auto 20px' }}>
        Test your skills against our sophisticated AI opponent that adapts to your playstyle and provides
        a challenging experience for players of all skill levels.
      </p>
      
      <button style={{
        background: '#8b5a2b',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Start AI Match
      </button>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Adaptive Difficulty</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Our AI features multiple difficulty levels that adapt to your skill:
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Beginner: Perfect for learning the game</li>
          <li>Intermediate: Challenges players with basic strategy</li>
          <li>Advanced: Uses complex tactics and combos</li>
          <li>Expert: Tournament-level play</li>
          <li>Adaptive: Adjusts to match your skill level</li>
        </ul>
      </div>
      
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>AI Features</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Our advanced AI opponent includes:
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Strategic decision making</li>
          <li>Deck analysis and counter-play</li>
          <li>Pattern recognition of your strategies</li>
          <li>Realistic play patterns</li>
          <li>Varied deck archetypes</li>
          <li>Hint system for learning</li>
        </ul>
      </div>
      
      <div style={{
        background: '#f2e8c9',
        borderRadius: '8px',
        padding: '25px',
        border: '1px solid #e0d2b4'
      }}>
        <h3 style={{ color: '#3a2921', marginTop: 0, marginBottom: '15px' }}>Practice & Improve</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          The AI demo helps you improve your skills:
        </p>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>Test new deck ideas</li>
          <li>Practice specific strategies</li>
          <li>Learn advanced techniques</li>
          <li>Receive feedback on your plays</li>
          <li>Track your win rate and improvement</li>
          <li>Available 24/7 for practice</li>
        </ul>
      </div>
    </div>
  </div>
);

// Login Page
const LoginPage: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      background: 'white',
      padding: '40px',
      borderRadius: '8px',
      border: '2px solid #8b5a2b'
    }}>
      <h1 style={{ color: '#3a2921', marginBottom: '30px', textAlign: 'center' }}>Account Login</h1>
      
      <form>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#3a2921', fontWeight: 'bold' }}>
            Username or Email
          </label>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #e0d2b4',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#3a2921', fontWeight: 'bold' }}>
            Password
          </label>
          <input
            type="password"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #e0d2b4',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="remember"
            style={{ marginRight: '10px' }}
          />
          <label htmlFor="remember" style={{ color: '#666' }}>
            Remember me
          </label>
          
          <a href="#" style={{ marginLeft: 'auto', color: '#8b5a2b', textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#8b5a2b',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Login
        </button>
        
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Don't have an account? <a href="#" style={{ color: '#8b5a2b', textDecoration: 'none' }}>Sign up</a></p>
        </div>
      </form>
    </div>
  </div>
);

// Silently optimize pages with the withOptimization HOC
const OptimizedHomePage = withOptimization(HomePage, { name: 'HomePage', memoize: true });
const OptimizedCardsPage = withOptimization(CardsPage, { name: 'CardsPage', memoize: true });
const OptimizedDecksPage = withOptimization(DecksPage, { name: 'DecksPage', memoize: true });
const OptimizedPlayPage = withOptimization(PlayPage, { name: 'PlayPage', memoize: true });
const OptimizedEventsPage = withOptimization(EventsPage, { name: 'EventsPage', memoize: true });
const OptimizedBlogPage = withOptimization(BlogPage, { name: 'BlogPage', memoize: true });
const OptimizedRulesPage = withOptimization(RulesPage, { name: 'RulesPage', memoize: true });
const OptimizedKonivreDemoPage = withOptimization(KonivreDemoPage, { name: 'KonivreDemoPage', memoize: true });
const OptimizedAIDemoPage = withOptimization(AIDemoPage, { name: 'AIDemoPage', memoize: true });
const OptimizedLoginPage = withOptimization(LoginPage, { name: 'LoginPage', memoize: true });

// Background Automation Component (only active in non-build environments)
const BackgroundAutomation: React.FC = () => {
  // Check if we're in build mode
  const isBuildMode = process.env.NODE_ENV === 'production' || 
                     process.env.VERCEL === '1' || 
                     process.env.VITE_BUILD === 'true' ||
                     process.env.DISABLE_AUTONOMOUS === 'true' ||
                     process.env.FORCE_BUILD_MODE === 'true' ||
                     process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
                     shouldSkipAutonomousSystems();
  
  useEffect(() => {
    // Skip autonomous systems during build/deployment
    if (isBuildMode) {
      console.log('[AUTONOMOUS SYSTEMS] Build mode detected - systems disabled');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTONOMOUS SYSTEMS] All systems active and running in background');
    }
  }, [isBuildMode]);

  // Return null - completely invisible to users
  return null;
};

// Main App Component
const AllInOneApp: React.FC = () => {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        background: '#f2e8c9',
        color: '#3a2921',
        fontFamily: 'OpenDyslexic, Arial, sans-serif'
      }}>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={
              <SelfHealingErrorBoundary>
                <OptimizedHomePage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/cards" element={
              <SelfHealingErrorBoundary>
                <OptimizedCardsPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/decks" element={
              <SelfHealingErrorBoundary>
                <OptimizedDecksPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/play" element={
              <SelfHealingErrorBoundary>
                <OptimizedPlayPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/events" element={
              <SelfHealingErrorBoundary>
                <OptimizedEventsPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/blog" element={
              <SelfHealingErrorBoundary>
                <OptimizedBlogPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/rules" element={
              <SelfHealingErrorBoundary>
                <OptimizedRulesPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/konivrer-demo" element={
              <SelfHealingErrorBoundary>
                <OptimizedKonivreDemoPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/ai-demo" element={
              <SelfHealingErrorBoundary>
                <OptimizedAIDemoPage />
              </SelfHealingErrorBoundary>
            } />
            <Route path="/login" element={
              <SelfHealingErrorBoundary>
                <OptimizedLoginPage />
              </SelfHealingErrorBoundary>
            } />
          </Routes>
        </main>
        <BackgroundAutomation />
        {!isBuild && Analytics && <Analytics />}
        {!isBuild && SpeedInsights && <SpeedInsights />}
      </div>
    </Router>
  );
};

export default AllInOneApp;