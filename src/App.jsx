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
import DeckWorkshop from './pages/DeckWorkshop';
import AnalyticsHub from './pages/AnalyticsHub';
import CommunityTools from './pages/CommunityTools';
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
                  
                  <Route path="/decks" element={<DeckWorkshop />} />
                  <Route path="/decks/*" element={<DeckWorkshop />} />
                  <Route path="/collection" element={<DeckWorkshop />} />
                  
                  <Route path="/analytics" element={<AnalyticsHub />} />
                  <Route path="/analytics/*" element={<AnalyticsHub />} />
                  <Route path="/prices" element={<AnalyticsHub />} />
                  
                  <Route path="/battle-pass" element={<CommunityTools />} />
                  <Route path="/ai-assistant" element={<CommunityTools />} />
                  <Route path="/community" element={<CommunityTools />} />
                  <Route path="/tools" element={<CommunityTools />} />

                  {/* Legacy Game Platform - redirect to sections */}
                  <Route path="/hub" element={<StreamlinedGamePlatform />} />
                  <Route path="/card/:cardId" element={<CardPage />} />

                  {/* Legacy redirects for backward compatibility */}
                  <Route
                    path="/market/*"
                    element={<AnalyticsHub />}
                  />
                  <Route
                    path="/commanders/*"
                    element={<CardExplorer />}
                  />
                  <Route
                    path="/synergy/*"
                    element={<AnalyticsHub />}
                  />
                  <Route
                    path="/power/*"
                    element={<AnalyticsHub />}
                  />
                  <Route
                    path="/budget/*"
                    element={<AnalyticsHub />}
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
