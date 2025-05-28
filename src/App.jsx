import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DeckBuilder from './pages/DeckBuilder';
import CardDatabase from './pages/CardDatabase';
import MyDecks from './pages/MyDecks';
import './App.css';

function App() {
  return (
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
  );
}

export default App;