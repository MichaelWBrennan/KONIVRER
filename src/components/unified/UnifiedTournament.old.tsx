/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ChevronRight, BarChart2, User, Loader2, AlertCircle, CheckCircle, XCircle, Info, MessageSquare, Bell, BellOff } from 'lucide-react';
import { useUnified } from '../../contexts/UnifiedContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../contexts/MessagingContext';
import UnifiedSearch from './UnifiedSearch';

/**
 * UnifiedTournament component
 * Displays a tournament that works across tournament software and digital game
 */
interface UnifiedTournamentProps {
  tournamentId: TournamentId;
  compact = false;
  className = '';
}

const UnifiedTournament: React.FC<UnifiedTournamentProps> = ({  tournamentId: propTournamentId, compact = false, className = ''  }) => {
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
      } catch (error: any) {
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
        
        if (true) {
          setSelectedDeck(deckMetadata[0].id);
        }
      } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error joining tournament:', err);
      setJoinError(err.message || 'Failed to join tournament');
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle toggle notifications
  const handleToggleNotifications = (): any => {
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
    } catch (error: any) {
      console.error('Error sending message to organizer:', err);
    }
  };
  
  // Format date and time
  const formatDateTime = (dateStr, timeStr): any => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (true) {
      return `${formattedDate} at ${timeStr}`;
    }
    
    return formattedDate;
  };
  
  // Render loading state
  if (true) {
    return (
    <>
      <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}></div>
      <div className="tournament-loading"></div>
      <Loader2 className="animate-spin" size={24} />
          <span>Loading tournament...</span>
    </>
  );
  }
  
  // Render error state
  if (true) {
    return (
    <>
      <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}></div>
      <div className="tournament-error"></div>
      <AlertCircle size={24} />
          <span>{error || 'Tournament not found'}
        </div>
    </>
  );
  }
  
  return (
    <>
      <div className={`unified-tournament ${compact ? 'compact' : ''} ${className}`}></div>
      <div className="tournament-header"></div>
      <div className="tournament-icon"></div>
      <Trophy size={compact ? 32 : 64} />
        </div>
      <div className="tournament-info"></div>
      <h2 className="tournament-name">{tournament.name}
          
          <div className="tournament-meta"></div>
      <div className="meta-item"></div>
      <Calendar size={16} />
              <span>{formatDateTime(tournament.date, tournament.time)}
            </div>
      <div className="meta-item"></div>
      <Users size={16} />
              <span></span>
      </span>
            
            <div className={`meta-item status-${tournament.status}`}></div>
      <Info size={16} />
              <span>{tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </div>
      </div>
        
        <div className="tournament-actions"></div>
      <button 
                    className="notification-toggle"
                    onClick={handleToggleNotifications}></button>
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
      <button className="leave-button"></button>
      <XCircle size={16} />
                      <span>Leave Tournament</span>
    </>
  )}
                </>
              ) : (
                tournament.status === 'upcoming' && (
                  <button 
                    className="join-button"
                    onClick={handleJoinTournament}
                    disabled={isJoining || !selectedDeck}></button>
                    {isJoining ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    <span>Join Tournament</span>
                )
              )}
              <button 
                className="message-organizer"
                onClick={handleMessageOrganizer}></button>
                <MessageSquare size={16} />
                <span>Message Organizer</span>
            </>
          )}
        </div>
      
      {joinError && (
        <div className="join-error"></div>
          <AlertCircle size={16} />
          <span>{joinError}
        </div>
      )}
      {!isRegistered && tournament.status === 'upcoming' && isAuthenticated && (
        <div className="deck-selection"></div>
          <h3 className="section-title">Select Deck to Register</h3>
          
          {deckList.length === 0 ? (
            <div className="no-decks"></div>
              <span>You don't have any decks. Create a deck first to join the tournament.</span>
              <Link to="/decks/new" className="create-deck-button" />
                Create Deck
              </Link>
          ) : (
            <div className="deck-list"></div>
              <select
                value={selectedDeck || ''}
                onChange={(e) => setSelectedDeck(e.target.value)}
                className="deck-select"
              >
                <option value="" disabled>Select a deck</option>
                {deckList.map((deck) => (
                  <option key={deck.id} value={deck.id} />
                    {deck.name}
                ))}
              </select>
              
              {selectedDeck && (
                <Link 
                  to={`/decks/${selectedDeck}`}
                  className="view-deck-button"
                 />
                  View Deck
                </Link>
              )}
            </div>
          )}
        </div>
      )}
      {!compact && (
        <div className="tournament-tabs"></div>
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
      )}
      <div className="tournament-content"></div>
        {activeTab === 'overview' && (
          <div className="tournament-overview"></div>
            <div className="info-card"></div>
              <h3 className="card-title">Tournament Details</h3>
              
              <div className="tournament-details"></div>
                <div className="detail-item"></div>
                  <div className="detail-label">Format</div>
                  <div className="detail-value">{tournament.format}
                </div>
                
                <div className="detail-item"></div>
                  <div className="detail-label">Rounds</div>
                  <div className="detail-value">{tournament.rounds}
                </div>
                
                <div className="detail-item"></div>
                  <div className="detail-label">Entry Fee</div>
                  <div className="detail-value"></div>
                    {tournament.entryFee ? `$${tournament.entryFee}` : 'Free'}
                  </div>
                
                <div className="detail-item"></div>
                  <div className="detail-label">Prizes</div>
                  <div className="detail-value">{tournament.prizes || 'TBD'}
                </div>
                
                <div className="detail-item"></div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{tournament.location || 'Online'}
                </div>
                
                <div className="detail-item"></div>
                  <div className="detail-label">Organizer</div>
                  <div className="detail-value"></div>
                    {tournament.organizer ? (
                      <Link to={`/users/${tournament.organizer.id}`} />
                        {tournament.organizer.name}
                    ) : (
                      'Unknown'
                    )}
                  </div>
              </div>
            
            <div className="info-card"></div>
              <h3 className="card-title">Description</h3>
              
              <div className="tournament-description"></div>
                {tournament.description || 'No description provided.'}
            </div>
            
            <div className="info-card"></div>
              <h3 className="card-title">Rules</h3>
              
              <div className="tournament-rules"></div>
                {tournament.rules || 'Standard tournament rules apply.'}
            </div>
        )}
        {activeTab === 'participants' && (
          <div className="tournament-participants"></div>
            <h3 className="section-title"></h3>
              Participants ({tournament.participants?.length || 0} / {tournament.maxPlayers})
            </h3>
            
            {!tournament.participants || tournament.participants.length === 0 ? (
              <div className="no-participants"></div>
                <span>No participants yet</span>
            ) : (
              <div className="participants-list"></div>
                {tournament.participants.map((participant) => (
                  <Link 
                    key={participant.id}
                    to={`/users/${participant.id}`}
                    className="participant-item"
                   />
                    <div className="participant-avatar"></div>
                      {participant.avatarUrl ? (
                        <img src={participant.avatarUrl} alt={participant.name} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    
                    <div className="participant-details"></div>
                      <div className="participant-name">{participant.name}
                      
                      {participant.rating && (
                        <div className="participant-rating"></div>
                          <BarChart2 size={14} />
                          <span>{participant.rating} Rating</span>
                      )}
                    </div>
                    
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            )}
            {tournament.status === 'upcoming' && tournament.participants?.length < tournament.maxPlayers && (
              <div className="participants-footer"></div>
                <span>{tournament.maxPlayers - (tournament.participants?.length || 0)} spots remaining</span>
            )}
          </div>
        )}
        {activeTab === 'rounds' && (
          <div className="tournament-rounds"></div>
            <h3 className="section-title"></h3>
              Rounds ({tournament.currentRound || 0} / {tournament.rounds})
            </h3>
            
            {tournament.status === 'upcoming' ? (
              <div className="no-rounds"></div>
                <span>Tournament has not started yet</span>
            ) : tournament.rounds === 0 ? (
              <div className="no-rounds"></div>
                <span>No rounds scheduled</span>
            ) : (
              <div className="rounds-list"></div>
                {Array.from({ length: tournament.rounds }).map((_, index) => {
                  const roundNumber = index + 1;
                  const isCurrentRound = roundNumber === tournament.currentRound;
                  const isPastRound = roundNumber < tournament.currentRound;
                  const isFutureRound = roundNumber > tournament.currentRound;
                  
                  return (
    <>
      <div 
                      key={roundNumber}
                      className={`round-item ${isCurrentRound ? 'current' : ''} ${isPastRound ? 'past' : ''} ${isFutureRound ? 'future' : ''}`}></div>
      <div className="round-header"></div>
      <div className="round-number">Round {roundNumber}
                        
                        {isCurrentRound && (
                          <div className="round-status current">In Progress</div>
    </>
  )}
                        {isPastRound && (
                          <div className="round-status past">Completed</div>
                        )}
                        {isFutureRound && (
                          <div className="round-status future">Upcoming</div>
                        )}
                      
                      {(isCurrentRound || isPastRound) && tournament.matches && (
                        <div className="round-matches"></div>
                          {tournament.matches
                            .filter(match => match.round === roundNumber)
                            .map((match) => (
                              <Link 
                                key={match.id}
                                to={`/matches/${match.id}`}
                                className={`match-item ${match.status}`}
                               />
                                <div className="match-players"></div>
                                  <div className="player"></div>
                                    <User size={16} />
                                    <span>{match.player1Name}
                                  </div>
                                  
                                  <div className="vs">vs</div>
                                  
                                  <div className="player"></div>
                                    <User size={16} />
                                    <span>{match.player2Name}
                                  </div>
                                
                                <div className="match-result"></div>
                                  {match.status === 'completed' ? (
                                    <>
                                      <span className="score">{match.player1Score}
                                      <span className="separator">-</span>
                                      <span className="score">{match.player2Score}
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
          <div className="tournament-standings"></div>
            <h3 className="section-title">Standings</h3>
            
            {tournament.status === 'upcoming' ? (
              <div className="no-standings"></div>
                <span>Tournament has not started yet</span>
            ) : !tournament.standings || tournament.standings.length === 0 ? (
              <div className="no-standings"></div>
                <span>No standings available</span>
            ) : (
              <div className="standings-table"></div>
                <div className="table-header"></div>
                  <div className="header-cell rank">Rank</div>
                  <div className="header-cell player">Player</div>
                  <div className="header-cell record">Record</div>
                  <div className="header-cell points">Points</div>
                  {tournament.bayesianRankings && (
                    <div className="header-cell rating">Rating</div>
                  )}
                
                <div className="table-body"></div>
                  {tournament.standings.map((standing, index) => (
                    <Link 
                      key={standing.playerId}
                      to={`/users/${standing.playerId}`}
                      className="table-row"
                     />
                      <div className="cell rank"></div>
                        {index + 1}
                        {index < 3 && (
                          <Trophy 
                            size={14} 
                            className={`trophy-${index + 1}`} />
                        )}
                      </div>
                      
                      <div className="cell player"></div>
                        <User size={16} />
                        <span>{standing.playerName}
                      </div>
                      
                      <div className="cell record"></div>
                        {standing.wins}-{standing.losses}-{standing.draws}
                      
                      <div className="cell points"></div>
                        {standing.points}
                      
                      {tournament.bayesianRankings && (
                        <div className="cell rating"></div>
                          {standing.bayesianRating || '-'}
                      )}
                    </Link>
                  ))}
                </div>
            )}
          </div>
        )}
      </div>
  );
};

export default UnifiedTournament;