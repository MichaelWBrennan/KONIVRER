import React from 'react';

const SimulatorPage: React.FC = () => {
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
          ▶️ Game Simulator
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#ccc',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          Practice your skills against AI opponents and test your decks.
        </p>
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #d4af37',
          borderRadius: '12px',
          padding: '40px',
        }}>
          <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Battle Arena</h2>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>
            The game simulator will feature:
          </p>
          <ul style={{ color: '#ccc', textAlign: 'left', margin: '20px 0' }}>
            <li>AI opponents with varying difficulty levels</li>
            <li>Real-time battle animations</li>
            <li>Turn-based strategy gameplay</li>
            <li>Practice mode for testing deck combinations</li>
            <li>Tournament brackets and challenges</li>
          </ul>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '30px'
          }}>
            <p style={{ color: '#d4af37', fontWeight: 'bold', margin: 0 }}>
              🚧 Currently in development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;