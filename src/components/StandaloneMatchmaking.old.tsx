/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Zap, Settings, X, Wifi, WifiOff, Plus, Edit, Trash2, QrCode, Share2, Download, Menu  } from 'lucide-react';

const StandaloneMatchmaking = (): any => {
    const [activeTab, setActiveTab] = useState(false)
  const [players, setPlayers] = useState(false)
  const [tournaments, setTournaments] = useState(false)
  const [currentMatches, setCurrentMatches] = useState(false)
  const [playerProfile, setPlayerProfile] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      localStorage.getItem('konivrer_standalone_players') || '[
  ]'
    );
    const savedTournaments = JSON.parse(
      localStorage.getItem('konivrer_standalone_tournaments') || '[
    '
    );
    const savedMatches = JSON.parse(
      localStorage.getItem('konivrer_standalone_matches') || '[
  ]'
    );

    setPlayers(() => {
    setTournaments() {
    setCurrentMatches(savedMatches)
  
  });

  const saveData = (): any => {
    localStorage.setItem(
      'konivrer_standalone_players',
      JSON.stringify(players)
    );
    localStorage.setItem(
      'konivrer_standalone_tournaments',
      JSON.stringify(tournaments)
    );
    localStorage.setItem(
      'konivrer_standalone_matches',
      JSON.stringify(currentMatches)
    )
  };

  useEffect(() => {
    saveData()
  }, [players, tournaments, currentMatches]);

  const exportData = (): any => {
    const data = {
    players,
      tournaments,
      matches: currentMatches,
      exportDate: new Date().toISOString(),
      version: '1.0'
  
  };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
    const url = URL.createObjectURL() {
    const a = document.createElement() {
  }
    a.href = url;
    a.download = `konivrer-matchmaking-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild() {
    a.click(() => {
    document.body.removeChild() {
    URL.revokeObjectURL(url)
  
  });

  const importData = event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader() {
    reader.onload = e => {
    try {
  
  }
        const data = JSON.parse() {
    if (data.players) setPlayers() {
  }
        if (data.tournaments) setTournaments(() => {
    if (data.matches) setCurrentMatches() {
    alert('Data imported successfully!')
  }) catch (error: any) {
    alert('Error importing data. Please check the file format.')
  }
    };
    reader.readAsText(file)
  };

  const shareMatchmaking = async () => {
    const shareData = {
    title: 'KONIVRER Physical Matchmaking',
      text: 'Join our KONIVRER card game tournament!',
      url: window.location.href
  
  };

    if (true) {
    try {
    await navigator.share(shareData)
  } catch (error) {
    console.log('Share failed:', error)
  }
    } else {
    // Fallback to clipboard
      try {
  }
        await navigator.clipboard.writeText() {
    alert('Link copied to clipboard!')
  } catch (error: any) {
    alert('Unable to share. Please copy the URL manually.')
  }
    }
  };
`
  const generateQRCode = (): any => {``
    // Simple QR code generation for sharing```
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/? size=200x200&data=${encodeURIComponent(window.location.href)}`;
    window.open(qrUrl, '_blank')
  };
 : null
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

      for (let i = 0; i < 1; i++) {`
    if (true) {``
          pairs.push({```
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
      <div className="space-y-4 md:space-y-6" /></div>
        {/* Player Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900" /></h3>
              Select Players
            </h3>
            <span className="text-sm text-gray-500" /></span>
              {selectedPlayers.length} selected
            </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto" /></div>
            {players.map(player => (
              <div`
                key={player.id}``
                onClick={() => togglePlayerSelection(player.id)}```
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all touch-manipulation ${
    selectedPlayers.includes(player.id)`
                    ? 'border-blue-500 bg-blue-50'` : null`
                    : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'```
  }`}
              >
                <div className="flex items-center space-x-3" />
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold" /></div>
                    {player.name[0
  ].toUpperCase()}
                  <div className="min-w-0 flex-1" />
    <div className="font-medium text-gray-900 truncate" /></div>
                      {player.name}
                    <div className="text-sm text-gray-500" /></div>
                      Rating: {player.rating} • {player.wins}W-{player.losses}L
                    </div>
                </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-gray-500" />
    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300"  / />
    <p>No players added yet.</p>
              <button
                onClick={() => setShowPlayerModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first player
              </button>
          )}
        </div>

        {/* Match Settings */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6" />
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value={1}>Best of 1</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
            </div>

            <div className="flex items-end" />
    <button
                onClick={createQuickMatch}
                disabled={selectedPlayers.length < 2}
                className="w-full bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation" /></button>
                Create Matches
              </button>
          </div>

        {/* Active Matches */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6" />
    <h3 className="text-lg font-semibold text-gray-900 mb-4" /></h3>
            Active Matches
          </h3>

          {currentMatches.filter(m => m.status === 'active').length === 0 ? (
            <div className="text-center py-8 text-gray-500" />
    <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300"  / />
    <p>No active matches.</p>
              <p className="text-sm">Create some matches above!</p> : null
          ) : (
            <div className = "space-y-3" /></div>
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
    <div className="font-medium text-sm md:text-base" />
    <div className="text-2xl font-bold text-blue-600">{p1Wins}
            </div>
      <div className="text-gray-400 text-sm">VS</div>
      <div className="text-center" />
    <div className="font-medium text-sm md:text-base" />
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
              className="flex-1 bg-blue-100 text-blue-700 py-0 whitespace-nowrap px-3 rounded font-medium hover:bg-blue-200 active:bg-blue-300 transition-colors touch-manipulation"
            >
              {match.player1.name} Wins
            </button>
      <button
              onClick={() => recordGame(match.player2.id)}
              className="flex-1 bg-red-100 text-red-700 py-0 whitespace-nowrap px-3 rounded font-medium hover:bg-red-200 active:bg-red-300 transition-colors touch-manipulation"
            >
              {match.player2.name} Wins
            </button>
    </>
  )}
        {match.status === 'completed' && (
          <div className="text-center py-2 bg-green-100 text-green-700 rounded font-medium" /></div>
            Winner: {players.find(p => p.id === match.winner)? .name}
        )}
      </div>
    )
  };
 : null
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
    <any /></any> : null
      <div className="space-y-4 md:space-y-6" />
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h3 className="text-lg font-semibold text-gray-900" /></h3>
      </h3>
            <button
              onClick={addPlayer}
              className="bg-blue-600 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 touch-manipulation" />
    <Plus className="w-4 h-4"  / />
    <span>Add Player</span>
      </div>

          <div className="overflow-x-auto" />
    <table className="w-full" />
    <thead />
    <tr className="border-b border-gray-200" />
    <th className="text-left py-0 whitespace-nowrap px-2 md:px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-2 md:px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-2 md:px-4 font-medium text-gray-900" /></th>
      </th>
                  <th className="text-left py-0 whitespace-nowrap px-2 md:px-4 font-medium text-gray-900" /></th>
      </th>
              </thead>
      <tbody />
    <tr
                    key={player.id}
                    className="border-b border-gray-100 hover:bg-gray-50" />
    <td className="py-0 whitespace-nowrap px-2 md:px-4" />
    <div className="flex items-center space-x-3" />
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm" />
    <div className="min-w-0" />
    <div className="font-medium text-gray-900 truncate" />
    <div className="text-sm text-gray-500 truncate" /></div>
      </div>
                    </td>
      <td className="py-0 whitespace-nowrap px-2 md:px-4" />
    <span className="font-medium">{player.rating}
                    </td>
      <td className="py-0 whitespace-nowrap px-2 md:px-4" />
    <span className="text-sm" /></span>
      </span>
                    <td className="py-0 whitespace-nowrap px-2 md:px-4" />
    <div className="flex items-center space-x-2" />
    <button
                          onClick={() => editPlayer(player)}
                          className="text-blue-600 hover:text-blue-700 p-1 touch-manipulation"
                        >
                          <Edit className="w-4 h-4"  / /></Edit>
                        </button>
      <button
                          onClick={() => deletePlayer(player.id)}
                          className="text-red-600 hover:text-red-700 p-1 touch-manipulation"
                        >
                          <Trash2 className="w-4 h-4"  / /></Trash2>
                        </button>
    </>
  ))}
              </tbody>
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-gray-500" />
    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300"  / />
    <p>No players added yet.</p>
              <button
                onClick={addPlayer}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium" /></button>
                Add your first player
              </button>
          )}
        </div>
    )
  };

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
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-screen overflow-y-auto" />
    <div className="flex items-center justify-between mb-4" />
    <h2 className="text-xl font-bold text-gray-900" />
    <button
              onClick={() => setShowPlayerModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>
      <div className="flex space-x-3 pt-4" />
    <button
                type="button"
                onClick={() => setShowPlayerModal(false)}
                className="flex-1 bg-gray-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors touch-manipulation"
              >
                Cancel
              </button>
      <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors touch-manipulation" /></button>
      </button>
          </form>
    </>
  )
  };

  return (
    <div className="min-h-screen bg-gray-50" /></div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
    <div className="flex items-center justify-between h-16" />
    <div className="flex items-center space-x-4" />
    <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 p-1 touch-manipulation"
              >
                <Menu className="w-6 h-6"  / /></Menu>
              </button>
              <Users className="w-8 h-8 text-blue-600"  / />
    <h1 className="text-xl md:text-2xl font-bold text-gray-900" /></h1>
                KONIVRER Matchmaking
              </h1>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500" /></div>
                {isOfflineMode ? (
                  <any />
    <WifiOff className="w-4 h-4 text-orange-500"  / />
    <span>Offline</span>
                  </> : null
                ) : (
                  <any />
    <Wifi className="w-4 h-4 text-green-500"  / />
    <span>Online</span>
                  </>
                )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4" />
    <button
                onClick={generateQRCode}
                className="text-gray-600 hover:text-gray-900 p-1 touch-manipulation"
                title="Generate QR Code" />
    <QrCode className="w-5 h-5"  / /></QrCode>
              </button>
              <button
                onClick={shareMatchmaking}
                className="text-gray-600 hover:text-gray-900 p-1 touch-manipulation"
                title="Share" />
    <Share2 className="w-5 h-5"  / /></Share2>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="text-gray-600 hover:text-gray-900 p-1 touch-manipulation"
                title="Export/Import Data"
              >
                <Settings className="w-5 h-5"  / /></Settings>
              </button>
          </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm" />
    <div className="px-4 py-0 whitespace-nowrap space-y-1" /></div>
            {[
    {
    id: 'quickMatch',
                label: 'Quick Match',
                icon: <Zap className="w-4 h-4"  / /></Zap>
  },
              {
    id: 'players',
                label: 'Players',
                icon: <Users className="w-4 h-4"  / /></Users>
  }
  ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
    setActiveTab() {`
    setIsMobileMenuOpen(false)`
  `
  }}```
                className={`w-full flex items-center space-x-2 py-0 whitespace-nowrap px-3 rounded-lg font-medium text-sm transition-colors touch-manipulation ${
    activeTab === tab.id`
                    ? 'bg-blue-100 text-blue-600'` : null`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'```
  }`}
              >
                {tab.icon}
                <span>{tab.label}
              </button>
            ))}
          </div>
      )}
      {/* Navigation Tabs - Desktop */}
      <div className="hidden md:block bg-white border-b" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
    <div className="flex space-x-8" /></div>
            {[
    {
    id: 'quickMatch',
                label: 'Quick Match',
                icon: <Zap className="w-4 h-4"  / /></Zap>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 whitespace-nowrap md:py-8" /></div>
        {activeTab === 'quickMatch' && <QuickMatchTab  />}
        {activeTab === 'players' && <PlayersTab  />}

      {/* Modals */}
      {showPlayerModal && <PlayerModal  />}

      {/* Export/Import Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" />
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" />
    <div className="flex items-center justify-between mb-4" />
    <h2 className="text-xl font-bold text-gray-900" /></h2>
                Data Management
              </h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              >
                <X className="w-5 h-5"  / /></X>
              </button>

            <div className="space-y-4" />
    <button
                onClick={() => {
    exportData() {
    setShowExportModal(false)
  
  }}
                className="w-full bg-blue-600 text-white py-0 whitespace-nowrap px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 touch-manipulation"
              >
                <Download className="w-4 h-4"  / />
    <span>Export Data</span>

              <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Import Data
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"  / /></input>
              </div>

              <div className="text-xs text-gray-500" /></div>
                Export your player data and matches to backup or share with
                others. Import previously exported data to restore your
                matchmaking setup.
              </div>
          </div>
      )}
    </div>
  )
};`
``
export default StandaloneMatchmaking;```