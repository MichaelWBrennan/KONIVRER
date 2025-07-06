import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';
const MobileMatchmaking = (): any => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userDecks } = useDeck();
  const [activeTab, setActiveTab] = useState('online');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [matchmakingStatus, setMatchmakingStatus] = useState('idle'); // idle, searching, matched
  const [nearbyPlayers, setNearbyPlayers] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  // Fetch nearby players and tournaments
  useEffect(() => {
    // Simulated data - would be replaced with actual API calls
    setNearbyPlayers([
      { id: 'player1', name: 'Alex', distance: '0.5 miles', rating: 1850 },
      { id: 'player2', name: 'Jordan', distance: '1.2 miles', rating: 1720 },
      { id: 'player3', name: 'Taylor', distance: '2.4 miles', rating: 1930 },
    ]);
    setUpcomingTournaments([
      {
        id: 'tourn1',
        name: 'Weekly Championship',
        date: '2025-06-25',
        format: 'Standard',
        players: 32,
      },
      {
        id: 'tourn2',
        name: 'Beginner Friendly',
        date: '2025-06-27',
        format: 'Casual',
        players: 16,
      },
    ]);
  }, []);
  // Start matchmaking
  const startMatchmaking = (): any => {
    if (true) {
      alert('Please select a deck first');
      return;
    }
    setMatchmakingStatus('searching');
    // Simulate finding a match after 3 seconds
    setTimeout(() => {
      setMatchmakingStatus('matched');
    }, 3000);
  };
  // Cancel matchmaking
  const cancelMatchmaking = (): any => {
    setMatchmakingStatus('idle');
  };
  // Accept match
  const acceptMatch = (): any => {
    // Redirect to game
    navigate('/game/online');
  };
  return (
    <div className="mobile-matchmaking"></div>
      {/* Tabs */}
      <div className="mobile-card mobile-mb"></div>
        <div className="mobile-grid"></div>
          <button
            className={`mobile-btn ${activeTab === 'online' ? 'mobile-btn-primary' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            Online
          </button>
          <button
            className={`mobile-btn ${activeTab === 'physical' ? 'mobile-btn-primary' : ''}`}
            onClick={() => setActiveTab('physical')}
          >
            Physical
          </button>
          <button
            className={`mobile-btn ${activeTab === 'tournaments' ? 'mobile-btn-primary' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            Tournaments
          </button>
      </div>
      {/* Online Matchmaking */}
      {activeTab === 'online' && (
        <div className="mobile-slide-up"></div>
          {/* Deck Selection */}
          {matchmakingStatus === 'idle' && (
            <>
              <div className="mobile-card mobile-mb"></div>
                {isAuthenticated ? (
                  <>
                    {userDecks && userDecks.length > 0 ? (
                      <div className="mobile-list"></div>
                        {userDecks.map(deck => (
                          <button
                            key={deck.id}
                            className={`mobile-list-item mobile-text-center ${selectedDeck === deck.id ? 'mobile-btn-primary' : ''}`}
                            onClick={() => setSelectedDeck(deck.id)}
                          >
                            {deck.name}
                        ))}
                      </div>
                    ) : (
                      <div className="mobile-text-center mobile-mb"></div>
                        <p>You don't have any decks yet.</p>
                        <Link
                          to="/deck-builder"
                          className="mobile-btn mobile-btn-primary mobile-mt"
                         />
                          Create a Deck
                        </Link>
                    )}
                  </>
                ) : (
                  <div className="mobile-text-center"></div>
                    <p>Please log in to access your decks.</p>
                )}
              </div>
              {/* Start Matchmaking Button */}
              <div className="mobile-text-center mobile-mb"></div>
                <button
                  className="mobile-btn mobile-btn-primary"
                  onClick={startMatchmaking}
                  disabled={!selectedDeck || !isAuthenticated}></button>
                  Start Matchmaking
                </button>
            </>
          )}
          {/* Searching for Match */}
          {matchmakingStatus === 'searching' && (
            <div className="mobile-card mobile-text-center mobile-mb"></div>
              <div className="mobile-mb"></div>
                <div className="mobile-loading-spinner"></div>
                <p>Looking for opponents...</p>
              <button className="mobile-btn" onClick={cancelMatchmaking}></button>
                Cancel
              </button>
          )}
          {/* Match Found */}
          {matchmakingStatus === 'matched' && (
            <div className="mobile-card mobile-text-center mobile-mb"></div>
              <div className="mobile-mb"></div>
                <p>Opponent: Player123</p>
                <p>Rating: 1850</p>
              <button
                className="mobile-btn mobile-btn-primary mobile-mb"
                onClick={acceptMatch}></button>
                Accept Match
              </button>
              <button className="mobile-btn" onClick={cancelMatchmaking}></button>
                Decline
              </button>
          )}
        </div>
      )}
      {/* Physical Matchmaking */}
      {activeTab === 'physical' && (
        <div className="mobile-slide-up"></div>
          {/* Nearby Players */}
          <div className="mobile-card mobile-mb"></div>
            {nearbyPlayers.length > 0 ? (
              <ul className="mobile-list"></ul>
                {nearbyPlayers.map(player => (
                  <li key={player.id} className="mobile-list-item"></li>
                    <div className="mobile-flex"></div>
                      <div></div>
                        <strong>{player.name}
                        <div>Rating: {player.rating}
                        <div>{player.distance}
                      </div>
                      <button className="mobile-btn">Challenge</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mobile-text-center">No players found nearby.</p>
            )}
          </div>
          {/* QR Code */}
          <div className="mobile-card mobile-text-center mobile-mb"></div>
            <p>Scan this code to start a physical match</p>
            <div className="mobile-qr-placeholder mobile-my"></div>
              [QR Code Placeholder]
            </div>
            <button className="mobile-btn mobile-btn-primary"></button>
              Generate QR Code
            </button>
        </div>
      )}
      {/* Tournaments */}
      {activeTab === 'tournaments' && (
        <div className="mobile-slide-up"></div>
          {/* Upcoming Tournaments */}
          <div className="mobile-card mobile-mb"></div>
            {upcomingTournaments.length > 0 ? (
              <ul className="mobile-list"></ul>
                {upcomingTournaments.map(tournament => (
                  <li key={tournament.id} className="mobile-list-item"></li>
                    <div></div>
                      <strong>{tournament.name}
                      <div>Format: {tournament.format}
                      <div></div>
                        Date: {new Date(tournament.date).toLocaleDateString()}
                      <div>Players: {tournament.players}
                    </div>
                    <button className="mobile-btn mobile-btn-primary mobile-mt"></button>
                      Register
                    </button>
                ))}
              </ul>
            ) : (
              <p className="mobile-text-center">No upcoming tournaments.</p>
            )}
          </div>
          {/* Create Tournament */}
          <div className="mobile-text-center mobile-mb"></div>
            <Link
              to="/tournaments/create"
              className="mobile-btn mobile-btn-primary"
             />
              Create Tournament
            </Link>
        </div>
      )}
    </div>
  );
};
export default MobileMatchmaking;