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
import { DeckProvider } from './contexts/DeckContext';
import { BattlePassProvider } from './contexts/BattlePassContext';
import { GameEngineProvider } from './contexts/GameEngineContext';
import { SocialProvider } from './contexts/SocialContext';
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
import GamePage from './pages/GamePage';
import CardExplorer from './pages/CardExplorer';
import DeckSearch from './pages/DeckSearch';
import AnalyticsHub from './pages/AnalyticsHub';
import CardPage from './pages/CardPage';
import Rules from './pages/Rules';
import DeckBuilder from './pages/DeckBuilder';
import BattlePass from './pages/BattlePass';
import DeckSelectionPage from './pages/DeckSelectionPage';
import BattlePassDashboard from './components/battlepass/BattlePassDashboard';
import EnhancedDeckBuilder from './components/deckbuilder/EnhancedDeckBuilder';
import EnhancedCardSearch from './components/cards/EnhancedCardSearch';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SetProvider>
          <DataProvider>
            <BattlePassProvider>
              <DeckProvider>
                <GameEngineProvider>
                  <SocialProvider>
                  <Router>
                    <Layout>
                      <Routes>
                  {/* Core Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/rules" element={<Rules />} />

                  {/* Game Page */}
                  <Route path="/game/:mode" element={<GamePage />} />
                  <Route path="/game/:mode/:gameId" element={<GamePage />} />
                  <Route path="/deck-selection" element={<DeckSelectionPage />} />
                  <Route path="/deck-builder" element={<DeckBuilder />} />
                  <Route path="/deck-builder/:deckId" element={<DeckBuilder />} />
                  <Route path="/enhanced-deck-builder" element={<EnhancedDeckBuilder />} />
                  <Route path="/battle-pass" element={<BattlePass />} />
                  <Route path="/battle-pass-dashboard" element={<BattlePassDashboard />} />

                  {/* Redirect for old play URL */}
                  <Route
                    path="/play"
                    element={<Navigate to="/game/online" replace />}
                  />

                  {/* Section Pages */}
                  <Route path="/cards" element={<CardExplorer />} />
                  <Route path="/cards/*" element={<CardExplorer />} />
                  <Route path="/enhanced-card-search" element={<EnhancedCardSearch />} />
                  <Route path="/spoilers" element={<CardExplorer />} />

                  <Route path="/decks" element={<DeckSearch />} />
                  <Route path="/decks/*" element={<DeckSearch />} />

                  {/* Analytics redirected to decks */}
                  <Route
                    path="/analytics"
                    element={<Navigate to="/decks" replace />}
                  />
                  <Route
                    path="/analytics/*"
                    element={<Navigate to="/decks" replace />}
                  />
                  <Route
                    path="/prices"
                    element={<Navigate to="/decks" replace />}
                  />

                  {/* Legacy Game Platform - redirect to sections */}
                  <Route path="/hub" element={<StreamlinedGamePlatform />} />
                  <Route path="/card/:cardId" element={<CardPage />} />

                  {/* Legacy redirects for backward compatibility */}
                  <Route
                    path="/market/*"
                    element={<Navigate to="/decks" replace />}
                  />
                  <Route path="/commanders/*" element={<CardExplorer />} />
                  <Route
                    path="/synergy/*"
                    element={<Navigate to="/decks" replace />}
                  />
                  <Route
                    path="/power/*"
                    element={<Navigate to="/decks" replace />}
                  />
                  <Route
                    path="/budget/*"
                    element={<Navigate to="/decks" replace />}
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
                  </SocialProvider>
                </GameEngineProvider>
              </DeckProvider>
            </BattlePassProvider>
          </DataProvider>
        </SetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
