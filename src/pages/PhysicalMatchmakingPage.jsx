/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import EnhancedPhysicalMatchmaking from '../components/EnhancedPhysicalMatchmaking';
import PhysicalMatchmakingApp from '../components/PhysicalMatchmakingApp';
import { PhysicalMatchmakingProvider } from '../contexts/PhysicalMatchmakingContext';
import '../styles/ancient-esoteric-theme.css';
import '../styles/esoteric-theme.css';

const PhysicalMatchmakingPage = () => {
  return (
    <div className="ancient-theme">
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ancient Mystical Physical Matchmaking
        </h1>
        <p className="text-center mb-8 text-accent-primary">
          Track physical matches, organize tournaments, and generate QR codes
          with Bayesian matchmaking
        </p>
        <div className="text-center mb-6">
          <span className="bg-green-600 text-white px-4 py-2 rounded-full inline-block">
            All Premium Features Included For Free
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center text-accent-secondary">
            Advanced Physical Matchmaking
          </h2>
          <PhysicalMatchmakingProvider>
            <PhysicalMatchmakingApp />
          </PhysicalMatchmakingProvider>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center text-accent-secondary">
            Enhanced QR Code Generation
          </h2>
          <EnhancedPhysicalMatchmaking />
        </div>
      </div>
    </div>
  );
};

export default PhysicalMatchmakingPage;
