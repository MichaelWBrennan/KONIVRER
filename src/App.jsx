import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { validateEnv } from './config/env';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const CardDatabase = lazy(() => import('./pages/CardDatabase'));
const DeckBuilder = lazy(() => import('./pages/DeckBuilder'));
const MyDecks = lazy(() => import('./pages/MyDecks'));

// Validate environment variables on app start
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/deckbuilder' element={<DeckBuilder />} />
              <Route path='/deckbuilder/:deckId' element={<DeckBuilder />} />
              <Route path='/cards' element={<CardDatabase />} />
              <Route path='/decks' element={<MyDecks />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
