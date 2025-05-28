//  // Not needed in React 19
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { validateEnv } from './config/env';
import CardDatabase from './pages/CardDatabase';
import DeckBuilder from './pages/DeckBuilder';
import Home from './pages/Home';
import MyDecks from './pages/MyDecks';
import './App.css';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deckbuilder" element={<DeckBuilder />} />
            <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
            <Route path="/cards" element={<CardDatabase />} />
            <Route path="/decks" element={<MyDecks />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
