import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Calendar, 
  Star, 
  Filter,
  Search,
  Download,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  Shield,
  Sword,
  Target,
  Sparkles
} from 'lucide-react';

const CardSpoilers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [favoriteCards, setFavoriteCards] = useState(new Set());

  // Mock spoiler data
  const [spoilerSets] = useState([
    {
      id: 'shadows-awakening',
      name: 'Shadows Awakening',
      code: 'SHA',
      releaseDate: '2024-07-15',
      status: 'spoiling',
      totalCards: 250,
      spoiledCards: 89,
      description: 'Darkness rises as ancient shadows return to reclaim their power.'
    },
    {
      id: 'elemental-fury',
      name: 'Elemental Fury',
      code: 'ELF',
      releaseDate: '2024-09-20',
      status: 'preview',
      totalCards: 200,
      spoiledCards: 12,
      description: 'The elements clash in an epic battle for supremacy.'
    },
    {
      id: 'core-2025',
      name: 'Core Set 2025',
      code: 'C25',
      releaseDate: '2024-12-01',
      status: 'announced',
      totalCards: 300,
      spoiledCards: 0,
      description: 'The foundation of KONIVRER returns with new power.'
    }
  ]);

  const [spoilerCards] = useState([
    {
      id: 1,
      name: 'Shadowmere, the Void Walker',
      set: 'Shadows Awakening',
      setCode: 'SHA',
      rarity: 'Mythic',
      type: 'Legendary Hero',
      cost: 7,
      power: 8,
      defense: 6,
      description: 'When Shadowmere enters play, exile target opponent\'s hero until Shadowmere leaves play. Shadow abilities cost 2 less.',
      flavorText: 'In the depths of the void, even light fears to tread.',
      artist: 'Elena Vasquez',
      spoiledDate: '2024-06-19',
      spoiledBy: 'Official KONIVRER',
      image: '/api/placeholder/300/420',
      abilities: ['Shadow Walk', 'Void Manipulation', 'Hero Exile'],
      tags: ['Control', 'Late Game', 'Powerful'],
      rating: 4.8,
      votes: 247,
      comments: 89,
      hype: 95,
      competitiveRating: 'S-Tier'
    },
    {
      id: 2,
      name: 'Lightning Cascade',
      set: 'Elemental Fury',
      setCode: 'ELF',
      rarity: 'Rare',
      type: 'Instant Spell',
      cost: 4,
      power: null,
      defense: null,
      description: 'Deal 3 damage to target creature. If that creature dies, deal 3 damage to another target creature. Repeat until no creatures die.',
      flavorText: 'One spark becomes a storm.',
      artist: 'Marcus Chen',
      spoiledDate: '2024-06-18',
      spoiledBy: 'Pro Player Jake',
      image: '/api/placeholder/300/420',
      abilities: ['Chain Lightning', 'Creature Removal'],
      tags: ['Removal', 'Chain Effect', 'Aggressive'],
      rating: 4.2,
      votes: 156,
      comments: 43,
      hype: 78,
      competitiveRating: 'A-Tier'
    },
    {
      id: 3,
      name: 'Ancient Grove Guardian',
      set: 'Shadows Awakening',
      setCode: 'SHA',
      rarity: 'Rare',
      type: 'Creature - Elemental',
      cost: 5,
      power: 4,
      defense: 7,
      description: 'Defender, Reach. When Ancient Grove Guardian enters play, search your deck for a basic land and put it into play tapped.',
      flavorText: 'The forest remembers what mortals forget.',
      artist: 'Sarah Kim',
      spoiledDate: '2024-06-17',
      spoiledBy: 'Content Creator Alex',
      image: '/api/placeholder/300/420',
      abilities: ['Defender', 'Reach', 'Ramp'],
      tags: ['Defensive', 'Ramp', 'Value'],
      rating: 3.9,
      votes: 203,
      comments: 67,
      hype: 65,
      competitiveRating: 'B-Tier'
    },
    {
      id: 4,
      name: 'Flame Dancer\'s Ritual',
      set: 'Elemental Fury',
      setCode: 'ELF',
      rarity: 'Uncommon',
      type: 'Sorcery',
      cost: 2,
      power: null,
      defense: null,
      description: 'Deal 2 damage to any target. If you control a Flame Dancer, deal 4 damage instead and draw a card.',
      flavorText: 'The dance of flames tells ancient stories.',
      artist: 'David Rodriguez',
      spoiledDate: '2024-06-16',
      spoiledBy: 'Tournament Coverage',
      image: '/api/placeholder/300/420',
      abilities: ['Direct Damage', 'Card Draw'],
      tags: ['Burn', 'Synergy', 'Efficient'],
      rating: 4.1,
      votes: 134,
      comments: 28,
      hype: 72,
      competitiveRating: 'B-Tier'
    },
    {
      id: 5,
      name: 'Void Shard',
      set: 'Shadows Awakening',
      setCode: 'SHA',
      rarity: 'Legendary',
      type: 'Artifact',
      cost: 3,
      power: null,
      defense: null,
      description: 'Tap: Add one mana of any color. Tap, Sacrifice Void Shard: Exile target permanent. It returns to play at the beginning of the next end step.',
      flavorText: 'A fragment of the void itself, crystallized into reality.',
      artist: 'Lisa Wang',
      spoiledDate: '2024-06-15',
      spoiledBy: 'Official Preview',
      image: '/api/placeholder/300/420',
      abilities: ['Mana Generation', 'Temporary Exile'],
      tags: ['Utility', 'Flexible', 'Powerful'],
      rating: 4.6,
      votes: 312,
      comments: 156,
      hype: 88,
      competitiveRating: 'A-Tier'
    },
    {
      id: 6,
      name: 'Storm Caller Apprentice',
      set: 'Elemental Fury',
      setCode: 'ELF',
      rarity: 'Common',
      type: 'Creature - Human Wizard',
      cost: 2,
      power: 2,
      defense: 1,
      description: 'When Storm Caller Apprentice enters play, if you control another Wizard, deal 1 damage to any target.',
      flavorText: 'Every master was once a student.',
      artist: 'Tom Anderson',
      spoiledDate: '2024-06-14',
      spoiledBy: 'Community Reveal',
      image: '/api/placeholder/300/420',
      abilities: ['Tribal Synergy', 'Direct Damage'],
      tags: ['Aggressive', 'Tribal', 'Early Game'],
      rating: 3.4,
      votes: 89,
      comments: 15,
      hype: 45,
      competitiveRating: 'C-Tier'
    }
  ]);

  const filteredCards = spoilerCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.abilities.some(ability => ability.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSet = selectedSet === 'all' || card.set === selectedSet;
    const matchesRarity = selectedRarity === 'all' || card.rarity.toLowerCase() === selectedRarity.toLowerCase();
    const matchesType = selectedType === 'all' || card.type.toLowerCase().includes(selectedType.toLowerCase());
    
    return matchesSearch && matchesSet && matchesRarity && matchesType;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.spoiledDate) - new Date(a.spoiledDate);
      case 'oldest':
        return new Date(a.spoiledDate) - new Date(b.spoiledDate);
      case 'rating':
        return b.rating - a.rating;
      case 'hype':
        return b.hype - a.hype;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'cost':
        return a.cost - b.cost;
      default:
        return 0;
    }
  });

  const toggleFavorite = (cardId) => {
    const newFavorites = new Set(favoriteCards);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavoriteCards(newFavorites);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400';
      case 'Uncommon': return 'text-green-400 border-green-400';
      case 'Rare': return 'text-blue-400 border-blue-400';
      case 'Mythic': return 'text-purple-400 border-purple-400';
      case 'Legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getCompetitiveRatingColor = (rating) => {
    switch (rating) {
      case 'S-Tier': return 'bg-red-500';
      case 'A-Tier': return 'bg-orange-500';
      case 'B-Tier': return 'bg-yellow-500';
      case 'C-Tier': return 'bg-green-500';
      case 'D-Tier': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    if (type.includes('Hero') || type.includes('Legendary')) {
      return <Star className="w-4 h-4" />;
    } else if (type.includes('Creature')) {
      return <Sword className="w-4 h-4" />;
    } else if (type.includes('Spell') || type.includes('Sorcery') || type.includes('Instant')) {
      return <Zap className="w-4 h-4" />;
    } else if (type.includes('Artifact')) {
      return <Target className="w-4 h-4" />;
    } else {
      return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Card Spoilers & Previews
          </h1>
          <p className="text-gray-300 text-lg">
            Discover the latest cards before they hit the battlefield
          </p>
        </motion.div>

        {/* Set Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {spoilerSets.map((set) => (
            <div key={set.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{set.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  set.status === 'spoiling' ? 'bg-green-500' :
                  set.status === 'preview' ? 'bg-yellow-500' :
                  'bg-gray-500'
                } text-white`}>
                  {set.status}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{set.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date:</span>
                  <span>{set.releaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cards Spoiled:</span>
                  <span>{set.spoiledCards}/{set.totalCards}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(set.spoiledCards / set.totalCards) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Set Filter */}
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Sets</option>
              {spoilerSets.map(set => (
                <option key={set.id} value={set.name}>{set.name}</option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="mythic">Mythic</option>
              <option value="legendary">Legendary</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="hero">Heroes</option>
              <option value="creature">Creatures</option>
              <option value="spell">Spells</option>
              <option value="artifact">Artifacts</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="hype">Most Hyped</option>
              <option value="name">Alphabetical</option>
              <option value="cost">Cost</option>
            </select>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 ${getRarityColor(card.rarity)} hover:border-purple-500 transition-all duration-300 overflow-hidden`}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 flex items-center">
                      {getTypeIcon(card.type)}
                      <span className="ml-2">{card.name}</span>
                    </h3>
                    <p className="text-gray-400 text-sm">{card.type}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(card.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favoriteCards.has(card.id) 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favoriteCards.has(card.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Cost and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{card.cost}</div>
                      <div className="text-gray-400 text-xs">Cost</div>
                    </div>
                    {card.power !== null && (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{card.power}</div>
                          <div className="text-gray-400 text-xs">Power</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{card.defense}</div>
                          <div className="text-gray-400 text-xs">Defense</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitiveRatingColor(card.competitiveRating)} text-white`}>
                      {card.competitiveRating}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(card.rarity)}`}>
                      {card.rarity}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">{card.description}</p>
                  <p className="text-gray-500 text-xs italic">"{card.flavorText}"</p>
                </div>

                {/* Abilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Abilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {card.abilities.map((ability, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600/30 rounded text-xs">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-bold">{card.rating}</span>
                    </div>
                    <div className="text-gray-400 text-xs">{card.votes} votes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="font-bold">{card.hype}%</span>
                    </div>
                    <div className="text-gray-400 text-xs">Hype</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="font-bold">{card.comments}</span>
                    </div>
                    <div className="text-gray-400 text-xs">Comments</div>
                  </div>
                </div>

                {/* Spoiler Info */}
                <div className="text-xs text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Spoiled by: {card.spoiledBy}</span>
                    <span>{card.spoiledDate}</span>
                  </div>
                  <div className="mt-1">
                    <span>Artist: {card.artist}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {sortedCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No spoilers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new spoilers</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CardSpoilers;