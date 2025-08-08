import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedMTGInscryptionSimulator from './EnhancedMTGInscryptionSimulator';
import { HybridMapTheme } from './battlefield/HybridBattlefieldMap';
import './battlefield/HybridBattlefield.css';

interface HybridSimulatorDemoProps {
  className?: string;
}

const HybridSimulatorDemo: React.FC<HybridSimulatorDemoProps> = ({ className = '' }) => {
  const [currentDemo, setCurrentDemo] = useState<'intro' | 'simulator'>('intro');
  const [selectedTheme, setSelectedTheme] = useState<HybridMapTheme>('mysterious-cabin');
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    // Auto-advance to features after intro
    const timer = setTimeout(() => setShowFeatures(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const themes: Array<{ id: HybridMapTheme; name: string; description: string; atmosphere: string }> = [
    {
      id: 'mysterious-cabin',
      name: 'Mysterious Cabin',
      description: 'A candlelit room filled with ancient tomes and merchant scales. The perfect blend of intimacy and strategy.',
      atmosphere: 'Warm candlelight creates dancing shadows across weathered wood surfaces.'
    },
    {
      id: 'ancient-study',
      name: 'Ancient Study',
      description: 'Scrolls and wisdom totems guide your tactical decisions in this purple-hued sanctuary of knowledge.',
      atmosphere: 'Mystical energy flows through crystalline formations and ancient texts.'
    },
    {
      id: 'ritual-chamber',
      name: 'Ritual Chamber',
      description: 'Sacred braziers and stone guardians witness your card battles in this ceremonial space.',
      atmosphere: 'Ritual flames cast dramatic red light across carved stone and ceremonial implements.'
    },
    {
      id: 'traders-den',
      name: 'Trader\'s Den',
      description: 'Golden scales and ledgers of legendary exchanges create the perfect merchant\'s battleground.',
      atmosphere: 'Golden light gleams off precious metals and trading instruments.'
    }
  ];

  const features = [
    {
      icon: '🏠',
      title: 'Intimate Environments',
      description: 'Replace grand arenas with cozy, story-rich rooms inspired by Inscryption\'s cabin aesthetic.'
    },
    {
      icon: '🕯️',
      title: 'Environmental Storytelling',
      description: 'Interactive objects reveal lore and provide gameplay bonuses when clicked.'
    },
    {
      icon: '⚖️',
      title: 'Mystery Mechanics',
      description: 'Cards have hidden values and environmental interactions affect the balance of power.'
    },
    {
      icon: '🎭',
      title: 'Atmospheric Immersion',
      description: 'Dynamic lighting and atmospheric effects respond to your actions and card plays.'
    }
  ];

  if (currentDemo === 'intro') {
    return (
      <div className={`hybrid-simulator-demo ${className}`} style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, rgba(15, 8, 5, 1) 0%, rgba(0, 0, 0, 1) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '20px'
      }}>
        
        {/* Animated title */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '40px' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
              letterSpacing: '2px'
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 215, 0, 0.5)',
                '0 0 40px rgba(255, 165, 0, 0.8)',
                '0 0 30px rgba(255, 215, 0, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            HYBRID BATTLEFIELDS
          </motion.h1>
          <motion.p
            style={{
              fontSize: '1.2rem',
              color: '#bbb',
              maxWidth: '600px',
              margin: '0 auto',
              fontStyle: 'italic'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Where MTG Arena's strategic depth meets Inscryption's atmospheric storytelling
          </motion.p>
        </motion.div>

        {/* Feature showcase */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                maxWidth: '1000px',
                width: '100%',
                marginBottom: '40px'
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{feature.icon}</div>
                  <h3 style={{ color: '#FFD700', marginBottom: '10px', fontSize: '1.1rem' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme selector */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              style={{ textAlign: 'center', marginBottom: '30px' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h3 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '1.3rem' }}>
                Choose Your Battlefield Theme
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                maxWidth: '800px'
              }}>
                {themes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    style={{
                      background: selectedTheme === theme.id ? 
                        'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%)' :
                        'rgba(255, 255, 255, 0.05)',
                      border: selectedTheme === theme.id ? 
                        '2px solid #FFD700' : 
                        '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '15px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onClick={() => setSelectedTheme(theme.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 style={{ color: '#fff', marginBottom: '5px', fontSize: '1rem' }}>
                      {theme.name}
                    </h4>
                    <p style={{ color: '#bbb', fontSize: '0.8rem', lineHeight: '1.3', marginBottom: '8px' }}>
                      {theme.description}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      {theme.atmosphere}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start button */}
        <AnimatePresence>
          {showFeatures && (
            <motion.button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(102, 126, 234, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDemo('simulator')}
            >
              Enter the Battlefield
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating particles for atmosphere */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: '#FFD700',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`hybrid-simulator-demo ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative' }}
      >
        {/* Back button */}
        <motion.button
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 1001,
            backdropFilter: 'blur(8px)'
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentDemo('intro')}
        >
          ← Back to Demo
        </motion.button>

        <EnhancedMTGInscryptionSimulator
          initialTheme={selectedTheme}
          enableAtmosphericEffects={true}
          enableMysteryMechanics={true}
          className="demo-simulator"
        />
      </motion.div>
    </div>
  );
};

export default HybridSimulatorDemo;