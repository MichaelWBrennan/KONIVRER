/**
 * KONIVRER Phase 3 App - Advanced Autonomous Systems (Target: ~500+ modules)
 * Building on Phase2App (393 modules) + advanced autonomous features
 */

import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import BlogSection from '../components/BlogSection';
import SyntaxAdvancedSearch from '../components/SyntaxAdvancedSearch';
import { KONIVRER_CARDS } from '../data/cards';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

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

// Sample blog data
const BLOG_POSTS: BlogPost[] = [
  { 
    id: 'b1', 
    title: 'Mastering Fire Decks', 
    content: 'Fire decks are all about speed and aggression. Focus on low-cost creatures and direct damage spells to overwhelm your opponents before they can establish their defenses. Key strategies include maintaining card advantage through efficient trades and timing your burst damage for maximum impact.', 
    author: 'CardMaster', 
    date: '2024-01-15', 
    tags: ['Strategy', 'Fire'] 
  },
  { 
    id: 'b2', 
    title: 'Event Report: Winter Championship', 
    content: 'Last weekend\'s championship was intense with over 200 participants competing for the mystical crown. The meta saw a surprising rise in water-control decks, with three making it to the top 8. The final match between ElementalMage and FrostWarden was a masterclass in strategic play.', 
    author: 'ProPlayer', 
    date: '2024-01-10', 
    tags: ['Events', 'Report'] 
  },
  { 
    id: 'b3', 
    title: 'New Card Reveals: Elemental Fusion', 
    content: 'Exciting new cards coming in the next expansion! The Elemental Fusion set introduces dual-element familiars and powerful combination spells. Preview includes the legendary Phoenix Drake and the game-changing Elemental Convergence spell that could reshape the meta.', 
    author: 'DevTeam', 
    date: '2024-01-05', 
    tags: ['News', 'Cards'] 
  },
  { 
    id: 'b4', 
    title: 'Deck Building Guide: Earth Control', 
    content: 'Earth decks excel at controlling the battlefield through defensive familiars and resource management. Learn how to build a competitive earth deck that can withstand aggressive strategies while setting up powerful late-game threats.', 
    author: 'StrategyGuru', 
    date: '2024-01-03', 
    tags: ['Strategy', 'Earth', 'Guide'] 
  }
];

// App Context for state management
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
}>({
  user: null, setUser: () => {}, decks: [], setDecks: () => {},
  bookmarks: [], setBookmarks: () => {}
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
    const isBuild = shouldSkipAutonomousSystems();
    if (isBuild || autonomousRef.current.initialized) return;

    console.log('[PHASE 3] Initializing advanced autonomous systems...');
    autonomousRef.current.initialized = true;

    // Initialize speed tracking and monitoring
    const initializeSpeedSystems = async () => {
      try {
        // Load speed tracking
        const speedTracking = await import('../utils/speedTracking');
        autonomousRef.current.speedTracking = speedTracking;
        
        if (speedTracking.trackCustomMetric) {
          speedTracking.trackCustomMetric('phase3_app_initialized', 1);
          console.log('[PHASE 3] ✅ Speed tracking initialized');
        }

        // Load speed monitor component
        try {
          const speedMonitorModule = await import('../components/SpeedMonitor');
          autonomousRef.current.speedMonitor = speedMonitorModule.default;
          console.log('[PHASE 3] ✅ Speed monitor component loaded');
        } catch (error) {
          console.warn('[PHASE 3] Speed monitor component failed (non-critical):', error);
        }

        // Advanced performance monitoring (every 45 seconds)
        const advancedPerformanceInterval = setInterval(() => {
          try {
            if (typeof window !== 'undefined' && window.performance) {
              const memory = (window.performance as any).memory;
              const navigation = window.performance.getEntriesByType('navigation')[0] as any;
              
              if (memory && speedTracking.trackCustomMetric) {
                const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const memoryLimit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
                speedTracking.trackCustomMetric('memory_usage_mb', memoryUsage);
                speedTracking.trackCustomMetric('memory_limit_mb', memoryLimit);
                
                if (navigation) {
                  speedTracking.trackCustomMetric('dom_content_loaded', navigation.domContentLoadedEventEnd);
                  speedTracking.trackCustomMetric('load_complete', navigation.loadEventEnd);
                }
                
                console.debug('[PHASE 3] Advanced metrics - Memory:', memoryUsage, 'MB, Limit:', memoryLimit, 'MB');
              }
            }
          } catch (error) {
            console.debug('[PHASE 3] Advanced performance monitoring error (non-critical):', error);
          }
        }, 45000); // Every 45 seconds

        autonomousRef.current.intervals.push(advancedPerformanceInterval);
        console.log('[PHASE 3] ✅ Advanced performance monitoring started');

      } catch (error) {
        console.warn('[PHASE 3] Speed systems failed (non-critical):', error);
      }
    };

    // Initialize autonomous core systems
    const initializeAutonomousCore = async () => {
      try {
        const autonomousCoreModule = await import('../automation/UltraAutonomousCore');
        autonomousRef.current.autonomousCore = autonomousCoreModule;
        console.log('[PHASE 3] ✅ Ultra autonomous core loaded');

        // Core system health monitoring (every 90 seconds)
        const coreHealthInterval = setInterval(() => {
          try {
            if (autonomousRef.current.speedTracking?.trackCustomMetric) {
              // Track system health metrics
              const systemHealth = {
                timestamp: Date.now(),
                memoryPressure: typeof window !== 'undefined' && (window.performance as any).memory ? 
                  Math.round(((window.performance as any).memory.usedJSHeapSize / (window.performance as any).memory.jsHeapSizeLimit) * 100) : 0,
                activeIntervals: autonomousRef.current.intervals.length,
                loadedModules: Object.keys(autonomousRef.current).filter(key => autonomousRef.current[key] !== null).length
              };

              autonomousRef.current.speedTracking.trackCustomMetric('system_health_score', 
                100 - Math.min(systemHealth.memoryPressure, 90));
              autonomousRef.current.speedTracking.trackCustomMetric('active_intervals', systemHealth.activeIntervals);
              autonomousRef.current.speedTracking.trackCustomMetric('loaded_modules', systemHealth.loadedModules);

              console.debug('[PHASE 3] System health:', systemHealth);
            }
          } catch (error) {
            console.debug('[PHASE 3] Core health monitoring error (non-critical):', error);
          }
        }, 90000); // Every 90 seconds

        autonomousRef.current.intervals.push(coreHealthInterval);
        console.log('[PHASE 3] ✅ Core health monitoring started');

      } catch (error) {
        console.warn('[PHASE 3] Autonomous core failed (non-critical):', error);
      }
    };

    // Initialize security systems
    const initializeSecuritySystems = async () => {
      try {
        const securityProviderModule = await import('../security/SecurityProvider');
        autonomousRef.current.securityProvider = securityProviderModule;
        console.log('[PHASE 3] ✅ Security provider loaded');

        // Advanced security monitoring (every 3 minutes)
        const advancedSecurityInterval = setInterval(() => {
          try {
            if (typeof window !== 'undefined') {
              // Advanced security checks
              const securityMetrics = {
                scriptCount: document.querySelectorAll('script').length,
                iframeCount: document.querySelectorAll('iframe').length,
                formCount: document.querySelectorAll('form').length,
                linkCount: document.querySelectorAll('a[href^="http"]').length,
                suspiciousPatterns: 0
              };

              // Check for suspicious patterns
              const suspiciousPatterns = ['eval(', 'document.write(', 'innerHTML =', 'outerHTML ='];
              const allScripts = document.querySelectorAll('script');
              
              allScripts.forEach(script => {
                if (script.textContent) {
                  suspiciousPatterns.forEach(pattern => {
                    if (script.textContent!.includes(pattern)) {
                      securityMetrics.suspiciousPatterns++;
                    }
                  });
                }
              });

              if (autonomousRef.current.speedTracking?.trackCustomMetric) {
                autonomousRef.current.speedTracking.trackCustomMetric('security_script_count', securityMetrics.scriptCount);
                autonomousRef.current.speedTracking.trackCustomMetric('security_iframe_count', securityMetrics.iframeCount);
                autonomousRef.current.speedTracking.trackCustomMetric('security_suspicious_patterns', securityMetrics.suspiciousPatterns);
              }

              if (securityMetrics.suspiciousPatterns > 0) {
                console.debug('[PHASE 3] Security alert: suspicious patterns detected:', securityMetrics.suspiciousPatterns);
              }

              console.debug('[PHASE 3] Security metrics:', securityMetrics);
            }
          } catch (error) {
            console.debug('[PHASE 3] Advanced security monitoring error (non-critical):', error);
          }
        }, 180000); // Every 3 minutes

        autonomousRef.current.intervals.push(advancedSecurityInterval);
        console.log('[PHASE 3] ✅ Advanced security monitoring started');

      } catch (error) {
        console.warn('[PHASE 3] Security systems failed (non-critical):', error);
      }
    };

    // Initialize optimization systems
    const initializeOptimizationSystems = async () => {
      try {
        // Resource optimization monitoring (every 2 minutes)
        const optimizationInterval = setInterval(() => {
          try {
            if (typeof window !== 'undefined') {
              // Check for optimization opportunities
              const optimizationMetrics = {
                imageCount: document.querySelectorAll('img').length,
                unoptimizedImages: 0,
                cssFiles: document.querySelectorAll('link[rel="stylesheet"]').length,
                jsFiles: document.querySelectorAll('script[src]').length,
                inlineStyles: document.querySelectorAll('[style]').length
              };

              // Check for unoptimized images
              const images = document.querySelectorAll('img');
              images.forEach(img => {
                if (img.src && !img.src.includes('webp') && !img.src.includes('avif')) {
                  optimizationMetrics.unoptimizedImages++;
                }
              });

              if (autonomousRef.current.speedTracking?.trackCustomMetric) {
                autonomousRef.current.speedTracking.trackCustomMetric('optimization_image_count', optimizationMetrics.imageCount);
                autonomousRef.current.speedTracking.trackCustomMetric('optimization_unoptimized_images', optimizationMetrics.unoptimizedImages);
                autonomousRef.current.speedTracking.trackCustomMetric('optimization_css_files', optimizationMetrics.cssFiles);
                autonomousRef.current.speedTracking.trackCustomMetric('optimization_js_files', optimizationMetrics.jsFiles);
              }

              console.debug('[PHASE 3] Optimization metrics:', optimizationMetrics);
            }
          } catch (error) {
            console.debug('[PHASE 3] Optimization monitoring error (non-critical):', error);
          }
        }, 120000); // Every 2 minutes

        autonomousRef.current.intervals.push(optimizationInterval);
        console.log('[PHASE 3] ✅ Optimization monitoring started');

      } catch (error) {
        console.warn('[PHASE 3] Optimization systems failed (non-critical):', error);
      }
    };

    // Initialize all systems asynchronously
    initializeSpeedSystems();
    initializeAutonomousCore();
    initializeSecuritySystems();
    initializeOptimizationSystems();

    // Cleanup function
    return () => {
      autonomousRef.current.intervals.forEach(interval => {
        clearInterval(interval);
      });
      autonomousRef.current.intervals = [];
      autonomousRef.current.initialized = false;
      console.log('[PHASE 3] Advanced autonomous systems cleaned up');
    };
  }, []);

  return autonomousRef.current;
};

