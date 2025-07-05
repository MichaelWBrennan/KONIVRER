/**
 * KONIVRER Deck Database - Main Application Component
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

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

// Core Pages
import MobileHome from './pages/MobileHome';
import Rules from './pages/Rules';
import MobileRules from './pages/MobileRules';

// Game System
import MobileGamePage from './pages/MobileGamePage';
import EnhancedGamePage from './pages/EnhancedGamePage';
import DeckSelectionPage from './pages/DeckSelectionPage';
import EnhancedDeckBuilder from './components/deckbuilder/EnhancedDeckBuilder';
import BattlePass from './pages/BattlePass';
import KonivrERDemo from './pages/KonivrERDemo';
import GameBoardTest from './pages/GameBoardTest';
import AIConsciousnessDemo from './pages/AIConsciousnessDemo';

// Card & Deck System
import UnifiedCardExplorer from './components/UnifiedCardExplorer';
import MobileDeckSearch from './pages/MobileDeckSearch';
import CardPage from './pages/CardPage';
import CardArtShowcase from './pages/CardArtShowcase';

import AdvancedSearchPage from './pages/AdvancedSearchPage';
import ComprehensiveAdvancedSearchPage from './pages/ComprehensiveAdvancedSearchPage';
import ScryfalLikeAdvancedSearchPage from './pages/ScryfalLikeAdvancedSearchPage';
import SyntaxGuide from './pages/SyntaxGuide';

// Matchmaking System
import UnifiedMatchmakingPage from './pages/UnifiedMatchmakingPage';
import PhysicalMatchmakingPage from './pages/PhysicalMatchmakingPage';
import StandaloneMatchmaking from './components/StandaloneMatchmaking';

// Tournament System
import UnifiedTournaments from './pages/UnifiedTournaments';
import TournamentCreate from './pages/TournamentCreate';
import LiveTournament from './pages/LiveTournament';
import JudgeCenter from './pages/JudgeCenter';

// Admin & Profile
import EnhancedProfile from './components/EnhancedProfile';
import PlayerProfile from './components/PlayerProfile';
import AdminPanel from './pages/AdminPanel';

// New melee.gg inspired features
import DecklistSubmission from './pages/DecklistSubmission';
import PlayerPortal from './pages/PlayerPortal';
import OrganizationDashboard from './pages/OrganizationDashboard';
import MobileJudgeTools from './components/tournaments/MobileJudgeTools';

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
                            {/* Core */}
                            <Route path="/" element={<MobileHome />} />
                            <Route path="/rules" element={<Rules />} />

                            {/* Game */}
                            <Route
                              path="/game/ai-testing"
                              element={<EnhancedGamePage />}
                            />
                            <Route
                              path="/game/ai-testing/:gameId"
                              element={<EnhancedGamePage />}
                            />
                            <Route
                              path="/game/pvp"
                              element={<EnhancedGamePage />}
                            />
                            <Route
                              path="/game/pvp/:gameId"
                              element={<EnhancedGamePage />}
                            />
                            <Route
                              path="/game/:mode"
                              element={<MobileGamePage />}
                            />
                            <Route
                              path="/game/:mode/:gameId"
                              element={<MobileGamePage />}
                            />
                            <Route
                              path="/konivrer-demo"
                              element={<KonivrERDemo />}
                            />
                            <Route
                              path="/ai-consciousness-demo"
                              element={<AIConsciousnessDemo />}
                            />
                            <Route
                              path="/game-board-test"
                              element={<GameBoardTest />}
                            />
                            <Route
                              path="/deck-selection"
                              element={<DeckSelectionPage />}
                            />
                            <Route
                              path="/deck-builder"
                              element={
                                <ProtectedRoute>
                                  <EnhancedDeckBuilder />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/deck-builder/:deckId"
                              element={
                                <ProtectedRoute>
                                  <EnhancedDeckBuilder />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/battle-pass"
                              element={<BattlePass />}
                            />

                            {/* Cards & Decks */}
                            <Route
                              path="/cards"
                              element={<ScryfalLikeAdvancedSearchPage />}
                            />
                            <Route
                              path="/cards/*"
                              element={<UnifiedCardExplorer />}
                            />
                            <Route
                              path="/card/:cardId"
                              element={<CardPage />}
                            />
                            <Route
                              path="/card/:set/:cardId/:cardName"
                              element={<CardPage />}
                            />
                            <Route
                              path="/card-art-showcase"
                              element={<CardArtShowcase />}
                            />

                            <Route
                              path="/advanced-search"
                              element={<AdvancedSearchPage />}
                            />
                            <Route
                              path="/comprehensive-search"
                              element={<ComprehensiveAdvancedSearchPage />}
                            />
                            <Route
                              path="/syntax-guide"
                              element={<SyntaxGuide />}
                            />
                            <Route
                              path="/decks"
                              element={<MobileDeckSearch />}
                            />
                            <Route
                              path="/decks/*"
                              element={<MobileDeckSearch />}
                            />

                            {/* Matchmaking */}
                            <Route
                              path="/matchmaking"
                              element={<UnifiedMatchmakingPage />}
                            />
                            <Route
                              path="/physical-matchmaking"
                              element={<PhysicalMatchmakingPage />}
                            />
                            <Route
                              path="/standalone-matchmaking"
                              element={<StandaloneMatchmaking />}
                            />

                            {/* Tournaments */}
                            <Route
                              path="/tournaments"
                              element={<UnifiedTournaments />}
                            />
                            <Route
                              path="/tournaments/create"
                              element={
                                <ProtectedRoute>
                                  <TournamentCreate />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/tournaments/:tournamentId/live"
                              element={<LiveTournament />}
                            />
                            <Route
                              path="/judge-center"
                              element={<JudgeCenter />}
                            />

                            {/* New melee.gg inspired features */}
                            <Route
                              path="/decklist-submission"
                              element={
                                <ProtectedRoute>
                                  <DecklistSubmission />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/decklist-submission/:tournamentId"
                              element={
                                <ProtectedRoute>
                                  <DecklistSubmission />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/player-portal"
                              element={
                                <ProtectedRoute>
                                  <PlayerPortal />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/organization-dashboard"
                              element={
                                <ProtectedRoute>
                                  <OrganizationDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/mobile-judge-tools/:tournamentId"
                              element={
                                <ProtectedRoute>
                                  <MobileJudgeTools />
                                </ProtectedRoute>
                              }
                            />

                            {/* User */}
                            <Route
                              path="/profile"
                              element={<EnhancedProfile />}
                            />
                            <Route
                              path="/player/:playerId"
                              element={<PlayerProfile />}
                            />
                            <Route
                              path="/admin"
                              element={
                                <ProtectedRoute requireAdmin>
                                  <AdminPanel />
                                </ProtectedRoute>
                              }
                            />

                            {/* OAuth */}
                            <Route
                              path="/oauth/callback"
                              element={<OAuthCallback />}
                            />
                            <Route
                              path="/oauth/complete"
                              element={<OAuthComplete />}
                            />

                            {/* Redirects */}
                            <Route
                              path="/play"
                              element={<Navigate to="/game/online" replace />}
                            />
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
                            <Route
                              path="/market/*"
                              element={<Navigate to="/decks" replace />}
                            />
                            <Route
                              path="/social"
                              element={<Navigate to="/" replace />}
                            />
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
