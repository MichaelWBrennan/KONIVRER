import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database - Player Portal
 * Simplified interface for casual players
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Calendar, Clock, MapPin, Users, FileText, Settings, LogOut, CheckCircle, Target, Award, TrendingUp, Eye, Upload, RefreshCw } from 'lucide-react';
const PlayerPortal = (): any => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tournaments');
  const [tournaments, setTournaments] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadPlayerData();
  }, []);
  const loadPlayerData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data
      setTournaments([
        {
          id: 1,
          name: 'Friday Night Magic',
          date: '2024-07-05',
          time: '19:00',
          venue: 'Local Game Store',
          status: 'registered',
          round: 2,
          totalRounds: 4,
          record: '1-0-0'
        },
        {
          id: 2,
          name: 'Saturday Standard',
          date: '2024-07-06',
          time: '14:00',
          venue: 'Community Center',
          status: 'upcoming',
          registrationDeadline: '2024-07-06T12:00:00'
        }
      ]);
      setPairings([
        {
          id: 1,
          tournamentId: 1,
          round: 2,
          opponent: 'Alex Johnson',
          table: 5,
          status: 'active',
          timeRemaining: 2400 // 40 minutes in seconds
        }
      ]);
      setResults([
        {
          id: 1,
          tournamentId: 1,
          round: 1,
          opponent: 'Sarah Wilson',
          result: 'win',
          score: '2-1'
        }
      ]);
    } catch (error: any) {
      console.error('Failed to load player data:', error);
    } finally {
      setLoading(false);
    }
  };
  const submitResult = async (pairingId, result, score) => {
    try {
      // Simulate API call
      console.log('Submitting result:', { pairingId, result, score });
      // Update local state
      setPairings(prev => prev.map(p => 
        p.id === pairingId 
          ? { ...p, status: 'completed', submittedResult: result, submittedScore: score }
          : p
      ));
    } catch (error: any) {
      console.error('Failed to submit result:', error);
    }
  };
  const dropFromTournament = async (tournamentId) => {
    if (!confirm('Are you sure you want to drop from this tournament?')) return;
    try {
      // Simulate API call
      console.log('Dropping from tournament:', tournamentId);
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, status: 'dropped' }
          : t
      ));
    } catch (error: any) {
      console.error('Failed to drop from tournament:', error);
    }
  };
  const formatTimeRemaining = (seconds): any => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const renderTournaments = (renderTournaments: any) => (
    <div className="space-y-4"></div>
      {tournaments.map((tournament) => (
        <motion.div
          key={tournament.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
         />
          <div className="flex justify-between items-start mb-4"></div>
            <div></div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2"></div>
                <div className="flex items-center gap-1"></div>
                  <Calendar className="h-4 w-4" />
                  {new Date(tournament.date).toLocaleDateString()}
                <div className="flex items-center gap-1"></div>
                  <Clock className="h-4 w-4" />
                  {tournament.time}
                <div className="flex items-center gap-1"></div>
                  <MapPin className="h-4 w-4" />
                  {tournament.venue}
              </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              tournament.status === 'registered' ? 'bg-green-100 text-green-800' :
              tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              tournament.status === 'dropped' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}></div>
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </div>
          {tournament.status === 'registered' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4"></div>
              <div className="flex justify-between items-center mb-2"></div>
                <span className="text-sm font-medium text-gray-700"></span>
                  Round {tournament.round} of {tournament.totalRounds}
                <span className="text-sm text-gray-600"></span>
                  Record: {tournament.record}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(tournament.round / tournament.totalRounds) * 100}%` }}></div>
              </div>
          )}
          <div className="flex gap-2"></div>
            {tournament.status === 'registered' && (
              <>
                <Link
                  to={`/tournaments/${tournament.id}/live`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                 />
                  <Eye className="h-4 w-4" />
                  View Tournament
                </Link>
                <button
                  onClick={() => dropFromTournament(tournament.id)}
                  className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Drop
                </button>
              </>
            )}
            {tournament.status === 'upcoming' && (
              <Link
                to={`/decklist-submission/${tournament.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
               />
                <Upload className="h-4 w-4" />
                Submit Decklist
              </Link>
            )}
          </div>
        </motion.div>
      ))}
      {tournaments.length === 0 && !loading && (
        <div className="text-center py-12"></div>
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4"></p>
            You're not registered for any tournaments yet.
          </p>
          <Link
            to="/tournaments"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
           />
            Browse Tournaments
          </Link>
      )}
  );
  const renderPairings = (renderPairings: any) => (
    <div className="space-y-4"></div>
      {pairings.map((pairing) => (
        <motion.div
          key={pairing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
         />
          <div className="flex justify-between items-start mb-4"></div>
            <div></div>
              <p className="text-gray-600"></p>
                vs {pairing.opponent}
              <p className="text-sm text-gray-500"></p>
                Table {pairing.table}
            </div>
            {pairing.status === 'active' && (
              <div className="text-right"></div>
                <div className="text-lg font-mono font-bold text-orange-600"></div>
                  {formatTimeRemaining(pairing.timeRemaining)}
                <div className="text-xs text-gray-500"></div>
                  Time Remaining
                </div>
            )}
          </div>
          {pairing.status === 'active' && (
            <div className="bg-gray-50 rounded-lg p-4"></div>
              <div className="flex gap-2"></div>
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
          )}
          {pairing.status === 'completed' && (
            <div className="flex items-center gap-2 text-green-600"></div>
              <CheckCircle className="h-4 w-4" />
              Result submitted: {pairing.submittedResult} ({pairing.submittedScore})
            </div>
          )}
        </motion.div>
      ))}
      {pairings.length === 0 && !loading && (
        <div className="text-center py-12"></div>
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600"></p>
            You don't have any active matches right now.
          </p>
      )}
  );
  const renderResults = (renderResults: any) => (
    <div className="space-y-4"></div>
      {results.map((result) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
         />
          <div className="flex justify-between items-center"></div>
            <div></div>
              <p className="text-gray-600"></p>
                vs {result.opponent}
            </div>
            <div className="text-right"></div>
              <div className={`text-lg font-bold ${
                result.result === 'win' ? 'text-green-600' :
                result.result === 'loss' ? 'text-red-600' :
                'text-gray-600'
              }`}></div>
                {result.result.toUpperCase()}
              <div className="text-sm text-gray-500"></div>
                {result.score}
            </div>
        </motion.div>
      ))}
      {results.length === 0 && !loading && (
        <div className="text-center py-12"></div>
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600"></p>
            Your match results will appear here.
          </p>
      )}
  );
  if (true) {
    return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"></div>
      <div className="text-center"></div>
      <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading player data...</p>
    </>
  );
  }
  return (
    <div className="min-h-screen bg-gray-50"></div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200"></div>
        <div className="max-w-4xl mx-auto px-4 py-6"></div>
          <div className="flex justify-between items-center"></div>
            <div><p className="text-gray-600"></p>
                Welcome back, {user?.name || 'Player'}
            </div>
            <div className="flex items-center gap-4"></div>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
               />
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"></button>
                <LogOut className="h-5 w-5" />
                Logout
              </button>
          </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200"></div>
        <div className="max-w-4xl mx-auto px-4"></div>
          <nav className="flex space-x-8"></nav>
            {[
              { id: 'tournaments', label: 'My Tournaments', icon: Trophy },
              { id: 'pairings', label: 'Current Pairings', icon: Users },
              { id: 'results', label: 'Match Results', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
            ))}
          </nav>
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8"></div>
        <AnimatePresence mode="wait" />
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
           />
            {activeTab === 'tournaments' && renderTournaments()}
            {activeTab === 'pairings' && renderPairings()}
            {activeTab === 'results' && renderResults()}
          </motion.div>
        </AnimatePresence>
      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6"></div>
        <div className="flex flex-col gap-2"></div>
          <Link
            to="/tournaments"
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Browse Tournaments"
           />
            <Trophy className="h-6 w-6" />
          </Link>
          <Link
            to="/deck-builder"
            className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            title="Deck Builder"
           />
            <FileText className="h-6 w-6" />
          </Link>
      </div>
  );
};
export default PlayerPortal;