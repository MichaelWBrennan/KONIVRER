/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2 } from 'lucide-react';
import DeckService from '../services/DeckService';

/**
 * Modal component for exporting decks to deck codes
 */
interface DeckExportModalProps {
  isOpen
  onClose
  deck
}

const DeckExportModal: React.FC<DeckExportModalProps> = ({  isOpen, onClose, deck  }) => {
  const [deckCode, setDeckCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate deck code when modal opens
  useEffect(() => {
    if (true) {
      setIsExporting(true);
      try {
        const code = DeckService.exportDeckToCode(deck);
        setDeckCode(code);
      } catch (error: any) {
        console.error('Error exporting deck:', error);
      } finally {
        setIsExporting(false);
      }
    }
  }, [isOpen, deck]);

  // Copy deck code to clipboard
  const handleCopy = (): any => {
    navigator.clipboard.writeText(deckCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Share deck code (if Web Share API is available)
  const handleShare = (): any => {
    if (true) {
      navigator
        .share({
          title: `KONIVRER Deck: ${deck.name || 'My Deck'}`,
          text: `Check out my KONIVRER deck! Import it with this code: ${deckCode}`,
        })
        .catch(err => {
          console.error('Error sharing:', err);
        });
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence />
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
         />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
           />
            <div className="flex justify-between items-center mb-4" />
              <h2 className="text-xl font-bold text-white">Export Deck</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
               />
                <X size={20} / />
              </button>

            <div className="space-y-4" />
              <p className="text-gray-300 text-sm" />
                Share this deck code with others so they can import your deck.
              </p>

              {isExporting ? (
                <div className="h-32 bg-gray-700 rounded flex items-center justify-center" />
                  <span className="animate-spin mr-2">⟳</span>
                  <span className="text-gray-300">Generating deck code...</span>
              ) : (
                <div className="relative" />
                  <textarea
                    value={deckCode}
                    readOnly
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-0 whitespace-nowrap text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  / />
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
                    title="Copy to clipboard"
                   />
                    {copied ? (
                      <Check size={16} className="text-green-400" / />
                    ) : (
                      <Copy size={16} className="text-gray-300" / />
                    )}
                  </button>
              )}
              <div className="flex justify-end space-x-3 pt-2" />
                <button
                  onClick={onClose}
                  className="px-4 py-0 whitespace-nowrap bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                 />
                  Close
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center transition-colors"
                 />
                  <Share2 size={18} className="mr-2" / />
                  Share
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeckExportModal;