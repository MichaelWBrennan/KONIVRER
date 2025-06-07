import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test component
const TestHome = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>KONIVRER Deck Database</h1>
    <p>Test page - if you see this, the app is loading correctly!</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/cards" style={{ margin: '0 10px', color: '#007bff' }}>Cards</a>
      <a href="/decks" style={{ margin: '0 10px', color: '#007bff' }}>Decks</a>
      <a href="/deckbuilder" style={{ margin: '0 10px', color: '#007bff' }}>Deck Builder</a>
    </div>
  </div>
);

const TestCards = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Card Database</h1>
    <p>Cards page is working!</p>
    <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
  </div>
);

const TestDecks = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>My Decks</h1>
    <p>Decks page is working!</p>
    <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
  </div>
);

const TestDeckBuilder = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Deck Builder</h1>
    <p>Deck Builder page is working!</p>
    <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestHome />} />
        <Route path="/cards" element={<TestCards />} />
        <Route path="/decks" element={<TestDecks />} />
        <Route path="/deckbuilder" element={<TestDeckBuilder />} />
        <Route path="/deckbuilder/:deckId" element={<TestDeckBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
