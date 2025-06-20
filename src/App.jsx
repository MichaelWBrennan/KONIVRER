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

                  {/* Unified Game Platform - All game functionality */}
                  <Route path="/hub" element={<StreamlinedGamePlatform />} />
                  <Route path="/card/:cardId" element={<CardPage />} />

                  {/* All game-related redirects to unified platform */}
                  <Route
                    path="/cards/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/decks/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/market/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/tools/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/collection/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/prices/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/spoilers/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/commanders/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/synergy/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/power/*"
                    element={<StreamlinedGamePlatform />}
                  />
                  <Route
                    path="/budget/*"
                    element={<StreamlinedGamePlatform />}
                  />

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
