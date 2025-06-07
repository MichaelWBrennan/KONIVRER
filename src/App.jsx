import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CardDatabase } from './pages/CardDatabase';
import { DeckBuilder } from './pages/DeckBuilder';
import { MyDecks } from './pages/MyDecks';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<CardDatabase />} />
            <Route path="/decks" element={<MyDecks />} />
            <Route path="/deckbuilder" element={<DeckBuilder />} />
            <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
