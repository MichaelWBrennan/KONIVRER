import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnifiedHome from './pages/UnifiedHome';
import { useMediaQuery } from './hooks/useMediaQuery';

import './App.css';

// Create simple page components that use UnifiedLayout with mobile variant
import UnifiedLayout from './components/UnifiedLayout';

const CardsPage: React.FC = () => (
  <UnifiedLayout variant="mobile" currentPage="cards">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Cards Database
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Browse and search through the KONIVRER card collection.
      </p>
    </div>
  </UnifiedLayout>
);

const TournamentsPage: React.FC = () => (
  <UnifiedLayout variant="mobile" currentPage="tournaments">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Tournaments
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        View upcoming tournaments and competition results.
      </p>
    </div>
  </UnifiedLayout>
);

const SocialPage: React.FC = () => (
  <UnifiedLayout variant="mobile" currentPage="social">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Social Hub
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Connect with other players and join the community.
      </p>
    </div>
  </UnifiedLayout>
);

const AnalyticsPage: React.FC = () => (
  <UnifiedLayout variant="mobile" currentPage="analytics">
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Statistics & Analytics
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        View your game statistics and performance analytics.
      </p>
    </div>
  </UnifiedLayout>
);

const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Routes>
      <Route path="/" element={<UnifiedHome variant={isMobile ? 'mobile' : 'standard'} />} />
      <Route path="/simple" element={<UnifiedHome variant="simple" />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/social" element={<SocialPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
};

export default App;
