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

// New MTGGoldfish-inspired features
import PriceTracker from './pages/PriceTracker';
import MetagameAnalysis from './pages/MetagameAnalysis';
import BudgetDecks from './pages/BudgetDecks';
import DeckPricing from './pages/DeckPricing';
import CardSpoilers from './pages/CardSpoilers';
import CommanderRecommendations from './pages/CommanderRecommendations';
import FormatStaples from './pages/FormatStaples';
import TournamentResults from './pages/TournamentResults';
import CollectionPortfolio from './pages/CollectionPortfolio';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cards" element={<UnifiedCardDatabase />} />
                <Route
                  path="/card-database"
                  element={<UnifiedCardDatabase />}
                />
                <Route
                  path="/advanced-cards"
                  element={<UnifiedCardDatabase />}
                />
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
                <Route
                  path="/official-decklists"
                  element={<OfficialDecklists />}
                />
                <Route path="/lore" element={<LoreCenter />} />
                <Route path="/products" element={<ProductReleases />} />

                <Route path="/hall-of-fame" element={<RollOfHonor />} />
                <Route
                  path="/tournament-manager"
                  element={<TournamentManager />}
                />
                <Route path="/meta-analysis" element={<MetaAnalysis />} />
                <Route path="/player/:playerId" element={<PlayerProfile />} />

                {/* New MTGGoldfish-inspired routes */}
                <Route path="/prices" element={<PriceTracker />} />
                <Route path="/price-tracker" element={<PriceTracker />} />
                <Route path="/metagame" element={<MetagameAnalysis />} />
                <Route
                  path="/metagame-analysis"
                  element={<MetagameAnalysis />}
                />
                <Route path="/budget-decks" element={<BudgetDecks />} />
                <Route path="/budget" element={<BudgetDecks />} />
                <Route path="/deck-pricing" element={<DeckPricing />} />
                <Route path="/pricing" element={<DeckPricing />} />
                <Route path="/spoilers" element={<CardSpoilers />} />
                <Route path="/previews" element={<CardSpoilers />} />

                {/* Additional MTGGoldfish features */}
                <Route
                  path="/commander-recommendations"
                  element={<CommanderRecommendations />}
                />
                <Route
                  path="/commanders"
                  element={<CommanderRecommendations />}
                />
                <Route path="/format-staples" element={<FormatStaples />} />
                <Route path="/staples" element={<FormatStaples />} />
                <Route
                  path="/tournament-results"
                  element={<TournamentResults />}
                />
                <Route path="/results" element={<TournamentResults />} />
                <Route path="/collection" element={<CollectionPortfolio />} />
                <Route path="/portfolio" element={<CollectionPortfolio />} />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
