import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PhysicalMatchmakingProvider } from './contexts/PhysicalMatchmakingContext';
import './index.css';

/**
 * Performance monitoring
 */
const reportWebVitals = (metric) => {
  // Analytics reporting would go here
  if (process.env.NODE_ENV !== 'production') {
    console.log(metric);
  }
};

/**
 * Critical error handler
 */
const handleCriticalError = (error) => {
  console.error('Critical application error:', error);
  
  // Render fallback UI
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'var(--font-family-base, Arial, sans-serif)',
        color: '#ff3333',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1>Something went wrong</h1>
        <p>The application encountered a critical error. Please refresh the page or contact support.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            background: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }
};

// Set up global error handlers
window.addEventListener('error', (event) => {
  handleCriticalError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  handleCriticalError(event.reason);
});

// Create root once
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render app with error handling
try {
  root.render(
    <React.StrictMode>
      <PhysicalMatchmakingProvider>
        <App />
      </PhysicalMatchmakingProvider>
    </React.StrictMode>
  );
  
  // Report web vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }).catch(err => {
    console.warn('Web Vitals not loaded:', err);
  });
} catch (error) {
  handleCriticalError(error);
}