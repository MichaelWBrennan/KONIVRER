import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Award,
  Target,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, live, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Mock tournament data
  useEffect(() => {
    const mockTournaments = [
      {
        id: 1,
        name: 'KONIVRER World Championship 2024',
        type: 'Championship',
        format: 'Standard',
        status: 'upcoming',
        date: '2024-07-15',
        time: '10:00 AM',
        location: 'Los Angeles Convention Center',
        organizer: 'KONIVRER Official',
        participants: 128,
        maxParticipants: 256,
        prizePool: '$50,000',
        entryFee: '$25',
        description: 'The ultimate KONIVRER tournament featuring the best players from around the world.',
        image: '/api/placeholder/400/200',
        rounds: 8,
        judge: 'Head Judge Sarah Chen',
        featured: true,
      },
      {
        id: 2,
        name: 'Friday Night KONIVRER',
        type: 'Weekly',
        format: 'Standard',
        status: 'live',
        date: '2024-06-07',
        time: '7:00 PM',
        location: 'GameHub Local Store',
        organizer: 'GameHub',
        participants: 24,
        maxParticipants: 32,
        prizePool: '$200',
        entryFee: '$10',
        description: 'Weekly casual tournament for local players.',
        rounds: 5,
        judge: 'Store Judge Mike Wilson',
        featured: false,
      },
      {
        id: 3,
        name: 'Regional Qualifier - East Coast',
        type: 'Qualifier',
        format: 'Standard',
        status: 'upcoming',
        date: '2024-06-20',
        time: '9:00 AM',
        location: 'New York Gaming Center',
        organizer: 'KONIVRER Regional',
        participants: 64,
        maxParticipants: 128,
        prizePool: '$5,000',
        entryFee: '$15',
        description: 'Qualify for the World Championship with top 8 placement.',
        rounds: 7,
        judge: 'Regional Judge Alex Thompson',
        featured: true,
      },
      {
        id: 4,
        name: 'Draft Masters Cup',
        type: 'Draft',
        format: 'Draft',
        status: 'completed',
        date: '2024-05-30',
        time: '2:00 PM',
        location: 'Online',
        organizer: 'KONIVRER Digital',
        participants: 16,
        maxParticipants: 16,
        prizePool: '$500',
        entryFee: '$20',
        description: 'Elite draft tournament for experienced players.',
        rounds: 4,
        judge: 'Digital Judge Emma Davis',
        featured: false,
        winner: 'DragonMaster2024',
      },
    ];
    setTournaments(mockTournaments);
  }, []);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesFilter = filter === 'all' || tournament.status === filter;
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-600 text-white';
      case 'upcoming': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live': return <Zap size={14} />;
      case 'upcoming': return <Calendar size={14} />;
      case 'completed': return <Award size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Organized Play</h1>
            <p className="text-secondary">
              Compete in official KONIVRER tournaments and events
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Link to="/tournaments/create" className="btn btn-primary">
              <Plus size={16} />
              Create Tournament
            </Link>
            <Link to="/judge-center" className="btn btn-secondary">
              <Target size={16} />
              Judge Center
            </Link>
          </div>
        </div>

        {/* Featured Tournaments */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {tournaments.filter(t => t.featured).map(tournament => (
              <div key={tournament.id} className="card bg-gradient-to-br from-accent-primary to-accent-secondary text-white relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={20} className="text-yellow-300" />
                    <span className="text-sm font-medium text-yellow-300">{tournament.type}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tournament.name}</h3>
                  <p className="text-white/90 mb-4 line-clamp-2">{tournament.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} />
                      <span>{new Date(tournament.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} />
                      <span>{tournament.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{tournament.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={14} />
                      <span>{tournament.participants}/{tournament.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-white/80">Prize Pool: </span>
                      <span className="font-semibold text-yellow-300">{tournament.prizePool}</span>
                    </div>
                    <Link to={`/tournaments/${tournament.id}`} className="btn btn-ghost text-white border-white/30 hover:bg-white/20">
                      <Eye size={16} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {['all', 'upcoming', 'live', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Tournament List */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTournaments.map(tournament => (
            <div key={tournament.id} className="card hover:border-accent-primary transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-accent-primary" />
                  <span className="text-sm font-medium text-accent-primary">{tournament.type}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                  {getStatusIcon(tournament.status)}
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </span>
              </div>

              <h3 className="font-semibold mb-2 line-clamp-2">{tournament.name}</h3>
              <p className="text-sm text-secondary mb-4 line-clamp-2">{tournament.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-muted" />
                  <span>{new Date(tournament.date).toLocaleDateString()} at {tournament.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted" />
                  <span className="line-clamp-1">{tournament.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-muted" />
                  <span>{tournament.participants}/{tournament.maxParticipants} players</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star size={14} className="text-muted" />
                  <span>{tournament.judge}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-color">
                <div className="text-sm">
                  <span className="text-muted">Entry: </span>
                  <span className="font-medium">{tournament.entryFee}</span>
                  <span className="text-muted"> • Prize: </span>
                  <span className="font-medium text-accent-primary">{tournament.prizePool}</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/tournaments/${tournament.id}`} className="btn btn-sm btn-secondary">
                    <Eye size={14} />
                  </Link>
                  {tournament.status === 'upcoming' && (
                    <button className="btn btn-sm btn-primary">
                      Register
                    </button>
                  )}
                </div>
              </div>

              {tournament.winner && (
                <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded">
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-yellow-100">Winner: {tournament.winner}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-secondary mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'No tournaments match your current filters'}
            </p>
            <Link to="/tournaments/create" className="btn btn-primary">
              <Plus size={16} />
              Create Tournament
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export { Tournaments };
export default Tournaments;