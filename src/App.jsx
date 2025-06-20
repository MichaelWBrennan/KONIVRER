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

import UnifiedGamePlatform from './pages/UnifiedGamePlatform';
import CardDetail from './pages/CardDetail';

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

                  {/* Unified Game Platform - All game functionality */}
                  <Route path="/hub" element={<UnifiedGamePlatform />} />

                  {/* Card Detail Pages */}
                  <Route path="/card/:cardId" element={<CardDetail />} />

                  {/* All game-related redirects to unified platform */}
                  <Route path="/cards/*" element={<UnifiedGamePlatform />} />
                  <Route path="/decks/*" element={<UnifiedGamePlatform />} />
                  <Route path="/market/*" element={<UnifiedGamePlatform />} />
                  <Route path="/tools/*" element={<UnifiedGamePlatform />} />
                  <Route
                    path="/collection/*"
                    element={<UnifiedGamePlatform />}
                  />
                  <Route path="/prices/*" element={<UnifiedGamePlatform />} />
                  <Route path="/spoilers/*" element={<UnifiedGamePlatform />} />
                  <Route
                    path="/commanders/*"
                    element={<UnifiedGamePlatform />}
                  />
                  <Route path="/synergy/*" element={<UnifiedGamePlatform />} />
                  <Route path="/power/*" element={<UnifiedGamePlatform />} />
                  <Route path="/budget/*" element={<UnifiedGamePlatform />} />

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
