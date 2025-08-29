import React, { useState, useEffect } from 'react';
import * as s from './tournaments.css.ts';

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

export const Tournaments: React.FC : any = () => {
  const [tournaments]: any = useState<Tournament[]>([]);
  const [liveMatches]: any = useState<LiveMatch[]>([]);
  const [selectedTab, setSelectedTab]: any = useState<'upcoming' | 'active' | 'live'>('upcoming');

  useEffect(() => {
    loadTournaments();
    loadLiveMatches();
  }, []);

  const loadTournaments: any = async () => {
    // Load tournaments from API
    try {
      // const response: any = await fetch('/api/tournaments');
      // const tournamentsData: any = await response.json();
      // setTournaments(tournamentsData);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  };

  const loadLiveMatches: any = async () => {
    // Load live matches from API
    try {
      // const response: any = await fetch('/api/live-matches');
      // const matchesData: any = await response.json();
      // setLiveMatches(matchesData);
    } catch (error) {
      console.error('Failed to load live matches:', error);
    }
  };

  const handleJoinTournament: any = (tournamentId: string) => {
    console.log('Join tournament:', tournamentId);
  };

  const handleWatchMatch: any = (matchId: string) => {
    console.log('Watch match:', matchId);
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Tournaments</h1>
        <p>Compete in competitive KONIVRER tournaments</p>
      </div>

      <div className={s.tabs}>
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

      <div className={s.content}>
        {selectedTab === 'upcoming' && (
          <div className={s.section}>
            {tournaments.length === 0 ? (
              <div className={s.empty}>
                <h3>No Upcoming Tournaments</h3>
                <p>Check back later for new tournament announcements.</p>
              </div>
            ) : (
              tournaments
                .filter(t => t.status === 'upcoming')
                .map(tournament => (
                  <div key={tournament.id} className={s.card}>
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
          <div className={s.section}>
            {tournaments.filter(t => t.status === 'active').length === 0 ? (
              <div className={s.empty}>
                <h3>No Active Tournaments</h3>
                <p>No tournaments are currently in progress.</p>
              </div>
            ) : (
              tournaments
                .filter(t => t.status === 'active')
                .map(tournament => (
                  <div key={tournament.id} className={s.card}>
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
          <div className={s.section}>
            {liveMatches.length === 0 ? (
              <div className={s.empty}>
                <h3>No Live Matches</h3>
                <p>No matches are currently being streamed.</p>
              </div>
            ) : (
              liveMatches.map(match => (
                <div key={match.id} className={s.matchCard}>
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