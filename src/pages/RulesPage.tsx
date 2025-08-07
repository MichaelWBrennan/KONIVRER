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

      <div
        style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #d4af37',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'left',
          maxWidth: '800px',
          margin: '40px auto',
        }}
        data-rule-content="basic-concepts"
      >
        <h2
          style={{
            color: '#d4af37',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Basic Game Concepts
        </h2>
        <div style={{ color: '#ccc', lineHeight: '1.6' }}>
          <h3 style={{ color: '#d4af37', marginTop: '20px' }}>
            Familiars & Flags
          </h3>
          <p>
            KONIVRER features two main card types: <strong>Familiars</strong>{' '}
            (creature cards) and <strong>Flags</strong> (spell cards). Each
            serves a unique purpose in battle.
          </p>

          <h3 style={{ color: '#d4af37', marginTop: '20px' }}>Elements</h3>
          <p>
            Cards are aligned with mystical elements that determine their
            strengths, weaknesses, and synergies with other cards.
          </p>

          <h3 style={{ color: '#d4af37', marginTop: '20px' }}>Cost & Rarity</h3>
          <p>
            Each card has a mana cost and rarity level. Higher rarity cards
            offer more powerful effects but require strategic resource
            management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
