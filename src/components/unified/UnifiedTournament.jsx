/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  ChevronRight,
  Award,
  BarChart2,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  MessageSquare,
  Bell,
  BellOff
} from 'lucide-react';
import { useUnified } from '../../contexts/UnifiedContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../contexts/MessagingContext';
import UnifiedSearch from './UnifiedSearch';

/**
 * UnifiedTournament component
 * Displays a tournament that works across tournament software and digital game
 */
const UnifiedTournament = ({ tournamentId: propTournamentId, compact = false, className = '' }) => {
  const { tournamentId: paramTournamentId } = useParams();
  const navigate = useNavigate();
  const { tournaments, decks, joinTournament } = useUnified();
  const { user, isAuthenticated } = useAuth();
  const { sendMessage } = useMessaging();
  
  const tournamentId = propTournamentId || paramTournamentId;
  
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckList, setDeckList] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Check if user is registered for this tournament
  const isRegistered = useMemo(() => {
    if (!tournament || !isAuthenticated) return false;
    
    return tournament.participants?.some(p => p.id === user?.id) || false;
  }, [tournament, isAuthenticated, user]);
  
  // Load tournament data
  useEffect(() => {
    const loadTournament = async () => {
      if (!tournamentId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tournamentData = await tournaments.getTournament(tournamentId);
        setTournament(tournamentData);
      } catch (err) {
        console.error('Error loading tournament:', err);
        setError(err.message || 'Failed to load tournament');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTournament();
  }, [tournamentId, tournaments]);
  
  // Load user decks
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadDecks = async () => {
      try {
        const deckMetadata = decks.getAllDeckMetadata();
        setDeckList(deckMetadata);
        
        if (deckMetadata.length > 0) {
          setSelectedDeck(deckMetadata[0].id);
        }
      } catch (err) {
        console.error('Error loading decks:', err);
      }
    };
    
    loadDecks();
  }, [isAuthenticated, decks]);
  
  // Handle join tournament
  const handleJoinTournament = async () => {
    if (!isAuthenticated || !tournamentId || !selectedDeck) return;
    
    setIsJoining(true);
    setJoinError(null);
    
    try {
      await joinTournament(tournamentId, selectedDeck);
      
      // Reload tournament data
      const tournamentData = await tournaments.getTournament(tournamentId);
      setTournament(tournamentData);
    } catch (err) {
      console.error('Error joining tournament:', err);
      setJoinError(err.message || 'Failed to join tournament');
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle toggle notifications
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  // Handle message organizer
  const handleMessageOrganizer = async () => {
    if (!isAuthenticated || !tournament?.organizer?.id) return;
    
    try {
      await sendMessage(
        tournament.organizer.id,
        `Hi, I have a question about the tournament "${tournament.name}"`
      );
      
      // Navigate to messages
      navigate('/messages/' + tournament.organizer.id);
    } catch (err) {
      console.error('Error sending message to organizer:', err);
    }
  };
  
  // Format date and time
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'TBD';
    
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (timeStr) {
      return `${formattedDate} at ${timeStr}`;
    }
    
    return formattedDate;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}>
        <div className="tournament-loading">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading tournament...</span>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error || !tournament) {
    return (
      <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}>
        <div className="tournament-error">
          <AlertCircle size={24} />
          <span>{error || 'Tournament not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}>
      <div className="tournament-header">
        <div className="tournament-icon">
          <Trophy size={compact ? 32 : 64} />
        </div>
        
        <div className="tournament-info">
          <h2 className="tournament-name">{tournament.name}</h2>
          
          <div className="tournament-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDateTime(tournament.date, tournament.time)}</span>
            </div>
            
            <div className="meta-item">
              <Users size={16} />
              <span>
                {tournament.participants?.length || 0} / {tournament.maxPlayers} Players
              </span>
            </div>
            
            <div className={`meta-item status-${tournament.status}`}>
              <Info size={16} />
              <span>{tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="tournament-actions">
          {isAuthenticated && (
            <>
              {isRegistered ? (
                <>
                  <button 
                    className="notification-toggle"
                    onClick={handleToggleNotifications}
                  >
                    {notificationsEnabled ? (
                      <>
                        <Bell size={16} />
                        <span>Notifications On</span>
                      </>
                    ) : (
                      <>
                        <BellOff size={16} />
                        <span>Notifications Off</span>
                      </>
                    )}
                  </button>
                  
                  {tournament.status === 'upcoming' && (
                    <button className="leave-button">
                      <XCircle size={16} />
                      <span>Leave Tournament</span>
                    </button>
                  )}
                </>
              ) : (
                tournament.status === 'upcoming' && (
                  <button 
                    className="join-button"
                    onClick={handleJoinTournament}
                    disabled={isJoining || !selectedDeck}
                  >
                    {isJoining ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    <span>Join Tournament</span>
                  </button>
                )
              )}
              
              <button 
                className="message-organizer"
                onClick={handleMessageOrganizer}
              >
                <MessageSquare size={16} />
                <span>Message Organizer</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      {joinError && (
        <div className="join-error">
          <AlertCircle size={16} />
          <span>{joinError}</span>
        </div>
      )}
      
      {!isRegistered && tournament.status === 'upcoming' && isAuthenticated && (
        <div className="deck-selection">
          <h3 className="section-title">Select Deck to Register</h3>
          
          {deckList.length === 0 ? (
            <div className="no-decks">
              <span>You don't have any decks. Create a deck first to join the tournament.</span>
              <Link to="/decks/new" className="create-deck-button">
                Create Deck
              </Link>
            </div>
          ) : (
            <div className="deck-list">
              <select
                value={selectedDeck || ''}
                onChange={(e) => setSelectedDeck(e.target.value)}
                className="deck-select"
              >
                <option value="" disabled>Select a deck</option>
                {deckList.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name}
                  </option>
                ))}
              </select>
              
              {selectedDeck && (
                <Link 
                  to={`/decks/${selectedDeck}`}
                  className="view-deck-button"
                >
                  View Deck
                </Link>
              )}
            </div>
          )}
        </div>
      )}
      
      {!compact && (
        <div className="tournament-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
          <button 
            className={`tab-button ${activeTab === 'rounds' ? 'active' : ''}`}
            onClick={() => setActiveTab('rounds')}
          >
            Rounds
          </button>
          <button 
            className={`tab-button ${activeTab === 'standings' ? 'active' : ''}`}
            onClick={() => setActiveTab('standings')}
          >
            Standings
          </button>
        </div>
      )}
      
      <div className="tournament-content">
        {activeTab === 'overview' && (
          <div className="tournament-overview">
            <div className="info-card">
              <h3 className="card-title">Tournament Details</h3>
              
              <div className="tournament-details">
                <div className="detail-item">
                  <div className="detail-label">Format</div>
                  <div className="detail-value">{tournament.format}</div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Rounds</div>
                  <div className="detail-value">{tournament.rounds}</div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Entry Fee</div>
                  <div className="detail-value">
                    {tournament.entryFee ? `$${tournament.entryFee}` : 'Free'}
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Prizes</div>
                  <div className="detail-value">{tournament.prizes || 'TBD'}</div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{tournament.location || 'Online'}</div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Organizer</div>
                  <div className="detail-value">
                    {tournament.organizer ? (
                      <Link to={`/users/${tournament.organizer.id}`}>
                        {tournament.organizer.name}
                      </Link>
                    ) : (
                      'Unknown'
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h3 className="card-title">Description</h3>
              
              <div className="tournament-description">
                {tournament.description || 'No description provided.'}
              </div>
            </div>
            
            <div className="info-card">
              <h3 className="card-title">Rules</h3>
              
              <div className="tournament-rules">
                {tournament.rules || 'Standard tournament rules apply.'}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'participants' && (
          <div className="tournament-participants">
            <h3 className="section-title">
              Participants ({tournament.participants?.length || 0} / {tournament.maxPlayers})
            </h3>
            
            {!tournament.participants || tournament.participants.length === 0 ? (
              <div className="no-participants">
                <span>No participants yet</span>
              </div>
            ) : (
              <div className="participants-list">
                {tournament.participants.map((participant) => (
                  <Link 
                    key={participant.id}
                    to={`/users/${participant.id}`}
                    className="participant-item"
                  >
                    <div className="participant-avatar">
                      {participant.avatarUrl ? (
                        <img src={participant.avatarUrl} alt={participant.name} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    
                    <div className="participant-details">
                      <div className="participant-name">{participant.name}</div>
                      
                      {participant.rating && (
                        <div className="participant-rating">
                          <BarChart2 size={14} />
                          <span>{participant.rating} Rating</span>
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            )}
            
            {tournament.status === 'upcoming' && tournament.participants?.length < tournament.maxPlayers && (
              <div className="participants-footer">
                <span>{tournament.maxPlayers - (tournament.participants?.length || 0)} spots remaining</span>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'rounds' && (
          <div className="tournament-rounds">
            <h3 className="section-title">
              Rounds ({tournament.currentRound || 0} / {tournament.rounds})
            </h3>
            
            {tournament.status === 'upcoming' ? (
              <div className="no-rounds">
                <span>Tournament has not started yet</span>
              </div>
            ) : tournament.rounds === 0 ? (
              <div className="no-rounds">
                <span>No rounds scheduled</span>
              </div>
            ) : (
              <div className="rounds-list">
                {Array.from({ length: tournament.rounds }).map((_, index) => {
                  const roundNumber = index + 1;
                  const isCurrentRound = roundNumber === tournament.currentRound;
                  const isPastRound = roundNumber < tournament.currentRound;
                  const isFutureRound = roundNumber > tournament.currentRound;
                  
                  return (
                    <div 
                      key={roundNumber}
                      className={`round-item ${isCurrentRound ? 'current' : ''} ${isPastRound ? 'past' : ''} ${isFutureRound ? 'future' : ''}`}
                    >
                      <div className="round-header">
                        <div className="round-number">Round {roundNumber}</div>
                        
                        {isCurrentRound && (
                          <div className="round-status current">In Progress</div>
                        )}
                        
                        {isPastRound && (
                          <div className="round-status past">Completed</div>
                        )}
                        
                        {isFutureRound && (
                          <div className="round-status future">Upcoming</div>
                        )}
                      </div>
                      
                      {(isCurrentRound || isPastRound) && tournament.matches && (
                        <div className="round-matches">
                          {tournament.matches
                            .filter(match => match.round === roundNumber)
                            .map((match) => (
                              <Link 
                                key={match.id}
                                to={`/matches/${match.id}`}
                                className={`match-item ${match.status}`}
                              >
                                <div className="match-players">
                                  <div className="player">
                                    <User size={16} />
                                    <span>{match.player1Name}</span>
                                  </div>
                                  
                                  <div className="vs">vs</div>
                                  
                                  <div className="player">
                                    <User size={16} />
                                    <span>{match.player2Name}</span>
                                  </div>
                                </div>
                                
                                <div className="match-result">
                                  {match.status === 'completed' ? (
                                    <>
                                      <span className="score">{match.player1Score}</span>
                                      <span className="separator">-</span>
                                      <span className="score">{match.player2Score}</span>
                                    </>
                                  ) : match.status === 'in_progress' ? (
                                    <span className="in-progress">In Progress</span>
                                  ) : (
                                    <span className="pending">Pending</span>
                                  )}
                                </div>
                                
                                <ChevronRight size={16} />
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'standings' && (
          <div className="tournament-standings">
            <h3 className="section-title">Standings</h3>
            
            {tournament.status === 'upcoming' ? (
              <div className="no-standings">
                <span>Tournament has not started yet</span>
              </div>
            ) : !tournament.standings || tournament.standings.length === 0 ? (
              <div className="no-standings">
                <span>No standings available</span>
              </div>
            ) : (
              <div className="standings-table">
                <div className="table-header">
                  <div className="header-cell rank">Rank</div>
                  <div className="header-cell player">Player</div>
                  <div className="header-cell record">Record</div>
                  <div className="header-cell points">Points</div>
                  {tournament.bayesianRankings && (
                    <div className="header-cell rating">Rating</div>
                  )}
                </div>
                
                <div className="table-body">
                  {tournament.standings.map((standing, index) => (
                    <Link 
                      key={standing.playerId}
                      to={`/users/${standing.playerId}`}
                      className="table-row"
                    >
                      <div className="cell rank">
                        {index + 1}
                        {index < 3 && (
                          <Trophy 
                            size={14} 
                            className={`trophy-${index + 1}`} 
                          />
                        )}
                      </div>
                      
                      <div className="cell player">
                        <User size={16} />
                        <span>{standing.playerName}</span>
                      </div>
                      
                      <div className="cell record">
                        {standing.wins}-{standing.losses}-{standing.draws}
                      </div>
                      
                      <div className="cell points">
                        {standing.points}
                      </div>
                      
                      {tournament.bayesianRankings && (
                        <div className="cell rating">
                          {standing.bayesianRating || '-'}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedTournament;