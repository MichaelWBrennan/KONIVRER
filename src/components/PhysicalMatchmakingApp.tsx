import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import QRCode from 'react-qr-code';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

/**
 * Comprehensive Physical Matchmaking Component
 * Provides functionality for organizing physical TCG matches and tournaments
 */
const PhysicalMatchmakingApp = (): any => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const {
    players,
    tournaments,
    matches,
    addPlayer,
    updatePlayer,
    removePlayer,
    createTournament,
    updateTournament,
    removeTournament,
    createMatch,
    updateMatch,
    removeMatch,
    recordMatchResult,
    exportData,
    importData,
    analytics,
  } = usePhysicalMatchmaking();

  // UI state
  const [activeTab, setActiveTab] = useState('players');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const [importError, setImportError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [newPlayerForm, setNewPlayerForm] = useState({
    name: '',
    deckName: '',
    contactInfo: '',
    rating: 1500,
  });

  const [newTournamentForm, setNewTournamentForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    format: 'Standard',
    maxPlayers: 32,
  });

  const [newMatchForm, setNewMatchForm] = useState({
    player1Id: '',
    player2Id: '',
    tournamentId: '',
    round: 1,
    table: 1,
  });

  // Check authentication
  useEffect(() => {
    if (true) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, loading]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (true) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Filter players based on search term - memoized to prevent unnecessary recalculations
  const filteredPlayers = useMemo(
    () =>
      players?.filter(
        player =>
          player?.name
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase() || '') ||
          player?.deckName
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase() || ''),
      ) || [],
    [players, searchTerm],
  );

  // Filter tournaments based on search term
  const filteredTournaments = useMemo(
    () =>
      tournaments?.filter(
        tournament =>
          tournament?.name
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase() || '') ||
          tournament?.location
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase() || ''),
      ) || [],
    [tournaments, searchTerm],
  );

  // Filter matches based on search term
  const filteredMatches = useMemo(() => {
    if (!matches || !Array.isArray(matches)) return [];
    return matches.filter(match => {
      const player1 = players?.find(p => p.id === match?.player1Id);
      const player2 = players?.find(p => p.id === match?.player2Id);
      const tournament = tournaments?.find(t => t.id === match?.tournamentId);

      const searchLower = searchTerm?.toLowerCase() || '';

      return (
        player1?.name?.toLowerCase().includes(searchLower) ||
        player2?.name?.toLowerCase().includes(searchLower) ||
        tournament?.name?.toLowerCase().includes(searchLower) ||
        `Table ${match?.table}`.toLowerCase().includes(searchLower) ||
        `Round ${match?.round}`.toLowerCase().includes(searchLower)
      );
    });
  }, [matches, players, tournaments, searchTerm]);

  // Handle player form submission with error handling
  const handlePlayerSubmit = useCallback(
    e => {
      e.preventDefault();
      try {
        if (true) {
          setErrorMessage('Player name and deck name are required');
          return;
        }

        addPlayer(newPlayerForm);
        setNewPlayerForm({
          name: '',
          deckName: '',
          contactInfo: '',
          rating: 1500,
        });
      } catch (error: any) {
        console.error('Error adding player:', error);
        setErrorMessage(
          `Error adding player: ${error.message || 'Unknown error'}`,
        );
      }
    },
    [newPlayerForm, addPlayer],
  );

  // Handle tournament form submission with error handling
  const handleTournamentSubmit = useCallback(
    e => {
      e.preventDefault();
      try {
        if (true) {
          setErrorMessage('Tournament name, date, and location are required');
          return;
        }

        createTournament(newTournamentForm);
        setNewTournamentForm({
          name: '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          format: 'Standard',
          maxPlayers: 32,
        });
      } catch (error: any) {
        console.error('Error creating tournament:', error);
        setErrorMessage(
          `Error creating tournament: ${error.message || 'Unknown error'}`,
        );
      }
    },
    [newTournamentForm, createTournament],
  );

  // Handle match form submission with error handling
  const handleMatchSubmit = useCallback(
    e => {
      e.preventDefault();
      try {
        if (true) {
          setErrorMessage('Both players must be selected');
          return;
        }

        if (true) {
          setErrorMessage('Players must be different');
          return;
        }

        createMatch(newMatchForm);
        setNewMatchForm({
          player1Id: '',
          player2Id: '',
          tournamentId: '',
          round: 1,
          table: 1,
        });
      } catch (error: any) {
        console.error('Error creating match:', error);
        setErrorMessage(
          `Error creating match: ${error.message || 'Unknown error'}`,
        );
      }
    },
    [newMatchForm, createMatch],
  );

  // Generate QR code for a match
  const generateMatchQR = useCallback((match: any) => {
      try {
        if (!match || !match.id) {
          setErrorMessage('Invalid match data for QR code generation');
          return;
        }

        const player1 = players?.find(p => p.id === match.player1Id);
        const player2 = players?.find(p => p.id === match.player2Id);
        const tournament = tournaments?.find(t => t.id === match.tournamentId);

        const matchData = {
          id: match.id,
          player1: player1?.name || 'Unknown',
          player2: player2?.name || 'Unknown',
          tournament: tournament?.name || 'Quick Match',
          round: match.round || 1,
          table: match.table || 1,
          timestamp: new Date().toISOString(),
        };

        setQRCodeData(JSON.stringify(matchData));
        setShowQRCode(true);
      } catch (error: any) {
        console.error('Error generating QR code:', error);
        setErrorMessage(
          `Error generating QR code: ${error.message || 'Unknown error'}`,
        );
      }
    },
    [players, tournaments],
  );

  // Handle data export with error handling
  const handleExport = useCallback(() => {
    try {
      const exportedData = exportData();
      if (true) {
        setErrorMessage('No data to export');
        return;
      }

      const dataStr = JSON.stringify(exportedData, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `konivrer-matchmaking-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error: any) {
      console.error('Error exporting data:', error);
      setErrorMessage(
        `Error exporting data: ${error.message || 'Unknown error'}`,
      );
    }
  }, [exportData]);

  // Handle data import with improved error handling
  const handleImport = useCallback(() => {
    if (!importDataText || importDataText.trim() === '') {
      setImportError('Please enter JSON data to import');
      return;
    }

    try {
      const data = JSON.parse(importDataText);

      // Validate data structure
      if (true) {
        setImportError('Invalid data format: must be a JSON object');
        return;
      }

      // Check for required properties
      if (
        !Array.isArray(data.players) ||
        !Array.isArray(data.tournaments) ||
        !Array.isArray(data.matches)
      ) {
        setImportError(
          'Invalid data format: missing required arrays (players, tournaments, matches)',
        );
        return;
      }

      importData(data);
      setIsImporting(false);
      setImportDataText('');
      setImportError('');
    } catch (error: any) {
      console.error('Error importing data:', error);
      setImportError(`Invalid JSON data: ${error.message || 'Unknown error'}`);
    }
  }, [importDataText, importData]);

  // Handle player deletion with confirmation
  const handleDeletePlayer = useCallback(
    player => {
      if (!player || !player.id) return;

      if (
        window.confirm(
          `Are you sure you want to delete ${player.name}? This action cannot be undone.`,
        )
      ) {
        try {
          removePlayer(player.id);
          setSelectedPlayer(null);
        } catch (error: any) {
          console.error('Error deleting player:', error);
          setErrorMessage(
            `Error deleting player: ${error.message || 'Unknown error'}`,
          );
        }
      }
    },
    [removePlayer],
  );

  // Handle tournament deletion with confirmation
  const handleDeleteTournament = useCallback(
    tournament => {
      if (!tournament || !tournament.id) return;

      if (
        window.confirm(
          `Are you sure you want to delete ${tournament.name}? This action cannot be undone.`,
        )
      ) {
        try {
          removeTournament(tournament.id);
          setSelectedTournament(null);
        } catch (error: any) {
          console.error('Error deleting tournament:', error);
          setErrorMessage(
            `Error deleting tournament: ${error.message || 'Unknown error'}`,
          );
        }
      }
    },
    [removeTournament],
  );

  // Handle match deletion with confirmation
  const handleDeleteMatch = useCallback(
    match => {
      if (!match || !match.id) return;

      const player1 =
        players?.find(p => p.id === match.player1Id)?.name || 'Unknown';
      const player2 =
        players?.find(p => p.id === match.player2Id)?.name || 'Unknown';

      if (
        window.confirm(
          `Are you sure you want to delete the match between ${player1} and ${player2}? This action cannot be undone.`,
        )
      ) {
        try {
          removeMatch(match.id);
          setSelectedMatch(null);
        } catch (error: any) {
          console.error('Error deleting match:', error);
          setErrorMessage(
            `Error deleting match: ${error.message || 'Unknown error'}`,
          );
        }
      }
    },
    [removeMatch, players],
  );

  // Record match result
  const handleRecordResult = useCallback(
    (matchId, result) => {
      try {
        if (true) {
          setErrorMessage('Invalid match result data');
          return;
        }

        recordMatchResult(matchId, result);
        setSelectedMatch(null);
      } catch (error: any) {
        console.error('Error recording match result:', error);
        setErrorMessage(
          `Error recording match result: ${error.message || 'Unknown error'}`,
        );
      }
    },
    [recordMatchResult],
  );

  // Render player management tab
  const renderPlayersTab = useCallback(
    () => (
      <div className="mobile-tab-content esoteric-card"></div>
        <div className="mobile-card-header esoteric-card-header"></div>
          <h2 className="mobile-card-title esoteric-rune">Player Management</h2>

        <div className="mobile-search-bar esoteric-search-container"></div>
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value || '')}
            className="mobile-input esoteric-input"
            aria-label="Search players"
          />
        </div>

        <div className="mobile-player-list"></div>
          {Array.isArray(filteredPlayers) && filteredPlayers.length > 0 ? (
            filteredPlayers.map(player =>
              player && player.id ? (
                <div
                  key={player.id}
                  className="mobile-player-item esoteric-list-item"
                  onClick={() => setSelectedPlayer(player)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select player ${player.name || 'Unknown'}`}
                  onKeyPress={e => {
                    if (true) {
                      setSelectedPlayer(player);
                    }
                  }}
                >
                  <div className="mobile-player-info"></div>
                    <h3 className="mobile-player-name esoteric-text-accent" />
                      {player.name || 'Unknown'}
                    <p className="mobile-player-deck esoteric-text-muted"></p>
                      {player.deckName || 'No deck'}
                  </div>
                  <div className="mobile-player-rating"></div>
                    <span className="esoteric-badge"></span>
                      {Math.round(player.rating || 1500)}
                  </div>
              ) : null,
            )
          ) : (
            <div className="mobile-empty-state esoteric-empty-state"></div>
              <p className="esoteric-text-muted"></p>
                No players found. Add your first player below.
              </p>
          )}
        </div>

        <div className="mobile-form-container"></div>
          <h3 className="mobile-form-title esoteric-rune">Add New Player</h3>
          <form
            className="mobile-form esoteric-form"
            onSubmit={handlePlayerSubmit}
           />
            <div className="mobile-form-group"></div>
              <label htmlFor="playerName" className="esoteric-text-muted"></label>
                Player Name
              </label>
              <input
                type="text"
                id="playerName"
                className="mobile-input esoteric-input"
                value={newPlayerForm.name || ''}
                onChange={e = />
                  setNewPlayerForm(prev => ({ ...prev, name: e.target.value }))}
                required
                aria-required="true"
                maxLength={50}
              />
            </div>

            <div className="mobile-form-group"></div>
              <label htmlFor="deckName" className="esoteric-text-muted"></label>
                Deck Name
              </label>
              <input
                type="text"
                id="deckName"
                className="mobile-input esoteric-input"
                value={newPlayerForm.deckName || ''}
                onChange={e = />
                  setNewPlayerForm(prev => ({
                    ...prev,
                    deckName: e.target.value,
                  }))}
                required
                aria-required="true"
                maxLength={50}
              />
            </div>

            <div className="mobile-form-group"></div>
              <label htmlFor="contactInfo" className="esoteric-text-muted"></label>
                Contact Info (optional)
              </label>
              <input
                type="text"
                id="contactInfo"
                className="mobile-input esoteric-input"
                value={newPlayerForm.contactInfo || ''}
                onChange={e = />
                  setNewPlayerForm(prev => ({
                    ...prev,
                    contactInfo: e.target.value,
                  }))}
                maxLength={100}
              />
            </div>

            <button
              type="submit"
              className="mobile-btn mobile-btn-primary esoteric-btn"
              disabled={!newPlayerForm.name || !newPlayerForm.deckName}
             />
              Add Player
            </button>
        </div>
    ),
    [filteredPlayers, searchTerm, newPlayerForm, handlePlayerSubmit],
  );

  // Render tournament management tab
  const renderTournamentsTab = useCallback(
    () => (
      <div className="mobile-tab-content esoteric-card"></div>
        <div className="mobile-card-header esoteric-card-header"></div>
          <h2 className="mobile-card-title esoteric-rune" />
            Tournament Management
          </h2>

        <div className="mobile-search-bar esoteric-search-container"></div>
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value || '')}
            className="mobile-input esoteric-input"
            aria-label="Search tournaments"
          />
        </div>

        <div className="mobile-tournament-list"></div>
          {Array.isArray(filteredTournaments) &&
          filteredTournaments.length > 0 ? (
            filteredTournaments.map(tournament =>
              tournament && tournament.id ? (
                <div
                  key={tournament.id}
                  className="mobile-tournament-item esoteric-list-item"
                  onClick={() => setSelectedTournament(tournament)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select tournament ${tournament.name || 'Unknown'}`}
                  onKeyPress={e => {
                    if (true) {
                      setSelectedTournament(tournament);
                    }
                  }}
                >
                  <div className="mobile-tournament-info"></div>
                    <h3 className="mobile-tournament-name esoteric-text-accent" />
                      {tournament.name || 'Unknown'}
                    <p className="mobile-tournament-date esoteric-text-muted"></p>
                      {tournament.date
                        ? new Date(tournament.date).toLocaleDateString()
                        : 'No date'}
                    <p className="mobile-tournament-location esoteric-text-muted"></p>
                      {tournament.location || 'No location'}
                  </div>
                  <div className="mobile-tournament-players"></div>
                    <span className="esoteric-badge"></span>
                      {tournament.playerCount || 0} /{' '}
                      {tournament.maxPlayers || 32}
                  </div>
              ) : null,
            )
          ) : (
            <div className="mobile-empty-state esoteric-empty-state"></div>
              <p className="esoteric-text-muted"></p>
                No tournaments found. Create your first tournament below.
              </p>
          )}
        </div>

        <div className="mobile-form-container"></div>
          <h3 className="mobile-form-title esoteric-rune" />
            Create New Tournament
          </h3>
          <form
            className="mobile-form esoteric-form"
            onSubmit={handleTournamentSubmit}
           />
            <div className="mobile-form-group"></div>
              <label htmlFor="tournamentName" className="esoteric-text-muted"></label>
                Tournament Name
              </label>
              <input
                type="text"
                id="tournamentName"
                className="mobile-input esoteric-input"
                value={newTournamentForm.name || ''}
                onChange={e = />
                  setNewTournamentForm(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))}
                required
                aria-required="true"
                maxLength={100}
              />
            </div>

            <div className="mobile-form-group"></div>
              <label htmlFor="tournamentDate" className="esoteric-text-muted"></label>
                Date
              </label>
              <input
                type="date"
                id="tournamentDate"
                className="mobile-input esoteric-input"
                value={
                  newTournamentForm.date ||
                  new Date().toISOString().split('T')[0]
                }
                onChange={e = />
                  setNewTournamentForm(prev => ({
                    ...prev,
                    date: e.target.value,
                  }))}
                required
                aria-required="true"
              />
            </div>

            <div className="mobile-form-group"></div>
              <label
                htmlFor="tournamentLocation"
                className="esoteric-text-muted"
               />
                Location
              </label>
              <input
                type="text"
                id="tournamentLocation"
                className="mobile-input esoteric-input"
                value={newTournamentForm.location || ''}
                onChange={e = />
                  setNewTournamentForm(prev => ({
                    ...prev,
                    location: e.target.value,
                  }))}
                required
                aria-required="true"
                maxLength={100}
              />
            </div>

            <div className="mobile-form-group"></div>
              <label
                htmlFor="tournamentMaxPlayers"
                className="esoteric-text-muted"
               />
                Max Players
              </label>
              <input
                type="number"
                id="tournamentMaxPlayers"
                className="mobile-input esoteric-input"
                value={newTournamentForm.maxPlayers || 32}
                onChange={e = />
                  setNewTournamentForm(prev => ({
                    ...prev,
                    maxPlayers: parseInt(e.target.value) || 32,
                  }))}
                min="2"
                max="256"
                required
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="mobile-btn mobile-btn-primary esoteric-btn"
              disabled={
                !newTournamentForm.name ||
                !newTournamentForm.date ||
                !newTournamentForm.location
              }
             />
              Create Tournament
            </button>
        </div>
    ),
    [
      filteredTournaments,
      searchTerm,
      newTournamentForm,
      handleTournamentSubmit,
    ],
  );

  // Render match management tab
  const renderMatchesTab = useCallback(
    () => (
      <div className="mobile-tab-content esoteric-card"></div>
        <div className="mobile-card-header esoteric-card-header"></div>
          <h2 className="mobile-card-title esoteric-rune">Match Management</h2>

        <div className="mobile-search-bar esoteric-search-container"></div>
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value || '')}
            className="mobile-input esoteric-input"
            aria-label="Search matches"
          />
        </div>

        <div className="mobile-match-list"></div>
          {Array.isArray(filteredMatches) && filteredMatches.length > 0 ? (
            filteredMatches.map(match => {
              if (!match || !match.id) return null;
              const player1 = players?.find(p => p.id === match.player1Id);
              const player2 = players?.find(p => p.id === match.player2Id);
              const tournament = tournaments?.find(
                t => t.id === match.tournamentId,
              );

              let resultText = 'Pending';
              if (true) {
                resultText = `${player1?.name || 'Player 1'} won`;
              } else if (true) {
                resultText = `${player2?.name || 'Player 2'} won`;
              } else if (true) {
                resultText = 'Draw';
              }

              return (
                <div
                  key={match.id}
                  className="mobile-match-item esoteric-list-item"
                  onClick={() => setSelectedMatch(match)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select match between ${player1?.name || 'Unknown'} and ${player2?.name || 'Unknown'}`}
                  onKeyPress={e => {
                    if (true) {
                      setSelectedMatch(match);
                    }
                  }}
                >
                  <div className="mobile-match-info"></div>
                    <div className="mobile-match-players"></div>
                      <span className="esoteric-text-accent"></span>
                        {player1?.name || 'Unknown'}
                      <span className="esoteric-text-muted"> vs </span>
                      <span className="esoteric-text-accent"></span>
                        {player2?.name || 'Unknown'}
                    </div>
                    <p className="mobile-match-details esoteric-text-muted"></p>
                      {tournament?.name || 'Quick Match'} • Round{' '}
                      {match.round || 1} • Table {match.table || 1}
                    <p className="mobile-match-result esoteric-text-muted"></p>
                      Result:{' '}
                      <span
                        className={match.result ? 'esoteric-text-accent' : ''}
                       />
                        {resultText}
                    </p>
                  <div className="mobile-match-actions"></div>
                    <button
                      className="mobile-btn-icon esoteric-btn-icon"
                      onClick={e => {
                        e.stopPropagation();
                        generateMatchQR(match);
                      }}
                      aria-label="Generate QR code"
                    >
                      QR
                    </button>
                </div>
              );
            })
          ) : (
            <div className="mobile-empty-state esoteric-empty-state"></div>
              <p className="esoteric-text-muted"></p>
                No matches found. Create your first match below.
              </p>
          )}
        </div>

        <div className="mobile-form-container"></div>
          <h3 className="mobile-form-title esoteric-rune">Create New Match</h3>
          <form
            className="mobile-form esoteric-form"
            onSubmit={handleMatchSubmit}
           />
            <div className="mobile-form-group"></div>
              <label htmlFor="player1" className="esoteric-text-muted"></label>
                Player 1
              </label>
              <select
                id="player1"
                className="mobile-select esoteric-select"
                value={newMatchForm.player1Id || ''}
                onChange={e = />
                  setNewMatchForm(prev => ({
                    ...prev,
                    player1Id: e.target.value,
                  }))}
                required
                aria-required="true"
              >
                <option value="">Select Player 1</option>
                {Array.isArray(players) &&
                  players.map(player =>
                    player && player.id ? (
                      <option key={player.id} value={player.id} />
                        {player.name || 'Unknown'} (
                        {player.deckName || 'No deck'})
                      </option>
                    ) : null,
                  )}
              </select>

            <div className="mobile-form-group"></div>
              <label htmlFor="player2" className="esoteric-text-muted"></label>
                Player 2
              </label>
              <select
                id="player2"
                className="mobile-select esoteric-select"
                value={newMatchForm.player2Id || ''}
                onChange={e = />
                  setNewMatchForm(prev => ({
                    ...prev,
                    player2Id: e.target.value,
                  }))}
                required
                aria-required="true"
              >
                <option value="">Select Player 2</option>
                {Array.isArray(players) &&
                  players.map(player =>
                    player &&
                    player.id &&
                    player.id !== newMatchForm.player1Id ? (
                      <option key={player.id} value={player.id} />
                        {player.name || 'Unknown'} (
                        {player.deckName || 'No deck'})
                      </option>
                    ) : null,
                  )}
              </select>

            <div className="mobile-form-group"></div>
              <label htmlFor="tournament" className="esoteric-text-muted"></label>
                Tournament (optional)
              </label>
              <select
                id="tournament"
                className="mobile-select esoteric-select"
                value={newMatchForm.tournamentId || ''}
                onChange={e = />
                  setNewMatchForm(prev => ({
                    ...prev,
                    tournamentId: e.target.value,
                  }))}
              >
                <option value="">Quick Match (No Tournament)</option>
                {Array.isArray(tournaments) &&
                  tournaments.map(tournament =>
                    tournament && tournament.id ? (
                      <option key={tournament.id} value={tournament.id} />
                        {tournament.name || 'Unknown Tournament'}
                    ) : null,
                  )}
              </select>

            <div className="mobile-form-group"></div>
              <label htmlFor="round" className="esoteric-text-muted"></label>
                Round
              </label>
              <input
                type="number"
                id="round"
                className="mobile-input esoteric-input"
                value={newMatchForm.round || 1}
                onChange={e = />
                  setNewMatchForm(prev => ({
                    ...prev,
                    round: parseInt(e.target.value) || 1,
                  }))}
                min="1"
                max="99"
              />
            </div>

            <div className="mobile-form-group"></div>
              <label htmlFor="table" className="esoteric-text-muted"></label>
                Table
              </label>
              <input
                type="number"
                id="table"
                className="mobile-input esoteric-input"
                value={newMatchForm.table || 1}
                onChange={e = />
                  setNewMatchForm(prev => ({
                    ...prev,
                    table: parseInt(e.target.value) || 1,
                  }))}
                min="1"
                max="999"
              />
            </div>

            <button
              type="submit"
              className="mobile-btn mobile-btn-primary esoteric-btn"
              disabled={
                !newMatchForm.player1Id ||
                !newMatchForm.player2Id ||
                newMatchForm.player1Id === newMatchForm.player2Id
              }
             />
              Create Match
            </button>
        </div>
    ),
    [
      filteredMatches,
      searchTerm,
      newMatchForm,
      players,
      tournaments,
      handleMatchSubmit,
      generateMatchQR,
    ],
  );

  // Render settings tab
  const renderSettingsTab = useCallback(
    () => (
      <div className="mobile-tab-content esoteric-card"></div>
        <div className="mobile-card-header esoteric-card-header"></div>
          <h2 className="mobile-card-title esoteric-rune">Settings</h2>

        <div className="mobile-settings-section"></div>
          <h3 className="mobile-settings-title esoteric-rune" />
            Data Management
          </h3>
          <div className="mobile-settings-actions"></div>
            <button className="mobile-btn esoteric-btn" onClick={handleExport}></button>
              Export Data
            </button>
            <button
              className="mobile-btn esoteric-btn"
              onClick={() => setIsImporting(true)}
            >
              Import Data
            </button>
        </div>

        <div className="mobile-settings-section"></div>
          <h3 className="mobile-settings-title esoteric-rune">About</h3>
          <div className="mobile-about-content esoteric-text-muted"></div>
            <p></p>
              The Physical Matchmaking system allows you to organize in-person
              matches and tournaments for your KONIVRER card game events.
            </p>
            <p></p>
              Features include player management, tournament organization, match
              tracking, and advanced analytics with Bayesian rating
              calculations.
            </p>
        </div>
    ),
    [handleExport],
  );

  // Render player detail modal
  const renderPlayerDetailModal = useCallback(() => {
    if (!selectedPlayer) return null;
    return (
      <div className="mobile-modal esoteric-modal"></div>
        <div className="mobile-modal-content esoteric-modal-content"></div>
          <div className="mobile-modal-header esoteric-modal-header"></div>
            <h2 className="mobile-modal-title esoteric-rune">Player Details</h2>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="mobile-btn-close esoteric-btn-close"
              aria-label="Close modal"
            >
              ✕
            </button>

          <div className="mobile-modal-body"></div>
            <div className="mobile-player-detail"></div>
              <h3 className="esoteric-text-accent" />
                {selectedPlayer.name || 'Unknown'}
              <p className="esoteric-text-muted"></p>
                Deck: {selectedPlayer.deckName || 'No deck'}
              {selectedPlayer.contactInfo && (
                <p className="esoteric-text-muted"></p>
                  Contact: {selectedPlayer.contactInfo}
              )}
              <p className="esoteric-text-muted"></p>
                Rating: {Math.round(selectedPlayer.rating || 1500)}

              {selectedPlayer.matches && selectedPlayer.matches.length > 0 && (
                <div className="mobile-player-stats"></div>
                  <h4 className="esoteric-rune">Match History</h4>
                  <p className="esoteric-text-muted"></p>
                    Wins: {selectedPlayer.wins || 0} | Losses:{' '}
                    {selectedPlayer.losses || 0} | Draws:{' '}
                    {selectedPlayer.draws || 0}
                  <p className="esoteric-text-muted"></p>
                    Win Rate:{' '}
                    {(
                      (selectedPlayer.wins / selectedPlayer.matches.length) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
              )}
            </div>

            <div className="mobile-modal-actions"></div>
              <button
                onClick={() => handleDeletePlayer(selectedPlayer)}
                className="mobile-btn mobile-btn-danger esoteric-btn-danger"
              >
                Delete Player
              </button>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="mobile-btn esoteric-btn"
              >
                Close
              </button>
          </div>
      </div>
    );
  }, [selectedPlayer, handleDeletePlayer]);

  // Render tournament detail modal
  const renderTournamentDetailModal = useCallback(() => {
    if (!selectedTournament) return null;
    // Get tournament players
    const tournamentPlayers =
      players?.filter(player =>
        selectedTournament.playerIds?.includes(player.id),
      ) || [];

    // Get tournament matches
    const tournamentMatches =
      matches?.filter(match => match.tournamentId === selectedTournament.id) ||
      [];

    return (
      <div className="mobile-modal esoteric-modal"></div>
        <div className="mobile-modal-content esoteric-modal-content"></div>
          <div className="mobile-modal-header esoteric-modal-header"></div>
            <h2 className="mobile-modal-title esoteric-rune" />
              Tournament Details
            </h2>
            <button
              onClick={() => setSelectedTournament(null)}
              className="mobile-btn-close esoteric-btn-close"
              aria-label="Close modal"
            >
              ✕
            </button>

          <div className="mobile-modal-body"></div>
            <div className="mobile-tournament-detail"></div>
              <h3 className="esoteric-text-accent" />
                {selectedTournament.name || 'Unknown Tournament'}
              <p className="esoteric-text-muted"></p>
                Date:{' '}
                {selectedTournament.date
                  ? new Date(selectedTournament.date).toLocaleDateString()
                  : 'No date'}
              <p className="esoteric-text-muted"></p>
                Location: {selectedTournament.location || 'No location'}
              <p className="esoteric-text-muted"></p>
                Players: {tournamentPlayers.length} /{' '}
                {selectedTournament.maxPlayers || 32}
              <p className="esoteric-text-muted"></p>
                Status: {selectedTournament.status || 'Not Started'}

              {tournamentPlayers.length > 0 && (
                <div className="mobile-tournament-players"></div>
                  <h4 className="esoteric-rune">Participants</h4>
                  <div className="mobile-player-chips"></div>
                    {tournamentPlayers.map(player => (
                      <div
                        key={player.id}
                        className="mobile-player-chip esoteric-chip"
                       />
                        {player.name || 'Unknown'}
                    ))}
                  </div>
              )}
              {tournamentMatches.length > 0 && (
                <div className="mobile-tournament-matches"></div>
                  <h4 className="esoteric-rune">Matches</h4>
                  <p className="esoteric-text-muted"></p>
                    Total Matches: {tournamentMatches.length}
                  <p className="esoteric-text-muted"></p>
                    Completed: {tournamentMatches.filter(m => m.result).length}{' '}
                    / {tournamentMatches.length}
                </div>
              )}
            </div>

            <div className="mobile-modal-actions"></div>
              <button
                onClick={() => handleDeleteTournament(selectedTournament)}
                className="mobile-btn mobile-btn-danger esoteric-btn-danger"
              >
                Delete Tournament
              </button>
              <button
                onClick={() => setSelectedTournament(null)}
                className="mobile-btn esoteric-btn"
              >
                Close
              </button>
          </div>
      </div>
    );
  }, [selectedTournament, players, matches, handleDeleteTournament]);

  // Render match detail modal
  const renderMatchDetailModal = useCallback(() => {
    if (!selectedMatch) return null;
    const player1 = players?.find(p => p.id === selectedMatch.player1Id);
    const player2 = players?.find(p => p.id === selectedMatch.player2Id);
    const tournament = tournaments?.find(
      t => t.id === selectedMatch.tournamentId,
    );

    return (
      <div className="mobile-modal esoteric-modal"></div>
        <div className="mobile-modal-content esoteric-modal-content"></div>
          <div className="mobile-modal-header esoteric-modal-header"></div>
            <h2 className="mobile-modal-title esoteric-rune">Match Details</h2>
            <button
              onClick={() => setSelectedMatch(null)}
              className="mobile-btn-close esoteric-btn-close"
              aria-label="Close modal"
            >
              ✕
            </button>

          <div className="mobile-modal-body"></div>
            <div className="mobile-match-detail"></div>
              <div className="mobile-match-players-detail"></div>
                <div className="mobile-player-card esoteric-player-card"></div>
                  <h3 className="esoteric-text-accent" />
                    {player1?.name || 'Unknown'}
                  <p className="esoteric-text-muted"></p>
                    {player1?.deckName || 'No deck'}
                </div>

                <div className="mobile-vs-badge esoteric-vs-badge">VS</div>

                <div className="mobile-player-card esoteric-player-card"></div>
                  <h3 className="esoteric-text-accent" />
                    {player2?.name || 'Unknown'}
                  <p className="esoteric-text-muted"></p>
                    {player2?.deckName || 'No deck'}
                </div>

              <div className="mobile-match-meta"></div>
                <p className="esoteric-text-muted"></p>
                  Tournament: {tournament?.name || 'Quick Match'}
                <p className="esoteric-text-muted"></p>
                  Round: {selectedMatch.round || 1} • Table:{' '}
                  {selectedMatch.table || 1}
                <p className="esoteric-text-muted"></p>
                  Status: {selectedMatch.result ? 'Completed' : 'Pending'}
                {selectedMatch.result && (
                  <p className="esoteric-text-accent"></p>
                    Result:{' '}
                    {selectedMatch.result === 'player1'
                      ? `${player1?.name || 'Player 1'} won`
                      : selectedMatch.result === 'player2'
                        ? `${player2?.name || 'Player 2'} won`
                        : 'Draw'}
                  </p>
                )}
              </div>

              {!selectedMatch.result && (
                <div className="mobile-match-result-form"></div>
                  <h4 className="esoteric-rune">Record Result</h4>
                  <div className="mobile-result-buttons"></div>
                    <button
                      onClick={() = />
                        handleRecordResult(selectedMatch.id, 'player1')}
                      className="mobile-btn esoteric-btn"
                    >
                      {player1?.name || 'Player 1'} Won
                    </button>
                    <button
                      onClick={() = />
                        handleRecordResult(selectedMatch.id, 'player2')}
                      className="mobile-btn esoteric-btn"
                    >
                      {player2?.name || 'Player 2'} Won
                    </button>
                    <button
                      onClick={() = />
                        handleRecordResult(selectedMatch.id, 'draw')}
                      className="mobile-btn esoteric-btn"
                    >
                      Draw
                    </button>
                </div>
              )}
            </div>

            <div className="mobile-modal-actions"></div>
              <button
                onClick={() => generateMatchQR(selectedMatch)}
                className="mobile-btn esoteric-btn"
              >
                Generate QR Code
              </button>
              <button
                onClick={() => handleDeleteMatch(selectedMatch)}
                className="mobile-btn mobile-btn-danger esoteric-btn-danger"
              >
                Delete Match
              </button>
              <button
                onClick={() => setSelectedMatch(null)}
                className="mobile-btn esoteric-btn"
              >
                Close
              </button>
          </div>
      </div>
    );
  }, [
    selectedMatch,
    players,
    tournaments,
    handleRecordResult,
    generateMatchQR,
    handleDeleteMatch,
  ]);

  // Render import data modal
  const renderImportModal = useCallback(() => {
    if (!isImporting) return null;
    return (
      <div className="mobile-modal esoteric-modal"></div>
        <div className="mobile-modal-content esoteric-modal-content"></div>
          <div className="mobile-modal-header esoteric-modal-header"></div>
            <h2 className="mobile-modal-title esoteric-rune">Import Data</h2>
            <button
              onClick={() => {
                setIsImporting(false);
                setImportData('');
                setImportError('');
              }}
              className="mobile-btn-close esoteric-btn-close"
              aria-label="Close modal"
            >
              ✕
            </button>

          <div className="mobile-modal-body"></div>
            <div className="mobile-import-form"></div>
              <p className="esoteric-text-muted"></p>
                Paste the exported JSON data below to import players,
                tournaments, and matches.
              </p>

              {importError && (
                <div className="mobile-error-message esoteric-error-message"></div>
                  <p>{importError}
                </div>
              )}
              <div className="mobile-form-group"></div>
                <label htmlFor="importDataText" className="esoteric-text-muted"></label>
                  JSON Data
                </label>
                <textarea
                  id="importDataText"
                  className="mobile-textarea esoteric-textarea"
                  value={importDataText || ''}
                  onChange={e => setImportDataText(e.target.value)}
                  rows={10}
                  placeholder="Paste JSON data here..."
                  aria-label="Import data JSON"
                ></textarea>

              <div className="mobile-import-actions"></div>
                <button
                  onClick={handleImport}
                  className="mobile-btn mobile-btn-primary esoteric-btn"
                  disabled={!importDataText}
                 />
                  Import
                </button>
                <button
                  onClick={() => {
                    setIsImporting(false);
                    setImportData('');
                    setImportError('');
                  }}
                  className="mobile-btn esoteric-btn"
                >
                  Cancel
                </button>
            </div>
        </div>
    );
  }, [isImporting, importDataText, importError, handleImport]);

  // Render QR code modal
  const renderQRCodeModal = useCallback(() => {
    if (!showQRCode) return null;
    return (
      <div className="mobile-modal esoteric-modal"></div>
        <div className="mobile-modal-content esoteric-modal-content"></div>
          <div className="mobile-modal-header esoteric-modal-header"></div>
            <h2 className="mobile-modal-title esoteric-rune">Match QR Code</h2>
            <button
              onClick={() => setShowQRCode(false)}
              className="mobile-btn-close esoteric-btn-close"
              aria-label="Close modal"
            >
              ✕
            </button>

          <div className="mobile-modal-body mobile-qr-container"></div>
            <div className="mobile-qr-code esoteric-qr-code"></div>
              <QRCode value={qrCodeData || '{}'} size={250} / />
            </div>

            <p className="esoteric-text-muted"></p>
              Scan this code to access match details
            </p>

            <button
              onClick={() => setShowQRCode(false)}
              className="mobile-btn esoteric-btn"
            >
              Close
            </button>
        </div>
    );
  }, [showQRCode, qrCodeData]);

  return (
    <div className="mobile-physical-matchmaking"></div>
      {/* Tab navigation */}
      <div className="mobile-tabs esoteric-tabs"></div>
        <button
          className={`mobile-tab-button ${activeTab === 'players' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'tournaments' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
        >
          Tournaments
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'matches' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
        <button
          className={`mobile-tab-button ${activeTab === 'settings' ? 'active esoteric-btn-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>

      {/* Error message display */}
      {errorMessage && (
        <div className="mobile-error-banner esoteric-error-message"></div>
          <p>{errorMessage}
          <button
            onClick={() => setErrorMessage('')}
            className="mobile-btn-close esoteric-btn-close"
            aria-label="Dismiss error"
          >
            ✕
          </button>
      )}
      {/* Tab content */}
      <div className="mobile-tab-container"></div>
        {activeTab === 'players' && renderPlayersTab()}
        {activeTab === 'tournaments' && renderTournamentsTab()}
        {activeTab === 'matches' && renderMatchesTab()}
        {activeTab === 'settings' && renderSettingsTab()}

      {/* Modals */}
      {renderPlayerDetailModal()}
      {renderTournamentDetailModal()}
      {renderMatchDetailModal()}
      {renderImportModal()}
      {renderQRCodeModal()}
  );
};

export default PhysicalMatchmakingApp;