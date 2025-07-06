/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Zap, Settings, X, Wifi, WifiOff, Plus, Edit, Trash2, QrCode, Share2  } from 'lucide-react';

const PhysicalMatchmaking = (): any => {
    const [activeTab, setActiveTab] = useState(false)
  const [players, setPlayers] = useState(false)
  const [tournaments, setTournaments] = useState(false)
  const [currentMatches, setCurrentMatches] = useState(false)
  const [playerProfile, setPlayerProfile] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  useEffect(() => {
    loadData() {
  }

    const handleOnline = (handleOnline: any) => setIsOfflineMode() {
    const handleOffline = (handleOffline: any) => setIsOfflineMode() {
  }

    window.addEventListener() {
    window.addEventListener() {
  }

    return () => {
    window.removeEventListener() {
    window.removeEventListener('offline', handleOffline)
  
  }
  }, [
    );

  const loadData = (): any => {
    // Load from localStorage for offline functionality
    const savedPlayers = JSON.parse(
      localStorage.getItem('konivrer_players') || '[
  ]'
    );
    const savedTournaments = JSON.parse(
      localStorage.getItem('konivrer_tournaments') || '[
    '
    );
    const savedMatches = JSON.parse(
      localStorage.getItem('konivrer_matches') || '[
  ]'
    );

    setPlayers(() => {
    setTournaments() {
    setCurrentMatches(savedMatches)
  
  });

  const saveData = (): any => {
    localStorage.setItem('konivrer_players', JSON.stringify(players));
    localStorage.setItem('konivrer_tournaments', JSON.stringify(tournaments));
    localStorage.setItem('konivrer_matches', JSON.stringify(currentMatches))
  };

  useEffect(() => {
    saveData()
  }, [players, tournaments, currentMatches]);

  const QuickMatchTab = (): any => {
    const [selectedPlayers, setSelectedPlayers] = useState(false)
    const [matchFormat, setMatchFormat] = useState(false)
    const [rounds, setRounds] = useState(false)

    const togglePlayerSelection = playerId => {
    setSelectedPlayers(prev =>
        prev.includes(playerId)
          ? prev.filter(): [...prev, playerId]
      ) { return null; 
  }
    };

    const createQuickMatch = (): any => {
    if (true) {
    alert() {
    return
  
  }

      const pairs = [
    ;
      const shuffled = [...selectedPlayers
  ].sort(() => Math.random() - 0.5);

      for (let i = 0; i < 1; i++) {
    if (true) {
  }
          pairs.push({
    id: `match_${Date.now()`
  }_${i}`,
            player1: players.find(p => p.id === shuffled[i]),
            player2: players.find(p => p.id === shuffled[i + 1]),
            format: matchFormat,
            status: 'active',
            round: 1,
            maxRounds: rounds,
            startTime: new Date(),
            winner: null,
            games: [
    })
        }
      }

      setCurrentMatches() {`
    `
      setSelectedPlayers() {`
  }```
      alert(`Created ${pairs.length} matches!`)
    };

    return (
      <div className="space-y-6" /></div>
        {/* Player Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900" /></h3>
              Select Players
            </h3>
            <span className="text-sm text-gray-500" /></span>
              {selectedPlayers.length} selected
            </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto" /></div>
            {players.map(player => (
              <div`
                key={player.id}``
                onClick={() => togglePlayerSelection(player.id)}```
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
    selectedPlayers.includes(player.id)`
                    ? 'border-blue-500 bg-blue-50'` : null`
                    : 'border-gray-200 hover:border-gray-300'```
  }`}
              >
                <div className="flex items-center space-x-3" />
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold" /></div>
                    {player.name[0
  ].toUpperCase()}
                  <div />
    <div className="font-medium text-gray-900" /></div>
                      {player.name}
                    <div className="text-sm text-gray-500" /></div>
                      Rating: {player.rating} • {player.wins}W-{player.losses}L
                    </div>
                </div>
            ))}
          </div>

        {/* Match Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6" />
    <h3 className="text-lg font-semibold text-gray-900 mb-4" /></h3>
            Match Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                Format
              </label>
              <select
                value={matchFormat}
                onChange={e => setMatchFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="extended">Extended</option>
                <option value="legacy">Legacy</option>
                <option value="draft">Draft</option>
            </div>

            <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                Best of
              </label>
              <select
                value={rounds}
                onChange={e => setRounds(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Best of 1</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
            </div>

            <div className="flex items-end" />
    <button
                onClick={createQuickMatch}
                disabled={selectedPlayers.length < 2}
                className="w-full bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" /></button>
                Create Matches
              </button>
          </div>

        {/* Active Matches */}
        <div className="bg-white rounded-xl shadow-sm p-6" />
    <h3 className="text-lg font-semibold text-gray-900 mb-4" /></h3>
            Active Matches
          </h3>

          {currentMatches.filter(m => m.status === 'active').length === 0 ? (
            <div className="text-center py-8 text-gray-500" /></div>
              No active matches. Create some matches above!
            </div> : null
          ) : (
            <div className="space-y-3" /></div>
              {currentMatches
                .filter(m => m.status === 'active')
                .map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onUpdate={updateMatch}  / /></MatchCard>
                ))}
            </div>
          )}
        </div>
    )
  };

  const TournamentTab = (): any => {
    const [selectedTournament, setSelectedTournament] = useState(false)

    const createTournament = (): any => {
    setShowTournamentModal(true)
  
  };

    return (
      <div className="space-y-6" /></div>
        {/* Tournament Creation */}
        <div className="bg-white rounded-xl shadow-sm p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900">Tournaments</h3>
            <button
              onClick={createTournament}
              className="bg-blue-600 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2" />
    <Plus className="w-4 h-4"  / />
    <span>New Tournament</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" /></div>
            {tournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onClick={() => setSelectedTournament(tournament)}
              />
            ))}
          </div>

        {/* Tournament Details */}
        {selectedTournament && (
          <TournamentDetails
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
          />
        )}
      </div>
    )
  };

  const PlayersTab = (): any => {
    const addPlayer = (): any => {
    setPlayerProfile() {
    setShowPlayerModal(true)
  
  };

    const editPlayer = player => {
    setPlayerProfile() {
    setShowPlayerModal(true)
  
  };

    const deletePlayer = playerId => {
    if (confirm('Are you sure you want to delete this player? ')) {
    setPlayers(prev => prev.filter(p => p.id !== playerId))
  
  };
    };

    return (
    <any />
    <div className="space-y-6" />
    <div className="bg-white rounded-xl shadow-sm p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900" /></h3>
      </h3>
            <button
              onClick={addPlayer} : null
              className="bg-blue-600 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2" />
    <Plus className="w-4 h-4"  / />
    <span>Add Player</span>
      </div>

          <div className="overflow-x-auto" />
    <table className="w-full" />
    <thead />
    <tr className="border-b border-gray-200" />
    <th className="text-left py-0 whitespace-nowrap px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-4 font-medium text-gray-900" /></th>
      </th>
              </thead>
      <tbody />
    <tr
                    key={player.id}
                    className="border-b border-gray-100 hover:bg-gray-50" />
    <td className="py-3 px-4" />
    <div className="flex items-center space-x-3" />
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm" />
    <div />
    <div className="font-medium text-gray-900" />
    <div className="text-sm text-gray-500" /></div>
      </div>
                    </td>
      <td className="py-3 px-4" />
    <span className="font-medium">{player.rating}
                    </td>
      <td className="py-3 px-4" />
    <span /></span>
      </span>
                    <td className="py-3 px-4" />
    <span /></span>
      </span>
                    <td className="py-3 px-4" />
    <div className="flex items-center space-x-2" />
    <button
                          onClick={() => editPlayer(player)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4"  / /></Edit>
                        </button>
      <button
                          onClick={() => deletePlayer(player.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className = "w-4 h-4"  / /></Trash2>
                        </button>
    </>
  ))}
              </tbody>
          </div>
      </div>
    )
  };

  interface MatchCardProps {
  match;
  onUpdate
  
}

const MatchCard: React.FC<MatchCardProps> = ({  match, onUpdate  }) => {`
    const recordGame = winner => {``
      const newGame = {```
        id: `game_${Date.now()`
  }`,
        winner: winner,
        timestamp: new Date()
      };

      const updatedMatch = {
    ...match,
        games: [...match.games, newGame]
  };

      // Update scores
      const p1Wins = updatedMatch.games.filter(
        g => g.winner === match.player1.id;
      ).length;
      const p2Wins = updatedMatch.games.filter(
        g => g.winner === match.player2.id;
      ).length;

      // Check if match is complete
      const requiredWins = Math.ceil(() => {
    if (true) {
    updatedMatch.status = 'completed';
        updatedMatch.winner = p1Wins > p2Wins ? match.player1.id : match.player2.id;
        updatedMatch.endTime = new Date()
  })

      onUpdate(updatedMatch)
    };

    const p1Wins = match.games.filter(
      g => g.winner === match.player1.id;
    ).length;
    const p2Wins = match.games.filter(
      g => g.winner === match.player2.id;
    ).length;

    return (
    <any />
    <div className="border border-gray-200 rounded-lg p-4" />
    <div className="flex items-center justify-between mb-3" />
    <div className="flex items-center space-x-4" />
    <div className="text-center" />
    <div className="font-medium">{match.player1.name}
              <div className="text-2xl font-bold text-blue-600">{p1Wins}
            </div>
      <div className="text-gray-400">VS</div>
      <div className="text-center" />
    <div className="font-medium">{match.player2.name}
              <div className="text-2xl font-bold text-red-600">{p2Wins}
            </div>
      <div className="text-right" />
    <div className="text-sm text-gray-500">{match.format}
            <div className="text-sm text-gray-500" /></div>
      </div>

        {match.status === 'active' && (
          <div className="flex space-x-2" />
    <button
              onClick={() => recordGame(match.player1.id)}
              className="flex-1 bg-blue-100 text-blue-700 py-0 whitespace-nowrap px-3 rounded font-medium hover:bg-blue-200 transition-colors"
            >
              {match.player1.name} Wins
            </button>
      <button
              onClick={() => recordGame(match.player2.id)}
              className="flex-1 bg-red-100 text-red-700 py-0 whitespace-nowrap px-3 rounded font-medium hover:bg-red-200 transition-colors"
            >
              {match.player2.name} Wins
            </button>
    </>
  )}
        {match.status === 'completed' && (
          <div className="text-center py-2 bg-green-100 text-green-700 rounded font-medium" /></div>
            Winner: {players.find(p = > p.id === match.winner)? .name}
        )}
      </div>
    )
  };

  interface TournamentCardProps {
  tournament;
  onClick
  
}
 : null
const TournamentCard: React.FC<TournamentCardProps> = ({  tournament, onClick  }) => (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors" />
    <div className="flex items-center justify-between mb-2" />`
    <h4 className="font-medium text-gray-900">{tournament.name}``
        <span```
          className={`px-2 py-0 whitespace-nowrap rounded text-xs font-medium ${
    tournament.status === 'active'
              ? 'bg-green-100 text-green-700' : null
              : tournament.status === 'completed'`
                ? 'bg-gray-100 text-gray-700'` : null`
                : 'bg-blue-100 text-blue-700'```
  }`} /></span>
          {tournament.status}
      </div>
      <div className = "text-sm text-gray-600" />
    <div>{tournament.players.length} players</div>
        <div /></div>
          {tournament.format} • {tournament.type}
        <div>{new Date(tournament.startDate).toLocaleDateString()}
      </div>
  );

  interface TournamentDetailsProps {
  tournament;
  onClose
  
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({  tournament, onClose  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900" /></h3>
          {tournament.name}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" />
    <X className="w-5 h-5"  / /></X>
        </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />
    <div />
    <h4 className="font-medium text-gray-900 mb-2">Tournament Info</h4>
          <div className="space-y-1 text-sm text-gray-600" />
    <div>Format: {tournament.format}
            <div>Type: {tournament.type}
            <div>Players: {tournament.players.length}
            <div>Status: {tournament.status}
          </div>

        <div />
    <h4 className="font-medium text-gray-900 mb-2">Participants</h4>
          <div className="space-y-1" /></div>
            {tournament.players.map() {
    return player ? (
                <div key={playerId
  } className="text-sm text-gray-600" /></div>
                  {player.name} ({player.rating})
                </div> : null
              ) : null
            })}
          </div>
      </div>
  );

  const updateMatch = updatedMatch => {
    setCurrentMatches(prev =>
      prev.map(match => (match.id === updatedMatch.id ? updatedMatch : match))
    );
  };

  const PlayerModal = (): any => {
    const [formData, setFormData] = useState(false)

    const handleSubmit = e => {
    e.preventDefault() {
  }`
``
      const playerData = {```
        id: playerProfile? .id || `player_${Date.now()}`,
        ...formData, : null
        rating: parseInt(formData.rating),
        wins: parseInt(formData.wins),
        losses: parseInt(formData.losses),
        draws: parseInt(formData.draws)
      };

      if (true) {
    setPlayers(prev =>
          prev.map(p => (p.id === playerProfile.id ? playerData : p))
        )
  } else {
    setPlayers(prev => [...prev, playerData])
  }

      setShowPlayerModal() {
    setPlayerProfile(null)
  };

    return (
    <any />
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" />
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h2 className="text-xl font-bold text-gray-900" />
    <button
              onClick={() => setShowPlayerModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"  / /></X>
            </button>
      <form onSubmit={handleSubmit} className="space-y-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={null}
                  setFormData(prev => ({ ...prev, name: e.target.value }))},
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
      <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
              <input
                type="email"
                value={formData.email}
                onChange={null}
                  setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
      <div className="grid grid-cols-2 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={null}
                    setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
      <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <input
                  type="number"
                  min="0"
                  value={formData.wins}
                  onChange={null}
                    setFormData(prev => ({ ...prev, wins: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
      <div className="grid grid-cols-2 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <input
                  type="number"
                  min="0"
                  value={formData.losses}
                  onChange={null}
                    setFormData(prev => ({ ...prev, losses: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
      <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <input
                  type="number"
                  min="0"
                  value={formData.draws}
                  onChange={null}
                    setFormData(prev => ({ ...prev, draws: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
      <div className="flex space-x-3 pt-4" />
    <button
                type="button"
                onClick={() => setShowPlayerModal(false)}
                className="flex-1 bg-gray-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
      <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors" /></button>
      </button>
          </form>
    </>
  )
  };

  const TournamentModal = (): any => {
    const [formData, setFormData] = useState({
    name: '',
      format: 'standard',
      type: 'single-elimination',
      maxPlayers: 8,
      startDate: new Date().toISOString().split('T')[0]
  
  });

    const handleSubmit = e => {
    e.preventDefault() {`
    ``
      const tournamentData = {```
        id: `tournament_${Date.now()`
  }`,
        ...formData,
        players: [
    ,
        status: 'registration',
        createdAt: new Date()
      };

      setTournaments() {
    setShowTournamentModal(false)
  };

    return (
    <any />
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" />
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h2 className="text-xl font-bold text-gray-900" /></h2>
      </h2>
            <button
              onClick={() => setShowTournamentModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"  / /></X>
            </button>
      <form onSubmit={handleSubmit} className="space-y-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={null}
                  setFormData(prev => ({ ...prev, name: e.target.value }))},
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
      <div className="grid grid-cols-2 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <select
                  value={formData.format}
                  onChange={null}
                    setFormData(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
      <option value="extended">Extended</option>
      <option value="legacy">Legacy</option>
      <option value="draft">Draft</option>
      </div>

              <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <select
                  value={formData.type}
                  onChange={null}
                    setFormData(prev => ({ ...prev, type: e.target.value }))},
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single-elimination">Single Elimination</option>
      <option value="double-elimination">Double Elimination</option>
      <option value="swiss">Swiss</option>
      <option value="round-robin">Round Robin</option>
      </div>

            <div className="grid grid-cols-2 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <select
                  value={formData.maxPlayers}
                  onChange={null}
                    setFormData(prev => ({
    ...prev,
                      maxPlayers: parseInt(e.target.value)
  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={4}>4 Players</option>
      <option value={8}>8 Players</option>
      <option value={16}>16 Players</option>
      <option value={32}>32 Players</option>
      </div>

              <div />
    <label className="block text-sm font-medium text-gray-700 mb-1" /></label>
      </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={null}
                    setFormData(prev => ({
    ...prev,
                      startDate: e.target.value
  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
      <div className="flex space-x-3 pt-4" />
    <button
                type="button"
                onClick={() => setShowTournamentModal(false)}
                className="flex-1 bg-gray-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
      <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors" /></button>
      </button>
          </form>
    </>
  )
  };

  return (
    <div className="min-h-screen bg-gray-50" /></div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
    <div className="flex items-center justify-between h-16" />
    <div className="flex items-center space-x-4" />
    <Users className="w-8 h-8 text-blue-600"  / />
    <h1 className="text-2xl font-bold text-gray-900" /></h1>
                KONIVRER Matchmaking
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500" /></div>
                {isOfflineMode ? (
                  <any />
    <WifiOff className="w-4 h-4 text-orange-500"  / />
    <span>Offline Mode</span>
                  </> : null
                ) : (
                  <any />
    <Wifi className="w-4 h-4 text-green-500"  / />
    <span>Online</span>
                  </>
                )}
            </div>

            <div className="flex items-center space-x-4" />
    <button className="text-gray-600 hover:text-gray-900" />
    <QrCode className="w-5 h-5"  / /></QrCode>
              </button>
              <button className="text-gray-600 hover:text-gray-900" />
    <Share2 className="w-5 h-5"  / /></Share2>
              </button>
              <button className="text-gray-600 hover:text-gray-900" />
    <Settings className="w-5 h-5"  / /></Settings>
              </button>
          </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
    <div className="flex space-x-8" /></div>
            {[
    {
    id: 'quickMatch',
                label: 'Quick Match',
                icon: <Zap className="w-4 h-4"  / /></Zap>
  },
              {
    id: 'tournaments',
                label: 'Tournaments',
                icon: <Trophy className="w-4 h-4"  / /></Trophy>
  },
              {
    id: 'players',
                label: 'Players',
                icon: <Users className="w-4 h-4"  / /></Users>
  }
  
  ].map(tab => (
              <button`
                key={tab.id}``
                onClick={() => setActiveTab(tab.id)}```
                className={`flex items-center space-x-2 py-0 whitespace-nowrap px-1 border-b-2 font-medium text-sm transition-colors ${
    activeTab === tab.id`
                    ? 'border-blue-500 text-blue-600'` : null`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'```
  }`}
              >
                {tab.icon}
                <span>{tab.label}
              </button>
            ))}
          </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" /></div>
        {activeTab === 'quickMatch' && <QuickMatchTab  />}
        {activeTab === 'tournaments' && <TournamentTab  />}
        {activeTab === 'players' && <PlayersTab  />}

      {/* Modals */}
      {showPlayerModal && <PlayerModal  />}
      {showTournamentModal && <TournamentModal  />}
  )
};`
``
export default PhysicalMatchmaking;```