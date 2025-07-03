/**
 * MIT License
 *
 * Copyright (c) 2024 KONIVRER
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Star,
  Plus,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  Trophy,
  Target,
} from 'lucide-react';

import cardsData from '../data/cards.json';
import {
  getArtNameFromCardData,
  cardDataHasArt,
} from '../utils/cardArtMapping';
import CardArtDisplay from '../components/cards/CardArtDisplay';
import CardSearchBar from '../components/cards/CardSearchBar';

// Function to determine rarity based on cost symbols
const getRarityDisplay = (card) => {
  // If card has explicit rarity, use that
  if (card.rarity) {
    const rarity = card.rarity.toLowerCase();
    if (rarity === 'common') return '🜠 Common';
    if (rarity === 'uncommon') return '☾ Uncommon';
    if (rarity === 'rare') return '☉ Rare';
    if (rarity === 'special') return '✧ Special';
  }
  
  // Otherwise determine rarity based on cost symbols
  const costLength = Array.isArray(card.cost) ? card.cost.length : 0;
  
  if (costLength === 6) {
    return '☉ Rare';
  } else if (costLength === 4 || costLength === 5) {
    return '☾ Uncommon';
  } else if (costLength === 2 || costLength === 3) {
    return '🜠 Common';
  } else if (costLength === 1) {
    return '☉ Rare';
  }
  
  return 'N/A';
};

const CardPage = () => {
  const { id, cardId, set } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Find card by ID - support both URL formats
  const effectiveId = cardId || id;
  const card = cardsData.find(c => c.id === effectiveId || c.id === parseInt(effectiveId));

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎴</div>
          <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
          <p className="text-secondary mb-4">
            The card you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate('/hub')} className="btn btn-primary">
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation and Actions */}
        <div className="bg-card rounded-lg p-4 mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/hub')}
            className="btn btn-ghost p-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="ml-2">Back to Hub</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`btn ${isBookmarked ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="btn btn-ghost">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Search Bar - Always at the top */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <CardSearchBar className="mb-0" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Card Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {/* Card Image */}
              <div className="bg-card rounded-lg p-6 mb-6">
                <CardArtDisplay
                  cardName={getArtNameFromCardData(card)}
                  className="aspect-card shadow-lg w-full"
                  clickable={false}
                  showFallback={true}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6">
              <div className="space-y-4">
                {/* Card Name and Type */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{card.name}</h2>
                </div>
                
                {/* Card Text */}
                <div className="bg-tertiary rounded p-4">
                  <p className="text-sm leading-relaxed">
                    {card.description || 'No description available.'}
                  </p>
                  
                  {/* Flavor Text - inside the same box with a separator */}
                  {card.flavorText && (
                    <>
                      <div className="border-t border-gray-700 my-3"></div>
                      <p className="text-sm leading-relaxed italic text-secondary">
                        {card.flavorText}
                      </p>
                    </>
                  )}
                </div>
                
                {/* Card Details - Scryfall-like format */}
                <div className="mt-4">
                  <div className="bg-tertiary rounded p-4">
                    <div className="flex items-center mb-2">
                      {/* Card Set Symbol (placeholder) */}
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                          {card.set?.charAt(0) || '?'}
                        </div>
                      </div>
                      
                      {/* Card Set, Number, Rarity, Language */}
                      <div className="text-lg">
                        <span className="font-semibold">{card.set || 'KONIVRER'}</span>
                        <span className="mx-2">•</span>
                        <span>#{card.collectorNumber || '1'}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {card.rarity?.toLowerCase() === 'special' ? 'Special' : 
                           card.rarity?.toLowerCase() === 'rare' ? 'Rare' :
                           card.rarity?.toLowerCase() === 'uncommon' ? 'Uncommon' : 'Common'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card Type, Elements, Cost */}
                    <div className="border-t border-gray-700 py-2">
                      <p className="text-sm">
                        <span className="font-semibold">{card.type}</span>
                        {card.elements && card.elements.length > 0 && (
                          <span> — {Array.isArray(card.elements) ? card.elements.join(', ') : card.elements}</span>
                        )}
                      </p>
                    </div>
                    
                    {/* Artist */}
                    <div className="border-t border-gray-700 py-2">
                      <p className="text-sm">
                        <span className="text-secondary">Artist:</span> Michael Brennan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
