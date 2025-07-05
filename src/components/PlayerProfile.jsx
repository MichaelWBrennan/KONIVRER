/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  User,
  Trophy,
  Star,
  Calendar,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Crown,
  Shield,
  Sword,
  Heart,
  Eye,
  Settings,
  Edit,
  Share2,
  Medal,
  Zap,
  Clock,
  MapPin,
  Flag,
  Percent,
  CheckCircle,
  AlertCircle,
  Timer,
  Upload,
  FileText,
  Bell,
  BellRing,
  X,
  ExternalLink,
  RefreshCw,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  Wifi,
  WifiOff,
} from 'lucide-react';

const PlayerProfile = () => {
  const { playerId = 'player123' } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    loadPlayerEvents(playerId);
  }, [playerId]);
  
  const loadPlayerEvents = async (playerId) => {
    console.log(`Loading events for player: ${playerId}`);
    setLoading(true);
    try {
      // Simulate API call - replace with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data with enhanced melee.gg-style features
      setEvents([
        {
          id: 1,
          name: 'Friday Night KONIVRER',
          date: '2025-07-05',
          time: '19:00',
          venue: 'Local Game Store',
          address: '123 Main St, San Francisco, CA',
          status: 'active',
          round: 2,
          totalRounds: 4,
          record: '1-0-0',
          currentPlacement: 5,
          totalParticipants: 32,
          format: 'Standard',
          entryFee: '$15',
          prizePool: '$480',
          organizer: 'GameStore Events',
          decklistRequired: true,
          decklistSubmitted: true,
          bracketType: 'Swiss',
          timeControl: '50 minutes + 5 turns',
          streamUrl: 'https://twitch.tv/gamestore',
          isStreamed: true,
          registrationOpen: false,
          maxParticipants: 32,
          description: 'Weekly Friday night tournament with great prizes!'
        },
        {
          id: 2,
          name: 'Saturday Standard Showdown',
          date: '2025-07-06',
          time: '14:00',
          venue: 'Community Center',
          address: '456 Oak Ave, San Francisco, CA',
          status: 'upcoming',
          registrationDeadline: '2025-07-06T12:00:00',
          format: 'Standard',
          entryFee: '$20',
          prizePool: '$640',
          organizer: 'Community Events',
          decklistRequired: true,
          decklistSubmitted: false,
          bracketType: 'Swiss + Top 8',
          timeControl: '50 minutes + 5 turns',
          isStreamed: false,
          registrationOpen: true,
          maxParticipants: 32,
          currentParticipants: 28,
          description: 'Competitive Standard tournament with Top 8 playoff!'
        },

      ]);
      
      // Mock notifications
      setNotifications([
        {
          id: 1,
          type: 'pairing',
          title: 'Round 2 Pairing Available',
          message: 'Your Round 2 opponent has been assigned. Check your current match!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          eventId: 1,
          read: false
        },
        {
          id: 2,
          type: 'deadline',
          title: 'Decklist Deadline Approaching',
          message: 'Submit your decklist for Saturday Standard Showdown by 12:00 PM tomorrow.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          eventId: 2,
          read: false
        },

      ]);
      
      setPairings([
        {
          id: 1,
          eventId: 1,
          round: 2,
          opponent: 'Alex Johnson',
          opponentRank: 'Gold',
          table: 5,
          status: 'active',
          timeRemaining: 2400 // 40 minutes in seconds
        }
      ]);
    } catch (error) {
      console.error('Failed to load player events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const submitResult = async (pairingId, result, score) => {
    try {
      // Simulate API call - replace with actual API call in production
      console.log('Submitting result:', { pairingId, result, score });
      
      // Update local state
      setPairings(prev => prev.map(p => 
        p.id === pairingId 
          ? { ...p, status: 'completed', submittedResult: result, submittedScore: score }
          : p
      ));
      
      // Show success message
      alert(`Result submitted: ${result} (${score})`);
    } catch (error) {
      console.error('Failed to submit result:', error);
      alert('Failed to submit result. Please try again.');
    }
  };
  
  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  
  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'pairing': return Users;
      case 'deadline': return Clock;
      case 'result': return Trophy;
      default: return Bell;
    }
  };

  const playerData = {
    id: 'player123',
    username: 'ProPlayer123',
    displayName: 'Alex Chen',
    avatar: '/api/placeholder/120/120',
    joinDate: '2023-03-15',
    location: 'San Francisco, CA',
    favoriteHero: 'Zephyr',
    rank: 'Diamond',
    rankPoints: 2847,
    level: 42,
    stats: {
      totalGames: 1247,
      wins: 892,
      losses: 355,
      winRate: 71.5,
      tournamentWins: 23,
      topFinishes: 67,
      averageFinish: 3.2,
      favoriteFormat: 'Classic Constructed',
    },
    achievements: [
      {
        id: 1,
        name: 'Tournament Champion',
        description: 'Win a major tournament',
        icon: Trophy,
        rarity: 'legendary',
        earned: true,
      },
      {
        id: 2,
        name: 'Win Streak Master',
        description: 'Win 10 games in a row',
        icon: Target,
        rarity: 'rare',
        earned: true,
      },
      {
        id: 3,
        name: 'Meta Breaker',
        description: 'Win with an off-meta deck',
        icon: Star,
        rarity: 'epic',
        earned: true,
      },
      {
        id: 4,
        name: 'Perfect Record',
        description: 'Go undefeated in a tournament',
        icon: Crown,
        rarity: 'legendary',
        earned: false,
      },
      {
        id: 5,
        name: 'Deck Master',
        description: 'Create 50 unique decks',
        icon: Sword,
        rarity: 'rare',
        earned: true,
      },
      {
        id: 6,
        name: 'Community Leader',
        description: 'Help 100 new players',
        icon: Users,
        rarity: 'epic',
        earned: false,
      },
    ],
    recentMatches: [
      {
        id: 1,
        opponent: 'MetaKnight',
        result: 'win',
        score: '2-1',
        format: 'Classic Constructed',
        date: '2025-06-10',
        duration: '45m',
        deck: 'Elemental Storm Control',
        opponentDeck: 'Blazing Aggro Rush',
      },
      {
        id: 2,
        opponent: 'ShadowMaster',
        result: 'loss',
        score: '1-2',
        format: 'Blitz',
        date: '2025-06-09',
        duration: '32m',
        deck: 'Crystal Guardian',
        opponentDeck: 'Shadow Assassin',
      },
      {
        id: 3,
        opponent: 'NatureWarden',
        result: 'win',
        score: '2-0',
        format: 'Classic Constructed',
        date: '2025-06-08',
        duration: '38m',
        deck: 'Elemental Storm Control',
        opponentDeck: "Nature's Harmony",
      },
    ],
    tournamentHistory: [
      {
        id: 1,
        name: 'KONIVRER Championship Series #1',
        date: '2025-06-01',
        format: 'Classic Constructed',
        placement: 2,
        participants: 64,
        deck: 'Elemental Storm Control',
        record: '6-1',
        prizeWon: '$500',
      },
      {
        id: 2,
        name: 'Weekly Blitz Tournament',
        date: '2025-05-28',
        format: 'Blitz',
        placement: 1,
        participants: 16,
        deck: 'Lightning Rush',
        record: '4-0',
        prizeWon: '$100',
      },
      {
        id: 3,
        name: 'Draft Masters Cup',
        date: '2025-05-20',
        placement: 5,
        participants: 24,
        deck: 'Draft Special',
        record: '3-2',
        prizeWon: '$25',
      },
    ],
    deckCollection: [
      {
        id: 1,
        name: 'Elemental Storm Control',
        hero: 'Zephyr',
        format: 'Classic Constructed',
        winRate: 73.2,
        gamesPlayed: 156,
        lastPlayed: '2025-06-10',
        isFavorite: true,
      },
      {
        id: 2,
        name: 'Crystal Guardian',
        hero: 'Prism',
        format: 'Classic Constructed',
        winRate: 68.5,
        gamesPlayed: 89,
        lastPlayed: '2025-06-09',
        isFavorite: false,
      },
      {
        id: 3,
        name: 'Lightning Rush',
        hero: 'Zephyr',
        format: 'Blitz',
        winRate: 75.8,
        gamesPlayed: 67,
        lastPlayed: '2025-05-28',
        isFavorite: true,
      },
    ],
  };

  const getRankColor = rank => {
    switch (rank.toLowerCase()) {
      case 'bronze':
        return 'from-amber-600 to-amber-700';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-500';
      case 'diamond':
        return 'from-blue-400 to-blue-500';
      case 'master':
        return 'from-purple-500 to-purple-600';
      case 'grandmaster':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getAchievementColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {playerData.stats.totalGames}
          </div>
          <div className="text-sm text-secondary">Total Games</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {playerData.stats.winRate}%
          </div>
          <div className="text-sm text-secondary">Win Rate</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500 mb-1">
            {playerData.stats.tournamentWins}
          </div>
          <div className="text-sm text-secondary">Tournament Wins</div>
        </div>
        <div className="bg-secondary border border-color rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">
            {playerData.stats.averageFinish}
          </div>
          <div className="text-sm text-secondary">Avg Finish</div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4">Recent Matches</h3>
        <div className="space-y-3">
          {playerData.recentMatches.map(match => (
            <div
              key={match.id}
              className="flex items-center justify-between p-3 border border-color rounded-lg hover:bg-tertiary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <div>
                  <div className="font-medium text-primary">
                    vs {match.opponent}
                  </div>
                  <div className="text-sm text-secondary">
                    {match.format} • {match.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-primary">{match.score}</div>
                <div className="text-sm text-secondary">{match.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {playerData.achievements.map(achievement => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`border border-color rounded-lg p-4 ${achievement.earned ? 'bg-tertiary' : 'opacity-50'}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${getAchievementColor(achievement.rarity)}`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-primary mb-1">
                  {achievement.name}
                </h4>
                <p className="text-sm text-secondary">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="bg-secondary border border-color rounded-xl p-6">
      <h3 className="text-xl font-bold text-primary mb-6">
        Tournament History
      </h3>
      <div className="space-y-4">
        {playerData.tournamentHistory.map(tournament => (
          <div
            key={tournament.id}
            className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-primary">
                  {tournament.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Calendar size={14} />
                  <span>{tournament.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg font-bold ${tournament.placement <= 3 ? 'text-yellow-500' : 'text-primary'}`}
                >
                  #{tournament.placement}
                </div>
                <div className="text-sm text-secondary">
                  of {tournament.participants}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-secondary">Deck:</span>
                <div className="font-medium text-primary">
                  {tournament.deck}
                </div>
              </div>
              <div>
                <span className="text-secondary">Record:</span>
                <div className="font-medium text-primary">
                  {tournament.record}
                </div>
              </div>
              <div>
                <span className="text-secondary">Prize:</span>
                <div className="font-medium text-green-500">
                  {tournament.prizeWon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDecks = () => (
    <div className="bg-secondary border border-color rounded-xl p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Deck Collection</h3>
      <div className="space-y-4">
        {playerData.deckCollection.map(deck => (
          <div
            key={deck.id}
            className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-primary">{deck.name}</h4>
                {deck.isFavorite && (
                  <Star className="text-yellow-500" size={16} />
                )}
              </div>
              <div className="text-sm text-secondary">{deck.format}</div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-secondary">Hero:</span>
                <div className="font-medium text-primary">{deck.hero}</div>
              </div>
              <div>
                <span className="text-secondary">Win Rate:</span>
                <div className="font-medium text-green-500">
                  {deck.winRate}%
                </div>
              </div>
              <div>
                <span className="text-secondary">Games:</span>
                <div className="font-medium text-primary">
                  {deck.gamesPlayed}
                </div>
              </div>
              <div>
                <span className="text-secondary">Last Played:</span>
                <div className="font-medium text-primary">
                  {deck.lastPlayed}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderEvents = () => (
    <div className="space-y-6">
      {/* Active Events */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary">Registered Events</h3>
          <button
            onClick={() => loadPlayerEvents(playerId)}
            className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors"
            title="Refresh events"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {events.filter(event => event.status === 'active' || event.status === 'upcoming').map(event => (
            <div
              key={event.id}
              className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-primary">{event.name}</h4>
                    {event.isStreamed && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <Wifi size={12} />
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-secondary mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{event.currentParticipants || event.totalParticipants}/{event.maxParticipants || event.totalParticipants}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-secondary">Format:</span>
                      <span className="ml-1 font-medium text-primary">{event.format}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Entry:</span>
                      <span className="ml-1 font-medium text-primary">{event.entryFee}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Prize Pool:</span>
                      <span className="ml-1 font-medium text-green-600">{event.prizePool}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Bracket:</span>
                      <span className="ml-1 font-medium text-primary">{event.bracketType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                  {event.decklistRequired && (
                    <div className={`px-2 py-1 rounded text-xs ${
                      event.decklistSubmitted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.decklistSubmitted ? 'Decklist ✓' : 'Decklist Required'}
                    </div>
                  )}
                </div>
              </div>
              
              {event.status === 'active' && (
                <div className="bg-tertiary rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-primary">
                      Round {event.round} of {event.totalRounds}
                    </span>
                    <span className="text-sm text-secondary">
                      Record: {event.record}
                    </span>
                  </div>
                  <div className="w-full bg-quaternary rounded-full h-2">
                    <div 
                      className="bg-accent-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.round / event.totalRounds) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="text-secondary">Current Placement:</span>
                    <span className="ml-2 font-medium text-primary">
                      #{event.currentPlacement} of {event.totalParticipants}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Current Pairing */}
              {event.status === 'active' && pairings.filter(p => p.eventId === event.id).map(pairing => (
                <div key={pairing.id} className="border border-color rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium text-primary">Current Match</h5>
                      <p className="text-secondary">
                        vs {pairing.opponent}
                      </p>
                      <p className="text-sm text-secondary">
                        Table {pairing.table}
                      </p>
                    </div>
                    
                    {pairing.status === 'active' && (
                      <div className="text-right">
                        <div className="text-lg font-mono font-bold text-accent-secondary">
                          {formatTimeRemaining(pairing.timeRemaining)}
                        </div>
                        <div className="text-xs text-secondary">
                          Time Remaining
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {pairing.status === 'active' && (
                    <div className="bg-quaternary rounded-lg p-4">
                      <h5 className="font-medium mb-3 text-primary">Submit Match Result</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitResult(pairing.id, 'win', '2-0')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1"
                        >
                          Win 2-0
                        </button>
                        <button
                          onClick={() => submitResult(pairing.id, 'win', '2-1')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1"
                        >
                          Win 2-1
                        </button>
                        <button
                          onClick={() => submitResult(pairing.id, 'loss', '1-2')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex-1"
                        >
                          Loss 1-2
                        </button>
                        <button
                          onClick={() => submitResult(pairing.id, 'loss', '0-2')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex-1"
                        >
                          Loss 0-2
                        </button>
                        <button
                          onClick={() => submitResult(pairing.id, 'draw', '1-1')}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex-1"
                        >
                          Draw 1-1
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {pairing.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      Result submitted: {pairing.submittedResult} ({pairing.submittedScore})
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex flex-wrap gap-2">
                {event.status === 'active' && (
                  <>
                    <Link
                      to={`/tournaments/${event.id}/live`}
                      className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-secondary transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Tournament
                    </Link>
                    <Link
                      to={`/tournaments/${event.id}/bracket`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <BarChart3 size={16} />
                      Bracket
                    </Link>
                    {event.isStreamed && event.streamUrl && (
                      <a
                        href={event.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Watch Stream
                      </a>
                    )}
                  </>
                )}
                
                {event.status === 'upcoming' && (
                  <>
                    {!event.decklistSubmitted && event.decklistRequired && (
                      <Link
                        to={`/decklist-submission/${event.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Upload size={16} />
                        Submit Decklist
                      </Link>
                    )}
                    <Link
                      to={`/tournaments/${event.id}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Info size={16} />
                      Event Details
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/tournaments/${event.id}`)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  title="Copy event link"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Past Events */}
      <div className="bg-secondary border border-color rounded-xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4">Past Events</h3>
        <div className="space-y-4">
          {events.filter(event => event.status === 'completed').map(event => (
            <div
              key={event.id}
              className="border border-color rounded-xl p-4 hover:bg-tertiary transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-primary">{event.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-secondary mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${event.finalPlacement <= 3 ? 'text-yellow-500' : 'text-primary'}`}>
                    #{event.finalPlacement}
                  </div>
                  <div className="text-sm text-secondary">
                    of {event.totalParticipants}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-secondary">Record:</span>
                  <div className="font-medium text-primary">
                    {event.record}
                  </div>
                </div>
                <div>
                  <span className="text-secondary">Prize:</span>
                  <div className="font-medium text-green-500">
                    {event.prizeWon}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {events.filter(event => event.status === 'completed').length === 0 && (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-secondary mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No past events
              </h3>
              <p className="text-secondary">
                Your completed events will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* No Events Message */}
      {events.length === 0 && !loading && (
        <div className="text-center py-12 bg-secondary border border-color rounded-xl">
          <Trophy className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No events found
          </h3>
          <p className="text-secondary mb-4">
            You're not registered for any events yet.
          </p>
          <Link
            to="/tournaments"
            className="bg-accent-primary text-white px-6 py-2 rounded-lg hover:bg-accent-secondary transition-colors"
          >
            Browse Events
          </Link>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-12 bg-secondary border border-color rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading events...</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-8">
        {/* Profile Header */}
        <div className="bg-secondary border border-color rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={playerData.avatar}
              alt={playerData.displayName}
              className="w-24 h-24 rounded-xl object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-primary">
                  {playerData.displayName}
                </h1>
                <span className="text-lg text-secondary">
                  @{playerData.username}
                </span>
                <div
                  className={`px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium text-white bg-gradient-to-r ${getRankColor(playerData.rank)}`}
                >
                  {playerData.rank}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-secondary mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{playerData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Joined {playerData.joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown size={14} />
                  <span>Level {playerData.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-secondary">Rank Points:</span>
                  <span className="ml-2 font-semibold text-primary">
                    {playerData.rankPoints}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-secondary">Favorite Hero:</span>
                  <span className="ml-2 font-semibold text-primary">
                    {playerData.favoriteHero}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors relative"
                >
                  {notifications.filter(n => !n.read).length > 0 ? (
                    <BellRing size={16} className="text-accent-primary" />
                  ) : (
                    <Bell size={16} />
                  )}
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-color rounded-xl shadow-lg z-50">
                    <div className="p-4 border-b border-color">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-primary">Notifications</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-secondary hover:text-primary"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-secondary hover:text-primary"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-secondary">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => {
                          const Icon = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-color hover:bg-tertiary transition-colors cursor-pointer ${
                                !notification.read ? 'bg-accent-primary/5' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-lg ${
                                  notification.type === 'pairing' ? 'bg-blue-100 text-blue-600' :
                                  notification.type === 'deadline' ? 'bg-yellow-100 text-yellow-600' :
                                  notification.type === 'result' ? 'bg-green-100 text-green-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  <Icon size={16} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-primary text-sm">
                                    {notification.title}
                                  </h4>
                                  <p className="text-secondary text-sm mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-secondary mt-2">
                                    {formatRelativeTime(notification.timestamp)}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors">
                <Share2 size={16} />
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-secondary border border-color rounded-xl p-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'tournaments', label: 'Tournaments', icon: Trophy },
            { id: 'decks', label: 'Decks', icon: Sword },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'decks' && renderDecks()}
        {activeTab === 'stats' && (
          <div className="bg-secondary border border-color rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Detailed Statistics
            </h3>
            <p className="text-secondary">
              Advanced statistics and analytics coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
