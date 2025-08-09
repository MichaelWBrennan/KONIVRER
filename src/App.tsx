import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/platform/Navigation';
import { Home } from './pages/Home';
import { DeckBuilderAdvanced } from './pages/DeckBuilderAdvanced';
import { Tournaments } from './pages/Tournaments';
import { Social } from './pages/Social';
import { Analytics } from './pages/Analytics';
import { CardSimulator } from './components/CardSimulator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deckbuilder-advanced" element={<DeckBuilderAdvanced />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/social" element={<Social />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/simulator" element={<CardSimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;