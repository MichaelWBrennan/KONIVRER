import React from 'react';

const BasicTest: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      color: 'black', 
      padding: '20px',
      minHeight: '100vh',
      fontSize: '18px'
    }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>BASIC TEST PAGE</h1>
      <p>This is a basic test to see if React rendering works at all.</p>
      <p>If you can see this text, React is working.</p>
      <button style={{ 
        backgroundColor: 'blue', 
        color: 'white', 
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px'
      }}>
        Test Button
      </button>
    </div>
  );
};

export default BasicTest;