// Enhanced styled components with framer-motion (same as Phase2)
const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
    color: 'white',
    fontFamily: 'OpenDyslexic, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  }}>
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
      {children}
    </div>
  </div>
);

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '15px 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Home link/logo - only clickable when not on home page */}
        <motion.div
          whileHover={!isHomePage ? { scale: 1.05 } : {}}
          whileTap={!isHomePage ? { scale: 0.95 } : {}}
        >
          {isHomePage ? (
            <div style={{
              color: '#d4af37',
              fontSize: '24px',
              fontWeight: 'bold',
              padding: '8px 16px'
            }}>
              🏠
            </div>
          ) : (
            <Link
              to="/"
              style={{
                color: '#d4af37',
                textDecoration: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              🏠
            </Link>
          )}
        </motion.div>

        {/* Navigation links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[
            { to: '/cards', label: 'Cards' },
            { to: '/decks', label: 'Decks' },
            { to: '/events', label: 'Events' },
            { to: '/play', label: 'Play' }
          ].map(({ to, label }) => (
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
                  background: location.pathname === to ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  border: location.pathname === to ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
          
          {/* Authentication section */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                color: '#d4af37',
                fontSize: '14px',
                padding: '6px 12px',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                Welcome, {user?.username}
                {user?.isPremium && <span style={{ color: '#ffd700', marginLeft: '5px' }}>★</span>}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                style={{
                  background: 'transparent',
                  color: '#ccc',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                style={{
                  color: location.pathname === '/login' ? '#d4af37' : '#ccc',
                  textDecoration: 'none',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: location.pathname === '/login' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  border: location.pathname === '/login' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
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

const PageContainer = ({ children, title }: { children: React.ReactNode; title?: string }) => (
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
        style={{ color: '#d4af37', marginBottom: '30px', fontSize: '36px', textAlign: 'center' }}
      >
        {title}
      </motion.h1>
    )}
    {children}
  </motion.div>
);

// Enhanced Page Components with framer-motion and blog system
const HomePage = () => {
  const features = [
    { title: 'Browse Cards', desc: 'Explore our mystical card collection', link: '/cards' },
    { title: 'Build Decks', desc: 'Create powerful deck combinations', link: '/decks' },
    { title: 'Join Events', desc: 'Compete in epic events and tournaments', link: '/events' },
    { title: 'Play Now', desc: 'Battle against other mystics', link: '/play' }
  ];

  const recentPosts = BLOG_POSTS.slice(0, 3); // Show 3 most recent posts

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'white' }}>Welcome to KONIVRER</h1>
        <p style={{ fontSize: '20px', color: '#ccc', maxWidth: '600px', margin: '0 auto' }}>
          The ultimate mystical trading card game. Build powerful decks, discover ancient strategies, and compete with players from across the realms.
        </p>
      </motion.div>

      {/* Features Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        {features.map(({ title, desc, link }, index) => (
          <Link key={title} to={link} style={{ textDecoration: 'none' }}>
            <Card delay={index * 0.1}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '24px' }}>{title}</h3>
                <p style={{ color: '#ccc' }}>{desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Blog Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ marginTop: '60px' }}
      >
        <h2 style={{ color: '#d4af37', fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>
          Latest Chronicles
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {recentPosts.map((post, index) => (
            <Card key={post.id} delay={0.5 + index * 0.1}>
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
  const { isAuthenticated, hasAdvancedFeatures } = useAuth();
  
  // Use the official KONIVRER card database (65 cards)
  const allCards: Card[] = KONIVRER_CARDS;

  // Start with empty search results - user must search to see cards
  const [searchResults, setSearchResults] = useState<Card[]>([]);

  const handleSearchResults = (results: Card[]) => {
    setSearchResults(results);
  };

  return (
    <PageContainer title="Mystical Card Database">
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#d4af37', margin: 0, fontSize: '14px' }}>
            🔒 <Link to="/login" style={{ color: '#d4af37', textDecoration: 'underline' }}>Login</Link> to unlock advanced search features, deck building tools, and premium card insights!
          </p>
        </motion.div>
      )}
      
      <SyntaxAdvancedSearch 
        cards={allCards} 
        onSearchResults={handleSearchResults}
        hasAdvancedFeatures={hasAdvancedFeatures}
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
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Mystic Masters</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Elite event for experienced players</p>
        <p style={{ color: '#888' }}>Entry Fee: 500 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: In Progress</p>
      </Card>
      <Card delay={0.2}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Elemental Fusion Preview</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Test the new expansion cards</p>
        <p style={{ color: '#888' }}>Entry Fee: Free</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: Coming Soon</p>
      </Card>
      <Card delay={0.3}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Rookie League</h3>
        <p style={{ color: '#ccc', marginBottom: '5px' }}>Perfect for new players</p>
        <p style={{ color: '#888' }}>Entry Fee: 50 gold</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Status: Open Registration</p>
      </Card>
    </motion.div>
  </PageContainer>
);

const PlayPage = () => {
  const gameModes = [
    { title: 'Quick Match', desc: 'Find an opponent and start playing immediately' },
    { title: 'Ranked Match', desc: 'Compete in ranked games to climb the mystical ladder' },
    { title: 'Practice Mode', desc: 'Practice against AI opponents' },
    { title: 'Friend Match', desc: 'Play against your mystical allies' }
  ];

  return (
    <PageContainer title="Play KONIVRER">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
      >
        {gameModes.map(({ title, desc }, index) => (
          <Card key={title} delay={index * 0.1}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>{title}</h3>
              <p style={{ color: '#ccc' }}>{desc}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </PageContainer>
  );
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/cards';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '500px', margin: '0 auto' }}
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
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>Enter the mystical realm</p>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Unlock advanced search features and deck building tools
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label style={{ color: '#d4af37', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div style={{
                color: '#ff6b6b',
                fontSize: '14px',
                textAlign: 'center',
                padding: '10px',
                background: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 107, 107, 0.3)'
              }}>
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || !username || !password}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              style={{
                background: isLoading || !username || !password ? '#666' : '#d4af37',
                color: '#0f0f0f',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: isLoading || !username || !password ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(212, 175, 55, 0.05)',
            borderRadius: '6px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <p style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Demo Login
            </p>
            <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.4' }}>
              Enter any username and password to access the demo account with advanced features.
            </p>
          </div>
        </Card>
      </motion.div>
    </PageContainer>
  );
};

// Main Phase 3 App Component
const Phase3App: React.FC = () => {
  console.log('[KONIVRER] Phase 3 app initializing... (Target: ~500+ modules)');
  
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([
    { id: 1, name: 'Fire Aggro', cards: ['1', '2'], description: 'Fast-paced fire deck' },
    { id: 2, name: 'Water Control', cards: ['3', '4'], description: 'Defensive water strategy' }
  ]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Use advanced autonomous systems hook
  const autonomousSystems = useAdvancedAutonomous();

  const contextValue = useMemo(() => ({
    user, setUser, decks, setDecks, bookmarks, setBookmarks
  }), [user, decks, bookmarks]);

  return (
    <AuthProvider>
      <AppContainer>
        <Router>
          <AppContext.Provider value={contextValue}>
            <Header />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/decks" element={<DecksPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </AnimatePresence>
          </AppContext.Provider>
        </Router>
        <Analytics />
        <SpeedInsights />
      </AppContainer>
    </AuthProvider>
  );
};

export default Phase3App;