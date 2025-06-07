import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import WebVitals from './components/WebVitals';
import { env } from './config/env';

// Lazy load pages with prefetch hints
const Home = lazy(
  () => import(/* webpackChunkName: "page-home" */ './pages/Home'),
);
const CardDatabase = lazy(
  () => import(/* webpackChunkName: "page-cards" */ './pages/CardDatabase'),
);
const DeckBuilder = lazy(
  () =>
    import(/* webpackChunkName: "page-deckbuilder" */ './pages/DeckBuilder'),
);
const MyDecks = lazy(
  () => import(/* webpackChunkName: "page-decks" */ './pages/MyDecks'),
);

// Validate environment variables only in development
if (import.meta.env.DEV) {
  import('./config/env').then(({ validateEnv }) => {
    try {
      validateEnv();
    } catch (error) {
      console.error('Environment validation failed:', error);
    }
  });
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/deckbuilder" element={<DeckBuilder />} />
              <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
              <Route path="/cards" element={<CardDatabase />} />
              <Route path="/decks" element={<MyDecks />} />
            </Routes>
          </Suspense>
        </Layout>
        
        {/* Analytics and Performance Monitoring */}
        <WebVitals />
        {(env.ENABLE_ANALYTICS || import.meta.env.PROD) && (
          <>
            <Analytics 
              mode={import.meta.env.DEV ? 'development' : 'production'}
              debug={env.ENABLE_DEBUG}
            />
            <SpeedInsights 
              debug={env.ENABLE_DEBUG}
              sampleRate={import.meta.env.DEV ? 1 : 0.1}
            />
          </>
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
