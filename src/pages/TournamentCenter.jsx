import { useState } from 'react';
import {
  Calendar,
  Trophy,
  Users,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Eye,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TournamentCenter = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    format: '',
    location: '',
    prizePool: '',
    status: '',
  });

  // Mock tournament data
  const tournaments = {
    upcoming: [
      {
        id: 1,
        name: 'KONIVRER World Championship 2024',
        format: 'Standard',
        date: '2024-07-15',
        time: '10:00 AM',
        location: 'Los Angeles Convention Center',
        prizePool: '$50,000',
        participants: 512,
        maxParticipants: 512,
        status: 'Registration Open',
        organizer: 'KONIVRER Official',
        description:
          'The premier tournament of the year featuring the best players from around the world.',
        rounds: 9,
        format_details: 'Swiss rounds followed by Top 8 elimination',
        registration_fee: '$75',
        registration_deadline: '2024-07-10',
      },
      {
        id: 2,
        name: 'Summer Regional Championship',
        format: 'Limited',
        date: '2024-06-20',
        time: '2:00 PM',
        location: 'Chicago Gaming Center',
        prizePool: '$15,000',
        participants: 128,
        maxParticipants: 256,
        status: 'Registration Open',
        organizer: 'Midwest Gaming League',
        description:
          'Regional championship featuring sealed deck format with latest expansion.',
        rounds: 7,
        format_details: 'Sealed deck construction + Swiss rounds',
        registration_fee: '$45',
        registration_deadline: '2024-06-18',
      },
      {
        id: 3,
        name: 'Friday Night Magic',
        format: 'Standard',
        date: '2024-06-14',
        time: '7:00 PM',
        location: 'Local Game Store Network',
        prizePool: '$500',
        participants: 32,
        maxParticipants: 64,
        status: 'Registration Open',
        organizer: 'LGS Network',
        description: 'Weekly casual tournament for local players.',
        rounds: 4,
        format_details: 'Swiss rounds, casual REL',
        registration_fee: '$10',
        registration_deadline: '2024-06-14',
      },
    ],
    live: [
      {
        id: 4,
        name: 'Spring Qualifier Tournament',
        format: 'Standard',
        date: '2024-06-09',
        time: '10:00 AM',
        location: 'Online',
        prizePool: '$5,000',
        participants: 256,
        maxParticipants: 256,
        status: 'Round 6 of 8',
        organizer: 'KONIVRER Online',
        description: 'Online qualifier for the World Championship.',
        rounds: 8,
        current_round: 6,
        top_tables: [
          {
            table: 1,
            player1: 'DragonMaster',
            player2: 'ElementalForce',
            score: '2-1',
          },
          {
            table: 2,
            player1: 'ShadowWeaver',
            player2: 'LightBringer',
            score: '1-2',
          },
          {
            table: 3,
            player1: 'StormCaller',
            player2: 'EarthShaker',
            score: '2-0',
          },
        ],
      },
    ],
    completed: [
      {
        id: 5,
        name: 'Spring Championship 2024',
        format: 'Standard',
        date: '2024-05-15',
        time: '10:00 AM',
        location: 'New York Convention Center',
        prizePool: '$25,000',
        participants: 384,
        maxParticipants: 384,
        status: 'Completed',
        organizer: 'KONIVRER Official',
        winner: 'ElementalMaster',
        top8: [
          'ElementalMaster',
          'ShadowLord',
          'DragonKnight',
          'StormMage',
          'EarthGuardian',
          'FireSpirit',
          'WaterSage',
          'AirDancer',
        ],
        winning_deck: {
          name: 'Elemental Control',
          archetype: 'Control',
          colors: ['🜁', '🜂'],
          cards: 60,
        },
      },
    ],
  };

  const filteredTournaments = tournaments[activeTab].filter(tournament => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat =
      !filters.format || tournament.format === filters.format;
    const matchesLocation =
      !filters.location ||
      tournament.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());

    return matchesSearch && matchesFormat && matchesLocation;
  });

  const TournamentCard = ({ tournament }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={() => setSelectedTournament(tournament)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {tournament.name}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{tournament.date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{tournament.time}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{tournament.location}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {tournament.prizePool}
          </div>
          <div
            className={`px-3 py-1 rounded text-xs font-medium ${
              tournament.status === 'Registration Open'
                ? 'bg-green-600 text-white'
                : tournament.status === 'Completed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-blue-600 text-white'
            }`}
          >
            {tournament.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-sm">Format</div>
          <div className="text-white font-bold">{tournament.format}</div>
        </div>
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-sm">Players</div>
          <div className="text-white font-bold">
            {tournament.participants}/{tournament.maxParticipants}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3 text-center">
          <div className="text-gray-300 text-sm">Rounds</div>
          <div className="text-white font-bold">
            {tournament.current_round
              ? `${tournament.current_round}/${tournament.rounds}`
              : tournament.rounds}
          </div>
        </div>
      </div>

      {tournament.top_tables && (
        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Featured Tables</h4>
          <div className="space-y-2">
            {tournament.top_tables.slice(0, 2).map(table => (
              <div
                key={table.table}
                className="bg-gray-700 rounded p-2 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Table {table.table}</span>
                  <span className="text-blue-400">{table.score}</span>
                </div>
                <div className="text-white">
                  {table.player1} vs {table.player2}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tournament.winner && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="text-yellow-400" size={16} />
            <span className="text-white font-medium">
              Winner: {tournament.winner}
            </span>
          </div>
          {tournament.winning_deck && (
            <div className="bg-gray-700 rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">
                    {tournament.winning_deck.name}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {tournament.winning_deck.archetype}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {tournament.winning_deck.colors.map((color, index) => (
                    <span key={index} className="text-lg">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-gray-300 text-sm">{tournament.description}</p>
    </motion.div>
  );

  const TournamentModal = ({ tournament, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {tournament.name}
              </h2>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>
                    {tournament.date} at {tournament.time}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{tournament.location}</span>
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-xs btn-ghost">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">
                  Tournament Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Format:</span>
                    <span className="text-white">{tournament.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Prize Pool:</span>
                    <span className="text-green-400 font-bold">
                      {tournament.prizePool}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Participants:</span>
                    <span className="text-white">
                      {tournament.participants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Organizer:</span>
                    <span className="text-white">{tournament.organizer}</span>
                  </div>
                  {tournament.registration_fee && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Entry Fee:</span>
                      <span className="text-white">
                        {tournament.registration_fee}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Format Details</h3>
                <p className="text-gray-300 text-sm">
                  {tournament.format_details}
                </p>
                {tournament.registration_deadline && (
                  <div className="mt-3 text-sm">
                    <span className="text-gray-300">
                      Registration Deadline:{' '}
                    </span>
                    <span className="text-yellow-400">
                      {tournament.registration_deadline}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {tournament.top8 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <Trophy className="text-yellow-400" size={16} />
                    <span>Top 8 Players</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {tournament.top8.map((player, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${index === 0 ? 'bg-yellow-600' : 'bg-gray-600'}`}
                      >
                        <span className="text-white">
                          {index + 1}. {player}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tournament.top_tables && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">
                    Live Featured Tables
                  </h3>
                  <div className="space-y-2">
                    {tournament.top_tables.map(table => (
                      <div
                        key={table.table}
                        className="bg-gray-600 rounded p-3"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300 text-sm">
                            Table {table.table}
                          </span>
                          <span className="text-blue-400 font-bold">
                            {table.score}
                          </span>
                        </div>
                        <div className="text-white text-sm">
                          {table.player1} vs {table.player2}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Description</h3>
            <p className="text-gray-300">{tournament.description}</p>
          </div>

          <div className="flex justify-end space-x-3">
            {tournament.status === 'Registration Open' && (
              <button className="btn btn-success">Register Now</button>
            )}
            {tournament.status === 'Completed' && tournament.winning_deck && (
              <button className="btn btn-primary flex items-center gap-2">
                <Download size={16} />
                <span>Download Winning Deck</span>
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tournament Center</h1>
          <p className="text-gray-300">
            Discover, register, and track tournaments worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={filters.format}
              onChange={e => setFilters({ ...filters, format: e.target.value })}
              className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Formats</option>
              <option value="Standard">Standard</option>
              <option value="Limited">Limited</option>
              <option value="Eternal">Eternal</option>
            </select>
            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={e =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button className="btn btn-primary flex items-center gap-2">
              <Filter size={16} />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          {[
            { key: 'upcoming', label: 'Upcoming', icon: Calendar },
            { key: 'live', label: 'Live', icon: Users },
            { key: 'completed', label: 'Completed', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn flex-1 ${
                  activeTab === tab.key ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                  {tournaments[tab.key].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </AnimatePresence>
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trophy size={48} className="mx-auto mb-4" />
              <p>No tournaments found matching your criteria.</p>
            </div>
          </div>
        )}

        {/* Tournament Modal */}
        <AnimatePresence>
          {selectedTournament && (
            <TournamentModal
              tournament={selectedTournament}
              onClose={() => setSelectedTournament(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentCenter;
