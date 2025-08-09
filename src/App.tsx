import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DeckBuilderAdvanced } from './pages/DeckBuilderAdvanced';
import { Tournaments } from './pages/Tournaments';
import { Social } from './pages/Social';
import { Analytics } from './pages/Analytics';
import { Blog } from './pages/Blog';
import { CardSimulator } from './components/CardSimulator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CardSimulator />} />
          <Route path="/deckbuilder" element={<DeckBuilderAdvanced />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/social" element={<Social />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;