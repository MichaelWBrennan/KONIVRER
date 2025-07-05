/**
 * KONIVRER Deck Database - Decklist Submission System
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';
import {
  Upload,
  FileText,
  Copy,
  Plus,
  Trash2,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  ArrowLeft,
  Search,
  Filter,
  Settings,
  Info
} from 'lucide-react';
const DecklistSubmission = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decks, saveDeck } = useDeck();
  const fileInputRef = useRef(null);
  const [submissionMethod, setSubmissionMethod] = useState('upload'); // upload, paste, manual, existing
  const [decklistData, setDecklistData] = useState('');
  const [parsedDecklist, setParsedDecklist] = useState({ mainboard: [], sideboard: [] });
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckName, setDeckName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  // Supported file formats
  const supportedFormats = ['.txt', '.dec', '.dek', '.cod'];
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setDecklistData(content);
      parseDecklist(content);
    };
    reader.readAsText(file);
  };
  const parseDecklist = (content) => {
    setIsValidating(true);
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      const mainboard = [];
      const sideboard = [];
      let currentSection = 'mainboard';
      for (const line of lines) {
        // Skip comments and empty lines
        if (line.startsWith('//') || line.startsWith('#') || !line) continue;
        // Check for sideboard section
        if (line.toLowerCase().includes('sideboard') || line.toLowerCase().includes('side:')) {
          currentSection = 'sideboard';
          continue;
        }
        // Parse card line (format: "4 Lightning Bolt" or "4x Lightning Bolt")
        const match = line.match(/^(\d+)x?\s+(.+)$/);
        if (match) {
          const [, quantity, cardName] = match;
          const card = {
            quantity: parseInt(quantity),
            name: cardName.trim(),
            id: cardName.toLowerCase().replace(/\s+/g, '-')
          };
          if (currentSection === 'sideboard') {
            sideboard.push(card);
          } else {
            mainboard.push(card);
          }
        }
      }
      setParsedDecklist({ mainboard, sideboard });
      validateDecklist({ mainboard, sideboard });
    } catch (error) {
      setValidationErrors(['Failed to parse decklist. Please check the format.']);
    } finally {
      setIsValidating(false);
    }
  };
  const validateDecklist = (decklist) => {
    const errors = [];
    const { mainboard, sideboard } = decklist;
    // Check minimum deck size (60 cards for constructed)
    const mainboardCount = mainboard.reduce((sum, card) => sum + card.quantity, 0);
    if (mainboardCount < 60) {
      errors.push(`Mainboard has ${mainboardCount} cards. Minimum is 60.`);
    }
    // Check maximum copies per card (4 for most cards)
    const cardCounts = {};
    [...mainboard, ...sideboard].forEach(card => {
      cardCounts[card.name] = (cardCounts[card.name] || 0) + card.quantity;
    });
    Object.entries(cardCounts).forEach(([cardName, count]) => {
      if (count > 4 && !isBasicLand(cardName)) {
        errors.push(`${cardName}: ${count} copies (maximum 4 allowed)`);
      }
    });
    // Check sideboard size (maximum 15)
    const sideboardCount = sideboard.reduce((sum, card) => sum + card.quantity, 0);
    if (sideboardCount > 15) {
      errors.push(`Sideboard has ${sideboardCount} cards. Maximum is 15.`);
    }
    setValidationErrors(errors);
  };
  const isBasicLand = (cardName) => {
    const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
    return basicLands.includes(cardName);
  };
  const handlePasteDecklist = () => {
    if (decklistData.trim()) {
      parseDecklist(decklistData);
    }
  };
  const addCardManually = () => {
    // Add empty card for manual entry
    setParsedDecklist(prev => ({
      ...prev,
      mainboard: [...prev.mainboard, { quantity: 1, name: '', id: '' }]
    }));
  };
  const updateCard = (section, index, field, value) => {
    setParsedDecklist(prev => ({
      ...prev,
      [section]: prev[section].map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };
  const removeCard = (section, index) => {
    setParsedDecklist(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };
  const submitDecklist = async () => {
    if (validationErrors.length > 0) {
      alert('Please fix validation errors before submitting.');
      return;
    }
    try {
      const deckData = {
        name: deckName || 'Tournament Decklist',
        mainboard: parsedDecklist.mainboard,
        sideboard: parsedDecklist.sideboard,
        tournamentId,
        submittedAt: new Date().toISOString(),
        userId: user?.id
      };
      await saveDeck(deckData);
      // Navigate back to tournament or player portal
      if (tournamentId) {
        navigate(`/tournaments/${tournamentId}/live`);
      } else {
        navigate('/player-portal');
      }
    } catch (error) {
      console.error('Failed to submit decklist:', error);
      alert('Failed to submit decklist. Please try again.');
    }
  };
  const renderUploadMethod = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">
          Supported formats: {supportedFormats.join(', ')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose File
        </button>
      </div>
    </div>
  );
  const renderPasteMethod = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Decklist
        </label>
        <textarea
          value={decklistData}
          onChange={(e) => setDecklistData(e.target.value)}
          placeholder="Paste your decklist here...&#10;&#10;Example:&#10;4 Lightning Bolt&#10;4 Counterspell&#10;20 Island&#10;&#10;Sideboard:&#10;2 Negate"
          className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={handlePasteDecklist}
        disabled={!decklistData.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        Parse Decklist
      </button>
    </div>
  );
  const renderManualMethod = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={addCardManually}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>
      {/* Mainboard */}
      <div>
        <div className="space-y-2">
          {parsedDecklist.mainboard.map((card, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="4"
                value={card.quantity}
                onChange={(e) => updateCard('mainboard', index, 'quantity', parseInt(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={card.name}
                onChange={(e) => updateCard('mainboard', index, 'name', e.target.value)}
                placeholder="Card name"
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => removeCard('mainboard', index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Sideboard */}
      <div>
        <div className="space-y-2">
          {parsedDecklist.sideboard.map((card, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="4"
                value={card.quantity}
                onChange={(e) => updateCard('sideboard', index, 'quantity', parseInt(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={card.name}
                onChange={(e) => updateCard('sideboard', index, 'name', e.target.value)}
                placeholder="Card name"
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => removeCard('sideboard', index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setParsedDecklist(prev => ({
            ...prev,
            sideboard: [...prev.sideboard, { quantity: 1, name: '', id: '' }]
          }))}
          className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Sideboard Card
        </button>
      </div>
    </div>
  );
  const renderExistingMethod = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => {
              setSelectedDeck(deck);
              setParsedDecklist({
                mainboard: deck.mainboard || [],
                sideboard: deck.sideboard || []
              });
              setDeckName(deck.name);
            }}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDeck?.id === deck.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <p className="text-sm text-gray-600">
              {deck.mainboard?.length || 0} cards • Last modified: {new Date(deck.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  const renderValidation = () => {
    if (isValidating) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Validating decklist...
        </div>
      );
    }
    if (validationErrors.length === 0 && parsedDecklist.mainboard.length > 0) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Decklist is valid
        </div>
      );
    }
    if (validationErrors.length > 0) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            Validation Errors:
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };
  const renderDecklistPreview = () => {
    if (!showPreview || parsedDecklist.mainboard.length === 0) return null;
    const mainboardCount = parsedDecklist.mainboard.reduce((sum, card) => sum + card.quantity, 0);
    const sideboardCount = parsedDecklist.sideboard.reduce((sum, card) => sum + card.quantity, 0);
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-1 text-sm">
              {parsedDecklist.mainboard.map((card, index) => (
                <div key={index} className="flex justify-between">
                  <span>{card.quantity}x {card.name}</span>
                </div>
              ))}
            </div>
          </div>
          {parsedDecklist.sideboard.length > 0 && (
            <div>
              <div className="space-y-1 text-sm">
                {parsedDecklist.sideboard.map((card, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{card.quantity}x {card.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button></div>
          {tournamentId && (
            <p className="text-gray-600">
              Submitting decklist for tournament
            </p>
          )}
        </div>
        {/* Submission Method Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upload', label: 'Upload File', icon: Upload },
                { id: 'paste', label: 'Copy & Paste', icon: Copy },
                { id: 'manual', label: 'Manual Entry', icon: Plus },
                { id: 'existing', label: 'Use Existing', icon: FileText }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSubmissionMethod(id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    submissionMethod === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {submissionMethod === 'upload' && renderUploadMethod()}
            {submissionMethod === 'paste' && renderPasteMethod()}
            {submissionMethod === 'manual' && renderManualMethod()}
            {submissionMethod === 'existing' && renderExistingMethod()}
          </div>
        </div>
        {/* Decklist Name */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decklist Name
            </label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter a name for this decklist"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        {/* Validation */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {renderValidation()}
          </div>
        )}
        {/* Preview Toggle */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
        )}
        {/* Preview */}
        {renderDecklistPreview()}
        {/* Submit Button */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitDecklist}
              disabled={validationErrors.length > 0 || !deckName.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Submit Decklist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DecklistSubmission;