import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import { SelfHealingProvider } from '../utils/selfHealingIntegration';
import { withAdvancedHealing } from '../utils/realTimeHealing';
import { healingConfigManager } from '../config/healingConfig';
import BlogSection from '../components/BlogSection';
import UnifiedCardSearch from '../components/UnifiedCardSearch';
import SimpleCardsPage from '../components/SimpleCardsPage';
import SimpleEnhancedLoginModal from '../components/SimpleEnhancedLoginModal';
import AccessibilityButton from '../components/AccessibilityButton';
import SkipToContent from '../components/SkipToContent';
import ColorBlindFilters from '../components/ColorBlindFilters';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';
import { KONIVRER_CARDS } from '../data/cards';
import ButtonTester from '../utils/buttonTester';
import SecurityTester from '../utils/securityTester';
import { AdvancedSecurityProvider, withAdvancedSecurity } from '../security/AdvancedSecuritySystem';
import OAuthCallback from '../components/OAuthCallback';
import { GameContainer } from '../game/components/GameContainer';

// Types
interface Card {
  id: string; name: string; cost: number; type: 'Familiar' | 'Flag';
  description: string; rarity: 'Common' | 'Uncommon' | 'Rare';
  elements: string[]; keywords: string[]; strength?: number; artist?: string;
}

interface Deck {
  id: number; name: string; cards: string[]; description: string;
}

interface User {
  id: string; username: string; email: string; level: number;
}

interface BlogPost {
  id: string; title: string; content: string; author: string; date: string; tags: string[];
}

// Blog data - will be loaded from API or CMS
const BLOG_POSTS: BlogPost[] = [];

// App Context for state management
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowGame: (show: boolean) => void;
}>({
  user: null, setUser: () => {}, decks: [], setDecks: () => {},
  bookmarks: [], setBookmarks: () => {}, showLoginModal: false, setShowLoginModal: () => {},
  setShowGame: () => {}
});

// Phase 3: Advanced Autonomous Systems Hook
const useAdvancedAutonomous = () => {
  const autonomousRef = useRef<{
    speedTracking: any;
    speedMonitor: any;
    autonomousCore: any;
    securityProvider: any;
    intervals: NodeJS.Timeout[];
    initialized: boolean;
  }>({
    speedTracking: null,
    speedMonitor: null,
    autonomousCore: null,
    securityProvider: null,
    intervals: [],
    initialized: false
  });

  useEffect(() => {
    // Skip autonomous systems in development or when explicitly disabled
    if (shouldSkipAutonomousSystems()) {
      console.log('[Autonomous] Skipping autonomous systems initialization in development mode');
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
            const elapsed = now - autonomousRef.current.speedTracking.lastTimestamp;
            autonomousRef.current.speedTracking.measurements.push({ label, elapsed });
            autonomousRef.current.speedTracking.lastTimestamp = now;
            return elapsed;
          },
          
          getAverages: () => {
            const measurements = autonomousRef.current.speedTracking.measurements;
            const labels = [...new Set(measurements.map((m: any) => m.label))];
            
            return labels.map(label => {
              const items = measurements.filter((m: any) => m.label === label);
              const total = items.reduce((sum: number, item: any) => sum + item.elapsed, 0);
              return {
                label,
                average: total / items.length,
                count: items.length
              };
            });
          }
        };
        
        // Speed monitor
        autonomousRef.current.speedMonitor = {
          thresholds: {
            critical: 500, // ms
            warning: 200 // ms
          },
          
          checkPerformance: () => {
            const averages = autonomousRef.current.speedTracking.getAverages();
            const issues = averages.filter((avg: any) => avg.average > autonomousRef.current.speedMonitor.thresholds.warning);
            
            if (issues.length > 0) {
              console.warn('[Autonomous] Performance issues detected:', issues);
              
              // Auto-optimization for critical issues
              const criticalIssues = issues.filter((issue: any) => 
                issue.average > autonomousRef.current.speedMonitor.thresholds.critical
              );
              
              if (criticalIssues.length > 0) {
                console.warn('[Autonomous] Critical performance issues detected, applying auto-optimization');
                // Apply optimization strategies
                autonomousRef.current.autonomousCore.optimize(criticalIssues);
              }
            }
          }
        };
        
        // Autonomous core
        autonomousRef.current.autonomousCore = {
          status: 'active',
          optimizationStrategies: {
            reduceAnimations: false,
            cacheHeavyComputations: true,
            throttleEvents: false
          },
          
          optimize: (issues: any[]) => {
            console.log('[Autonomous] Applying optimizations for:', issues.map((i: any) => i.label).join(', '));
            
            // Apply progressive optimization strategies
            if (!autonomousRef.current.autonomousCore.optimizationStrategies.throttleEvents) {
              console.log('[Autonomous] Enabling event throttling');
              autonomousRef.current.autonomousCore.optimizationStrategies.throttleEvents = true;
            } else if (!autonomousRef.current.autonomousCore.optimizationStrategies.reduceAnimations) {
              console.log('[Autonomous] Reducing animations');
              autonomousRef.current.autonomousCore.optimizationStrategies.reduceAnimations = true;
              // Apply to DOM
              document.body.classList.add('autonomous-reduced-motion');
            }
          },
          
          getStatus: () => {
            return {
              status: autonomousRef.current.autonomousCore.status,
              optimizations: autonomousRef.current.autonomousCore.optimizationStrategies
            };
          }
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
              /on\w+=/gi
            ];
            
            let sanitized = input;
            dangerousPatterns.forEach(pattern => {
              sanitized = sanitized.replace(pattern, '');
            });
            
            return sanitized;
          }
        };
        
        // Set up monitoring intervals
        const performanceInterval = setInterval(() => {
          autonomousRef.current.speedMonitor.checkPerformance();
        }, 30000); // Check every 30 seconds
        
        autonomousRef.current.intervals.push(performanceInterval);
        autonomousRef.current.initialized = true;
        
        console.log('[Autonomous] Advanced autonomous systems initialized successfully');
      }
    } catch (error) {
      console.error('[Autonomous] Failed to initialize autonomous systems:', error);
    }
    
    // Cleanup function
    return () => {
      if (autonomousRef.current.initialized) {
        console.log('[Autonomous] Cleaning up autonomous systems');
        autonomousRef.current.intervals.forEach(interval => clearInterval(interval));
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
const PageContainer = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div style={{ 
    padding: '20px 20px calc(50px + env(safe-area-inset-bottom, 20px))', 
    maxWidth: '1200px', 
    margin: '0 auto',
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  }}>
    {title && (
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: '#d4af37', marginBottom: '30px', textAlign: 'center', fontSize: '36px' }}
      >
        {title}
      </motion.h1>
    )}
    {children}
  </div>
);

