import React, {
  useState,
  useEffect,
  useContext,
  createContext,
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
import { SelfHealingProvider } from '../utils/selfHealingIntegration';
import { withAdvancedHealing } from '../utils/realTimeHealing';
import { AppContext, AppContextType, User, Deck } from '../contexts/AppContext';
import BlogSection from '../components/BlogSection';
import UnifiedCardSearch from '../components/UnifiedCardSearch';
import SimpleCardImagesPage from '../components/SimpleCardImagesPage';
import SimpleEnhancedLoginModal from '../components/SimpleEnhancedLoginModal';
import SkipToContent from '../components/SkipToContent';
import ColorBlindFilters from '../components/ColorBlindFilters';
import BottomMenuBar from '../components/BottomMenuBar';
import AppProvider from '../components/AppProvider';
import MainNavigation from '../components/MainNavigation';
import { healingConfigManager } from '../config/healingConfig';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';
import { KONIVRER_CARDS } from '../data/cards';
import ButtonTester from '../utils/buttonTester';
import SecurityTester from '../utils/securityTester';
import {
  AdvancedSecurityProvider,
  withAdvancedSecurity,
} from '../security/AdvancedSecuritySystem';
import OAuthCallback from '../components/OAuthCallback';
import { LazyGameContainer } from '../game/components/LazyGameContainer';
import { useDynamicSizing } from '../utils/userAgentSizing';
import MTGArenaGame from '../components/MTGArenaGame';
import Enhanced3DArenaGame from '../components/Enhanced3DArenaGame';
import AdvancedMTGArenaGame from '../components/AdvancedMTGArenaGame';
import HearthstoneBattlefield from '../components/HearthstoneBattlefield';
import BattlefieldDemo from '../components/BattlefieldDemo';
import '../styles/mtg-arena.css';
import '../styles/advanced-mtg-arena.css';
import '../styles/hearthstone-battlefield.css';

// Types
interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'Familiar' | 'Flag';
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[];
  keywords: string[];
  strength?: number;
  artist?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
}

// Blog data - will be loaded from API or CMS
const BLOG_POSTS: BlogPost[] = [];

// Phase 3: Advanced Autonomous Systems Hook
const useAdvancedAutonomous = () => {
  const autonomousRef = useRef<{
    speedTracking: any;
    speedMonitor: any;
    autonomousCore: any;
    securityProvider: any;
    intervals: number[];
    initialized: boolean;
  }>({
    speedTracking: null,
    speedMonitor: null,
    autonomousCore: null,
    securityProvider: null,
    intervals: [],
    initialized: false,
  });

  useEffect(() => {
    // Skip autonomous systems in development or when explicitly disabled
    if (shouldSkipAutonomousSystems()) {
      console.log(
        '[Autonomous] Skipping autonomous systems initialization in development mode',
      );
      return;
    }

    try {
      // Initialize autonomous systems
      if (!autonomousRef.current.initialized) {
        console.log('[Autonomous] Initializing advanced autonomous systems...');

        // Speed tracking system
        autonomousRef.current.speedTracking = {
          measurements: [],
          lastTimestamp: Date.now(),

          measure: (label: string) => {
            const now = Date.now();
            const elapsed =
              now - autonomousRef.current.speedTracking.lastTimestamp;
            autonomousRef.current.speedTracking.measurements.push({
              label,
              elapsed,
            });
            autonomousRef.current.speedTracking.lastTimestamp = now;
            return elapsed;
          },

          getAverages: () => {
            const measurements =
              autonomousRef.current.speedTracking.measurements;
            const labels = [...new Set(measurements.map((m: any) => m.label))];

            return labels.map(label => {
              const items = measurements.filter((m: any) => m.label === label);
              const total = items.reduce(
                (sum: number, item: any) => sum + item.elapsed,
                0,
              );
              return {
                label,
                average: total / items.length,
                count: items.length,
              };
            });
          },
        };

        // Speed monitor
        autonomousRef.current.speedMonitor = {
          thresholds: {
            critical: 500, // ms
            warning: 200, // ms
          },

          checkPerformance: () => {
            const averages = autonomousRef.current.speedTracking.getAverages();
            const issues = averages.filter(
              (avg: any) =>
                avg.average >
                autonomousRef.current.speedMonitor.thresholds.warning,
            );

            if (issues.length > 0) {
              console.warn('[Autonomous] Performance issues detected:', issues);

              // Auto-optimization for critical issues
              const criticalIssues = issues.filter(
                (issue: any) =>
                  issue.average >
                  autonomousRef.current.speedMonitor.thresholds.critical,
              );

              if (criticalIssues.length > 0) {
                console.warn(
                  '[Autonomous] Critical performance issues detected, applying auto-optimization',
                );
                // Apply optimization strategies
                autonomousRef.current.autonomousCore.optimize(criticalIssues);
              }
            }
          },
        };

        // Autonomous core
        autonomousRef.current.autonomousCore = {
          status: 'active',
          optimizationStrategies: {
            reduceAnimations: false,
            cacheHeavyComputations: true,
            throttleEvents: false,
          },

          optimize: (issues: any[]) => {
            console.log(
              '[Autonomous] Applying optimizations for:',
              issues.map((i: any) => i.label).join(', '),
            );

            // Apply progressive optimization strategies
            if (
              !autonomousRef.current.autonomousCore.optimizationStrategies
                .throttleEvents
            ) {
              console.log('[Autonomous] Enabling event throttling');
              autonomousRef.current.autonomousCore.optimizationStrategies.throttleEvents = true;
            } else if (
              !autonomousRef.current.autonomousCore.optimizationStrategies
                .reduceAnimations
            ) {
              console.log('[Autonomous] Reducing animations');
              autonomousRef.current.autonomousCore.optimizationStrategies.reduceAnimations = true;
              // Apply to DOM
              document.body.classList.add('autonomous-reduced-motion');
            }
          },

          getStatus: () => {
            return {
              status: autonomousRef.current.autonomousCore.status,
              optimizations:
                autonomousRef.current.autonomousCore.optimizationStrategies,
            };
          },
        };

        // Security provider
        autonomousRef.current.securityProvider = {
          initialized: true,
          securityLevel: 'standard',

          validateInput: (input: string) => {
            // Basic security validation
            const dangerousPatterns = [
              /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              /javascript:/gi,
              /on\w+=/gi,
            ];

            let sanitized = input;
            dangerousPatterns.forEach(pattern => {
              sanitized = sanitized.replace(pattern, '');
            });

            return sanitized;
          },
        };

        // Set up monitoring intervals
        const performanceInterval = setInterval(() => {
          autonomousRef.current.speedMonitor.checkPerformance();
        }, 30000); // Check every 30 seconds

        autonomousRef.current.intervals.push(performanceInterval);
        autonomousRef.current.initialized = true;

        console.log(
          '[Autonomous] Advanced autonomous systems initialized successfully',
        );
      }
    } catch (_error) {
      console.error(
        '[Autonomous] Failed to initialize autonomous systems:',
        error,
      );
    }

    // Cleanup function
    return () => {
      if (autonomousRef.current.initialized) {
        console.log('[Autonomous] Cleaning up autonomous systems');
        autonomousRef.current.intervals.forEach(interval =>
          clearInterval(interval),
        );
        autonomousRef.current.initialized = false;
      }
    };
  }, []);

  return autonomousRef.current;
};

// Login Modal Component
// Enhanced Login Modal Component
const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, setUser } = useContext(AppContext);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  return (
    <SimpleEnhancedLoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onLogin={handleLogin}
    />
  );
};

// Page Container Component
const PageContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <div
    style={{
      padding: '20px 20px calc(50px + env(safe-area-inset-bottom, 20px))',
      maxWidth: '1200px',
      margin: '0 auto',
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}
  >
    {title && (
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: '#d4af37',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '36px',
        }}
      >
        {title}
      </motion.h1>
    )}
    {children}
  </div>
);

// App Container Component
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, var(--bg-color, #0f0f0f) 0%, #1a1a1a 50%, var(--bg-color, #0f0f0f) 100%)',
      color: 'var(--text-color, white)',
      fontFamily: 'var(--font-family, Arial, sans-serif)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <SkipToContent />
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
    <div style={{ position: 'relative', zIndex: 2 }}>
      <main id="main-content">{children}</main>
    </div>
  </div>
);

// Navigation links interface
interface NavLink {
  to: string;
  label: string;
  onClick?: () => void;
  special?: boolean;
}

// Header component removed

const Footer = () => {
  const location = useLocation();
  const { user, setShowLoginModal } = useContext(AppContext);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Update viewport height when window resizes or on orientation change
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use a small timeout to ensure the browser has finished any UI adjustments
      setTimeout(() => {
        // Set a custom CSS variable for the real viewport height
        document.documentElement.style.setProperty(
          '--vh',
          `${window.innerHeight * 0.01}px`,
        );
        setViewportHeight(window.innerHeight);
      }, 100);
    };

    // Initial update
    updateViewportHeight();

    // Add event listeners
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // Create base navigation links
  const baseNavLinks: NavLink[] = [
    { to: '/cards', label: 'Cards' },
    { to: '/decks', label: 'Decks' },
    { to: '/events', label: 'Events' },
    { to: '/play', label: 'Play' },
    {
      to: '#',
      label: user ? 'Profile' : 'Login',
      onClick: () => setShowLoginModal(true),
    },
  ];

  // Add Home button if not on the home page
  const navLinks: NavLink[] =
    location.pathname !== '/'
      ? [{ to: '/', label: 'Home' }, ...baseNavLinks]
      : baseNavLinks;

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: 'env(safe-area-inset-bottom, 0px)', // Use safe area inset for iOS
        left: 0,
        right: 0,
        zIndex: 1001, // Higher z-index to ensure it's above everything
        background:
          'linear-gradient(to top, rgba(20, 20, 20, 0.98), rgba(15, 15, 15, 0.95))',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(212, 175, 55, 0.4)',
        padding: '10px 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.7)',
        height: '60px', // Fixed height for the footer
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'transform', // Optimize for animations
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          margin: '0 auto',
          padding: '0 10px',
          height: '100%',
        }}
      >
        {/* Navigation links in a single row with equal spacing */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {navLinks.map(({ to, label, onClick, special }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ flex: '1 1 0', minWidth: '0' }} // Equal width distribution
              >
                {onClick ? (
                  <button
                    onClick={onClick}
                    style={{
                      color: '#ccc',
                      textDecoration: 'none',
                      fontSize: 'clamp(11px, 2.5vw, 14px)', // Responsive font size
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 'clamp(4px, 1.5vw, 6px) clamp(6px, 2vw, 8px)', // Responsive padding
                      borderRadius: '6px',
                      background: 'transparent',
                      border: '1px solid transparent',
                      borderBottom: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      minWidth: '0',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    to={to}
                    style={{
                      color: location.pathname === to ? '#d4af37' : '#ccc',
                      textDecoration: 'none',
                      fontSize: 'clamp(11px, 2.5vw, 14px)', // Responsive font size
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 'clamp(4px, 1.5vw, 6px) clamp(6px, 2vw, 8px)', // Responsive padding
                      borderRadius: '6px',
                      background:
                        location.pathname === to
                          ? 'rgba(212, 175, 55, 0.1)'
                          : 'transparent',
                      border: '1px solid transparent',
                      borderBottom:
                        location.pathname === to
                          ? '2px solid #d4af37'
                          : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      minWidth: '0',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </nav>
    </motion.footer>
  );
};

const Card = ({
  children,
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  delay?: number;
  [_key: string]: any;
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
    {...props}
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

// Home Page Component
// Home Page Component - MTG Arena Game
const HomePage = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Enhanced3DArenaGame />
    </div>
  );
};

const CardsPage = () => {
  // Use the official KONIVRER card database (65 cards)
  const allCards: Card[] = KONIVRER_CARDS;

  // Start with empty search results - user must search to see cards
  const [searchResults, setSearchResults] = useState<Card[]>([]);

  const handleSearchResults = (results: {
    cards: Card[];
    totalCount: number;
    searchTime: number;
  }) => {
    setSearchResults(results.cards);
  };

  return (
    <PageContainer title="Mystical Card Database">
      <UnifiedCardSearch
        cards={allCards}
        onSearchResults={handleSearchResults}
        showAdvancedFilters={true}
        showSortOptions={true}
        showSearchHistory={true}
        initialMode="syntax"
      />
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
        data-search-type="deck"
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

        {/* Create New Deck Card */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
          }}
          onClick={() => {
            // Create new deck functionality
            const newDeck = {
              id: Date.now(),
              name: `New Deck ${Date.now()}`,
              cards: [],
              description: 'A new deck ready for customization',
            };
            console.log('Creating new deck:', newDeck);
            alert('Deck creation functionality would be implemented here!');
          }}
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '2px dashed rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            minHeight: '200px',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const newDeck = {
                id: Date.now(),
                name: `New Deck ${Date.now()}`,
                cards: [],
                description: 'A new deck ready for customization',
              };
              console.log('Creating new deck:', newDeck);
              alert('Deck creation functionality would be implemented here!');
            }
          }}
          aria-label="Create new deck"
          data-action="create-deck"
          data-testid="create-deck-button"
        >
          <div
            style={{ fontSize: '40px', color: '#d4af37', marginBottom: '10px' }}
          >
            +
          </div>
          <p style={{ color: '#d4af37', fontWeight: 'bold' }}>
            Create New Deck
          </p>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

const EventsPage = () => (
  <PageContainer title="Events">
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
      <Card data-search-type="event">
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
          Weekly Championship
        </h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>
          Compete for mystical rewards
        </p>
        <p style={{ color: '#888' }}>Entry Fee: 100 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          Status: Open Registration
        </p>
      </Card>
      <Card delay={0.1} data-search-type="event">
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
          Elemental Masters
        </h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>
          Elite tournament for experienced players
        </p>
        <p style={{ color: '#888' }}>Entry Fee: 500 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          Status: Qualification Round
        </p>
      </Card>
      <Card delay={0.2} data-search-type="event">
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
          Beginner's Arena
        </h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>
          Perfect for new players
        </p>
        <p style={{ color: '#888' }}>Entry Fee: Free</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          Status: Always Open
        </p>
      </Card>
    </motion.div>
  </PageContainer>
);

// Play Page Component - MTG Arena Game
const PlayPage = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    >
      <HearthstoneBattlefield />
    </div>
  );
};

// Main App Component
const Phase3App = () => {
  // Initialize accessibility settings on app start
  useAccessibilitySettings();

  // App state
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // Initialize autonomous systems
  const autonomousSystems = useAdvancedAutonomous();

  // Initialize advanced healing
  useEffect(() => {
    // Enable silent mode for production
    healingConfigManager.enableSilentMode();

    // Register service worker for background healing
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/healing-worker.js')
        .then(registration => {
          console.info('[KONIVRER] Advanced healing service worker registered');
        })
        .catch(error => {
          // Silent failure - healing will work without service worker
        });
    }
  }, []);

  // Context value
  const contextValue = {
    user,
    setUser,
    decks,
    setDecks,
    bookmarks,
    setBookmarks,
    showLoginModal,
    setShowLoginModal,
    setShowGame,
  };

  return (
    <SelfHealingProvider silentMode={true}>
      <AdvancedSecurityProvider
        config={{
          enableRealTimeMonitoring: true,
          enablePredictiveSecurity: true,
          enableAutoHealing: true,
          enableSilentMode: process.env.NODE_ENV === 'production',
          maxThreatLevel: 'critical',
          autoBlockThreshold: 3,
          sessionTimeout: 30 * 60 * 1000, // 30 minutes
          encryptionLevel: 'advanced',
        }}
        showSecurityMonitor={process.env.NODE_ENV === 'development'}
      >
        <AppContainer>
          <ColorBlindFilters />
          <Router>
            <AppProvider>
              <MainNavigation />
            </AppProvider>
          </Router>
          <Analytics />
          <SpeedInsights />
          {/* Development tools disabled for MTG Arena experience
          {process.env.NODE_ENV === 'development' && (
            <>
              <ButtonTester />
              <SecurityTester />
            </>
          )}
          */}
        </AppContainer>

        {/* Game Container */}
        {showGame && (
          <LazyGameContainer
            onClose={() => setShowGame(false)}
            setShowGame={setShowGame}
          />
        )}
      </AdvancedSecurityProvider>
    </SelfHealingProvider>
  );
};

// Enhanced App with Advanced Self-Healing
const Phase3AppWithHealing = withAdvancedHealing(Phase3App, {
  silent: true,
  predictive: true,
  performanceMonitoring: true,
});

export default Phase3AppWithHealing;
