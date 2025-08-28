import React from 'react';
import * as h from './home.css.ts';

export const Home: React.FC    : any = () => {
  return (
    <div className={h.container}>
      <div className={h.homeRoot}>
        <header className={h.header}>
          <div className={h.hero}>
            <div>
              <h1 className={h.title}>KONIVRER Chronicles</h1>
              <p className={h.subtitle}>Latest card tech, meta analysis, and tournament updates</p>
            </div>
          </div>
          <div className={h.divider}></div>
        </header>

        <main className={h.content}>
          <section className={h.latestSection}>
            <h2 className={h.latestTitle}>Featured</h2>
            <div className={h.newsGrid}>
              <article className={h.newsCard} style={{ gridColumn: 'span 2' }}>
                <h3 className="text-lg font-semibold mb-3">Inside the Meta: Control vs. Aggro</h3>
                <p className="text-sm text-secondary mb-4">We break down the latest results and what they mean for your next event. Sideboard strategies and mulligan heuristics included.</p>
                <div className={h.newsDate}>Today</div>
              </article>
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