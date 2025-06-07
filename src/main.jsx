import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Ultra-minimal test component
function NuclearTest() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      background: '#111', 
      color: '#0f0',
      minHeight: '100vh',
      border: '10px solid red'
    }}>
      <h1>🚀 NUCLEAR SUCCESS!</h1>
      <h2>Loading screen is GONE!</h2>
      <p>This proves the app can load without infinite spinner.</p>
      <button 
        onClick={() => alert('🎉 VICTORY!')}
        style={{ 
          padding: '10px 20px', 
          fontSize: '18px', 
          background: '#0f0', 
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        🎯 CLICK ME - APP WORKS!
      </button>
    </div>
  );
}

// Create root and render
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <NuclearTest />
  </StrictMode>
);

console.log('🚀 NUCLEAR TEST: Ultra-minimal app loaded successfully!');