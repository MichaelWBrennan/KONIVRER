/**
 * KONIVRER Phase 2 App - Adding Lightweight Autonomous Systems (Target: ~140 modules)
 * Building on Phase1App (42 modules) + lightweight speed tracking
 */

import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';

// Phase 2: Add security and optimization systems
let SpeedMonitor: any = null;
let trackCustomMetric: any = null;
let useUltraAutonomousCore: any = null;
let SelfHealingErrorBoundary: any = null;
let SecurityProvider: any = null;
let SecurityAutomationProvider: any = null;
let withOptimization: any = null;

const isBuild = shouldSkipAutonomousSystems();

// Load Phase 2 systems (security + optimization)
if (!isBuild) {
  console.log('[PHASE 2] Loading security and optimization systems...');
  
  // Phase 1 systems
  import('../utils/speedTracking').then(m => {
    trackCustomMetric = m.trackCustomMetric;
    console.log('[PHASE 2] ✅ Speed tracking loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Speed tracking failed:', e));
  
  import('../components/SpeedMonitor').then(m => {
    SpeedMonitor = m.default;
    console.log('[PHASE 2] ✅ Speed monitor loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Speed monitor failed:', e));
  
  import('../automation/UltraAutonomousCore').then(m => {
    useUltraAutonomousCore = m.useUltraAutonomousCore;
    console.log('[PHASE 2] ✅ Ultra autonomous core loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Ultra autonomous core failed:', e));
  
  import('../core/SelfHealer').then(m => {
    SelfHealingErrorBoundary = m.SelfHealingErrorBoundary;
    console.log('[PHASE 2] ✅ Self healing error boundary loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Self healing error boundary failed:', e));
  
  // Phase 2: Security systems
  import('../security/SecurityProvider').then(m => {
    SecurityProvider = m.SecurityProvider;
    console.log('[PHASE 2] ✅ Security provider loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Security provider failed:', e));
  
  import('../security/SecurityAutomation').then(m => {
    SecurityAutomationProvider = m.SecurityAutomationProvider;
    console.log('[PHASE 2] ✅ Security automation loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Security automation failed:', e));
  
  // Phase 2: Optimization systems
  import('../core/SelfOptimizer').then(m => {
    withOptimization = m.withOptimization;
    console.log('[PHASE 2] ✅ Self optimizer loaded');
  }).catch(e => console.warn('[PHASE 2] ⚠️ Self optimizer failed:', e));
}

// Core UI Components (same as previous phases)
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }}>
    {children}
  </div>
);

const Header = () => (
  <header style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #333',
    padding: '15px 0'
  }}>
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    }}>
      <Link to="/" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏠 Home
      </Link>
      <Link to="/cards" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🗃️ Cards
      </Link>
      <Link to="/decks" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📚 Decks
      </Link>
      <Link to="/tournament" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏆 Tourna.
      </Link>
      <Link to="/play" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ▶️ Play
      </Link>
      <Link to="/login" style={{ 
        color: '#d4af37', 
        textDecoration: 'none', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ↗️ Login
      </Link>
    </nav>
  </header>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}>
    {children}
  </div>
);

// Page Components (NO DOTS as requested)
const HomePage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'white' }}>Welcome to KONIVRER</h1>
      <p style={{ fontSize: '20px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
        The ultimate mystical trading card game. Build powerful decks, discover ancient strategies, and compete with players from across the realms.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      <Link to="/cards" style={{ textDecoration: 'none' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>Browse Cards</h3>
            <p style={{ color: '#ccc' }}>Explore our mystical card collection</p>
          </div>
        </Card>
      </Link>
      <Link to="/decks" style={{ textDecoration: 'none' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>Build Decks</h3>
            <p style={{ color: '#ccc' }}>Create powerful deck combinations</p>
          </div>
        </Card>
      </Link>
      <Link to="/tournament" style={{ textDecoration: 'none' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>Join Tournaments</h3>
            <p style={{ color: '#ccc' }}>Compete in epic tournaments</p>
          </div>
        </Card>
      </Link>
      <Link to="/play" style={{ textDecoration: 'none' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>Play Now</h3>
            <p style={{ color: '#ccc' }}>Battle against other mystics</p>
          </div>
        </Card>
      </Link>
    </div>
  </div>
);

const CardsPage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>Mystical Cards</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Fire Drake</h3>
        <p style={{ color: '#ccc' }}>Cost: 5 | Type: Familiar</p>
        <p style={{ color: '#ccc' }}>A powerful dragon that breathes mystical flames.</p>
      </Card>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Lightning Bolt</h3>
        <p style={{ color: '#ccc' }}>Cost: 3 | Type: Spell</p>
        <p style={{ color: '#ccc' }}>Strike your enemies with electric fury.</p>
      </Card>
    </div>
  </div>
);

const DecksPage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>Your Decks</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Fire Aggro</h3>
        <p style={{ color: '#ccc' }}>Fast-paced fire deck</p>
        <p style={{ color: '#888' }}>30 cards</p>
      </Card>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Water Control</h3>
        <p style={{ color: '#ccc' }}>Defensive water strategy</p>
        <p style={{ color: '#888' }}>30 cards</p>
      </Card>
    </div>
  </div>
);

const TournamentPage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>Tournaments</h1>
    <Card>
      <h3 style={{ color: '#d4af37' }}>Weekly Championship</h3>
      <p style={{ color: '#ccc' }}>Compete for mystical rewards</p>
      <p style={{ color: '#888' }}>Entry Fee: 100 gold</p>
    </Card>
  </div>
);

const PlayPage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>Play KONIVRER</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Quick Match</h3>
        <p style={{ color: '#ccc' }}>Find an opponent and start playing immediately</p>
      </Card>
      <Card>
        <h3 style={{ color: '#d4af37' }}>Ranked Match</h3>
        <p style={{ color: '#ccc' }}>Compete in ranked games to climb the mystical ladder</p>
      </Card>
    </div>
  </div>
);

const LoginPage = () => (
  <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#d4af37', marginBottom: '30px', textAlign: 'center' }}>Login to KONIVRER</h1>
    <Card>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>Enter the mystical realm</p>
        <button style={{
          background: '#d4af37',
          color: '#0f0f0f',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </div>
    </Card>
  </div>
);

// Phase 2 Autonomous Systems Hook
const usePhase2Autonomous = () => {
  const [systemsLoaded, setSystemsLoaded] = useState(0);
  const [securityActive, setSecurityActive] = useState(false);
  const [optimizationActive, setOptimizationActive] = useState(false);
  
  useEffect(() => {
    if (!isBuild) {
      console.log('[PHASE 2] Initializing security and optimization systems...');
      
      const initSystems = () => {
        try {
          // Initialize Phase 1 systems
          if (useUltraAutonomousCore) {
            useUltraAutonomousCore();
            console.log('[PHASE 2] 🤖 Ultra autonomous core activated');
          }
          
          if (trackCustomMetric) {
            trackCustomMetric('phase2_app_initialized', 1);
            console.log('[PHASE 2] 📊 Metrics tracking active');
          }
          
          // Initialize Phase 2 systems
          if (SecurityProvider && SecurityAutomationProvider) {
            setSecurityActive(true);
            console.log('[PHASE 2] 🛡️ Security systems activated');
          }
          
          if (withOptimization) {
            setOptimizationActive(true);
            console.log('[PHASE 2] ⚡ Optimization systems activated');
          }
          
          setSystemsLoaded(prev => prev + 1);
        } catch (error) {
          console.warn('[PHASE 2] ⚠️ System initialization error:', error);
        }
      };
      
      // Check for loaded systems every 100ms
      const interval = setInterval(() => {
        if (useUltraAutonomousCore || SecurityProvider || withOptimization) {
          initSystems();
          clearInterval(interval);
        }
      }, 100);
      
      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  return { systemsLoaded, securityActive, optimizationActive };
};

// Main Phase 2 App
const Phase2App: React.FC = () => {
  console.log('[PHASE 2] Starting KONIVRER Phase 2 (Core + Security + Optimization)...');
  
  const { systemsLoaded, securityActive, optimizationActive } = usePhase2Autonomous();
  
  const AppContent = () => (
    <AppContainer>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      
      {/* Phase 2 Status Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#d4af37',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          Phase 2: {systemsLoaded} systems | 🛡️{securityActive ? '✅' : '💤'} | ⚡{optimizationActive ? '✅' : '💤'}
        </div>
      )}
      
      {/* Speed Monitor if loaded */}
      {SpeedMonitor && <SpeedMonitor />}
      
      <Analytics />
      <SpeedInsights />
    </AppContainer>
  );
  
  // Enhanced rendering with security and optimization
  const EnhancedApp = () => {
    if (SecurityProvider && SecurityAutomationProvider) {
      return (
        <SecurityProvider>
          <SecurityAutomationProvider>
            <AppContent />
          </SecurityAutomationProvider>
        </SecurityProvider>
      );
    }
    return <AppContent />;
  };
  
  // Use error boundary if available
  if (SelfHealingErrorBoundary) {
    const FinalApp = withOptimization ? withOptimization(EnhancedApp, { name: 'Phase2App', memoize: true }) : EnhancedApp;
    return (
      <SelfHealingErrorBoundary fallback={<AppContent />}>
        <FinalApp />
      </SelfHealingErrorBoundary>
    );
  }
  
  const FinalApp = withOptimization ? withOptimization(EnhancedApp, { name: 'Phase2App', memoize: true }) : EnhancedApp;
  return <FinalApp />;
};

export default Phase2App;