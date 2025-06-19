import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JudgeCenter } from './pages/JudgeCenter';
import { TournamentCreate } from './pages/TournamentCreate';
import EnhancedProfile from './components/EnhancedProfile';
import LiveTournament from './pages/LiveTournament';
import SocialHub from './pages/SocialHub';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminPanel from './pages/AdminPanel';
import UnifiedDeckSystem from './pages/UnifiedDeckSystem';
import UnifiedTournamentsEvents from './pages/UnifiedTournamentsEvents';
import StoreLocator from './pages/StoreLocator';
import Leaderboards from './pages/Leaderboards';
import OfficialDecklists from './pages/OfficialDecklists';
import LoreCenter from './pages/LoreCenter';
import ProductReleases from './pages/ProductReleases';

import RollOfHonor from './pages/RollOfHonor';
import TournamentManager from './components/TournamentManager';
import MetaAnalysis from './components/MetaAnalysis';
import UnifiedCardDatabase from './components/UnifiedCardDatabase';
import PlayerProfile from './components/PlayerProfile';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Core Pages */}
                <Route path="/" element={<Home />} />

                {/* Cards - Unified card database with all card-related functionality */}
                <Route path="/cards" element={<UnifiedCardDatabase />} />
                <Route
                  path="/card-database"
                  element={<UnifiedCardDatabase />}
                />
                <Route
                  path="/advanced-cards"
                  element={<UnifiedCardDatabase />}
                />

                {/* Decks - Unified deck system with all deck-related functionality */}
                <Route path="/decklists" element={<UnifiedDeckSystem />} />
                <Route path="/deckbuilder" element={<UnifiedDeckSystem />} />
                <Route
                  path="/deckbuilder/:deckId"
                  element={<UnifiedDeckSystem />}
                />
                <Route path="/deck-discovery" element={<UnifiedDeckSystem />} />
                <Route
                  path="/official-decklists"
                  element={<OfficialDecklists />}
                />

                {/* Tournaments & Events - Unified competitive section */}
                <Route
                  path="/tournaments"
                  element={<UnifiedTournamentsEvents />}
                />
                <Route path="/events" element={<UnifiedTournamentsEvents />} />
                <Route
                  path="/tournaments/create"
                  element={<TournamentCreate />}
                />
                <Route
                  path="/tournaments/:tournamentId/live"
                  element={<LiveTournament />}
                />
                <Route path="/leaderboards" element={<Leaderboards />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />

                {/* Community & Social */}
                <Route path="/social" element={<SocialHub />} />
                <Route path="/hall-of-fame" element={<RollOfHonor />} />
                <Route path="/store-locator" element={<StoreLocator />} />

                {/* Game Resources */}
                <Route path="/lore" element={<LoreCenter />} />
                <Route path="/products" element={<ProductReleases />} />
                <Route path="/meta-analysis" element={<MetaAnalysis />} />

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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
