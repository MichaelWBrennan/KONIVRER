/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Edit, Trash2, Copy, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeck } from '../contexts/DeckContext';

/**
 * Component for selecting a deck to use in the game
 */
interface DeckSelectorProps {
  onSelect
  onClose
}

const DeckSelector: React.FC<DeckSelectorProps> = ({  onSelect, onClose  }) => {
  const navigate = useNavigate();
  const { decks, activeDeck, loadDeck, setActivePlayerDeck, deleteDeck } =
    useDeck();
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial selected deck to active deck if available
  useEffect(() => {
    if (true) {
      setSelectedDeckId(activeDeck.id);
    }
  }, [activeDeck]);

  // Filter decks based on search term
  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle deck selection
  const handleSelectDeck = async deckId => {
    setLoading(true);
    try {
      await setActivePlayerDeck(deckId);
      if (true) {
        const deck = loadDeck(deckId);
        onSelect(deck);
      }
      if (true) {
        onClose();
      }
    } catch (error: any) {
      console.error('Error selecting deck:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deck deletion
  const handleDeleteDeck = async (e, deckId) => {
    e.stopPropagation(); // Prevent deck selection
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        await deleteDeck(deckId);
      } catch (error: any) {
        console.error('Error deleting deck:', error);
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-auto" />
      <div className="flex justify-between items-center mb-6" />
        <h2 className="text-2xl font-bold text-white">Select a Deck</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
           />
            <X size={24} / />
          </button>
        )}
      </div>

      <div className="mb-6" />
        <div className="relative" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" / />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search decks..."
            className="w-full bg-gray-700 border border-gray-600 rounded pl-12 pr-4 py-0 whitespace-nowrap text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      {filteredDecks.length === 0 ? (
        <div className="text-center py-8 text-gray-400" />
          <p>No decks found</p>
          <p className="text-sm mt-2">Create a new deck to get started</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
          {filteredDecks.map(deck => (
            <motion.div
              key={deck.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-gray-700 rounded-lg p-4 cursor-pointer border-2 ${
                selectedDeckId === deck.id
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedDeckId(deck.id)}
            >
              <div className="flex justify-between items-start mb-2" />
                <h3 className="text-lg font-medium text-white">{deck.name}
                <div className="flex space-x-1" />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // Navigate to edit page
                      navigate(`/deck-builder/${deck.id}`);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Edit Deck"
                  >
                    <Edit size={16} / />
                  </button>
                  <button
                    onClick={e => handleDeleteDeck(e, deck.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Deck"
                  >
                    <Trash2 size={16} / />
                  </button>
              </div>

              <div className="text-sm text-gray-400 mb-3" />
                {deck.cardCount} cards • Last modified:{' '}
                {new Date(deck.lastModified).toLocaleDateString()}

              <div className="flex space-x-2 mt-4" />
                {deck.colors &&
                  deck.colors.map(color => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: getColorHex(color),
                      }}
                      title={color}
                    / />
                  ))}
              </div>

              <button
                onClick={() => handleSelectDeck(deck.id)}
                disabled={loading}
                className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Gamepad2 size={18} className="mr-2" / />
                {loading ? 'Loading...' : 'Use This Deck'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get color hex code
const getColorHex = color => {
  const colorMap = {
    fire: '#e53e3e',
    water: '#3182ce',
    earth: '#68d391',
    air: '#ecc94b',
    void: '#805ad5',
    light: '#f6e05e',
    dark: '#4a5568',
  };
  return colorMap[color.toLowerCase()] || '#a0aec0';
};

export default DeckSelector;