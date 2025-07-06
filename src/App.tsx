/**
 * KONIVRER Deck Database - Main Application Component
 * 
 * This is the root component of the application, providing routing,
 * state management, and global providers.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Import core components
import { ErrorBoundary } from './components/ErrorBoundary';
import { UnifiedLayout } from './components/UnifiedLayout';

// Import global styles
import './App.css';

// Create a query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Home Page Component
 */
const HomePage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="home">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Welcome to KONIVRER
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          The ultimate deck building and strategy card game experience
        </p>
      </div>
    </div>
  </UnifiedLayout>
);

/**
 * Cards Page Component
 */
const CardsPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="cards">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Cards Database
      </h1>
      <p className="text-gray-300 mb-8">
        Browse and search through the KONIVRER card collection.
      </p>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Card database functionality coming soon...</p>
      </div>
    </div>
  </UnifiedLayout>
);

/**
 * Decks Page Component
 */
const DecksPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="decks">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Deck Builder
      </h1>
      <p className="text-gray-300 mb-8">
        Build and customize your perfect deck.
      </p>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Deck builder functionality coming soon...</p>
      </div>
    </div>
  </UnifiedLayout>
);

/**
 * Tournaments Page Component
 */
const TournamentsPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="tournaments">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Tournaments
      </h1>
      <p className="text-gray-300 mb-8">
        Join competitive tournaments and climb the rankings.
      </p>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Tournament functionality coming soon...</p>
      </div>
    </div>
  </UnifiedLayout>
);

/**
 * Play Page Component
 */
const PlayPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="play">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Play Game
      </h1>
      <p className="text-gray-300 mb-8">
        Start a match and test your skills.
      </p>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Game functionality coming soon...</p>
      </div>
    </div>
  </UnifiedLayout>
);

/**
 * Not Found Page Component
 */
const NotFoundPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="home">
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-yellow-500">404</h1>
      <p className="text-xl text-gray-300 mb-8">Page not found</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
      >
        Go Home
      </a>
    </div>
  </UnifiedLayout>
);

/**
 * Main Application Component
 * 
 * Provides the core application structure with routing, global state,
 * and error handling.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/decks" element={<DecksPage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;