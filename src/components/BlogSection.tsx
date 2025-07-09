/**
 * KONIVRER Blog Section Component
 * Displays latest blog posts on the main page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentPosts, getFeaturedPosts, BlogPost } from '../data/blogPosts';

const BlogSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'featured'>('featured');
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(3);
  
  const displayPosts = activeTab === 'featured' ? featuredPosts : recentPosts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': '#d4af37',
      'Game Mechanics': '#4a90e2',
      'Events': '#e74c3c',
      'Strategy': '#27ae60',
      'Community': '#9b59b6'
    };
    return colors[category] || '#d4af37';
  };

  return (
    <section style={{ 
      padding: '60px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '36px', 
          marginBottom: '15px', 
          color: '#d4af37',
          fontWeight: 'bold'
        }}>
          Latest from the Mystical Realm
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#ccc', 
          maxWidth: '600px', 
          margin: '0 auto' 
        }}>
          Stay updated with the latest news, strategies, and insights from the world of KONIVRER
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '40px',
        gap: '20px'
      }}>
        <button
          onClick={() => setActiveTab('featured')}
          style={{
            background: activeTab === 'featured' ? '#d4af37' : 'transparent',
            color: activeTab === 'featured' ? '#0f0f0f' : '#d4af37',
            border: '2px solid #d4af37',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
        >
          Featured Posts
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          style={{
            background: activeTab === 'recent' ? '#d4af37' : 'transparent',
            color: activeTab === 'recent' ? '#0f0f0f' : '#d4af37',
            border: '2px solid #d4af37',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
        >
          Recent Posts
        </button>
      </div>

      {/* Blog Posts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        {displayPosts.map((post: BlogPost) => (
          <article
            key={post.id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              padding: '25px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Category Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: getCategoryColor(post.category),
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {post.category}
            </div>

            {/* Post Content */}
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ 
                color: '#d4af37', 
                marginBottom: '12px', 
                fontSize: '20px',
                fontWeight: 'bold',
                lineHeight: '1.3'
              }}>
                {post.title}
              </h3>
              
              <p style={{ 
                color: '#ccc', 
                marginBottom: '15px',
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {post.excerpt}
              </p>

              {/* Post Meta */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px',
                fontSize: '12px',
                color: '#888'
              }}>
                <span>By {post.author}</span>
                <span>{formatDate(post.date)}</span>
              </div>

              {/* Tags */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                marginBottom: '15px'
              }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(212, 175, 55, 0.2)',
                      color: '#d4af37',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '11px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Read More Link */}
              <Link
                to={`/blog/${post.id}`}
                style={{
                  color: '#d4af37',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* View All Posts Link */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#d4af37',
            border: '2px solid #d4af37',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d4af37';
            e.currentTarget.style.color = '#0f0f0f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#d4af37';
          }}
        >
          View All Posts
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;