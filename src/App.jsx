import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CardDatabase } from './pages/CardDatabase';
import { DeckBuilder } from './pages/DeckBuilder';
import { MyDecks } from './pages/MyDecks';
import { Tournaments } from './pages/Tournaments';
import { JudgeCenter } from './pages/JudgeCenter';
import { TournamentCreate } from './pages/TournamentCreate';
import { Profile } from './pages/Profile';
import PlayerProfile from './pages/PlayerProfile';
import Leaderboards from './pages/Leaderboards';
import UserSettings from './pages/UserSettings';
import SavedDecks from './pages/SavedDecks';
import EventRegistration from './pages/EventRegistration';

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
              <Route path="/saved-decks" element={<SavedDecks />} />
              <Route path="/deckbuilder" element={<DeckBuilder />} />
              <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/create" element={<TournamentCreate />} />
              <Route path="/tournaments/:eventId/register" element={<EventRegistration />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/judge-center" element={<JudgeCenter />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/player-profile" element={<PlayerProfile />} />
              <Route path="/settings" element={<UserSettings />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
