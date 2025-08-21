import React from 'react';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="konivrer-chronicles-home">
        <div style={{ padding: '1rem', textAlign: 'right' }}>
          <a href="/automation-dashboard" style={{ color: '#0ea5e9' }}>Automation Dashboard</a>
        </div>
        <header className="chronicles-header p-4 md:p-6 lg:p-8 text-center">
          <h1 className="chronicles-title text-2xl md:text-4xl lg:text-5xl font-bold mb-4">KONIVRER Chronicles</h1>
          <p className="chronicles-subtitle text-base md:text-lg lg:text-xl mb-6">Enter the realm of legendary cards and epic battles</p>
          <div className="chronicles-divider"></div>
        </header>

        <main className="chronicles-content p-4 md:p-6 lg:p-8">
          <section className="latest-section mb-8">
            <h2 className="latest-title text-xl md:text-2xl font-semibold mb-4">Latest</h2>
            <p className="latest-description text-sm md:text-base mb-6">
              Stay updated with the newest cards, strategies, and tournaments in the KONIVRER universe.
              Master the art of deck building and claim your place among the legends.
            </p>
            
            <div className="featured-buttons flex flex-col md:flex-row gap-3 md:gap-4 mb-8">
              <button className="btn-touch btn-primary flex items-center justify-center">
                <span className="mr-2">⭐</span>
                Featured Posts
              </button>
              <button className="btn-touch btn-secondary flex items-center justify-center">
                <span className="mr-2">🕒</span>
                Recent Updates
              </button>
            </div>
          </section>

          <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">New Card Set Released</h3>
              <p className="text-sm text-secondary mb-4">
                The Shadows of Eternity expansion brings 150 new cards to the KONIVRER universe, 
                featuring powerful dark magic and ancient artifacts.
              </p>
              <div className="news-date text-xs">2 hours ago</div>
            </article>

            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">Tournament Results</h3>
              <p className="text-sm text-secondary mb-4">
                The Grand Championship concluded with an epic final battle between two master 
                strategists. Witness the winning deck composition and strategies.
              </p>
              <div className="news-date text-xs">1 day ago</div>
            </article>

            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">Deck Building Guide</h3>
              <p className="text-sm text-secondary mb-4">
                Master the art of synergy with our comprehensive guide to building tournament-winning 
                decks. Learn from the pros and develop your unique strategies.
              </p>
              <div className="news-date text-xs">3 days ago</div>
            </article>

            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">Balance Update</h3>
              <p className="text-sm text-secondary mb-4">
                Several cards have received adjustments to maintain competitive balance. 
                Review the changes and adapt your strategies accordingly.
              </p>
              <div className="news-date text-xs">1 week ago</div>
            </article>

            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">Community Spotlight</h3>
              <p className="text-sm text-secondary mb-4">
                Featured player interview: How a creative deck builder rose from novice to champion 
                using innovative card combinations and strategic thinking.
              </p>
              <div className="news-date text-xs">1 week ago</div>
            </article>

            <article className="news-card card-mobile interactive gpu-accelerated">
              <h3 className="text-lg font-semibold mb-3">Rules Update</h3>
              <p className="text-sm text-secondary mb-4">
                Important clarifications on card interactions and tournament regulations. 
                Stay informed to compete at the highest level.
              </p>
              <div className="news-date text-xs">2 weeks ago</div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};