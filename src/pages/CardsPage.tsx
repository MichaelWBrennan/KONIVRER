import React from 'react';

const CardsPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: '120px',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          color: '#d4af37',
          fontWeight: 'bold',
        }}>
          🗃️ Card Database
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#ccc',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          Browse and search through our extensive collection of mystical cards.
        </p>
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #d4af37',
          borderRadius: '12px',
          padding: '40px',
        }}>
          <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Coming Soon!</h2>
          <p style={{ color: '#ccc' }}>
            The card database is currently being developed. Soon you'll be able to:
          </p>
          <ul style={{ color: '#ccc', textAlign: 'left', margin: '20px 0' }}>
            <li>Search cards by name, type, and element</li>
            <li>View detailed card information and artwork</li>
            <li>Filter by rarity and cost</li>
            <li>Add cards to your collection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;