import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';
import BlogSection from '../components/BlogSection';
import SyntaxAdvancedSearch from '../components/SyntaxAdvancedSearch';
import AdvancedLoginModal from '../components/AdvancedLoginModal';
import AccessibilityButton from '../components/AccessibilityButton';
import SkipToContent from '../components/SkipToContent';
import { KONIVRER_CARDS } from '../data/cards';

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
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}>({
  user: null, setUser: () => {}, decks: [], setDecks: () => {},
  bookmarks: [], setBookmarks: () => {}, showLoginModal: false, setShowLoginModal: () => {}
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
const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, setUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (username && password) {
      // Simulate login
      setUser({
        id: 'u1',
        username,
        email: `${username}@example.com`,
        level: 1
      });
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Please enter both username and password');
    }
  };
  
  if (!showLoginModal) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
      onClick={() => setShowLoginModal(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          borderRadius: '12px',
          padding: '30px',
          width: '90%',
          maxWidth: '400px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ color: '#d4af37', marginBottom: '20px', textAlign: 'center' }}>Login to KONIVRER</h2>
        
        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            background: 'rgba(255, 107, 107, 0.1)', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#ccc', display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Enter your username"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ccc', display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Enter your password"
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#ccc',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => setShowLoginModal(false)}
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#d4af37',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={handleLogin}
          >
            Login
          </motion.button>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a 
            href="#" 
            style={{ color: '#d4af37', fontSize: '14px', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset functionality coming soon!');
            }}
          >
            Forgot your password?
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Page Container Component
const PageContainer = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div style={{ padding: '80px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
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

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { setShowLoginModal } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect device type based on user agent and screen size
  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;

      // Check if mobile device based on user agent
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);

      // Check if tablet based on user agent and screen size
      const isTabletDevice = /ipad|android/i.test(userAgent) && !/mobile/i.test(userAgent) ||
                            (width >= 768 && width <= 1024);

      setIsMobile(isMobileDevice || width < 768);
      setIsTablet(isTabletDevice || (width >= 768 && width <= 1024));
    };

    // Initial check
    checkDeviceType();

    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);
  
  // Navigation links with types
  interface NavLink {
    to: string;
    label: string;
    onClick?: () => void;
  }
  
  const navLinks: NavLink[] = [
    { to: '/cards', label: 'Cards' },
    { to: '/decks', label: 'Decks' },
    { to: '/events', label: 'Events' },
    { to: '/play', label: 'Play' },
    { to: '#', label: 'Login', onClick: () => setShowLoginModal(true) }
  ];
  
  // Mobile menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.98), rgba(15, 15, 15, 0.95))',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
        padding: '0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
      }}
    >
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '60px'
      }}>
        {/* Home link/logo - only clickable when not on home page */}
        <motion.div
          whileHover={!isHomePage ? { scale: 1.05 } : {}}
          whileTap={!isHomePage ? { scale: 0.95 } : {}}
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isHomePage ? (
            <div style={{
              color: '#d4af37',
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: 'bold',
              padding: '0 16px',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              KONIVRER
            </div>
          ) : (
            <Link
              to="/"
              style={{
                color: '#d4af37',
                textDecoration: 'none',
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: 'bold',
                padding: '0 16px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              KONIVRER
            </Link>
          )}
        </motion.div>

        {/* Mobile menu button */}
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d4af37',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </motion.button>
        )}

        {/* Desktop/Tablet Navigation links */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            gap: isTablet ? '8px' : '15px',
            alignItems: 'center',
            height: '100%'
          }}>
            {navLinks.map(({ to, label, onClick }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {onClick ? (
                  <button
                    onClick={onClick}
                    style={{
                      color: '#d4af37',
                      textDecoration: 'none',
                      fontSize: isTablet ? '16px' : '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      padding: isTablet ? '0 10px' : '0 16px',
                      borderRadius: '4px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: 'none',
                      borderBottom: '3px solid #d4af37',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
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
                      fontSize: isTablet ? '16px' : '18px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      padding: isTablet ? '0 10px' : '0 16px',
                      borderRadius: '4px',
                      background: location.pathname === to ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                      borderBottom: location.pathname === to ? '3px solid #d4af37' : '3px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Mobile menu overlay */}
        {isMobile && (
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '60px',
                  left: 0,
                  right: 0,
                  background: 'rgba(15, 15, 15, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 0',
                  zIndex: 1000
                }}
              >
                {navLinks.map(({ to, label, onClick }) => (
                  <motion.div
                    key={to}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      margin: '8px 0'
                    }}
                  >
                    {onClick ? (
                      <button
                        onClick={() => {
                          onClick();
                          setMenuOpen(false);
                        }}
                        style={{
                          color: '#d4af37',
                          textDecoration: 'none',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          display: 'block',
                          width: '100%',
                          padding: '12px 0',
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: 'none',
                          borderLeft: '4px solid #d4af37',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          color: location.pathname === to ? '#d4af37' : '#ccc',
                          textDecoration: 'none',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          display: 'block',
                          padding: '12px 0',
                          background: location.pathname === to ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                          borderLeft: location.pathname === to ? '4px solid #d4af37' : '4px solid transparent',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
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

// Home Page Component
const HomePage = () => {
  // Featured content
  const features = [
    { title: 'Explore Cards', desc: 'Discover powerful cards from all elements', link: '/cards' },
    { title: 'Build Decks', desc: 'Create and share your strategic masterpieces', link: '/decks' },
    { title: 'Join Events', desc: 'Compete with players from around the world', link: '/events' },
    { title: 'Play Now', desc: 'Test your skills in the mystical arena', link: '/play' }
  ];
  
  // Recent blog posts
  const recentPosts = BLOG_POSTS.slice(0, 3);
  
  return (
    <PageContainer>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
  // Use the official KONIVRER card database (65 cards)
  const allCards: Card[] = KONIVRER_CARDS;

  // Start with empty search results - user must search to see cards
  const [searchResults, setSearchResults] = useState<Card[]>([]);

  const handleSearchResults = (results: Card[]) => {
    setSearchResults(results);
  };

  return (
    <PageContainer title="Mystical Card Database">
      <SyntaxAdvancedSearch cards={allCards} onSearchResults={handleSearchResults} />
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

const PlayPage = () => (
  <PageContainer title="Play KONIVRER">
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ color: '#ccc', marginBottom: '30px', fontSize: '18px' }}
      >
        Choose your preferred play mode below and begin your mystical journey.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}
      >
        <Card>
          <h3 style={{ color: '#d4af37', marginBottom: '15px', textAlign: 'center' }}>Quick Match</h3>
          <p style={{ color: '#ccc', textAlign: 'center' }}>Jump into a game with a random opponent</p>
        </Card>
        <Card delay={0.1}>
          <h3 style={{ color: '#d4af37', marginBottom: '15px', textAlign: 'center' }}>Ranked Play</h3>
          <p style={{ color: '#ccc', textAlign: 'center' }}>Compete for ranking points and seasonal rewards</p>
        </Card>
        <Card delay={0.2}>
          <h3 style={{ color: '#d4af37', marginBottom: '15px', textAlign: 'center' }}>Practice Mode</h3>
          <p style={{ color: '#ccc', textAlign: 'center' }}>Play against AI opponents to hone your skills</p>
        </Card>
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.5)',
          color: '#d4af37',
          padding: '15px 40px',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Launch Game Client
      </motion.button>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ color: '#888', marginTop: '20px', fontSize: '14px' }}
      >
        Game client requires download. Minimum specs: 4GB RAM, 2GHz processor.
      </motion.p>
    </div>
  </PageContainer>
);

// Main App Component
const Phase3App = () => {
  // App state
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([
    { id: 1, name: 'Fire Aggro', cards: ['c1', 'c2', 'c3', 'c4', 'c5'], description: 'Fast-paced aggressive fire deck' },
    { id: 2, name: 'Water Control', cards: ['c6', 'c7', 'c8', 'c9'], description: 'Defensive water control strategy' },
    { id: 3, name: 'Earth Midrange', cards: ['c10', 'c11', 'c12', 'c13', 'c14', 'c15'], description: 'Balanced earth deck with strong midgame' }
  ]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Initialize autonomous systems
  const autonomousSystems = useAdvancedAutonomous();
  
  // Context value
  const contextValue = {
    user, setUser,
    decks, setDecks,
    bookmarks, setBookmarks,
    showLoginModal, setShowLoginModal
  };
  
  return (
    <AppContainer>
      <Router>
        <AppContext.Provider value={contextValue}>
          <Header />
          <LoginModal />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/play" element={<PlayPage />} />
            </Routes>
          </AnimatePresence>
        </AppContext.Provider>
      </Router>
      <Analytics />
      <SpeedInsights />
    </AppContainer>
  );
};

export default Phase3App;