import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import TournamentManager from '../components/tournaments/TournamentManager';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock,
  Download,
  Share2,
  Printer
} from 'lucide-react';

const TournamentDetail = () => {
  const { id } = useParams();
  const { getTournamentById } = usePhysicalMatchmaking();
  
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const tournamentData = await getTournamentById(id);
        setTournament(tournamentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError('Failed to load tournament data');
        setLoading(false);
      }
    };
    
    fetchTournament();
  }, [id, getTournamentById]);
  
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
  
  // Render placeholder if no tournament data
  if (!tournament) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-6xl">
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">No tournament data available.</span>
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
          <div className="flex items-center mb-4">
            <Link to="/tournaments" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft size={16} className="mr-1" />
              Back to Tournaments
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
                <p className="text-purple-200 mt-1">{tournament.description}</p>
                
                <div className="flex flex-wrap items-center mt-3">
                  <div className="flex items-center text-white mr-4 mb-2">
                    <Calendar size={16} className="mr-1" />
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-white mr-4 mb-2">
                    <Clock size={16} className="mr-1" />
                    <span>{tournament.time}</span>
                  </div>
                  
                  <div className="flex items-center text-white mr-4 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{tournament.location}</span>
                  </div>
                  
                  <div className="flex items-center text-white mb-2">
                    <Users size={16} className="mr-1" />
                    <span>{tournament.participants.length} / {tournament.maxParticipants} participants</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex">
                <button className="btn btn-sm btn-outline-light flex items-center mr-2">
                  <Share2 size={14} className="mr-1" />
                  Share
                </button>
                
                <button className="btn btn-sm btn-outline-light flex items-center mr-2">
                  <Download size={14} className="mr-1" />
                  Export
                </button>
                
                <button className="btn btn-sm btn-outline-light flex items-center">
                  <Printer size={14} className="mr-1" />
                  Print
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap mt-4 pt-4 border-t border-purple-700">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mr-3 mb-2">
                <div className="flex items-center text-purple-200 mb-1">
                  <Trophy size={14} className="mr-1" />
                  <span className="text-xs">Format</span>
                </div>
                <p className="text-lg font-bold text-white">{tournament.format}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mr-3 mb-2">
                <div className="flex items-center text-purple-200 mb-1">
                  <Users size={14} className="mr-1" />
                  <span className="text-xs">Rounds</span>
                </div>
                <p className="text-lg font-bold text-white">{tournament.rounds.length}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-2">
                <div className="flex items-center text-purple-200 mb-1">
                  <Clock size={14} className="mr-1" />
                  <span className="text-xs">Status</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {tournament.status === 'in_progress' ? 'In Progress' : 
                   tournament.status === 'completed' ? 'Completed' : 'Upcoming'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tournament Manager */}
        <TournamentManager tournamentId={id} />
      </div>
    </div>
  );
};

export default TournamentDetail;