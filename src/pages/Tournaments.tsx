import React, { useState, useEffect } from 'react';

interface Tournament {
  id: string;
  name: string;
  format: string;
  status: 'upcoming' | 'active' | 'completed';
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  startTime: Date;
  duration: string;
}

interface LiveMatch {
  id: string;
  player1: string;
  player2: string;
  round: number;
  status: 'playing' | 'player1_won' | 'player2_won';
  viewers: number;
}

export const Tournaments: React.FC = () => {
  const [tournaments] = useState<Tournament[]>([]);
  const [liveMatches] = useState<LiveMatch[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'active' | 'live'>('upcoming');

  useEffect(() => {
    loadTournaments();
    loadLiveMatches();
  }, []);

  const loadTournaments = async () => {
    // Load tournaments from API
    try {
      // const response = await fetch('/api/tournaments');
      // const tournamentsData = await response.json();
      // setTournaments(tournamentsData);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  };

  const loadLiveMatches = async () => {
    // Load live matches from API
    try {
      // const response = await fetch('/api/live-matches');
      // const matchesData = await response.json();
      // setLiveMatches(matchesData);
    } catch (error) {
      console.error('Failed to load live matches:', error);
    }
  };

  const handleJoinTournament = (tournamentId: string) => {
    console.log('Join tournament:', tournamentId);
  };

  const handleWatchMatch = (matchId: string) => {
    console.log('Watch match:', matchId);
  };

  return (
    <div className="tournaments-container">
      <div className="tournaments-header">
        <h1>Tournaments</h1>
        <p>Compete in competitive KONIVRER tournaments</p>
      </div>

      <div className="tournaments-tabs">
        <button 
          className={`tab ${selectedTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setSelectedTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab ${selectedTab === 'active' ? 'active' : ''}`}
          onClick={() => setSelectedTab('active')}
        >
          Active
        </button>
        <button 
          className={`tab ${selectedTab === 'live' ? 'active' : ''}`}
          onClick={() => setSelectedTab('live')}
        >
          Live Matches
        </button>
      </div>

      <div className="tournaments-content">
        {selectedTab === 'upcoming' && (
          <div className="upcoming-tournaments">
            {tournaments.length === 0 ? (
              <div className="no-tournaments">
                <h3>No Upcoming Tournaments</h3>
                <p>Check back later for new tournament announcements.</p>
              </div>
            ) : (
              tournaments
                .filter(t => t.status === 'upcoming')
                .map(tournament => (
                  <div key={tournament.id} className="tournament-card">
                    <h3>{tournament.name}</h3>
                    <p>Format: {tournament.format}</p>
                    <p>Entry Fee: ${tournament.entryFee}</p>
                    <p>Prize Pool: ${tournament.prizePool}</p>
                    <p>Players: {tournament.participants}/{tournament.maxParticipants}</p>
                    <button onClick={() => handleJoinTournament(tournament.id)}>
                      Join Tournament
                    </button>
                  </div>
                ))
            )}
          </div>
        )}

        {selectedTab === 'active' && (
          <div className="active-tournaments">
            {tournaments.filter(t => t.status === 'active').length === 0 ? (
              <div className="no-tournaments">
                <h3>No Active Tournaments</h3>
                <p>No tournaments are currently in progress.</p>
              </div>
            ) : (
              tournaments
                .filter(t => t.status === 'active')
                .map(tournament => (
                  <div key={tournament.id} className="tournament-card active">
                    <h3>{tournament.name}</h3>
                    <p>Format: {tournament.format}</p>
                    <p>Status: In Progress</p>
                    <p>Players: {tournament.participants}</p>
                    <button>View Brackets</button>
                  </div>
                ))
            )}
          </div>
        )}

        {selectedTab === 'live' && (
          <div className="live-matches">
            {liveMatches.length === 0 ? (
              <div className="no-matches">
                <h3>No Live Matches</h3>
                <p>No matches are currently being streamed.</p>
              </div>
            ) : (
              liveMatches.map(match => (
                <div key={match.id} className="match-card">
                  <h4>{match.player1} vs {match.player2}</h4>
                  <p>Round {match.round}</p>
                  <p>{match.viewers} viewers</p>
                  <button onClick={() => handleWatchMatch(match.id)}>
                    Watch Live
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};