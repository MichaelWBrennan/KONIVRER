import React from 'react';

const DecksPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        paddingBottom: '120px',
        background:
          'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: '#d4af37',
            fontWeight: 'bold',
          }}
        >
          🎲 Deck Builder
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#ccc',
            lineHeight: '1.6',
            marginBottom: '40px',
          }}
        >
          Create and manage your ultimate KONIVRER decks.
        </p>
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid #d4af37',
            borderRadius: '12px',
            padding: '40px',
          }}
        >
          <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>
            Deck Builder Tools
          </h2>
          <p style={{ color: '#ccc' }}>
            Advanced deck building features are in development:
          </p>
          <ul style={{ color: '#ccc', textAlign: 'left', margin: '20px 0' }}>
            <li>Drag-and-drop deck construction</li>
            <li>Mana curve visualization</li>
            <li>Deck statistics and analytics</li>
            <li>Share and import community decks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DecksPage;
