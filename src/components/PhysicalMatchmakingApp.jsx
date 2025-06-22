import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PhysicalMatchmakingContext } from '../contexts/PhysicalMatchmakingContext';
import QRCode from 'react-qr-code';
import '../styles/mobile-first.css';
import '../styles/esoteric-theme.css';

/**
 * Comprehensive Physical Matchmaking Component
 * Provides functionality for organizing physical TCG matches and tournaments
 */
const PhysicalMatchmakingApp = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    players, 
    tournaments, 
    matches,
    addPlayer, 
    removePlayer, 
    updatePlayer,
    createTournament,
    updateTournament,
    deleteTournament,
    createMatch,
    updateMatchResult,
    deleteMatch,
    exportData,
    importData
  } = useContext(PhysicalMatchmakingContext);

  // Local state
  const [activeTab, setActiveTab] = useState('players');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Filter players based on search term
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.deckName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle player form submission
  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    addPlayer(newPlayerForm);
    setNewPlayerForm({
      name: '',
      deckName: '',
      contactInfo: '',
      rating: 1500,
    });
  };

  // Handle tournament form submission
  const handleTournamentSubmit = (e) => {
    e.preventDefault();
    createTournament(newTournamentForm);
    setNewTournamentForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      format: 'Standard',
      maxPlayers: 32,
    });
  };

  // Handle match form submission
  const handleMatchSubmit = (e) => {
    e.preventDefault();
    createMatch(newMatchForm);
    setNewMatchForm({
      player1Id: '',
      player2Id: '',
      tournamentId: '',
      round: 1,
      table: 1,
    });
  };

  // Generate QR code for a match
  const generateMatchQR = (match) => {
    const matchData = {
      id: match.id,
      player1: players.find(p => p.id === match.player1Id)?.name || 'Unknown',
      player2: players.find(p => p.id === match.player2Id)?.name || 'Unknown',
      tournament: tournaments.find(t => t.id === match.tournamentId)?.name || 'Quick Match',
      round: match.round,
      table: match.table,
      timestamp: new Date().toISOString(),
    };
    
    setQRCodeData(JSON.stringify(matchData));
    setShowQRCode(true);
  };

  // Handle data export
  const handleExport = () => {
    const exportedData = exportData();
    const dataStr = JSON.stringify(exportedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `konivrer-matchmaking-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle data import
  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      importData(data);
      setIsImporting(false);
      setImportData('');
      setImportError('');
    } catch (error) {
      setImportError('Invalid JSON data. Please check the format and try again.');
    }
  };

  // Render player management tab
  const renderPlayersTab = () => (
    <div className="mobile-tab-content esoteric-card">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Player Management</h2>
      </div>
      
      <div className="mobile-search-bar esoteric-search-container">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mobile-input esoteric-input"
        />
      </div>
      
      <div className="mobile-player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <div 
              key={player.id} 
              className="mobile-player-item esoteric-list-item"
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="mobile-player-info">
                <h3 className="mobile-player-name esoteric-text-accent">{player.name}</h3>
                <p className="mobile-player-deck esoteric-text-muted">{player.deckName}</p>
              </div>
              <div className="mobile-player-rating">
                <span className="esoteric-badge">{player.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-empty-state esoteric-empty-state">
            <p>No players found. Add your first player below.</p>
          </div>
        )}
      </div>
      
      <div className="mobile-form-container">
        <h3 className="mobile-form-title esoteric-section-title">Add New Player</h3>
        <form onSubmit={handlePlayerSubmit} className="mobile-form esoteric-form">
          <div className="mobile-form-group">
            <label className="mobile-label">Player Name</label>
            <input
              type="text"
              value={newPlayerForm.name}
              onChange={(e) => setNewPlayerForm({...newPlayerForm, name: e.target.value})}
              className="mobile-input esoteric-input"
              placeholder="Enter player name"
              required
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Deck Name</label>
            <input
              type="text"
              value={newPlayerForm.deckName}
              onChange={(e) => setNewPlayerForm({...newPlayerForm, deckName: e.target.value})}
              className="mobile-input esoteric-input"
              placeholder="Enter deck name"
              required
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Contact Info (optional)</label>
            <input
              type="text"
              value={newPlayerForm.contactInfo}
              onChange={(e) => setNewPlayerForm({...newPlayerForm, contactInfo: e.target.value})}
              className="mobile-input esoteric-input"
              placeholder="Email or phone number"
            />
          </div>
          
          <button type="submit" className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary">
            Add Player
          </button>
        </form>
      </div>
      
      {selectedPlayer && (
        <div className="mobile-modal esoteric-modal">
          <div className="mobile-modal-content esoteric-modal-content">
            <div className="mobile-modal-header esoteric-modal-header">
              <h2 className="mobile-modal-title esoteric-rune">Player Details</h2>
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="mobile-btn-close esoteric-btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-modal-body">
              <div className="mobile-player-detail">
                <h3 className="esoteric-text-accent">{selectedPlayer.name}</h3>
                <p className="esoteric-text-muted">Deck: {selectedPlayer.deckName}</p>
                <p className="esoteric-text-muted">Rating: {selectedPlayer.rating}</p>
                {selectedPlayer.contactInfo && (
                  <p className="esoteric-text-muted">Contact: {selectedPlayer.contactInfo}</p>
                )}
              </div>
              
              <div className="mobile-modal-actions">
                <button 
                  onClick={() => {
                    // Create a quick match with this player
                    setActiveTab('matches');
                    setNewMatchForm({
                      ...newMatchForm,
                      player1Id: selectedPlayer.id
                    });
                    setSelectedPlayer(null);
                  }}
                  className="mobile-btn esoteric-btn"
                >
                  Create Match
                </button>
                
                <button 
                  onClick={() => {
                    removePlayer(selectedPlayer.id);
                    setSelectedPlayer(null);
                  }}
                  className="mobile-btn mobile-btn-danger esoteric-btn esoteric-btn-danger"
                >
                  Remove Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render tournament management tab
  const renderTournamentsTab = () => (
    <div className="mobile-tab-content esoteric-card">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Tournament Management</h2>
      </div>
      
      <div className="mobile-tournament-list">
        {tournaments.length > 0 ? (
          tournaments.map(tournament => (
            <div 
              key={tournament.id} 
              className="mobile-tournament-item esoteric-list-item"
              onClick={() => setSelectedTournament(tournament)}
            >
              <div className="mobile-tournament-info">
                <h3 className="mobile-tournament-name esoteric-text-accent">{tournament.name}</h3>
                <p className="mobile-tournament-date esoteric-text-muted">
                  {new Date(tournament.date).toLocaleDateString()}
                </p>
                <p className="mobile-tournament-location esoteric-text-muted">{tournament.location}</p>
              </div>
              <div className="mobile-tournament-players">
                <span className="esoteric-badge">
                  {tournament.players?.length || 0}/{tournament.maxPlayers}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="mobile-empty-state esoteric-empty-state">
            <p>No tournaments found. Create your first tournament below.</p>
          </div>
        )}
      </div>
      
      <div className="mobile-form-container">
        <h3 className="mobile-form-title esoteric-section-title">Create New Tournament</h3>
        <form onSubmit={handleTournamentSubmit} className="mobile-form esoteric-form">
          <div className="mobile-form-group">
            <label className="mobile-label">Tournament Name</label>
            <input
              type="text"
              value={newTournamentForm.name}
              onChange={(e) => setNewTournamentForm({...newTournamentForm, name: e.target.value})}
              className="mobile-input esoteric-input"
              placeholder="Enter tournament name"
              required
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Date</label>
            <input
              type="date"
              value={newTournamentForm.date}
              onChange={(e) => setNewTournamentForm({...newTournamentForm, date: e.target.value})}
              className="mobile-input esoteric-input"
              required
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Location</label>
            <input
              type="text"
              value={newTournamentForm.location}
              onChange={(e) => setNewTournamentForm({...newTournamentForm, location: e.target.value})}
              className="mobile-input esoteric-input"
              placeholder="Enter location"
              required
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Max Players</label>
            <input
              type="number"
              value={newTournamentForm.maxPlayers}
              onChange={(e) => setNewTournamentForm({...newTournamentForm, maxPlayers: parseInt(e.target.value)})}
              className="mobile-input esoteric-input"
              min="2"
              max="128"
              required
            />
          </div>
          
          <button type="submit" className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary">
            Create Tournament
          </button>
        </form>
      </div>
      
      {selectedTournament && (
        <div className="mobile-modal esoteric-modal">
          <div className="mobile-modal-content esoteric-modal-content">
            <div className="mobile-modal-header esoteric-modal-header">
              <h2 className="mobile-modal-title esoteric-rune">Tournament Details</h2>
              <button 
                onClick={() => setSelectedTournament(null)}
                className="mobile-btn-close esoteric-btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-modal-body">
              <div className="mobile-tournament-detail">
                <h3 className="esoteric-text-accent">{selectedTournament.name}</h3>
                <p className="esoteric-text-muted">
                  Date: {new Date(selectedTournament.date).toLocaleDateString()}
                </p>
                <p className="esoteric-text-muted">Location: {selectedTournament.location}</p>
                <p className="esoteric-text-muted">
                  Players: {selectedTournament.players?.length || 0}/{selectedTournament.maxPlayers}
                </p>
              </div>
              
              <div className="mobile-tournament-players">
                <h4 className="esoteric-section-title">Registered Players</h4>
                {selectedTournament.players && selectedTournament.players.length > 0 ? (
                  <div className="mobile-player-chips">
                    {selectedTournament.players.map(playerId => {
                      const player = players.find(p => p.id === playerId);
                      return player ? (
                        <div key={playerId} className="mobile-player-chip esoteric-chip">
                          {player.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="esoteric-text-muted">No players registered yet</p>
                )}
              </div>
              
              <div className="mobile-modal-actions">
                <button 
                  onClick={() => {
                    // Create matches for this tournament
                    setActiveTab('matches');
                    setNewMatchForm({
                      ...newMatchForm,
                      tournamentId: selectedTournament.id
                    });
                    setSelectedTournament(null);
                  }}
                  className="mobile-btn esoteric-btn"
                >
                  Create Matches
                </button>
                
                <button 
                  onClick={() => {
                    deleteTournament(selectedTournament.id);
                    setSelectedTournament(null);
                  }}
                  className="mobile-btn mobile-btn-danger esoteric-btn esoteric-btn-danger"
                >
                  Delete Tournament
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render match management tab
  const renderMatchesTab = () => (
    <div className="mobile-tab-content esoteric-card">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Match Management</h2>
      </div>
      
      <div className="mobile-match-list">
        {matches.length > 0 ? (
          matches.map(match => {
            const player1 = players.find(p => p.id === match.player1Id);
            const player2 = players.find(p => p.id === match.player2Id);
            const tournament = tournaments.find(t => t.id === match.tournamentId);
            
            return (
              <div 
                key={match.id} 
                className="mobile-match-item esoteric-list-item"
                onClick={() => setSelectedMatch(match)}
              >
                <div className="mobile-match-info">
                  <div className="mobile-match-players">
                    <span className="esoteric-text-accent">{player1?.name || 'Unknown'}</span>
                    <span className="esoteric-text-muted">vs</span>
                    <span className="esoteric-text-accent">{player2?.name || 'Unknown'}</span>
                  </div>
                  
                  <p className="mobile-match-details esoteric-text-muted">
                    {tournament ? `${tournament.name} - Round ${match.round}` : 'Quick Match'}
                  </p>
                  
                  {match.result && (
                    <div className="mobile-match-result">
                      <span className={`esoteric-badge ${match.result === 'draw' ? 'esoteric-badge-neutral' : ''}`}>
                        {match.result === 'player1' ? `${player1?.name} won` : 
                         match.result === 'player2' ? `${player2?.name} won` : 'Draw'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mobile-match-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateMatchQR(match);
                    }}
                    className="mobile-btn-icon esoteric-btn-icon"
                  >
                    QR
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mobile-empty-state esoteric-empty-state">
            <p>No matches found. Create your first match below.</p>
          </div>
        )}
      </div>
      
      <div className="mobile-form-container">
        <h3 className="mobile-form-title esoteric-section-title">Create New Match</h3>
        <form onSubmit={handleMatchSubmit} className="mobile-form esoteric-form">
          <div className="mobile-form-group">
            <label className="mobile-label">Player 1</label>
            <select
              value={newMatchForm.player1Id}
              onChange={(e) => setNewMatchForm({...newMatchForm, player1Id: e.target.value})}
              className="mobile-select esoteric-select"
              required
            >
              <option value="">Select Player 1</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.deckName})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Player 2</label>
            <select
              value={newMatchForm.player2Id}
              onChange={(e) => setNewMatchForm({...newMatchForm, player2Id: e.target.value})}
              className="mobile-select esoteric-select"
              required
            >
              <option value="">Select Player 2</option>
              {players
                .filter(player => player.id !== newMatchForm.player1Id)
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.deckName})
                  </option>
                ))
              }
            </select>
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-label">Tournament (optional)</label>
            <select
              value={newMatchForm.tournamentId}
              onChange={(e) => setNewMatchForm({...newMatchForm, tournamentId: e.target.value})}
              className="mobile-select esoteric-select"
            >
              <option value="">Quick Match (No Tournament)</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
          
          {newMatchForm.tournamentId && (
            <>
              <div className="mobile-form-group">
                <label className="mobile-label">Round</label>
                <input
                  type="number"
                  value={newMatchForm.round}
                  onChange={(e) => setNewMatchForm({...newMatchForm, round: parseInt(e.target.value)})}
                  className="mobile-input esoteric-input"
                  min="1"
                  required
                />
              </div>
              
              <div className="mobile-form-group">
                <label className="mobile-label">Table Number</label>
                <input
                  type="number"
                  value={newMatchForm.table}
                  onChange={(e) => setNewMatchForm({...newMatchForm, table: parseInt(e.target.value)})}
                  className="mobile-input esoteric-input"
                  min="1"
                  required
                />
              </div>
            </>
          )}
          
          <button type="submit" className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary">
            Create Match
          </button>
        </form>
      </div>
      
      {selectedMatch && (
        <div className="mobile-modal esoteric-modal">
          <div className="mobile-modal-content esoteric-modal-content">
            <div className="mobile-modal-header esoteric-modal-header">
              <h2 className="mobile-modal-title esoteric-rune">Match Details</h2>
              <button 
                onClick={() => setSelectedMatch(null)}
                className="mobile-btn-close esoteric-btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-modal-body">
              <div className="mobile-match-detail">
                <div className="mobile-match-players-detail">
                  <div className="mobile-player-card esoteric-player-card">
                    <h3 className="esoteric-text-accent">
                      {players.find(p => p.id === selectedMatch.player1Id)?.name || 'Unknown'}
                    </h3>
                    <p className="esoteric-text-muted">
                      {players.find(p => p.id === selectedMatch.player1Id)?.deckName || 'Unknown Deck'}
                    </p>
                  </div>
                  
                  <div className="mobile-vs-badge esoteric-vs-badge">VS</div>
                  
                  <div className="mobile-player-card esoteric-player-card">
                    <h3 className="esoteric-text-accent">
                      {players.find(p => p.id === selectedMatch.player2Id)?.name || 'Unknown'}
                    </h3>
                    <p className="esoteric-text-muted">
                      {players.find(p => p.id === selectedMatch.player2Id)?.deckName || 'Unknown Deck'}
                    </p>
                  </div>
                </div>
                
                <div className="mobile-match-meta">
                  {selectedMatch.tournamentId ? (
                    <p className="esoteric-text-muted">
                      Tournament: {tournaments.find(t => t.id === selectedMatch.tournamentId)?.name || 'Unknown'}
                    </p>
                  ) : (
                    <p className="esoteric-text-muted">Quick Match</p>
                  )}
                  
                  {selectedMatch.tournamentId && (
                    <>
                      <p className="esoteric-text-muted">Round: {selectedMatch.round}</p>
                      <p className="esoteric-text-muted">Table: {selectedMatch.table}</p>
                    </>
                  )}
                </div>
                
                <div className="mobile-match-result-form">
                  <h4 className="esoteric-section-title">Record Result</h4>
                  
                  <div className="mobile-result-buttons">
                    <button
                      onClick={() => {
                        updateMatchResult(selectedMatch.id, 'player1');
                        setSelectedMatch({...selectedMatch, result: 'player1'});
                      }}
                      className={`mobile-btn esoteric-btn ${selectedMatch.result === 'player1' ? 'esoteric-btn-active' : ''}`}
                    >
                      {players.find(p => p.id === selectedMatch.player1Id)?.name || 'Player 1'} Won
                    </button>
                    
                    <button
                      onClick={() => {
                        updateMatchResult(selectedMatch.id, 'draw');
                        setSelectedMatch({...selectedMatch, result: 'draw'});
                      }}
                      className={`mobile-btn esoteric-btn ${selectedMatch.result === 'draw' ? 'esoteric-btn-active' : ''}`}
                    >
                      Draw
                    </button>
                    
                    <button
                      onClick={() => {
                        updateMatchResult(selectedMatch.id, 'player2');
                        setSelectedMatch({...selectedMatch, result: 'player2'});
                      }}
                      className={`mobile-btn esoteric-btn ${selectedMatch.result === 'player2' ? 'esoteric-btn-active' : ''}`}
                    >
                      {players.find(p => p.id === selectedMatch.player2Id)?.name || 'Player 2'} Won
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mobile-modal-actions">
                <button 
                  onClick={() => generateMatchQR(selectedMatch)}
                  className="mobile-btn esoteric-btn"
                >
                  Generate QR Code
                </button>
                
                <button 
                  onClick={() => {
                    deleteMatch(selectedMatch.id);
                    setSelectedMatch(null);
                  }}
                  className="mobile-btn mobile-btn-danger esoteric-btn esoteric-btn-danger"
                >
                  Delete Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render settings tab
  const renderSettingsTab = () => (
    <div className="mobile-tab-content esoteric-card">
      <div className="mobile-card-header esoteric-card-header">
        <h2 className="mobile-card-title esoteric-rune">Settings</h2>
      </div>
      
      <div className="mobile-settings-section">
        <h3 className="mobile-settings-title esoteric-section-title">Data Management</h3>
        
        <div className="mobile-settings-actions">
          <button 
            onClick={handleExport}
            className="mobile-btn esoteric-btn"
          >
            Export Data
          </button>
          
          <button 
            onClick={() => setIsImporting(true)}
            className="mobile-btn esoteric-btn"
          >
            Import Data
          </button>
        </div>
        
        {isImporting && (
          <div className="mobile-import-form">
            <h4 className="esoteric-text-accent">Import Data</h4>
            <p className="esoteric-text-muted">Paste your exported JSON data below:</p>
            
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="mobile-textarea esoteric-textarea"
              rows="10"
              placeholder="Paste JSON data here..."
            ></textarea>
            
            {importError && (
              <p className="mobile-error esoteric-text-error">{importError}</p>
            )}
            
            <div className="mobile-import-actions">
              <button 
                onClick={handleImport}
                className="mobile-btn mobile-btn-primary esoteric-btn esoteric-btn-primary"
              >
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
        )}
      </div>
      
      <div className="mobile-settings-section">
        <h3 className="mobile-settings-title esoteric-section-title">About</h3>
        <div className="mobile-about-content">
          <p className="esoteric-text-muted">
            KONIVRER Physical Matchmaking App v1.0
          </p>
          <p className="esoteric-text-muted">
            This tool helps you organize physical card game matches and tournaments.
          </p>
          <p className="esoteric-text-muted">
            Created by the KONIVRER development team.
          </p>
        </div>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="mobile-container esoteric-bg">
      <div className="mobile-physical-matchmaking">
        <div className="mobile-tabs esoteric-tabs">
          <button
            onClick={() => setActiveTab('players')}
            className={`mobile-tab ${activeTab === 'players' ? 'active esoteric-tab-active' : ''}`}
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`mobile-tab ${activeTab === 'tournaments' ? 'active esoteric-tab-active' : ''}`}
          >
            Tournaments
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`mobile-tab ${activeTab === 'matches' ? 'active esoteric-tab-active' : ''}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`mobile-tab ${activeTab === 'settings' ? 'active esoteric-tab-active' : ''}`}
          >
            Settings
          </button>
        </div>
        
        {activeTab === 'players' && renderPlayersTab()}
        {activeTab === 'tournaments' && renderTournamentsTab()}
        {activeTab === 'matches' && renderMatchesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
      
      {showQRCode && (
        <div className="mobile-modal esoteric-modal">
          <div className="mobile-modal-content esoteric-modal-content">
            <div className="mobile-modal-header esoteric-modal-header">
              <h2 className="mobile-modal-title esoteric-rune">Match QR Code</h2>
              <button 
                onClick={() => setShowQRCode(false)}
                className="mobile-btn-close esoteric-btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-modal-body mobile-qr-container">
              <div className="mobile-qr-code esoteric-qr-code">
                <QRCode value={qrCodeData} size={250} />
              </div>
              
              <p className="esoteric-text-muted">
                Scan this code to access match details
              </p>
              
              <button 
                onClick={() => setShowQRCode(false)}
                className="mobile-btn esoteric-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalMatchmakingApp;