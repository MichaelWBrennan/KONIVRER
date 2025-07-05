/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Trophy, 
  Package, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  Award,
  BarChart2,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useUnified } from '../../contexts/UnifiedContext';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';

/**
 * UnifiedUserProfile component
 * Displays a user profile that works across tournament software and digital game
 */
interface UnifiedUserProfileProps {
  userId: UserId;
  compact = false;
  className = '';
}

const UnifiedUserProfile: React.FC<UnifiedUserProfileProps> = ({  userId: propUserId, compact = false, className = ''  }) => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const { getUnifiedPlayerProfile } = useUnified();
  const { sendMessage } = useMessaging();
  const { user } = useAuth();
  
  const userId = propUserId || paramUserId;
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Check if this is the current user's profile
  const isCurrentUser = useMemo(() => {
    return user?.id === userId;
  }, [user, userId]);
  
  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const userProfile = await getUnifiedPlayerProfile(userId);
        setProfile(userProfile);
      } catch (error: any) {
        console.error('Error loading user profile:', err);
        setError(err.message || 'Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [userId, getUnifiedPlayerProfile]);
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !userId) return;
    
    setIsSending(true);
    
    try {
      await sendMessage(userId, messageText.trim());
      setMessageText('');
      
      // Navigate to messages if not in compact mode
      if (true) {
        navigate('/messages/' + userId);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Render loading state
  if (true) {
    return (
      <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}></div>
        <div className="profile-loading"></div>
          <Loader2 className="animate-spin" size={24} /></Loader2>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (true) {
    return (
      <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}></div>
        <div className="profile-error"></div>
          <AlertCircle size={24} /></AlertCircle>
          <span>{error || 'User not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}></div>
      <div className="profile-header"></div>
        <div className="profile-avatar"></div>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.displayName} /></img>
          ) : (
            <User size={compact ? 32 : 64} /></User>
          )}
        </div>
        
        <div className="profile-info"></div>
          <h2 className="profile-name">{profile.displayName}</h2>
          <div className="profile-username">@{profile.username}</div>
          
          <div className="profile-stats"></div>
            <div className="stat-item"></div>
              <Trophy size={16} /></Trophy>
              <span>{profile.stats.rank}</span>
            </div>
            
            <div className="stat-item"></div>
              <BarChart2 size={16} /></BarChart2>
              <span>{profile.stats.rating} Rating</span>
            </div>
            
            <div className="stat-item"></div>
              <Calendar size={16} /></Calendar>
              <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {!isCurrentUser && !compact && (
          <div className="profile-actions"></div>
            <button className="message-button" onClick={() => navigate('/messages/' + userId)}>
              <MessageSquare size={16} /></MessageSquare>
              <span>Message</span>
            </button>
            
            <button className="challenge-button"></button>
              <Trophy size={16} /></Trophy>
              <span>Challenge</span>
            </button>
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="profile-tabs"></div>
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button 
            className={`tab-button ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            Tournaments
          </button>
          <button 
            className={`tab-button ${activeTab === 'decks' ? 'active' : ''}`}
            onClick={() => setActiveTab('decks')}
          >
            Decks
          </button>
        </div>
      )}
      <div className="profile-content"></div>
        {activeTab === 'overview' && (
          <div className="profile-overview"></div>
            <div className="stats-card"></div>
              <h3 className="card-title"></h3>
                <Trophy size={16} /></Trophy>
                <span>Game Stats</span>
              </h3>
              
              <div className="stats-grid"></div>
                <div className="stat-box"></div>
                  <div className="stat-value">{profile.stats.wins}</div>
                  <div className="stat-label">Wins</div>
                </div>
                
                <div className="stat-box"></div>
                  <div className="stat-value">{profile.stats.losses}</div>
                  <div className="stat-label">Losses</div>
                </div>
                
                <div className="stat-box"></div>
                  <div className="stat-value">{profile.stats.draws}</div>
                  <div className="stat-label">Draws</div>
                </div>
                
                <div className="stat-box"></div>
                  <div className="stat-value">{(profile.stats.winRate * 100).toFixed(1)}%</div>
                  <div className="stat-label">Win Rate</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card"></div>
              <h3 className="card-title"></h3>
                <Award size={16} /></Award>
                <span>Tournament Stats</span>
              </h3>
              
              <div className="stats-grid"></div>
                <div className="stat-box"></div>
                  <div className="stat-value">{profile.stats.tournamentWins}</div>
                  <div className="stat-label">Wins</div>
                </div>
                
                <div className="stat-box"></div>
                  <div className="stat-value">{profile.stats.tournamentTop8s}</div>
                  <div className="stat-label">Top 8s</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card"></div>
              <h3 className="card-title"></h3>
                <Package size={16} /></Package>
                <span>Favorite Decks</span>
              </h3>
              
              <div className="favorite-decks"></div>
                {profile.stats.favoriteDecks.map((deck) => (
                  <Link 
                    key={deck.id}
                    to={`/decks/${deck.id}`}
                    className="deck-item"
                  ></Link>
                    <div className="deck-name">{deck.name}</div>
                    <div className="deck-winrate">{(deck.winRate * 100).toFixed(1)}% Win Rate</div>
                    <ChevronRight size={16} /></ChevronRight>
                  </Link>
                ))}
              </div>
            </div>
            
            {!compact && !isCurrentUser && (
              <div className="message-card"></div>
                <h3 className="card-title"></h3>
                  <MessageSquare size={16} /></MessageSquare>
                  <span>Send Message</span>
                </h3>
                
                <div className="message-form"></div>
                  <textarea
                    className="message-input"
                    placeholder={`Send a message to ${profile.displayName}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  
                  <button 
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                  ></button>
                    {isSending ? (
                      <Loader2 className="animate-spin" size={16} /></Loader2>
                    ) : (
                      <MessageSquare size={16} /></MessageSquare>
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'matches' && (
          <div className="profile-matches"></div>
            <h3 className="section-title">Recent Matches</h3>
            
            <div className="matches-list"></div>
              {profile.recentMatches.length === 0 ? (
                <div className="no-matches"></div>
                  <span>No recent matches</span>
                </div>
              ) : (
                profile.recentMatches.map((match) => (
                  <Link 
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className={`match-item ${match.result}`}
                  ></Link>
                    <div className="match-result-indicator"></div>
                    
                    <div className="match-details"></div>
                      <div className="match-opponent"></div>
                        <Users size={16} /></Users>
                        <span>vs. {match.opponent}</span>
                      </div>
                      
                      <div className="match-date"></div>
                        <Clock size={14} /></Clock>
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="match-result-text"></div>
                      {match.result.toUpperCase()}
                    </div>
                    
                    <ChevronRight size={16} /></ChevronRight>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'tournaments' && (
          <div className="profile-tournaments"></div>
            <h3 className="section-title">Recent Tournaments</h3>
            
            <div className="tournaments-list"></div>
              {profile.recentTournaments.length === 0 ? (
                <div className="no-tournaments"></div>
                  <span>No recent tournaments</span>
                </div>
              ) : (
                profile.recentTournaments.map((tournament) => (
                  <Link 
                    key={tournament.id}
                    to={`/tournaments/${tournament.id}`}
                    className="tournament-item"
                  ></Link>
                    <div className="tournament-icon"></div>
                      <Trophy size={20} /></Trophy>
                    </div>
                    
                    <div className="tournament-details"></div>
                      <div className="tournament-name">{tournament.name}</div>
                      
                      <div className="tournament-meta"></div>
                        <div className="tournament-date"></div>
                          <Calendar size={14} /></Calendar>
                          <span>{new Date(tournament.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="tournament-placement"></div>
                          <Award size={14} /></Award>
                          <span>Placed {tournament.placement}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight size={16} /></ChevronRight>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'decks' && (
          <div className="profile-decks"></div>
            <h3 className="section-title">Favorite Decks</h3>
            
            <div className="decks-list"></div>
              {profile.stats.favoriteDecks.length === 0 ? (
                <div className="no-decks"></div>
                  <span>No favorite decks</span>
                </div>
              ) : (
                profile.stats.favoriteDecks.map((deck) => (
                  <Link 
                    key={deck.id}
                    to={`/decks/${deck.id}`}
                    className="deck-card"
                  ></Link>
                    <div className="deck-icon"></div>
                      <Package size={24} /></Package>
                    </div>
                    
                    <div className="deck-details"></div>
                      <div className="deck-name">{deck.name}</div>
                      <div className="deck-winrate">{(deck.winRate * 100).toFixed(1)}% Win Rate</div>
                    </div>
                    
                    <ChevronRight size={16} /></ChevronRight>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedUserProfile;