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
    if (rarity === 'uncommon') return '☽ Uncommon';
    if (rarity === 'rare') return '☀ Rare';
    if (rarity === 'special') return '✧ Special';
  }
  
  // Otherwise determine rarity based on cost symbols
  const costLength = Array.isArray(card.cost) ? card.cost.length : 0;
  
  if (costLength === 6) {
    return '☀ Rare';
  } else if (costLength === 4 || costLength === 5) {
    return '☽ Uncommon';
  } else if (costLength === 2 || costLength === 3) {
    return '🜠 Common';
  } else if (costLength === 1) {
    return '☀ Rare';
  }
  
  return 'N/A';
};

const CardPage = () => {
  const { id, cardId, set } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);

  // Find card by ID - support both URL formats
  const effectiveId = cardId || id;
  const card = cardsData.find(c => c.id === effectiveId || c.id === parseInt(effectiveId));

  if (!card) {
    return (
      <div className="h-screen bg-amber-950/95 flex items-center justify-center overflow-hidden">
        <div className="text-center bg-amber-900/30 p-6 rounded-lg border border-amber-800/40 shadow-md max-w-md">
          <div className="text-5xl mb-3">🎴</div>
          <h2 className="text-xl font-bold mb-2 text-amber-100">Card Not Found</h2>
          <p className="text-amber-200/80 mb-3">
            The card you're looking for doesn't exist or has been removed from the ancient archives.
          </p>
          <button onClick={() => navigate('/hub')} className="px-4 py-2 bg-amber-800/60 hover:bg-amber-700/60 text-amber-100 rounded-md border border-amber-700/40 transition-colors shadow-md">
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-amber-950/95 text-amber-100 flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col h-full">
        {/* Navigation and Actions removed */}

        {/* Card Search Bar - Always at the top */}
        <div className="bg-amber-900/30 rounded-lg p-4 mb-4 border border-amber-800/40 shadow-md">
          <CardSearchBar className="mb-0" />
        </div>

        {/* Main Content - Using flex to avoid scrolling */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden md:overflow-auto">
          {/* Left Column - Card Image */}
          <div className="lg:col-span-1 flex flex-col">
            {/* Card Image */}
            <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-800/40 shadow-md flex-1 flex items-center justify-center">
              <CardArtDisplay
                cardName={getArtNameFromCardData(card)}
                className="max-h-[calc(100vh-180px)] w-auto shadow-lg rounded-md mx-auto object-contain"
                clickable={false}
                showFallback={true}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-800/40 shadow-md flex-1 overflow-hidden">
              <div className="h-full flex flex-col space-y-2 overflow-hidden">
                {/* Card Name, Type, and Cost */}
                <div className="mb-2 flex-shrink-0">
                  <h2 className="text-xl font-bold whitespace-nowrap text-amber-100">{card.name}</h2>
                  <div className="flex justify-between">
                    <p className="text-sm text-amber-200/80">{card.type}</p>
                    <p className="text-sm text-amber-200/70">
                      {Array.isArray(card.cost) 
                        ? card.cost.map(element => 
                            element === 'Void' ? 'Nether' : 
                            element === 'Submerged' ? 'Water' : 
                            element === 'Brilliance' ? 'Æther' :
                            element === 'Inferno' ? 'Fire' :
                            element === 'Steadfast' ? 'Earth' :
                            element === 'Gust' ? 'Wind' :
                            element
                          ).join(', ') 
                        : card.cost === 'Void' ? 'Nether' :
                          card.cost === 'Submerged' ? 'Water' :
                          card.cost === 'Brilliance' ? 'Æther' :
                          card.cost === 'Inferno' ? 'Fire' :
                          card.cost === 'Steadfast' ? 'Earth' :
                          card.cost === 'Gust' ? 'Wind' :
                          card.cost
                      }
                    </p>
                  </div>
                </div>
                
                {/* Compact Section Divider */}
                <div className="relative w-full my-2 flex-shrink-0 flex items-center justify-center">
                  <div className="border-t border-amber-900/50 w-full absolute"></div>
                  <div className="bg-amber-950/95 px-2 z-10 flex items-center">
                    <span className="text-amber-500/80 mx-1 text-xs">✦</span>
                    <span className="text-amber-600/70 mx-1 text-xs">⚜</span>
                    <span className="text-amber-500/80 mx-1 text-xs">✦</span>
                  </div>
                </div>
                
                {/* Card Text - with flex-1 to take available space */}
                <div className="bg-amber-950/20 rounded p-3 border border-amber-900/40 shadow-inner flex-1 overflow-auto">
                  <p className="text-sm leading-relaxed text-amber-100/90">
                    {card.description || 'No description available.'}
                  </p>
                  
                  {/* Flavor Text - inside the same box with a separator */}
                  {card.flavorText && (
                    <>
                      <div className="border-t border-amber-900/50 my-2"></div>
                      <p className="text-sm leading-relaxed italic text-amber-200/80">
                        {card.flavorText}
                      </p>
                    </>
                  )}
                  
                  {/* Artist - below flavor text */}
                  <div className="border-t border-amber-900/50 mt-2 pt-1">
                    <p className="text-xs text-center text-amber-200/70">
                      Illustrated by Michael Brennan
                    </p>
                  </div>
                </div>
                
                {/* Compact Section Divider */}
                <div className="relative w-full my-2 flex-shrink-0 flex items-center justify-center">
                  <div className="border-t border-amber-900/50 w-full absolute"></div>
                  <div className="bg-amber-950/95 px-2 z-10 flex items-center">
                    <span className="text-amber-500/80 mx-1 text-xs">✦</span>
                    <span className="text-amber-600/70 mx-1 text-xs">⚜</span>
                    <span className="text-amber-500/80 mx-1 text-xs">✦</span>
                  </div>
                </div>
                
                {/* Card Details - Scryfall-like format */}
                <div className="flex-shrink-0">
                  <div className="bg-amber-950/20 rounded p-3 border border-amber-900/40 shadow-inner">
                    <div className="flex items-center">
                      {/* Card Set Symbol - Ancient Seal */}
                      <div className="w-6 h-6 mr-2 flex items-center justify-center">
                        <div className="w-5 h-5 bg-amber-900/60 rounded-full flex items-center justify-center text-xs text-amber-100 border border-amber-700/50">
                          {/* Use a decorative symbol instead of the first letter */}
                          ⚝
                        </div>
                      </div>
                      
                      {/* Card Set, Number, Rarity, Language */}
                      <div className="text-sm flex-1 flex justify-between text-amber-100/90">
                        <span className="font-semibold whitespace-nowrap">{card.set || 'PRIMA MATERIA'}</span>
                        <span className="mx-2 text-amber-500/80">•</span>
                        <span>{card.collectorNumber || '1'}</span>
                        <span className="mx-2 text-amber-500/80">•</span>
                        <span>
                          {card.name === 'AZOΘ' ? 'Rare' :
                           card.rarity?.toLowerCase() === 'special' ? 'Special' : 
                           card.rarity?.toLowerCase() === 'rare' ? 'Rare' :
                           card.rarity?.toLowerCase() === 'uncommon' ? 'Uncommon' : 'Common'}
                        </span>
                      </div>
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
