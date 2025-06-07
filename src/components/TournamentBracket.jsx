import { useState, useEffect } from 'react';
import { Trophy, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const TournamentBracket = ({ tournamentId, format = 'single-elimination' }) => {
  const [bracket, setBracket] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    // Mock bracket data - in real app, fetch from API
    const mockBracket = {
      rounds: [
        {
          id: 1,
          name: 'Round 1',
          matches: [
            {
              id: 1,
              player1: { name: 'Alex Chen', seed: 1, score: 2 },
              player2: { name: 'Sarah Wilson', seed: 8, score: 0 },
              status: 'completed',
              winner: 'Alex Chen',
              table: 1,
            },
            {
              id: 2,
              player1: { name: 'Mike Johnson', seed: 4, score: 2 },
              player2: { name: 'Emma Davis', seed: 5, score: 1 },
              status: 'completed',
              winner: 'Mike Johnson',
              table: 2,
            },
            {
              id: 3,
              player1: { name: 'David Kim', seed: 2, score: 1 },
              player2: { name: 'Lisa Zhang', seed: 7, score: 2 },
              status: 'completed',
              winner: 'Lisa Zhang',
              table: 3,
            },
            {
              id: 4,
              player1: { name: 'Tom Brown', seed: 3, score: 0 },
              player2: { name: 'Anna Lee', seed: 6, score: 2 },
              status: 'completed',
              winner: 'Anna Lee',
              table: 4,
            },
          ],
        },
        {
          id: 2,
          name: 'Semifinals',
          matches: [
            {
              id: 5,
              player1: { name: 'Alex Chen', seed: 1, score: 2 },
              player2: { name: 'Mike Johnson', seed: 4, score: 1 },
              status: 'in-progress',
              table: 1,
            },
            {
              id: 6,
              player1: { name: 'Lisa Zhang', seed: 7, score: 0 },
              player2: { name: 'Anna Lee', seed: 6, score: 1 },
              status: 'in-progress',
              table: 2,
            },
          ],
        },
        {
          id: 3,
          name: 'Finals',
          matches: [
            {
              id: 7,
              player1: { name: 'TBD', seed: null, score: 0 },
              player2: { name: 'TBD', seed: null, score: 0 },
              status: 'pending',
              table: 1,
            },
          ],
        },
      ],
    };
    setBracket(mockBracket);
  }, [tournamentId]);

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-900/20';
      case 'in-progress': return 'border-yellow-500 bg-yellow-900/20';
      case 'pending': return 'border-gray-500 bg-gray-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getMatchStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-400" />;
      case 'in-progress': return <Clock size={16} className="text-yellow-400" />;
      case 'pending': return <AlertCircle size={16} className="text-gray-400" />;
      default: return null;
    }
  };

  const renderMatch = (match, roundIndex) => {
    const isSelected = selectedMatch?.id === match.id;
    
    return (
      <div
        key={match.id}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
          getMatchStatusColor(match.status)
        } ${isSelected ? 'ring-2 ring-accent-primary' : ''}`}
        onClick={() => setSelectedMatch(match)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted">Table {match.table}</span>
          <div className="flex items-center gap-1">
            {getMatchStatusIcon(match.status)}
            <span className="text-xs capitalize">{match.status.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2 rounded ${
            match.winner === match.player1.name ? 'bg-accent-primary/20 border border-accent-primary/50' : 'bg-tertiary'
          }`}>
            <div className="flex items-center gap-2">
              {match.player1.seed && (
                <span className="text-xs bg-secondary px-1 rounded">{match.player1.seed}</span>
              )}
              <span className="text-sm font-medium">{match.player1.name}</span>
            </div>
            <span className="text-sm font-bold">{match.player1.score}</span>
          </div>

          <div className={`flex items-center justify-between p-2 rounded ${
            match.winner === match.player2.name ? 'bg-accent-primary/20 border border-accent-primary/50' : 'bg-tertiary'
          }`}>
            <div className="flex items-center gap-2">
              {match.player2.seed && (
                <span className="text-xs bg-secondary px-1 rounded">{match.player2.seed}</span>
              )}
              <span className="text-sm font-medium">{match.player2.name}</span>
            </div>
            <span className="text-sm font-bold">{match.player2.score}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSwissBracket = () => {
    // For Swiss format, show current standings instead of elimination bracket
    const standings = [
      { rank: 1, name: 'Alex Chen', points: 9, wins: 3, losses: 0, draws: 0 },
      { rank: 2, name: 'Mike Johnson', points: 6, wins: 2, losses: 1, draws: 0 },
      { rank: 3, name: 'Lisa Zhang', points: 6, wins: 2, losses: 1, draws: 0 },
      { rank: 4, name: 'Anna Lee', points: 6, wins: 2, losses: 1, draws: 0 },
      { rank: 5, name: 'David Kim', points: 3, wins: 1, losses: 2, draws: 0 },
      { rank: 6, name: 'Emma Davis', points: 3, wins: 1, losses: 2, draws: 0 },
      { rank: 7, name: 'Tom Brown', points: 3, wins: 1, losses: 2, draws: 0 },
      { rank: 8, name: 'Sarah Wilson', points: 0, wins: 0, losses: 3, draws: 0 },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Standings</h3>
          <span className="text-sm text-secondary">Round 3 of 5</span>
        </div>

        <div className="card">
          <div className="grid grid-cols-6 gap-4 p-3 border-b border-color text-sm font-medium text-secondary">
            <span>Rank</span>
            <span className="col-span-2">Player</span>
            <span>Points</span>
            <span>Record</span>
            <span>Status</span>
          </div>

          {standings.map((player) => (
            <div key={player.rank} className="grid grid-cols-6 gap-4 p-3 border-b border-color last:border-b-0">
              <span className="font-medium">{player.rank}</span>
              <span className="col-span-2 font-medium">{player.name}</span>
              <span>{player.points}</span>
              <span className="text-sm text-secondary">
                {player.wins}-{player.losses}-{player.draws}
              </span>
              <span className={`text-sm ${
                player.rank <= 8 ? 'text-green-400' : 'text-red-400'
              }`}>
                {player.rank <= 8 ? 'In Top Cut' : 'Eliminated'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!bracket && format !== 'swiss') {
    return (
      <div className="text-center py-8">
        <Trophy size={48} className="text-muted mx-auto mb-4" />
        <p className="text-secondary">Loading tournament bracket...</p>
      </div>
    );
  }

  if (format === 'swiss') {
    return renderSwissBracket();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tournament Bracket</h3>
        <div className="flex items-center gap-4 text-sm text-secondary">
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-yellow-400" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={14} className="text-gray-400" />
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {bracket.rounds.map((round, roundIndex) => (
            <div key={round.id} className="min-w-64">
              <h4 className="text-center font-medium mb-4 p-2 bg-secondary rounded">
                {round.name}
              </h4>
              <div className="space-y-4">
                {round.matches.map((match) => renderMatch(match, roundIndex))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Match Details</h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <span className="text-sm text-secondary">Table {selectedMatch.table}</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {getMatchStatusIcon(selectedMatch.status)}
                  <span className="text-sm capitalize">{selectedMatch.status.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`p-3 rounded ${
                  selectedMatch.winner === selectedMatch.player1.name 
                    ? 'bg-accent-primary/20 border border-accent-primary' 
                    : 'bg-tertiary'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.player1.seed && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          Seed {selectedMatch.player1.seed}
                        </span>
                      )}
                      <span className="font-medium">{selectedMatch.player1.name}</span>
                    </div>
                    <span className="text-xl font-bold">{selectedMatch.player1.score}</span>
                  </div>
                </div>

                <div className="text-center text-sm text-secondary">vs</div>

                <div className={`p-3 rounded ${
                  selectedMatch.winner === selectedMatch.player2.name 
                    ? 'bg-accent-primary/20 border border-accent-primary' 
                    : 'bg-tertiary'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedMatch.player2.seed && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          Seed {selectedMatch.player2.seed}
                        </span>
                      )}
                      <span className="font-medium">{selectedMatch.player2.name}</span>
                    </div>
                    <span className="text-xl font-bold">{selectedMatch.player2.score}</span>
                  </div>
                </div>
              </div>

              {selectedMatch.winner && (
                <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <Trophy size={20} className="text-yellow-400 mx-auto mb-1" />
                  <p className="text-sm">
                    <span className="font-medium">{selectedMatch.winner}</span> wins!
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
                {selectedMatch.status === 'in-progress' && (
                  <button className="btn btn-primary flex-1">
                    Update Score
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;