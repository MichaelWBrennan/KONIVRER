/**
 * KONIVRER Phase 2 App - Adding Lightweight Autonomous Systems (Target: ~140 modules)
 * Building on Phase1App (42 modules) + lightweight speed tracking
 */

import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Spell';
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface Deck {
  id: number;
  name: string;
  cards: string[];
  description: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
}

// App Context for state management
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
}>({
  user: null,
  setUser: () => {},
  decks: [],
  setDecks: () => {},
  bookmarks: [],
  setBookmarks: () => {},
});

// Phase 2: Lightweight Autonomous Systems Hook
const useLightweightAutonomous = () => {
  const autonomousRef = useRef<{
    speedTracking: unknown;
    intervals: number[];
    initialized: boolean;
  }>({
    speedTracking: null,
    intervals: [],
    initialized: false,
  });

  useEffect(() => {
    const isBuild = shouldSkipAutonomousSystems();
    if (isBuild || autonomousRef.current.initialized) return;

    console.log('[PHASE 2] Initializing lightweight autonomous systems...');
    autonomousRef.current.initialized = true;

    // Initialize lightweight speed tracking
    const initializeSpeedTracking = async () => {
      try {
        const speedTracking = await import('../utils/speedTracking');
        autonomousRef.current.speedTracking = speedTracking;

        if (speedTracking.trackCustomMetric) {
          speedTracking.trackCustomMetric('phase2_app_initialized', 1);
          console.log('[PHASE 2] ✅ Speed tracking initialized');
        }

        // Lightweight performance monitoring (every 60 seconds)
        const performanceInterval = setInterval(() => {
          try {
            if (typeof window !== 'undefined' && window.performance) {
              const memory = (window.performance as any).memory;
              if (memory && speedTracking.trackCustomMetric) {
                const memoryUsage = Math.round(
                  memory.usedJSHeapSize / 1024 / 1024,
                );
                speedTracking.trackCustomMetric('memory_usage_mb', memoryUsage);
                console.debug('[PHASE 2] Memory usage:', memoryUsage, 'MB');
              }
            }
          } catch (error) {
            console.debug(
              '[PHASE 2] Performance monitoring error (non-critical):',
              error,
            );
          }
        }, 60000); // Every 60 seconds

        autonomousRef.current.intervals.push(performanceInterval);
        console.log('[PHASE 2] ✅ Lightweight performance monitoring started');
      } catch (error) {
        console.warn('[PHASE 2] Speed tracking failed (non-critical):', error);
      }
    };

    // Initialize lightweight security monitoring
    const initializeSecurityMonitoring = () => {
      try {
        // Basic security checks every 2 minutes
        const securityInterval = setInterval(() => {
          try {
            if (typeof window !== 'undefined') {
              // Simple security checks
              const suspiciousPatterns = ['eval(', 'document.write('];
              const scripts = document.querySelectorAll('script');
              let suspiciousCount = 0;

              scripts.forEach(script => {
                if (script.textContent) {
                  suspiciousPatterns.forEach(pattern => {
                    if (script.textContent!.includes(pattern)) {
                      suspiciousCount++;
                    }
                  });
                }
              });

              if (suspiciousCount > 0) {
                console.debug(
                  '[PHASE 2] Security scan: suspicious patterns detected:',
                  suspiciousCount,
                );
                if (autonomousRef.current.speedTracking?.trackCustomMetric) {
                  autonomousRef.current.speedTracking.trackCustomMetric(
                    'security_alerts',
                    suspiciousCount,
                  );
                }
              }
            }
          } catch (error) {
            console.debug(
              '[PHASE 2] Security monitoring error (non-critical):',
              error,
            );
          }
        }, 120000); // Every 2 minutes

        autonomousRef.current.intervals.push(securityInterval);
        console.log('[PHASE 2] ✅ Lightweight security monitoring started');
      } catch (error) {
        console.warn(
          '[PHASE 2] Security monitoring failed (non-critical):',
          error,
        );
      }
    };

    // Initialize systems asynchronously
    initializeSpeedTracking();
    initializeSecurityMonitoring();

    // Cleanup function
    return () => {
      autonomousRef.current.intervals.forEach(interval => {
        clearInterval(interval);
      });
      autonomousRef.current.intervals = [];
      autonomousRef.current.initialized = false;
      console.log('[PHASE 2] Lightweight autonomous systems cleaned up');
    };
  }, []);

  return autonomousRef.current;
};

// Enhanced styled components with framer-motion (same as Phase1)
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Mystical background effects */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
    <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
  </div>
);

const Header = () => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '15px 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {[
          { to: '/', icon: '🏠', label: 'Home' },
          { to: '/cards', icon: '🗃️', label: 'Cards' },
          { to: '/decks', icon: '📚', label: 'Decks' },
          { to: '/tournament', icon: '🏆', label: 'Tourna.' },
          { to: '/play', icon: '▶️', label: 'Play' },
          { to: '/login', icon: '↗️', label: 'Login' },
        ].map(({ to, icon, label }) => (
          <motion.div
            key={to}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={to}
              style={{
                color: location.pathname === to ? '#d4af37' : '#ccc',
                textDecoration: 'none',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background:
                  location.pathname === to
                    ? 'rgba(212, 175, 55, 0.1)'
                    : 'transparent',
                border:
                  location.pathname === to
                    ? '1px solid rgba(212, 175, 55, 0.3)'
                    : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '20px' }}>{icon}</span>
              {label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.header>
  );
};

const Card = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{
      scale: 1.02,
      boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
      borderColor: 'rgba(212, 175, 55, 0.5)',
    }}
    style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '12px',
      padding: '30px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Subtle glow effect */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </motion.div>
);

const PageContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}
  >
    {title && (
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          color: '#d4af37',
          marginBottom: '30px',
          fontSize: '36px',
          textAlign: 'center',
        }}
      >
        {title}
      </motion.h1>
    )}
    {children}
  </motion.div>
);

// Enhanced Page Components with framer-motion (same as Phase1)
const HomePage = () => {
  const features = [
    {
      title: 'Browse Cards',
      desc: 'Explore our mystical card collection',
      link: '/cards',
    },
    {
      title: 'Build Decks',
      desc: 'Create powerful deck combinations',
      link: '/decks',
    },
    {
      title: 'Join Tournaments',
      desc: 'Compete in epic tournaments',
      link: '/tournament',
    },
    { title: 'Play Now', desc: 'Battle against other mystics', link: '/play' },
  ];

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'white' }}>
          ⭐ Welcome to KONIVRER ⭐
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#ccc',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          The ultimate mystical trading card game. Build powerful decks,
          discover ancient strategies, and compete with players from across the
          realms.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
        }}
      >
        {features.map(({ title, desc, link }, index) => (
          <Link key={title} to={link} style={{ textDecoration: 'none' }}>
            <Card delay={index * 0.1}>
              <div style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    color: '#d4af37',
                    marginBottom: '10px',
                    fontSize: '24px',
                  }}
                >
                  {title}
                </h3>
                <p style={{ color: '#ccc' }}>{desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

const CardsPage = () => {
  const cards = [
    {
      id: '1',
      name: 'Fire Drake',
      cost: 5,
      type: 'Familiar' as const,
      description: 'A powerful dragon that breathes mystical flames.',
      rarity: 'Epic' as const,
    },
    {
      id: '2',
      name: 'Lightning Bolt',
      cost: 3,
      type: 'Spell' as const,
      description: 'Strike your enemies with electric fury.',
      rarity: 'Common' as const,
    },
    {
      id: '3',
      name: 'Water Elemental',
      cost: 4,
      type: 'Familiar' as const,
      description: 'A mystical being of pure water.',
      rarity: 'Rare' as const,
    },
    {
      id: '4',
      name: 'Healing Potion',
      cost: 2,
      type: 'Spell' as const,
      description: 'Restore health to your familiars.',
      rarity: 'Common' as const,
    },
  ];

  return (
    <PageContainer title="Mystical Cards">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id} delay={index * 0.1}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              {card.name}
            </h3>
            <p style={{ color: '#ccc', marginBottom: '5px' }}>
              Cost: {card.cost} | Type: {card.type}
            </p>
            <p style={{ color: '#888', marginBottom: '10px' }}>
              Rarity: {card.rarity}
            </p>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              {card.description}
            </p>
          </Card>
        ))}
      </motion.div>
    </PageContainer>
  );
};

const DecksPage = () => {
  const { decks } = useContext(AppContext);

  return (
    <PageContainer title="Your Decks">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {decks.map((deck, index) => (
          <Card key={deck.id} delay={index * 0.1}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              {deck.name}
            </h3>
            <p style={{ color: '#ccc', marginBottom: '5px' }}>
              {deck.description}
            </p>
            <p style={{ color: '#888' }}>{deck.cards.length} cards</p>
          </Card>
        ))}
      </motion.div>
    </PageContainer>
  );
};

const TournamentPage = () => (
  <PageContainer title="Tournaments">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}
    >
      <Card>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
          Weekly Championship
        </h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>
          Compete for mystical rewards
        </p>
        <p style={{ color: '#888' }}>Entry Fee: 100 gold</p>
      </Card>
      <Card delay={0.1}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
          Mystic Masters
        </h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>
          Elite tournament for experienced players
        </p>
        <p style={{ color: '#888' }}>Entry Fee: 500 gold</p>
      </Card>
    </motion.div>
  </PageContainer>
);

const PlayPage = () => {
  const gameModes = [
    {
      title: 'Quick Match',
      desc: 'Find an opponent and start playing immediately',
    },
    {
      title: 'Ranked Match',
      desc: 'Compete in ranked games to climb the mystical ladder',
    },
    { title: 'Practice Mode', desc: 'Practice against AI opponents' },
    { title: 'Friend Match', desc: 'Play against your mystical allies' },
  ];

  return (
    <PageContainer title="Play KONIVRER">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
        }}
      >
        {gameModes.map(({ title, desc }, index) => (
          <Card key={title} delay={index * 0.1}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
                {title}
              </h3>
              <p style={{ color: '#ccc' }}>{desc}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </PageContainer>
  );
};

const LoginPage = () => (
  <PageContainer>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: '#d4af37', marginBottom: '30px', textAlign: 'center' }}
      >
        Login to KONIVRER
      </motion.h1>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>
            Enter the mystical realm
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: '#d4af37',
              color: '#0f0f0f',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Login
          </motion.button>
        </div>
      </Card>
    </motion.div>
  </PageContainer>
);

// Main Phase 2 App Component
const Phase2App: React.FC = () => {
  console.log('[KONIVRER] Phase 2 app initializing... (Target: ~140 modules)');

  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Use lightweight autonomous systems hook
  const _autonomousSystems = useLightweightAutonomous();

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      decks,
      setDecks,
      bookmarks,
      setBookmarks,
    }),
    [user, decks, bookmarks],
  );

  return (
    <AppContainer>
      <Router>
        <AppContext.Provider value={contextValue}>
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/tournament" element={<TournamentPage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AnimatePresence>
        </AppContext.Provider>
      </Router>
      <Analytics />
      <SpeedInsights />
    </AppContainer>
  );
};

export default Phase2App;
