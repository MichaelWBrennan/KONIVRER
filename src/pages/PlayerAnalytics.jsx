import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import MatchQualityIndicator from '../components/matchmaking/MatchQualityIndicator';
import { 
  User, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar, 
  Trophy, 
  Target, 
  Users,
  Zap
} from 'lucide-react';

const PlayerAnalytics = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getPlayerById, getPlayerDecks, getRecentOpponents } = usePhysicalMatchmaking();
  
  const [player, setPlayer] = useState(null);
  const [playerDecks, setPlayerDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [recentOpponents, setRecentOpponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        
        // Fetch player data
        const playerData = await getPlayerById(id || user?.id);
        setPlayer(playerData);
        
        // Fetch player decks
        const decks = await getPlayerDecks(id || user?.id);
        setPlayerDecks(decks);
        
        if (decks.length > 0) {
          setSelectedDeck(decks[0].id);
        }
        
        // Fetch recent opponents
        const opponents = await getRecentOpponents(id || user?.id);
        setRecentOpponents(opponents);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to load player data');
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [id, user, getPlayerById, getPlayerDecks, getRecentOpponents]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Render placeholder if no player data
  if (!player) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl">
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">No player data available.</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Player Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                <User size={32} className="text-purple-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{player.name}</h1>
                <div className="flex items-center text-purple-200">
                  <Target size={16} className="mr-1" />
                  <span>Rating: {player.rating.toFixed(0)} ± {player.ratingDeviation.toFixed(0)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-purple-200 mb-1">
                  <Trophy size={14} className="mr-1" />
                  <span className="text-xs">Win Rate</span>
                </div>
                <p className="text-xl font-bold text-white">{(player.winRate * 100).toFixed(1)}%</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-purple-200 mb-1">
                  <Users size={14} className="mr-1" />
                  <span className="text-xs">Matches</span>
                </div>
                <p className="text-xl font-bold text-white">{player.matchCount}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-purple-200 mb-1">
                  <Calendar size={14} className="mr-1" />
                  <span className="text-xs">Since</span>
                </div>
                <p className="text-xl font-bold text-white">{new Date(player.joinDate).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-purple-200 mb-1">
                  <Clock size={14} className="mr-1" />
                  <span className="text-xs">Last Match</span>
                </div>
                <p className="text-xl font-bold text-white">{new Date(player.lastMatch).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deck Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Deck for Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playerDecks.map(deck => (
              <div 
                key={deck.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDeck === deck.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedDeck(deck.id)}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    selectedDeck === deck.id ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Zap className={`${
                      selectedDeck === deck.id ? 'text-purple-600' : 'text-gray-600'
                    }`} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{deck.name}</h3>
                    <p className="text-sm text-gray-600">{deck.archetype}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-2">
                        {deck.format}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {deck.cards.length} cards
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Opponents with Match Quality */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Opponents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOpponents.map(opponent => (
              <div key={opponent.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{opponent.name}</h3>
                      <p className="text-sm text-gray-600">Rating: {opponent.rating.toFixed(0)}</p>
                    </div>
                  </div>
                  
                  <MatchQualityIndicator player1={player} player2={opponent} />
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last match: {new Date(opponent.lastMatch).toLocaleDateString()}</span>
                    <span className="font-medium">
                      {opponent.matchHistory.length} matches played
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Analytics Dashboard */}
        <div>
          <AnalyticsDashboard playerId={id || user?.id} deckId={selectedDeck} />
        </div>
      </div>
    </div>
  );
};

export default PlayerAnalytics;