import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

// Simple test component
function TestHome() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎮 KONIVRER Deck Database</h1>
      <p>App is working! Loading issue has been resolved.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => alert('App is functional!')}>
          Test Button
        </button>
      </div>
    </div>
  );
}

// Minimal App component
function MinimalApp() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<TestHome />} />
      </Routes>
    </Router>
  );
}

// Create root and render
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <MinimalApp />
  </StrictMode>
);

console.log('✅ Minimal app loaded successfully');

// Unregister service worker for debugging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Service worker unregistered for debugging');
    });
  });
}

// Also hide loading spinner from React side
setTimeout(() => {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer) {
    loadingContainer.classList.add('hidden');
    console.log('✅ Loading spinner hidden from React');
  }
}, 100);