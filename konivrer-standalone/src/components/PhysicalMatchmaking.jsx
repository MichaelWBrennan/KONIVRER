import React, { useCallback, useMemo } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import QRCodeGenerator from './QRCodeGenerator';
import AncientThemeQRCodeGenerator from './AncientThemeQRCodeGenerator';
import { useTheme, useDebugMode } from '../hooks';
import { calculateBayesianRating } from '../utils';
import { THEMES } from '../utils/constants';

/**
 * Memoized select option components for better performance
 */
const MatchOptions = React.memo(({ matches }) => (
  <>
    <option value="">-- Select a match --</option>
    {matches.map(match => (
      <option key={match.id} value={match.id}>
        {match.player1?.name || 'Player 1'} vs{' '}
        {match.player2?.name || 'Player 2'}
      </option>
    ))}
  </>
));

/**
 * Memoized tournament options component
 */
const TournamentOptions = React.memo(({ tournaments }) => (
  <>
    <option value="">-- Select a tournament --</option>
    {tournaments.map(tournament => (
      <option key={tournament.id} value={tournament.id}>
        {tournament.name} ({tournament.format})
      </option>
    ))}
  </>
));

/**
 * Memoized player card component
 */
const PlayerCard = React.memo(({ player, matches }) => {
  // Calculate Bayesian rating for display
  const bayesianRating = calculateBayesianRating(player, matches);

  return (
    <div className="player-card">
      <p className="player-name">{player.name}</p>
      <p className="player-rating">Rating: {bayesianRating}</p>
      {player.rating !== bayesianRating && (
        <p className="player-base-rating">Base Rating: {player.rating}</p>
      )}
    </div>
  );
});

/**
 * Memoized player list component
 */
const PlayerList = React.memo(({ players, matches }) => (
  <div className="player-list">
    {players.map(player => (
      <PlayerCard key={player.id} player={player} matches={matches} />
    ))}
  </div>
));

/**
 * Main Physical Matchmaking Component
 *
 * @returns {JSX.Element} Physical matchmaking component
 */
const PhysicalMatchmaking = () => {
  const { players, tournaments, matches } = usePhysicalMatchmaking();
  const { theme, isAncientTheme, toggleTheme } = useTheme();
  const { debugMode, toggleDebugMode } = useDebugMode();

  // Get match and tournament from context
  const {
    getMatchById,
    getTournamentById,
    selectedMatchId,
    selectedTournamentId,
    setSelectedMatchId,
    setSelectedTournamentId,
  } = usePhysicalMatchmaking();

  // Memoized event handlers to prevent unnecessary re-renders
  const handleMatchChange = useCallback(
    e => {
      setSelectedMatchId(e.target.value || null);
    },
    [setSelectedMatchId],
  );

  const handleTournamentChange = useCallback(
    e => {
      setSelectedTournamentId(e.target.value || null);
    },
    [setSelectedTournamentId],
  );

  // Memoized QR code components to prevent unnecessary re-renders
  const matchQRCode = useMemo(() => {
    if (!selectedMatchId) return null;

    return isAncientTheme ? (
      <AncientThemeQRCodeGenerator
        matchId={selectedMatchId}
        includeData={debugMode}
      />
    ) : (
      <QRCodeGenerator matchId={selectedMatchId} includeData={debugMode} />
    );
  }, [selectedMatchId, isAncientTheme, debugMode]);

  const tournamentQRCode = useMemo(() => {
    if (!selectedTournamentId) return null;

    return isAncientTheme ? (
      <AncientThemeQRCodeGenerator
        tournamentId={selectedTournamentId}
        includeData={debugMode}
      />
    ) : (
      <QRCodeGenerator
        tournamentId={selectedTournamentId}
        includeData={debugMode}
      />
    );
  }, [selectedTournamentId, isAncientTheme, debugMode]);

  return (
    <div className="physical-matchmaking">
      <h2>Physical Matchmaking</h2>

      <div className="matchmaking-grid">
        <div className="matches-section">
          <h3>Physical Matches</h3>
          <p>Total matches: {matches.length}</p>

          <div className="match-selector">
            <label htmlFor="match-select">
              Select a match to generate QR code:
            </label>
            <select
              id="match-select"
              value={selectedMatchId || ''}
              onChange={handleMatchChange}
              aria-label="Select match"
            >
              <MatchOptions matches={matches} />
            </select>
          </div>

          {selectedMatchId && <div className="qr-display">{matchQRCode}</div>}
        </div>

        <div className="tournaments-section">
          <h3>Tournaments</h3>
          <p>Total tournaments: {tournaments.length}</p>

          <div className="tournament-selector">
            <label htmlFor="tournament-select">
              Select a tournament to generate QR code:
            </label>
            <select
              id="tournament-select"
              value={selectedTournamentId || ''}
              onChange={handleTournamentChange}
              aria-label="Select tournament"
            >
              <TournamentOptions tournaments={tournaments} />
            </select>
          </div>

          {selectedTournamentId && (
            <div className="qr-display">{tournamentQRCode}</div>
          )}
        </div>
      </div>

      <div className="debug-options">
        <div className="options-container">
          <label className="option-label">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={toggleDebugMode}
              aria-label="Toggle debug mode"
            />
            <span>Show QR code data (for debugging)</span>
          </label>

          <label className="option-label">
            <input
              type="checkbox"
              checked={isAncientTheme}
              onChange={toggleTheme}
              aria-label="Toggle ancient theme"
            />
            <span>Use Ancient-Esoteric Theme</span>
          </label>
        </div>
      </div>

      <div className="player-stats">
        <h3>Player Statistics</h3>
        <p>Total players: {players.length}</p>
        <PlayerList players={players} matches={matches} />
      </div>
    </div>
  );
};

export default React.memo(PhysicalMatchmaking);
