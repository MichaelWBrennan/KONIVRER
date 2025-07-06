import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import {
    ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Star,
  Shield,
  Swords
  } from 'lucide-react';

interface DeckSelectorProps {
  selectedDeck
  decks = [
    ;
  onSelectDeck
  onCreateDeck
  onEditDeck
  
}

const DeckSelector: React.FC<DeckSelectorProps> = ({
    selectedDeck,
  decks = [
  ],
  onSelectDeck,
  onCreateDeck,
  onEditDeck
  }) => {
    const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = (toggleDropdown: any) => setIsOpen() {
    const handleSelectDeck = deck => {
    onSelectDeck() {
    setIsOpen(false)
  
  
  };

  const getDeckTypeIcon = type => {
    switch (type? .toLowerCase()) { : null
      case 'aggro':
        return <Swords className="w-4 h-4 text-red-500"  />;
      case 'control':
        return <Shield className="w-4 h-4 text-blue-500"  />;
      case 'midrange':
        return <Star className="w-4 h-4 text-green-500"  />;
      default:
        return <Star className="w-4 h-4 text-gray-500"  / /></Star>
  }
  };

  return (
    <div className="relative" /></div>
      {selectedDeck ? (
        <div
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer"
          onClick={toggleDropdown} />
    <div className="flex items-center space-x-3" />
    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm" /></div>
              {selectedDeck.name?.[0] || 'D'}
            <div />
    <div className="font-medium text-gray-900" /></div>
                {selectedDeck.name || 'My Deck'}
              <div className="text-sm text-gray-500" /></div>
                {selectedDeck.cards?.length || 60} cards •{' '}
                {selectedDeck.archetype || 'Custom'}
            </div>
          <div className="flex items-center space-x-2" />
    <button : null
              className="text-blue-600 hover:text-blue-700"
              onClick={e => {
    e.stopPropagation() {
    onEditDeck(selectedDeck)
  
  }}
            >
              <Edit className="w-4 h-4"  / /></Edit>
            </button>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500"  / /></ChevronUp> : null
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500"  / /></ChevronDown>
            )}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg" />
    <div className="text-gray-400 mb-2">No deck selected</div>
          <div className="flex justify-center space-x-2" />
    <motion.button
              onClick={onCreateDeck}
              className="bg-blue-600 text-white px-4 py-0 whitespace-nowrap rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              / />
    <Plus className="w-4 h-4"  / />
    <span>Create Deck</span>
            </motion.button>
            <motion.button
              onClick={toggleDropdown}
              className="bg-gray-100 text-gray-700 px-4 py-0 whitespace-nowrap rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              / />
    <span>Select Deck</span>
              <ChevronDown className="w-4 h-4"  / /></ChevronDown>
            </motion.button>
          </div>
      )}
      <AnimatePresence  / /></AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
            / /></motion>
            {decks.length === 0 ? (
              <div className="p-4 text-center text-gray-500" />
    <p>No decks available</p>
                <button
                  onClick={onCreateDeck} : null
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm" /></button>
                  Create your first deck
                </button>
            ) : (
              <div className="py-1" /></div>
                {decks.map(deck => (
                  <motion.div
                    key={deck.id}
                    onClick={() => handleSelectDeck(deck)}
                    className={`px-4 py-0 whitespace-nowrap hover:bg-gray-50 cursor-pointer ${selectedDeck?.id === deck.id ? 'bg-blue-50' : ''}`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center justify-between" />
    <div className="flex items-center space-x-2" />
    <div className="w-8 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xs" /></div>
                          {deck.name? .[0] || 'D'}
                        <div />
    <div className="font-medium text-gray-900" /></div>
                            {deck.name}
                          <div className="text-xs text-gray-500 flex items-center space-x-1" /></div>
                            {getDeckTypeIcon(deck.type)}
                            <span>{deck.archetype || 'Custom'}
                          </div>
                      </div>
                      <div className="text-xs text-gray-500" /></div>
                        {deck.cards?.length || 60} cards
                      </div>
                  </motion.div>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1" />
    <motion.button
                    onClick={onCreateDeck} : null
                    className="w-full text-left px-4 py-0 whitespace-nowrap text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                    whileHover={{ x: 2 }}
                    / />
    <Plus className="w-4 h-4"  / />
    <span>Create New Deck</span>
                  </motion.button>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
  )
};`
``
export default DeckSelector;```