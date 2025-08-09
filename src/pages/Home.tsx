import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>KONIVRER</h1>
          <p className="hero-subtitle">Advanced Trading Card Game Platform</p>
          <p className="hero-description">
            The ultimate platform for KONIVRER trading card game with advanced deck building, 
            live tournaments, social features, and AI-powered analytics.
          </p>
          
          <div className="hero-actions">
            <Link to="/deckbuilder-advanced" className="btn btn-primary">
              Start Building Decks
            </Link>
            <Link to="/tournaments" className="btn btn-secondary">
              Join Tournament
            </Link>
          </div>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🃏</div>
          <h3>Advanced Deck Builder</h3>
          <p>Create and optimize your decks with our intelligent deck building tools</p>
          <Link to="/deckbuilder-advanced" className="feature-link">Build Now →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Live Tournaments</h3>
          <p>Join live tournaments and compete with players worldwide</p>
          <Link to="/tournaments" className="feature-link">Compete →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Social Hub</h3>
          <p>Connect with other players, share decks, and join communities</p>
          <Link to="/social" className="feature-link">Connect →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Analytics</h3>
          <p>Track your performance with AI-powered analytics and insights</p>
          <Link to="/analytics" className="feature-link">View Stats →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎮</div>
          <h3>Card Simulator</h3>
          <p>Practice with our advanced card game simulator</p>
          <Link to="/simulator" className="feature-link">Play →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Assistant</h3>
          <p>Get personalized recommendations and strategic insights</p>
          <Link to="/analytics" className="feature-link">Learn →</Link>
        </div>
      </section>
    </div>
  );
};