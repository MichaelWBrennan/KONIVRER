import React from 'react';
import PhysicalMatchmaking from './components/PhysicalMatchmaking';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>KONIVRER Physical Matchmaking</h1>
      </header>
      <main className="app-content">
        <PhysicalMatchmaking />
      </main>
      <footer className="app-footer">
        <p>© 2025 KONIVRER Deck Database</p>
      </footer>
    </div>
  );
}

export default App;