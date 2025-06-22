import { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileHome = () => {
  const [newsItems] = useState([
    {
      id: 'news1',
      title: 'New Mobile Experience',
      content: 'We\'ve completely redesigned our app for a better mobile experience with an esoteric theme and improved accessibility!'
    },
    {
      id: 'news2',
      title: 'Tournament Season Begins',
      content: 'Join our weekly tournaments for a chance to win exclusive prizes and earn special rewards.'
    },
    {
      id: 'news3',
      title: 'New Card Set Released',
      content: 'Explore the latest expansion with powerful new cards and exciting mechanics.'
    },
    {
      id: 'news4',
      title: 'Community Event This Weekend',
      content: 'Join us for a special community event with prizes, tournaments, and more!'
    }
  ]);

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
    </div>
  );
};

export default MobileHome;