import React from 'react';
import RulesViewer from '../components/RulesViewer';

const RulesPage: React.FC = () => {
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
          📖 Game Rules
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#ccc',
            lineHeight: '1.6',
            marginBottom: '40px',
          }}
        >
          Master the mystical arts with our comprehensive rule guide.
        </p>
      </div>

      {/* Rules Viewer Component */}
      <RulesViewer />
    </div>
  );
};

export default RulesPage;
