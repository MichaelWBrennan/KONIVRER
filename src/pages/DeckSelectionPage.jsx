/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import DeckSelector from '../components/DeckSelector';
import { useDeck } from '../contexts/DeckContext';

/**
 * Page for selecting a deck to use in the game
 */
const DeckSelectionPage = () => {
  const navigate = useNavigate();
  const { createNewDeck } = useDeck();
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  // Handle deck selection
  const handleDeckSelected = deck => {
    // Navigate to game page
    navigate('/game/online');
  };

  // Handle new deck creation
  const handleCreateNewDeck = async () => {
    setIsCreatingDeck(true);
    try {
      const deckId = await createNewDeck('New Deck');
      navigate(`/deck-builder/${deckId}`);
    } catch (error) {
      console.error('Error creating new deck:', error);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">Select a Deck</h1>
      </div>

      <div className="mb-6">
        <button
          onClick={handleCreateNewDeck}
          disabled={isCreatingDeck}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="mr-2" />
          {isCreatingDeck ? 'Creating...' : 'Create New Deck'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DeckSelector onSelect={handleDeckSelected} />
      </motion.div>
    </div>
  );
};

export default DeckSelectionPage;
