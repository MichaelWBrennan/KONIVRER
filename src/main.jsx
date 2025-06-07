import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './App.css';
import './utils/performance';

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.warn('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
