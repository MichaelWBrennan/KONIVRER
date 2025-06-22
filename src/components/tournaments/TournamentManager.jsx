import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../../contexts/PhysicalMatchmakingContext';
import MatchQualityIndicator from '../matchmaking/MatchQualityIndicator';
import { 
  Users, 
  Clock, 
  Shuffle, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Zap,
  Layers,
  Filter
} from 'lucide-react';

/**
 * Tournament Manager Component
 * Provides advanced tournament management features
 */
const TournamentManager = ({ tournamentId }) => {
  const { 
    tournamentEngine,
    getTournamentById,
    updateTournament,
    generateNextRound,
    updateMatchResult
  } = usePhysicalMatchmaking();
  
  const [tournament, setTournament] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPairings, setIsGeneratingPairings] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [metaBalanceWeight, setMetaBalanceWeight] = useState(0.5);
  const [timeConstraintWeight, setTimeConstraintWeight] = useState(0.5);
  
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const tournamentData = await getTournamentById(tournamentId);
        setTournament(tournamentData);
        
        // Set current round to the latest round
        if (tournamentData.rounds && tournamentData.rounds.length > 0) {
          setCurrentRound(tournamentData.rounds.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError('Failed to load tournament data');
        setLoading(false);
      }
    };
    
    fetchTournament();
  }, [tournamentId, getTournamentById]);
  
  const handleGenerateNextRound = async () => {
    try {
      setIsGeneratingPairings(true);
      
      // Generate pairings with advanced options
      const options = {
        metaBalanceWeight: showAdvancedOptions ? metaBalanceWeight : 0.5,
        timeConstraintWeight: showAdvancedOptions ? timeConstraintWeight : 0.5,
        avoidRematches: true
      };
      
      const updatedTournament = await generateNextRound(tournamentId, options);
      setTournament(updatedTournament);
      setCurrentRound(updatedTournament.rounds.length);
      setIsGeneratingPairings(false);
    } catch (err) {
      console.error('Error generating next round:', err);
      setError('Failed to generate next round');
      setIsGeneratingPairings(false);
    }
  };
  
  const handleMatchResult = async (matchId, player1Score, player2Score) => {
    try {
      const result = {
        matchId,
        player1Score,
        player2Score,
        completed: true
      };
      
      const updatedTournament = await updateMatchResult(tournamentId, result);
      setTournament(updatedTournament);
    } catch (err) {
      console.error('Error updating match result:', err);
      setError('Failed to update match result');
    }
  };
  
  const handleRoundChange = (roundNumber) => {
    if (roundNumber >= 1 && roundNumber <= tournament.rounds.length) {
      setCurrentRound(roundNumber);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  // Render placeholder if no tournament data
  if (!tournament) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No tournament data available.</span>
      </div>
    );
  }
  
  // Get current round data
  const currentRoundData = tournament.rounds[currentRound - 1];
  
  return (
    <div className="tournament-manager">
      {/* Tournament Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{tournament.name}</h2>
            <p className="text-gray-600">{tournament.description}</p>
            <div className="flex items-center mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                {tournament.format}
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                {tournament.participants.length} participants
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {tournament.rounds.length} rounds
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-lg p-2 mr-3">
                <Clock className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">
                  {tournament.status === 'in_progress' ? 'In Progress' : 
                   tournament.status === 'completed' ? 'Completed' : 'Upcoming'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tournament Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tournament Controls</h3>
          
          <div className="flex items-center mt-4 md:mt-0">
            <button
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Hide Advanced Options
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Show Advanced Options
                </>
              )}
            </button>
          </div>
        </div>
        
        {showAdvancedOptions && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Pairing Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Meta Balance Weight: {metaBalanceWeight.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={metaBalanceWeight}
                  onChange={(e) => setMetaBalanceWeight(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher values prioritize matching different deck archetypes
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Time Constraint Weight: {timeConstraintWeight.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={timeConstraintWeight}
                  onChange={(e) => setTimeConstraintWeight(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher values prioritize finishing the tournament on time
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <input
                    id="tiered-entry"
                    type="checkbox"
                    checked={tournament.tieredEntryEnabled}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="tiered-entry" className="ml-2 text-sm font-medium text-gray-700">
                    Tiered Entry System
                  </label>
                </div>
                
                <div className="flex items-center mr-4">
                  <input
                    id="parallel-brackets"
                    type="checkbox"
                    checked={tournament.parallelBracketsEnabled}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="parallel-brackets" className="ml-2 text-sm font-medium text-gray-700">
                    Parallel Brackets
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="meta-balance"
                    type="checkbox"
                    checked={tournament.metaBalanceEnabled}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="meta-balance" className="ml-2 text-sm font-medium text-gray-700">
                    Meta Balance Incentives
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-primary flex items-center"
            onClick={handleGenerateNextRound}
            disabled={tournament.status === 'completed' || isGeneratingPairings}
          >
            {isGeneratingPairings ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle size={16} className="mr-2" />
                Generate Next Round
              </>
            )}
          </button>
          
          <button
            className="btn btn-secondary flex items-center"
            disabled={currentRound <= 1}
            onClick={() => handleRoundChange(currentRound - 1)}
          >
            Previous Round
          </button>
          
          <button
            className="btn btn-secondary flex items-center"
            disabled={currentRound >= tournament.rounds.length}
            onClick={() => handleRoundChange(currentRound + 1)}
          >
            Next Round
          </button>
        </div>
      </div>
      
      {/* Round Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Round {currentRound} of {tournament.rounds.length}
        </h3>
        
        {currentRoundData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Active Players</p>
                    <p className="text-xl font-semibold">{currentRoundData.matches.length * 2}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Completed Matches</p>
                    <p className="text-xl font-semibold">
                      {currentRoundData.matches.filter(match => match.completed).length} / {currentRoundData.matches.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Award className="text-purple-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Average Match Quality</p>
                    <p className="text-xl font-semibold">
                      {(currentRoundData.averageMatchQuality * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Special Features */}
            {tournament.metaBalanceEnabled && (
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="text-yellow-600 mr-2" size={20} />
                  <h4 className="font-semibold text-gray-800">Meta Balance Incentives Active</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Players using underrepresented archetypes receive bonus points in this tournament.
                </p>
                <div className="mt-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Current Bonuses:</h5>
                  <div className="flex flex-wrap gap-2">
                    {tournament.metaBalanceBonuses && tournament.metaBalanceBonuses.map((bonus, index) => (
                      <span key={index} className="bg-white text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-300">
                        {bonus.archetype}: +{bonus.points} points
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {tournament.parallelBracketsEnabled && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Layers className="text-blue-600 mr-2" size={20} />
                  <h4 className="font-semibold text-gray-800">Parallel Brackets Active</h4>
                </div>
                <p className="text-sm text-gray-600">
                  This tournament runs main and consolation brackets simultaneously.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Main Bracket:</h5>
                    <p className="text-xs text-gray-600">{tournament.mainBracketCount} players</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Consolation Bracket:</h5>
                    <p className="text-xs text-gray-600">{tournament.consolationBracketCount} players</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Matches */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Matches</h4>
                
                <div className="flex items-center">
                  <Filter size={16} className="text-gray-600 mr-1" />
                  <select className="text-sm border-gray-300 rounded-md">
                    <option value="all">All Matches</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="high_quality">High Quality</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentRoundData.matches.map((match, index) => (
                  <div 
                    key={match.id} 
                    className={`border rounded-lg overflow-hidden ${
                      match.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center mb-3 md:mb-0">
                          <div className="text-lg font-semibold text-gray-800 mr-3">
                            Table {index + 1}
                          </div>
                          
                          <div className="flex items-center">
                            <span className="font-medium">{match.player1.name}</span>
                            <span className="mx-2 text-gray-500">vs</span>
                            <span className="font-medium">{match.player2.name}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MatchQualityIndicator 
                            player1={match.player1} 
                            player2={match.player2} 
                          />
                          
                          {match.completed ? (
                            <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Complete
                            </span>
                          ) : (
                            <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                              <Clock size={12} className="mr-1" />
                              Pending
                            </span>
                          )}
                          
                          <button className="ml-2 text-gray-500">
                            {expandedMatch === match.id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {expandedMatch === match.id && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3">Match Details</h5>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Match ID:</span>
                                <span className="font-medium">{match.id}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-gray-600">Format:</span>
                                <span className="font-medium">{tournament.format}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-gray-600">Match Quality:</span>
                                <span className="font-medium">{(match.matchQuality * 100).toFixed(0)}%</span>
                              </div>
                              
                              {match.completed && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Result:</span>
                                  <span className="font-medium">
                                    {match.player1Score} - {match.player2Score}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3">Player Information</h5>
                            
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-blue-800 font-medium">1</span>
                                  </div>
                                  <span className="font-medium">{match.player1.name}</span>
                                </div>
                                <div className="ml-10 text-sm text-gray-600">
                                  Rating: {match.player1.rating.toFixed(0)}
                                  {match.player1.deck && (
                                    <span className="ml-2">
                                      Deck: {match.player1.deck.archetype}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-red-800 font-medium">2</span>
                                  </div>
                                  <span className="font-medium">{match.player2.name}</span>
                                </div>
                                <div className="ml-10 text-sm text-gray-600">
                                  Rating: {match.player2.rating.toFixed(0)}
                                  {match.player2.deck && (
                                    <span className="ml-2">
                                      Deck: {match.player2.deck.archetype}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {!match.completed && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h5 className="font-semibold text-gray-800 mb-3">Enter Result</h5>
                            
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <span className="mr-2">{match.player1.name}:</span>
                                <select 
                                  className="border-gray-300 rounded-md"
                                  onChange={(e) => handleMatchResult(match.id, parseInt(e.target.value), match.player2Score || 0)}
                                >
                                  <option value="">Select</option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                </select>
                              </div>
                              
                              <span className="mx-4">-</span>
                              
                              <div className="flex items-center">
                                <span className="mr-2">{match.player2.name}:</span>
                                <select 
                                  className="border-gray-300 rounded-md"
                                  onChange={(e) => handleMatchResult(match.id, match.player1Score || 0, parseInt(e.target.value))}
                                >
                                  <option value="">Select</option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                </select>
                              </div>
                              
                              <button 
                                className="ml-4 btn btn-sm btn-primary"
                                onClick={() => handleMatchResult(match.id, match.player1Score || 0, match.player2Score || 0)}
                                disabled={!match.player1Score && !match.player2Score}
                              >
                                Submit Result
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Tournament Standings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tournament Standings</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiebreakers
                </th>
                {tournament.metaBalanceEnabled && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta Bonus
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tournament.standings && tournament.standings.map((player, index) => (
                <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{player.name}</span>
                      {index < 3 && (
                        <Award className={`ml-2 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-amber-600'
                        }`} size={16} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-semibold">{player.points}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.wins}-{player.losses}{player.draws > 0 ? `-${player.draws}` : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {player.tiebreakers.map((tiebreaker, i) => (
                      <span key={i} className="mr-2">
                        {tiebreaker.name}: {tiebreaker.value.toFixed(2)}
                      </span>
                    ))}
                  </td>
                  {tournament.metaBalanceEnabled && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.metaBonus > 0 ? (
                        <span className="text-green-600 font-medium">+{player.metaBonus}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TournamentManager;