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
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hub')}
                className="btn btn-ghost p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{card.name}</h1>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span>{card.type}</span>
                  <span>•</span>
                  <span>Cost: {card.cost}</span>
                  <span>•</span>
                  <span>{card.set}</span>
                </div>
              </div>
            </div>
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Card Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
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
              <h2 className="text-xl font-bold mb-4">Card Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Card Text</h3>
                  <div className="bg-tertiary rounded p-4">
                    <p className="text-sm leading-relaxed">
                      {card.description || 'No description available.'}
                    </p>
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