// App Container Component
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--bg-color, #0f0f0f) 0%, #1a1a1a 50%, var(--bg-color, #0f0f0f) 100%)',
    color: 'var(--text-color, white)',
    fontFamily: 'var(--font-family, Arial, sans-serif)',
    position: 'relative',
    overflow: 'hidden'
  }}>
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
        background: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
    <div style={{ position: 'relative', zIndex: 2 }}>
      <main id="main-content">
        {children}
      </main>
    </div>
    <AccessibilityButton />
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
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
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
    { to: '#', label: user ? 'Profile' : 'Login', onClick: () => setShowLoginModal(true) }
  ];
  
  // Add Home button if not on the home page
  const navLinks: NavLink[] = location.pathname !== '/' 
    ? [{ to: '/', label: 'Home' }, ...baseNavLinks]
    : baseNavLinks;

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'fixed',
        bottom: 'env(safe-area-inset-bottom, 0px)', // Use safe area inset for iOS
        left: 0,
        right: 0,
        zIndex: 1001, // Higher z-index to ensure it's above everything
        background: 'linear-gradient(to top, rgba(20, 20, 20, 0.98), rgba(15, 15, 15, 0.95))',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(212, 175, 55, 0.4)',
        padding: '10px 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.7)',
        height: '60px', // Fixed height for the footer
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'transform', // Optimize for animations
      }}
    >
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '0 auto',
        padding: '0 10px',
        height: '100%'
      }}>
        {/* Navigation links in a single row with equal spacing */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '100%'
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
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
                      width: '100%'
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
                      background: location.pathname === to ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                      border: '1px solid transparent',
                      borderBottom: location.pathname === to ? '2px solid #d4af37' : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      minWidth: '0',
                      textAlign: 'center',
                      width: '100%'
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

const Card = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    whileHover={{
      scale: 1.02,
      boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
      borderColor: 'rgba(212, 175, 55, 0.5)'
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
      overflow: 'hidden'
    }}
  >
    {/* Subtle glow effect */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  </motion.div>
);

// Home Page Component
const HomePage = () => {
  // Recent blog posts
  const recentPosts = BLOG_POSTS.slice(0, 3);
  
  return (
    <PageContainer>
      {/* Blog Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '20px' }}
      >
        <h2 style={{ color: '#d4af37', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>
          Latest Chronicles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {recentPosts.map((post, index) => (
            <Card key={post.id} delay={index * 0.1}>
              <div>
                <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '20px' }}>{post.title}</h3>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ color: '#ccc', fontSize: '14px' }}>By {post.author}</span>
                  <span style={{ color: '#888', fontSize: '14px' }}>{post.date}</span>
                </div>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>
                  {post.content.substring(0, 150)}...
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: '#d4af37',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Read All Chronicles
          </motion.button>
        </div>
      </motion.div>
    </PageContainer>
  );
};

const CardsPage = () => {
  // Use the official KONIVRER card database (65 cards)
  const allCards: Card[] = KONIVRER_CARDS;

  // Start with empty search results - user must search to see cards
  const [searchResults, setSearchResults] = useState<Card[]>([]);

  const handleSearchResults = (results: { cards: Card[]; totalCount: number; searchTime: number }) => {
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
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}
      >
        {decks.map((deck, index) => (
          <Card key={deck.id} delay={index * 0.1}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{deck.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '5px' }}>{deck.description}</p>
            <p style={{ color: '#888' }}>{deck.cards.length} cards</p>
          </Card>
        ))}
        
        {/* Create New Deck Card */}
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)' }}
          onClick={() => {
            // Create new deck functionality
            const newDeck = {
              id: Date.now(),
              name: `New Deck ${Date.now()}`,
              cards: [],
              description: 'A new deck ready for customization'
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
            minHeight: '200px'
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const newDeck = {
                id: Date.now(),
                name: `New Deck ${Date.now()}`,
                cards: [],
                description: 'A new deck ready for customization'
              };
              console.log('Creating new deck:', newDeck);
              alert('Deck creation functionality would be implemented here!');
            }
          }}
          aria-label="Create new deck"
          data-action="create-deck"
          data-testid="create-deck-button"
        >
          <div style={{ fontSize: '40px', color: '#d4af37', marginBottom: '10px' }}>+</div>
          <p style={{ color: '#d4af37', fontWeight: 'bold' }}>Create New Deck</p>
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
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}
    >
      <Card>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Weekly Championship</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Compete for mystical rewards</p>
        <p style={{ color: '#888' }}>Entry Fee: 100 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: Open Registration</p>
      </Card>
      <Card delay={0.1}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Elemental Masters</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Elite tournament for experienced players</p>
        <p style={{ color: '#888' }}>Entry Fee: 500 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: Qualification Round</p>
      </Card>
      <Card delay={0.2}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Beginner's Arena</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Perfect for new players</p>
        <p style={{ color: '#888' }}>Entry Fee: Free</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: Always Open</p>
      </Card>
    </motion.div>
  </PageContainer>
);

const PlayPage = () => {
  const { user, setShowLoginModal, setShowGame } = useContext(AppContext);
  const [selectedGameMode, setSelectedGameMode] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const gameModes = [
    {
      id: 'practice',
      title: 'Practice Mode',
      description: 'Play against AI opponents to learn the game',
      icon: '',
      difficulty: 'Beginner Friendly',
      requiresAccount: false
    },
    {
      id: 'quick',
      title: 'Quick Match',
      description: 'Jump into a game with a random opponent',
      icon: '',
      difficulty: 'All Levels',
      requiresAccount: false
    },
    {
      id: 'ranked',
      title: 'Ranked Play',
      description: 'Compete for ranking points and seasonal rewards',
      icon: '',
      difficulty: 'Competitive',
      requiresAccount: false
    },
    {
      id: 'tournament',
      title: 'Tournament',
      description: 'Join structured tournaments with prizes',
      icon: '\u{1F451}',
      difficulty: 'Expert',
      requiresAccount: false
    }
  ];

  const startGame = (mode: string) => {
    setSelectedGameMode(mode);
    setGameStarted(true);
    
    // Show the integrated Phaser game
    setShowGame(true);
    
    // Reset the game started state after a brief delay
    setTimeout(() => {
      setGameStarted(false);
    }, 500);
  };

  if (gameStarted) {
    return (
      <PageContainer title="Launching Game...">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: '80px', 
              height: '80px', 
              border: '4px solid rgba(212, 175, 55, 0.3)',
              borderTop: '4px solid #d4af37',
              borderRadius: '50%',
              margin: '0 auto 20px'
            }}
          />
          <h2 style={{ color: '#d4af37', marginBottom: '10px' }}>
            Initializing {gameModes.find(m => m.id === selectedGameMode)?.title}...
          </h2>
          <p style={{ color: '#ccc' }}>Please wait while we prepare your mystical battlefield</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Play Card Game">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Account Benefits Banner */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '18px' }}>
               Play Instantly - No Account Required!
            </h3>
            <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px' }}>
              Jump right into the action! Having an account lets you save decks, track progress, and compete in ranked matches.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginModal(true)}
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#d4af37',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Create Account
            </motion.button>
            <motion.button
              onClick={() => {
                // Close the login modal
                setShowLoginModal(false);
                
                // Start the practice mode game directly
                startGame('practice');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: '1px solid #888',
                color: '#888',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Play as Guest
            </motion.button>
          </motion.div>
        )}

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '24px' }}>
            Choose Your Battle
          </h2>
          <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Select a game mode below and begin your mystical journey. Each mode offers unique challenges and rewards.
          </p>
        </motion.div>

        {/* Game Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px', 
            marginBottom: '40px' 
          }}
        >
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              data-game-mode={mode.id}
              data-testid={`game-mode-${mode.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)',
                borderColor: 'rgba(212, 175, 55, 0.6)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame(mode.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  startGame(mode.id);
                }
              }}
              aria-label={`Start ${mode.title} - ${mode.description}`}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 42, 42, 0.8) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '60px',
                opacity: 0.1,
                color: '#d4af37',
                lineHeight: 1,
                transform: 'translate(20px, -10px)'
              }}>
                {mode.icon}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '24px', marginRight: '10px' }}>{mode.icon}</span>
                  <h3 style={{ color: '#d4af37', margin: 0, fontSize: '18px' }}>{mode.title}</h3>
                </div>
                
                <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px', lineHeight: 1.5 }}>
                  {mode.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    color: '#888', 
                    fontSize: '12px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {mode.difficulty}
                  </span>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    style={{ color: '#d4af37', fontSize: '18px' }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>New to KONIVRER?</h3>
          <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>
            Start with Practice Mode to learn the basics, then challenge other players in Quick Match!
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame('practice')}
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                color: '#d4af37',
                padding: '12px 25px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
               Start Tutorial
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame('quick')}
              style={{
                background: 'transparent',
                border: '2px solid rgba(212, 175, 55, 0.3)',
                color: '#d4af37',
                padding: '12px 25px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
               Quick Match
            </motion.button>
          </div>
        </motion.div>

        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ marginTop: '40px', textAlign: 'center' }}
        >
          <h4 style={{ color: '#d4af37', marginBottom: '20px' }}>Game Features</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            fontSize: '14px'
          }}>
            <div style={{ color: '#ccc' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎴</div>
              <strong style={{ color: '#d4af37' }}>65 Unique Cards</strong>
              <br />Familiars and Flags with elemental powers
            </div>
            <div style={{ color: '#ccc' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚔</div>
              <strong style={{ color: '#d4af37' }}>Strategic Combat</strong>
              <br />Deep tactical gameplay mechanics
            </div>
            <div style={{ color: '#ccc' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🏗</div>
              <strong style={{ color: '#d4af37' }}>Deck Building</strong>
              <br />Create custom decks {user ? 'and save them' : '(save with account)'}
            </div>
            <div style={{ color: '#ccc' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}></div>
              <strong style={{ color: '#d4af37' }}>Progression</strong>
              <br />Unlock rewards {user ? 'and track stats' : '(track with account)'}
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
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
      navigator.serviceWorker.register('/healing-worker.js')
        .then((registration) => {
          console.info('[KONIVRER] Advanced healing service worker registered');
        })
        .catch((error) => {
          // Silent failure - healing will work without service worker
        });
    }
  }, []);
  
  // Context value
  const contextValue = {
    user, setUser,
    decks, setDecks,
    bookmarks, setBookmarks,
    showLoginModal, setShowLoginModal,
    setShowGame
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
          encryptionLevel: 'advanced'
        }}
        showSecurityMonitor={process.env.NODE_ENV === 'development'}
      >
        <AppContainer>
          <ColorBlindFilters />
          <Router>
            <AppContext.Provider value={contextValue}>
              <LoginModal />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cards" element={<SimpleCardsPage />} />
                  <Route path="/decks" element={<DecksPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/play" element={<PlayPage />} />
                  <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
                </Routes>
              </AnimatePresence>
              <Footer />
            </AppContext.Provider>
          </Router>
          <Analytics />
          <SpeedInsights />
          {process.env.NODE_ENV === 'development' && (
            <>
              <ButtonTester />
              <SecurityTester />
            </>
          )}
        </AppContainer>
        
        {/* Game Container */}
        {showGame && (
          <GameContainer onClose={() => setShowGame(false)} />
        )}
      </AdvancedSecurityProvider>
    </SelfHealingProvider>
  );
};

// Enhanced App with Advanced Self-Healing
const Phase3AppWithHealing = withAdvancedHealing(Phase3App, {
  silent: true,
  predictive: true,
  performanceMonitoring: true
});

export default Phase3AppWithHealing;