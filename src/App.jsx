import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import EnhancedCardDatabase from './pages/EnhancedCardDatabase';
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
import RulesCenter from './pages/RulesCenter';
import RollOfHonor from './pages/RollOfHonor';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cards" element={<EnhancedCardDatabase />} />
                <Route path="/decklists" element={<UnifiedDeckSystem />} />
                <Route path="/deckbuilder" element={<UnifiedDeckSystem />} />
                <Route
                  path="/deckbuilder/:deckId"
                  element={<UnifiedDeckSystem />}
                />
                <Route path="/deck-discovery" element={<UnifiedDeckSystem />} />
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
                <Route path="/judge-center" element={<JudgeCenter />} />
                <Route path="/profile" element={<EnhancedProfile />} />
                <Route path="/social" element={<SocialHub />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/store-locator" element={<StoreLocator />} />
                <Route path="/leaderboards" element={<Leaderboards />} />
                <Route path="/official-decklists" element={<OfficialDecklists />} />
                <Route path="/lore" element={<LoreCenter />} />
                <Route path="/products" element={<ProductReleases />} />
                <Route path="/rules" element={<RulesCenter />} />
                <Route path="/hall-of-fame" element={<RollOfHonor />} />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
