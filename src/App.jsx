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
import { PhysicalMatchmakingProvider } from './contexts/PhysicalMatchmakingContext';
import MobileFirstLayout from './components/MobileFirstLayout';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthCallback from './components/OAuthCallback';
import OAuthComplete from './components/OAuthComplete';
import Home from './pages/Home';
import MobileHome from './pages/MobileHome';
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
import MobileGamePage from './pages/MobileGamePage';
import CardExplorer from './pages/CardExplorer';
import MobileCardExplorer from './pages/MobileCardExplorer';
import DeckSearch from './pages/DeckSearch';
import MobileDeckSearch from './pages/MobileDeckSearch';
import CardPage from './pages/CardPage';
import Rules from './pages/Rules';
import MobileRules from './pages/MobileRules';
import Matchmaking from './pages/Matchmaking';
import MobileMatchmaking from './pages/MobileMatchmaking';

import BattlePass from './pages/BattlePass';
import DeckSelectionPage from './pages/DeckSelectionPage';
import BattlePassDashboard from './components/battlepass/BattlePassDashboard';
import EnhancedDeckBuilder from './components/deckbuilder/EnhancedDeckBuilder';
import EnhancedCardSearch from './components/cards/EnhancedCardSearch';
import IndustryLeadingGamePlatform from './components/IndustryLeadingGamePlatform';
import PhysicalMatchmaking from './components/PhysicalMatchmaking';
import EnhancedPhysicalMatchmaking from './components/EnhancedPhysicalMatchmaking';
import PhysicalMatchmakingPage from './pages/PhysicalMatchmakingPage';
import AdvancedPhysicalMatchmakingPage from './pages/AdvancedPhysicalMatchmakingPage';
import StandaloneMatchmaking from './components/StandaloneMatchmaking';

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
                      <PhysicalMatchmakingProvider>
                        <MobileFirstLayout>
                          <Routes>
                  {/* Core Pages */}
                  <Route path="/" element={<MobileHome />} />
                  <Route path="/rules" element={<Rules />} />

                  {/* Game Page */}
                  <Route path="/game/:mode" element={<MobileGamePage />} />
                  <Route path="/game/:mode/:gameId" element={<MobileGamePage />} />
                  
                  {/* Industry-Leading Game Platform */}
                  <Route path="/advanced-game/:mode" element={<IndustryLeadingGamePlatform />} />
                  <Route path="/advanced-game/:mode/:gameId" element={<IndustryLeadingGamePlatform />} />
                  <Route path="/deck-selection" element={<DeckSelectionPage />} />
                  <Route path="/deck-builder" element={<ProtectedRoute><EnhancedDeckBuilder /></ProtectedRoute>} />
                  <Route path="/deck-builder/:deckId" element={<ProtectedRoute><EnhancedDeckBuilder /></ProtectedRoute>} />
                  <Route path="/enhanced-deck-builder" element={<ProtectedRoute><EnhancedDeckBuilder /></ProtectedRoute>} />
                  <Route path="/battle-pass" element={<BattlePass />} />
                  <Route path="/battle-pass-dashboard" element={<BattlePassDashboard />} />

                  {/* Matchmaking System */}
                  <Route path="/matchmaking" element={<MobileMatchmaking />} />
                  
                  {/* Physical Matchmaking System */}
                  <Route path="/physical-matchmaking" element={<PhysicalMatchmakingPage />} />
                  <Route path="/physical-matchmaking-legacy" element={<PhysicalMatchmaking />} />
                  <Route path="/advanced-physical-matchmaking" element={<AdvancedPhysicalMatchmakingPage />} />
                  
                  {/* Standalone PWA Matchmaking */}
                  <Route path="/standalone-matchmaking" element={<StandaloneMatchmaking />} />

                  {/* Redirect for old play URL */}
                  <Route
                    path="/play"
                    element={<Navigate to="/game/online" replace />}
                  />

                  {/* Section Pages */}
                  <Route path="/cards" element={<MobileCardExplorer />} />
                  <Route path="/cards/*" element={<MobileCardExplorer />} />
                  <Route path="/enhanced-card-search" element={<EnhancedCardSearch />} />
                  <Route path="/spoilers" element={<CardExplorer />} />

                  <Route path="/decks" element={<MobileDeckSearch />} />
                  <Route path="/decks/*" element={<MobileDeckSearch />} />

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
                  <Route path="/rules" element={<MobileRules />} />

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
                    element={<ProtectedRoute><TournamentCreate /></ProtectedRoute>}
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
                  
                  {/* OAuth Routes */}
                  <Route path="/oauth/callback" element={<OAuthCallback />} />
                  <Route path="/oauth/complete" element={<OAuthComplete />} />
                </Routes>
                        </MobileFirstLayout>
                      </PhysicalMatchmakingProvider>
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
