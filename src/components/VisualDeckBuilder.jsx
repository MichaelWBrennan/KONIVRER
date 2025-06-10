import { useState } from 'react';
import {
  Plus,
  Minus,
  Eye,
  BarChart3,
  Shuffle,
  Download,
  Upload,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualDeckBuilder = ({ deck, onDeckChange, cards }) => {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'list'
  const [showStats, setShowStats] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deckTest, setDeckTest] = useState({ hand: [], library: [] });

  const addCardToDeck = card => {
    const existingCard = deck.cards.find(c => c.id === card.id);
    const currentCount = existingCard ? existingCard.quantity : 0;

    if (currentCount < 4) {
      // Max 4 copies per card
      const newCards = existingCard
        ? deck.cards.map(c =>
            c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c,
          )
        : [...deck.cards, { ...card, quantity: 1 }];

      onDeckChange({ ...deck, cards: newCards });
    }
  };

  const removeCardFromDeck = cardId => {
    const newCards = deck.cards
      .map(c => (c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c))
      .filter(c => c.quantity > 0);

    onDeckChange({ ...deck, cards: newCards });
  };

  const getTotalCards = () => {
    return deck.cards.reduce((total, card) => total + card.quantity, 0);
  };

  const getManaCurve = () => {
    const curve = {};
    deck.cards.forEach(card => {
      const cost = card.cost;
      curve[cost] = (curve[cost] || 0) + card.quantity;
    });
    return curve;
  };

  const getCardTypeDistribution = () => {
    const distribution = {};
    deck.cards.forEach(card => {
      const type = card.type;
      distribution[type] = (distribution[type] || 0) + card.quantity;
    });
    return distribution;
  };

  const simulateHand = () => {
    const allCards = [];
    deck.cards.forEach(card => {
      for (let i = 0; i < card.quantity; i++) {
        allCards.push(card);
      }
    });

    // Shuffle deck
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const hand = shuffled.slice(0, 7);
    const library = shuffled.slice(7);

    setDeckTest({ hand, library });
  };

  const exportDeck = () => {
    const deckText = `${deck.name}\n\n${deck.cards
      .map(card => `${card.quantity}x ${card.name}`)
      .join('\n')}\n\nTotal: ${getTotalCards()} cards`;

    navigator.clipboard.writeText(deckText);
    alert('Deck copied to clipboard!');
  };

  const importDeck = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const content = e.target.result;
            let importedDeck;

            if (file.name.endsWith('.json')) {
              importedDeck = JSON.parse(content);
              if (importedDeck.cards) {
                onDeckChange({
                  ...deck,
                  name: importedDeck.name || deck.name,
                  description: importedDeck.description || deck.description,
                  cards: importedDeck.cards,
                });
                alert('Deck imported successfully!');
              }
            } else {
              // Parse text format
              const lines = content.split('\n').filter(line => line.trim());
              const importedCards = [];

              for (const line of lines) {
                const match = line.match(/^(\d+)x?\s+(.+)$/);
                if (match) {
                  const quantity = parseInt(match[1]);
                  const cardName = match[2].trim();
                  const foundCard = cards.find(
                    c => c.name.toLowerCase() === cardName.toLowerCase(),
                  );
                  if (foundCard) {
                    importedCards.push({ ...foundCard, quantity });
                  }
                }
              }

              if (importedCards.length > 0) {
                onDeckChange({
                  ...deck,
                  cards: importedCards,
                });
                alert(`Imported ${importedCards.length} cards successfully!`);
              } else {
                alert('No valid cards found in the import file.');
              }
            }
          } catch (error) {
            alert('Error importing deck: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const DeckStats = () => {
    const manaCurve = getManaCurve();
    const typeDistribution = getCardTypeDistribution();
    const totalCards = getTotalCards();
    const avgManaCost =
      deck.cards.reduce((sum, card) => sum + card.cost * card.quantity, 0) /
        totalCards || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-4 space-y-4"
      >
        <h3 className="text-lg font-bold text-white">Deck Statistics</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Mana Curve
            </h4>
            <div className="space-y-1">
              {Object.entries(manaCurve).map(([cost, count]) => (
                <div key={cost} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-4">{cost}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(manaCurve))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Card Types
            </h4>
            <div className="space-y-1">
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-gray-400">{type}</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{totalCards}</div>
            <div className="text-xs text-gray-400">Total Cards</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {avgManaCost.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">Avg. Cost</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {deck.cards.length}
            </div>
            <div className="text-xs text-gray-400">Unique Cards</div>
          </div>
        </div>
      </motion.div>
    );
  };

  const HandSimulator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Hand Simulator</h3>
        <button
          onClick={simulateHand}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Shuffle size={16} />
          <span>Draw Hand</span>
        </button>
      </div>

      {deckTest.hand.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Opening Hand (7 cards)
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {deckTest.hand.map((card, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded p-2 text-center cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedCard(card)}
              >
                <div className="text-xs font-medium text-white truncate">
                  {card.name}
                </div>
                <div className="text-xs text-gray-400">{card.cost}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Deck Header */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={deck.name}
              onChange={e => onDeckChange({ ...deck, name: e.target.value })}
              className="text-xl font-bold bg-transparent text-white border-none outline-none"
              placeholder="Deck Name"
            />
            <span className="text-gray-400">{getTotalCards()}/40 cards</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <BarChart3 size={16} />
              <span>Stats</span>
            </button>
            <button
              onClick={importDeck}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Upload size={16} />
              <span>Import</span>
            </button>
            <button
              onClick={exportDeck}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="btn btn-sm btn-primary">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        <textarea
          value={deck.description}
          onChange={e => onDeckChange({ ...deck, description: e.target.value })}
          placeholder="Describe your deck strategy..."
          className="w-full bg-gray-700 text-white rounded p-3 resize-none"
          rows={3}
        />
      </div>

      {/* Stats and Simulator */}
      <AnimatePresence>
        {showStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeckStats />
            <HandSimulator />
          </div>
        )}
      </AnimatePresence>

      {/* Deck List */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Deck List</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded ${viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Gallery
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              List
            </button>
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No cards in deck</p>
            <p className="text-sm">Add cards from the database</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'gallery'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-2'
            }
          >
            {deck.cards.map(card => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={
                  viewMode === 'gallery'
                    ? 'bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors'
                    : 'flex items-center justify-between bg-gray-700 rounded p-2 hover:bg-gray-600 transition-colors'
                }
              >
                <div
                  className={
                    viewMode === 'gallery'
                      ? 'space-y-2'
                      : 'flex items-center space-x-3'
                  }
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{card.name}</h4>
                    <span className="text-sm text-gray-400">
                      ×{card.quantity}
                    </span>
                  </div>

                  {viewMode === 'gallery' && (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Cost: {card.cost}</span>
                        <span>•</span>
                        <span>Power: {card.power}</span>
                      </div>
                      <p className="text-sm text-gray-300">{card.text}</p>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeCardFromDeck(card.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => addCardToDeck(card)}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    disabled={card.quantity >= 4}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualDeckBuilder;
