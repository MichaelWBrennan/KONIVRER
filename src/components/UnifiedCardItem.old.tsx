import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCardArtPathFromData } from '../utils/cardArtMapping';

interface UnifiedCardItemProps {
  card: any;
  variant?: 'grid' | 'list';
  favorites?: Set<string>;
  toggleFavorite?: (cardId: string) => void;
  onCardClick?: (card: any) => void;
}

const UnifiedCardItem: React.FC<UnifiedCardItemProps> = ({
  card,
  variant = 'grid',
  favorites = new Set(),
  toggleFavorite = () => {},
  onCardClick,
}) => {
  const navigate = useNavigate();

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'border-gray-400 bg-gray-50';
      case 'uncommon':
        return 'border-green-400 bg-green-50';
      case 'rare':
        return 'border-blue-400 bg-blue-50';
      case 'legendary':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const getElementSymbol = (element: string) => {
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

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      navigate(`/card/${card.id}`);
    }
  };

  if (variant === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {card.elements.map((element: string, index: number) => {
                const elementInfo = getElementSymbol(element);
                return (
                  <span key={index} className="text-lg" title={elementInfo.name}>
                    {elementInfo.symbol}
                  </span>
                );
              })}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{card.name}</h3>
              <p className="text-sm text-gray-600">{card.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0 whitespace-nowrap rounded-full">
              {card.set}
            </div>
            <span className="text-sm font-medium">
              {typeof card.cost === 'string' ? card.cost : card.cost}
            </span>
            <span
              className={`px-2 py-0 whitespace-nowrap rounded text-xs font-medium ${getRarityColor(card.rarity)}`}
            >
              {card.rarity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(card.id);
              }}
              className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart
                size={16}
                fill={favorites.has(card.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${getRarityColor(card.rarity)}`}
      onClick={handleCardClick}
    >
      {/* Card Image */}
      <div className="mb-3 flex justify-center">
        {(() => {
          const localImagePath = getCardArtPathFromData(card);
          
          return (
            <img
              src={localImagePath || '/assets/card-back-new.png'}
              alt={card.name}
              className="w-32 h-44 object-cover rounded-lg border border-gray-200"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                // Try PNG fallback if WebP fails
                if (localImagePath && localImagePath.endsWith('.webp')) {
                  const pngPath = localImagePath.replace('.webp', '.png');
                  target.onerror = () => {
                    target.onerror = null;
                    target.src = '/assets/card-back-new.png';
                  };
                  target.src = pngPath;
                } else {
                  target.onerror = null;
                  target.src = '/assets/card-back-new.png';
                }
              }}
            />
          );
        })()}
      </div>

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{card.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {card.elements.map((element: string, index: number) => {
              const elementInfo = getElementSymbol(element);
              return (
                <span key={index} className="text-xl" title={elementInfo.name}>
                  {elementInfo.symbol}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-medium text-gray-600">
            {typeof card.cost === 'string' ? card.cost : card.cost}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(card.id);
            }}
            className={`p-1 rounded ${favorites.has(card.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart
              size={16}
              fill={favorites.has(card.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Card Type */}
      <div className="mb-2">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0 whitespace-nowrap rounded">
          {card.type}
        </span>
      </div>

      {/* Keywords */}
      {card.keywords && card.keywords.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {card.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-0 whitespace-nowrap rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Card Text */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 line-clamp-3">{card.text}</p>
      </div>

      {/* Power/Stats */}
      {card.power !== undefined && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Power: {card.power}</span>
          <span className="text-gray-600 capitalize">{card.rarity}</span>
        </div>
      )}
      
      {/* Set Info */}
      <div className="absolute top-2 right-2">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0 whitespace-nowrap rounded-full shadow-lg">
          {card.set}
        </div>
        {card.setNumber && (
          <div className="text-xs text-gray-500 text-center mt-1">
            {card.setNumber}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UnifiedCardItem;