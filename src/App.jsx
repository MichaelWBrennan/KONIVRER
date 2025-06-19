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
import UnifiedCards from './pages/UnifiedCards';
import UnifiedTournaments from './pages/UnifiedTournaments';
import UnifiedCommunity from './pages/UnifiedCommunity';
import UnifiedResources from './pages/UnifiedResources';
import BattlePass from './pages/BattlePass';
import CardMaker from './pages/CardMaker';
import ReplayCenter from './pages/ReplayCenter';

// New MTGGoldfish-inspired features
import PriceTracker from './pages/PriceTracker';
import MetagameAnalysis from './pages/MetagameAnalysis';
import BudgetDecks from './pages/BudgetDecks';
import DeckPricing from './pages/DeckPricing';
import CardSpoilers from './pages/CardSpoilers';

// New EDHREC-inspired features
import CommanderRecommendations from './pages/CommanderRecommendations';
import CardSynergy from './pages/CardSynergy';
import PowerLevelCalculator from './pages/PowerLevelCalculator';
import TournamentResults from './pages/TournamentResults';
import CollectionPortfolio from './pages/CollectionPortfolio';
import FormatStaples from './pages/FormatStaples';

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
                <Route path="/cards" element={<UnifiedCards />} />
                <Route path="/card-database" element={<UnifiedCards />} />
                <Route path="/advanced-cards" element={<UnifiedCards />} />

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
                <Route path="/tournaments" element={<UnifiedTournaments />} />
                <Route path="/events" element={<UnifiedTournaments />} />
                <Route
                  path="/tournaments/create"
                  element={<TournamentCreate />}
                />
                <Route
                  path="/tournaments/:tournamentId/live"
                  element={<LiveTournament />}
                />
                <Route path="/leaderboards" element={<UnifiedTournaments />} />
                <Route path="/analytics" element={<UnifiedTournaments />} />

                {/* Community & Social */}
                <Route path="/social" element={<UnifiedCommunity />} />
                <Route path="/hall-of-fame" element={<UnifiedCommunity />} />
                <Route path="/store-locator" element={<UnifiedCommunity />} />

                {/* Game Resources */}
                <Route path="/lore" element={<UnifiedResources />} />
                <Route path="/products" element={<UnifiedResources />} />
                <Route path="/meta-analysis" element={<UnifiedResources />} />

                {/* User Management */}
                <Route path="/profile" element={<EnhancedProfile />} />
                <Route path="/player/:playerId" element={<PlayerProfile />} />

                {/* New Dueling Nexus Features */}
                <Route path="/battle-pass" element={<BattlePass />} />
                <Route path="/card-maker" element={<CardMaker />} />
                <Route path="/replays" element={<ReplayCenter />} />

                {/* Administrative */}
                <Route path="/judge-center" element={<JudgeCenter />} />
                <Route
                  path="/tournament-manager"
                  element={<TournamentManager />}
                />
                <Route path="/admin" element={<AdminPanel />} />

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

                {/* New EDHREC-inspired routes */}
                <Route
                  path="/commander-recommendations"
                  element={<CommanderRecommendations />}
                />
                <Route
                  path="/commander-recs"
                  element={<CommanderRecommendations />}
                />
                <Route
                  path="/commanders"
                  element={<CommanderRecommendations />}
                />
                <Route path="/card-synergy" element={<CardSynergy />} />
                <Route path="/synergy-explorer" element={<CardSynergy />} />
                <Route path="/synergy" element={<CardSynergy />} />
                <Route path="/power-level" element={<PowerLevelCalculator />} />
                <Route
                  path="/power-calculator"
                  element={<PowerLevelCalculator />}
                />
                <Route path="/power" element={<PowerLevelCalculator />} />
                <Route
                  path="/tournament-results"
                  element={<TournamentResults />}
                />
                <Route path="/collection" element={<CollectionPortfolio />} />
                <Route path="/portfolio" element={<CollectionPortfolio />} />
                <Route path="/format-staples" element={<FormatStaples />} />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
