/**
 * KONIVRER Deck Database - Mobile Judge Tools
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  Shield,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Search,
  Filter,
  Plus,
  Minus,
  Eye,
  FileText,
  Timer,
  Target,
  Award,
  Flag,
  Zap,
  RefreshCw,
  Bell,
  Settings,
  Camera,
  Mic,
  MessageSquare,
  Phone,
  Navigation,
  MapPin
} from 'lucide-react';

const MobileJudgeTools = () => {
  const { tournamentId } = useParams();
  const [activeTab, setActiveTab] = useState('pairings');
  const [tournament, setTournament] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [players, setPlayers] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPenaltyForm, setShowPenaltyForm] = useState(false);

  useEffect(() => {
    loadTournamentData();
  }, [tournamentId]);

  const loadTournamentData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setTournament({
        id: tournamentId,
        name: 'Friday Night Magic',
        currentRound: 3,
        totalRounds: 5,
        status: 'active',
        timeRemaining: 1800 // 30 minutes
      });

      setPairings([
        {
          id: 1,
          round: 3,
          table: 1,
          player1: { id: 1, name: 'Alice Johnson', record: '2-0' },
          player2: { id: 2, name: 'Bob Smith', record: '2-0' },
          status: 'active',
          timeRemaining: 1800,
          result: null
        },
        {
          id: 2,
          round: 3,
          table: 2,
          player1: { id: 3, name: 'Carol Davis', record: '1-1' },
          player2: { id: 4, name: 'David Wilson', record: '1-1' },
          status: 'completed',
          timeRemaining: 0,
          result: { winner: 3, score: '2-1' }
        },
        {
          id: 3,
          round: 3,
          table: 3,
          player1: { id: 5, name: 'Eve Brown', record: '0-2' },
          player2: { id: 6, name: 'Frank Miller', record: '0-2' },
          status: 'active',
          timeRemaining: 1200,
          result: null
        }
      ]);

      setPlayers([
        { id: 1, name: 'Alice Johnson', record: '2-0', penalties: 0, status: 'active' },
        { id: 2, name: 'Bob Smith', record: '2-0', penalties: 1, status: 'active' },
        { id: 3, name: 'Carol Davis', record: '2-1', penalties: 0, status: 'active' },
        { id: 4, name: 'David Wilson', record: '1-2', penalties: 0, status: 'active' },
        { id: 5, name: 'Eve Brown', record: '0-2', penalties: 2, status: 'active' },
        { id: 6, name: 'Frank Miller', record: '0-3', penalties: 0, status: 'dropped' }
      ]);

      setPenalties([
        {
          id: 1,
          playerId: 2,
          playerName: 'Bob Smith',
          type: 'warning',
          infraction: 'Slow Play',
          round: 2,
          table: 1,
          timestamp: '2024-07-04T20:15:00',
          judgeId: 'judge1',
          notes: 'Player was taking excessive time for decisions'
        },
        {
          id: 2,
          playerId: 5,
          playerName: 'Eve Brown',
          type: 'game_loss',
          infraction: 'Deck Problem',
          round: 1,
          table: 3,
          timestamp: '2024-07-04T19:30:00',
          judgeId: 'judge1',
          notes: 'Illegal card in deck discovered during deck check'
        }
      ]);
    } catch (error) {
      console.error('Failed to load tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResult = async (pairingId, winnerId, score) => {
    try {
      setPairings(prev => prev.map(p => 
        p.id === pairingId 
          ? { ...p, status: 'completed', result: { winner: winnerId, score } }
          : p
      ));
    } catch (error) {
      console.error('Failed to submit result:', error);
    }
  };

  const issuePenalty = async (penaltyData) => {
    try {
      const newPenalty = {
        id: Date.now(),
        ...penaltyData,
        timestamp: new Date().toISOString(),
        judgeId: 'current_judge'
      };

      setPenalties(prev => [...prev, newPenalty]);
      setPlayers(prev => prev.map(p => 
        p.id === penaltyData.playerId 
          ? { ...p, penalties: p.penalties + 1 }
          : p
      ));
      
      setShowPenaltyForm(false);
    } catch (error) {
      console.error('Failed to issue penalty:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderPairings = () => {
    const filteredPairings = pairings.filter(pairing => 
      searchQuery === '' || 
      pairing.player1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pairing.player2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pairing.table.toString().includes(searchQuery)
    );

    return (
      <div className="space-y-4">
        {filteredPairings.map((pairing) => (
          <motion.div
            key={pairing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Table {pairing.table}</h3>
                <p className="text-sm text-gray-600">Round {pairing.round}</p>
              </div>
              <div className="flex items-center gap-2">
                {pairing.status === 'active' && (
                  <div className="text-orange-600 font-mono text-sm">
                    {formatTime(pairing.timeRemaining)}
                  </div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pairing.status === 'active' ? 'bg-orange-100 text-orange-800' :
                  pairing.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pairing.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{pairing.player1.name}</span>
                <span className="text-sm text-gray-600">{pairing.player1.record}</span>
              </div>
              <div className="text-center text-gray-400 text-sm">vs</div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{pairing.player2.name}</span>
                <span className="text-sm text-gray-600">{pairing.player2.record}</span>
              </div>
            </div>

            {pairing.status === 'active' && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => submitResult(pairing.id, pairing.player1.id, '2-0')}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  P1 Wins
                </button>
                <button
                  onClick={() => submitResult(pairing.id, null, '1-1')}
                  className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Draw
                </button>
                <button
                  onClick={() => submitResult(pairing.id, pairing.player2.id, '2-0')}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  P2 Wins
                </button>
              </div>
            )}

            {pairing.status === 'completed' && pairing.result && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {pairing.result.winner === pairing.player1.id ? pairing.player1.name :
                     pairing.result.winner === pairing.player2.id ? pairing.player2.name :
                     'Draw'} - {pairing.result.score}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPlayers = () => {
    const filteredPlayers = players.filter(player => 
      searchQuery === '' || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {filteredPlayers.map((player) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedPlayer(player)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>Record: {player.record}</span>
                  <span>Penalties: {player.penalties}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {player.penalties > 0 && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  player.status === 'active' ? 'bg-green-100 text-green-800' :
                  player.status === 'dropped' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {player.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPenalties = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recent Penalties</h3>
        <button
          onClick={() => setShowPenaltyForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Issue Penalty
        </button>
      </div>

      {penalties.map((penalty) => (
        <motion.div
          key={penalty.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{penalty.playerName}</h4>
              <p className="text-sm text-gray-600">
                {penalty.infraction} - Round {penalty.round}, Table {penalty.table}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              penalty.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              penalty.type === 'game_loss' ? 'bg-red-100 text-red-800' :
              penalty.type === 'match_loss' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {penalty.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{penalty.notes}</p>
          <p className="text-xs text-gray-500">
            {new Date(penalty.timestamp).toLocaleString()}
          </p>
        </motion.div>
      ))}
    </div>
  );

  const renderPenaltyForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Penalty</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="">Select player...</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Infraction
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="">Select infraction...</option>
              <option value="Slow Play">Slow Play</option>
              <option value="Deck Problem">Deck Problem</option>
              <option value="Unsporting Conduct">Unsporting Conduct</option>
              <option value="Tournament Error">Tournament Error</option>
              <option value="Communication Policy Violation">Communication Policy Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penalty Level
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="warning">Warning</option>
              <option value="game_loss">Game Loss</option>
              <option value="match_loss">Match Loss</option>
              <option value="disqualification">Disqualification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Additional details about the infraction..."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowPenaltyForm(false)}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle penalty submission
              setShowPenaltyForm(false);
            }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Issue Penalty
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading judge tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Judge Tools</h1>
              <p className="text-sm text-gray-600">{tournament?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Judge Mode</span>
            </div>
          </div>

          {/* Tournament Status */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-blue-900">
                  Round {tournament?.currentRound} of {tournament?.totalRounds}
                </span>
              </div>
              <div className="text-blue-900 font-mono text-sm">
                {formatTime(tournament?.timeRemaining || 0)}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players, tables..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex">
            {[
              { id: 'pairings', label: 'Pairings', icon: Users },
              { id: 'players', label: 'Players', icon: Target },
              { id: 'penalties', label: 'Penalties', icon: AlertTriangle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 px-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'pairings' && renderPairings()}
            {activeTab === 'players' && renderPlayers()}
            {activeTab === 'penalties' && renderPenalties()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Penalty Form Modal */}
      <AnimatePresence>
        {showPenaltyForm && renderPenaltyForm()}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <button className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors">
          <AlertTriangle className="h-6 w-6" />
        </button>
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MobileJudgeTools;