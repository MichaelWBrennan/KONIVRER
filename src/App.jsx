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

// Unified feature pages
import UnifiedMarket from './pages/UnifiedMarket';
import UnifiedTools from './pages/UnifiedTools';
import UnifiedGameHub from './pages/UnifiedGameHub';
import UnifiedGamePlatform from './pages/UnifiedGamePlatform';

// Individual feature components (for backwards compatibility)
import PriceTracker from './pages/PriceTracker';
import MetagameAnalysis from './pages/MetagameAnalysis';
import BudgetDecks from './pages/BudgetDecks';
import DeckPricing from './pages/DeckPricing';
import CardSpoilers from './pages/CardSpoilers';
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

                {/* Unified Game Platform - All cards, decks, market, and tools functionality */}
                <Route path="/hub" element={<UnifiedGamePlatform />} />
                <Route path="/game-hub" element={<UnifiedGamePlatform />} />
                <Route path="/platform" element={<UnifiedGamePlatform />} />

                {/* Cards - Redirect to unified platform */}
                <Route path="/cards" element={<UnifiedGamePlatform />} />
                <Route
                  path="/card-database"
                  element={<UnifiedGamePlatform />}
                />
                <Route
                  path="/advanced-cards"
                  element={<UnifiedGamePlatform />}
                />

                {/* Decks - Redirect to unified platform */}
                <Route path="/decklists" element={<UnifiedGamePlatform />} />
                <Route path="/deckbuilder" element={<UnifiedGamePlatform />} />
                <Route
                  path="/deckbuilder/:deckId"
                  element={<UnifiedGamePlatform />}
                />
                <Route
                  path="/deck-discovery"
                  element={<UnifiedGamePlatform />}
                />
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

                {/* Market - Redirect to unified platform */}
                <Route path="/market" element={<UnifiedGamePlatform />} />

                {/* Tools - Redirect to unified platform */}
                <Route path="/tools" element={<UnifiedGamePlatform />} />

                {/* Market-related redirects to unified platform */}
                <Route path="/prices" element={<UnifiedGamePlatform />} />
                <Route
                  path="/price-tracker"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/metagame" element={<UnifiedGamePlatform />} />
                <Route
                  path="/metagame-analysis"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/budget-decks" element={<UnifiedGamePlatform />} />
                <Route path="/budget" element={<UnifiedGamePlatform />} />
                <Route path="/deck-pricing" element={<UnifiedGamePlatform />} />
                <Route path="/pricing" element={<UnifiedGamePlatform />} />
                <Route path="/spoilers" element={<UnifiedGamePlatform />} />
                <Route path="/previews" element={<UnifiedGamePlatform />} />

                {/* Tools-related redirects to unified platform */}
                <Route
                  path="/commander-recommendations"
                  element={<UnifiedGamePlatform />}
                />
                <Route
                  path="/commander-recs"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/commanders" element={<UnifiedGamePlatform />} />
                <Route path="/card-synergy" element={<UnifiedGamePlatform />} />
                <Route
                  path="/synergy-explorer"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/synergy" element={<UnifiedGamePlatform />} />
                <Route path="/power-level" element={<UnifiedGamePlatform />} />
                <Route
                  path="/power-calculator"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/power" element={<UnifiedGamePlatform />} />
                <Route path="/collection" element={<UnifiedGamePlatform />} />
                <Route path="/portfolio" element={<UnifiedGamePlatform />} />
                <Route
                  path="/format-staples"
                  element={<UnifiedGamePlatform />}
                />
                <Route path="/card-maker" element={<UnifiedGamePlatform />} />
                <Route path="/battle-pass" element={<UnifiedGamePlatform />} />
                <Route
                  path="/tournament-results"
                  element={<UnifiedTournaments />}
                />
              </Routes>
            </Layout>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
