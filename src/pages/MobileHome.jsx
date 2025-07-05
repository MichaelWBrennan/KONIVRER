/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileHome = () => {
  const [newsItems] = useState([
    {
      id: 'news1',
      title: 'New Mobile Experience',
      content:
        "We've completely redesigned our app for a better mobile experience with an esoteric theme and improved accessibility!",
    },
    {
      id: 'news2',
      title: 'Tournament Season Begins',
      content:
        'Join our weekly tournaments for a chance to win exclusive prizes and earn special rewards.',
    },
    {
      id: 'news3',
      title: 'New Card Set Released',
      content:
        'Explore the latest expansion with powerful new cards and exciting mechanics.',
    },
    {
      id: 'news4',
      title: 'Community Event This Weekend',
      content:
        'Join us for a special community event with prizes, tournaments, and more!',
    },
  ]);

  return (
    <div className="mobile-home">
      {/* Welcome Section */}
      <section className="mobile-p mobile-text-center mobile-mb esoteric-scroll">
        <div className="esoteric-divider">
          <span className="esoteric-divider-symbol">✧</span>
        </div>

        <p className="esoteric-rune">Trading Card Game</p>
        <div className="esoteric-divider">
          <span className="esoteric-divider-symbol">✧</span>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mobile-mb">
        <h2 className="mobile-card-title esoteric-rune">Experience KONIVRER</h2>
        
        {/* Main Game Demo */}
        <div className="mobile-card esoteric-card mobile-mb">
          <div className="mobile-card-content mobile-text-center">
            <h3 className="esoteric-text-accent mobile-mb">Enhanced Game Implementation</h3>
            <p className="mobile-mb">
              Experience the complete KONIVRER trading card game with all zones, mechanics, and enhanced card display.
            </p>
            <Link 
              to="/konivrer-demo" 
              className="mobile-button mobile-button-primary esoteric-glow-hover"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              ✧ Play KONIVRER Demo ✧
            </Link>
          </div>
        </div>

        {/* AI Testing Mode */}
        <div className="mobile-card esoteric-card mobile-mb">
          <div className="mobile-card-content mobile-text-center">
            <h3 className="esoteric-text-accent mobile-mb">🧠 AI Consciousness Testing</h3>
            <p className="mobile-mb">
              Test the cutting-edge AI system with 100% consciousness metrics, life card mortality awareness, and quantum decision making.
            </p>
            <div className="ai-features-list mobile-mb">
              <div className="ai-feature">💯 100% Consciousness Level</div>
              <div className="ai-feature">💀 Life Card Mortality Awareness</div>
              <div className="ai-feature">⚛️ Quantum Decision Engine</div>
              <div className="ai-feature">👁️ Theory of Mind Analysis</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/ai-consciousness-demo" 
                className="mobile-button esoteric-glow-hover"
                style={{
                  display: 'inline-block',
                  padding: '12px 20px',
                  backgroundColor: '#8a2be2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  border: '2px solid #00d4ff',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                  fontSize: '14px'
                }}
              >
                🧠 View AI Demo 🧠
              </Link>
              <Link 
                to="/game/ai-testing" 
                className="mobile-button esoteric-glow-hover"
                style={{
                  display: 'inline-block',
                  padding: '12px 20px',
                  backgroundColor: '#8a2be2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  border: '2px solid #00d4ff',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                  fontSize: '14px'
                }}
              >
                🚀 Play vs AI 🚀
              </Link>
            </div>
          </div>
        </div>

        {/* Player vs Player */}
        <div className="mobile-card esoteric-card">
          <div className="mobile-card-content mobile-text-center">
            <h3 className="esoteric-text-accent mobile-mb">⚔️ Player vs Player</h3>
            <p className="mobile-mb">
              Challenge other players in classic KONIVRER matches with full game mechanics and competitive play.
            </p>
            <Link 
              to="/game/pvp" 
              className="mobile-button esoteric-glow-hover"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#ff6b35',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              ⚔️ Challenge Players ⚔️
            </Link>
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="mobile-mb">
        <h2 className="mobile-card-title esoteric-rune">Latest News</h2>
        <div className="mobile-card esoteric-card">
          {newsItems.map((item, index) => (
            <div key={item.id}>
              <div className="mobile-card-content">
                <h3 className="esoteric-text-accent">{item.title}</h3>
                <p>{item.content}</p>
              </div>
              {index < newsItems.length - 1 && (
                <div className="esoteric-divider">
                  <span className="esoteric-divider-symbol">✦</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .ai-features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 15px 0;
        }
        
        .ai-feature {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 6px;
          padding: 8px;
          font-size: 12px;
          text-align: center;
          color: #00d4ff;
          font-weight: 600;
        }
        
        @media (max-width: 480px) {
          .ai-features-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileHome;
