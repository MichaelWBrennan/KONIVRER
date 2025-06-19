import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Trophy,
  User,
  Download,
  Eye,
  Star,
} from 'lucide-react';

const OfficialDecklists = () => {
  const [decklists, setDecklists] = useState([]);
  const [filteredDecklists, setFilteredDecklists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedHero, setSelectedHero] = useState('');
  const [selectedResult, setSelectedResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Sample decklist data
  const sampleDecklists = [
    {
      id: 1,
      player: 'Majin Bae',
      hero: 'Verdance, Thorn of the Rose',
      country: 'US',
      date: '2025-06-06',
      event: 'US National Championship 2025',
      format: 'Classic Constructed',
      result: '1st',
      deckType: 'Aggro Nature',
      cards: [
        { name: 'Thornweave Assault', quantity: 3 },
        { name: "Nature's Wrath", quantity: 3 },
        { name: 'Verdant Bloom', quantity: 2 },
      ],
      featured: true,
    },
    {
      id: 2,
      player: 'Jacob Shaker',
      hero: 'Gravy Bones, Shipwrecked Looter',
      country: 'US',
      date: '2025-06-06',
      event: 'US National Championship 2025',
      format: 'Classic Constructed',
      result: '2nd',
      deckType: 'Pirate Aggro',
      cards: [
        { name: 'Cutlass Strike', quantity: 3 },
        { name: 'Plunder the Depths', quantity: 3 },
        { name: 'Seafoam Surge', quantity: 2 },
      ],
      featured: false,
    },
    {
      id: 3,
      player: 'Brodie Spurlock',
      hero: 'Gravy Bones, Shipwrecked Looter',
      country: 'US',
      date: '2025-06-08',
      event: 'Battle Hardened: Las Vegas',
      format: 'Classic Constructed',
      result: '1st',
      deckType: 'Pirate Control',
      cards: [
        { name: 'Tidal Surge', quantity: 3 },
        { name: "Kraken's Embrace", quantity: 2 },
        { name: 'Deep Sea Meditation', quantity: 3 },
      ],
      featured: true,
    },
    {
      id: 4,
      player: 'Spencer Horton',
      hero: 'Marlynn',
      country: 'AU',
      date: '2025-05-25',
      event: 'Battle Hardened: Taipei',
      format: 'Sealed Deck',
      result: '1st',
      deckType: 'Sealed Build',
      cards: [
        { name: 'Lightning Strike', quantity: 2 },
        { name: 'Storm Call', quantity: 1 },
        { name: 'Thunder Clap', quantity: 3 },
      ],
      featured: false,
    },
    {
      id: 5,
      player: 'Ryosuke Urase',
      hero: 'Florian, Rotwood Harbinger',
      country: 'JP',
      date: '2025-05-18',
      event: 'Battle Hardened: Tokyo',
      format: 'Classic Constructed',
      result: '1st',
      deckType: 'Earth Control',
      cards: [
        { name: 'Earthen Barrier', quantity: 3 },
        { name: 'Root Network', quantity: 3 },
        { name: "Gaia's Blessing", quantity: 2 },
      ],
      featured: true,
    },
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
  ];

  const formats = [
    'Classic Constructed',
    'Blitz',
    'Sealed Deck',
    'Booster Draft',
    'Legacy',
  ];

  const heroes = [
    'Verdance, Thorn of the Rose',
    'Gravy Bones, Shipwrecked Looter',
    'Florian, Rotwood Harbinger',
    'Marlynn',
    'Nuu, Alluring Desire',
    'Azalea, Ace in the Hole',
    'Kano, Dracai of Aether',
  ];

  const results = ['1st', '2nd', '3rd', '4th', '5th-8th', 'Top 16', 'Top 32'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDecklists(sampleDecklists);
      setFilteredDecklists(sampleDecklists);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = decklists;

    if (searchTerm) {
      filtered = filtered.filter(
        deck =>
          deck.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deck.hero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deck.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deck.cards.some(card =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(deck => deck.country === selectedCountry);
    }

    if (selectedFormat) {
      filtered = filtered.filter(deck => deck.format === selectedFormat);
    }

    if (selectedHero) {
      filtered = filtered.filter(deck => deck.hero === selectedHero);
    }

    if (selectedResult) {
      filtered = filtered.filter(deck => deck.result === selectedResult);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'player':
          aValue = a.player.toLowerCase();
          bValue = b.player.toLowerCase();
          break;
        case 'event':
          aValue = a.event.toLowerCase();
          bValue = b.event.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDecklists(filtered);
  }, [
    decklists,
    searchTerm,
    selectedCountry,
    selectedFormat,
    selectedHero,
    selectedResult,
    sortBy,
    sortOrder,
  ]);

  const getCountryFlag = countryCode => {
    const flags = {
      US: '🇺🇸',
      CA: '🇨🇦',
      AU: '🇦🇺',
      JP: '🇯🇵',
      GB: '🇬🇧',
      DE: '🇩🇪',
      FR: '🇫🇷',
      IT: '🇮🇹',
    };
    return flags[countryCode] || '🌍';
  };

  const getResultBadge = result => {
    const colors = {
      '1st': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      '2nd': 'bg-gray-400/20 text-gray-300 border-gray-400/30',
      '3rd': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    };

    return (
      colors[result] || 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading tournament decklists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tournament Decklists
          </h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players, heroes, events, or card names..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Formats</option>
                {formats.map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedHero}
                onChange={e => setSelectedHero(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Heroes</option>
                {heroes.map(hero => (
                  <option key={hero} value={hero}>
                    {hero}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedResult}
                onChange={e => setSelectedResult(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Results</option>
                {results.map(result => (
                  <option key={result} value={result}>
                    {result}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="player-asc">Player A-Z</option>
                <option value="player-desc">Player Z-A</option>
                <option value="event-asc">Event A-Z</option>
                <option value="event-desc">Event Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Found {filteredDecklists.length} decklist
            {filteredDecklists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Decklists Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Decklist
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Format
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Hero
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Result
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDecklists.map((deck, index) => (
                  <tr
                    key={deck.id}
                    className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
                      deck.featured ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl">
                        {getCountryFlag(deck.country)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(deck.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {deck.featured && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                        <div>
                          <div className="text-white font-semibold">
                            {deck.player}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {deck.deckType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-purple-400 hover:text-purple-300 cursor-pointer">
                        {deck.event}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{deck.format}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{deck.hero}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getResultBadge(deck.result)}`}
                      >
                        {deck.result}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredDecklists.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No decklists found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or check back later for new
              tournament results.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredDecklists.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialDecklists;
