import React from 'react';
import BlogSection from '../components/BlogSection';

const BlogPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: '120px', // Space for bottom navigation
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          color: '#d4af37',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
        }}>
          KONIVRER Chronicles
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#ccc',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Discover the mystical world of KONIVRER through our latest news, 
          strategy guides, and community insights.
        </p>
      </div>
      
      {/* Blog Content */}
      <BlogSection />
    </div>
  );
};

export default BlogPage;