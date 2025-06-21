import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SetProvider } from './contexts/SetContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { JudgeCenter } from './pages/JudgeCenter';
import { TournamentCreate } from './pages/TournamentCreate';
import EnhancedProfile from './components/EnhancedProfile';
import LiveTournament from './pages/LiveTournament';
import AdminPanel from './pages/AdminPanel';
import TournamentManager from './components/TournamentManager';
import PlayerProfile from './components/PlayerProfile';
import UnifiedTournaments from './pages/UnifiedTournaments';

import StreamlinedGamePlatform from './pages/StreamlinedGamePlatform';
import GameSimulator from './pages/GameSimulator';
import CardExplorer from './pages/CardExplorer';
import DeckSearch from './pages/DeckSearch';
import AnalyticsHub from './pages/AnalyticsHub';
import CardPage from './pages/CardPage';
import Rules from './pages/Rules';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SetProvider>
          <DataProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Core Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/rules" element={<Rules />} />

                  {/* Game Simulator - Direct link */}
                  <Route path="/simulator" element={<GameSimulator />} />

                  {/* Section Pages */}
                  <Route path="/cards" element={<CardExplorer />} />
                  <Route path="/cards/*" element={<CardExplorer />} />
                  <Route path="/spoilers" element={<CardExplorer />} />

                  <Route path="/decks" element={<DeckSearch />} />
                  <Route path="/decks/*" element={<DeckSearch />} />

                  {/* Analytics redirected to decks */}
                  <Route path="/analytics" element={<Navigate to="/decks" replace />} />
                  <Route path="/analytics/*" element={<Navigate to="/decks" replace />} />
                  <Route path="/prices" element={<Navigate to="/decks" replace />} />

                  {/* Legacy Game Platform - redirect to sections */}
                  <Route path="/hub" element={<StreamlinedGamePlatform />} />
                  <Route path="/card/:cardId" element={<CardPage />} />

                  {/* Legacy redirects for backward compatibility */}
                  <Route path="/market/*" element={<Navigate to="/decks" replace />} />
                  <Route path="/commanders/*" element={<CardExplorer />} />
                  <Route path="/synergy/*" element={<Navigate to="/decks" replace />} />
                  <Route path="/power/*" element={<Navigate to="/decks" replace />} />
                  <Route path="/budget/*" element={<Navigate to="/decks" replace />} />

                  {/* Tournaments */}
                  <Route path="/tournaments" element={<UnifiedTournaments />} />
                  <Route
                    path="/tournaments/create"
                    element={<TournamentCreate />}
                  />
                  <Route
                    path="/tournaments/:tournamentId/live"
                    element={<LiveTournament />}
                  />

                  {/* Community - redirect to home */}
                  <Route path="/social" element={<Navigate to="/" replace />} />
                  {/* User Management */}
                  <Route path="/profile" element={<EnhancedProfile />} />
                  <Route path="/player/:playerId" element={<PlayerProfile />} />

                  {/* Administrative */}
                  <Route path="/judge-center" element={<JudgeCenter />} />
                  <Route
                    path="/tournament-manager"
                    element={<TournamentManager />}
                  />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </Layout>
            </Router>
          </DataProvider>
        </SetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
