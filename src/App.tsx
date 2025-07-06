import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHomePage from './pages/MobileHomePage';
import Home from './pages/Home';

import './App.css';

// Create simple page components that use SimpleMobileLayout
import SimpleMobileLayout from './components/SimpleMobileLayout';

const CardsPage: React.FC = () => (
  <SimpleMobileLayout currentPage="cards">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Cards Database
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Browse and search through the KONIVRER card collection.
      </p>
    </div>
  </SimpleMobileLayout>
);

const TournamentsPage: React.FC = () => (
  <SimpleMobileLayout currentPage="tournaments">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Tournaments
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        View upcoming tournaments and competition results.
      </p>
    </div>
  </SimpleMobileLayout>
);

const SocialPage: React.FC = () => (
  <SimpleMobileLayout currentPage="social">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Social Hub
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Connect with other players and join the community.
      </p>
    </div>
  </SimpleMobileLayout>
);

const AnalyticsPage: React.FC = () => (
  <SimpleMobileLayout currentPage="analytics">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Statistics & Analytics
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        View your game statistics and performance analytics.
      </p>
    </div>
  </SimpleMobileLayout>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHomePage />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/social" element={<SocialPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/old-home" element={<Home />} />
    </Routes>
  );
};

export default App;
