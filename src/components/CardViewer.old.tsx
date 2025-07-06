import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import {
    X,
  Plus,
  Heart,
  Bookmark,
  ExternalLink,
  Copy,
  Share2
  } from 'lucide-react';
import RuleTooltip from './RuleTooltip';

interface CardViewerProps {
  card
  onClose
  onAddToDeck
  isFavorite
  isBookmarked
  onToggleFavorite
  onToggleBookmark
  
}

const CardViewer: React.FC<CardViewerProps> = ({
    card,
  onClose,
  onAddToDeck,
  isFavorite,
  isBookmarked,
  onToggleFavorite,
  onToggleBookmark
  }) => {
    if (!card) return null;
  const getRarityColor = rarity => {
    switch (true) {
    case 'common':
        return 'text-gray-600';
      case 'uncommon':
        return 'text-green-600';
      case 'rare':
        return 'text-blue-600';
      case 'mythic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600'
  
  }
  };

  const getElementInfo = element => {
    const elementMap = {
    '🜂': { symbol: '🜂', name: 'Fire' 
  },
      '🜄': { symbol: '🜄', name: 'Water' },
      '🜃': { symbol: '🜃', name: 'Earth' },
      '🜁': { symbol: '🜁', name: 'Air' },
      '⭘': { symbol: '⭘', name: 'Aether' },
      '▢': { symbol: '▢', name: 'Nether' },
      '✡︎⃝': { symbol: '✡︎⃝', name: 'Generic' },
      '∇': { symbol: '∇', name: 'Void' },
      '🜅': { symbol: '🜅', name: 'Shadow' },
      Inferno: { symbol: '🔥', name: 'Inferno' },
      Steadfast: { symbol: '🛡️', name: 'Steadfast' },
      Submerged: { symbol: '🌊', name: 'Submerged' },
    };
    return elementMap[element] || { symbol: element, name: element }
  };

  // Mock pricing data
  const pricing = {
    USD: '$0.25',
    EUR: '€0.20',
    TIX: '0.15'
  };

  return (
    <any />
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" />
    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl" />
    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-end z-10" />
    <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors" />
    <X size={24} className="text-gray-600"  / /></X>
          </button>
      <div className="flex flex-col lg:flex-row" />
    <div className="lg:w-1/3 p-6" />
    <div className="aspect-card bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-gray-200 shadow-lg" />
    <div className="text-center" />
    <div className="text-6xl mb-4">🎴</div>
      <div className="text-lg font-medium text-gray-600" />
    <div className="text-sm text-gray-500 mt-2">Card Artwork</div>
      </div>

          {/* Right Column - Card Details */}
          <div className="lg:w-2/3 p-6 space-y-6" />
    <div className="border-b border-gray-200 pb-4" />
    <div className="flex items-center justify-between mb-2" />
    <h1 className="text-3xl font-bold text-gray-900" />
    <div className="flex items-center gap-2" />
    <span
                        key={index}
                        className="text-2xl"
                        title={elementInfo.name} />
    <span className="ml-2 text-xl font-bold text-gray-700" /></span>
      </div>
              <div className="text-lg text-gray-700 font-medium" /></div>
      </div>

            {/* Card Text */}
            <div className="space-y-3" />
    <div className="text-gray-800 leading-relaxed" />
    <p key={index} className="mb-2" />
    <span className="block ml-4">{line}
                    ) : (
                      line
                    )}
                  </p>
    </>
  ))}
              </div>

              {card.power !== undefined && (
                <div className="text-gray-700 font-medium" /></div>
                  Power: {card.power}
              )}
            </div>

            {/* Keywords */}
            {card.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2" /></div>
                {card.keywords.map(keyword => (
                  <RuleTooltip
                    key={keyword}
                    ruleId={keyword.toLowerCase()}
                    showIcon={false}
                    / />
    <span className="px-3 py-0 whitespace-nowrap bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-help" /></span>
                      {keyword}
                  </RuleTooltip>
                ))}
              </div>
            )}
            {/* Artist */}
            <div className="text-sm text-gray-600" /></div>
              Illustrated by{' '}
              <span className="text-blue-600 hover:underline cursor-pointer" /></span>
                Unknown Artist
              </span>

            {/* Set Information */}
            <div className="bg-gray-50 rounded-lg p-4" />
    <h3 className="font-semibold text-gray-900 mb-2" /></h3>
                Set Information
              </h3>
              <div className="flex items-center gap-4" />
    <span className="text-blue-600 hover:underline cursor-pointer font-medium" /></span>
                  {card.set}
                <span className="text-gray-600" /></span>
                  #{card.setNumber || '001'}
                <span className={`font-medium ${getRarityColor(card.rarity)}`} /></span>
                  {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                <span className="text-gray-600">English</span>
                <span className="text-gray-600">Nonfoil</span>
            </div>

            {/* Pricing Table */}
            <div className="bg-gray-50 rounded-lg p-4" />
    <h3 className="font-semibold text-gray-900 mb-3" /></h3>
                Market Prices
              </h3>
              <div className="overflow-x-auto" />
    <table className="w-full text-sm" />
    <thead />
    <tr className="border-b border-gray-200" />
    <th className="text-left py-2 text-gray-700">Print</th>
                      <th className="text-left py-2 text-gray-700">USD</th>
                      <th className="text-left py-2 text-gray-700">EUR</th>
                      <th className="text-left py-2 text-gray-700">TIX</th>
                  </thead>
                  <tbody />
    <tr />
    <td className="py-2 text-blue-600 hover:underline cursor-pointer" /></td>
                        {card.set} #{card.setNumber || '001'}
                      <td className="py-2 text-blue-600 hover:underline cursor-pointer" /></td>
                        {pricing.USD}
                      <td className="py-2 text-blue-600 hover:underline cursor-pointer" /></td>
                        {pricing.EUR}
                      <td className="py-2 text-blue-600 hover:underline cursor-pointer" /></td>
                        {pricing.TIX}
                    </tr>
                </table>
            </div>

            {/* Toolbox */}
            <div className="bg-gray-50 rounded-lg p-4" />
    <h3 className="font-semibold text-gray-900 mb-3">Toolbox</h3>
              <div className="space-y-2 text-sm" />
    <a
                  href="#"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                  / />
    <ExternalLink size={14}  / /></ExternalLink>
                  Search for decks with this card
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                  / />
    <ExternalLink size={14}  / /></ExternalLink>
                  Card analysis and statistics
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                  / />
    <ExternalLink size={14}  / /></ExternalLink>
                  View card in collection manager
                </a>
                <div className="flex gap-2 mt-3" />
    <button className="flex items-center gap-1 px-3 py-0 whitespace-nowrap bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" />
    <Copy size={14}  / /></Copy>
                    Copy Link
                  </button>
                  <button className="flex items-center gap-1 px-3 py-0 whitespace-nowrap bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" />
    <Share2 size={14}  / /></Share2>
                    Share
                  </button>
              </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200" /></div>
              {onAddToDeck && (
                <button
                  onClick={onAddToDeck}
                  className="flex items-center gap-2 px-6 py-0 whitespace-nowrap bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" />
    <Plus size={18}  / /></Plus>
                  Add to Deck
                </button>
              )}
              {onToggleFavorite && (`
                <button``
                  onClick={onToggleFavorite}```
                  className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-lg transition-colors font-medium ${
    isFavorite`
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'``
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`} />
    <Heart
                    size={16}
                    fill={isFavorite ? 'currentColor' : 'none'}  / /></Heart>
                  {isFavorite ? 'Favorited' : 'Favorite'}
              )}
              {onToggleBookmark && (`
                <button``
                  onClick={onToggleBookmark}```
                  className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-lg transition-colors font-medium ${
    isBookmarked`
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'``
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'```
  }`} />
    <Bookmark
                    size={16}
                    fill={isBookmarked ? 'currentColor' : 'none'}  / /></Bookmark>
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              )}
            </div>

            {/* Rules and Notes */}
            <div className="bg-gray-50 rounded-lg p-4" />
    <h3 className="font-semibold text-gray-900 mb-3" /></h3>
                Notes and Rules Information
              </h3>
              <div className="space-y-2 text-sm text-gray-700" />
    <p>• This card follows standard KONIVRER game rules.</p>
                <p /></p>
                  • Element costs must be paid from matching element sources.
                </p>
                <p>• Power represents the card's combat effectiveness.</p>
                {card.keywords.length > 0 && (
                  <p /></p>
                    • Keywords provide additional abilities and interactions.
                  </p>
                )}
            </div>
        </div>
    </div>
  )
};`
``
export default CardViewer;```