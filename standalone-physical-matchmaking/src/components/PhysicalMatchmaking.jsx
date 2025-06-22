import React, { useState } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import QRCodeGenerator from './QRCodeGenerator';
import AncientThemeQRCodeGenerator from './AncientThemeQRCodeGenerator';

const PhysicalMatchmaking = () => {
  const { players, tournaments, matches } = usePhysicalMatchmaking();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showQRData, setShowQRData] = useState(false);
  const [useAncientTheme, setUseAncientTheme] = useState(true);

  return (
    <div className="physical-matchmaking">
      <h2>Physical Matchmaking</h2>
      
      <div className="matchmaking-grid">
        <div className="matches-section">
          <h3>Physical Matches</h3>
          <p>Total matches: {matches.length}</p>
          
          <div className="match-selector">
            <label>Select a match to generate QR code:</label>
            <select 
              value={selectedMatch || ''}
              onChange={(e) => setSelectedMatch(e.target.value)}
            >
              <option value="">-- Select a match --</option>
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.player1?.name || 'Player 1'} vs {match.player2?.name || 'Player 2'}
                </option>
              ))}
            </select>
          </div>
          
          {selectedMatch && (
            <div className="qr-display">
              {useAncientTheme ? (
                <AncientThemeQRCodeGenerator 
                  matchId={selectedMatch} 
                  includeData={showQRData}
                />
              ) : (
                <QRCodeGenerator 
                  matchId={selectedMatch} 
                  includeData={showQRData}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="tournaments-section">
          <h3>Tournaments</h3>
          <p>Total tournaments: {tournaments.length}</p>
          
          <div className="tournament-selector">
            <label>Select a tournament to generate QR code:</label>
            <select 
              value={selectedTournament || ''}
              onChange={(e) => setSelectedTournament(e.target.value)}
            >
              <option value="">-- Select a tournament --</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name} ({tournament.format})
                </option>
              ))}
            </select>
          </div>
          
          {selectedTournament && (
            <div className="qr-display">
              {useAncientTheme ? (
                <AncientThemeQRCodeGenerator 
                  tournamentId={selectedTournament}
                  includeData={showQRData}
                />
              ) : (
                <QRCodeGenerator 
                  tournamentId={selectedTournament}
                  includeData={showQRData}
                />
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="debug-options">
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0' }}>
          <label>
            <input 
              type="checkbox" 
              checked={showQRData} 
              onChange={() => setShowQRData(!showQRData)}
            />
            Show QR code data (for debugging)
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={useAncientTheme} 
              onChange={() => setUseAncientTheme(!useAncientTheme)}
            />
            Use Ancient-Esoteric Theme
          </label>
        </div>
      </div>
      
      <div className="player-stats">
        <h3>Player Statistics</h3>
        <p>Total players: {players.length}</p>
        <div className="player-list">
          {players.map(player => (
            <div key={player.id} className="player-card">
              <p className="player-name">{player.name}</p>
              <p className="player-rating">Rating: {player.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicalMatchmaking;