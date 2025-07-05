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
const PhysicalMatchmakingPage = (): any => {
  return (
    <div className="ancient-theme"></div>
      <div className="page-header"><p className="text-center mb-8 text-accent-primary"></p>
          Track physical matches, organize tournaments, and generate QR codes
          with Bayesian matchmaking
        </p>
        <div className="text-center mb-6"></div>
          <span className="bg-green-600 text-white px-4 py-0 whitespace-nowrap rounded-full inline-block"></span>
            All Premium Features Included For Free
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8"></div>
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"></div>
          <PhysicalMatchmakingProvider></PhysicalMatchmakingProvider>
            <PhysicalMatchmakingApp /></PhysicalMatchmakingApp>
          </PhysicalMatchmakingProvider>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"></div>
          <EnhancedPhysicalMatchmaking /></EnhancedPhysicalMatchmaking>
        </div>
      </div>
    </div>
  );
};
export default PhysicalMatchmakingPage;