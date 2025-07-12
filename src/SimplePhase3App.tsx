import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SimpleEnhancedLoginModal from './components/SimpleEnhancedLoginModal';

// Types
interface User {
  id: string; 
  username: string; 
  email: string; 
  level: number;
}

const SimplePhase3App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (user: User) => {
    setUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0f0f0f', 
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <header style={{ 
          padding: '20px', 
          borderBottom: '2px solid #d4af37',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#d4af37', margin: 0 }}>⭐ KONIVRER Deck Database ⭐</h1>
          <div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>Welcome, {user.username}!</span>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#d4af37',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#d4af37',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Navigation */}
        <nav style={{ 
          padding: '15px 20px', 
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #333'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: '#d4af37', textDecoration: 'none' }}>Home</Link>
            <Link to="/cards" style={{ color: '#d4af37', textDecoration: 'none' }}>Cards</Link>
            <Link to="/decks" style={{ color: '#d4af37', textDecoration: 'none' }}>Decks</Link>
            <Link to="/blog" style={{ color: '#d4af37', textDecoration: 'none' }}>Blog</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={
              <div>
                <h2 style={{ color: '#d4af37' }}>Welcome to KONIVRER</h2>
                <p>Your premier deck building and card database for the KONIVRER trading card game.</p>
                {!user && (
                  <div style={{ marginTop: '20px' }}>
                    <p>Please log in to access all features including the enhanced login modal with:</p>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      <li>🔐 Advanced security features</li>
                      <li>🔑 SSO integration</li>
                      <li>👆 Biometric authentication</li>
                      <li>🛡️ Password strength checking</li>
                      <li>🎨 Modern UI design</li>
                    </ul>
                  </div>
                )}
              </div>
            } />
            <Route path="/cards" element={
              <div>
                <h2 style={{ color: '#d4af37' }}>Card Database</h2>
                <p>Browse and search through our extensive card collection.</p>
              </div>
            } />
            <Route path="/decks" element={
              <div>
                <h2 style={{ color: '#d4af37' }}>Deck Builder</h2>
                <p>Create and manage your custom decks.</p>
              </div>
            } />
            <Route path="/blog" element={
              <div>
                <h2 style={{ color: '#d4af37' }}>Strategy Blog</h2>
                <p>Read the latest strategy guides and game updates.</p>
              </div>
            } />
          </Routes>
        </main>

        {/* Enhanced Login Modal */}
        {showLoginModal && (
          <SimpleEnhancedLoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  );
};

export default SimplePhase3App;