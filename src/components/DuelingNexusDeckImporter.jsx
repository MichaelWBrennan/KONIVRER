import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  ExternalLink,
  Copy,
  Shuffle
} from 'lucide-react';
import { getCardById, getCardByName, sampleDecks } from '../data/yugiohCards';

// Dueling Nexus Deck Importer Component
const DuelingNexusDeckImporter = ({ onDeckImported, onClose }) => {
  const [importMethod, setImportMethod] = useState('url'); // url, file, text
  const [deckUrl, setDeckUrl] = useState('');
  const [deckText, setDeckText] = useState('');
  const [importStatus, setImportStatus] = useState('idle'); // idle, loading, success, error
  const [importedDeck, setImportedDeck] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample Dueling Nexus deck URLs for testing
  const sampleDeckUrls = [
    {
      name: "Blue-Eyes White Dragon Deck",
      url: "https://duelingnexus.com/editor/ef5992735661af87b7d7d3c07f610027",
      description: "Classic Blue-Eyes beatdown deck"
    },
    {
      name: "Elemental HERO Deck",
      url: "https://duelingnexus.com/editor/xyz789uvw456rst123opq890lmn567hij",
      description: "Fusion-based HERO deck"
    },
    {
      name: "Dark Magician Deck", 
      url: "https://duelingnexus.com/editor/abc123def456ghi789jkl012mno345pqr",
      description: "Spellcaster-focused Dark Magician deck"
    }
  ];

  // Parse Dueling Nexus deck format
  const parseDuelingNexusDeck = (deckData) => {
    try {
      // Dueling Nexus deck format structure
      const deck = {
        name: deckData.name || 'Imported Deck',
        author: deckData.author || 'Unknown',
        description: deckData.description || '',
        mainDeck: [],
        extraDeck: [],
        sideDeck: [],
        totalCards: 0,
        format: deckData.format || 'TCG',
        created: new Date().toISOString()
      };

      // Parse main deck
      if (deckData.mainDeck) {
        deck.mainDeck = deckData.mainDeck.map((card, index) => ({
          ...card,
          uniqueId: `main_${index}_${Date.now()}`,
          zone: 'main'
        }));
      }

      // Parse extra deck
      if (deckData.extraDeck) {
        deck.extraDeck = deckData.extraDeck.map((card, index) => ({
          ...card,
          uniqueId: `extra_${index}_${Date.now()}`,
          zone: 'extra'
        }));
      }

      // Parse side deck
      if (deckData.sideDeck) {
        deck.sideDeck = deckData.sideDeck.map((card, index) => ({
          ...card,
          uniqueId: `side_${index}_${Date.now()}`,
          zone: 'side'
        }));
      }

      deck.totalCards = deck.mainDeck.length + deck.extraDeck.length + deck.sideDeck.length;

      return deck;
    } catch (error) {
      throw new Error(`Failed to parse deck: ${error.message}`);
    }
  };

  // Import deck from URL
  const importFromUrl = async (url) => {
    setImportStatus('loading');
    setErrorMessage('');

    try {
      // Extract deck ID from URL
      const deckId = extractDeckId(url);
      if (!deckId) {
        throw new Error('Invalid Dueling Nexus deck URL');
      }

      // Simulate API call to Dueling Nexus
      // In a real implementation, you would make an actual API call
      const mockDeckData = await simulateDuelingNexusAPI(deckId);
      
      const parsedDeck = parseDuelingNexusDeck(mockDeckData);
      setImportedDeck(parsedDeck);
      setImportStatus('success');
      
    } catch (error) {
      setErrorMessage(error.message);
      setImportStatus('error');
    }
  };

  // Import deck from text
  const importFromText = (text) => {
    setImportStatus('loading');
    setErrorMessage('');

    try {
      // Parse different text formats
      const parsedDeck = parseTextFormat(text);
      setImportedDeck(parsedDeck);
      setImportStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setImportStatus('error');
    }
  };

  // Extract deck ID from Dueling Nexus URL
  const extractDeckId = (url) => {
    const patterns = [
      /duelingnexus\.com\/editor\/([a-f0-9]+)/i,
      /duelingnexus\.com\/deck\/([a-f0-9]+)/i,
      /duelingnexus\.com\/share\/([a-f0-9]+)/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // Simulate Dueling Nexus API response
  const simulateDuelingNexusAPI = async (deckId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock deck data based on deck ID
    const mockDecks = {
      'ef5992735661af87b7d7d3c07f610027': convertSampleDeckToAPI(sampleDecks.blueEyes),
      'xyz789uvw456rst123opq890lmn567hij': convertSampleDeckToAPI(sampleDecks.elementalHero)
    };

    const deckData = mockDecks[deckId];
    if (!deckData) {
      throw new Error('Deck not found or private');
    }

    return deckData;
  };

  // Convert sample deck format to API format
  const convertSampleDeckToAPI = (sampleDeck) => {
    const convertCardList = (cardList) => {
      const result = [];
      cardList.forEach(({ cardId, count }) => {
        const card = getCardById(cardId);
        if (card) {
          for (let i = 0; i < count; i++) {
            result.push({ ...card, count: 1 });
          }
        }
      });
      return result;
    };

    return {
      ...sampleDeck,
      mainDeck: convertCardList(sampleDeck.mainDeck),
      extraDeck: convertCardList(sampleDeck.extraDeck),
      sideDeck: convertCardList(sampleDeck.sideDeck)
    };
  };

  // Parse text format (YDK, deck list, etc.)
  const parseTextFormat = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
      throw new Error('Empty deck list');
    }

    // Check if it's YDK format
    if (lines[0] === '#created by...') {
      return parseYDKFormat(lines);
    }

    // Parse as simple deck list
    return parseSimpleDeckList(lines);
  };

  // Parse YDK format
  const parseYDKFormat = (lines) => {
    const deck = {
      name: 'YDK Imported Deck',
      author: 'Unknown',
      description: 'Imported from YDK file',
      mainDeck: [],
      extraDeck: [],
      sideDeck: [],
      format: 'TCG'
    };

    let currentSection = 'main';
    
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      if (line === '!side') {
        currentSection = 'side';
        continue;
      }
      if (line === '!extra') {
        currentSection = 'extra';
        continue;
      }

      const cardId = parseInt(line);
      if (!isNaN(cardId)) {
        const card = getCardById(cardId);
        if (card) {
          deck[currentSection + 'Deck'].push({
            ...card,
            uniqueId: `${currentSection}_${cardId}_${Date.now()}_${Math.random()}`
          });
        }
      }
    }

    return deck;
  };

  // Parse simple deck list
  const parseSimpleDeckList = (lines) => {
    const deck = {
      name: 'Text Imported Deck',
      author: 'Unknown', 
      description: 'Imported from text list',
      mainDeck: [],
      extraDeck: [],
      sideDeck: [],
      format: 'TCG'
    };

    for (const line of lines) {
      // Parse format: "3x Blue-Eyes White Dragon" or "Blue-Eyes White Dragon x3"
      const match = line.match(/(\d+)x?\s+(.+)|(.+)\s+x?(\d+)/i);
      if (match) {
        const count = parseInt(match[1] || match[4]);
        const cardName = (match[2] || match[3]).trim();
        
        const card = getCardByName(cardName);
        if (card) {
          for (let i = 0; i < count; i++) {
            deck.mainDeck.push({
              ...card,
              uniqueId: `main_${cardName}_${i}_${Date.now()}`
            });
          }
        }
      }
    }

    return deck;
  };

  // Note: getCardById and getCardByName are imported from yugiohCards.js

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      importFromText(content);
    };
    reader.readAsText(file);
  };

  // Copy deck URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Import Dueling Nexus Deck</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Import Method Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'url', label: 'Deck URL', icon: ExternalLink },
            { id: 'file', label: 'Upload File', icon: Upload },
            { id: 'text', label: 'Paste Text', icon: FileText }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setImportMethod(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                importMethod === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Import Content */}
        <div className="space-y-6">
          {/* URL Import */}
          {importMethod === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dueling Nexus Deck URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={deckUrl}
                    onChange={(e) => setDeckUrl(e.target.value)}
                    placeholder="https://duelingnexus.com/editor/..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => importFromUrl(deckUrl)}
                    disabled={!deckUrl || importStatus === 'loading'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    {importStatus === 'loading' ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>

              {/* Sample Decks */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Sample Decks</h4>
                <div className="space-y-2">
                  {sampleDeckUrls.map((deck, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-white">{deck.name}</div>
                        <div className="text-sm text-gray-400">{deck.description}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(deck.url)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeckUrl(deck.url);
                            importFromUrl(deck.url);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white transition-colors"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* File Import */}
          {importMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Deck File (.ydk, .txt)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300 mb-2">
                  Drop your deck file here or click to browse
                </div>
                <input
                  type="file"
                  accept=".ydk,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            </div>
          )}

          {/* Text Import */}
          {importMethod === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Deck List
              </label>
              <textarea
                value={deckText}
                onChange={(e) => setDeckText(e.target.value)}
                placeholder="Paste your deck list here...&#10;Format examples:&#10;3x Blue-Eyes White Dragon&#10;2x Mystical Space Typhoon&#10;1x Mirror Force"
                rows={10}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => importFromText(deckText)}
                disabled={!deckText || importStatus === 'loading'}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
              >
                {importStatus === 'loading' ? 'Parsing...' : 'Import'}
              </button>
            </div>
          )}

          {/* Import Status */}
          {importStatus === 'loading' && (
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span>Importing deck...</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {importStatus === 'success' && importedDeck && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-400">
                <Check className="w-4 h-4" />
                <span>Deck imported successfully!</span>
              </div>

              {/* Deck Preview */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">{importedDeck.name}</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Author: {importedDeck.author}</div>
                  <div>Format: {importedDeck.format}</div>
                  <div>Main Deck: {importedDeck.mainDeck.length} cards</div>
                  <div>Extra Deck: {importedDeck.extraDeck.length} cards</div>
                  <div>Side Deck: {importedDeck.sideDeck.length} cards</div>
                </div>
                {importedDeck.description && (
                  <div className="mt-2 text-sm text-gray-400">
                    {importedDeck.description}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onDeckImported(importedDeck);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Deck</span>
                </button>
                <button
                  onClick={() => {
                    setImportStatus('idle');
                    setImportedDeck(null);
                    setDeckUrl('');
                    setDeckText('');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Import Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DuelingNexusDeckImporter;