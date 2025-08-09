import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
}

const sampleBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "KONIVRER Championship 2025: Rules and Tournament Structure",
    excerpt: "Get ready for the biggest KONIVRER tournament of the year! Learn about the new championship format, prizes, and how to qualify.",
    date: "2025-01-15",
    author: "Tournament Director",
    tags: ["tournament", "championship", "rules"],
    slug: "konivrer-championship-2025"
  },
  {
    id: 2,
    title: "New Card Set: Azoth Rising - Complete Spoiler Review",
    excerpt: "Dive deep into the latest card set with our comprehensive review of all new cards, mechanics, and their impact on the meta.",
    date: "2025-01-12",
    author: "Card Analyst",
    tags: ["cards", "spoiler", "review", "meta"],
    slug: "azoth-rising-spoiler-review"
  },
  {
    id: 3,
    title: "Deck Building Guide: Mastering the Control Archetype",
    excerpt: "Learn advanced control strategies, card selection principles, and how to pilot control decks to victory in competitive play.",
    date: "2025-01-10",
    author: "Pro Player",
    tags: ["deckbuilding", "strategy", "control"],
    slug: "control-archetype-guide"
  },
  {
    id: 4,
    title: "Community Spotlight: Local Game Store Tournaments",
    excerpt: "Highlighting the best local tournaments and game stores supporting the KONIVRER community worldwide.",
    date: "2025-01-08",
    author: "Community Manager",
    tags: ["community", "lgs", "tournaments"],
    slug: "lgs-tournaments-spotlight"
  },
  {
    id: 5,
    title: "Card Interaction Rules Update: Clarifications and Examples",
    excerpt: "Important rule clarifications for complex card interactions, with detailed examples and tournament rulings.",
    date: "2025-01-05",
    author: "Rules Committee",
    tags: ["rules", "interactions", "clarifications"],
    slug: "rules-update-interactions"
  }
];

export const Blog: React.FC = () => {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <div className="blog-header-content">
          <h1>KONIVRER Blog</h1>
          <p className="blog-subtitle">Latest news, strategies, and community updates</p>
        </div>
      </header>

      <div className="blog-content">
        <div className="blog-posts">
          {sampleBlogPosts.map(post => (
            <article key={post.id} className="blog-post-card">
              <div className="blog-post-meta">
                <span className="blog-post-date">{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span className="blog-post-author">by {post.author}</span>
              </div>
              
              <h2 className="blog-post-title">
                <Link to={`/blog/${post.slug}`} className="blog-post-link">
                  {post.title}
                </Link>
              </h2>
              
              <p className="blog-post-excerpt">{post.excerpt}</p>
              
              <div className="blog-post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="blog-post-tag">#{tag}</span>
                ))}
              </div>
              
              <div className="blog-post-actions">
                <Link to={`/blog/${post.slug}`} className="read-more-link">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="blog-sidebar">
          <div className="blog-widget">
            <h3>Categories</h3>
            <ul className="blog-categories">
              <li><Link to="/blog/category/tournament">Tournament (12)</Link></li>
              <li><Link to="/blog/category/strategy">Strategy (8)</Link></li>
              <li><Link to="/blog/category/cards">Card Reviews (15)</Link></li>
              <li><Link to="/blog/category/community">Community (6)</Link></li>
              <li><Link to="/blog/category/rules">Rules (4)</Link></li>
            </ul>
          </div>
          
          <div className="blog-widget">
            <h3>Recent Updates</h3>
            <ul className="blog-recent">
              <li><Link to="/deckbuilder">🃏 New Deck Builder Features</Link></li>
              <li><Link to="/tournaments">🏆 Weekly Tournament Schedule</Link></li>
              <li><Link to="/social">👥 Community Discord Server</Link></li>
              <li><Link to="/analytics">📊 Advanced Analytics Dashboard</Link></li>
            </ul>
          </div>
          
          <div className="blog-widget">
            <h3>Quick Navigation</h3>
            <div className="blog-nav-buttons">
              <Link to="/" className="nav-button">🎮 Card Simulator</Link>
              <Link to="/deckbuilder" className="nav-button">🃏 Deck Builder</Link>
              <Link to="/tournaments" className="nav-button">🏆 Tournaments</Link>
              <Link to="/social" className="nav-button">👥 Social Hub</Link>
              <Link to="/analytics" className="nav-button">📊 Analytics</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};