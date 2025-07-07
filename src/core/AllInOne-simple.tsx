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
          Events
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

          </div>
          
          <div style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Deck Builder</h3>

          </div>
          
          <div style={{
            background: '#f2e8c9',
            border: '1px solid #8b5a2b',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#3a2921', marginBottom: '10px' }}>Game Rules</h3>

          </div>
        </div>
      </div>
    </div>
  );
};

// Simple placeholder pages
const CardsPage: React.FC = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h1 style={{ color: '#3a2921' }}>Card Database</h1>
    <p style={{ color: '#3a2921' }}>Coming soon...</p>
  </div>
);

const DecksPage: React.FC = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h1 style={{ color: '#3a2921' }}>Deck Builder</h1>
    <p style={{ color: '#3a2921' }}>Coming soon...</p>
  </div>
);

const PlayPage: React.FC = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h1 style={{ color: '#3a2921' }}>Play Game</h1>
    <p style={{ color: '#3a2921' }}>Coming soon...</p>
  </div>
);

const EventsPage: React.FC = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h1 style={{ color: '#3a2921' }}>Events</h1>
    <p style={{ color: '#3a2921' }}>Coming soon...</p>
  </div>
);

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
            <Route path="/" element={<HomePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/decks" element={<DecksPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/events" element={<EventsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AllInOneApp;