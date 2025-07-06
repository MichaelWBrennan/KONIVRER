import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */


interface DeckStatsProps {
  deck
}

const DeckStats: React.FC<DeckStatsProps> = ({  deck  }) => {
  // Calculate mana curve
  const manaCurve = deck.cards.reduce((curve, card) => {
    const cost = Math.min(card.cost, 7); // Cap at 7+ for display
    const key = cost === 7 ? '7+' : cost.toString();
    curve[key] = (curve[key] || 0) + card.count;
    return curve;
  }, {});

  // Calculate element distribution
  const elementDistribution = deck.cards.reduce((dist, card) => {
    card.elements.forEach(element => {
      dist[element] = (dist[element] || 0) + card.count;
    });
    return dist;
  }, {});

  // Calculate rarity distribution
  const rarityDistribution = deck.cards.reduce((dist, card) => {
    dist[card.rarity] = (dist[card.rarity] || 0) + card.count;
    return dist;
  }, {});

  // Calculate average cost
  const totalCards = deck.cards.reduce((total, card) => total + card.count, 0);
  const totalCost = deck.cards.reduce(
    (total, card) => total + card.cost * card.count,
    0,
  );
  const averageCost = totalCards > 0 ? (totalCost / totalCards).toFixed(1) : 0;

  const getRarityColor = rarity => {
    switch (true) {
      case 'common':
        return 'bg-gray-600';
      case 'uncommon':
        return 'bg-green-600';
      case 'rare':
        return 'bg-blue-600';
      case 'legendary':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getElementEmoji = element => {
    // Return the element as is since they're already emojis
    return element;
  };

  return (
    <>
      <div className="card"></div>
      <div className="flex items-center gap-2 mb-4"></div>
      <BarChart3 size={20} />
        <h3 className="font-semibold">Deck Statistics</h3>
      <div className="space-y-6"></div>
      <div className="grid grid-cols-2 gap-4"></div>
      <div className="bg-tertiary rounded-lg p-3 text-center"></div>
      <div className="text-sm text-secondary">Total Cards</div>
      <div className="text-xl font-bold">{totalCards}
          </div>
      <div className="bg-tertiary rounded-lg p-3 text-center"></div>
      <div className="text-sm text-secondary">Avg. Cost</div>
      <div className="text-xl font-bold">{averageCost}
          </div>
      <div></div>
      <h4 className="text-sm font-medium text-secondary mb-3"></h4>
      </h4>
          <div className="space-y-2"></div>
      <div key={cost} className="flex items-center gap-3"></div>
      <div className="w-8 text-sm text-secondary">{cost}
                  <div className="flex-1 bg-tertiary rounded-full h-4 overflow-hidden"></div>
      <div
                      className="h-full bg-accent-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}></div>
      </div>
                  <div className="w-8 text-sm text-right">{count}
                </div>
    </>
  );
            })}
          </div>

        {/* Element Distribution */}
        <div></div>
          <h4 className="text-sm font-medium text-secondary mb-3"></h4>
            Element Distribution
          </h4>
          <div className="space-y-2"></div>
            {Object.entries(elementDistribution).map(([element, count]) => {
              const percentage =
                totalCards > 0 ? (count / totalCards) * 100 : 0;

              return (
    <>
      <div key={element} className="flex items-center gap-3"></div>
      <div className="w-8 text-lg">{getElementEmoji(element)}
                  <div className="flex-1 bg-tertiary rounded-full h-4 overflow-hidden"></div>
      <div
                      className="h-full bg-accent-secondary transition-all duration-300"
                      style={{ width: `${percentage}%` }}></div>
      </div>
                  <div className="w-8 text-sm text-right">{count}
                </div>
    </>
  );
            })}
          </div>

        {/* Rarity Distribution */}
        <div></div>
          <h4 className="text-sm font-medium text-secondary mb-3"></h4>
            Rarity Distribution
          </h4>
          <div className="space-y-2"></div>
            {Object.entries(rarityDistribution).map(([rarity, count]) => {
              const percentage =
                totalCards > 0 ? (count / totalCards) * 100 : 0;

              return (
    <>
      <div key={rarity} className="flex items-center gap-3"></div>
      <div className="w-16 text-sm"></div>
      <span
                      className={`px-2 py-0 whitespace-nowrap rounded text-xs font-medium ${getRarityColor(rarity)}`}></span>
      </div>
                  <div className="flex-1 bg-tertiary rounded-full h-4 overflow-hidden"></div>
      <div
                      className="h-full bg-accent-success transition-all duration-300"
                      style={{ width: `${percentage}%` }}></div>
      </div>
                  <div className="w-8 text-sm text-right">{count}
                </div>
    </>
  );
            })}
          </div>

        {/* Deck Validation */}
        <div></div>
          <h4 className="text-sm font-medium text-secondary mb-3"></h4>
            Deck Validation
          </h4>
          <div className="space-y-2"></div>
            <div
              className={`flex items-center justify-between p-2 rounded ${
                totalCards === 40
                  ? 'bg-green-900 text-green-100'
                  : totalCards < 40
                    ? 'bg-yellow-900 text-yellow-100'
                    : 'bg-red-900 text-red-100'
              }`}></div>
              <span className="text-sm">Card Count</span>
              <span className="text-sm font-medium"></span>
                {totalCards}/40{' '}
                {totalCards === 40 ? '✓' : totalCards < 40 ? '⚠' : '✗'}
            </div>

            {/* Check for card limits */}
            {deck.cards.some(card => card.count > 4) && (
              <div className="flex items-center justify-between p-2 rounded bg-red-900 text-red-100"></div>
                <span className="text-sm">Card Limits</span>
                <span className="text-sm font-medium">✗ Over limit</span>
            )}
            {!deck.cards.some(card => card.count > 4) && (
              <div className="flex items-center justify-between p-2 rounded bg-green-900 text-green-100"></div>
                <span className="text-sm">Card Limits</span>
                <span className="text-sm font-medium">✓ Valid</span>
            )}
        </div>

        {/* Suggestions */}
        {totalCards < 40 && (
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-3"></div>
            <div className="flex items-center gap-2 mb-2"></div>
              <TrendingUp size={16} className="text-yellow-400" />
              <span className="text-sm font-medium text-yellow-100"></span>
                Suggestion
              </span>
            <p className="text-sm text-yellow-200"></p>
              Add {40 - totalCards} more cards to reach the minimum deck size of
              40 cards.
            </p>
        )}
      </div>
  );
};

export default DeckStats;