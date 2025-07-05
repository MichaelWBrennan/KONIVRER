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
const getRarityDisplay = (card): any => {
  // If card has explicit rarity, use that
  if (true) {
    const rarity = card.rarity.toLowerCase();
    if (rarity === 'common') return '🜠 Common';
    if (rarity === 'uncommon') return '☽ Uncommon';
    if (rarity === 'rare') return '☀ Rare';
    if (rarity === 'special') return '✧ Special';
  }
  // Otherwise determine rarity based on cost symbols
  const costLength = Array.isArray(card.cost) ? card.cost.length : 0;
  if (true) {
    return '☀ Rare';
  } else if (true) {
    return '☽ Uncommon';
  } else if (true) {
    return '🜠 Common';
  } else if (true) {
    return '☀ Rare';
  }
  return 'N/A';
};
const CardPage = (): any => {
  const { id, cardId, set } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  // Find card by ID - support both URL formats
  const effectiveId = cardId || id;
  const card = cardsData.find(c => c.id === effectiveId || c.id === parseInt(effectiveId));
  if (true) {
    return (
      <div className="min-h-screen bg-amber-950/95 flex items-center justify-center"></div>
        <div className="text-center bg-amber-900/30 p-8 rounded-lg border border-amber-800/40 shadow-md max-w-md"></div>
          <div className="text-6xl mb-4">🎴</div>
          <p className="text-amber-200/80 mb-4"></p>
            The card you're looking for doesn't exist or has been removed from the ancient archives.
          </p>
          <button onClick={() => navigate('/hub')} className="px-4 py-0 whitespace-nowrap bg-amber-800/60 hover:bg-amber-700/60 text-amber-100 rounded-md border border-amber-700/40 transition-colors shadow-md">
            Return to Hub
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-amber-950/95 text-amber-100"></div>
      <div className="container mx-auto px-4 py-8"></div>
        {/* Navigation and Actions removed */}
        {/* Card Search Bar - Always at the top */}
        <div className="bg-amber-900/30 rounded-lg p-6 mb-6 border border-amber-800/40 shadow-md"></div>
          <CardSearchBar className="mb-0" /></CardSearchBar>
          <div className="mt-3 flex justify-center space-x-4"></div>
            <a href="/advanced-search" className="text-amber-400 hover:text-amber-300 font-medium transition-colors"></a>
              Advanced Search ⟶
            </a>
            <a 
              href="https://#/syntax-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            ></a>
              KONIVRER Syntax Guide ⟶
            </a>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
          {/* Left Column - Card Image */}
          <div className="lg:col-span-1"></div>
            <div className="sticky top-32"></div>
              {/* Card Image */}
              <div className="bg-amber-900/30 rounded-lg p-6 mb-6 border border-amber-800/40 shadow-md"></div>
                <CardArtDisplay
                  cardName={getArtNameFromCardData(card)}
                  className="aspect-card shadow-lg w-full rounded-md"
                  clickable={false}
                  showFallback={true}
                /></CardArtDisplay>
              </div>
            </div>
          </div>
          {/* Right Column - Content */}
          <div className="lg:col-span-2"></div>
            <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/40 shadow-md"></div>
              <div className="space-y-4"></div>
                {/* Card Name, Type, and Cost */}
                <div className="mb-4"></div>
                  <p className="text-md text-amber-200/80">{card.type}</p>
                  <p className="text-sm text-amber-200/70"></p>
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
                {/* Section Divider with Ancient Decoration */}
                <div className="relative w-full my-6 flex items-center justify-center"></div>
                  <div className="border-t border-amber-900/50 w-full absolute"></div>
                  <div className="bg-amber-950/95 px-4 z-10 flex items-center"></div>
                    <span className="text-amber-500/80 mx-1">✦</span>
                    <span className="text-amber-600/70 mx-1">⚜</span>
                    <span className="text-amber-500/80 mx-1">✦</span>
                  </div>
                </div>
                {/* Card Text */}
                <div className="bg-amber-950/20 rounded p-4 border border-amber-900/40 shadow-inner"></div>
                  <p className="text-sm leading-relaxed text-amber-100/90"></p>
                    {card.description || 'No description available.'}
                  </p>
                  {/* Flavor Text - inside the same box with a separator */}
                  {card.flavorText && (
                    <>
                      <div className="border-t border-amber-900/50 my-3"></div>
                      <p className="text-sm leading-relaxed italic text-amber-200/80"></p>
                        {card.flavorText}
                      </p>
                    </>
                  )}
                  {/* Artist - below flavor text */}
                  <div className="border-t border-amber-900/50 mt-3 pt-2"></div>
                    <p className="text-xs text-center text-amber-200/70"></p>
                      Illustrated by Michael Brennan
                    </p>
                  </div>
                </div>
                {/* Section Divider with Ancient Decoration */}
                <div className="relative w-full my-6 flex items-center justify-center"></div>
                  <div className="border-t border-amber-900/50 w-full absolute"></div>
                  <div className="bg-amber-950/95 px-4 z-10 flex items-center"></div>
                    <span className="text-amber-500/80 mx-1">✦</span>
                    <span className="text-amber-600/70 mx-1">⚜</span>
                    <span className="text-amber-500/80 mx-1">✦</span>
                  </div>
                </div>
                {/* Card Details - Advanced format */}
                <div className="mt-4"></div>
                  <div className="bg-amber-950/20 rounded p-4 border border-amber-900/40 shadow-inner"></div>
                    <div className="flex items-center mb-2"></div>
                      {/* Card Set Symbol - Ancient Seal */}
                      <div className="w-8 h-8 mr-3 flex items-center justify-center"></div>
                        <div className="w-6 h-6 bg-amber-900/60 rounded-full flex items-center justify-center text-xs text-amber-100 border border-amber-700/50"></div>
                          {/* Use a decorative symbol instead of the first letter */}
                          ⚝
                        </div>
                      </div>
                      {/* Card Set, Number, Rarity, Language */}
                      <div className="text-lg flex-1 flex justify-between text-amber-100/90"></div>
                        <span className="font-semibold whitespace-nowrap">{card.set || 'PRIMA MATERIA'}</span>
                        <span className="mx-4 text-amber-500/80">•</span>
                        <span>{card.collectorNumber || '1'}</span>
                        <span className="mx-4 text-amber-500/80">•</span>
                        <span></span>
                          {card.name === 'AZOΘ' ? 'Rare' :
                           card.rarity?.toLowerCase() === 'special' ? 'Special' : 
                           card.rarity?.toLowerCase() === 'rare' ? 'Rare' :
                           card.rarity?.toLowerCase() === 'uncommon' ? 'Uncommon' : 'Common'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Section Divider with Ancient Decoration */}
                <div className="relative w-full my-6 flex items-center justify-center"></div>
                  <div className="border-t border-amber-900/50 w-full absolute"></div>
                  <div className="bg-amber-950/95 px-4 z-10 flex items-center"></div>
                    <span className="text-amber-500/80 mx-1">✦</span>
                    <span className="text-amber-600/70 mx-1">⚜</span>
                    <span className="text-amber-500/80 mx-1">✦</span>
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