/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import QRCodeGenerator from './QRCodeGenerator';

const EnhancedPhysicalMatchmaking = () => {
  const { players, tournaments, matches } = usePhysicalMatchmaking();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showQRData, setShowQRData] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced Physical Matchmaking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Physical Matches</h2>
          <p className="mb-2">Total matches: {matches.length}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select a match to generate QR code:</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedMatch || ''}
              onChange={(e) => setSelectedMatch(e.target.value)}
            >
              <option value="">-- Select a match --</option>
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  Match #{match.id.substring(0, 6)} - {match.player1?.name || 'Player 1'} vs {match.player2?.name || 'Player 2'}
                </option>
              ))}
            </select>
          </div>
          
          {selectedMatch && (
            <div className="mt-4">
              <QRCodeGenerator 
                matchId={selectedMatch} 
                includeData={showQRData}
              />
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Tournaments</h2>
          <p className="mb-2">Total tournaments: {tournaments.length}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select a tournament to generate QR code:</label>
            <select 
              className="w-full p-2 border rounded"
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
            <div className="mt-4">
              <QRCodeGenerator 
                tournamentId={selectedTournament}
                includeData={showQRData}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={showQRData} 
            onChange={() => setShowQRData(!showQRData)}
            className="mr-2"
          />
          <span>Show QR code data (for debugging)</span>
        </label>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Player Statistics</h2>
        <p className="mb-2">Total players: {players.length}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {players.slice(0, 6).map(player => (
            <div key={player.id} className="p-3 bg-white rounded shadow-sm">
              <p className="font-medium">{player.name}</p>
              <p className="text-sm">Rating: {player.rating?.toFixed(0) || 'N/A'}</p>
            </div>
          ))}
        </div>
        {players.length > 6 && (
          <p className="mt-2 text-sm text-gray-500">And {players.length - 6} more players...</p>
        )}
      </div>
    </div>
  );
};

export default EnhancedPhysicalMatchmaking;
