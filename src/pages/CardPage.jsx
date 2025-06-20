import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Heart,
  Bookmark,
  ExternalLink,
  Copy,
  Share2,
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Shield,
  Star,
  Eye,
  MessageSquare,
  Download,
  Upload,
} from 'lucide-react';
import cardsData from '../data/cards.json';

const CardPage = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find card by ID
    const foundCard = cardsData.find(c => c.id === cardId);
    if (foundCard) {
      setCard(foundCard);
    }
  }, [cardId]);

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎴</div>
          <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
          <p className="text-secondary mb-4">
            The card you're looking for doesn't exist.
          </p>
          <button onClick={() => navigate('/hub')} className="btn btn-primary">
            Back to Game Platform
          </button>
        </div>
      </div>
    );
  }

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 border-gray-600';
      case 'uncommon':
        return 'text-green-600 border-green-600';
      case 'rare':
        return 'text-blue-600 border-blue-600';
      case 'mythic':
        return 'text-purple-600 border-purple-600';
      case 'legendary':
        return 'text-yellow-600 border-yellow-600';
      default:
        return 'text-gray-600 border-gray-600';
    }
  };

  const getElementInfo = element => {
    const elementMap = {
      Inferno: { symbol: '🔥', name: 'Inferno', color: 'text-red-500' },
      Steadfast: { symbol: '🛡️', name: 'Steadfast', color: 'text-green-500' },
      Submerged: { symbol: '🌊', name: 'Submerged', color: 'text-blue-500' },
      Aether: { symbol: '⭘', name: 'Aether', color: 'text-purple-500' },
      Void: { symbol: '∇', name: 'Void', color: 'text-gray-500' },
    };
    return (
      elementMap[element] || {
        symbol: element,
        name: element,
        color: 'text-gray-500',
      }
    );
  };

  // Mock data for different sections
  const formatLegality = {
    Standard: 'Legal',
    Pioneer: 'Not Legal',
    Modern: 'Legal',
    Legacy: 'Legal',
    Vintage: 'Legal',
    Commander: 'Legal',
    Brawl: 'Legal',
    Historic: 'Legal',
    Pauper: card.rarity === 'common' ? 'Legal' : 'Not Legal',
  };

  const marketData = {
    currentPrice: '$2.45',
    dayChange: '+$0.15 (+6.5%)',
    weekChange: '+$0.32 (+15.1%)',
    monthChange: '-$0.08 (-3.2%)',
    volume24h: '1,247 cards',
    marketCap: '$45,892',
    holders: '3,421',
  };

  const deckUsage = [
    {
      deck: 'Elemental Storm Control',
      percentage: 87,
      winRate: 68.2,
      games: 1247,
    },
    { deck: 'Blazing Aggro Rush', percentage: 23, winRate: 72.1, games: 892 },
    { deck: "Nature's Harmony", percentage: 45, winRate: 64.3, games: 678 },
    { deck: 'Shadow Assassin', percentage: 12, winRate: 59.8, games: 534 },
  ];

  const communityRating = {
    overall: 4.2,
    power: 4.5,
    versatility: 3.8,
    design: 4.7,
    totalRatings: 1847,
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'market', label: 'Market Data', icon: DollarSign },
    { id: 'meta', label: 'Meta Analysis', icon: BarChart3 },
    { id: 'decks', label: 'Deck Usage', icon: Target },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'collection', label: 'Collection', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hub')}
                className="btn btn-ghost"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold">{card.name}</h1>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span>{card.type}</span>
                  <span>•</span>
                  <span className={getRarityColor(card.rarity)}>
                    {card.rarity}
                  </span>
                  <span>•</span>
                  <span>{card.set}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`btn ${isFavorite ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`btn ${isBookmarked ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              <button className="btn btn-ghost">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Card Image and Quick Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {/* Card Image */}
              <div className="bg-card rounded-lg p-6 mb-6">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-gray-200 shadow-lg mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎴</div>
                    <div className="text-lg font-medium text-gray-600">
                      {card.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Card Artwork
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {card.cost}
                    </div>
                    <div className="text-sm text-secondary">Cost</div>
                  </div>
                  {card.power !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {card.power}
                      </div>
                      <div className="text-sm text-secondary">Power</div>
                    </div>
                  )}
                </div>

                {/* Elements */}
                <div className="flex justify-center gap-2 mb-4">
                  {card.elements.map((element, index) => {
                    const elementInfo = getElementInfo(element);
                    return (
                      <div key={index} className="flex items-center gap-1">
                        <span
                          className={`text-2xl ${elementInfo.color}`}
                          title={elementInfo.name}
                        >
                          {elementInfo.symbol}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">Add to Collection</h3>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-ghost w-8 h-8 p-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border border-color rounded px-2 py-1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-ghost w-8 h-8 p-0"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2">
                  <button className="btn btn-primary w-full">
                    <Plus className="w-4 h-4" />
                    Add to Deck
                  </button>
                  <button className="btn btn-secondary w-full">
                    <Download className="w-4 h-4" />
                    Add to Wishlist
                  </button>
                  <button className="btn btn-ghost w-full">
                    <Upload className="w-4 h-4" />
                    Trade/Sell
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tab Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Card Details */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Card Details</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Card Text</h3>
                          <div className="bg-tertiary rounded-lg p-4">
                            <p className="leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </div>

                        {card.keywords.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                              {card.keywords.map(keyword => (
                                <span
                                  key={keyword}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {card.flavorText && (
                          <div>
                            <h3 className="font-semibold mb-2">Flavor Text</h3>
                            <div className="bg-tertiary rounded-lg p-4">
                              <p className="italic text-secondary">
                                {card.flavorText}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Format Legality */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Format Legality
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(formatLegality).map(
                          ([format, legality]) => (
                            <div
                              key={format}
                              className="flex justify-between items-center p-3 bg-tertiary rounded"
                            >
                              <span className="font-medium">{format}</span>
                              <span
                                className={`font-semibold ${legality === 'Legal' ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {legality}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Rules and Notes */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Rules and Notes
                      </h2>
                      <div className="space-y-3 text-sm">
                        <p>• This card follows standard KONIVRER game rules.</p>
                        <p>
                          • Element costs must be paid from matching element
                          sources.
                        </p>
                        {card.power !== undefined && (
                          <p>
                            • Power represents the card's combat effectiveness.
                          </p>
                        )}
                        {card.keywords.length > 0 && (
                          <p>
                            • Keywords provide additional abilities and
                            interactions.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'market' && (
                  <div className="space-y-6">
                    {/* Current Price */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Market Price</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {marketData.currentPrice}
                          </div>
                          <div className="text-sm text-secondary">
                            Current Price
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {marketData.dayChange}
                          </div>
                          <div className="text-sm text-secondary">
                            24h Change
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {marketData.volume24h}
                          </div>
                          <div className="text-sm text-secondary">
                            24h Volume
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {marketData.holders}
                          </div>
                          <div className="text-sm text-secondary">Holders</div>
                        </div>
                      </div>
                    </div>

                    {/* Price History Chart */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Price History</h2>
                      <div className="h-64 bg-tertiary rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-secondary" />
                          <p className="text-secondary">
                            Price chart visualization would go here
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Market Stats */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Market Statistics
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Market Cap</span>
                            <span className="font-semibold">
                              {marketData.marketCap}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>7d Change</span>
                            <span className="font-semibold text-green-600">
                              {marketData.weekChange}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>30d Change</span>
                            <span className="font-semibold text-red-600">
                              {marketData.monthChange}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Supply</span>
                            <span className="font-semibold">10,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Circulating</span>
                            <span className="font-semibold">8,742</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Burned</span>
                            <span className="font-semibold">1,258</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'meta' && (
                  <div className="space-y-6">
                    {/* Meta Performance */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Meta Performance
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            73.2%
                          </div>
                          <div className="text-sm text-secondary">
                            Play Rate
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            68.5%
                          </div>
                          <div className="text-sm text-secondary">Win Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            2.3
                          </div>
                          <div className="text-sm text-secondary">
                            Avg Copies
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            #3
                          </div>
                          <div className="text-sm text-secondary">
                            Meta Rank
                          </div>
                        </div>
                      </div>

                      <div className="bg-tertiary rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Trending</h3>
                        <p className="text-sm text-secondary">
                          This card has seen a 15% increase in play rate over
                          the last week, primarily in control archetypes. Strong
                          performance against aggro decks.
                        </p>
                      </div>
                    </div>

                    {/* Deck Usage */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Top Decks Using This Card
                      </h2>
                      <div className="space-y-4">
                        {deckUsage.map((deck, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-tertiary rounded-lg"
                          >
                            <div>
                              <h3 className="font-semibold">{deck.deck}</h3>
                              <p className="text-sm text-secondary">
                                {deck.games} games played
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {deck.percentage}%
                              </div>
                              <div className="text-sm text-secondary">
                                Win Rate: {deck.winRate}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'decks' && (
                  <div className="space-y-6">
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Deck Lists Featuring This Card
                      </h2>
                      <div className="space-y-4">
                        {deckUsage.map((deck, index) => (
                          <div
                            key={index}
                            className="border border-color rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-lg">
                                {deck.deck}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">
                                  {deck.winRate}% WR
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-secondary">Games:</span>
                                <span className="ml-1 font-semibold">
                                  {deck.games}
                                </span>
                              </div>
                              <div>
                                <span className="text-secondary">Usage:</span>
                                <span className="ml-1 font-semibold">
                                  {deck.percentage}%
                                </span>
                              </div>
                              <div>
                                <span className="text-secondary">Copies:</span>
                                <span className="ml-1 font-semibold">2-3</span>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button className="btn btn-sm btn-primary">
                                View Deck
                              </button>
                              <button className="btn btn-sm btn-ghost">
                                Copy List
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'community' && (
                  <div className="space-y-6">
                    {/* Community Rating */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Community Rating
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {communityRating.overall}
                          </div>
                          <div className="text-sm text-secondary">Overall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {communityRating.power}
                          </div>
                          <div className="text-sm text-secondary">
                            Power Level
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {communityRating.versatility}
                          </div>
                          <div className="text-sm text-secondary">
                            Versatility
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {communityRating.design}
                          </div>
                          <div className="text-sm text-secondary">Design</div>
                        </div>
                      </div>
                      <p className="text-sm text-secondary text-center">
                        Based on {communityRating.totalRatings.toLocaleString()}{' '}
                        community ratings
                      </p>
                    </div>

                    {/* Comments */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Community Discussion
                      </h2>
                      <div className="space-y-4">
                        <div className="border border-color rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                              JD
                            </div>
                            <div>
                              <div className="font-semibold">JohnDoe_MTG</div>
                              <div className="text-xs text-secondary">
                                2 hours ago
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">
                            This card is absolutely broken in the current meta.
                            The versatility it provides is unmatched, and it
                            fits into almost every deck archetype.
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <button className="flex items-center gap-1 text-secondary hover:text-primary">
                              <Heart className="w-4 h-4" />
                              24
                            </button>
                            <button className="flex items-center gap-1 text-secondary hover:text-primary">
                              <MessageSquare className="w-4 h-4" />
                              Reply
                            </button>
                          </div>
                        </div>

                        <div className="border border-color rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              SM
                            </div>
                            <div>
                              <div className="font-semibold">SpellMaster</div>
                              <div className="text-xs text-secondary">
                                5 hours ago
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">
                            Great card for beginners to learn the game
                            mechanics. The cost is reasonable and the effect is
                            straightforward but powerful.
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <button className="flex items-center gap-1 text-secondary hover:text-primary">
                              <Heart className="w-4 h-4" />
                              18
                            </button>
                            <button className="flex items-center gap-1 text-secondary hover:text-primary">
                              <MessageSquare className="w-4 h-4" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-color">
                        <textarea
                          placeholder="Share your thoughts about this card..."
                          className="w-full p-3 border border-color rounded-lg resize-none"
                          rows="3"
                        />
                        <div className="flex justify-end mt-2">
                          <button className="btn btn-primary">
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'collection' && (
                  <div className="space-y-6">
                    {/* Collection Status */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Collection Status
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            3
                          </div>
                          <div className="text-sm text-secondary">Owned</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            1
                          </div>
                          <div className="text-sm text-secondary">Foil</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            $7.35
                          </div>
                          <div className="text-sm text-secondary">
                            Total Value
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            2
                          </div>
                          <div className="text-sm text-secondary">In Decks</div>
                        </div>
                      </div>
                    </div>

                    {/* Collection Actions */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Collection Management
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold">Add to Collection</h3>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Quantity"
                              className="flex-1 p-2 border border-color rounded"
                            />
                            <select className="p-2 border border-color rounded">
                              <option>Normal</option>
                              <option>Foil</option>
                              <option>Alternate Art</option>
                            </select>
                          </div>
                          <button className="btn btn-primary w-full">
                            Add to Collection
                          </button>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold">Trading</h3>
                          <div className="space-y-2">
                            <button className="btn btn-secondary w-full">
                              List for Trade
                            </button>
                            <button className="btn btn-ghost w-full">
                              Find Traders
                            </button>
                            <button className="btn btn-ghost w-full">
                              Price Alerts
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wishlist */}
                    <div className="bg-card rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Wishlist & Alerts
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-tertiary rounded">
                          <span>Price Alert: Below $2.00</span>
                          <button className="btn btn-sm btn-ghost">
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-tertiary rounded">
                          <span>Restock Alert: Foil Version</span>
                          <button className="btn btn-sm btn-ghost">
                            Remove
                          </button>
                        </div>
                        <button className="btn btn-primary w-full">
                          Add New Alert
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
