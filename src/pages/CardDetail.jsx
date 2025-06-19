import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

const CardDetail = () => {
  const { cardId } = useParams();
  const { cards } = useData();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (cards && cardId) {
      const foundCard = cards.find(
        c =>
          c.id === cardId ||
          c.name.toLowerCase().replace(/\s+/g, '-') === cardId,
      );
      setCard(foundCard);
      setLoading(false);
    }
  }, [cards, cardId]);

  const getRarityColor = rarity => {
    const colors = {
      common: 'text-gray-400 border-gray-400',
      uncommon: 'text-green-400 border-green-400',
      rare: 'text-blue-400 border-blue-400',
      mythic: 'text-purple-400 border-purple-400',
      legendary: 'text-orange-400 border-orange-400',
    };
    return colors[rarity] || 'text-gray-400 border-gray-400';
  };

  const getElementSymbol = element => {
    const symbols = {
      '🜁': { symbol: '🜁', name: 'Air', color: 'text-cyan-400' },
      '🜂': { symbol: '🜂', name: 'Fire', color: 'text-red-400' },
      '🜃': { symbol: '🜃', name: 'Light', color: 'text-yellow-400' },
      '🜄': { symbol: '🜄', name: 'Earth', color: 'text-green-400' },
      '🜅': { symbol: '🜅', name: 'Water', color: 'text-blue-400' },
      '🜆': { symbol: '🜆', name: 'Dark', color: 'text-purple-400' },
    };
    return (
      symbols[element] || {
        symbol: element,
        name: 'Unknown',
        color: 'text-gray-400',
      }
    );
  };

  const formatLegality = (format, legal) => {
    return (
      <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
        <span className="text-gray-300 font-medium">{format}</span>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            legal
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {legal ? 'Legal' : 'Not Legal'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">
            The card you're looking for doesn't exist.
          </p>
          <Link
            to="/cards"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse All Cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              to="/cards"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Cards
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">{card.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Card Image */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="sticky top-8"
            >
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center border-2 border-gray-600">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="text-6xl mb-2">🎴</div>
                    <p className="text-sm">Card Image</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                    Add to Collection
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                    Add to Deck
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                    View Prices
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Card Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Card Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {card.name}
                    </h1>
                    <div className="flex items-center gap-4 text-lg">
                      <span className="text-gray-300">{card.type}</span>
                      {card.class && (
                        <>
                          <span className="text-gray-500">—</span>
                          <span className="text-gray-300">{card.class}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {card.elements?.map((element, index) => {
                        const elementData = getElementSymbol(element);
                        return (
                          <span
                            key={index}
                            className={`text-2xl ${elementData.color}`}
                            title={elementData.name}
                          >
                            {elementData.symbol}
                          </span>
                        );
                      })}
                      <span className="text-2xl font-bold text-gray-300 ml-2">
                        {card.cost}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityColor(card.rarity)}`}
                    >
                      {card.rarity?.charAt(0).toUpperCase() +
                        card.rarity?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Text */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <div className="space-y-4">
                    {card.text && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Card Text
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {card.text}
                        </p>
                      </div>
                    )}

                    {card.flavor && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-gray-400 italic text-sm leading-relaxed">
                          "{card.flavor}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {card.power && (
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Combat Stats
                    </h3>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {card.power}
                        </div>
                        <div className="text-sm text-gray-400">Power</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                  {['details', 'legality', 'printings'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-blue-400 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Card Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Set</span>
                          <span className="text-white">{card.set}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rarity</span>
                          <span className="text-white">{card.rarity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cost</span>
                          <span className="text-white">{card.cost}</span>
                        </div>
                        {card.power && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power</span>
                            <span className="text-white">{card.power}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Game Mechanics
                      </h3>
                      <div className="space-y-3">
                        {card.keywords && card.keywords.length > 0 && (
                          <div>
                            <span className="text-gray-400 block mb-2">
                              Keywords
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {card.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {card.talents && card.talents.length > 0 && (
                          <div>
                            <span className="text-gray-400 block mb-2">
                              Talents
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {card.talents.map((talent, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm"
                                >
                                  {talent}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'legality' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Format Legality
                    </h3>
                    <div className="space-y-1">
                      {formatLegality('Standard', true)}
                      {formatLegality('Pioneer', true)}
                      {formatLegality('Modern', true)}
                      {formatLegality('Legacy', true)}
                      {formatLegality('Vintage', true)}
                      {formatLegality('Commander', true)}
                      {formatLegality('Brawl', true)}
                      {formatLegality('Historic', true)}
                      {formatLegality('Alchemy', false)}
                      {formatLegality('Pauper', card.rarity === 'common')}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'printings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Printings & Versions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="font-medium text-white">
                            {card.set}
                          </div>
                          <div className="text-sm text-gray-400">
                            #{card.id} • {card.rarity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            Illustrated by
                          </div>
                          <div className="text-white">{card.artist}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
