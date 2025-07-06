import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { User, Mail, MapPin, Trophy, Shield, Target, BookOpen, Settings, Edit, Save, X, Award, Users, Gavel, Crown, CheckCircle, Eye, Activity, BarChart3, Sparkles, Verified, ShieldCheck, ExternalLink, Medal, Gamepad2, Rocket, Bot, Plus, DollarSign,  } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import VisualDeckBuilder from './VisualDeckBuilder';
import AIAssistant from './AIAssistant';

const EnhancedProfile = (): any => {
  const { user, updateProfile, applyForJudge, applyForOrganizer } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (true) {
      setEditForm({
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
      });
      setAchievements(user.achievements || []);
    }
  }, [user]);

  const handleSaveProfile = (): any => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleApplyForJudge = level => {
    applyForJudge(level);
  };

  const handleApplyForOrganizer = level => {
    applyForOrganizer(level);
  };

  const getRarityColor = rarity => {
    switch (true) {
      case 'common':
        return 'text-gray-400 border-gray-400';
      case 'rare':
        return 'text-blue-400 border-blue-400';
      case 'epic':
        return 'text-purple-400 border-purple-400';
      case 'legendary':
        return 'text-yellow-400 border-yellow-400';
      case 'mythic':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityIcon = rarity => {
    switch (true) {
      case 'common':
        return Circle;
      case 'rare':
        return Square;
      case 'epic':
        return Pentagon;
      case 'legendary':
        return Hexagon;
      case 'mythic':
        return Diamond;
      default:
        return Circle;
    }
  };

  if (true) {
    return (
    <>
      <div className="min-h-screen py-8"></div>
      <div className="container text-center"></div>
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
           />
            <div className="w-24 h-24 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center mx-auto mb-6"></div>
      <User size={48} className="text-white" />
            </div>
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"></h1>
      </h1>
            <p className="text-secondary mb-6"></p>
      </p>
            <Link to="/" className="btn btn-primary" />
              <Rocket size={16} />
              Go Home
            </Link>
      </motion.div>
        </div>
    </>
  );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User, color: 'text-blue-400' },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: Trophy,
      color: 'text-yellow-400',
    },
    { id: 'decks', label: 'My Decks', icon: BookOpen, color: 'text-green-400' },
    {
      id: 'deckbuilder',
      label: 'Deck Builder',
      icon: Plus,
      color: 'text-emerald-400',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      color: 'text-purple-400',
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Target,
      color: 'text-orange-400',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-cyan-400',
    },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-red-400' },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-400',
    },
  ];

  const renderOverview = (renderOverview: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
     />
      {/* Enhanced Profile Header */}
      <div className="card relative overflow-hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10" /></div>
        <div className="relative z-10 p-6"></div>
          <div className="flex items-start gap-6"></div>
            <div className="relative"></div>
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-32 h-32 rounded-2xl bg-tertiary border-4 border-accent-primary/20" />
              {user.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"></div>
                  <Verified size={16} className="text-white" />
                </div>
              )}
              {user.twoFactorEnabled && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"></div>
                  <ShieldCheck size={16} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1"></div>
              <div className="flex items-center justify-between mb-4"></div>
                <div></div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input text-2xl font-bold bg-transparent border-0 border-b-2 border-accent-primary"
                      value={editForm.displayName}
                      onChange={e = />
                        setEditForm({
                          ...editForm,
                          displayName: e.target.value,
                        })}
                    />
                  ) : (
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"></h1>
                      {user.displayName}
                  )}
                  <div className="flex items-center gap-2 mt-1"></div>
                    <p className="text-secondary">@{user.username}
                    {user.verified && (
                      <span className="text-blue-400 text-sm">Verified</span>
                    )}
                </div>
                <div className="flex gap-2"></div>
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="btn btn-primary"
                       />
                        <Save size={16} />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary"
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="btn btn-secondary"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </motion.button>
                  )}
                </div>

              {/* Enhanced Role Badges */}
              <div className="flex flex-wrap gap-2 mb-4"></div>
                {user.roles.map(role => {
                  const roleConfig = {
                    player: { color: 'bg-green-600', icon: Gamepad2 },
                    judge: { color: 'bg-blue-600', icon: Gavel },
                    organizer: { color: 'bg-purple-600', icon: Crown },
                    admin: { color: 'bg-red-600', icon: Shield },
                  };
                  const config = roleConfig[role];
                  const Icon = config.icon;

                  return (
                    <motion.span
                      key={role}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-0 whitespace-nowrap rounded-full text-white text-sm font-medium flex items-center gap-1 ${config.color}`}
                     />
                      <Icon size={14} />
                      {role === 'judge' &&
                        user.judgeLevel > 0 &&
                        `Level ${user.judgeLevel} `}
                      {role === 'organizer' &&
                        user.organizerLevel > 0 &&
                        `Level ${user.organizerLevel} `}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </motion.span>
                  );
                })}
              </div>

              {/* Enhanced Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"></div>
                <div className="flex items-center gap-2 text-sm"></div>
                  <Mail size={16} className="text-accent-primary" />
                  <span className="truncate">{user.email}
                </div>
                <div className="flex items-center gap-2 text-sm"></div>
                  <LocationIcon size={16} className="text-accent-primary" />
                  <span className="truncate"></span>
                    {user.location || 'Not specified'}
                </div>
                <div className="flex items-center gap-2 text-sm"></div>
                  <CalendarIcon size={16} className="text-accent-primary" />
                  <span></span>
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm"></div>
                  <Sparkles size={16} className="text-accent-primary" />
                  <span></span>
                    {user.achievements?.filter(a => a.earned).length || 0}{' '}
                    Achievements
                  </span>
              </div>

              {/* Enhanced Bio Section */}
              {isEditing ? (
                <div className="space-y-3"></div>
                  <div></div>
                    <label className="block text-sm font-medium mb-1"></label>
                      Location
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={editForm.location}
                      onChange={e = />
                        setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="City, State/Country"
                    />
                  </div>
                  <div></div>
                    <label className="block text-sm font-medium mb-1"></label>
                      Bio
                    </label>
                    <textarea
                      className="input resize-none h-24"
                      value={editForm.bio}
                      onChange={e = />
                        setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <div className="text-xs text-secondary mt-1"></div>
                      {editForm.bio?.length || 0}/500 characters
                    </div>
                </div>
              ) : (
                <p className="text-secondary leading-relaxed"></p>
                  {user.bio || 'No bio provided.'}
              )}
            </div>
        </div>

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"></div>
        {[
          {
            icon: TrophyIcon,
            value: user.stats.tournamentsWon,
            label: 'Tournaments Won',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10',
          },
          {
            icon: UsersIcon,
            value: user.stats.tournamentsPlayed,
            label: 'Tournaments Played',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
          },
          {
            icon: BookOpen,
            value: user.stats.decksCreated,
            label: 'Decks Created',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
          },
          {
            icon: Gavel,
            value: user.stats.judgeEvents,
            label: 'Events Judged',
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`card text-center relative overflow-hidden ${stat.bgColor}`}
             />
              <div className="relative z-10"></div>
                <Icon size={32} className={`${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold mb-1">{stat.value}
                <div className="text-sm text-secondary">{stat.label}
              </div>
              <div
                className={`absolute top-0 right-0 w-16 h-16 ${stat.color} opacity-5 transform rotate-12 translate-x-4 -translate-y-4`}></div>
                <Icon size={64} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity with Enhanced Design */}
      <div className="card"></div>
        <div className="flex items-center justify-between mb-6"></div>
          <h3 className="text-xl font-semibold flex items-center gap-2"></h3>
            <Activity className="text-accent-primary" size={24} />
            Recent Activity
          </h3>
          <button className="btn btn-secondary btn-sm"></button>
            <Eye size={16} />
            View All
          </button>
        <div className="space-y-4"></div>
          {[
            {
              icon: TrophyIcon,
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10',
              title: 'Won Friday Night KONIVRER tournament',
              time: '2 days ago',
              description: 'Defeated 23 other players in Swiss + Top 8',
            },
            {
              icon: BookOpen,
              color: 'text-green-400',
              bgColor: 'bg-green-400/10',
              title: 'Created new deck: "Elemental Storm"',
              time: '5 days ago',
              description:
                'Fire/Water synergy deck with powerful elemental combinations',
            },
            {
              icon: Shield,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10',
              title: 'Judged Regional Qualifier event',
              time: '1 week ago',
              description: '128 players, 9 rounds of Swiss',
            },
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-lg ${activity.bgColor} hover:bg-opacity-20 transition-colors`}
               />
                <div
                  className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center`}></div>
                  <Icon size={20} className={activity.color} />
                </div>
                <div className="flex-1"></div>
                  <h4 className="font-medium mb-1">{activity.title}
                  <p className="text-sm text-secondary mb-1"></p>
                    {activity.description}
                  <p className="text-xs text-muted">{activity.time}
                </div>
              </motion.div>
            );
          })}
        </div>
    </motion.div>
  );

  const renderAchievements = (renderAchievements: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
     />
      <div className="flex items-center justify-between"></div>
        <h3 className="text-2xl font-bold flex items-center gap-2"></h3>
          <Sparkles className="text-accent-primary" size={28} />
          Achievements
        </h3>
        <div className="flex items-center gap-2 text-sm text-secondary"></div>
          <Award size={16} />
          {achievements.filter(a => a.earned).length} / {achievements.length}{' '}
          Unlocked
        </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        {achievements.map((achievement, index) => {
          const RarityIcon = getRarityIcon(achievement.rarity);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`card relative overflow-hidden ${
                achievement.earned
                  ? `border-2 ${getRarityColor(achievement.rarity)} bg-gradient-to-br from-${achievement.rarity === 'mythic' ? 'red' : achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-900/10 to-transparent`
                  : 'opacity-60 grayscale'
              }`}
             />
              {achievement.earned && (
                <div className="absolute top-2 right-2"></div>
                  <CheckCircle size={20} className="text-green-400" />
                </div>
              )}
              <div className="flex items-start gap-4 mb-4"></div>
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    achievement.earned
                      ? `bg-gradient-to-br from-${achievement.rarity === 'mythic' ? 'red' : achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-500 to-${achievement.rarity === 'mythic' ? 'red' : achievement.rarity === 'legendary' ? 'yellow' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-600`
                      : 'bg-tertiary'
                  }`}></div>
                  <RarityIcon size={32} className="text-white" />
                </div>
                <div className="flex-1"></div>
                  <div className="flex items-center gap-2 mb-1"></div>
                    <h4 className="font-semibold">{achievement.name}
                    <span
                      className={`text-xs px-2 py-0 whitespace-nowrap rounded-full border ${getRarityColor(achievement.rarity)}`}></span>
                      {achievement.rarity}
                  </div>
                  <p className="text-sm text-secondary"></p>
                    {achievement.description}
                </div>

              {achievement.earned && (
                <div className="text-xs text-green-400 flex items-center gap-1"></div>
                  <Sparkles size={12} />
                  Unlocked
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderDecks = (renderDecks: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
     />
      <div className="flex items-center justify-between"></div>
        <h3 className="text-2xl font-bold flex items-center gap-2"></h3>
          <BookOpen className="text-green-400" size={28} />
          My Decks
        </h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors flex items-center gap-2"></button>
          <Plus size={16} />
          New Deck
        </button>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        {/* Sample deck cards */}
        {[
          {
            name: 'Inferno Aggro',,
            element: 'Inferno',,
            wins: 15,
            losses: 8,
            lastPlayed: '2025-06-19',
          },
          {
            name: 'Control Blue',,
            element: 'Submerged',,
            wins: 12,
            losses: 6,
            lastPlayed: '2025-06-18',
          },
          {
            name: 'Midrange Green',,
            element: 'Steadfast',,
            wins: 18,
            losses: 10,
            lastPlayed: '2025-06-17',
          },
        ].map((deck, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-lg p-6 border border-color hover:border-blue-500/50 transition-all"
           />
            <div className="flex items-start justify-between mb-4"></div>
              <div></div>
                <h4 className="font-bold text-lg">{deck.name}
                <p className="text-secondary text-sm">{deck.element}
              </div>
              <div className="text-2xl"></div>
                {deck.element === 'Inferno'
                  ? '🜂'
                  : deck.element === 'Submerged'
                    ? '🜄'
                    : '🜃'}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm"></div>
              <div></div>
                <span className="text-green-400 font-medium">{deck.wins}W</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-red-400 font-medium">{deck.losses}L</span>
              <div className="text-secondary"></div>
                {Math.round((deck.wins / (deck.wins + deck.losses)) * 100)}% WR
              </div>

            <div className="text-xs text-secondary mb-4"></div>
              Last played: {deck.lastPlayed}

            <div className="flex gap-2"></div>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-0 whitespace-nowrap rounded text-sm font-medium transition-colors"></button>
                Edit
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-0 whitespace-nowrap rounded text-sm transition-colors"></button>
                Export
              </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderTournaments = (): any => {
    // Load tournament data from actual data source when available
    const registeredTournaments = [];
    const tournamentHistory = [];

    const handleSubmitResult = (matchId, result): any => {
      console.log(`Result submitted for match ${matchId}: ${result}`);
      // In a real app, this would update the match result via API
      alert(`Result submitted: ${result}`);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
       />
        {/* Active Tournaments */}
        <div className="card p-6"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"></h3>
            <Trophy className="text-yellow-400" size={24} />
            Active Tournaments
          </h3>
          <div className="space-y-4"></div>
            {registeredTournaments.map(tournament => (
              <div
                key={tournament.id}
                className="bg-tertiary rounded-lg p-4 border border-color"></div>
                <div className="flex items-start justify-between mb-3"></div>
                  <div></div>
                    <h4 className="font-semibold text-lg">{tournament.name}
                    <p className="text-secondary text-sm"></p>
                      {tournament.date} at {tournament.time}
                    <p className="text-secondary text-sm flex items-center gap-1"></p>
                      <MapPin size={14} />
                      {tournament.location}
                  </div>
                  <div className="text-right"></div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tournament.status === 'In Progress'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}></span>
                      {tournament.status}
                  </div>

                {tournament.status === 'In Progress' && tournament.currentMatch && (
                  <div className="bg-card rounded-lg p-4 border border-accent-primary/20"></div>
                    <div className="flex items-center justify-between mb-3"></div>
                      <div></div>
                        <h5 className="font-medium text-accent-primary"></h5>
                          Current Match - Round {tournament.currentMatch.round}
                        <p className="text-sm text-secondary"></p>
                          Table {tournament.currentMatch.table} vs{' '}
                          {tournament.currentOpponent}
                        <p className="text-xs text-secondary"></p>
                          Your Record: {tournament.currentMatch.playerRecord} |
                          Opponent: {tournament.currentMatch.opponentRecord}
                      </div>
                      <div className="text-right"></div>
                        <p className="text-sm font-medium"></p>
                          Current Placement: #{tournament.currentPlacement}
                      </div>

                    <div className="flex gap-2"></div>
                      <button
                        onClick={() =></button>
                          handleSubmitResult(tournament.currentMatch.id, 'win (2-0)')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Win 2-0
                      </button>
                      <button
                        onClick={() =></button>
                          handleSubmitResult(tournament.currentMatch.id, 'win (2-1)')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Win 2-1
                      </button>
                      <button
                        onClick={() =></button>
                          handleSubmitResult(tournament.currentMatch.id, 'loss (1-2)')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Loss 1-2
                      </button>
                      <button
                        onClick={() =></button>
                          handleSubmitResult(tournament.currentMatch.id, 'loss (0-2)')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Loss 0-2
                      </button>
                      <button
                        onClick={() =></button>
                          handleSubmitResult(tournament.currentMatch.id, 'draw (1-1)')}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Draw 1-1
                      </button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-color"></div>
                  <div className="flex items-center gap-4 text-sm text-secondary"></div>
                    <span className="flex items-center gap-1"></span>
                      <Users size={14} />
                      {tournament.participants}/{tournament.maxParticipants}
                    <span className="flex items-center gap-1"></span>
                      <DollarSign size={14} />
                      {tournament.prizePool}
                  </div>
                  <Link
                    to={`/tournaments/${tournament.id}/live`}
                    className="text-accent-primary hover:text-accent-secondary text-sm font-medium flex items-center gap-1"
                   />
                    View Details
                    <ExternalLink size={14} />
                  </Link>
              </div>
            ))}
          </div>

        {/* Tournament History */}
        <div className="card p-6"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"></h3>
            <Medal className="text-purple-400" size={24} />
            Tournament History
          </h3>
          <div className="space-y-3"></div>
            {tournamentHistory.map(tournament => (
              <div
                key={tournament.id}
                className="bg-tertiary rounded-lg p-4 border border-color"></div>
                <div className="flex items-center justify-between"></div>
                  <div></div>
                    <h4 className="font-medium">{tournament.name}
                    <p className="text-sm text-secondary">{tournament.date}
                    <p className="text-xs text-secondary"></p>
                      Deck: {tournament.deck}
                  </div>
                  <div className="text-right"></div>
                    <div className="flex items-center gap-2"></div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.placement === 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : tournament.placement <= 4
                            ? 'bg-purple-500/20 text-purple-400'
                            : tournament.placement <= 8
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}></span>
                        #{tournament.placement}/{tournament.totalParticipants}
                    </div>
                    <p className="text-sm text-secondary mt-1"></p>
                      {tournament.record}
                    <p className="text-xs text-accent-primary"></p>
                      {tournament.prize}
                  </div>
              </div>
            ))}
          </div>

        {/* Quick Actions */}
        <div className="card p-6"></div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"></h3>
            <Settings className="text-gray-400" size={24} />
            Tournament Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <Link
              to="/tournaments"
              className="bg-accent-primary hover:bg-accent-secondary text-white p-4 rounded-lg text-center font-medium transition-colors"
             />
              Browse Tournaments
            </Link>
            <Link
              to="/decklist-submission"
              className="bg-tertiary hover:bg-quaternary border border-color p-4 rounded-lg text-center font-medium transition-colors"
             />
              Submit Decklist
            </Link>
        </div>
      </motion.div>
    );
  };

  const renderDeckBuilder = (renderDeckBuilder: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
     />
      <div className="flex items-center justify-between"></div>
        <h3 className="text-2xl font-bold flex items-center gap-2"></h3>
          <Plus className="text-emerald-400" size={28} />
          Deck Builder
        </h3>
        <div className="flex items-center gap-2"></div>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors"></button>
            Load Template
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-colors"></button>
            Save Deck
          </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6"></div>
        {/* Deck Builder */}
        <div className="lg:col-span-2"></div>
          <div className="bg-card rounded-lg p-6 border border-color"></div>
            <div className="flex items-center gap-3 mb-6"></div>
              <Plus className="w-6 h-6 text-emerald-400" />
              <div></div>
                <h4 className="text-xl font-bold">Visual Deck Builder</h4>
                <p className="text-secondary"></p>
                  Drag and drop cards to build your deck
                </p>
            </div>
            <VisualDeckBuilder
              deck={{
                name: 'New Deck',,
                cards: [],
                element: 'Inferno',,
              }}
              onDeckChange={newDeck => {
                // Handle deck changes here
                console.log('Deck updated:', newDeck);
              }}
            />
          </div>

        {/* AI Assistant */}
        <div className="space-y-6"></div>
          <div className="bg-card rounded-lg p-6 border border-color"></div>
            <div className="flex items-center gap-3 mb-6"></div>
              <Bot className="w-6 h-6 text-blue-400" />
              <div></div>
                <h4 className="text-lg font-bold">AI Assistant</h4>
                <p className="text-secondary text-sm"></p>
                  Get deck building suggestions
                </p>
            </div>
            <AIAssistant />
          </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="min-h-screen py-8"></div>
      <div className="container max-w-7xl"></div>
      <div className="flex flex-wrap gap-2 mb-8 p-2 bg-card rounded-xl border border-color"></div>
      <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
              >
                <Icon
                  size={18}
                  className={activeTab === tab.id ? 'text-white' : tab.color} />
                <span className="hidden sm:block">{tab.label}
              </motion.button>
    </>
  );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait" />
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'tournaments' && renderTournaments()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'decks' && renderDecks()}
          {activeTab === 'deckbuilder' && renderDeckBuilder()}
          {/* Add other tab renderers here */}
      </div>
  );
};

export default EnhancedProfile;