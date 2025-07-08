import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

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
  { id: 'c1', name: 'Flame Serpent', cost: 3, type: 'Familiar', elements: ['Fire'], keywords: ['Aggressive'], strength: 4, description: 'A fierce serpent wreathed in flames' },
  { id: 'c2', name: 'Frost Shield', cost: 2, type: 'Spell', elements: ['Water'], keywords: ['Defensive'], description: 'Creates a protective barrier of ice' },
  { id: 'c3', name: 'Earth Golem', cost: 5, type: 'Familiar', elements: ['Earth'], keywords: ['Sturdy'], strength: 7, description: 'A massive creature of stone and soil' },
  { id: 'c4', name: 'Wind Blade', cost: 1, type: 'Spell', elements: ['Air'], keywords: ['Quick'], description: 'A swift cutting wind attack' },
  { id: 'c5', name: 'Lightning Hawk', cost: 4, type: 'Familiar', elements: ['Air', 'Fire'], keywords: ['Flying', 'Quick'], strength: 3, description: 'A majestic bird crackling with electricity' }
];

const BLOG_POSTS: BlogPost[] = [
  { id: 'b1', title: 'Mastering Fire Decks', content: 'Fire decks are all about speed and aggression...', author: 'CardMaster', date: '2024-01-15', tags: ['Strategy', 'Fire'] },
  { id: 'b2', title: 'Tournament Report', content: 'Last weekend\'s tournament was intense...', author: 'ProPlayer', date: '2024-01-10', tags: ['Tournament', 'Report'] }
];

