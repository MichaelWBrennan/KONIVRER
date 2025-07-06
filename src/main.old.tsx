/**
 * KONIVRER Deck Database - Main Entry Point
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

/**
 * KONIVRER Deck Database - Main Entry Point
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/main.css';
import './styles/unified.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onUpdate: registration => {
    // When a new version is available, show update notification
    const updateAvailable = window.confirm(
      'A new version of KONIVRER is available. Load the latest version?'
    );
    
    if (updateAvailable) {
      // Send message to service worker to skip waiting
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Reload the page to get the new version
      window.location.reload();
    }
  },
  onSuccess: registration => {
    console.log('KONIVRER is now available offline!');
  }
});
