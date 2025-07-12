import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#d4af37' }}>⭐ KONIVRER Test App ⭐</h1>
      <p>If you can see this, the React app is loading correctly!</p>
      <button 
        style={{
          padding: '10px 20px',
          backgroundColor: '#d4af37',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp;