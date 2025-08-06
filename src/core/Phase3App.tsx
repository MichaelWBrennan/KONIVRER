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

// Main App Component
const Phase3App = () => {
  // Initialize accessibility settings on app start
  useAccessibilitySettings();

  // App state
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
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

    // Load saved data from localStorage
    const savedUser = localStorage.getItem('konivrer_user');
    const savedDecks = localStorage.getItem('konivrer_decks');
    const savedPublicDecks = localStorage.getItem('konivrer_public_decks');
    const savedCurrentDeck = localStorage.getItem('konivrer_current_deck');
    const savedBookmarks = localStorage.getItem('konivrer_bookmarks');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }

    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (error) {
        console.error('Error parsing saved decks:', error);
      }
    }

    if (savedPublicDecks) {
      try {
        setPublicDecks(JSON.parse(savedPublicDecks));
      } catch (error) {
        console.error('Error parsing saved public decks:', error);
      }
    }

    if (savedCurrentDeck) {
      try {
        setCurrentDeck(JSON.parse(savedCurrentDeck));
      } catch (error) {
        console.error('Error parsing saved current deck:', error);
      }
    }

    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error parsing saved bookmarks:', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('konivrer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('konivrer_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('konivrer_decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('konivrer_public_decks', JSON.stringify(publicDecks));
  }, [publicDecks]);

  useEffect(() => {
    if (currentDeck) {
      localStorage.setItem(
        'konivrer_current_deck',
        JSON.stringify(currentDeck),
      );
    } else {
      localStorage.removeItem('konivrer_current_deck');
    }
  }, [currentDeck]);

  useEffect(() => {
    localStorage.setItem('konivrer_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // App context functions
  const addCardToDeck = (cardId: string, deckId?: string) => {
    const targetDeckId = deckId || currentDeck?.id;
    if (!targetDeckId) return;

    if (targetDeckId === currentDeck?.id && currentDeck) {
      const existingCard = currentDeck.cards.find(dc => dc.cardId === cardId);
      const updatedCards = existingCard
        ? currentDeck.cards.map(dc =>
            dc.cardId === cardId ? { ...dc, quantity: dc.quantity + 1 } : dc,
          )
        : [...currentDeck.cards, { cardId, quantity: 1 }];

      const updatedDeck = {
        ...currentDeck,
        cards: updatedCards,
        updatedAt: new Date(),
      };

      setCurrentDeck(updatedDeck);
      setDecks(prev =>
        prev.map(deck => (deck.id === targetDeckId ? updatedDeck : deck)),
      );
    }
  };

  const createDeck = (
    name: string,
    description: string,
    isPublic: boolean,
  ): Deck => {
    if (!user) {
      throw new Error('User must be logged in to create a deck');
    }

    const newDeck: Deck = {
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      cards: [],
      authorId: user.id,
      authorUsername: user.username,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      format: 'Standard',
    };

    setDecks(prev => [...prev, newDeck]);

    if (isPublic) {
      setPublicDecks(prev => [...prev, newDeck]);
    }

    return newDeck;
  };

  const publishDeck = (deckId: string, isPublic: boolean) => {
    setDecks(prev =>
      prev.map(deck =>
        deck.id === deckId
          ? { ...deck, isPublic, updatedAt: new Date() }
          : deck,
      ),
    );

    if (currentDeck?.id === deckId) {
      setCurrentDeck(prev =>
        prev ? { ...prev, isPublic, updatedAt: new Date() } : null,
      );
    }

    const deck = decks.find(d => d.id === deckId) || currentDeck;
    if (deck) {
      if (isPublic) {
        setPublicDecks(prev => {
          const exists = prev.some(d => d.id === deckId);
          if (!exists) {
            return [
              ...prev,
              { ...deck, isPublic: true, updatedAt: new Date() },
            ];
          }
          return prev.map(d =>
            d.id === deckId
              ? { ...d, isPublic: true, updatedAt: new Date() }
              : d,
          );
        });
      } else {
        setPublicDecks(prev => prev.filter(d => d.id !== deckId));
      }
    }
  };

  const importDeck = (deck: Deck) => {
    if (!user) return;

    const importedDeck: Deck = {
      ...deck,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: user.id,
      authorUsername: user.username,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: `${deck.name} (Imported)`,
    };

    setDecks(prev => [...prev, importedDeck]);
    setCurrentDeck(importedDeck);
  };

  // Context value
  const contextValue = {
    user,
    setUser,
    decks,
    setDecks,
    publicDecks,
    setPublicDecks,
    currentDeck,
    setCurrentDeck,
    bookmarks,
    setBookmarks,
    showLoginModal,
    setShowLoginModal,
    setShowGame,
    addCardToDeck,
    createDeck,
    publishDeck,
    importDeck,
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
        <AppContext.Provider value={contextValue}>
          <AppContainer>
            <SkipToContent />
            <ColorBlindFilters />
            <MainNavigation />
            <Analytics />
            <SpeedInsights />
            {/* Development tools disabled for production experience
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
        </AppContext.Provider>
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
