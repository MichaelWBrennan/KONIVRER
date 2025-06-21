import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Book } from 'lucide-react';

const DeckValidator = ({ deck }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rulesData, setRulesData] = useState(null);

  useEffect(() => {
    // Load rules data for validation
    import('../data/rules.json')
      .then(data => setRulesData(data.default || data))
      .catch(err => console.error('Failed to load rules:', err));
  }, []);

  // Deck rules
  const rules = {
    minCards: 40,
    maxCards: 60,
    maxCopies: 4,
    bannedCards: ['Ancient Dragon'], // Example banned card
    restrictedCards: { 'Lightning Bolt': 1 }, // Example restricted card
  };
  const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);

  // Validation checks
  const validations = [
    {
      type: 'error',
      check: totalCards >= rules.minCards,
      message: `Deck must have at least ${rules.minCards} cards (currently ${totalCards})`,
    },
    {
      type: 'error',
      check: totalCards <= rules.maxCards,
      message: `Deck cannot exceed ${rules.maxCards} cards (currently ${totalCards})`,
    },
    {
      type: 'error',
      check: deck.cards.every(card => card.quantity <= rules.maxCopies),
      message: `No card can have more than ${rules.maxCopies} copies`,
      details: deck.cards
        .filter(card => card.quantity > rules.maxCopies)
        .map(card => `${card.name}: ${card.quantity} copies`),
    },
    {
      type: 'error',
      check: !deck.cards.some(card => rules.bannedCards.includes(card.name)),
      message: 'Deck contains banned cards',
      details: deck.cards
        .filter(card => rules.bannedCards.includes(card.name))
        .map(card => card.name),
    },
    {
      type: 'warning',
      check: Object.entries(rules.restrictedCards).every(
        ([cardName, maxAllowed]) => {
          const cardInDeck = deck.cards.find(card => card.name === cardName);
          return !cardInDeck || cardInDeck.quantity <= maxAllowed;
        },
      ),
      message: 'Deck violates restricted card limits',
      details: Object.entries(rules.restrictedCards)
        .filter(([cardName, maxAllowed]) => {
          const cardInDeck = deck.cards.find(card => card.name === cardName);
          return cardInDeck && cardInDeck.quantity > maxAllowed;
        })
        .map(([cardName, maxAllowed]) => {
          const cardInDeck = deck.cards.find(card => card.name === cardName);
          return `${cardName}: ${cardInDeck.quantity}/${maxAllowed} allowed`;
        }),
    },
  ];

  const errors = validations.filter(v => v.type === 'error' && !v.check);
  const warnings = validations.filter(v => v.type === 'warning' && !v.check);
  const isValid = errors.length === 0;

  // Mana curve analysis
  const manaCurve = deck.cards.reduce((curve, card) => {
    const cost = card.cost || 0;
    const costBucket = cost >= 7 ? '7+' : cost.toString();
    curve[costBucket] = (curve[costBucket] || 0) + card.quantity;
    return curve;
  }, {});

  // Color distribution
  const colorDistribution = deck.cards.reduce((dist, card) => {
    if (card.elements) {
      card.elements.forEach(element => {
        dist[element] = (dist[element] || 0) + card.quantity;
      });
    }
    return dist;
  }, {});

  const getValidationIcon = (type, passed) => {
    if (passed) return <CheckCircle className="text-green-500" size={16} />;
    if (type === 'error') return <XCircle className="text-red-500" size={16} />;
    return <AlertTriangle className="text-yellow-500" size={16} />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          {isValid ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
          <span>Deck Validation</span>
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Total Cards</div>
          <div
            className={`text-lg font-bold ${
              totalCards >= rules.minCards && totalCards <= rules.maxCards
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {totalCards}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Errors</div>
          <div
            className={`text-lg font-bold ${errors.length === 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {errors.length}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-300">Warnings</div>
          <div
            className={`text-lg font-bold ${warnings.length === 0 ? 'text-green-400' : 'text-yellow-400'}`}
          >
            {warnings.length}
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="space-y-2">
          {errors.map((validation, index) => (
            <div
              key={`error-${index}`}
              className="flex items-start space-x-2 p-2 bg-red-900/20 rounded"
            >
              {getValidationIcon(validation.type, false)}
              <div className="flex-1">
                <div className="text-red-400 text-sm">{validation.message}</div>
                {validation.details && validation.details.length > 0 && (
                  <div className="text-red-300 text-xs mt-1">
                    {validation.details.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
          {warnings.map((validation, index) => (
            <div
              key={`warning-${index}`}
              className="flex items-start space-x-2 p-2 bg-yellow-900/20 rounded"
            >
              {getValidationIcon(validation.type, false)}
              <div className="flex-1">
                <div className="text-yellow-400 text-sm">
                  {validation.message}
                </div>
                {validation.details && validation.details.length > 0 && (
                  <div className="text-yellow-300 text-xs mt-1">
                    {validation.details.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Analysis */}
      {showDetails && (
        <div className="space-y-4 border-t border-gray-700 pt-4">
          {/* Mana Curve */}
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
              <Info size={16} />
              <span>Mana Curve</span>
            </h4>
            <div className="grid grid-cols-8 gap-2 text-xs">
              {['0', '1', '2', '3', '4', '5', '6', '7+'].map(cost => (
                <div key={cost} className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-gray-300">{cost}</div>
                  <div className="text-white font-bold">
                    {manaCurve[cost] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Distribution */}
          {Object.keys(colorDistribution).length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-2">
                Color Distribution
              </h4>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {Object.entries(colorDistribution).map(([element, count]) => (
                  <div
                    key={element}
                    className="bg-gray-700 rounded p-2 text-center"
                  >
                    <div className="text-gray-300">{element}</div>
                    <div className="text-white font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deck Rules Info */}
          <div className="bg-gray-700 rounded p-3">
            <h4 className="text-white font-medium mb-2">Deck Rules</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>
                Cards: {rules.minCards}-{rules.maxCards}
              </div>
              <div>Max copies per card: {rules.maxCopies}</div>
              {rules.bannedCards.length > 0 && (
                <div>Banned cards: {rules.bannedCards.join(', ')}</div>
              )}
              {Object.keys(rules.restrictedCards).length > 0 && (
                <div>
                  Restricted cards:{' '}
                  {Object.entries(rules.restrictedCards)
                    .map(([card, limit]) => `${card} (${limit})`)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckValidator;
