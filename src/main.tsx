import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './mobile-first.css';

// Initialize mobile UX optimization services
import './services/telemetry';
import './services/ab-testing';

// Set CSS custom properties for mobile viewport handling
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Initial call
setViewportHeight();

// Re-calculate on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100);
});

// Service worker registration for PWA features
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}

// Mark user as returning visitor for A/B testing
localStorage.setItem('konivrer-returning-user', 'true');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);