import React from 'react';
import BottomMenuBar from '../components/BottomMenuBar';

/**
 * Demo page showing the BottomMenuBar component in action
 * This demonstrates how to integrate the component into any app
 */
const BottomMenuBarDemo: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        paddingBottom: '80px', // Make room for the bottom menu bar
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '40px' }}>
          BottomMenuBar Component Demo
        </h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '15px' }}>Features:</h2>
          <ul style={{ lineHeight: '1.6', color: '#ccc' }}>
            <li>✨ Smooth animations with Framer Motion</li>
            <li>📱 Responsive design for all screen sizes</li>
            <li>♿ Accessible with proper ARIA labels and keyboard navigation</li>
            <li>🎨 Consistent styling with KONIVRER theme (#d4af37)</li>
            <li>🔗 Integration with React Router for navigation</li>
            <li>⚡ Hover effects and visual feedback</li>
            <li>📐 Fixed positioning at bottom with safe area support</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '15px' }}>Usage:</h2>
          <pre
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              padding: '20px',
              color: '#ccc',
              fontSize: '14px',
              overflowX: 'auto',
            }}
          >
{`import BottomMenuBar from './components/BottomMenuBar';

// In your app component:
<div>
  {/* Your app content */}
  <BottomMenuBar />
</div>`}
          </pre>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '15px' }}>Integration:</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>
            The BottomMenuBar component is designed to be easily integrated into any of the KONIVRER app phases:
            Phase1App, Phase2App, or Phase3App. It provides consistent navigation across the application
            with items for Home, Cards, Game, Deck, and Profile.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Scroll down to see the BottomMenuBar component at the bottom of the screen
          </p>
        </div>

        {/* Add some content to make the page scrollable */}
        <div style={{ height: '200vh', background: 'rgba(212, 175, 55, 0.05)', marginTop: '50px', borderRadius: '8px', padding: '20px' }}>
          <p style={{ color: '#ccc', textAlign: 'center', paddingTop: '50px' }}>
            This is additional content to demonstrate scrolling behavior.
            The BottomMenuBar remains fixed at the bottom of the viewport.
          </p>
        </div>
      </div>

      {/* The BottomMenuBar component - positioned fixed at bottom */}
      <BottomMenuBar />
    </div>
  );
};

export default BottomMenuBarDemo;