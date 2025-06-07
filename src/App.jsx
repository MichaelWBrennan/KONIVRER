import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CardDatabase } from './pages/CardDatabase';
import { DeckBuilder } from './pages/DeckBuilder';
import { MyDecks } from './pages/MyDecks';
import EnhancedTournaments from './components/EnhancedTournaments';
import { JudgeCenter } from './pages/JudgeCenter';
import { TournamentCreate } from './pages/TournamentCreate';
import EnhancedProfile from './components/EnhancedProfile';
import LiveTournament from './pages/LiveTournament';
import AdvancedDeckBuilder from './pages/AdvancedDeckBuilder';
import SocialHub from './pages/SocialHub';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cards" element={<CardDatabase />} />
              <Route path="/decks" element={<MyDecks />} />
              <Route path="/saved-decks" element={<MyDecks />} />
              <Route path="/deckbuilder" element={<DeckBuilder />} />
              <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
              <Route path="/deckbuilder-advanced" element={<AdvancedDeckBuilder />} />
              <Route path="/deckbuilder-advanced/:deckId" element={<AdvancedDeckBuilder />} />
              <Route path="/tournaments" element={<EnhancedTournaments />} />
              <Route path="/tournaments/create" element={<TournamentCreate />} />
              <Route path="/tournaments/:tournamentId/live" element={<LiveTournament />} />
              <Route path="/judge-center" element={<JudgeCenter />} />
              <Route path="/profile" element={<EnhancedProfile />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
