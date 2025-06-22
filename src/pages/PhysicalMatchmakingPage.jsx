import React from 'react';
import EnhancedPhysicalMatchmaking from '../components/EnhancedPhysicalMatchmaking';
import '../styles/ancient-esoteric-theme.css';

const PhysicalMatchmakingPage = () => {
  return (
    <div className="ancient-theme">
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ancient Mystical Physical Matchmaking
        </h1>
        <p className="text-center mb-8 text-accent-primary">
          Track physical matches, organize tournaments, and generate QR codes with Bayesian matchmaking
        </p>
      </div>
      <EnhancedPhysicalMatchmaking />
    </div>
  );
};

export default PhysicalMatchmakingPage;