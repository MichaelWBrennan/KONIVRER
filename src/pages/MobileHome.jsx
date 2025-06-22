import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';

const MobileHome = () => {
  const { isAuthenticated, user } = useAuth();
  const { recentDecks } = useDeck();
  const [featuredCards, setFeaturedCards] = useState([]);
  const [latestTournaments, setLatestTournaments] = useState([]);

  // Fetch featured cards
  useEffect(() => {
    // Simulated data - would be replaced with actual API calls
    setFeaturedCards([
      { id: 'card1', name: 'Dragon Lord', imageUrl: '/assets/cards/dragon-lord.jpg' },
      { id: 'card2', name: 'Mystic Sage', imageUrl: '/assets/cards/mystic-sage.jpg' },
      { id: 'card3', name: 'Shadow Assassin', imageUrl: '/assets/cards/shadow-assassin.jpg' },
      { id: 'card4', name: 'Celestial Guardian', imageUrl: '/assets/cards/celestial-guardian.jpg' }
    ]);

    setLatestTournaments([
      { id: 'tourn1', name: 'Weekly Championship', date: '2025-06-25', players: 32 },
      { id: 'tourn2', name: 'Beginner Friendly', date: '2025-06-27', players: 16 }
    ]);
  }, []);

  return (
    <div className="mobile-home">
      {/* Welcome Section */}
      <section className="mobile-p mobile-text-center mobile-mb esoteric-scroll">
        <div className="esoteric-divider">
          <span className="esoteric-divider-symbol">✧</span>
        </div>
        <h1 className="mobile-header-title mobile-mb esoteric-glow-pulse">
          KONIVRER
        </h1>
        <p className="esoteric-rune">
          Trading Card Game
        </p>
        <div className="esoteric-divider">
          <span className="esoteric-divider-symbol">✧</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mobile-card mobile-mb esoteric-card">
        <div className="esoteric-divider">
          <span className="esoteric-divider-symbol">⦿</span>
        </div>
        <div className="mobile-grid">
          <Link to="/game/online" className="mobile-btn mobile-btn-primary mobile-p esoteric-btn esoteric-btn-primary">
            Play Now
          </Link>
          <Link to="/deck-builder" className="mobile-btn mobile-p esoteric-btn">
            Build Deck
          </Link>
          <Link to="/cards" className="mobile-btn mobile-p esoteric-btn">
            Browse Cards
          </Link>
          <Link to="/matchmaking" className="mobile-btn mobile-p esoteric-btn">
            Find Match
          </Link>
        </div>
      </section>

      {/* Featured Cards */}
      <section className="mobile-mb">
        <h2 className="mobile-card-title esoteric-rune">Featured Cards</h2>
        <div className="mobile-card esoteric-card">
          <div className="mobile-grid">
            {featuredCards.map(card => (
              <Link to={`/card/${card.id}`} key={card.id} className="mobile-game-card esoteric-float">
                <img 
                  src={card.imageUrl} 
                  alt={card.name} 
                  className="mobile-game-card-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/card-back.jpg';
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Decks (for logged in users) */}
      {isAuthenticated && recentDecks && recentDecks.length > 0 && (
        <section className="mobile-mb">
          <h2 className="mobile-card-title esoteric-rune">Your Recent Decks</h2>
          <div className="mobile-card esoteric-card">
            <ul className="mobile-list">
              {recentDecks.slice(0, 3).map(deck => (
                <li key={deck.id} className="mobile-list-item">
                  <Link to={`/deck-builder/${deck.id}`} className="esoteric-text-accent">
                    {deck.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/decks" className="mobile-btn mobile-btn-block mobile-mt esoteric-btn esoteric-btn-outline">
              View All Decks
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming Tournaments */}
      <section className="mobile-mb">
        <h2 className="mobile-card-title esoteric-rune">Upcoming Tournaments</h2>
        <div className="mobile-card esoteric-card">
          <ul className="mobile-list">
            {latestTournaments.map(tournament => (
              <li key={tournament.id} className="mobile-list-item">
                <div>
                  <strong className="esoteric-text-accent">{tournament.name}</strong>
                  <div>
                    Date: {new Date(tournament.date).toLocaleDateString()}
                  </div>
                  <div>
                    Players: {tournament.players}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/tournaments" className="mobile-btn mobile-btn-block mobile-mt esoteric-btn esoteric-btn-outline">
            View All Tournaments
          </Link>
        </div>
      </section>

      {/* News & Updates */}
      <section className="mobile-mb">
        <h2 className="mobile-card-title esoteric-rune">Latest News</h2>
        <div className="mobile-card esoteric-card">
          <div className="mobile-card-content">
            <h3 className="esoteric-text-accent">New Mobile Experience</h3>
            <p>We've completely redesigned our app for a better mobile experience!</p>
          </div>
          <div className="esoteric-divider">
            <span className="esoteric-divider-symbol">✦</span>
          </div>
          <div className="mobile-card-content">
            <h3 className="esoteric-text-accent">Tournament Season Begins</h3>
            <p>Join our weekly tournaments for a chance to win exclusive prizes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileHome;