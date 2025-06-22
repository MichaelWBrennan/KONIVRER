import React, { useState, useEffect } from 'react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import ConfidenceBandedTier from '../components/matchmaking/ConfidenceBandedTier';
import { 
  Trophy, 
  Medal, 
  Award, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Star,
  Info
} from 'lucide-react';

const ConfidenceBandedLeaderboard = () => {
  const { rankingEngine } = usePhysicalMatchmaking();
  
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterTier, setFilterTier] = useState('all');
  const [filterBand, setFilterBand] = useState('all');
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const leaderboardData = await rankingEngine.getLeaderboard();
        setPlayers(leaderboardData);
        setFilteredPlayers(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [rankingEngine]);
  
  useEffect(() => {
    // Apply filters and sorting
    let result = [...players];
    
    // Apply tier filter
    if (filterTier !== 'all') {
      result = result.filter(player => player.tier === filterTier);
    }
    
    // Apply confidence band filter
    if (filterBand !== 'all') {
      result = result.filter(player => player.confidenceBand === filterBand);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(player => 
        player.name.toLowerCase().includes(query) || 
        player.tier.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'tier':
          // Compare tiers first
          const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'mythic'];
          const tierComparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
          
          if (tierComparison !== 0) {
            comparison = tierComparison;
          } else {
            // If tiers are the same, compare confidence bands
            const bandOrder = ['uncertain', 'developing', 'established', 'proven'];
            comparison = bandOrder.indexOf(a.confidenceBand) - bandOrder.indexOf(b.confidenceBand);
          }
          break;
        case 'confidence':
          const bandOrder = ['uncertain', 'developing', 'established', 'proven'];
          comparison = bandOrder.indexOf(a.confidenceBand) - bandOrder.indexOf(b.confidenceBand);
          break;
        case 'winRate':
          comparison = a.winRate - b.winRate;
          break;
        default:
          comparison = a.rating - b.rating;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredPlayers(result);
  }, [players, searchQuery, sortBy, sortOrder, filterTier, filterBand]);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };
  
  const getBandIcon = (band) => {
    switch (band) {
      case 'uncertain': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'developing': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'established': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'proven': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };
  
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
  
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Confidence-Banded Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            Players ranked by skill rating and confidence level
            <button 
              className="ml-2 text-blue-600 hover:text-blue-800"
              onClick={() => setShowInfoModal(true)}
            >
              <Info size={16} />
            </button>
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                >
                  <option value="all">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="diamond">Diamond</option>
                  <option value="master">Master</option>
                  <option value="grandmaster">Grandmaster</option>
                  <option value="mythic">Mythic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterBand}
                  onChange={(e) => setFilterBand(e.target.value)}
                >
                  <option value="all">All Bands</option>
                  <option value="uncertain">Uncertain</option>
                  <option value="developing">Developing</option>
                  <option value="established">Established</option>
                  <option value="proven">Proven</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Player</span>
                      {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center">
                      <span>Rating</span>
                      {sortBy === 'rating' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('tier')}
                  >
                    <div className="flex items-center">
                      <span>Tier</span>
                      {sortBy === 'tier' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center">
                      <span>Confidence</span>
                      {sortBy === 'confidence' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('winRate')}
                  >
                    <div className="flex items-center">
                      <span>Win Rate</span>
                      {sortBy === 'winRate' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player, index) => (
                  <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                          {getRankIcon(index) || <span className="text-gray-700 font-medium">{index + 1}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.matches} matches</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{Math.round(player.rating)}</div>
                      <div className="text-xs text-gray-500">±{Math.round(player.uncertainty)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ConfidenceBandedTier 
                        tier={player.tier}
                        confidenceBand={player.confidenceBand}
                        lp={player.lp}
                        size="sm"
                        showProgress={false}
                        showDetails={false}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getBandIcon(player.confidenceBand)}
                        <span className="ml-1.5 text-sm text-gray-900">{player.confidenceBand}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="h-1.5 rounded-full bg-blue-600"
                          style={{ width: `${player.confidence * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{(player.winRate * 100).toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">{player.wins}W - {player.losses}L</div>
                    </td>
                  </tr>
                ))}
                
                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No players found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowInfoModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confidence-Banded Tier System</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  The Confidence-Banded Tier System groups players based on both skill rating and confidence levels, providing more meaningful matchmaking.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">Tiers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-amber-800">B</span>
                    </div>
                    <span>Bronze</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-gray-700">S</span>
                    </div>
                    <span>Silver</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-yellow-800">G</span>
                    </div>
                    <span>Gold</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-50 rounded-full flex items-center justify-center mr-2">
                      <span className="text-cyan-800">P</span>
                    </div>
                    <span>Platinum</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-blue-800">D</span>
                    </div>
                    <span>Diamond</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-red-800">M</span>
                    </div>
                    <span>Master</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-teal-800">GM</span>
                    </div>
                    <span>Grandmaster</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-purple-800">MY</span>
                    </div>
                    <span>Mythic</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800">Confidence Bands</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <span className="font-medium">Uncertain</span>
                      <p className="text-sm text-gray-600">Your rating is still being determined</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <span className="font-medium">Developing</span>
                      <p className="text-sm text-gray-600">Your rating is becoming more accurate</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <span className="font-medium">Established</span>
                      <p className="text-sm text-gray-600">Your rating is well-established</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <div>
                      <span className="font-medium">Proven</span>
                      <p className="text-sm text-gray-600">Your rating is highly accurate</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>More meaningful matchmaking based on both skill and confidence</li>
                  <li>Better visualization of your progress and rating stability</li>
                  <li>Clearer path for progression through the ranks</li>
                  <li>Rewards for improving both skill and consistency</li>
                </ul>
              </div>
              
              <button 
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                onClick={() => setShowInfoModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceBandedLeaderboard;