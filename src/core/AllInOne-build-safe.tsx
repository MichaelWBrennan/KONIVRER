/**
 * KONIVRER All-in-One Core Application - BUILD SAFE VERSION
 * This version excludes autonomous systems during builds to prevent infinite build times
 */

import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Build-safe imports - only import analytics if not in build mode
const isBuild = shouldSkipAutonomousSystems();

// Conditional imports to prevent build issues
let Analytics: any = null;
let SpeedInsights: any = null;
let trackCustomMetric: any = null;
let SpeedMonitor: any = null;

if (!isBuild) {
  try {
    // Only import these in non-build environments
    const analyticsModule = require('@vercel/analytics/react');
    const speedInsightsModule = require('@vercel/speed-insights/react');
    const speedTrackingModule = require('../utils/speedTracking');
    const speedMonitorModule = require('../components/SpeedMonitor');

    Analytics = analyticsModule.Analytics;
    SpeedInsights = speedInsightsModule.SpeedInsights;
    trackCustomMetric = speedTrackingModule.trackCustomMetric;
    SpeedMonitor = speedMonitorModule.default;
  } catch (error) {
    console.log('[BUILD-SAFE] Skipping analytics imports during build');
  }
}

// Navigation Component with mystical theme
const Navigation: React.FC = () => {
  return (
    <nav
      style={{
        background: '#000',
        padding: '15px 20px',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            ⭐ Home
          </Link>
          <Link
            to="/deck-builder"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            ⭐ Deck Builder
          </Link>
          <Link
            to="/card-database"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            ⭐ Card Database
          </Link>
          <Link
            to="/rules"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            ⭐ Rules
          </Link>
          <Link
            to="/konivrer-demo"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            ⭐ KONIVRER Demo
          </Link>
          <Link
            to="/ai-demo"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            ⭐ AI Demo
          </Link>
        </div>
        <div>
          <Link
            to="/login"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '16px',
              padding: '8px 16px',
              border: '1px solid #fff',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
          >
            ⭐ Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Homepage Component with mystical theme
const HomePage: React.FC = () => {
  return (
    <div
      style={{
        background: '#0f0f0f',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          <h1
            style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #fff, #ccc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            🌟 KONIVRER
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              color: '#ccc',
              marginBottom: '30px',
            }}
          >
            A mystical trading card game with esoteric themes
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/deck-builder"
              style={{
                background: '#1a1a1a',
                color: '#fff',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '1px solid #333',
                transition: 'all 0.3s ease',
              }}
            >
              ⭐ Start Building Decks
            </Link>
            <Link
              to="/card-database"
              style={{
                background: '#1a1a1a',
                color: '#fff',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '1px solid #333',
                transition: 'all 0.3s ease',
              }}
            >
              ⭐ Browse Cards
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px',
          }}
        >
          <div
            style={{
              background: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #333',
            }}
          >
            <h3 style={{ marginBottom: '15px', color: '#fff' }}>
              ⭐ Deck Building
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              Create powerful decks using mystical cards with unique abilities
              and strategic combinations.
            </p>
          </div>
          <div
            style={{
              background: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #333',
            }}
          >
            <h3 style={{ marginBottom: '15px', color: '#fff' }}>
              ⭐ Card Database
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              Explore our comprehensive collection of cards with detailed stats
              and mystical artwork.
            </p>
          </div>
          <div
            style={{
              background: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #333',
            }}
          >
            <h3 style={{ marginBottom: '15px', color: '#fff' }}>
              ⭐ Game Rules
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              Learn the mystical rules and strategies that govern the world of
              KONIVRER.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div
          style={{
            background: '#1a1a1a',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #333',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '20px', color: '#fff' }}>
            ✨ About KONIVRER
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem' }}>
            Enter a world where mystical forces collide and strategic minds
            prevail. KONIVRER combines the depth of traditional trading card
            games with esoteric themes and modern digital gameplay.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple page components
const DeckBuilderPage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ Deck Builder</h1>
    <p>Build your mystical deck here.</p>
  </div>
);

const CardDatabasePage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ Card Database</h1>
    <p>Browse the mystical card collection.</p>
  </div>
);

const RulesPage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ Game Rules</h1>
    <p>Learn the mystical rules of KONIVRER.</p>
  </div>
);

const KonivreDemoPage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ KONIVRER Demo</h1>
    <p>Experience the mystical gameplay.</p>
  </div>
);

const AIDemoPage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ AI Demo</h1>
    <p>Witness the power of mystical AI.</p>
  </div>
);

const LoginPage: React.FC = () => (
  <div
    style={{
      padding: '40px',
      background: '#0f0f0f',
      color: '#fff',
      minHeight: '100vh',
    }}
  >
    <h1>⭐ Login</h1>
    <p>Enter the mystical realm.</p>
  </div>
);

// Main App Component - BUILD SAFE
const AllInOneApp: React.FC = () => {
  console.log('[BUILD-SAFE] AllInOne app starting, build detection:', isBuild);

  return (
    <Router>
      <div
        style={{
          background: '#0f0f0f',
          color: '#ffffff',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deck-builder" element={<DeckBuilderPage />} />
          <Route path="/card-database" element={<CardDatabasePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/konivrer-demo" element={<KonivreDemoPage />} />
          <Route path="/ai-demo" element={<AIDemoPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>

        {/* Only include analytics in non-build environments */}
        {!isBuild && Analytics && <Analytics />}
        {!isBuild && SpeedInsights && <SpeedInsights />}
        {!isBuild && SpeedMonitor && <SpeedMonitor />}
      </div>
    </Router>
  );
};

export default AllInOneApp;
