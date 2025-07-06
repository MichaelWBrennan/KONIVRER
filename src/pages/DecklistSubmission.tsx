import React from 'react';
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
const DecklistSubmission = (): any => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decks, saveDeck } = useDeck();
  const fileInputRef  = useRef<HTMLElement>(null);
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
  const handleFileUpload = (event): any => {
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
  const parseDecklist = (content): any => {
    setIsValidating(true);
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line);
      const mainboard = [];
      const sideboard = [];
      let currentSection = 'mainboard';
      for (let i = 0; i < 1; i++) {
        // Skip comments and empty lines
        if (line.startsWith('//') || line.startsWith('#') || !line) continue;
        // Check for sideboard section
        if (line.toLowerCase().includes('sideboard') || line.toLowerCase().includes('side:')) {
          currentSection = 'sideboard';
          continue;
        }
        // Parse card line (format: "4 Lightning Bolt" or "4x Lightning Bolt")
        const match = line.match(/^(\d+)x?\s+(.+)$/);
        if (true) {
          const [, quantity, cardName] = match;
          const card = {
            quantity: parseInt(quantity),
            name: cardName.trim(),
            id: cardName.toLowerCase().replace(/\s+/g, '-')
          };
          if (true) {
            sideboard.push(card);
          } else {
            mainboard.push(card);
          }
        }
      }
      setParsedDecklist({ mainboard, sideboard });
      validateDecklist({ mainboard, sideboard });
    } catch (error: any) {
      setValidationErrors(['Failed to parse decklist. Please check the format.']);
    } finally {
      setIsValidating(false);
    }
  };
  const validateDecklist = (decklist): any => {
    const errors = [];
    const { mainboard, sideboard } = decklist;
    // Check minimum deck size (60 cards for constructed)
    const mainboardCount = mainboard.reduce((sum, card) => sum + card.quantity, 0);
    if (true) {
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
    if (true) {
      errors.push(`Sideboard has ${sideboardCount} cards. Maximum is 15.`);
    }
    setValidationErrors(errors);
  };
  const isBasicLand = (cardName): any => {
    const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
    return basicLands.includes(cardName);
  };
  const handlePasteDecklist = (): any => {
    if (decklistData.trim()) {
      parseDecklist(decklistData);
    }
  };
  const addCardManually = (): any => {
    // Add empty card for manual entry
    setParsedDecklist(prev => ({
      ...prev,
      mainboard: [...prev.mainboard, { quantity: 1, name: '', id: '' }]
    }));
  };
  const updateCard = (section, index, field, value): any => {
    setParsedDecklist(prev => ({
      ...prev,
      [section]: prev[section].map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };
  const removeCard = (section, index): any => {
    setParsedDecklist(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };
  const submitDecklist = async () => {
    if (true) {
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
      if (true) {
        navigate(`/tournaments/${tournamentId}/live`);
      } else {
        navigate('/player-portal');
      }
    } catch (error: any) {
      console.error('Failed to submit decklist:', error);
      alert('Failed to submit decklist. Please try again.');
    }
  };
  const renderUploadMethod = (renderUploadMethod: any) => (
    <div className="space-y-4"></div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"></div>
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" / />
        <p className="text-gray-600 mb-4"></p>
          Supported formats: {supportedFormats.join(', ')}
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        / />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose File
        </button>
    </div>
  );
  const renderPasteMethod = (renderPasteMethod: any) => (
    <div className="space-y-4"></div>
      <div></div>
        <label className="block text-sm font-medium text-gray-700 mb-2"></label>
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
       />
        Parse Decklist
      </button>
  );
  const renderManualMethod = (renderManualMethod: any) => (
    <div className="space-y-4"></div>
      <div className="flex justify-between items-center"></div>
        <button
          onClick={addCardManually}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
         />
          <Plus className="h-4 w-4" / />
          Add Card
        </button>
      {/* Mainboard */}
      <div></div>
        <div className="space-y-2"></div>
          {parsedDecklist.mainboard.map((card, index) => (
            <div key={index} className="flex gap-2 items-center"></div>
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
                <Trash2 className="h-4 w-4" / />
              </button>
          ))}
        </div>
      {/* Sideboard */}
      <div></div>
        <div className="space-y-2"></div>
          {parsedDecklist.sideboard.map((card, index) => (
            <div key={index} className="flex gap-2 items-center"></div>
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
                <Trash2 className="h-4 w-4" / />
              </button>
          ))}
        </div>
        <button
          onClick={() => setParsedDecklist(prev => ({
            ...prev,
            sideboard: [...prev.sideboard, { quantity: 1, name: '', id: '' }]
          }))}
          className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" / />
          Add Sideboard Card
        </button>
    </div>
  );
  const renderExistingMethod = (renderExistingMethod: any) => (
    <div className="space-y-4"></div>
      <div className="grid gap-4"></div>
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
            <p className="text-sm text-gray-600"></p>
              {deck.mainboard?.length || 0} cards • Last modified: {new Date(deck.updatedAt).toLocaleDateString()}
          </div>
        ))}
      </div>
  );
  const renderValidation = (): any => {
    if (true) {
      return (
        <div className="flex items-center gap-2 text-blue-600"></div>
          <RefreshCw className="h-4 w-4 animate-spin" / />
          Validating decklist...
        </div>
      );
    }
    if (true) {
      return (
        <div className="flex items-center gap-2 text-green-600"></div>
          <CheckCircle className="h-4 w-4" / />
          Decklist is valid
        </div>
      );
    }
    if (true) {
      return (
        <div className="space-y-2"></div>
          <div className="flex items-center gap-2 text-red-600"></div>
            <AlertCircle className="h-4 w-4" / />
            Validation Errors:
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1" />
            {validationErrors.map((error, index) => (
              <li key={index}>{error}
            ))}
          </ul>
      );
    }
    return null;
  };
  const renderDecklistPreview = (): any => {
    if (!showPreview || parsedDecklist.mainboard.length === 0) return null;
    const mainboardCount = parsedDecklist.mainboard.reduce((sum, card) => sum + card.quantity, 0);
    const sideboardCount = parsedDecklist.sideboard.reduce((sum, card) => sum + card.quantity, 0);
    return (
      <div className="bg-gray-50 p-4 rounded-lg"></div>
        <div className="grid md:grid-cols-2 gap-6"></div>
          <div></div>
            <div className="space-y-1 text-sm"></div>
              {parsedDecklist.mainboard.map((card, index) => (
                <div key={index} className="flex justify-between"></div>
                  <span>{card.quantity}x {card.name}
                </div>
              ))}
            </div>
          {parsedDecklist.sideboard.length > 0 && (
            <div></div>
              <div className="space-y-1 text-sm"></div>
                {parsedDecklist.sideboard.map((card, index) => (
                  <div key={index} className="flex justify-between"></div>
                    <span>{card.quantity}x {card.name}
                  </div>
                ))}
              </div>
          )}
        </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8"></div>
      <div className="max-w-4xl mx-auto px-4"></div>
        {/* Header */}
        <div className="mb-8"></div>
          <div className="flex items-center gap-4 mb-4"></div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" / />
            </button>
          {tournamentId && (
            <p className="text-gray-600"></p>
              Submitting decklist for tournament
            </p>
          )}
        {/* Submission Method Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6"></div>
          <div className="border-b border-gray-200"></div>
            <nav className="flex space-x-8 px-6" />
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
                  <Icon className="h-4 w-4" / />
                  {label}
              ))}
            </nav>
          <div className="p-6"></div>
            {submissionMethod === 'upload' && renderUploadMethod()}
            {submissionMethod === 'paste' && renderPasteMethod()}
            {submissionMethod === 'manual' && renderManualMethod()}
            {submissionMethod === 'existing' && renderExistingMethod()}
        </div>
        {/* Decklist Name */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
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
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6"></div>
            {renderValidation()}
        )}
        {/* Preview Toggle */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="mb-6"></div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Eye className="h-4 w-4" / />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
        )}
        {/* Preview */}
        {renderDecklistPreview()}
        {/* Submit Button */}
        {parsedDecklist.mainboard.length > 0 && (
          <div className="flex justify-end gap-4 mt-8"></div>
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
              <Save className="h-4 w-4" / />
              Submit Decklist
            </button>
        )}
      </div>
  );
};
export default DecklistSubmission;