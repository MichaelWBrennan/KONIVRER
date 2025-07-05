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
const UnifiedUserProfile = ({ userId: propUserId, compact = false, className = '' }) => {
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
      } catch (err) {
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
      if (!compact) {
        navigate('/messages/' + userId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}>
        <div className="profile-loading">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error || !profile) {
    return (
      <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}>
        <div className="profile-error">
          <AlertCircle size={24} />
          <span>{error || 'User not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`unified-user-profile ${compact ? 'compact' : ''} ${className}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.displayName} />
          ) : (
            <User size={compact ? 32 : 64} />
          )}
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">{profile.displayName}</h2>
          <div className="profile-username">@{profile.username}</div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <Trophy size={16} />
              <span>{profile.stats.rank}</span>
            </div>
            
            <div className="stat-item">
              <BarChart2 size={16} />
              <span>{profile.stats.rating} Rating</span>
            </div>
            
            <div className="stat-item">
              <Calendar size={16} />
              <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {!isCurrentUser && !compact && (
          <div className="profile-actions">
            <button className="message-button" onClick={() => navigate('/messages/' + userId)}>
              <MessageSquare size={16} />
              <span>Message</span>
            </button>
            
            <button className="challenge-button">
              <Trophy size={16} />
              <span>Challenge</span>
            </button>
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="profile-tabs">
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
      
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-overview">
            <div className="stats-card">
              <h3 className="card-title">
                <Trophy size={16} />
                <span>Game Stats</span>
              </h3>
              
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{profile.stats.wins}</div>
                  <div className="stat-label">Wins</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-value">{profile.stats.losses}</div>
                  <div className="stat-label">Losses</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-value">{profile.stats.draws}</div>
                  <div className="stat-label">Draws</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-value">{(profile.stats.winRate * 100).toFixed(1)}%</div>
                  <div className="stat-label">Win Rate</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card">
              <h3 className="card-title">
                <Award size={16} />
                <span>Tournament Stats</span>
              </h3>
              
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{profile.stats.tournamentWins}</div>
                  <div className="stat-label">Wins</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-value">{profile.stats.tournamentTop8s}</div>
                  <div className="stat-label">Top 8s</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card">
              <h3 className="card-title">
                <Package size={16} />
                <span>Favorite Decks</span>
              </h3>
              
              <div className="favorite-decks">
                {profile.stats.favoriteDecks.map((deck) => (
                  <Link 
                    key={deck.id}
                    to={`/decks/${deck.id}`}
                    className="deck-item"
                  >
                    <div className="deck-name">{deck.name}</div>
                    <div className="deck-winrate">{(deck.winRate * 100).toFixed(1)}% Win Rate</div>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
            
            {!compact && !isCurrentUser && (
              <div className="message-card">
                <h3 className="card-title">
                  <MessageSquare size={16} />
                  <span>Send Message</span>
                </h3>
                
                <div className="message-form">
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
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <MessageSquare size={16} />
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'matches' && (
          <div className="profile-matches">
            <h3 className="section-title">Recent Matches</h3>
            
            <div className="matches-list">
              {profile.recentMatches.length === 0 ? (
                <div className="no-matches">
                  <span>No recent matches</span>
                </div>
              ) : (
                profile.recentMatches.map((match) => (
                  <Link 
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className={`match-item ${match.result}`}
                  >
                    <div className="match-result-indicator"></div>
                    
                    <div className="match-details">
                      <div className="match-opponent">
                        <Users size={16} />
                        <span>vs. {match.opponent}</span>
                      </div>
                      
                      <div className="match-date">
                        <Clock size={14} />
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="match-result-text">
                      {match.result.toUpperCase()}
                    </div>
                    
                    <ChevronRight size={16} />
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'tournaments' && (
          <div className="profile-tournaments">
            <h3 className="section-title">Recent Tournaments</h3>
            
            <div className="tournaments-list">
              {profile.recentTournaments.length === 0 ? (
                <div className="no-tournaments">
                  <span>No recent tournaments</span>
                </div>
              ) : (
                profile.recentTournaments.map((tournament) => (
                  <Link 
                    key={tournament.id}
                    to={`/tournaments/${tournament.id}`}
                    className="tournament-item"
                  >
                    <div className="tournament-icon">
                      <Trophy size={20} />
                    </div>
                    
                    <div className="tournament-details">
                      <div className="tournament-name">{tournament.name}</div>
                      
                      <div className="tournament-meta">
                        <div className="tournament-date">
                          <Calendar size={14} />
                          <span>{new Date(tournament.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="tournament-placement">
                          <Award size={14} />
                          <span>Placed {tournament.placement}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight size={16} />
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'decks' && (
          <div className="profile-decks">
            <h3 className="section-title">Favorite Decks</h3>
            
            <div className="decks-list">
              {profile.stats.favoriteDecks.length === 0 ? (
                <div className="no-decks">
                  <span>No favorite decks</span>
                </div>
              ) : (
                profile.stats.favoriteDecks.map((deck) => (
                  <Link 
                    key={deck.id}
                    to={`/decks/${deck.id}`}
                    className="deck-card"
                  >
                    <div className="deck-icon">
                      <Package size={24} />
                    </div>
                    
                    <div className="deck-details">
                      <div className="deck-name">{deck.name}</div>
                      <div className="deck-winrate">{(deck.winRate * 100).toFixed(1)}% Win Rate</div>
                    </div>
                    
                    <ChevronRight size={16} />
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