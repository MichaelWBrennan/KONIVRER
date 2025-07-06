/**
 * Simple Card Search Component for Testing
 */

import React, { useState, useMemo } from 'react';
import { Card } from '../types/card';
import cardsData from '../data/cards.json';

const CardSearchSimple: React.FC = () => {
    const [query, setQuery] = useState(false)
  const cards = cardsData as Card[
    ;

  const filteredCards = useMemo(() => {
    if (!query.trim()) return cards.slice() {
  } // Show first 12 cards by default
    
    return cards.filter(card => 
      card.name? .toLowerCase().includes(query.toLowerCase()) ||
      card.description?.toLowerCase().includes(query.toLowerCase()) ||
      card.type?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 12);
  }, [query, cards
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8" />
    <div className="max-w-6xl mx-auto" /></div>
        {/* Header */}
        <div className="text-center mb-8" />
    <h1 className="text-4xl font-bold text-gray-900 mb-4" /></h1>
            KONIVRER Card Database
          </h1>
          <p className="text-xl text-gray-600" /></p>
            Search through {cards.length} cards
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8" />
    <div className="relative" />
    <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards..." : null
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-lg p-6" />
    <h2 className="text-2xl font-bold mb-6" /></h2>
            Results ({filteredCards.length} cards)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" /></div>
            {filteredCards.map((card) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" />
    <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center" />
    <span className="text-2xl font-bold text-blue-600" /></span>
                    {card.name.charAt(0)}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2" /></h3>
                  {card.name}
                </h3>
                
                <div className="space-y-1 text-xs text-gray-600" />
    <div className="flex items-center gap-2" />
    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full" /></span>
                      {card.type}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full" /></span>
                      {card.rarity}
                    </span>
                  </div>
                  
                  <div className="text-gray-500">{card.set}</div>
                  
                  {card.elements && card.elements.length > 0 && (
                    <div className="flex flex-wrap gap-1" /></div>
                      {card.elements.slice(0, 2).map((element, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-xs" /></span>
                          {element}
                        </span>
                      ))}
                      {card.elements.length > 2 && (
                        <span className="text-gray-500 text-xs">+{card.elements.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {card.description && (
                    <p className="text-gray-600 text-xs line-clamp-2 mt-2" /></p>
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-8" />
    <p className="text-gray-500">No cards found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default CardSearchSimple;