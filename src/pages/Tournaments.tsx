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
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'active' | 'live'>('upcoming');

  useEffect(() => {
    // Initialize with sample tournaments
    const sampleTournaments: Tournament[] = [
      {
        id: '1',
        name: 'Weekly Standard Championship',
        format: 'Standard',
        status: 'upcoming',
        entryFee: 10,
        prizePool: 500,
        participants: 45,
        maxParticipants: 64,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: '3-4 hours'
      },
      {
        id: '2',
        name: 'Modern Masters Series',
        format: 'Modern',
        status: 'active',
        entryFee: 25,
        prizePool: 1200,
        participants: 32,
        maxParticipants: 32,
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Started 1 hour ago
        duration: '4-5 hours'
      },
      {
        id: '3',
        name: 'Draft Friday Night',
        format: 'Draft',
        status: 'upcoming',
        entryFee: 15,
        prizePool: 300,
        participants: 12,
        maxParticipants: 16,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: '2-3 hours'
      }
    ];

    const sampleLiveMatches: LiveMatch[] = [
      {
        id: '1',
        player1: 'ProPlayer_Mike',
        player2: 'CardMaster_Sarah',
        round: 3,
        status: 'playing',
        viewers: 847
      },
      {
        id: '2',
        player1: 'Lightning_Joe',
        player2: 'ControlFreak_99',
        round: 2,
        status: 'playing',
        viewers: 234
      },
      {
        id: '3',
        player1: 'GreenRamp_Player',
        player2: 'BurnSpecialist',
        round: 3,
        status: 'player1_won',
        viewers: 156
      }
    ];

    setTournaments(sampleTournaments);
    setLiveMatches(sampleLiveMatches);
  }, []);

  const joinTournament = (tournamentId: string) => {
    setTournaments(tournaments.map(t => 
      t.id === tournamentId 
        ? { ...t, participants: t.participants + 1 }
        : t
    ));
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <div key={tournament.id} className="tournament-card">
      <div className="tournament-header">
        <h3>{tournament.name}</h3>
        <div className={`status-badge ${tournament.status}`}>
          {tournament.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>
      
      <div className="tournament-details">
        <div className="detail-row">
          <span>Format:</span>
          <span>{tournament.format}</span>
        </div>
        <div className="detail-row">
          <span>Entry Fee:</span>
          <span>${tournament.entryFee}</span>
        </div>
        <div className="detail-row">
          <span>Prize Pool:</span>
          <span>${tournament.prizePool}</span>
        </div>
        <div className="detail-row">
          <span>Participants:</span>
          <span>{tournament.participants}/{tournament.maxParticipants}</span>
        </div>
        <div className="detail-row">
          <span>Start Time:</span>
          <span>{tournament.startTime.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span>Duration:</span>
          <span>{tournament.duration}</span>
        </div>
      </div>

      <div className="tournament-actions">
        {tournament.status === 'upcoming' && tournament.participants < tournament.maxParticipants ? (
          <button 
            onClick={() => joinTournament(tournament.id)} 
            className="btn btn-primary"
          >
            Join Tournament
          </button>
        ) : tournament.status === 'active' ? (
          <button className="btn btn-secondary">View Bracket</button>
        ) : (
          <button className="btn btn-disabled" disabled>Full</button>
        )}
      </div>
    </div>
  );

  const renderLiveMatch = (match: LiveMatch) => (
    <div key={match.id} className="live-match-card">
      <div className="match-players">
        <div className={`player ${match.status === 'player1_won' ? 'winner' : ''}`}>
          <span className="player-name">{match.player1}</span>
        </div>
        <div className="vs">VS</div>
        <div className={`player ${match.status === 'player2_won' ? 'winner' : ''}`}>
          <span className="player-name">{match.player2}</span>
        </div>
      </div>
      
      <div className="match-info">
        <span>Round {match.round}</span>
        <span className="viewer-count">👁 {match.viewers} viewers</span>
      </div>
      
      <div className="match-status">
        {match.status === 'playing' ? (
          <div className="live-indicator">🔴 LIVE</div>
        ) : (
          <div className="completed">Match Complete</div>
        )}
      </div>
      
      <button className="btn btn-secondary">Watch Stream</button>
    </div>
  );

  return (
    <div className="tournaments-container">
      <div className="tournaments-header">
        <h1>Live Tournaments</h1>
        <p>Compete with players worldwide in official KONIVRER tournaments</p>
      </div>

      <div className="tournaments-tabs">
        <button 
          className={`tab ${selectedTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setSelectedTab('upcoming')}
        >
          Upcoming Tournaments
        </button>
        <button 
          className={`tab ${selectedTab === 'active' ? 'active' : ''}`}
          onClick={() => setSelectedTab('active')}
        >
          Active Tournaments
        </button>
        <button 
          className={`tab ${selectedTab === 'live' ? 'active' : ''}`}
          onClick={() => setSelectedTab('live')}
        >
          Live Matches
        </button>
      </div>

      <div className="tournaments-content">
        {selectedTab === 'live' ? (
          <div className="live-matches-section">
            <div className="section-header">
              <h2>🔴 Live Matches</h2>
              <p>Watch top players compete in real-time</p>
            </div>
            <div className="live-matches-grid">
              {liveMatches.map(renderLiveMatch)}
            </div>
          </div>
        ) : (
          <div className="tournaments-section">
            <div className="section-header">
              <h2>
                {selectedTab === 'upcoming' ? '📅 Upcoming Tournaments' : '🏆 Active Tournaments'}
              </h2>
              <p>
                {selectedTab === 'upcoming' 
                  ? 'Register for upcoming tournaments' 
                  : 'Currently running tournaments'}
              </p>
            </div>
            <div className="tournaments-grid">
              {tournaments
                .filter(t => t.status === selectedTab)
                .map(renderTournamentCard)}
            </div>
          </div>
        )}
      </div>

      <div className="tournament-stats">
        <div className="stat-card">
          <h3>Tournament Stats</h3>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">2,847</span>
              <span className="stat-label">Active Players</span>
            </div>
            <div className="stat">
              <span className="stat-value">156</span>
              <span className="stat-label">Live Matches</span>
            </div>
            <div className="stat">
              <span className="stat-value">$45,000</span>
              <span className="stat-label">Total Prize Pool</span>
            </div>
          </div>
        </div>

        <div className="leaderboard-card">
          <h3>🏆 Tournament Leaderboard</h3>
          <div className="leaderboard">
            <div className="leaderboard-item">
              <span className="rank">1</span>
              <span className="player">ProPlayer_Mike</span>
              <span className="points">2,450 pts</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">2</span>
              <span className="player">CardMaster_Sarah</span>
              <span className="points">2,380 pts</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">3</span>
              <span className="player">Lightning_Joe</span>
              <span className="points">2,120 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};