import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnifiedHome from './pages/UnifiedHome';
import { useMediaQuery } from './hooks/useMediaQuery';

import './App.css';

// Create simple page components that use UnifiedLayout with mobile variant
import UnifiedLayout from './components/UnifiedLayout';

const CardsPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', color: 'white', minHeight: '100vh' }} />
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#d4af37' }} /></h1>
        Cards Database
      </h1>
      <p style={{ color: '#ccc' }} /></p>
        Browse and search through the KONIVRER card collection.
      </p>
    </div>
  )
};

const TournamentsPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="tournaments" />
    <div className="p-4" />
    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }} /></h1>
        Tournaments
      </h1>
      <p style={{ color: 'var(--text-secondary)' }} /></p>
        View upcoming tournaments and competition results.
      </p>
    </div>
  </UnifiedLayout>
);

const SocialPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="social" />
    <div className="p-4" />
    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }} /></h1>
        Social Hub
      </h1>
      <p style={{ color: 'var(--text-secondary)' }} /></p>
        Connect with other players and join the community.
      </p>
    </div>
  </UnifiedLayout>
);

const DecksPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="decks" />
    <div className="p-4" />
    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }} /></h1>
        Deck Builder
      </h1>
      <p style={{ color: 'var(--text-secondary)' }} /></p>
        Build and manage your KONIVRER decks.
      </p>
    </div>
  </UnifiedLayout>
);

const PlayPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="play" />
    <div className="p-4" />
    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }} /></h1>
        Play Game
      </h1>
      <p style={{ color: 'var(--text-secondary)' }} /></p>
        Start a new game or join an existing match.
      </p>
    </div>
  </UnifiedLayout>
);

const AnalyticsPage: React.FC = () => (
  <UnifiedLayout variant="golden" currentPage="analytics" />
    <div className="p-4" />
    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }} /></h1>
        Statistics & Analytics
      </h1>
      <p style={{ color: 'var(--text-secondary)' }} /></p>
        View your game statistics and performance analytics.
      </p>
    </div>
  </UnifiedLayout>
);

const App: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Routes />
    <Route path="/" element={<UnifiedHome variant="standard"  />
  } />
      <Route path="/simple" element={<UnifiedHome variant="simple"  />} />
      <Route path="/cards" element={<CardsPage  />} />
      <Route path="/decks" element={<DecksPage  />} />
      <Route path="/tournaments" element={<TournamentsPage  />} />
      <Route path="/play" element={<PlayPage  />} />
      <Route path="/social" element={<SocialPage  />} />
      <Route path="/analytics" element={<AnalyticsPage  />} />
    </Routes>
  )
};

export default App;
