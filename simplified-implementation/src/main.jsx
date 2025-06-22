import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PhysicalMatchmakingProvider } from './contexts/PhysicalMatchmakingContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PhysicalMatchmakingProvider>
      <App />
    </PhysicalMatchmakingProvider>
  </React.StrictMode>
);