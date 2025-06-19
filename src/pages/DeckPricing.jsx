import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Upload,
  Download,
  Eye,
  BarChart3,
  PieChart,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const DeckPricing = () => {
  const [deckInput, setDeckInput] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('paper');
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('detailed');

  // Mock pricing data
  const [sampleDeck] = useState(`1 Vynnset, Iron Maiden
4 Lightning Strike
4 Flame Burst
3 Quick Draw
2 Fire Sword
4 Mountain Peak
4 Volcanic Vent
3 Flame Dancer
2 Inferno Blast
1 Ancient Fire Spirit
4 Burn Spell
3 Direct Damage
2 Fire Elemental
1 Legendary Flame
4 Basic Mountain
3 Fire Temple
2 Molten Core
1 Flame Sanctuary`);

  const [mockPriceData] = useState({
    totalPrice: 245.75,
    totalCards: 52,
    uniqueCards: 18,
    priceBreakdown: {
      paper: 245.75,
      mtgo: 89.50,
      arena: 0 // Free to play
    },
    cardPrices: [
      {
        name: 'Vynnset, Iron Maiden',
        quantity: 1,
        rarity: 'Legendary',
        set: 'Core Set 2024',
        paperPrice: 45.99,
        mtgoPrice: 12.50,
        arenaPrice: 0,
        totalPaper: 45.99,
        totalMtgo: 12.50,
        priceChange: 7.49,
        percentChange: 19.5,
        availability: 'In Stock'
      },
      {
        name: 'Lightning Strike',
        quantity: 4,
        rarity: 'Common',
        set: 'Core Set 2024',
        paperPrice: 2.50,
        mtgoPrice: 0.25,
        arenaPrice: 0,
        totalPaper: 10.00,
        totalMtgo: 1.00,
        priceChange: 0.70,
        percentChange: 38.9,
        availability: 'In Stock'
      },
      {
        name: 'Flame Burst',
        quantity: 4,
        rarity: 'Uncommon',
        set: 'Elemental Rising',
        paperPrice: 1.25,
        mtgoPrice: 0.15,
        arenaPrice: 0,
        totalPaper: 5.00,
        totalMtgo: 0.60,
        priceChange: -0.25,
        percentChange: -16.7,
        availability: 'Low Stock'
      },
      {
        name: 'Quick Draw',
        quantity: 3,
        rarity: 'Rare',
        set: 'Western Winds',
        paperPrice: 8.99,
        mtgoPrice: 2.75,
        arenaPrice: 0,
        totalPaper: 26.97,
        totalMtgo: 8.25,
        priceChange: 1.50,
        percentChange: 20.0,
        availability: 'In Stock'
      },
      {
        name: 'Fire Sword',
        quantity: 2,
        rarity: 'Rare',
        set: 'Artifacts Unleashed',
        paperPrice: 12.50,
        mtgoPrice: 3.25,
        arenaPrice: 0,
        totalPaper: 25.00,
        totalMtgo: 6.50,
        priceChange: -2.00,
        percentChange: -13.8,
        availability: 'In Stock'
      },
      {
        name: 'Ancient Fire Spirit',
        quantity: 1,
        rarity: 'Mythic',
        set: 'Legends of Old',
        paperPrice: 89.99,
        mtgoPrice: 25.00,
        arenaPrice: 0,
        totalPaper: 89.99,
        totalMtgo: 25.00,
        priceChange: 15.00,
        percentChange: 20.0,
        availability: 'Limited'
      }
    ],
    priceHistory: [
      { date: '2024-06-01', price: 220.50 },
      { date: '2024-06-05', price: 225.75 },
      { date: '2024-06-10', price: 235.25 },
      { date: '2024-06-15', price: 240.00 },
      { date: '2024-06-19', price: 245.75 }
    ],
    alternatives: [
      {
        name: 'Budget Version',
        price: 89.50,
        description: 'Replace expensive cards with budget alternatives',
        changes: [
          'Replace Ancient Fire Spirit with Fire Elemental ($5.99)',
          'Replace Vynnset with Budget Fire Hero ($12.99)',
          'Use basic lands instead of premium lands'
        ]
      },
      {
        name: 'Mid-Range Version',
        price: 165.25,
        description: 'Balanced version with some premium cards',
        changes: [
          'Keep Vynnset, replace Ancient Fire Spirit',
          'Use mix of premium and basic lands',
          'Include 2x Fire Sword instead of 3x'
        ]
      }
    ]
  });

  const analyzeDeck = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPriceData(mockPriceData);
      setLoading(false);
    }, 1500);
  };

  const loadSampleDeck = () => {
    setDeckInput(sampleDeck);
  };

  const exportPricing = () => {
    if (!priceData) return;
    
    const csvContent = [
      'Card Name,Quantity,Rarity,Set,Paper Price,MTGO Price,Total Paper,Total MTGO,Availability',
      ...priceData.cardPrices.map(card => 
        `"${card.name}",${card.quantity},${card.rarity},"${card.set}",${card.paperPrice},${card.mtgoPrice},${card.totalPaper},${card.totalMtgo},${card.availability}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deck-pricing.csv';
    a.click();
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'In Stock': return 'text-green-400';
      case 'Low Stock': return 'text-yellow-400';
      case 'Limited': return 'text-orange-400';
      case 'Out of Stock': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'In Stock': return <CheckCircle className="w-4 h-4" />;
      case 'Low Stock': return <Clock className="w-4 h-4" />;
      case 'Limited': return <AlertCircle className="w-4 h-4" />;
      case 'Out of Stock': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Deck Pricing Calculator
          </h1>
          <p className="text-gray-300 text-lg">
            Get accurate pricing for your decks across all formats
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-purple-400" />
                Deck Input
              </h2>

              {/* Format Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="paper">Paper (Physical Cards)</option>
                  <option value="mtgo">MTGO (Online)</option>
                  <option value="arena">Arena (Digital)</option>
                </select>
              </div>

              {/* Deck Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deck List
                </label>
                <textarea
                  value={deckInput}
                  onChange={(e) => setDeckInput(e.target.value)}
                  placeholder="Enter your deck list here...&#10;Format: Quantity Card Name&#10;Example:&#10;4 Lightning Strike&#10;1 Vynnset, Iron Maiden"
                  className="w-full h-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={analyzeDeck}
                  disabled={!deckInput.trim() || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Prices
                    </>
                  )}
                </button>
                
                <button
                  onClick={loadSampleDeck}
                  className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Load Sample Deck
                </button>

                <button
                  className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import from File
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {priceData ? (
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                      Price Summary
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                      >
                        {viewMode === 'detailed' ? 'Compact' : 'Detailed'}
                      </button>
                      <button
                        onClick={exportPricing}
                        className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors flex items-center"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Price Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        ${priceData.priceBreakdown.paper}
                      </div>
                      <div className="text-gray-400">Paper</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {priceData.priceBreakdown.mtgo} tix
                      </div>
                      <div className="text-gray-400">MTGO</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        Free
                      </div>
                      <div className="text-gray-400">Arena</div>
                    </div>
                  </div>

                  {/* Deck Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">{priceData.totalCards}</div>
                      <div className="text-gray-400 text-sm">Total Cards</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{priceData.uniqueCards}</div>
                      <div className="text-gray-400 text-sm">Unique Cards</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-400">
                        ${(priceData.totalPrice / priceData.totalCards).toFixed(2)}
                      </div>
                      <div className="text-gray-400 text-sm">Avg per Card</div>
                    </div>
                  </div>
                </div>

                {/* Card Breakdown */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Card Breakdown
                  </h3>

                  <div className="space-y-3">
                    {priceData.cardPrices.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/30 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold">{card.name}</h4>
                            <p className="text-gray-400 text-sm">
                              {card.quantity}x • {card.rarity} • {card.set}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ${card.totalPaper}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ${card.paperPrice} each
                            </div>
                          </div>
                        </div>

                        {viewMode === 'detailed' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">MTGO:</span>
                              <span className="ml-2">{card.totalMtgo} tix</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-400">Change:</span>
                              <span className={`ml-2 flex items-center ${
                                card.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {card.percentChange >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {card.percentChange >= 0 ? '+' : ''}{card.percentChange}%
                              </span>
                            </div>
                            <div className={`flex items-center ${getAvailabilityColor(card.availability)}`}>
                              {getAvailabilityIcon(card.availability)}
                              <span className="ml-1">{card.availability}</span>
                            </div>
                            <div>
                              <button className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors">
                                <ShoppingCart className="w-3 h-3 inline mr-1" />
                                Buy
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Budget Alternatives */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
                    Budget Alternatives
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {priceData.alternatives.map((alt, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold">{alt.name}</h4>
                          <div className="text-lg font-bold text-green-400">
                            ${alt.price}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{alt.description}</p>
                        <div className="space-y-1">
                          {alt.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="text-xs text-gray-300">
                              • {change}
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors text-sm">
                          Use This Version
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">
                  Enter a deck list to get started
                </h3>
                <p className="text-gray-500">
                  Paste your deck list in the input area and click "Calculate Prices" to see detailed pricing information.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DeckPricing;