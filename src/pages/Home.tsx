import React from 'react';
import * as h from './home.css.ts';

export const Home: React.FC = () => {
  return (
    <div className={h.container}>
      <div className={h.homeRoot}>
        <div className={h.linkBar}>
          <a href="/automation-dashboard" className={h.link}>Automation Dashboard</a>
        </div>
        <header className={h.header}>
          <h1 className={h.title}>KONIVRER Chronicles</h1>
          <p className={h.subtitle}>Enter the realm of legendary cards and epic battles</p>
          <div className={h.divider}></div>
        </header>

        <main className={h.content}>
          <section className={h.latestSection}>
            <h2 className={h.latestTitle}>Latest</h2>
            <p className={h.latestDescription}>
              Stay updated with the newest cards, strategies, and tournaments in the KONIVRER universe.
              Master the art of deck building and claim your place among the legends.
            </p>
            
            <div className={h.featuredButtons}>
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

          <div className={h.newsGrid}>
            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">New Card Set Released</h3>
              <p className="text-sm text-secondary mb-4">
                The Shadows of Eternity expansion brings 150 new cards to the KONIVRER universe, 
                featuring powerful dark magic and ancient artifacts.
              </p>
              <div className={h.newsDate}>2 hours ago</div>
            </article>

            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">Tournament Results</h3>
              <p className="text-sm text-secondary mb-4">
                The Grand Championship concluded with an epic final battle between two master 
                strategists. Witness the winning deck composition and strategies.
              </p>
              <div className={h.newsDate}>1 day ago</div>
            </article>

            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">Deck Building Guide</h3>
              <p className="text-sm text-secondary mb-4">
                Master the art of synergy with our comprehensive guide to building tournament-winning 
                decks. Learn from the pros and develop your unique strategies.
              </p>
              <div className={h.newsDate}>3 days ago</div>
            </article>

            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">Balance Update</h3>
              <p className="text-sm text-secondary mb-4">
                Several cards have received adjustments to maintain competitive balance. 
                Review the changes and adapt your strategies accordingly.
              </p>
              <div className={h.newsDate}>1 week ago</div>
            </article>

            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">Community Spotlight</h3>
              <p className="text-sm text-secondary mb-4">
                Featured player interview: How a creative deck builder rose from novice to champion 
                using innovative card combinations and strategic thinking.
              </p>
              <div className={h.newsDate}>1 week ago</div>
            </article>

            <article className={h.newsCard}>
              <h3 className="text-lg font-semibold mb-3">Rules Update</h3>
              <p className="text-sm text-secondary mb-4">
                Important clarifications on card interactions and tournament regulations. 
                Stay informed to compete at the highest level.
              </p>
              <div className={h.newsDate}>2 weeks ago</div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};