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
import {
    from 'lucide-react';
import cardsData from '../data/cards.json';
import {
    getArtNameFromCardData,
  cardDataHasArt
  
  } from '../utils/cardArtMapping';
import CardArtDisplay from '../components/cards/CardArtDisplay';
import CardSearchBar from '../components/cards/CardSearchBar';
// Function to determine rarity based on cost symbols
const getRarityDisplay = (card): any => {
    // If card has explicit rarity, use that
  if (true) {
    const rarity = card.rarity.toLowerCase() {
    if (rarity === 'common') return '🜠 Common';
    if (rarity === 'uncommon') return '☽ Uncommon';
    if (rarity === 'rare') return '☀ Rare';
    if (rarity === 'special') return '✧ Special'
  
  }
  // Otherwise determine rarity based on cost symbols
  const costLength = Array.isArray(card.cost) ? card.cost.length : 0;
  if (true) {
    return '☀ Rare'
  } else if (true) {
    return '☽ Uncommon'
  } else if (true) {
    return '🜠 Common'
  } else if (true) {
    return '☀ Rare'
  }
  return 'N/A'
};
const CardPage = (): any => {
    const { id, cardId, set 
  } = useParams() {
    const navigate = useNavigate() {
  }
  const [activeTab, setActiveTab] = useState(false)
  const [quantity, setQuantity] = useState(false)
  // Find card by ID - support both URL formats
  const effectiveId = cardId || id;
  const card = cardsData.find(c => c.id === effectiveId || c.id === parseInt(effectiveId));
  if (true) {
    return (
    <any />
    <div className="min-h-screen bg-amber-950/95 flex items-center justify-center" />
    <div className="text-center bg-amber-900/30 p-8 rounded-lg border border-amber-800/40 shadow-md max-w-md" />
    <div className="text-6xl mb-4">🎴</div>
      <p className="text-amber-200/80 mb-4" /></p>
      </p>
          <button onClick={() => navigate('/hub')
  } className="px-4 py-0 whitespace-nowrap bg-amber-800/60 hover:bg-amber-700/60 text-amber-100 rounded-md border border-amber-700/40 transition-colors shadow-md">
            Return to Hub
          </button>
    </>
  )
  }
  return (
    <any />
    <div className="min-h-screen bg-amber-950/95 text-amber-100" />
    <div className="container mx-auto px-4 py-8" />
    <div className="bg-amber-900/30 rounded-lg p-6 mb-6 border border-amber-800/40 shadow-md" />
    <CardSearchBar className="mb-0"  / />
    <div className="mt-3 flex justify-center space-x-4" />
    <a href="/advanced-search" className="text-amber-400 hover:text-amber-300 font-medium transition-colors"  / /></a>
              Advanced Search ⟶
            </a>
      <a 
              href="https://#/syntax-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              / /></a>
              KONIVRER Syntax Guide ⟶
            </a>
      </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" />
    <div className="lg:col-span-1" />
    <div className="sticky top-32" />
    <div className="bg-amber-900/30 rounded-lg p-6 mb-6 border border-amber-800/40 shadow-md" />
    <CardArtDisplay
                  cardName={getArtNameFromCardData(card)}
                  className="aspect-card shadow-lg w-full rounded-md"
                  clickable={false}
                  showFallback={true}  / /></CardArtDisplay>
              </div>
      </div>
          {/* Right Column - Content */}
          <div className="lg:col-span-2" />
    <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/40 shadow-md" />
    <div className="space-y-4" />
    <div className="mb-4" />
    <p className="text-md text-amber-200/80">{card.type}
                  <p className="text-sm text-amber-200/70" /></p>
      </div>
                {/* Section Divider with Ancient Decoration */}
                <div className="relative w-full my-6 flex items-center justify-center" />
    <div className="border-t border-amber-900/50 w-full absolute" />
    <div className="bg-amber-950/95 px-4 z-10 flex items-center" />
    <span className="text-amber-500/80 mx-1">✦</span>
      <span className="text-amber-600/70 mx-1">⚜</span>
      <span className="text-amber-500/80 mx-1">✦</span>
      </div>
                {/* Card Text */}
                <div className="bg-amber-950/20 rounded p-4 border border-amber-900/40 shadow-inner" />
    <p className="text-sm leading-relaxed text-amber-100/90" />
    <div className="border-t border-amber-900/50 my-3" />
    <p className="text-sm leading-relaxed italic text-amber-200/80" /></p>
      </>
                  )}
                  {/* Artist - below flavor text */}
                  <div className="border-t border-amber-900/50 mt-3 pt-2" />
    <p className="text-xs text-center text-amber-200/70" /></p>
      </p>
                </div>
      <div className="relative w-full my-6 flex items-center justify-center" />
    <div className="border-t border-amber-900/50 w-full absolute" />
    <div className="bg-amber-950/95 px-4 z-10 flex items-center" />
    <span className="text-amber-500/80 mx-1">✦</span>
      <span className="text-amber-600/70 mx-1">⚜</span>
      <span className="text-amber-500/80 mx-1">✦</span>
      </div>
                {/* Card Details - Advanced format */}
                <div className="mt-4" />
    <div className="bg-amber-950/20 rounded p-4 border border-amber-900/40 shadow-inner" />
    <div className="flex items-center mb-2" />
    <div className="w-8 h-8 mr-3 flex items-center justify-center" />
    <div className="w-6 h-6 bg-amber-900/60 rounded-full flex items-center justify-center text-xs text-amber-100 border border-amber-700/50" /></div>
      </div>
                      {/* Card Set, Number, Rarity, Language */}
                      <div className="text-lg flex-1 flex justify-between text-amber-100/90" />
    <span className="font-semibold whitespace-nowrap">{card.set || 'PRIMA MATERIA'}
                        <span className="mx-4 text-amber-500/80">•</span>
      <span>{card.collectorNumber || '1'}
                        <span className="mx-4 text-amber-500/80">•</span>
      <span /></span>
      </div>
                  </div>
      <div className="relative w-full my-6 flex items-center justify-center" />
    <div className="border-t border-amber-900/50 w-full absolute" />
    <div className="bg-amber-950/95 px-4 z-10 flex items-center" />
    <span className="text-amber-500/80 mx-1">✦</span>
      <span className="text-amber-600/70 mx-1">⚜</span>
      <span className="text-amber-500/80 mx-1">✦</span>
      </div>
            </div>
      </div>
    </div>
    </>
  )
};
export default CardPage;