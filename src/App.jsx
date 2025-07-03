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
import DeckSelectionPage from './pages/DeckSelectionPage';
import EnhancedDeckBuilder from './components/deckbuilder/EnhancedDeckBuilder';
import BattlePass from './pages/BattlePass';

// Card & Deck System
import MobileCardExplorer from './pages/MobileCardExplorer';
import MobileDeckSearch from './pages/MobileDeckSearch';
import CardPage from './pages/CardPage';
import CardArtShowcase from './pages/CardArtShowcase';
import CardMaker from './pages/CardMaker';
import AdvancedSearchPage from './pages/AdvancedSearchPage';

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
                              path="/game/:mode"
                              element={<MobileGamePage />}
                            />
                            <Route
                              path="/game/:mode/:gameId"
                              element={<MobileGamePage />}
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
                              element={<MobileCardExplorer />}
                            />
                            <Route
                              path="/cards/*"
                              element={<MobileCardExplorer />}
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
                            <Route path="/card-maker" element={<CardMaker />} />
                            <Route
                              path="/advanced-search"
                              element={<AdvancedSearchPage />}
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
