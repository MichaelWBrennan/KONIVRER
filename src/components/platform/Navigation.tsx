import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>KONIVRER</h2>
        </Link>
      </div>

      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          🏠 Home
        </Link>
        
        <Link 
          to="/deckbuilder-advanced" 
          className={`nav-link ${isActive('/deckbuilder-advanced') ? 'active' : ''}`}
        >
          🃏 Deck Builder
        </Link>
        
        <Link 
          to="/tournaments" 
          className={`nav-link ${isActive('/tournaments') ? 'active' : ''}`}
        >
          🏆 Tournaments
        </Link>
        
        <Link 
          to="/social" 
          className={`nav-link ${isActive('/social') ? 'active' : ''}`}
        >
          👥 Social
        </Link>
        
        <Link 
          to="/analytics" 
          className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
        >
          📊 Analytics
        </Link>
        
        <Link 
          to="/simulator" 
          className={`nav-link ${isActive('/simulator') ? 'active' : ''}`}
        >
          🎮 Simulator
        </Link>
      </div>

      <div className="nav-user">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <div className="username">Player</div>
            <div className="user-level">Level 42</div>
          </div>
        </div>
        
        <div className="user-actions">
          <button className="btn btn-small">Settings</button>
        </div>
      </div>
    </nav>
  );
};