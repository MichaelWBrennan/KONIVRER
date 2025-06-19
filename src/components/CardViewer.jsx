import { X, Plus, Heart, Bookmark } from 'lucide-react';

const CardViewer = ({
  card,
  onClose,
  onAddToDeck,
  isFavorite,
  isBookmarked,
  onToggleFavorite,
  onToggleBookmark,
}) => {
  if (!card) return null;

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-600';
      case 'uncommon':
        return 'bg-green-600';
      case 'rare':
        return 'bg-blue-600';
      case 'mythic':
        return 'bg-purple-600';
      case 'legendary':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getElementInfo = element => {
    const elementMap = {
      '🜂': { symbol: '🜂', name: 'Fire' },
      '🜄': { symbol: '🜄', name: 'Water' },
      '🜃': { symbol: '🜃', name: 'Earth' },
      '🜁': { symbol: '🜁', name: 'Air' },
      '⭘': { symbol: '⭘', name: 'Aether' },
      '▢': { symbol: '▢', name: 'Nether' },
      '✡︎⃝': { symbol: '✡︎⃝', name: 'Generic' },
      '∇': { symbol: '∇', name: 'Void' },
      '🜅': { symbol: '🜅', name: 'Shadow' },
    };
    return elementMap[element] || { symbol: element, name: element };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-color rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-color">
          <h2 className="text-2xl font-bold">{card.name}</h2>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`btn ${isFavorite ? 'btn-primary' : 'btn-ghost'}`}
                title={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                className={`btn ${isBookmarked ? 'btn-primary' : 'btn-ghost'}`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark
                  size={16}
                  fill={isBookmarked ? 'currentColor' : 'none'}
                />
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card Image Placeholder */}
            <div className="aspect-[3/4] bg-tertiary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎴</div>
                <div className="text-sm text-secondary">Card Artwork</div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              {/* Cost and Power */}
              <div className="flex items-center gap-4">
                <div className="bg-tertiary rounded-lg p-3 text-center">
                  <div className="text-sm text-secondary">Cost</div>
                  <div className="text-xl font-bold">{card.cost}</div>
                </div>
                <div className="bg-tertiary rounded-lg p-3 text-center">
                  <div className="text-sm text-secondary">Power</div>
                  <div className="text-xl font-bold">{card.power}</div>
                </div>
              </div>

              {/* Elements */}
              <div>
                <h3 className="text-sm font-medium text-secondary mb-2">
                  Elements
                </h3>
                <div className="flex items-center gap-2">
                  {card.elements.map((element, index) => {
                    const elementInfo = getElementInfo(element);
                    return (
                      <div key={index} className="flex items-center gap-1">
                        <span className="text-2xl" title={elementInfo.name}>
                          {elementInfo.symbol}
                        </span>
                        <span className="text-xs text-secondary">
                          {elementInfo.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rarity */}
              <div>
                <h3 className="text-sm font-medium text-secondary mb-2">
                  Rarity
                </h3>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${getRarityColor(card.rarity)}`}
                >
                  {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                </span>
              </div>

              {/* Keywords */}
              {card.keywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-tertiary rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Text */}
              <div>
                <h3 className="text-sm font-medium text-secondary mb-2">
                  Card Text
                </h3>
                <div className="bg-tertiary rounded-lg p-3">
                  <p className="text-sm leading-relaxed">{card.text}</p>
                </div>
              </div>

              {/* Flavor Text */}
              {card.flavor && (
                <div>
                  <h3 className="text-sm font-medium text-secondary mb-2">
                    Flavor Text
                  </h3>
                  <div className="bg-tertiary rounded-lg p-3">
                    <p className="text-sm leading-relaxed italic text-secondary">
                      {card.flavor}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onAddToDeck}
                  className="btn btn-primary flex-1"
                >
                  <Plus size={16} />
                  Add to Deck
                </button>
                <button onClick={onClose} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-color">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-secondary">Card ID</div>
                <div className="font-mono">{card.id}</div>
              </div>
              <div>
                <div className="text-secondary">Type</div>
                <div>{card.type}</div>
              </div>
              <div>
                <div className="text-secondary">Set</div>
                <div>
                  {card.set} {card.setNumber && `(${card.setNumber})`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardViewer;