// Navigation Component
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

  const navStyle = {
    background: '#000',
    color: 'white',
    padding: '15px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  };

  const linkStyle = (path: string) => ({
    color: '#d4af37',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    backgroundColor: location.pathname === path ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  });

  return (
    <header style={navStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>⭐ KONIVRER ⭐</h1>
          </Link>
          <span style={{ marginLeft: '10px', fontSize: '14px', opacity: 0.8 }}>Mystical Trading Card Game</span>
        </div>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            {[
              { path: '/', icon: '⭐', label: 'Home' },
              { path: '/cards', icon: '⭐', label: 'Cards' },
              { path: '/decks', icon: '⭐', label: 'Decks' },
              { path: '/tournament', icon: '⭐', label: 'Tournament' },
              { path: '/play', icon: '⭐', label: 'Play' },
              { path: '/blog', icon: '⭐', label: 'Blog' },
              { path: '/rules', icon: '⭐', label: 'Rules' }
            ].map(({ path, icon, label }) => (
              <li key={path} style={{ margin: '0 10px' }}>
                <Link to={path} style={linkStyle(path)}>
                  <span style={{ fontSize: '16px', marginBottom: '2px' }}>{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
            <li style={{ margin: '0 10px' }}>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  ...linkStyle('/login'),
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '16px', marginBottom: '2px' }}>⭐</span>
                {isLoggedIn ? 'Profile' : 'Login'}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #d4af37',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ marginTop: 0, color: '#d4af37' }}>⭐ Login to KONIVRER ⭐</h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d4af37',
                    borderRadius: '5px',
                    fontSize: '16px',
                    backgroundColor: '#333',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'white' }}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d4af37',
                    borderRadius: '5px',
                    fontSize: '16px',
                    backgroundColor: '#333',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d4af37',
                    borderRadius: '5px',
                    backgroundColor: 'transparent',
                    color: '#d4af37',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#d4af37',
                    color: '#000',
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
const HomePage: React.FC = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'white' }}>⭐ Welcome to KONIVRER ⭐</h1>
      <p style={{ fontSize: '20px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
        The ultimate mystical trading card game. Build powerful decks, discover ancient strategies, and compete with players from across the realms.
      </p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
      {[
        { title: 'Browse Cards', desc: 'Explore our mystical card collection', icon: '⭐', link: '/cards' },
        { title: 'Build Decks', desc: 'Create powerful deck combinations', icon: '⭐', link: '/decks' },
        { title: 'Join Tournaments', desc: 'Compete in epic tournaments', icon: '⭐', link: '/tournament' },
        { title: 'Play Now', desc: 'Battle against other mystics', icon: '⭐', link: '/play' }
      ].map(({ title, desc, icon, link }) => (
        <Link key={title} to={link} style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '30px',
            backgroundColor: '#1a1a1a',
            border: '2px solid #d4af37',
            borderRadius: '10px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{title}</h3>
            <p style={{ color: '#ccc' }}>{desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

// Cards Page
const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('');

  const filteredCards = useMemo(() => {
    return SAMPLE_CARDS.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || card.type === selectedType;
      const matchesElement = !selectedElement || card.elements.includes(selectedElement);
      return matchesSearch && matchesType && matchesElement;
    });
  }, [searchTerm, selectedType, selectedElement]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ Mystical Card Database ⭐</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search mystical cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d4af37',
            borderRadius: '5px',
            fontSize: '16px',
            minWidth: '200px',
            backgroundColor: '#333',
            color: 'white'
          }}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: '10px', border: '1px solid #d4af37', borderRadius: '5px', backgroundColor: '#333', color: 'white' }}
        >
          <option value="">All Types</option>
          <option value="Familiar">Familiar</option>
          <option value="Spell">Spell</option>
        </select>
        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
          style={{ padding: '10px', border: '1px solid #d4af37', borderRadius: '5px', backgroundColor: '#333', color: 'white' }}
        >
          <option value="">All Elements</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Earth">Earth</option>
          <option value="Air">Air</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredCards.map(card => (
          <div key={card.id} style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #d4af37',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ color: '#d4af37', margin: 0 }}>{card.name}</h3>
              <span style={{
                backgroundColor: '#d4af37',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {card.cost}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{
                backgroundColor: card.type === 'Familiar' ? '#8b5a2b' : '#5a4a3a',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                marginRight: '5px'
              }}>
                {card.type}
              </span>
              {card.strength && (
                <span style={{
                  backgroundColor: '#d4af37',
                  color: '#000',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  STR: {card.strength}
                </span>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}>
              {card.elements.map(element => (
                <span key={element} style={{
                  backgroundColor: '#333',
                  color: '#d4af37',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginRight: '5px'
                }}>
                  {element}
                </span>
              ))}
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Decks Page
const DecksPage: React.FC = () => {
  const [decks, setDecks] = useState([
    { id: 1, name: 'Fire Aggro', cards: 30, description: 'Fast-paced fire deck' },
    { id: 2, name: 'Water Control', cards: 30, description: 'Defensive water strategy' }
  ]);
  const [newDeckName, setNewDeckName] = useState('');

  const createDeck = () => {
    if (newDeckName.trim()) {
      setDecks([...decks, {
        id: Date.now(),
        name: newDeckName,
        cards: 0,
        description: 'New mystical deck'
      }]);
      setNewDeckName('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ Mystical Deck Builder ⭐</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1a1a1a', border: '2px solid #d4af37', borderRadius: '10px' }}>
        <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>Create New Deck</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Deck name..."
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #d4af37',
              borderRadius: '5px',
              fontSize: '16px',
              backgroundColor: '#333',
              color: 'white'
            }}
          />
          <button
            onClick={createDeck}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {decks.map(deck => (
          <div key={deck.id} style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #d4af37',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{deck.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>{deck.description}</p>
            <p style={{ color: '#d4af37', marginBottom: '15px' }}>{deck.cards} cards</p>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Edit Deck
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tournament Page
const TournamentPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ Mystical Tournaments ⭐</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
      {[
        { name: 'Weekly Championship', status: 'Open', players: '24/32', prize: '500 Gold' },
        { name: 'Elemental Masters', status: 'In Progress', players: '16/16', prize: '1000 Gold' },
        { name: 'Rookie Tournament', status: 'Open', players: '8/16', prize: '200 Gold' }
      ].map((tournament, index) => (
        <div key={index} style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #d4af37',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{tournament.name}</h3>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Status: <strong style={{ color: '#d4af37' }}>{tournament.status}</strong></p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Players: <strong style={{ color: '#d4af37' }}>{tournament.players}</strong></p>
            <p style={{ margin: '5px 0', color: '#ccc' }}>Prize: <strong style={{ color: '#d4af37' }}>{tournament.prize}</strong></p>
          </div>
          <button style={{
            padding: '10px 20px',
            backgroundColor: tournament.status === 'Open' ? '#d4af37' : '#666',
            color: tournament.status === 'Open' ? '#000' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            cursor: tournament.status === 'Open' ? 'pointer' : 'not-allowed'
          }}>
            {tournament.status === 'Open' ? 'Join Tournament' : 'View Details'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// Play Page
const PlayPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ Play KONIVRER ⭐</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      {[
        { title: 'Quick Match', desc: 'Find an opponent and start playing immediately', icon: '⭐' },
        { title: 'Ranked Match', desc: 'Compete in ranked games to climb the mystical ladder', icon: '⭐' },
        { title: 'Practice Mode', desc: 'Practice against AI opponents', icon: '⭐' },
        { title: 'Friend Match', desc: 'Play against your mystical allies', icon: '⭐' }
      ].map(({ title, desc, icon }) => (
        <div key={title} style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #d4af37',
          borderRadius: '10px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
          <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{title}</h3>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>{desc}</p>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#d4af37',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Start Game
          </button>
        </div>
      ))}
    </div>
  </div>
);

// Blog Page
const BlogPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ Mystical Chronicles ⭐</h1>
    
    <div style={{ display: 'grid', gap: '20px' }}>
      {BLOG_POSTS.map(post => (
        <div key={post.id} style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #d4af37',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>{post.title}</h2>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#ccc', marginRight: '15px' }}>By {post.author}</span>
            <span style={{ color: '#ccc' }}>{post.date}</span>
          </div>
          <p style={{ color: '#ccc', marginBottom: '15px' }}>{post.content}</p>
          <div>
            {post.tags.map(tag => (
              <span key={tag} style={{
                backgroundColor: '#333',
                color: '#d4af37',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginRight: '5px'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Rules Page
const RulesPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>⭐ KONIVRER Rules ⭐</h1>
    
    <div style={{ backgroundColor: '#1a1a1a', border: '2px solid #d4af37', borderRadius: '10px', padding: '30px' }}>
      <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Basic Game Rules</h2>
      
      <div style={{ color: '#ccc', lineHeight: '1.6' }}>
        <h3 style={{ color: '#d4af37' }}>Objective</h3>
        <p>Defeat your opponent by reducing their life points to zero using mystical cards and strategic gameplay.</p>
        
        <h3 style={{ color: '#d4af37' }}>Deck Construction</h3>
        <ul>
          <li>Minimum 30 cards per deck</li>
          <li>Maximum 3 copies of any single card</li>
          <li>Must include at least 2 different elements</li>
        </ul>
        
        <h3 style={{ color: '#d4af37' }}>Turn Structure</h3>
        <ol>
          <li>Draw Phase: Draw one card</li>
          <li>Main Phase: Play cards and activate abilities</li>
          <li>Combat Phase: Attack with your familiars</li>
          <li>End Phase: End your turn</li>
        </ol>
        
        <h3 style={{ color: '#d4af37' }}>Card Types</h3>
        <p><strong>Familiars:</strong> Creatures that can attack and defend</p>
        <p><strong>Spells:</strong> One-time effects that provide various benefits</p>
        
        <h3 style={{ color: '#d4af37' }}>Elements</h3>
        <p>Fire, Water, Earth, and Air each have unique strengths and weaknesses. Master them all to become a true mystic!</p>
      </div>
    </div>
  </div>
);

// Main App Component
const App: React.FC = () => (
  <div style={{ 
    minHeight: '100vh',
    background: '#0f0f0f',
    color: 'white',
    fontFamily: 'OpenDyslexic, Arial, sans-serif'
  }}>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/tournament" element={<TournamentPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;