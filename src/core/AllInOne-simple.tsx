/**
 * KONIVRER All-in-One Core Application - Simple Version
 * Simplified app without complex automation systems
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

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
    <nav style={{
      background: '#8b5a2b',
      padding: '15px 20px',
      borderBottom: '3px solid #3a2921',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexWrap: 'wrap' }}>
        {!isHomePage && (
          <Link 
            to="/" 
            style={{
              color: '#f2e8c9',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Home
          </Link>
        )}
        <Link 
          to="/cards" 
          style={{
            color: '#f2e8c9',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Cards
        </Link>
        <Link 
          to="/decks" 
          style={{
            color: '#f2e8c9',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Decks
        </Link>
        <Link 
          to="/play" 
          style={{
            color: '#f2e8c9',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Play
        </Link>
        <Link 
          to="/events" 
          style={{
            color: '#f2e8c9',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b4423'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Tournaments
        </Link>
      </div>

      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              background: '#d9534f',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              background: '#5cb85c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#f2e8c9',
            padding: '30px',
            borderRadius: '8px',
            border: '2px solid #8b5a2b',
            minWidth: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ color: '#3a2921', marginBottom: '20px', textAlign: 'center' }}>Login</h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#3a2921', fontWeight: 'bold' }}>
                  Username:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8b5a2b',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#3a2921', fontWeight: 'bold' }}>
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #8b5a2b',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#5cb85c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

// Simple Home Page
const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="ancient-scroll" style={{
        border: '2px solid #8b5a2b',
        borderRadius: '5px',
        backgroundColor: '#f8f0dd',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        padding: '40px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#3a2921', fontSize: '48px', marginBottom: '20px' }}>
          KONIVRER Deck Database
        </h1>
        <p style={{ color: '#3a2921', fontSize: '20px', marginBottom: '30px' }}>
          Master the mystical arts of deck building
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '40px'
        }}>
          <div style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Card Database</h3>
            <Link to="/cards">
              <button style={{
                background: '#8b5a2b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                Browse Cards
              </button>
            </Link>
          </div>
          
          <div style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Deck Builder</h3>
            <Link to="/decks">
              <button style={{
                background: '#8b5a2b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                Build Decks
              </button>
            </Link>
          </div>
          
          <div style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Game Rules</h3>
            <Link to="/play">
              <button style={{
                background: '#8b5a2b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '10px'
              }}>
                Learn to Play
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample data for the pages
const SAMPLE_CARDS = [
  {
    id: '1',
    name: 'Fire Bolt',
    cost: 1,
    type: 'Spell' as const,
    elements: ['Fire'],
    keywords: ['Instant'],
    description: 'Deal 3 damage to any target. Quick and effective.'
  },
  {
    id: '2',
    name: 'Water Guardian',
    cost: 3,
    type: 'Familiar' as const,
    elements: ['Water'],
    keywords: ['Shield'],
    strength: 4,
    description: 'A protective water spirit that guards your life force.'
  },
  {
    id: '3',
    name: 'Earth Golem',
    cost: 5,
    type: 'Familiar' as const,
    elements: ['Earth'],
    keywords: ['Tough'],
    strength: 7,
    description: 'Massive stone creature with incredible durability.'
  },
  {
    id: '4',
    name: 'Air Strike',
    cost: 2,
    type: 'Spell' as const,
    elements: ['Air'],
    keywords: ['Flying'],
    description: 'Deal 4 damage to flying targets with precision.'
  },
  {
    id: '5',
    name: 'Lightning Sprite',
    cost: 2,
    type: 'Familiar' as const,
    elements: ['Lightning'],
    keywords: ['Quick', 'Flying'],
    strength: 3,
    description: 'Fast-moving electrical familiar that strikes from above.'
  }
];

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

// Card Component
const CardComponent: React.FC<{ card: Card; onAdd?: () => void; onRemove?: () => void }> = ({ 
  card, 
  onAdd, 
  onRemove 
}) => (
  <div style={{
    background: 'white',
    border: '2px solid #8b5a2b',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    position: 'relative'
  }}
  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <h3 style={{ color: '#3a2921', margin: 0, fontSize: '16px' }}>{card.name}</h3>
      <span style={{ 
        background: '#8b5a2b', 
        color: 'white', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {card.cost}
      </span>
    </div>
    
    <div style={{ marginBottom: '8px' }}>
      <span style={{ 
        background: card.type === 'Familiar' ? '#5cb85c' : '#5bc0de',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '11px',
        marginRight: '5px'
      }}>
        {card.type}
      </span>
      {card.strength && (
        <span style={{ 
          background: '#d9534f',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px'
        }}>
          STR: {card.strength}
        </span>
      )}
    </div>
    
    <p style={{ color: '#3a2921', fontSize: '12px', margin: '8px 0', lineHeight: '1.4' }}>
      {card.description}
    </p>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
      {card.elements.map(element => (
        <span key={element} style={{
          background: '#f0ad4e',
          color: 'white',
          padding: '1px 4px',
          borderRadius: '3px',
          fontSize: '10px'
        }}>
          {element}
        </span>
      ))}
      {card.keywords.map(keyword => (
        <span key={keyword} style={{
          background: '#777',
          color: 'white',
          padding: '1px 4px',
          borderRadius: '3px',
          fontSize: '10px'
        }}>
          {keyword}
        </span>
      ))}
    </div>

    {onAdd && (
      <button
        onClick={onAdd}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#5cb85c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Add
      </button>
    )}

    {onRemove && (
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#d9534f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Remove
      </button>
    )}
  </div>
);

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

  const types = ['All', 'Familiar', 'Spell'];

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: '#f2e8c9',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#3a2921',
        fontSize: '36px'
      }}>
        Card Database
      </h1>

      {/* Search and Filter */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #8b5a2b',
        marginBottom: '30px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px',
            border: '2px solid #8b5a2b',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px',
            border: '2px solid #8b5a2b',
            borderRadius: '4px',
            fontSize: '16px',
            background: 'white'
          }}
        >
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredCards.map(card => (
          <CardComponent key={card.id} card={card} />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#3a2921',
          fontSize: '18px'
        }}>
          No cards found matching your search criteria.
        </div>
      )}
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

  return (
    <div style={{ 
      padding: '40px 20px',
      background: '#f2e8c9',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#3a2921',
        fontSize: '36px'
      }}>
        Deck Builder
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Available Cards */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #8b5a2b'
        }}>
          <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Available Cards</h2>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #8b5a2b',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '16px'
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {availableCards.map(card => (
              <CardComponent 
                key={card.id} 
                card={card} 
                onAdd={() => addToDeck(card)}
              />
            ))}
          </div>
        </div>

        {/* Current Deck */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #8b5a2b'
        }}>
          <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>
            Current Deck ({currentDeck.length}/60)
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {currentDeck.map((card, index) => (
              <CardComponent 
                key={`${card.id}-${index}`} 
                card={card} 
                onRemove={() => removeFromDeck(index)}
              />
            ))}
            {currentDeck.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#666',
                fontSize: '16px'
              }}>
                Your deck is empty. Add cards from the left panel.
              </div>
            )}
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
      desc: 'Find online opponents',
      action: () => alert('Online matches coming soon!')
    },
    {
      title: 'Practice Mode',
      desc: 'Learn the game mechanics',
      action: () => alert('Practice mode coming soon!')
    }
  ];

  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center',
      background: '#f2e8c9',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        marginBottom: '30px', 
        color: '#3a2921',
        fontSize: '36px'
      }}>
        Game Center
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {gameOptions.map((option, index) => (
          <div
            key={index}
            onClick={option.action}
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              border: '2px solid #8b5a2b',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ 
              color: '#3a2921', 
              marginBottom: '10px',
              fontSize: '20px'
            }}>
              {option.title}
            </h3>
            <p style={{ 
              color: '#666', 
              margin: 0,
              fontSize: '14px'
            }}>
              {option.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '2px solid #8b5a2b',
        marginTop: '40px',
        maxWidth: '600px',
        margin: '40px auto 0'
      }}>
        <h2 style={{ color: '#3a2921', marginBottom: '15px' }}>Game Rules</h2>
        <p style={{ color: '#666', lineHeight: '1.6', textAlign: 'left' }}>
          KONIVRER is a strategic card game where players summon familiars and cast spells to defeat their opponents. 
          Each player starts with 20 life points and draws cards from their custom deck. 
          Use your mana wisely to play cards and control the battlefield!
        </p>
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
      description: 'Monthly tournament with exclusive card rewards',
      status: 'Registration Open'
    },
    {
      name: 'Seasonal Championship',
      date: 'Qualifiers ongoing',
      description: 'The biggest tournament of the season',
      status: 'Qualifiers'
    },
    {
      name: 'Beginner Tournament',
      date: 'Every Sunday',
      description: 'Perfect for new players to learn and compete',
      status: 'Weekly Event'
    }
  ];

  return (
    <div style={{ 
      padding: '40px 20px',
      background: '#f2e8c9',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#3a2921',
        fontSize: '36px'
      }}>
        Tournaments & Events
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {upcomingEvents.map((event, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '8px',
              border: '2px solid #8b5a2b',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ 
              color: '#3a2921', 
              marginBottom: '10px',
              fontSize: '20px'
            }}>
              {event.name}
            </h3>
            <p style={{ 
              color: '#8b5a2b', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {event.date}
            </p>
            <p style={{ 
              color: '#666', 
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              {event.description}
            </p>
            <span style={{
              background: event.status === 'Open Registration' || event.status === 'Registration Open' 
                ? '#5cb85c' : '#f0ad4e',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {event.status}
            </span>
          </div>
        ))}
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



// Main App Component
// Import self-healing and self-optimizing components
import { SelfHealingErrorBoundary } from './SelfHealer';
import { withOptimization, useSelfOptimizer } from './SelfOptimizer';

// Optimize pages with the withOptimization HOC
const OptimizedHomePage = withOptimization(HomePage, { name: 'HomePage', memoize: true });
const OptimizedCardsPage = withOptimization(CardsPage, { name: 'CardsPage', memoize: true });
const OptimizedDecksPage = withOptimization(DecksPage, { name: 'DecksPage', memoize: true });
const OptimizedPlayPage = withOptimization(PlayPage, { name: 'PlayPage', memoize: true });
const OptimizedEventsPage = withOptimization(EventsPage, { name: 'EventsPage', memoize: true });

const AllInOneApp: React.FC = () => {
  // Access the self-optimizer for on-demand optimization
  const { optimizeNow } = useSelfOptimizer();
  
  // Trigger optimization when the app loads
  useEffect(() => {
    optimizeNow();
  }, [optimizeNow]);
  
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
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AllInOneApp;