/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle } from 'lucide-react';
import DeckService from '../services/DeckService';

/**
 * Modal component for importing decks from deck codes
 */
const DeckImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [deckCode, setDeckCode] = useState('');
  const [deckName, setDeckName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    if (!deckCode.trim()) {
      setError('Please enter a deck code');
      return;
    }

    if (!deckName.trim()) {
      setError('Please enter a name for the deck');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      // Import deck from code
      const deck = DeckService.importDeckFromCode(deckCode);
      
      if (!deck) {
        throw new Error('Invalid deck code');
      }
      
      // Validate the deck
      const validation = DeckService.validateDeck(deck);
      
      if (!validation.isValid) {
        throw new Error(`Invalid deck: ${validation.errors.join(', ')}`);
      }
      
      // Save the deck
      const deckId = DeckService.saveDeck(deck, deckName);
      
      // Set as active player deck
      DeckService.setActivePlayerDeck(deckId);
      
      // Call success callback
      if (onImportSuccess) {
        onImportSuccess(deckId);
      }
      
      // Close modal
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to import deck');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Import Deck</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 bg-opacity-50 rounded flex items-center text-red-200">
                <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deck Name
                </label>
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a name for this deck"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deck Code
                </label>
                <textarea
                  value={deckCode}
                  onChange={(e) => setDeckCode(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Paste deck code here"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      Import Deck
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeckImportModal;