/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CardArtGallery,
  CardArtPreview,
} from '../components/cards/CardArtDisplay';
import { getAllCardArtsWithData } from '../utils/cardArtMapping';
import {
  Grid,
  List,
  Search,
  Filter,
  Eye,
  ExternalLink,
  Database,
} from 'lucide-react';

/**
 * CardArtShowcase - Demo page to showcase the KONIVRER card arts
 */
const CardArtShowcase = () => {
  const [viewMode, setViewMode] = useState('gallery');
  const [selectedCard, setSelectedCard] = useState('ABISS');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showOnlyLinked, setShowOnlyLinked] = useState(false);

  // Get all card arts with their database status
  const allCardArts = getAllCardArtsWithData();
  const allCards = allCardArts.map(art => art.artName);

  // Categorize cards
  const categories = {
    all: allCards,
    characters: [
      'ABISS',
      'ANGEL',
      'ASH',
      'AURORA',
      'AZOTH',
      'GNOME',
      'SALAMANDER',
      'SYLPH',
      'UNDINE',
      'SHADE',
    ],
    bright: allCards.filter(card => card.startsWith('BRIGHT')),
    dark: allCards.filter(card => card.startsWith('DARK')),
    chaos: allCards.filter(card => card.startsWith('CHAOS')),
    elemental: allCards.filter(
      card =>
        !card.startsWith('BRIGHT') &&
        !card.startsWith('DARK') &&
        !card.startsWith('CHAOS') &&
        ![
          'ABISS',
          'ANGEL',
          'ASH',
          'AURORA',
          'AZOTH',
          'GNOME',
          'SALAMANDER',
          'SYLPH',
          'UNDINE',
          'SHADE',
          'FLAG',
        ].includes(card),
    ),
    special: ['FLAG'],
  };

  // Filter cards based on search, category, and database status
  const filteredCards = categories[categoryFilter].filter(card => {
    const matchesSearch = card
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (showOnlyLinked) {
      const cardArt = allCardArts.find(art => art.artName === card);
      return cardArt && cardArt.hasData;
    }

    return true;
  });

  // Get statistics
  const linkedCards = allCardArts.filter(art => art.hasData).length;
  const artOnlyCards = allCardArts.length - linkedCards;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            KONIVRER Card Art Showcase
          </h1>
          <p className="text-gray-300 mb-4">
            Explore the complete collection of {allCards.length} card arts for
            the KONIVRER deck database.
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
              <Database className="w-4 h-4 inline mr-1" />
              {linkedCards} Linked to Database
            </div>
            <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
              <ExternalLink className="w-4 h-4 inline mr-1" />
              {artOnlyCards} Art Only
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Cards ({categories.all.length})</option>
                <option value="characters">
                  Characters ({categories.characters.length})
                </option>
                <option value="elemental">
                  Elemental ({categories.elemental.length})
                </option>
                <option value="bright">
                  Bright Variants ({categories.bright.length})
                </option>
                <option value="dark">
                  Dark Variants ({categories.dark.length})
                </option>
                <option value="chaos">
                  Chaos Variants ({categories.chaos.length})
                </option>
                <option value="special">
                  Special ({categories.special.length})
                </option>
              </select>
            </div>

            {/* Database Filter */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyLinked}
                  onChange={e => setShowOnlyLinked(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                <Database className="w-4 h-4" />
                <span className="text-sm">Linked only</span>
              </label>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('gallery')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'gallery'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredCards.length} of {allCards.length} cards
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'gallery' ? (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
              <CardArtGallery
                cards={filteredCards}
                columns={5}
                showCardInfo={true}
                clickable={true}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card List */}
              <div className="lg:col-span-1">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Select Card
                  </h3>
                  <div className="space-y-2">
                    {filteredCards.map(card => {
                      const cardArt = allCardArts.find(
                        art => art.artName === card,
                      );
                      return (
                        <button
                          key={card}
                          onClick={() => setSelectedCard(card)}
                          className={`w-full text-left px-3 py-2 rounded transition-colors ${
                            selectedCard === card
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {cardArt?.displayName || card.replace(/_/g, ' ')}
                            </span>
                            {cardArt?.hasData && (
                              <Database className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Preview */}
              <div className="lg:col-span-2">
                <CardArtPreview cardName={selectedCard} clickable={true} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mt-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Usage Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Clickable Card Art
              </h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                {`import CardArtDisplay from './CardArtDisplay';

<CardArtDisplay 
  cardName="ABISS" 
  className="w-48 h-64"
  clickable={true}
  showCardInfo={true}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Card Art Gallery
              </h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                {`import { CardArtGallery } from './CardArtDisplay';

<CardArtGallery 
  cards={['ABISS', 'ANGEL']}
  columns={4}
  clickable={true}
  showCardInfo={true}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Direct Image Path
              </h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                {`/assets/cards/ABISS.png
/assets/cards/CHAOSLAVA.png
/assets/cards/FLAG.png`}
              </pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2" />
              Card Linking Features
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Cards with database entries are automatically clickable</li>
              <li>• Hover over cards to see "View Details" overlay</li>
              <li>• Green database icon indicates linked cards</li>
              <li>
                • Yellow "Art Only" badge for cards without database entries
              </li>
              <li>
                • Use the "Linked only" filter to show only cards with database
                entries
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardArtShowcase;
