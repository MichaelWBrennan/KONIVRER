import React from 'react';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="konivrer-chronicles-home">
      <header className="chronicles-header">
        <h1 className="chronicles-title">KONIVRER Chronicles</h1>
        <p className="chronicles-subtitle">Enter the realm of legendary cards and epic battles</p>
        <div className="chronicles-divider"></div>
      </header>

      <main className="chronicles-content">
        <section className="latest-section">
          <h2 className="latest-title">Latest</h2>
          <p className="latest-description">
            Stay updated with the newest cards, strategies, and tournaments in the KONIVRER universe.
            Master the art of deck building and claim your place among the legends.
          </p>
          
          <div className="featured-buttons">
            <button className="featured-btn">
              ⭐ Featured Posts
            </button>
            <button className="recent-btn">
              🕒 Recent Updates
            </button>
          </div>
        </section>

        <div className="news-grid">
          <article className="news-card">
            <h3>New Card Set Released</h3>
            <p>
              The Shadows of Eternity expansion brings 150 new cards to the KONIVRER universe, 
              featuring powerful dark magic and ancient artifacts.
            </p>
            <div className="news-date">2 hours ago</div>
          </article>

          <article className="news-card">
            <h3>Tournament Results</h3>
            <p>
              The Grand Championship concluded with an epic final battle between two master 
              strategists. Witness the winning deck composition and strategies.
            </p>
            <div className="news-date">1 day ago</div>
          </article>

          <article className="news-card">
            <h3>Deck Building Guide</h3>
            <p>
              Master the art of synergy with our comprehensive guide to building tournament-winning 
              decks. Learn from the pros and develop your unique strategies.
            </p>
            <div className="news-date">3 days ago</div>
          </article>

          <article className="news-card">
            <h3>Balance Update</h3>
            <p>
              Several cards have received adjustments to maintain competitive balance. 
              Review the changes and adapt your strategies accordingly.
            </p>
            <div className="news-date">1 week ago</div>
          </article>

          <article className="news-card">
            <h3>Community Spotlight</h3>
            <p>
              Featured player interview: How a creative deck builder rose from novice to champion 
              using innovative card combinations and strategic thinking.
            </p>
            <div className="news-date">1 week ago</div>
          </article>

          <article className="news-card">
            <h3>Rules Update</h3>
            <p>
              Important clarifications on card interactions and tournament regulations. 
              Stay informed to compete at the highest level.
            </p>
            <div className="news-date">2 weeks ago</div>
          </article>
        </div>
      </main>
    </div>
  );
};